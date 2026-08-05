import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,BadgeCheck,CheckCircle2,ClipboardCheck,Clock3,CreditCard,Loader2,LockKeyhole,ReceiptText,ShieldCheck} from 'lucide-react';
import {apiUrl} from './apiClient';
import {getAuthContext,getAuthHeaders} from './auth';

type CheckoutResponse={id?:string;url?:string;error?:string};
type PurchaseState='ready'|'requested'|'pending'|'paid';
type PaymentStatusResponse={
 state?:PurchaseState;
 profile?:{status?:string;paid_at?:string;serial_key?:string|null;is_approved?:boolean;approved?:boolean}|null;
 payment?:{status?:string;created_at?:string;paid_at?:string}|null;
 error?:string;
};

const REQUEST_KEY='cat_alysim_payment_requested_at';

function resolveInitialState(search:string):PurchaseState{
 const params=new URLSearchParams(search);
 if(params.get('payment')==='success')return 'pending';
 if(localStorage.getItem(REQUEST_KEY))return 'requested';
 return 'ready';
}

function stateCopy(state:PurchaseState){
 const map={
  ready:{label:'READY',title:'พร้อมสร้างรายการ',text:'กดชำระเงินเพื่อเปิดหน้า Stripe Checkout และสแกน PromptPay'},
  requested:{label:'REQUESTED',title:'สร้างรายการแล้ว',text:'มีรายการซื้อเริ่มไว้แล้ว ถ้ายังไม่ได้จ่ายสามารถกดชำระใหม่ได้'},
  pending:{label:'PENDING',title:'รอตรวจสอบการชำระเงิน',text:'จ่ายแล้วให้รอ Stripe ส่ง webhook กลับมา ระบบจะเปิดสิทธิ์เอง'},
  paid:{label:'PAID',title:'เปิดสิทธิ์แล้ว',text:'บัญชีนี้ได้รับ Full License แล้ว เข้าใช้งานเว็บและแอพได้ทันที'},
 };
 return map[state];
}

