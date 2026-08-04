import {useEffect,useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,CalendarDays,Camera,ChevronDown,CreditCard,Database,Download,FileText,FolderSearch,Link2,LogIn,LogOut,MapPinned,Menu,MessageSquareText,Monitor,Scale,Search,ShieldCheck,Sparkles,UserPlus,UsersRound,WandSparkles,X} from 'lucide-react';
import {getCurrentUser,logout,type AuthContext} from './auth';

type PageMode='home'|'program'|'features'|'photoEvidence'|'crimeScene'|'trafficFine';
type VisualItem={file:string;title:string;sub:string};

const release={
 version:'2026.08.05.2',
 installerVersion:'2026.08.05.1',
 releaseUrl:'https://github.com/koajomza/CAT-ALYSIM-Releases/releases/latest',
 latestJson:'https://github.com/koajomza/CAT-ALYSIM-Releases/releases/latest/download/latest.json',
 installerUrl:'https://github.com/koajomza/CAT-ALYSIM-Releases/releases/download/v2026.08.05.1/CAT-ALYSIM-Setup-2026.08.05.1.exe',
 fullZipUrl:'https://github.com/koajomza/CAT-ALYSIM-Releases/releases/download/v2026.08.05.2/CAT-ALYSIM-2026.08.05.2-full.zip'
};

const programPages=[
 {id:'program-overview',icon:Monitor,title:'หน้าโปรแกรม',text:'หน้าแรกของแอพสำหรับมองงานทั้งหมด เห็นคดีอาญา ยาเสพติด จราจร สถานะ และรายการที่ต้องกลับไปทำต่อในที่เดียว',img:'/screenshots/app/case-overview-small.png'},
 {id:'program-criminal',icon:FolderSearch,title:'คดีอาญา',text:'หน้าคดีอาญาใช้ดูรายการคดีทั่วไป เช่น ฉ้อโกง ลักทรัพย์ ทำร้ายร่างกาย แล้วเปิดเข้าไปกรอกข้อมูลคดี บุคคล ทรัพย์สิน ฝากขัง แผนที่ และเอกสาร',img:'/screenshots/app/criminal-list.png'},
 {id:'program-drugs',icon:Database,title:'คดียาเสพติด',text:'หน้าคดียาเสพติดแยกสีและข้อมูลเฉพาะคดี เช่น ของกลาง น้ำหนักยา ผลตรวจ คำให้การ และเอกสารที่ต้องใช้ในสำนวน',img:'/screenshots/app/drugs-list.png'},
 {id:'program-traffic',icon:MapPinned,title:'คดีจราจร',text:'หน้าคดีจราจรใช้กับคู่กรณี จุดเกิดเหตุ ภาพถ่าย รถ เส้นทาง และการเปรียบเทียบปรับ จึงใช้ภาพแผนที่เกิดเหตุที่มีรถเป็นตัวอย่างหลัก',img:'/screenshots/app/traffic-list.png'}
];

