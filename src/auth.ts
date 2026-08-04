import {createClient,type Session,type SupabaseClient} from '@supabase/supabase-js';
import type {Profile} from './types';
import {apiUrl} from './apiClient';

export type AuthStatus={auth_required:boolean;mode:'disabled'|'token'|'supabase';message:string;signup_enabled?:boolean};
export type LicenseState={allowed:boolean;reason?:string;license_type?:'trial'|'paid'|'admin'|'disabled'|string;expires_at?:string|null;role?:string|null;profile?:Record<string,unknown>|null};
export type AuthContext={access_token:string;refresh_token?:string;user:{id:string;email?:string|null};profile?:Record<string,unknown>|null;license?:LicenseState};

const TOKEN_KEY='cat_alysim_trial_token';
const CONTEXT_KEY='cat_alysim_auth_context';
const DEVICE_KEY='cat_alysim_web_device_id';
const TRIAL_PROFILE_PREFIX='cat_alysim_drugs_profile:';

const supabaseUrl=import.meta.env.VITE_SUPABASE_URL||'';
const supabaseAnonKey=import.meta.env.VITE_SUPABASE_ANON_KEY||'';
let supabaseClient:SupabaseClient|null=null;

export class AuthFlowError extends Error{
 reason:string;
 constructor(reason:string,message:string){super(message);this.reason=reason}
}

export function hasSupabaseAuth(){return Boolean(supabaseUrl&&supabaseAnonKey)}
export function getSupabase(){if(!hasSupabaseAuth())throw new Error('ยังไม่ได้ตั้งค่า Supabase สำหรับเว็บ');if(!supabaseClient)supabaseClient=createClient(supabaseUrl,supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return supabaseClient}
export function getDeviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,id)}return id}
export const getTrialToken=()=>localStorage.getItem(TOKEN_KEY)||'';
export const saveTrialToken=(token:string)=>localStorage.setItem(TOKEN_KEY,token);
export const getAuthContext=():AuthContext|null=>{try{return JSON.parse(localStorage.getItem(CONTEXT_KEY)||'null')}catch{return null}};
function saveAuthContext(ctx:AuthContext){saveTrialToken(ctx.access_token);localStorage.setItem(CONTEXT_KEY,JSON.stringify(ctx))}
export function getAuthHeaders(extra:Record<string,string>={}){const token=getTrialToken();return token?{...extra,Authorization:`Bearer ${token}`,'X-CAT-Device-Id':getDeviceId()}:{...extra,'X-CAT-Device-Id':getDeviceId()}}