export default function PaymentPage(){
 const [busy,setBusy]=useState(false);
 const [checking,setChecking]=useState(false);
 const [error,setError]=useState('');
 const [purchaseState,setPurchaseState]=useState<PurchaseState>(()=>resolveInitialState(window.location.search));
 const [serial,setSerial]=useState('');
 const params=useMemo(()=>new URLSearchParams(window.location.search),[]);
 const status=params.get('payment');
 const summary=stateCopy(purchaseState);
 const benefits=['สร้างเอกสารเต็มระบบ','จัดการข้อมูลคดี','อัปเดตเวอร์ชันใหม่','ผูกสิทธิ์กับบัญชี'];
 const steps=[
  {title:'สร้างรายการ',text:'ระบบส่งบัญชีของคุณไปสร้าง Checkout Session กับ Stripe',icon:ReceiptText,active:purchaseState==='ready'||purchaseState==='requested'||purchaseState==='pending'||purchaseState==='paid'},
  {title:'จ่าย PromptPay',text:'Stripe แสดง QR ให้สแกนผ่านแอปธนาคารไทย',icon:CreditCard,active:purchaseState==='pending'||purchaseState==='paid'},
  {title:'เปิดสิทธิ์อัตโนมัติ',text:'Webhook ยืนยันยอด 5,000 บาท แล้วอัปเดตสถานะเป็น Paid',icon:ShieldCheck,active:purchaseState==='paid'},
 ];

 async function refreshStatus(){
  setChecking(true);
  setError('');
  try{
   const ctx=getAuthContext();
   if(ctx?.license?.allowed&&(ctx.license.license_type==='paid'||ctx.license.license_type==='admin')){
    setPurchaseState('paid');
   }
   const res=await fetch(apiUrl('/api/payments/status'),{headers:getAuthHeaders()});
   const data:PaymentStatusResponse=await res.json().catch(()=>({}));
   if(!res.ok)throw new Error(data.error||'ตรวจสอบสถานะไม่สำเร็จ');
   if(data.state)setPurchaseState(data.state);
   if(data.profile?.serial_key)setSerial(String(data.profile.serial_key));
   if(data.state==='paid')localStorage.removeItem(REQUEST_KEY);
  }catch(err){
   if(status==='success')setPurchaseState('pending');
   setError(err instanceof Error?err.message:'ตรวจสอบสถานะไม่สำเร็จ');
  }finally{
   setChecking(false);
  }
 }

 useEffect(()=>{void refreshStatus()},[]);

 async function startCheckout(){
  setBusy(true);
  setError('');
  localStorage.setItem(REQUEST_KEY,new Date().toISOString());
  setPurchaseState('requested');
  try{
   const res=await fetch(apiUrl('/api/payments/create-checkout-session'),{method:'POST',headers:getAuthHeaders({'Content-Type':'application/json'}),body:JSON.stringify({plan:'full_license'})});
   const data:CheckoutResponse=await res.json().catch(()=>({}));
   if(!res.ok||!data.url)throw new Error(data.error||'สร้างหน้าชำระเงินไม่สำเร็จ');
   window.location.href=data.url;
  }catch(err){
   setError(err instanceof Error?err.message:'เชื่อมต่อระบบชำระเงินไม่สำเร็จ');
  }finally{
   setBusy(false);
  }
 }

 return <main className="payment-page payment-page-modern"><section className="payment-checkout-shell"><div className="payment-checkout-copy"><a className="payment-back" href="/"><ArrowLeft size={17}/>กลับหน้าแรก</a><span className="payment-license-kicker"><ShieldCheck size={16}/>CAT-ALYSIM LICENSE</span><h1>เปิดฟีเจอร์เต็ม<br/>ให้บัญชีของคุณ</h1><p>ชำระครั้งเดียว 5,000 บาท ระบบจะให้ Stripe รับเงินผ่าน PromptPay และเปิดสิทธิ์ให้อัตโนมัติเมื่อ webhook ยืนยันยอดสำเร็จ</p><div className="payment-benefit-grid">{benefits.map((benefit)=><div key={benefit}><BadgeCheck size={17}/><span>{benefit}</span></div>)}</div><div className="payment-flow-row">{steps.map((step,index)=>{const Icon=step.icon;return <article key={step.title} className={step.active?'active':''}><span>{index+1}</span><Icon size={18}/><b>{step.title}</b><small>{step.text}</small></article>})}</div>{status==='success'&&purchaseState!=='paid'&&<div className="payment-notice success">รับสัญญาณกลับจาก Stripe แล้ว ถ้าชำระสำเร็จสถานะจะเปลี่ยนเป็น Paid หลัง webhook ทำงาน</div>}{status==='cancel'&&<div className="payment-notice">ยกเลิกการชำระเงินแล้ว สามารถเริ่มรายการใหม่ได้</div>}{serial&&<div className="payment-notice success">Serial: {serial}</div>}{error&&<div className="payment-notice error">{error}</div>}</div><aside className="payment-summary-card"><span>PAYMENT SUMMARY</span><div className="payment-price"><strong>5,000</strong><b>บาท</b></div><p>Full License สำหรับ 1 บัญชี ไม่มีค่ารายเดือน</p><div className={`payment-status-box ${purchaseState}`}><strong>{summary.label}</strong><b>{summary.title}</b><small>{summary.text}</small></div><dl><div><dt>แพ็กเกจ</dt><dd>Full License</dd></div><div><dt>บัญชี</dt><dd>1 บัญชี</dd></div><div><dt>สถานะ</dt><dd className={purchaseState}>{summary.label}</dd></div></dl><button className="payment-primary" onClick={startCheckout} disabled={busy||purchaseState==='paid'}>{busy?<Loader2 className="spin" size={18}/>:purchaseState==='paid'?<CheckCircle2 size={18}/>:<ReceiptText size={18}/>} {purchaseState==='paid'?'ชำระแล้ว':'ชำระด้วย PromptPay'}</button><button className="payment-secondary" onClick={refreshStatus} disabled={checking}>{checking?<Loader2 className="spin" size={18}/>:<ClipboardCheck size={18}/>}ตรวจสอบสถานะ</button><small><LockKeyhole size={16}/>เปิดสิทธิ์จาก Stripe webhook เท่านั้น</small></aside></section></main>
}