const programMockups=[
 {id:'program-criminal',slug:'civil',tone:'blue',icon:FolderSearch,title:'คดีอาญา',label:'CIVIL MOCKUP',text:'ชุดภาพ mockup สำหรับคดีอาญา วางไว้ 5 หน้า ตั้งแต่รายการคดี ข้อมูลคดี บุคคล ทรัพย์สิน และแผนที่เกิดเหตุ วันหลังแก้ได้ที่ content/programs/civil/civil.txt',fallback:[['civil1.png','หน้าโปรแกรม','สำหรับดูรายการคดีอาญาและสถานะงานสอบสวนในภาพรวม'],['civil2.png','หน้าสร้างข้อมูลคดี','สำหรับดูข้อมูลภาพรวมของคดีเบื้องต้น เช่น เลขคดี ข้อหา และความเห็นคดี'],['civil3.png','หน้าข้อมูลบุคคล','สำหรับจัดผู้กล่าวหา ผู้ต้องหา และพยานให้อยู่ในคดีเดียวกัน'],['civil4.png','หน้าทรัพย์สินและของกลาง','สำหรับบันทึกของกลาง ทรัพย์สิน และหลักฐานที่เกี่ยวข้อง'],['civil5.png','หน้าแผนที่เกิดเหตุ','สำหรับวาดผังสถานที่เกิดเหตุ จุดสำคัญ และตำแหน่งหลักฐาน']]},
 {id:'program-drugs',slug:'drugs',tone:'amber',icon:Database,title:'คดียาเสพติด',label:'DRUGS MOCKUP',text:'ชุดภาพ mockup สำหรับคดียาเสพติด วางไว้ 5 หน้าเป็นตัวแทน flow หลักของงานยาเสพติด วันหลังแก้ได้ที่ content/programs/drugs/drugs.txt',fallback:[['drugs1.png','หน้าโปรแกรมคดียาเสพติด','สำหรับดูรายการคดียาเสพติดและสถานะการสอบสวน'],['drugs2.png','หน้าข้อหาและกฎหมาย','สำหรับเลือกข้อหา มาตรา และองค์ประกอบความผิดที่เกี่ยวข้อง'],['drugs3.png','หน้าคำให้การ','สำหรับจัดชุดคำถามและคำตอบของผู้กล่าวหา ผู้ต้องหา หรือพยาน'],['drugs4.png','หน้าสร้างเอกสาร','สำหรับเลือกแบบฟอร์มและสร้างเอกสารสำนวนเป็นไฟล์ Word'],['drugs5.png','หน้า OCR เอกสาร','สำหรับอ่านภาพหรือ PDF แล้วดึงข้อความมาใช้ต่อในคดี']]},
 {id:'program-traffic',slug:'traffic',tone:'green',icon:MapPinned,title:'คดีจราจร',label:'TRAFFIC MOCKUP',text:'ชุดภาพ mockup สำหรับคดีจราจร วางไว้ 5 หน้า เช่น รายการคดี แผนที่เกิดเหตุ ปรับพินัย ภาพประกอบคดี และตารางงาน วันหลังแก้ได้ที่ content/programs/traffic/traffic.txt',fallback:[['traffic1.png','หน้าโปรแกรมคดีจราจร','สำหรับดูรายการคดีจราจร สถานะ และคดีที่ต้องติดตาม'],['traffic2.png','หน้าแผนที่เกิดเหตุรถชน','สำหรับวาดถนน รถ จุดชน และทิศทางการเคลื่อนที่'],['traffic3.png','หน้าปรับพินัย','สำหรับจัดข้อมูลค่าปรับ หนังสือแจ้ง และสถานะการชำระ'],['traffic4.png','หน้าภาพถ่ายประกอบคดี','สำหรับจัดรูปภาพพร้อมคำอธิบายเพื่อออกเอกสารแนบสำนวน'],['traffic5.png','หน้าตารางงาน','สำหรับดูเวร นัดหมาย และสิ่งที่ต้องทำในปฏิทินเดียว']]}
];

