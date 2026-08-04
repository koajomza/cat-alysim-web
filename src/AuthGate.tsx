import {useEffect,useState} from 'react';
import {LockKeyhole,ShieldCheck,LogIn} from 'lucide-react';
import {getAuthStatus,getTrialToken,loginTrial,type AuthStatus} from './auth';
export default function AuthGate({children}:{children:React.ReactNode}){
 const [status,setStatus]=useState<AuthStatus|null>(null),[allowed,setAllowed]=useState(false),[username,setUsername]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{getAuthStatus().then(s=>{setStatus(s);if(!s.auth_required||!!getTrialToken())setAllowed(true)}).catch(e=>setError(e instanceof Error?e.message:'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ'))},[]);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');try{await loginTrial(username,password);setAllowed(true)}catch(err){setError(err instanceof Error?err.message:'เข้าสู่ระบบไม่สำเร็จ')}finally{setBusy(false)}}
 if(!status&&!error)return <div className="auth-loading"><ShieldCheck size={34}/><b>กำลังตรวจสอบสิทธิ์ทดลองใช้งาน...</b></div>;
 if(allowed)return <>{status&&!status.auth_required&&<div className="auth-dev-banner"><ShieldCheck size={16}/> โครงยืนยันตัวตนวางไว้แล้ว — ตอนนี้ปิดการบังคับล็อกอินสำหรับช่วงพัฒนา</div>}{children}</>;
 return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="auth-icon"><LockKeyhole size={30}/></div><span>CAT-ALYSIM WEB TRIAL</span><h1>ยืนยันตัวตนก่อนทดลองระบบ</h1><p>พื้นที่ทดลองมีข้อมูลเอกสารและระบบสร้างไฟล์ จึงต้องจำกัดสิทธิ์ผู้เข้าใช้งานก่อนเปิดจริง</p><label><span>ชื่อผู้ใช้</span><input value={username} onChange={e=>setUsername(e.target.value)}/></label><label><span>รหัสผ่าน</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<div className="auth-error">{error}</div>}<button disabled={busy}><LogIn size={18}/>{busy?'กำลังตรวจสอบ...':'เข้าสู่ระบบทดลอง'}</button><a href="/">← กลับเว็บไซต์หลัก</a></form></div>
}
