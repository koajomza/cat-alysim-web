const mobileSections = {
  feature: {
    icon: '✦', label: 'FEATURE', title: 'ฟีเจอร์หลัก',
    desc: 'รวมระบบอ่านข้อมูล จัดการคดี เชื่อมบุคคล ทรัพย์ และเอกสารไว้ใน flow เดียว',
    cards: [
      { title: 'OCR & Parser', desc: 'อ่านเอกสารแล้วดึงข้อมูลสำคัญเข้าระบบ ลดการคีย์ซ้ำ', items: ['แยกบทบาทบุคคล', 'ดึงวัน เวลา สถานที่', 'เก็บรายการทรัพย์/หลักฐาน'], actions: [['ดู Feature', 'feature.html']] },
      { title: 'Case Management', desc: 'จัดข้อมูลคดีให้เป็นชุดเดียว ค้นง่าย แก้ย้อนหลังง่าย', items: ['ข้อมูลคดีหลัก', 'บุคคลที่เกี่ยวข้อง', 'ทรัพย์และหลักฐาน'], actions: [['อ่าน Guide', 'guide.html']] },
      { title: 'Document Generator', desc: 'ใช้ข้อมูลที่กรอกแล้วสร้างเอกสารจาก template ได้ไวขึ้น', items: ['ลดข้อมูลซ้ำ', 'ลดพิมพ์ผิด', 'ใช้กับหลาย template'], actions: [['ดาวน์โหลด', 'download.html']] }
    ]
  },
  download: {
    icon: '⬇', label: 'DOWNLOAD', title: 'ดาวน์โหลด',
    desc: 'พื้นที่โหลดตัวติดตั้งและไฟล์อัปเดต แยกให้ชัด ไม่ต้องขุดหาเหมือนหาแร่ในดาวอังคาร',
    cards: [
      { title: 'Latest Build', desc: 'โหลดเวอร์ชันล่าสุดสำหรับใช้งานจริง', items: ['Windows Installer', 'Portable x64', 'ไฟล์อัปเดต'], actions: [['เปิด Download', 'download.html']] },
      { title: 'Requirements', desc: 'ดูสเปกขั้นต่ำก่อนติดตั้ง จะได้ไม่เปิดแล้วหมุนเป็นพัดลมดูดวิญญาณ', items: ['Windows 10/11', 'พื้นที่เก็บ template', 'สิทธิ์เขียนไฟล์'], actions: [['ดูสเปก', 'download.html#requirements']] }
    ]
  },
  guide: {
    icon: '?', label: 'GUIDE', title: 'คู่มือเริ่มต้น',
    desc: 'สรุปทางเข้าใช้งานแบบมือถือ อ่านไว แตะไปต่อได้ทันที',
    cards: [
      { title: 'Quick Start', desc: 'เริ่มจากสร้างคดี ใส่บุคคล เพิ่มทรัพย์ เลือก template แล้ว generate', items: ['สร้างคดี', 'เพิ่มบุคคล', 'สร้างเอกสาร'], actions: [['เปิด Guide', 'guide.html']] },
      { title: 'Workflow', desc: 'ลำดับงานที่ควรทำ เพื่อไม่ให้ข้อมูลหลุดหรือซ้ำ', items: ['ตรวจข้อมูลหลัก', 'เช็กบุคคล', 'ตรวจ output'], actions: [['ดู Feature', 'feature.html']] }
    ]
  },
  plans: {
    icon: '◆', label: 'PLANS', title: 'แพ็กเกจ',
    desc: 'แบ่งแผนใช้งานตามขนาดทีมและความต้องการ sync/support',
    cards: [
      { title: 'Basic', desc: 'เหมาะกับใช้งานคนเดียว เอกสารหลักและ workflow พื้นฐาน', items: ['1 เครื่อง', 'template หลัก', 'อัปเดตพื้นฐาน'], actions: [['ดู Plans', 'plans.html']] },
      { title: 'Pro / Team', desc: 'เพิ่มความสามารถ sync, support และฟีเจอร์สำหรับทีม', items: ['หลายเครื่อง', 'sync ข้อมูล', 'support สูงขึ้น'], actions: [['เทียบแพ็กเกจ', 'plans.html']] }
    ]
  },
  about: {
    icon: '◈', label: 'ABOUT', title: 'เกี่ยวกับระบบ',
    desc: 'ทำมาเพื่อลดงานกรอกซ้ำ จัด workflow ให้เป็นระบบ และให้ UI ไม่ทรมานคนใช้',
    cards: [
      { title: 'Origin', desc: 'เกิดจาก pain point งานเอกสารและข้อมูลคดีที่ซ้ำเยอะเกินจำเป็น', items: ['ลดงานซ้ำ', 'ใช้กับงานจริง', 'ขยายเป็นโมดูลได้'], actions: [['อ่าน About', 'about.html']] },
      { title: 'UX/UI', desc: 'วางปุ่มและข้อมูลให้เดาง่าย ไม่ใช่ให้ผู้ใช้เล่นเกมทายใจ dev', items: ['อ่านง่าย', 'แตะง่าย', 'ไม่รก'], actions: [['ติดต่อทีม', 'contact.html']] }
    ]
  },
  contact: {
    icon: '✉', label: 'CONTACT', title: 'ติดต่อเรา',
    desc: 'ช่องทางแจ้งปัญหา ส่ง feedback หรือขอฟีเจอร์ใหม่',
    cards: [
      { title: 'Report Issue', desc: 'แจ้งบั๊กพร้อมขั้นตอน รูปหน้าจอ และเวอร์ชัน', items: ['ขั้นตอนเกิดปัญหา', 'ไฟล์ตัวอย่าง', 'สิ่งที่คาดหวัง'], actions: [['แจ้งปัญหา', 'contact.html']] },
      { title: 'Feedback', desc: 'เสนอจุดที่ควรปรับให้ระบบไม่ออกทะเล', items: ['แนะนำ UI', 'ขอฟีเจอร์', 'ส่งตัวอย่าง template'], actions: [['ส่ง Feedback', 'contact.html']] }
    ]
  }
};

