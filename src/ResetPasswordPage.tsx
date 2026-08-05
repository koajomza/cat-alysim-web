import {useEffect,useState} from 'react';
import {ArrowLeft,KeyRound} from 'lucide-react';
import {getSupabase,resetCurrentPassword} from './auth';

export default function ResetPasswordPage(){
 const [password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{let alive=true;getSupabase().auth.getSession().then(()=>{if(alive)setReady(true)}).catch(e=>{if(alive){setError(e instanceof Error?e.message:'เปิดลิงก์รีเซ็ตไม่สำเร็จ');setReady(true)}});return()=>{alive=false}},[]);
 async function submit(e:React.FormEvent){
  e.preventDefault();setBusy(true);setError('');setNotice('');
  try{setNotice(await resetCurrentPassword(password,confirm));setPassword('');setConfirm('');window.history.replaceState(null,'','/auth/reset/')}
  catch(err){setError(err instanceof Error?err.message:'ตั้งรหัสผ่านใหม่ไม่สำเร็จ')}
  finally{setBusy(false)}
 }
 return <main className="auth-page auth-page-compact"><section className="auth-window">
  <a className="reset-back compact" href="/trial/drugs/?auth=login"><ArrowLeft size={17}/>กลับหน้าเข้าสู่ระบบ</a>
  <div className="auth-window-head"><img src="/cat-alysim-mark.png" alt="CAT-ALYSIM"/><div><b>CAT-ALYSIM</b><span>Reset Password</span></div></div>
  <form className="auth-stack" onSubmit={submit}><label><span>รหัสผ่านใหม่</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" autoFocus/></label><label><span>ยืนยันรหัสผ่านใหม่</span><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password"/></label>{notice&&<div className="auth-notice">{notice}</div>}{error&&<div className="auth-error multi-line">{error}</div>}<button disabled={busy||!ready}><KeyRound size={18}/>{busy?'กำลังบันทึก...':'บันทึกรหัสผ่านใหม่'}</button><a className="reset-login-link" href="/trial/drugs/?auth=login">เข้าสู่ระบบ</a></form>
 </section></main>;
}
