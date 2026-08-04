export type AuthStatus = {auth_required:boolean;mode:'disabled'|'token';message:string};
import {apiUrl} from './apiClient';
const TOKEN_KEY='cat_alysim_trial_token';
export const getTrialToken=()=>localStorage.getItem(TOKEN_KEY)||'';
export const saveTrialToken=(token:string)=>localStorage.setItem(TOKEN_KEY,token);
export async function getAuthStatus():Promise<AuthStatus>{const r=await fetch(apiUrl('/api/auth/status'));if(!r.ok)throw new Error('ตรวจสอบสถานะระบบยืนยันตัวตนไม่สำเร็จ');return r.json()}
export async function loginTrial(username:string,password:string){const r=await fetch(apiUrl('/api/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});if(!r.ok)throw new Error(await r.text()||'เข้าสู่ระบบไม่สำเร็จ');const data=await r.json();saveTrialToken(data.access_token);return data.access_token}
