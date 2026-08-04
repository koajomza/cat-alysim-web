import type {CaseData} from './types';
import {getAuthHeaders} from './auth';
import {apiUrl} from './apiClient';
const authHeaders=getAuthHeaders;
export async function upload(file:File){const fd=new FormData();fd.append('file',file);const r=await fetch(apiUrl('/api/import'),{method:'POST',headers:authHeaders(),body:fd});if(!r.ok)throw new Error(await r.text());return r.json()}
export async function saveCase(data:CaseData){const r=await fetch(apiUrl('/api/cases'),{method:'POST',headers:authHeaders({'Content-Type':'application/json'}),body:JSON.stringify(data)});if(!r.ok)throw new Error(await r.text());return r.json()}
export async function getDocuments(){const r=await fetch(apiUrl('/api/documents'),{headers:authHeaders()});if(!r.ok)throw new Error(await r.text());return r.json()}
export async function generate(data:CaseData,documents:string[]){const r=await fetch(apiUrl('/api/generate'),{method:'POST',headers:authHeaders({'Content-Type':'application/json'}),body:JSON.stringify({case:data,documents})});if(!r.ok)throw new Error(await r.text());const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`CAT-ALYSIM-DRUGS-${data.caseid||'CASE'}.zip`;a.click();URL.revokeObjectURL(url)}

export async function generateOne(data:CaseData,document:string,imprisonRound=''){const r=await fetch(apiUrl('/api/generate-one'),{method:'POST',headers:authHeaders({'Content-Type':'application/json'}),body:JSON.stringify({case:data,document,imprison_round:imprisonRound})});if(!r.ok)throw new Error(await r.text());const blob=await r.blob();const url=URL.createObjectURL(blob);const a=window.document.createElement('a');a.href=url;a.download=`${document.split('/').pop()||'document'}.docx`;a.click();URL.revokeObjectURL(url)}
