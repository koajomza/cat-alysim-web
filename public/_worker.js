const PRICE_AMOUNT = 500000;
const PRICE_CURRENCY = "thb";
const PRODUCT_NAME = "CAT-ALYSIM Full License";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getOrigin(request, env) {
  return env.PUBLIC_SITE_URL || new URL(request.url).origin;
}

function requireEnv(env, keys) {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length) {
    return `Missing server env: ${missing.join(", ")}`;
  }
  return "";
}

async function readSupabaseUser(request, env) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.toLowerCase().startsWith("bearer ")) {
    return { error: "กรุณาเข้าสู่ระบบก่อนชำระเงิน", status: 401 };
  }
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: auth,
    },
  });
  if (!res.ok) {
    return { error: "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่", status: 401 };
  }
  const user = await res.json();
  if (!user?.id) return { error: "ไม่พบบัญชีผู้ใช้", status: 401 };
  return { user };
}

async function createCheckoutSession(request, env) {
  const missing = requireEnv(env, ["STRIPE_SECRET_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  if (missing) return json({ error: missing }, 500);

  const { user, error, status } = await readSupabaseUser(request, env);
  if (error) return json({ error }, status);

  const origin = getOrigin(request, env);
  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("success_url", `${origin}/payment/?payment=success&session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${origin}/payment/?payment=cancel`);
  form.set("client_reference_id", user.id);
  if (user.email) form.set("customer_email", user.email);
  form.set("payment_method_types[0]", "promptpay");
  form.set("line_items[0][price_data][currency]", PRICE_CURRENCY);
  form.set("line_items[0][price_data][unit_amount]", String(PRICE_AMOUNT));
  form.set("line_items[0][price_data][product_data][name]", PRODUCT_NAME);
  form.set("line_items[0][quantity]", "1");
  form.set("metadata[user_id]", user.id);
  form.set("metadata[product]", "cat_alysim_full_license");
  form.set("payment_intent_data[metadata][user_id]", user.id);
  form.set("payment_intent_data[metadata][product]", "cat_alysim_full_license");

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    return json({ error: session?.error?.message || "สร้างหน้าชำระเงินไม่สำเร็จ" }, 502);
  }
  return json({ id: session.id, url: session.url });
}

function hex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

async function verifyStripeSignature(rawBody, signature, secret) {
  const parts = Object.fromEntries(signature.split(",").map((part) => part.split("=", 2)));
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signedPayload = `${timestamp}.${rawBody}`;
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  return timingSafeEqual(hex(digest), expected);
}

async function supabaseUpsertPayment(env, session) {
  const payment = {
    user_id: session.metadata?.user_id || session.client_reference_id,
    provider: "stripe",
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent || null,
    amount: session.amount_total,
    currency: session.currency,
    status: session.payment_status === "paid" ? "paid" : session.payment_status,
    metadata: session,
    paid_at: new Date().toISOString(),
  };
  await fetch(`${env.SUPABASE_URL}/rest/v1/payments?on_conflict=stripe_session_id`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payment),
  });
}

async function activateLicense(env, userId, session) {
  await supabaseUpsertPayment(env, session).catch(() => undefined);
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      is_approved: true,
      approved: true,
      is_trial: false,
      status: "active",
      paid_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function handleWebhook(request, env) {
  const missing = requireEnv(env, ["STRIPE_WEBHOOK_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
  if (missing) return json({ error: missing }, 500);

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const valid = await verifyStripeSignature(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return json({ error: "Invalid Stripe signature" }, 400);

  const event = JSON.parse(rawBody);
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object || {};
    const userId = session.metadata?.user_id || session.client_reference_id;
    if (session.payment_status === "paid" && session.amount_total === PRICE_AMOUNT && session.currency === PRICE_CURRENCY && userId) {
      await activateLicense(env, userId, session);
    }
  }
  return json({ received: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204 });
    if (url.pathname === "/api/payments/create-checkout-session" && request.method === "POST") {
      return createCheckoutSession(request, env);
    }
    if (url.pathname === "/api/stripe/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
