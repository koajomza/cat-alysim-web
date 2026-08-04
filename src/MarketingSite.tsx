import {useEffect,useMemo,useState} from 'react';
import {ArrowRight,BookOpen,CalendarDays,Camera,ChevronDown,CreditCard,Database,Download,FileText,FolderSearch,Link2,LogIn,LogOut,MapPinned,Menu,MessageSquareText,Monitor,Search,ShieldCheck,Sparkles,UserPlus,UsersRound,WandSparkles,X} from 'lucide-react';
import {getCurrentUser,logout,type AuthContext} from './auth';

type PageMode='home'|'program'|'features';

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

const featurePages=[
 {id:'feature-arrest',icon:Sparkles,title:'จับกุมสู่คดี',short:'โยนบันทึกจับกุมแล้วสร้างคดี',text:'เอาบันทึกจับกุมหรือข้อความคดีใส่เข้ามา แล้วให้ระบบช่วยอ่านข้อมูลสำคัญเพื่อตั้งต้นคดี ลดเวลาพิมพ์ตั้งแต่หน้าแรกของสำนวน',img:'/screenshots/mockups/arrest-import.svg?v=mock-20260805'},
 {id:'feature-linkage',icon:Link2,title:'Linkage Center',short:'เพิ่มบุคคลจากข้อมูลเดิม',text:'ค้นและดึงข้อมูลบุคคลที่เคยใช้แล้วมาเป็นผู้กล่าวหา ผู้ต้องหา หรือพยานในคดีใหม่ ทำให้ข้อมูลชื่อและรายละเอียดไม่หลุดกัน',img:'/screenshots/app/criminal-people.png'},
 {id:'feature-case-info',icon:FileText,title:'Case Info Builder',short:'กรอกข้อมูลคดีเป็นหมวด',text:'หน้าข้อมูลคดีรวมช่องสำคัญ เช่น อำนาจสั่งคดี อำนาจศาล อัยการ ข้อหา และความเห็นคดี เพื่อให้เอกสารปลายทางมีข้อมูลครบ',img:'/screenshots/app/criminal-info.png'},
 {id:'feature-book',icon:BookOpen,title:'Book Tab Document',short:'สร้างเอกสารจากแท็บ Book',text:'เลือกแม่แบบเอกสาร กรอกข้อมูลตามช่อง แล้วสร้างไฟล์ Word จากข้อมูลคดี ไม่ต้องไล่คัดลอกทีละฉบับ',img:'/screenshots/app/forms.png'},
 {id:'feature-property',icon:Database,title:'Evidence & Property',short:'ทรัพย์สินและของกลาง',text:'เก็บเลขที่ยึด วันยึด รายการของกลาง และทรัพย์ถูกประทุษร้ายไว้เป็นตารางเดียว ตรวจง่ายและนำไปออกเอกสารได้',img:'/screenshots/app/criminal-property.png'},
 {id:'feature-imprison',icon:CalendarDays,title:'Custody Timeline',short:'ฝากขังและประกัน',text:'คำนวณรอบฝากขัง เก็บคำร้อง ศาล สถานะผู้ต้องหา และข้อมูลประกัน ช่วยไม่ให้พลาดวันสำคัญ',img:'/screenshots/app/criminal-imprison.png'},
 {id:'feature-criminal-map',icon:MapPinned,title:'Crime Scene Map',short:'แผนที่เกิดเหตุคดีอาญา',text:'สำหรับคดีอาญา ใช้วาดห้อง จุดพบของ จุดเกิดเหตุ และตำแหน่งสำคัญในบ้านหรือสถานที่เกิดเหตุ',img:'/screenshots/app/criminal-scene-map.png'},
 {id:'feature-traffic-map',icon:MapPinned,title:'Traffic Scene Map',short:'แผนที่เกิดเหตุคดีจราจร',text:'สำหรับคดีจราจร ใช้วาดถนน รถ จุดชน กรวย และทิศทางการเคลื่อนที่ เพื่อประกอบสำนวนให้เห็นภาพชัด',img:'/screenshots/app/traffic-scene-map.png'},
 {id:'feature-photo',icon:Camera,title:'Photo Evidence',short:'ภาพถ่ายประกอบคดี',text:'ลากรูปเข้าโปรแกรม จัดลำดับ ใส่คำอธิบาย แล้วสร้างเอกสารภาพถ่ายประกอบคดีเป็นไฟล์ Word ได้ทันที',img:'/screenshots/app/photo-evidence-real.png'},
 {id:'feature-community',icon:UsersRound,title:'CAT Exchange',short:'คอมมูนิตี้แบ่งปันฟอร์ม',text:'แชร์ชุดคำถาม ข้อหา ฟอร์ม หรือชุดข้อมูลตัวอย่างให้ทีมใช้ต่อ ช่วยให้ของดีไม่หายไปกับเครื่องใครเครื่องหนึ่ง',img:'/screenshots/app/community.png'},
 {id:'feature-chat',icon:MessageSquareText,title:'Team Chat Workspace',short:'แชทและส่งไฟล์ในทีม',text:'คุยงาน ส่งไฟล์ เปิดไฟล์ และเก็บประวัติการสื่อสารไว้ใกล้กับพื้นที่ทำงานของโปรแกรม',img:'/screenshots/app/chat.png'},
 {id:'feature-ocr',icon:WandSparkles,title:'Typhoon OCR',short:'อ่านรูปและ PDF เป็นข้อความ',text:'อัปโหลดภาพหรือ PDF แล้วถอดเป็นข้อความ ตาราง หรือ Markdown เพื่อนำไปตรวจทานและใช้ต่อในเอกสาร',img:'/screenshots/app/ocr.png'},
 {id:'feature-calendar',icon:CalendarDays,title:'Duty Calendar',short:'ตารางเวรและนัดหมาย',text:'ดูเวร งานคดี วันนัด และสิ่งที่ต้องทำเป็นปฏิทินรายเดือน กันลืมงานสำคัญ',img:'/screenshots/app/calendar.png'},
 {id:'feature-search',icon:Search,title:'Deep Search',short:'ค้นลึกทั้งระบบ',text:'ค้นจากเลขคดี ชื่อคน ข้อหา memo คำให้การ และสถานที่เกิดเหตุ แล้วกดกลับไปยังคดีที่เกี่ยวข้องได้ทันที',img:'/screenshots/app/deep-search.png'}
];