const featurePages=[
 {id:'feature-arrest',slug:'arrest-import',icon:Sparkles,title:'จับกุมสู่คดี',short:'โยนบันทึกจับกุมแล้วสร้างคดี',text:'เอาบันทึกจับกุมหรือข้อความคดีใส่เข้ามา แล้วให้ระบบช่วยอ่านข้อมูลสำคัญเพื่อตั้งต้นคดี ลดเวลาพิมพ์ตั้งแต่หน้าแรกของสำนวน',fallback:[['feature1.svg','โยนบันทึกจับกุมแล้วสร้างคดี','โยนบันทึกจับกุมหรือข้อความคดีเข้ามา แล้วให้ระบบช่วยตั้งต้นข้อมูลสำคัญ']]},
 {id:'feature-linkage',slug:'linkage-center',icon:Link2,title:'Linkage Center',short:'เพิ่มบุคคลจากข้อมูลเดิม',text:'ค้นและดึงข้อมูลบุคคลที่เคยใช้แล้วมาเป็นผู้กล่าวหา ผู้ต้องหา หรือพยานในคดีใหม่ ทำให้ข้อมูลชื่อและรายละเอียดไม่หลุดกัน',fallback:[['feature1.png','เพิ่มบุคคลจากข้อมูลเดิม','ดึงข้อมูลบุคคลที่เคยใช้แล้วมาใส่ในคดีใหม่ ลดการพิมพ์ซ้ำและข้อมูลคลาดเคลื่อน']]},
 {id:'feature-case-info',slug:'case-info',icon:FileText,title:'Case Info Builder',short:'กรอกข้อมูลคดีเป็นหมวด',text:'หน้าข้อมูลคดีรวมช่องสำคัญ เช่น อำนาจสั่งคดี อำนาจศาล อัยการ ข้อหา และความเห็นคดี เพื่อให้เอกสารปลายทางมีข้อมูลครบ',fallback:[['feature1.png','กรอกข้อมูลคดีหลักให้ครบก่อนออกเอกสาร','รวมเลขคดี อำนาจสั่งคดี ศาล อัยการ ข้อหา และความเห็นคดีไว้ในหน้าเดียว']]},
 {id:'feature-book',slug:'book-document',icon:BookOpen,title:'Book Tab Document',short:'สร้างเอกสารจากแท็บ Book',text:'เลือกแม่แบบเอกสาร กรอกข้อมูลตามช่อง แล้วสร้างไฟล์ Word จากข้อมูลคดี ไม่ต้องไล่คัดลอกทีละฉบับ',fallback:[['feature1.png','สร้างเอกสารจากแม่แบบ Book Tab','เลือกแม่แบบ กรอกข้อมูล แล้วสร้างไฟล์ Word จากข้อมูลคดีโดยไม่ต้องคัดลอกทีละฉบับ']]},
 {id:'feature-property',slug:'evidence-property',icon:Database,title:'Evidence & Property',short:'ทรัพย์สินและของกลาง',text:'เก็บเลขที่ยึด วันยึด รายการของกลาง และทรัพย์ถูกประทุษร้ายไว้เป็นตารางเดียว ตรวจง่ายและนำไปออกเอกสารได้',fallback:[['feature1.png','เก็บรายการทรัพย์สิน ของกลาง และหลักฐาน','บันทึกเลขที่ยึด วันยึด รายการของกลาง และทรัพย์ถูกประทุษร้ายให้ตรวจต่อได้ง่าย']]},
 {id:'feature-imprison',slug:'custody-timeline',icon:CalendarDays,title:'Custody Timeline',short:'ฝากขังและประกัน',text:'คำนวณรอบฝากขัง เก็บคำร้อง ศาล สถานะผู้ต้องหา และข้อมูลประกัน ช่วยไม่ให้พลาดวันสำคัญ',fallback:[['feature1.png','จัดรอบฝากขัง ประกัน และวันสำคัญของคดี','คำนวณรอบฝากขัง เก็บข้อมูลประกัน และช่วยเตือนงานที่ห้ามพลาดกำหนด']]},
 {id:'feature-criminal-map',slug:'crime-scene-map',icon:MapPinned,title:'Crime Scene Map',short:'แผนที่เกิดเหตุคดีอาญา',text:'สำหรับคดีอาญา ใช้วาดห้อง จุดพบของ จุดเกิดเหตุ และตำแหน่งสำคัญในบ้านหรือสถานที่เกิดเหตุ',fallback:[['feature1.png','วาดแผนที่เกิดเหตุสำหรับคดีอาญา','วาดผังบ้าน ห้อง จุดพบของ และตำแหน่งสำคัญให้เอกสารคดีอ่านแล้วเห็นภาพ']]},
 {id:'feature-traffic-map',slug:'traffic-scene-map',icon:MapPinned,title:'Traffic Scene Map',short:'แผนที่เกิดเหตุคดีจราจร',text:'สำหรับคดีจราจร ใช้วาดถนน รถ จุดชน กรวย และทิศทางการเคลื่อนที่ เพื่อประกอบสำนวนให้เห็นภาพชัด',fallback:[['feature1.png','วาดแผนที่เกิดเหตุคดีจราจร','วาดถนน รถ จุดชน กรวย และทิศทางการเคลื่อนที่เพื่อประกอบสำนวน']]},
 {id:'feature-traffic-fine',slug:'traffic-fine-order',icon:Scale,title:'Traffic Fine Order',short:'ปรับพินัยคดีจราจร',text:'บันทึกผู้ถูกกล่าวหา สรุปพฤติการณ์ เลขหนังสือแจ้งข้อกล่าวหา คำสั่งปรับ ค่าปรับ วิธีส่ง และสถานะการชำระในหน้าเดียว',fallback:[['feature1.png','จัดการข้อมูลปรับพินัย','เก็บค่าปรับ หนังสือแจ้ง คำสั่งปรับ วิธีส่ง และสถานะการชำระในหน้าเดียว']]},
 {id:'feature-photo',slug:'photo-evidence',icon:Camera,title:'Photo Evidence',short:'ภาพถ่ายประกอบคดี',text:'ลากรูปเข้าโปรแกรม จัดลำดับ ใส่คำอธิบาย แล้วสร้างเอกสารภาพถ่ายประกอบคดีเป็นไฟล์ Word ได้ทันที',fallback:[['feature1.png','จัดภาพถ่ายประกอบคดี','ลากรูปเข้าโปรแกรม ใส่คำอธิบาย แล้วสร้างเอกสารภาพถ่ายประกอบคดีเป็นไฟล์ Word']]},
 {id:'feature-community',slug:'community',icon:UsersRound,title:'CAT Exchange',short:'คอมมูนิตี้แบ่งปันฟอร์ม',text:'แชร์ชุดคำถาม ข้อหา ฟอร์ม หรือชุดข้อมูลตัวอย่างให้ทีมใช้ต่อ ช่วยให้ของดีไม่หายไปกับเครื่องใครเครื่องหนึ่ง',fallback:[['feature1.png','คอมมูนิตี้สำหรับแชร์ฟอร์มและชุดข้อมูล','แบ่งปันฟอร์ม ข้อหา ชุดคำถาม และข้อมูลตัวอย่างให้ทีมใช้ต่อได้ทันที']]},
 {id:'feature-chat',slug:'chat',icon:MessageSquareText,title:'Team Chat Workspace',short:'แชทและส่งไฟล์ในทีม',text:'คุยงาน ส่งไฟล์ เปิดไฟล์ และเก็บประวัติการสื่อสารไว้ใกล้กับพื้นที่ทำงานของโปรแกรม',fallback:[['feature1.png','แชทและส่งไฟล์ในทีม','คุยงาน ส่งไฟล์ เปิดไฟล์ และเก็บประวัติการสื่อสารไว้ใกล้พื้นที่ทำงาน']]},
 {id:'feature-ocr',slug:'ocr',icon:WandSparkles,title:'Typhoon OCR',short:'อ่านรูปและ PDF เป็นข้อความ',text:'อัปโหลดภาพหรือ PDF แล้วถอดเป็นข้อความ ตาราง หรือ Markdown เพื่อนำไปตรวจทานและใช้ต่อในเอกสาร',fallback:[['feature1.png','อ่านรูปและ PDF เป็นข้อความ','ถอดภาพหรือ PDF เป็นข้อความ ตาราง หรือ Markdown เพื่อเอาไปตรวจและใช้ต่อในเอกสาร']]},
 {id:'feature-calendar',slug:'calendar',icon:CalendarDays,title:'Duty Calendar',short:'ตารางเวรและนัดหมาย',text:'ดูเวร งานคดี วันนัด และสิ่งที่ต้องทำเป็นปฏิทินรายเดือน กันลืมงานสำคัญ',fallback:[['feature1.png','ตารางเวรและนัดหมายรายเดือน','ดูเวร งานคดี วันนัด และสิ่งที่ต้องทำในปฏิทินเดียว']]},
 {id:'feature-search',slug:'deep-search',icon:Search,title:'Deep Search',short:'ค้นลึกทั้งระบบ',text:'ค้นจากเลขคดี ชื่อคน ข้อหา memo คำให้การ และสถานที่เกิดเหตุ แล้วกดกลับไปยังคดีที่เกี่ยวข้องได้ทันที',fallback:[['feature1.png','ค้นลึกทั้งระบบ','ค้นจากเลขคดี ชื่อคน ข้อหา memo คำให้การ และสถานที่เกิดเหตุ แล้วเปิดกลับไปยังคดีได้ทันที']]}
];

