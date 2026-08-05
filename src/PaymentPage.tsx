import {useMemo,useState} from 'react';
import {ArrowLeft,BadgeCheck,ClipboardCheck,Loader2,LockKeyhole,ReceiptText,ShieldCheck} from 'lucide-react';
import {apiUrl} from './apiClient';
import {getAuthHeaders} from './auth';

type CheckoutResponse={id?:string;url?:string;error?:string};

export default function PaymentPage(){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const params=useMemo(()=>new URLSearchParams(window.location.search),[]);
 const status=params.get('payment');
 const benefits=['สร้างเอกสารเต็มระบบ','จัดการข้อมูลคดี','อัปเดตเวอร์ชันใหม่','ผูกสิทธิ์กับบัญชี'];

 async function startCheckout(){
  setBusy(true);
  setError('');
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

 return <main className="payment-page payment-page-modern"><section className="payment-checkout-shell"><div className="payment-checkout-copy"><a className="payment-back" href="/"><ArrowLeft size={17}/>กลับหน้าแรก</a><span className="payment-license-kicker"><ShieldCheck size={16}/>CAT-ALYSIM LICENSE</span><h1>เปิดฟีเจอร์เต็ม<br/>ให้บัญชีของคุณ</h1><p>สิทธิ์ใช้งานเต็มสำหรับการสร้างเอกสาร จัดการคดี และรับอัปเดตเวอร์ชันใหม่ ระบบจะเปิดสิทธิ์อัตโนมัติหลัง Stripe ยืนยัน PromptPay สำเร็จ</p><div className="payment-benefit-grid">{benefits.map((benefit)=><div key={benefit}><BadgeCheck size={17}/><span>{benefit}</span></div>)}</div>{status==='success'&&<div className="payment-notice success">รับข้อมูลชำระเงินแล้ว ระบบกำลังตรวจสอบและเปิดสิทธิ์ให้อัตโนมัติ</div>}{status==='cancel'&&<div className="payment-notice">ยกเลิกการชำระเงินแล้ว สามารถเริ่มใหม่ได้ทุกเมื่อ</div>}{error&&<div className="payment-notice error">{error}</div>}</div><aside className="payment-summary-card"><span>PAYMENT SUMMARY</span><div className="payment-price"><strong>5,000</strong><b>บาท</b></div><p>ชำระครั้งเดียวด้วย PromptPay ผ่าน Stripe ไม่มีค่าบริการรายเดือน</p><dl><div><dt>แพ็กเกจ</dt><dd>Full License</dd></div><div><dt>บัญชี</dt><dd>1 บัญชี</dd></div><div><dt>สถานะ</dt><dd className="pending">Pending</dd></div></dl><button className="payment-primary" onClick={startCheckout} disabled={busy}>{busy?<Loader2 className="spin" size={18}/>:<ReceiptText size={18}/>}ชำระด้วย PromptPay</button><a className="payment-secondary" href="/trial/drugs/"><ClipboardCheck size={18}/>ตรวจสอบสถานะ</a><small><LockKeyhole size={16}/>เปิดสิทธิ์จาก Stripe webhook เท่านั้น</small></aside></section></main>
}