const downloadFacts=['เวอร์ชันล่าสุด '+release.version,'Installer bootstrap '+release.installerVersion,'ลิงก์ตรงจาก GitHub Release'];
function userLabel(ctx:AuthContext|null){const p=ctx?.profile||{};const value=p.username||p.display_name||p.full_name||ctx?.user.email;return typeof value==='string'&&value?value.split('@')[0]:'ผู้ใช้'}

function Header({auth,name,userMenu,setUserMenu,menu,setMenu,signOut}:{auth:AuthContext|null;name:string;userMenu:boolean;setUserMenu:(v:boolean|((v:boolean)=>boolean))=>void;menu:boolean;setMenu:(v:boolean|((v:boolean)=>boolean))=>void;signOut:()=>void}){
 const authActions=auth?<div className="user-nav"><button className="user-nav-button polished" onClick={()=>setUserMenu(v=>!v)}><span className="user-mini-avatar">{name.slice(0,1).toUpperCase()}</span><span className="user-mini-copy"><b>{name}</b><small>บัญชีพร้อมใช้งาน</small></span><ChevronDown size={15}/></button>{userMenu&&<div className="user-dropdown"><a href="/trial/drugs/"><FileText size={16}/>เข้า Trial Drugs</a><a href="/payment/"><CreditCard size={16}/>ชำระเงิน</a><a href="/#download"><Download size={16}/>ดาวน์โหลดโปรแกรม</a><button onClick={signOut}><LogOut size={16}/>ออกจากระบบ</button></div>}</div>:<><a className="nav-login" href="/trial/drugs/?auth=login"><LogIn size={16}/>เข้าสู่ระบบ</a><a className="nav-trial" href="/trial/drugs/?auth=signup"><UserPlus size={16}/>สมัครสมาชิก</a></>;
 return <header className="marketing-header product-nav"><a className="marketing-brand" href="/"><img src="/cat-alysim-mark.png"/><strong>CAT-ALYSIM</strong></a><nav className={menu?'open':''}><a href="/">หน้าแรก</a><div className="nav-dropdown"><a href="/program/">โปรแกรม <ChevronDown size={14}/></a><div>{programPages.map(({id,icon:Icon,title,text})=><a href={`/program/#${id}`} key={id}><Icon size={17}/><span><b>{title}</b><small>{text}</small></span></a>)}</div></div><div className="nav-dropdown wide"><a href="/features/">ฟีเจอร์ <ChevronDown size={14}/></a><div>{featurePages.map(({id,icon:Icon,title,short})=><a href={`/features/#${id}`} key={id}><Icon size={17}/><span><b>{title}</b><small>{short}</small></span></a>)}</div></div><a href="/payment/"><CreditCard size={15}/>ชำระเงิน</a><a href="/#download">ดาวน์โหลด</a><a href="/trial/drugs/">ทดลองระบบ</a></nav><div className="marketing-actions">{authActions}<button onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button></div></header>
}