const featureLinks:{[key:string]:string}={
 'feature-criminal-map':'/crime-scene/',
 'feature-traffic-map':'/crime-scene/',
 'feature-traffic-fine':'/traffic-fine/',
 'feature-photo':'/photo-evidence/'
};

const downloadFacts=['ติดตั้งบน Windows','ไฟล์ .exe พร้อมใช้งาน','อัปเดตเวอร์ชันล่าสุด'];
function userLabel(ctx:AuthContext|null){const p=ctx?.profile||{};const value=p.username||p.display_name||p.full_name||ctx?.user.email;return typeof value==='string'&&value?value.split('@')[0]:'ผู้ใช้'}
const fallbackItems=(items:string[][]):VisualItem[]=>items.map(([file,title,sub=''])=>({file,title,sub}));
function parseManifest(text:string,fallback:VisualItem[]){
 const parsed=text.split(/\r?\n/).map(line=>line.trim()).filter(line=>line&&!line.startsWith('#')).map(line=>{
  const [file,...rest]=line.split('=');
  const [title,...subParts]=rest.join('=').split('|');
  return {file:(file||'').trim(),title:(title||'').trim(),sub:subParts.join('|').trim()};
 }).filter(item=>item.file&&item.title);
 return parsed.length?parsed:fallback;
}
function useManifest(path:string,fallback:VisualItem[]){
 const [items,setItems]=useState(fallback);
 useEffect(()=>{let alive=true;fetch(`${path}?v=${Date.now()}`).then(r=>r.ok?r.text():Promise.reject()).then(text=>{if(alive)setItems(parseManifest(text,fallback))}).catch(()=>{});return()=>{alive=false}},[path]);
 return items;
}

