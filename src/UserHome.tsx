import {useEffect,useState} from 'react';
import {CalendarClock,FileText,KeyRound,LogOut,ShieldCheck,UserRound} from 'lucide-react';
import {getAuthContext,getDeviceId,getCurrentUser,logout,type AuthContext} from './auth';

function formatDate(value?:string|null){if(!value)return 'ไม่มีกำหนด';const d=new Date(value);return Number.isNaN(d.getTime())?value:d.toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})}
function profileText(ctx:AuthContext|null,key:string){const value=ctx?.profile?.[key];return typeof value==='string'&&value.trim()?value:'-'}

export default function UserHome(){
 const [ctx,setCtx]=useState<AuthContext|null>(getAuthContext()),[busy,setBusy]=useState(true);
 useEffect(()=>{getCurrentUser().then(setCtx).finally(()=>setBusy(false))},[]);
 async function signOut(){await logout();window.location.href='/'}
 const license=ctx?.license;
 return <div className="user-shell"><header className="user-topbar"><a className="user-brand" href="/"><span>CA</span><div><strong>CAT-ALYSIM</strong><small>User Console</small></div></a><nav><a href="/trial/drugs/">Trial Drugs</a><button onClick={signOut}><LogOut size={16}/>ออกจากระบบ</button></nav></header><main className="user-main"><section className="user-hero"><div><span className="user-kicker"><ShieldCheck size={16}/> Verified Access</span><h1>{profileText(ctx,'username')!=='-'?profileText(ctx,'username'):'บัญชีผู้ใช้งาน'}</h1><p>{ctx?.user.email||'กำลังโหลดข้อมูลบัญชี...'}</p></div><div className="license-badge"><small>สถานะ</small><strong>{busy?'ตรวจสอบ...':license?.license_type||'trial'}</strong><span>{license?.allowed?'เข้าใช้งานได้':'รอการยืนยัน'}</span></div></section><section className="user-grid"><article><UserRound size={22}/><small>ข้อมูลโปรไฟล์</small><h2>{profileText(ctx,'display_name')!=='-'?profileText(ctx,'display_name'):profileText(ctx,'full_name')}</h2><p>Role: {license?.role||profileText(ctx,'role')}</p><p>Status: {profileText(ctx,'status')}</p></article><article><CalendarClock size={22}/><small>สิทธิ์การใช้งาน</small><h2>{license?.license_type==='paid'?'Paid License':'Trial Access'}</h2><p>หมดอายุ: {formatDate(license?.expires_at)}</p><p>{license?.reason?`เหตุผล: ${license.reason}`:'ระบบอนุญาตให้ใช้งานตามสิทธิ์ปัจจุบัน'}</p></article><article><KeyRound size={22}/><small>อุปกรณ์</small><h2>Web Device</h2><p>{getDeviceId()}</p><p>ใช้สำหรับตรวจสอบ device lock แบบเดียวกับ desktop app</p></article><article><FileText size={22}/><small>เครื่องมือ</small><h2>Trial Drugs</h2><p>สร้างสำนวนและบันทึก profile พนักงานสอบสวนแยกตามบัญชีผู้ใช้</p><a href="/trial/drugs/">เปิดใช้งาน</a></article></section></main></div>
}