function Footer(){return <footer className="marketing-footer"><div><a className="marketing-brand footer-brand" href="/"><img src="/cat-alysim-mark.png"/><strong>CAT-ALYSIM</strong></a><p>ระบบจัดการคดีและสร้างเอกสารสำหรับงานสอบสวน</p></div><div><b>เมนูหลัก</b><a href="/">หน้าแรก</a><a href="/program/">โปรแกรม</a><a href="/features/">ฟีเจอร์</a><a href="/payment/">ชำระเงิน</a></div><div><b>ใช้งาน</b><a href="/trial/drugs/?auth=login">เข้าสู่ระบบ</a><a href="/trial/drugs/?auth=signup">สมัครสมาชิก</a><a href="/trial/drugs/">ทดลองระบบ</a></div><div><b>Release</b><a href={release.releaseUrl}>GitHub Releases</a><a href={release.latestJson}>latest.json</a><span>Version {release.version}</span></div></footer>}

function HomePage(){
 return <main><section id="home" className="marketing-hero"><div className="hero-orb orb-a"/><div className="hero-orb orb-b"/><div className="marketing-copy"><span className="marketing-kicker"><Sparkles size={16}/> โปรแกรมจัดสำนวนและเอกสารสอบสวน</span><h1><span>CAT-ALYSIM</span><em>จัดคดีให้เป็นระบบ</em><span>ตั้งแต่รับเรื่องถึงออกเอกสาร</span></h1><p>หน้าแรกนี้เป็นประตูเข้าโปรแกรม: เลือกดูหน้าโปรแกรมแบบเต็ม ดูฟีเจอร์แยกเป็นหมวด ชำระเงิน ดาวน์โหลดตัวติดตั้ง หรือเข้า Trial Drugs หลังล็อกอิน</p><div className="marketing-buttons"><a className="btn-solid" href="/program/"><Monitor size={18}/>ดูหน้าโปรแกรม</a><a className="btn-outline" href="/features/"><Sparkles size={18}/>ดูฟีเจอร์ทั้งหมด</a><a className="btn-outline" href={release.installerUrl}><Download size={18}/>ดาวน์โหลด</a></div><div className="hero-facts">{downloadFacts.map(t=><span key={t}><ShieldCheck/> {t}</span>)}</div></div><div className="marketing-preview"><div className="preview-window"><div className="preview-bar"><i/><i/><i/><span>CAT-ALYSIM · Case Command Center</span></div><img src="/screenshots/app/case-overview-small.png"/></div><div className="preview-chip chip-one"><b>14</b><span>ฟีเจอร์หลัก</span></div><div className="preview-chip chip-two"><b>3</b><span>หมวดคดี</span></div></div></section><section className="home-choice-section"><a href="/program/"><Monitor size={26}/><h2>โปรแกรม</h2><p>ดูหน้าโปรแกรม คดีอาญา คดียาเสพติด และคดีจราจรแบบเต็มหน้า</p><ArrowRight size={18}/></a><a href="/features/"><Sparkles size={26}/><h2>ฟีเจอร์</h2><p>ดูฟีเจอร์ย่อยทั้งหมดพร้อมรูปหน้าจอและคำอธิบายการใช้งาน</p><ArrowRight size={18}/></a><a href="/payment/"><CreditCard size={26}/><h2>ชำระเงิน</h2><p>หน้าเตรียมแพ็กเกจและ Serial โดยต้องล็อกอินก่อนเข้าใช้งาน</p><ArrowRight size={18}/></a></section><DownloadBand/></main>
}