function Header({auth,name,userMenu,setUserMenu,menu,setMenu,signOut}:{auth:AuthContext|null;name:string;userMenu:boolean;setUserMenu:(v:boolean|((v:boolean)=>boolean))=>void;menu:boolean;setMenu:(v:boolean|((v:boolean)=>boolean))=>void;signOut:()=>void}){
 const authActions=auth?<div className="user-nav"><button className="user-nav-button polished" onClick={()=>setUserMenu(v=>!v)}><span className="user-mini-avatar">{name.slice(0,1).toUpperCase()}</span><span className="user-mini-copy"><b>{name}</b><small>บัญชีพร้อมใช้งาน</small></span><ChevronDown size={15}/></button>{userMenu&&<div className="user-dropdown"><a href="/trial/drugs/"><FileText size={16}/>เข้า Trial Drugs</a><a href="/payment/"><CreditCard size={16}/>ชำระเงิน</a><a href="/#download"><Download size={16}/>ดาวน์โหลดโปรแกรม</a><button onClick={signOut}><LogOut size={16}/>ออกจากระบบ</button></div>}</div>:<><a className="nav-login" href="/trial/drugs/?auth=login"><LogIn size={16}/>เข้าสู่ระบบ</a><a className="nav-trial" href="/trial/drugs/?auth=signup"><UserPlus size={16}/>สมัครสมาชิก</a></>;
 return <header className="marketing-header product-nav"><a className="marketing-brand" href="/"><img src="/cat-alysim-mark.png"/><strong>CAT-ALYSIM</strong></a><nav className={menu?'open':''}><a href="/">หน้าแรก</a><div className="nav-dropdown"><a href="/program/">โปรแกรม <ChevronDown size={14}/></a><div>{programPages.map(({id,icon:Icon,title,text})=><a href={`/program/#${id}`} key={id}><Icon size={17}/><span><b>{title}</b><small>{text}</small></span></a>)}</div></div><div className="nav-dropdown wide"><a href="/features/">ฟีเจอร์ <ChevronDown size={14}/></a><div>{featurePages.map(({id,icon:Icon,title,short})=><a href={featureLinks[id]||`/features/#${id}`} key={id}><Icon size={17}/><span><b>{title}</b><small>{short}</small></span></a>)}</div></div><a href="/payment/"><CreditCard size={15}/>ชำระเงิน</a><a href="/#download">ดาวน์โหลด</a><a href="/trial/drugs/">ทดลองระบบ</a></nav><div className="marketing-actions">{authActions}<button onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button></div></header>
}

function Footer(){return <footer className="marketing-footer"><div><a className="marketing-brand footer-brand" href="/"><img src="/cat-alysim-mark.png"/><strong>CAT-ALYSIM</strong></a><p>ระบบจัดการคดีและสร้างเอกสารสำหรับงานสอบสวน</p></div><div><b>เมนูหลัก</b><a href="/">หน้าแรก</a><a href="/program/">โปรแกรม</a><a href="/features/">ฟีเจอร์</a><a href="/payment/">ชำระเงิน</a></div><div><b>ใช้งาน</b><a href="/trial/drugs/?auth=login">เข้าสู่ระบบ</a><a href="/trial/drugs/?auth=signup">สมัครสมาชิก</a><a href="/trial/drugs/">ทดลองระบบ</a></div><div><b>ดาวน์โหลด</b><a href={release.installerUrl}>ดาวน์โหลด .exe</a><span>Version {release.installerVersion}</span></div></footer>}