async function sha256(text:string){const bytes=new TextEncoder().encode(text);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function authMessage(reason:string){const map:Record<string,string>={trial_required:'กรุณายืนยัน Serial ทดลองใช้งานจากอีเมลก่อนเข้าใช้งาน',trial_expired:'สิทธิ์ทดลองใช้งานหมดอายุแล้ว กรุณาใส่ Serial แบบชำระเงิน',device_locked:'บัญชีนี้ถูกล็อกกับอุปกรณ์อื่น กรุณาติดต่อผู้ดูแล',account_disabled:'บัญชีนี้ถูกปิดการใช้งาน',email_unverified:'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'};return map[reason]||'ยังไม่สามารถอนุญาตให้เข้าใช้งานได้'}
function normalizeProfile(profile:Record<string,unknown>|null|undefined){return profile||null}

export async function getAuthStatus():Promise<AuthStatus>{
 if(hasSupabaseAuth())return {auth_required:true,mode:'supabase',signup_enabled:true,message:'Supabase Auth + CAT-ALYSIM license gate'};
 const r=await fetch(apiUrl('/api/auth/status'));
 if(!r.ok)throw new Error('ตรวจสอบสถานะระบบยืนยันตัวตนไม่สำเร็จ');
 return r.json();
}

async function resolveLoginEmail(client:SupabaseClient,login:string){
 const value=login.trim().toLowerCase();
 if(value.includes('@'))return value;
 const fn=await client.functions.invoke('resolve-login',{body:{login:value}});
 if(!fn.error&&fn.data?.email)return String(fn.data.email);
 const rpc=await client.rpc('resolve_login_email',{username:value});
 if(rpc.error)throw new AuthFlowError('bad_login','ไม่พบชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
 return String(rpc.data||'');
}

async function authorizeSession(session:Session){
 const client=getSupabase();
 const uid=session.user.id;
 const deviceId=getDeviceId();
 const deviceHash=await sha256(`${uid}:${deviceId}`);
 const {data,error}=await client.rpc('get_login_authorization',{p_machine_guid:`web:${deviceId}`,p_device_hash:deviceHash});
 if(error)throw new Error(error.message||'ตรวจสอบสิทธิ์ไม่สำเร็จ');
 const license=(data||{}) as LicenseState;
 const ctx:AuthContext={access_token:session.access_token,refresh_token:session.refresh_token,user:{id:uid,email:session.user.email},profile:normalizeProfile(license.profile),license};
 if(!license.allowed)throw new AuthFlowError(license.reason||'not_allowed',authMessage(license.reason||'not_allowed'));
 saveAuthContext(ctx);
 return ctx;
}

export async function getCurrentUser(){
 if(hasSupabaseAuth()){
  const {data}=await getSupabase().auth.getSession();
  if(!data.session)return null;
  try{return await authorizeSession(data.session)}catch{return null}
 }
 return getTrialToken()?getAuthContext():null;
}

export async function loginTrial(login:string,password:string){
 if(hasSupabaseAuth()){
  const client=getSupabase();
  const email=await resolveLoginEmail(client,login);
  const {data,error}=await client.auth.signInWithPassword({email,password});
  if(error||!data.session)throw new AuthFlowError('bad_login','ไม่พบชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  return authorizeSession(data.session);
 }
 const r=await fetch(apiUrl('/api/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:login,password})});
 if(!r.ok)throw new Error(await r.text()||'เข้าสู่ระบบไม่สำเร็จ');
 const data=await r.json();
 saveTrialToken(data.access_token);
 saveAuthContext({access_token:data.access_token,user:{id:'legacy',email:login},license:{allowed:true,license_type:'trial'}});
 return getAuthContext();
}

function validateSignup(username:string,email:string,password:string,confirm:string,accepted:boolean){
 const issues:string[]=[];
 if(!/^[a-z0-9_]{3,32}$/.test(username))issues.push('ชื่อผู้ใช้ต้องเป็น a-z, 0-9 หรือ _ ความยาว 3-32 ตัว');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))issues.push('รูปแบบอีเมลไม่ถูกต้อง');
 if(password.length<10)issues.push('รหัสผ่านต้องมีอย่างน้อย 10 ตัวอักษร');
 if(!/[a-z]/.test(password)||!/[A-Z]/.test(password)||!/\d/.test(password)||!/[^A-Za-z0-9]/.test(password))issues.push('รหัสผ่านต้องมีตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และสัญลักษณ์');
 if(password!==confirm)issues.push('รหัสผ่านยืนยันไม่ตรงกัน');
 if(!accepted)issues.push('กรุณายอมรับเงื่อนไขการใช้งาน');
 if(issues.length)throw new Error(issues.join('\n'));
}

export async function signupTrial(username:string,email:string,password:string,confirm:string,accepted:boolean){
 validateSignup(username.trim().toLowerCase(),email.trim().toLowerCase(),password,confirm,accepted);
 if(!hasSupabaseAuth())throw new Error('ระบบสมัครสมาชิกต้องใช้ Supabase Auth');
 const redirectTo=`${window.location.origin}/trial/drugs/`;
 const {error}=await getSupabase().auth.signUp({email:email.trim().toLowerCase(),password,options:{emailRedirectTo:redirectTo,data:{username:username.trim().toLowerCase()}}});
 if(error)throw new Error(error.message);
 return 'สมัครสำเร็จแล้ว กรุณาตรวจอีเมลเพื่อยืนยันบัญชีและรับ Serial ทดลองใช้งาน';
}

export async function verifyTrialSerial(serial:string){
 const client=getSupabase();
 const {error}=await client.rpc('verify_trial_serial',{p_serial:serial.trim()});
 if(error)throw new Error(error.message||'ยืนยัน Serial ทดลองใช้งานไม่สำเร็จ');
 const {data}=await client.auth.getSession();
 if(!data.session)throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');
 return authorizeSession(data.session);
}

export async function verifyPaidSerial(serial:string){
 const client=getSupabase();
 const {error}=await client.rpc('verify_paid_serial',{p_serial:serial.trim()});
 if(error)throw new Error(error.message||'ยืนยัน Serial ไม่สำเร็จ');
 const {data}=await client.auth.getSession();
 if(!data.session)throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');
 return authorizeSession(data.session);
}

export async function sendPasswordReset(login:string){
 const client=getSupabase();
 const email=await resolveLoginEmail(client,login);
 const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/trial/drugs/`});
 if(error)throw new Error(error.message);
 return 'ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว หากบัญชีนี้มีอยู่ในระบบ';
}

export async function logout(){
 if(hasSupabaseAuth())await getSupabase().auth.signOut();
 localStorage.removeItem(TOKEN_KEY);
 localStorage.removeItem(CONTEXT_KEY);
}

export async function loadTrialProfile(defaultProfile:Profile){
 const uid=getAuthContext()?.user.id||'guest';
 try{const raw=localStorage.getItem(`${TRIAL_PROFILE_PREFIX}${uid}`);return raw?{...defaultProfile,...JSON.parse(raw)}:defaultProfile}catch{return defaultProfile}
}

export async function saveTrialProfile(profile:Profile){
 const uid=getAuthContext()?.user.id||'guest';
 localStorage.setItem(`${TRIAL_PROFILE_PREFIX}${uid}`,JSON.stringify(profile));
 if(hasSupabaseAuth()){
  const update={rank:profile.rank,position:profile.position,station:profile.station,phone:profile.phone,display_name:[profile.rank,profile.name,profile.lastname].filter(Boolean).join(' ').trim(),full_name:[profile.name,profile.lastname].filter(Boolean).join(' ').trim(),updated_at:new Date().toISOString()};
  try{await getSupabase().from('profiles').update(update).eq('id',uid).throwOnError()}catch{}
 }
 return profile;
}