function ProgramPageContent(){
 return <main><section className="subpage-hero"><span>PROGRAM</span><h1>หน้าโปรแกรมของ CAT-ALYSIM</h1><p>แยกเป็นหน้าของตัวเองแล้ว: หน้าโปรแกรมรวม, คดีอาญา, คดียาเสพติด และคดีจราจร พร้อมภาพที่ตรงกับงานแต่ละหมวด</p></section><section id="program" className="marketing-section program-section subpage-section"><div className="program-list">{programPages.map(({id,icon:Icon,title,text,img},i)=><article id={id} className="program-panel" key={id}><div className="program-copy"><span>{String(i+1).padStart(2,'0')} <Icon size={15}/></span><h3>{title}</h3><p>{text}</p><a href="/trial/drugs/">ทดลองหน้านี้ <ArrowRight size={16}/></a></div><div className="program-image"><img src={img}/></div></article>)}</div></section></main>
}

function FeaturesPageContent(){
 return <main><section className="subpage-hero"><span>FEATURES</span><h1>ฟีเจอร์สำคัญที่แยกดูได้ทีละอย่าง</h1><p>แต่ละฟีเจอร์มีชื่อ รูป และคำอธิบายชัดเจน กดจาก dropdown แล้วกระโดดมาดูจุดนั้นได้ทันที</p></section><section id="features" className="marketing-section feature-page-section subpage-section"><div className="feature-page-grid">{featurePages.map(({id,icon:Icon,title,short,text,img})=><article id={id} key={id} className="feature-page-card"><div className="feature-page-image"><img src={img}/></div><div className="feature-page-copy"><span><Icon size={16}/>{short}</span><h3>{title}</h3><p>{text}</p></div></article>)}</div></section></main>
}

function DownloadBand(){return <section id="download" className="download-band release-band"><div><span>DOWNLOAD</span><h2>ดาวน์โหลดจาก GitHub Release โดยตรง</h2><p>เวอร์ชันล่าสุด {release.version} ระบบอัปเดตของแอพอ่าน `latest.json` จาก release เดียวกัน</p><small>Installer bootstrap: {release.installerVersion}</small></div><div><a className="btn-light" href={release.installerUrl}>ดาวน์โหลด Installer <Download size={18}/></a><a className="btn-ghost-light" href={release.fullZipUrl}>ดาวน์โหลด Full ZIP <ArrowRight size={18}/></a><a className="btn-ghost-light" href={release.releaseUrl}>เปิดหน้า Release <ArrowRight size={18}/></a></div></section>}

export default function MarketingSite({page='home'}:{page?:PageMode}){
 const [menu,setMenu]=useState(false),[userMenu,setUserMenu]=useState(false),[auth,setAuth]=useState<AuthContext|null>(null);
 useEffect(()=>{getCurrentUser().then(setAuth).catch(()=>setAuth(null))},[]);
 const name=useMemo(()=>userLabel(auth),[auth]);
 async function signOut(){await logout();setAuth(null);setUserMenu(false);window.location.href='/'}
 return <div className="marketing-site"><Header auth={auth} name={name} userMenu={userMenu} setUserMenu={setUserMenu} menu={menu} setMenu={setMenu} signOut={signOut}/>{page==='program'?<ProgramPageContent/>:page==='features'?<FeaturesPageContent/>:<HomePage/>}<Footer/></div>
}