function HomePage(){
 return <main><section id="home" className="marketing-hero"><div className="hero-orb orb-a"/><div className="hero-orb orb-b"/><div className="marketing-copy"><span className="marketing-kicker"><Sparkles size={16}/> โปรแกรมจัดสำนวนและเอกสารสอบสวน</span><h1><span>CAT-ALYSIM</span><em>จัดคดีให้เป็นระบบ</em><span>ตั้งแต่รับเรื่องถึงออกเอกสาร</span></h1><p>หน้าแรกนี้เป็นประตูเข้าโปรแกรม: เลือกดูหน้าโปรแกรมแบบเต็ม ดูฟีเจอร์แยกเป็นหมวด ชำระเงิน ดาวน์โหลดตัวติดตั้ง หรือเข้า Trial Drugs หลังล็อกอิน</p><div className="marketing-buttons"><a className="btn-solid" href="/program/"><Monitor size={18}/>ดูหน้าโปรแกรม</a><a className="btn-outline" href="/features/"><Sparkles size={18}/>ดูฟีเจอร์ทั้งหมด</a><a className="btn-outline" href={release.installerUrl}><Download size={18}/>ดาวน์โหลด</a></div><div className="hero-facts">{downloadFacts.map(t=><span key={t}><ShieldCheck/> {t}</span>)}</div></div><div className="marketing-preview"><div className="preview-window"><div className="preview-bar"><i/><i/><i/><span>CAT-ALYSIM · Case Command Center</span></div><img src="/screenshots/app/case-overview-small.png"/></div><div className="preview-chip chip-one"><b>14</b><span>ฟีเจอร์หลัก</span></div><div className="preview-chip chip-two"><b>3</b><span>หมวดคดี</span></div></div></section><section className="home-choice-section"><a href="/program/"><Monitor size={26}/><h2>โปรแกรม</h2><p>ดูหน้าโปรแกรม คดีอาญา คดียาเสพติด และคดีจราจรแบบเต็มหน้า</p><ArrowRight size={18}/></a><a href="/features/"><Sparkles size={26}/><h2>ฟีเจอร์</h2><p>ดูฟีเจอร์ย่อยทั้งหมดพร้อมรูปหน้าจอและคำอธิบายการใช้งาน</p><ArrowRight size={18}/></a><a href="/payment/"><CreditCard size={26}/><h2>ชำระเงิน</h2><p>หน้าเตรียมแพ็กเกจและ Serial โดยต้องล็อกอินก่อนเข้าใช้งาน</p><ArrowRight size={18}/></a></section><DownloadBand/></main>
}

function ProgramPageContent(){
 const [slide,setSlide]=useState<{[key:string]:number}>({});
 return <main><section className="subpage-hero"><span>PROGRAM MOCKUP</span><h1>หน้าโปรแกรม แยก mockup ตามประเภทคดี</h1><p>ตอนนี้วางเป็นภาพตัวอย่างก่อน หมวดละ 5 รูป มีปุ่มกลมให้เลื่อนไปมาได้ ภายหลังเปลี่ยนรูปและข้อความได้จากโฟลเดอร์ content/programs โดยตรง</p></section><section id="program" className="marketing-section program-section subpage-section mockup-section"><div className="program-mockup-list">{programMockups.map(item=><ProgramMockupCard key={item.id} item={item} index={slide[item.id]||0} setIndex={i=>setSlide(current=>({...current,[item.id]:i}))}/>)}</div></section></main>
}

