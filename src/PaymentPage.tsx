import {ArrowLeft,BadgeCheck,Clock,CreditCard,FileCheck2,MessageSquareText,ShieldCheck} from 'lucide-react';

export default function PaymentPage(){
 const steps:{title:string;text:string;Icon:typeof MessageSquareText}[]=[
  {title:'แจ้งชำระเงิน',text:'ส่งชื่อผู้ใช้และหลักฐานการโอนให้ผู้ดูแลตรวจสอบ',Icon:MessageSquareText},
  {title:'ตรวจสอบรายการ',text:'ระบบจะจับคู่บัญชีผู้ใช้กับรายการชำระเงิน',Icon:FileCheck2},
  {title:'เปิดสิทธิ์ใช้งาน',text:'บัญชีจะเปลี่ยนสถานะเป็น Licensed พร้อมใช้โปรแกรมเต็มรูปแบบ',Icon:BadgeCheck}
 ];
 return <main className="payment-page"><section className="payment-shell"><a className="payment-back" href="/"><ArrowLeft size={17}/>กลับหน้าแรก</a><div className="payment-layout"><div className="payment-copy"><span><ShieldCheck size={16}/> ต้องล็อกอินก่อนชำระเงิน</span><h1>CAT-ALYSIM License</h1><p>แพ็กเกจเดียว ใช้งานเต็มระบบสำหรับบัญชีนี้ หลังชำระเงินให้ส่งหลักฐาน ผู้ดูแลจะตรวจสอบและเปิดสิทธิ์ให้</p><div className="payment-actions"><a className="payment-primary" href="mailto:contact@cat-alysim.com?subject=แจ้งชำระเงิน CAT-ALYSIM">แจ้งชำระเงิน <MessageSquareText size={18}/></a><a className="payment-secondary" href="/trial/drugs/">กลับไปใช้งานระบบ</a></div></div><aside className="license-card"><div className="license-card-top"><CreditCard size={28}/><span>LICENSE</span></div><h2>4,999 บาท</h2><p>สิทธิ์ใช้งาน CAT-ALYSIM แบบเต็มสำหรับหนึ่งบัญชี</p><ul><li><BadgeCheck size={17}/> เปิดสถานะ Licensed</li><li><BadgeCheck size={17}/> ใช้ฟีเจอร์สร้างเอกสารและจัดการคดี</li><li><BadgeCheck size={17}/> รองรับอัปเดตเวอร์ชันใหม่</li></ul><small><Clock size={14}/> เปิดสิทธิ์หลังตรวจสอบหลักฐาน</small></aside></div><div className="payment-steps">{steps.map(({title,text,Icon})=><article key={title}><Icon size={24}/><h3>{title}</h3><p>{text}</p></article>)}</div></section></main>
}