const order = ['feature', 'download', 'guide', 'plans', 'about', 'contact'];
const tabs = document.getElementById('mobileTabs');
const panelIcon = document.getElementById('panelIcon');
const panelKicker = document.getElementById('panelKicker');
const panelTitle = document.getElementById('panelTitle');
const panelDesc = document.getElementById('panelDesc');
const subCardList = document.getElementById('subCardList');

function renderTabs(activeKey) {
  tabs.innerHTML = '';
  order.forEach(key => {
    const section = mobileSections[key];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.textContent = section.label;
    btn.dataset.key = key;
    btn.classList.toggle('selected', key === activeKey);
    btn.addEventListener('click', () => setSection(key));
    tabs.appendChild(btn);
  });
}

function renderCards(cards) {
  subCardList.innerHTML = '';
  cards.forEach(card => {
    const article = document.createElement('article');
    article.className = 'sub-card';
    const items = (card.items || []).map(item => `<li>${item}</li>`).join('');
    const actions = (card.actions || []).map(action => `<a href="${action[1]}">${action[0]}</a>`).join('');
    article.innerHTML = `
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <ul>${items}</ul>
      <div class="card-actions">${actions}</div>
    `;
    subCardList.appendChild(article);
  });
}

function setSection(key) {
  const section = mobileSections[key] || mobileSections.feature;
  document.body.dataset.activePanel = key;
  panelIcon.textContent = section.icon;
  panelKicker.textContent = section.label;
  panelTitle.textContent = section.title;
  panelDesc.textContent = section.desc;
  renderTabs(key);
  renderCards(section.cards);
}

setSection('feature');