function ProgramMockupCard({item,index,setIndex}:{item:typeof programMockups[number];index:number;setIndex:(i:number)=>void}){
 const items=useManifest(`/content/programs/${item.slug}/${item.slug}.txt`,fallbackItems(item.fallback));
 const active=items[index%items.length]||items[0];
 const Icon=item.icon;
 const image=`/content/programs/${item.slug}/${active.file}?v=content-20260805`;
 const go=(step:number)=>setIndex((index+step+items.length)%items.length);
 return <article id={item.id} className={`program-mockup-card ${item.tone}`}><div className="program-mockup-copy"><span><Icon size={16}/>{item.label}</span><small className="content-group-title">{item.title}</small><h3>{active.title}</h3>{active.sub&&<p className="content-sub">{active.sub}</p>}<div className="mockup-dots">{items.map((entry,i)=><button key={entry.file} className={i===index?'active':''} onClick={()=>setIndex(i)} aria-label={`${entry.title} รูปที่ ${i+1}`}/>)}</div></div><div className="program-mockup-stage"><button className="mockup-round prev" onClick={()=>go(-1)} aria-label={`เลื่อน ${item.title} ย้อนกลับ`}><ArrowLeft size={20}/></button><img src={image} alt={active.title}/><button className="mockup-round next" onClick={()=>go(1)} aria-label={`เลื่อน ${item.title} ถัดไป`}><ArrowRight size={20}/></button></div></article>
}

function FeaturesPageContent(){
 return <main><section className="subpage-hero"><span>FEATURES</span><h1>ฟีเจอร์สำคัญ แสดงแถวละหนึ่งฟีเจอร์</h1><p>แต่ละฟีเจอร์มีโฟลเดอร์ของตัวเองใน content/features แก้รูปและคำอธิบายได้จาก feature.txt แล้วหน้านี้จะอ่านมาแสดง</p></section><section id="features" className="marketing-section feature-page-section subpage-section"><div className="feature-page-grid feature-row-grid">{featurePages.map(feature=><FeatureRow key={feature.id} feature={feature}/>)}</div></section></main>
}

function FeatureRow({feature}:{feature:typeof featurePages[number]}){
 const items=useManifest(`/content/features/${feature.slug}/feature.txt`,fallbackItems(feature.fallback));
 const active=items[0];
 const Icon=feature.icon;
 return <article id={feature.id} className="feature-page-card feature-row-card"><div className="feature-page-image"><img src={`/content/features/${feature.slug}/${active.file}?v=content-20260805`} alt={active.title}/></div><div className="feature-page-copy"><span><Icon size={16}/>{feature.short}</span><small className="content-group-title">{feature.title}</small><h3>{active.title}</h3>{active.sub&&<p className="content-sub">{active.sub}</p>}{featureLinks[feature.id]&&<a className="feature-detail-link" href={featureLinks[feature.id]}>เปิดหน้าเต็ม <ArrowRight size={15}/></a>}</div></article>
}

function PhotoEvidencePageContent(){
 return <main><section className="subpage-hero"><span>PHOTO EVIDENCE</span><h1>ภาพถ่ายประกอบคดี ทำเอกสารได้จากรูปจริง</h1><p>ลากรูปเข้าโปรแกรม เลือกรูปที่ต้องการ ใส่คำอธิบาย และสร้างไฟล์ Word สำหรับแนบสำนวนได้เลย หน้านี้ใช้รูปหน้าจอจริงของระบบ Photo Evidence</p></section><section className="media-page"><div className="media-copy"><Camera size={30}/><h2>รูปเข้า เอกสารออก</h2><p>เหมาะกับงานที่ต้องแนบภาพหลายใบ เช่น ภาพสถานที่ ภาพของกลาง หรือภาพความเสียหาย โปรแกรมช่วยเรียงรูป ใส่ข้อความกำกับ และแสดงตัวอย่างก่อนสร้างเอกสาร</p><div><span>เพิ่มรูปหลายไฟล์</span><span>จัดลำดับภาพ</span><span>สร้าง .docx</span></div><a href="/trial/drugs/">ทดลองใช้ในระบบ <ArrowRight size={16}/></a></div><div className="media-showcase"><img src="/screenshots/app/photo-evidence-real.png?v=20260805-photo"/></div></section></main>
}

function CrimeScenePageContent(){
 return <main><section className="subpage-hero"><span>CRIME SCENE MAP</span><h1>แผนที่เกิดเหตุ วาดให้เห็นภาพแบบเข้าใจทันที</h1><p>หน้าแผนที่เกิดเหตุรองรับทั้งคดีจราจรและคดีอาญา โดยภาพหลักด้านล่างใช้รูปรถจากงานคดีจราจรตามที่ต้องการ</p></section><section className="media-page scene-page"><div className="media-copy"><MapPinned size={30}/><h2>คดีจราจร: วาดถนน รถ จุดชน และทิศทาง</h2><p>ใช้วางรถ ถนน กรวย จุดชน เส้นทาง และสัญลักษณ์สำคัญ เพื่อให้เอกสารสำนวนอ่านแล้วเห็นภาพ ไม่ต้องอธิบายยาวซ้ำหลายรอบ</p><div><span>รูปรถ</span><span>จุดชน</span><span>แนวถนน</span><span>ส่งออกแผนที่</span></div><a href="/trial/drugs/">ทดลองใช้ในระบบ <ArrowRight size={16}/></a></div><div className="media-showcase main-scene"><img src="/screenshots/app/traffic-scene-map.png?v=20260805-car"/></div></section><section className="media-gallery"><article><img src="/screenshots/app/criminal-scene-map.png?v=20260805-room"/><div><h3>คดีอาญา</h3><p>วาดผังบ้าน ห้อง จุดพบของ และตำแหน่งสำคัญในสถานที่เกิดเหตุ</p></div></article><article><img src="/screenshots/app/traffic-scene-map.png?v=20260805-car"/><div><h3>คดีจราจร</h3><p>วาดรถ ถนน กรวย และจุดเฉี่ยวชนสำหรับประกอบสำนวนจราจร</p></div></article></section></main>
}

function TrafficFinePageContent(){
 return <main><section className="subpage-hero"><span>TRAFFIC FINE ORDER</span><h1>ปรับพินัยจราจร จัดข้อมูลค่าปรับให้เป็นชุดเดียว</h1><p>ฟีเจอร์พิเศษสำหรับคดีจราจร ใช้บันทึกข้อมูลผู้ถูกกล่าวหา สรุปพฤติการณ์ หนังสือแจ้งข้อกล่าวหา คำสั่งปรับ และสถานะการชำระค่าปรับ</p></section><section className="media-page scene-page"><div className="media-copy"><Scale size={30}/><h2>จากข้อมูลคดี ไปเป็นคำสั่งปรับ</h2><p>หน้าเดียวเก็บครบตั้งแต่เลขคดี เลขคำสั่งปรับ จำนวนเงิน วันแจ้ง วิธีส่งหนังสือ และผลการชำระ ช่วยให้การติดตามงานปรับพินัยไม่หล่นกลางทาง</p><div><span>เลขหนังสือ</span><span>ค่าปรับ</span><span>กำหนดชำระ</span><span>สถานะ</span></div><a href="/trial/drugs/">ทดลองใช้ในระบบ <ArrowRight size={16}/></a></div><div className="media-showcase main-scene"><img src="/screenshots/app/traffic-fine.png?v=20260805-fine"/></div></section></main>
}

function DownloadBand(){return <section id="download" className="download-band release-band"><div><span>DOWNLOAD</span><h2>ดาวน์โหลดโปรแกรม Windows</h2><p>ติดตั้งด้วยไฟล์ .exe แล้วเข้าสู่ระบบด้วยบัญชี CAT-ALYSIM ของคุณ</p><small>เวอร์ชัน {release.installerVersion}</small></div><div><a className="btn-light download-exe" href={release.installerUrl}>ดาวน์โหลด .exe <Download size={18}/></a></div></section>}

export default function MarketingSite({page='home'}:{page?:PageMode}){
 const [menu,setMenu]=useState(false),[userMenu,setUserMenu]=useState(false),[auth,setAuth]=useState<AuthContext|null>(null);
 useEffect(()=>{getCurrentUser().then(setAuth).catch(()=>setAuth(null))},[]);
 const name=useMemo(()=>userLabel(auth),[auth]);
 async function signOut(){await logout();setAuth(null);setUserMenu(false);window.location.href='/'}
 return <div className="marketing-site"><Header auth={auth} name={name} userMenu={userMenu} setUserMenu={setUserMenu} menu={menu} setMenu={setMenu} signOut={signOut}/>{page==='program'?<ProgramPageContent/>:page==='features'?<FeaturesPageContent/>:page==='photoEvidence'?<PhotoEvidencePageContent/>:page==='crimeScene'?<CrimeScenePageContent/>:page==='trafficFine'?<TrafficFinePageContent/>:<HomePage/>}<Footer/></div>
}
