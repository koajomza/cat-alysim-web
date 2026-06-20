const sections = {
  feature: {
    icon: '✦',
    label: 'FEATURE',
    subtitle: 'ระบบหลักที่ใช้ประจำ',
    page: 'feature.html',
    subs: [
      {
        key: 'overview',
        label: 'Overview',
        kicker: 'FEATURE / OVERVIEW',
        title: 'ฟีเจอร์หลักของ CAT-ALYSIM',
        desc: 'รวม workflow งานคดี บุคคล หลักฐาน เอกสาร และ AI support ไว้ในที่เดียว ลดการกรอกซ้ำและลดเวลางานเอกสารที่กินชีวิตแบบโหดเกินเหตุ',
        items: ['จัดการข้อมูลคดีแบบรวมศูนย์', 'เก็บข้อมูลผู้กล่าวหา ผู้ต้องหา พยาน และทรัพย์', 'Generate เอกสาร Word จาก Template', 'เชื่อมข้อมูลข้ามโมดูลให้ใช้ซ้ำได้'],
        actions: [['เปิดหน้า Feature', 'feature.html'], ['ดูคู่มือเริ่มต้น', 'guide.html']]
      },
      {
        key: 'ocr',
        label: 'OCR',
        kicker: 'FEATURE / OCR',
        title: 'อ่านเอกสารแล้วดึงข้อมูลสำคัญ',
        desc: 'รองรับการอ่านข้อมูลจากเอกสารหรือรูปภาพ แล้วช่วยแยกชื่อ วันที่ เลขคดี รายละเอียดสำคัญ ก่อนส่งเข้าฟอร์มหรือ template',
        items: ['อ่านข้อความจากเอกสาร', 'ช่วยดึง field สำคัญ', 'ลดการพิมพ์มือ', 'ต่อยอดเข้าระบบ parser ได้'],
        actions: [['ดู Workflow', 'guide.html'], ['อ่าน Feature เพิ่ม', 'feature.html']]
      },
      {
        key: 'word',
        label: 'Generate Word',
        kicker: 'FEATURE / DOCUMENT ENGINE',
        title: 'สร้างเอกสาร Word จาก Template',
        desc: 'ดึงข้อมูลคดีและบุคคลไปใส่ template อัตโนมัติ ให้เอกสารออกมาสม่ำเสมอและแก้ต่อใน Word ได้ ไม่ต้องนั่ง copy paste วนจนตาลาย',
        items: ['รองรับ template หลายประเภท', 'เติมข้อมูลจากฐานคดี', 'ลด placeholder หลุด', 'ส่งออกเป็นไฟล์ Word พร้อมใช้งาน'],
        actions: [['ดูตัวอย่างเอกสาร', 'feature.html'], ['เริ่มใช้งาน', 'guide.html']]
      },
      {
        key: 'parse',
        label: 'Smart Parsing',
        kicker: 'FEATURE / SMART PARSING',
        title: 'แปลงข้อความดิบให้เป็นข้อมูลจัดหมวด',
        desc: 'เอาข้อความจากบันทึกหรือเอกสารมาแยกเป็นผู้กล่าวหา ผู้ต้องหา พยาน ทรัพย์ วันเวลา และสถานที่ เพื่อเอาไปใช้ต่อในระบบได้ทันที',
        items: ['แยกบุคคลตามบทบาท', 'ดึงวัน เวลา สถานที่', 'เก็บทรัพย์และรายการสำคัญ', 'ลดการย้ายข้อมูลเองแบบนรกแตก'],
        actions: [['ดู Feature', 'feature.html']]
      },
      {
        key: 'case',
        label: 'Case Management',
        kicker: 'FEATURE / CASE MANAGEMENT',
        title: 'จัดการคดีให้เป็นระบบเดียว',
        desc: 'ออกแบบให้คดีไม่กระจัดกระจาย ข้อมูลหลัก ข้อมูลบุคคล ทรัพย์ เอกสาร และการ generate ถูกวางเป็น workflow เดียวกัน',
        items: ['ข้อมูลคดีหลัก', 'ข้อมูลบุคคลที่เกี่ยวข้อง', 'ข้อมูลทรัพย์และหลักฐาน', 'ค้นหาและแก้ไขย้อนหลังได้ง่าย'],
        actions: [['อ่าน Guide', 'guide.html']]
      },
      {
        key: 'linking',
        label: 'Data Linking',
        kicker: 'FEATURE / DATA LINKING',
        title: 'เชื่อมคดี คน เอกสาร และทรัพย์',
        desc: 'ข้อมูลที่กรอกครั้งเดียวควรถูกใช้ซ้ำได้หลายเอกสาร ไม่ใช่กรอกใหม่ทุกหน้าเหมือนโดนลงโทษจากจักรวาล',
        items: ['ลดข้อมูลซ้ำ', 'เชื่อม person / property / document', 'ใช้ข้อมูลร่วมกับ template', 'ลดความผิดพลาดตอนสร้างเอกสาร'],
        actions: [['ดูภาพรวม Feature', 'feature.html']]
      }
    ]
  },
  download: {
    icon: '⬇',
    label: 'DOWNLOAD',
    subtitle: 'โหลดเวอร์ชันล่าสุด',
    page: 'download.html',
    subs: [
      {
        key: 'latest',
        label: 'Latest Version',
        kicker: 'DOWNLOAD / LATEST',
        title: 'ดาวน์โหลดเวอร์ชันล่าสุด',
        desc: 'พื้นที่สำหรับปล่อยตัวติดตั้ง Windows, Portable และไฟล์อัปเดต ให้ผู้ใช้โหลดได้จากจุดเดียวแบบไม่ต้องขุดหาเอง',
        items: ['Windows Installer สำหรับติดตั้งจริง', 'Portable x64 สำหรับทดลองใช้งาน', 'แยกเวอร์ชันให้ตามอัปเดตง่าย', 'ปุ่มดาวน์โหลดเด่นและชัดเจน'],
        actions: [['เปิดหน้า Download', 'download.html'], ['ดูสิ่งที่ต้องมีในเครื่อง', 'download.html#requirements']]
      },
      {
        key: 'release',
        label: 'Release Notes',
        kicker: 'DOWNLOAD / RELEASE NOTES',
        title: 'บันทึกการอัปเดตแต่ละรุ่น',
        desc: 'แสดงว่าเวอร์ชันนี้แก้อะไร เพิ่มอะไร และมีข้อควรระวังอะไรบ้าง จะได้ไม่อัปเดตแล้วงงว่าชีวิตเปลี่ยนตรงไหน',
        items: ['รายการฟีเจอร์ใหม่', 'รายการแก้บั๊ก', 'breaking changes ถ้ามี', 'วันที่ปล่อยเวอร์ชัน'],
        actions: [['ดู Changelog', 'download.html']]
      },
      {
        key: 'requirements',
        label: 'System Requirements',
        kicker: 'DOWNLOAD / REQUIREMENTS',
        title: 'สเปกขั้นต่ำที่ควรมี',
        desc: 'สรุปสิ่งที่เครื่องต้องมีเพื่อให้ CAT-ALYSIM ทำงานลื่น ไม่ใช่เปิดแล้วหมุนเหมือนกำลังติดต่อยานแม่',
        items: ['Windows 10/11', 'RAM ขั้นต่ำตามแพ็กเกจ', 'พื้นที่เก็บไฟล์และ template', 'สิทธิ์เขียนไฟล์ในโฟลเดอร์ข้อมูล'],
        actions: [['ดูรายละเอียด', 'download.html#requirements']]
      },
      {
        key: 'install',
        label: 'Installation',
        kicker: 'DOWNLOAD / INSTALLATION',
        title: 'ติดตั้งให้จบแบบไม่หลง',
        desc: 'ทำเป็น step ชัด ๆ ตั้งแต่ดาวน์โหลด แตกไฟล์ ติดตั้ง เปิดครั้งแรก และตั้งค่าโฟลเดอร์/ฐานข้อมูล',
        items: ['ดาวน์โหลดไฟล์ล่าสุด', 'แตกไฟล์หรือติดตั้ง', 'เปิดโปรแกรมครั้งแรก', 'ตั้งค่า template และ output path'],
        actions: [['ดูวิธีติดตั้ง', 'guide.html']]
      },
      {
        key: 'older',
        label: 'Older Versions',
        kicker: 'DOWNLOAD / ARCHIVE',
        title: 'เก็บเวอร์ชันเก่าเผื่อ rollback',
        desc: 'มี archive สำหรับกรณีเวอร์ชันล่าสุดยังไม่เข้ากับเครื่องหรือ workflow บางชุด จะได้ถอยกลับได้ ไม่ต้องนั่งน้ำตาซึม',
        items: ['เวอร์ชันก่อนหน้า', 'หมายเหตุ compatibility', 'วันที่ release', 'คำเตือนก่อน downgrade'],
        actions: [['เปิดหน้า Download', 'download.html']]
      }
    ]
  },
  about: {
    icon: '◈',
    label: 'ABOUT US',
    subtitle: 'แนวคิดและทีมพัฒนา',
    page: 'about.html',
    subs: [
      {
        key: 'origin',
        label: 'ความเป็นมา',
        kicker: 'ABOUT / ORIGIN',
        title: 'ระบบที่เกิดมาเพื่อลดงานซ้ำ',
        desc: 'CAT-ALYSIM วางตัวเป็นผู้ช่วยงานคดีและเอกสาร ไม่ได้มาแทนคนทำงาน แต่มาช่วยตัดงานกรอกซ้ำ งานจัดรูปแบบ และงานค้นข้อมูลที่กินเวลาเกินจำเป็น',
        items: ['เกิดจากปัญหางานเอกสารซ้ำ', 'โฟกัส workflow ไทย', 'ออกแบบให้ใช้กับงานจริง', 'ขยายต่อได้เป็นโมดูล'],
        actions: [['อ่าน About Us', 'about.html'], ['ดู Feature', 'feature.html']]
      },
      {
        key: 'vision',
        label: 'Vision',
        kicker: 'ABOUT / VISION',
        title: 'เป้าหมายคือทำงานให้เร็วขึ้น ไม่ใช่ซับซ้อนขึ้น',
        desc: 'หน้าต้องง่าย ข้อมูลต้องไหล เอกสารต้องออก และคนใช้ต้องไม่รู้สึกว่ากำลังสู้กับระบบราชการเวอร์ชันดิจิทัลอีกชั้น',
        items: ['ลดงานกรอกซ้ำ', 'รวมข้อมูลไว้ที่เดียว', 'เอกสารออกไวขึ้น', 'UI ต้องอ่านง่ายและไม่รก'],
        actions: [['ดูแนวคิดเพิ่มเติม', 'about.html']]
      },
      {
        key: 'team',
        label: 'Team',
        kicker: 'ABOUT / TEAM',
        title: 'ทีมและบทบาทการพัฒนา',
        desc: 'แบ่งภาพรวมของคนทำงาน ตั้งแต่ UX/UI, backend, template, parser และการทดสอบ workflow ให้ระบบไม่สวยแต่รูป จูบไม่หอม',
        items: ['Product / Workflow', 'UX/UI Design', 'Backend & Parser', 'Document Template'],
        actions: [['เปิด About', 'about.html']]
      },
      {
        key: 'uxui',
        label: 'UX/UI Designer',
        kicker: 'ABOUT / UX UI',
        title: 'ออกแบบให้คนทำงานไม่ต้องเดา',
        desc: 'โฟกัสการวางข้อมูล ปุ่ม ลำดับงาน และสถานะให้ชัด ลดหน้าที่ต้องจำเอง เพราะระบบที่ดีไม่ควรให้ผู้ใช้แบกทุกอย่าง',
        items: ['ลด visual noise', 'จัดกลุ่มข้อมูลตามงานจริง', 'ทำ responsive ไม่พังง่าย', 'ปรับ micro-interaction ให้ใช้งานสนุกขึ้น'],
        actions: [['ดู About', 'about.html']]
      },
      {
        key: 'backend',
        label: 'Backend Developer',
        kicker: 'ABOUT / BACKEND',
        title: 'ตัวหลังบ้านที่ทำให้ข้อมูลไม่หลุดวงโคจร',
        desc: 'ดูแล logic, parser, database, template engine และระบบ generate เอกสาร ให้ frontend ไม่ใช่แค่หน้าสวย ๆ ที่ข้างในกลวง',
        items: ['Data model', 'Parser logic', 'Template rendering', 'Output management'],
        actions: [['ดู Feature', 'feature.html']]
      },
      {
        key: 'creator',
        label: 'About the Creator',
        kicker: 'ABOUT / CREATOR',
        title: 'เกี่ยวกับผู้ผลิตและแนวคิดการสร้าง',
        desc: 'เล่าความตั้งใจของผู้สร้าง ระบบนี้ควรช่วยแก้ปัญหาจริง ไม่ใช่แค่ทำให้ landing page ดูวิ้ง ๆ แล้วจบ พูดละเจ็บแต่จริง',
        items: ['เข้าใจ workflow จากงานจริง', 'แก้ pain point ทีละจุด', 'ทำระบบให้ขยายได้', 'รับ feedback จากการใช้งานจริง'],
        actions: [['อ่าน About', 'about.html'], ['ติดต่อเรา', 'contact.html']]
      }
    ]
  },
  contact: {
    icon: '✉',
    label: 'CONTACT US',
    subtitle: 'ติดต่อและแจ้งปัญหา',
    page: 'contact.html',
    subs: [
      {
        key: 'social',
        label: 'Social Profiles',
        kicker: 'CONTACT / SOCIAL',
        title: 'ช่องทางติดต่อและโปรไฟล์',
        desc: 'รวมช่องทางติดต่อหลักสำหรับ support, ติดตามอัปเดต, ส่งตัวอย่างเอกสาร หรือคุยเรื่องฟีเจอร์ใหม่',
        items: ['LINE / Facebook / Email', 'หน้าอัปเดตข่าวสาร', 'ช่องทางแจ้งปัญหา', 'ช่องทางส่งตัวอย่าง template'],
        actions: [['เปิดหน้า Contact', 'contact.html'], ['อ่าน Guide ก่อน', 'guide.html']]
      },
      {
        key: 'request',
        label: 'Send Request',
        kicker: 'CONTACT / REQUEST',
        title: 'ส่งคำร้องขอฟีเจอร์หรือการปรับระบบ',
        desc: 'ทำ mockup form สำหรับขอฟีเจอร์ใหม่ เช่น เพิ่ม template, เพิ่ม parser, เพิ่ม field หรือปรับ UI ที่ใช้งานจริงแล้วยังขัดใจ',
        items: ['ขอเพิ่มฟีเจอร์', 'ส่งตัวอย่างฟอร์ม', 'แนบปัญหา workflow', 'ระบุความเร่งด่วน'],
        actions: [['ส่งคำร้อง', 'contact.html']]
      },
      {
        key: 'issue',
        label: 'Report Issue',
        kicker: 'CONTACT / ISSUE',
        title: 'แจ้งบั๊กแบบทีม dev อ่านแล้วไม่ร้องไห้',
        desc: 'ให้ผู้ใช้แจ้งปัญหาพร้อมขั้นตอนเกิด bug, รูปหน้าจอ, เวอร์ชัน และไฟล์ที่เกี่ยวข้อง เพื่อให้แก้ได้ตรงจุด ไม่ต้องเดาสุ่มเหมือนหมอดูสาย IT',
        items: ['เวอร์ชันโปรแกรม', 'ขั้นตอนที่ทำให้เกิดปัญหา', 'รูปหน้าจอหรือไฟล์ตัวอย่าง', 'ผลลัพธ์ที่คาดหวัง'],
        actions: [['แจ้งปัญหา', 'contact.html']]
      },
      {
        key: 'support',
        label: 'Support Channel',
        kicker: 'CONTACT / SUPPORT',
        title: 'ช่องทางช่วยเหลือการใช้งาน',
        desc: 'รวมข้อมูล support, เวลาตอบกลับ, วิธีส่งไฟล์ และคำแนะนำเบื้องต้นก่อนแจ้งปัญหา',
        items: ['วิธีส่งไฟล์ตัวอย่าง', 'คำถามที่ต้องตอบตอนแจ้งบั๊ก', 'support hours', 'ข้อควรระวังเรื่องข้อมูลจริง'],
        actions: [['ดู Contact', 'contact.html']]
      },
      {
        key: 'feedback',
        label: 'Feedback',
        kicker: 'CONTACT / FEEDBACK',
        title: 'ส่ง feedback เพื่อให้ระบบไม่ออกทะเล',
        desc: 'เปิดพื้นที่ให้ผู้ใช้บอกว่าส่วนไหนดี ส่วนไหนรก ส่วนไหนควรตัด และส่วนไหนควรทำเพิ่ม เพราะ dev เดาเองหมดก็พังได้เหมือนกัน',
        items: ['โหวตฟีเจอร์ที่อยากได้', 'แนะนำ UI', 'แจ้งจุดที่ใช้ยาก', 'เสนอ workflow ใหม่'],
        actions: [['ส่ง Feedback', 'contact.html']]
      }
    ]
  },
  guide: {
    icon: '?',
    label: 'GUIDE',
    subtitle: 'เริ่มใช้งานเร็ว',
    page: 'guide.html',
    subs: [
      {
        key: 'quick',
        label: 'Quick Start',
        kicker: 'GUIDE / QUICK START',
        title: 'เริ่มใช้งานแบบไม่หลงดาว',
        desc: 'สรุป flow จากสร้างคดี ใส่บุคคล เพิ่มหลักฐาน เลือก template แล้ว generate เอกสารออกมาใช้งาน',
        items: ['สร้างคดีใหม่', 'เพิ่มบุคคลที่เกี่ยวข้อง', 'เพิ่มทรัพย์หรือหลักฐาน', 'เลือก template แล้ว generate'],
        actions: [['เปิดหน้า Guide', 'guide.html'], ['ดาวน์โหลดโปรแกรม', 'download.html']]
      },
      {
        key: 'create',
        label: 'Create Case',
        kicker: 'GUIDE / CREATE CASE',
        title: 'สร้างคดีและใส่ข้อมูลพื้นฐาน',
        desc: 'เริ่มจากเลขคดี ฐานความผิด วันเวลา สถานที่ และพฤติการณ์ เพื่อเป็นฐานให้ข้อมูลส่วนอื่นเอาไปใช้ต่อ',
        items: ['ระบุเลขคดี', 'ใส่ข้อหาและกฎหมาย', 'บันทึกวันเวลาและสถานที่', 'ใส่พฤติการณ์หลัก'],
        actions: [['ดู Guide', 'guide.html']]
      },
      {
        key: 'people',
        label: 'Add People',
        kicker: 'GUIDE / PEOPLE',
        title: 'เพิ่มผู้กล่าวหา ผู้ต้องหา และพยาน',
        desc: 'เก็บข้อมูลบุคคลให้พร้อมใช้กับเอกสารหลายชุด ลดการคัดลอกชื่อ ที่อยู่ เบอร์โทร และสถานะซ้ำไปซ้ำมา',
        items: ['ผู้กล่าวหา', 'ผู้ต้องหา', 'พยาน', 'ผู้มอบอำนาจ / บริษัท'],
        actions: [['อ่านต่อ', 'guide.html']]
      },
      {
        key: 'evidence',
        label: 'Add Evidence',
        kicker: 'GUIDE / EVIDENCE',
        title: 'เพิ่มทรัพย์ หลักฐาน และของกลาง',
        desc: 'จัดรายการทรัพย์หรือหลักฐานให้เอาไปออกบัญชีและเอกสารที่เกี่ยวข้องได้ง่ายขึ้น',
        items: ['รายการทรัพย์', 'ของกลาง', 'วันเวลายึด/รับคืน', 'สถานะคืนหรือไม่ได้คืน'],
        actions: [['ดูขั้นตอน', 'guide.html']]
      },
      {
        key: 'generate',
        label: 'Generate Document',
        kicker: 'GUIDE / GENERATE',
        title: 'เลือก Template แล้วสร้างเอกสาร',
        desc: 'เมื่อข้อมูลพร้อม ระบบจะนำ field ไปใส่ template แล้วสร้าง Word ให้ตรวจต่อ ไม่ต้องนั่งไล่แทนค่าทุกช่องเอง',
        items: ['เลือกประเภทเอกสาร', 'ตรวจข้อมูลก่อน generate', 'สร้างไฟล์ Word', 'เปิดตรวจใน Word'],
        actions: [['ดูคู่มือ Generate', 'guide.html']]
      },
      {
        key: 'export',
        label: 'Export / Save',
        kicker: 'GUIDE / EXPORT',
        title: 'บันทึกและส่งออกไฟล์ให้เป็นระเบียบ',
        desc: 'จัด output ตามเลขคดีหรือหมวดเอกสาร เพื่อให้ค้นหาไฟล์ย้อนหลังได้ง่าย ไม่ใช่กองไฟล์บน Desktop จนเหมือนสุสาน docx',
        items: ['ตั้งโฟลเดอร์ output', 'แยกไฟล์ตามคดี', 'ตรวจชื่อไฟล์', 'สำรองข้อมูล'],
        actions: [['อ่าน Guide', 'guide.html']]
      }
    ]
  },
  plans: {
    icon: '◆',
    label: 'PLANS',
    subtitle: 'แพ็กเกจและโปรแกรม',
    page: 'plans.html',
    subs: [
      {
        key: 'overview',
        label: 'Overview',
        kicker: 'PLANS / OVERVIEW',
        title: 'เลือกแพ็กเกจให้เข้ากับงานจริง',
        desc: 'แยกแผนการใช้งานตามขนาดทีมและ workflow ตั้งแต่ใช้งานพื้นฐานคนเดียว ไปจนถึงทีมที่ต้อง sync ข้อมูลและจัดสิทธิ์',
        items: ['Basic สำหรับเริ่มต้น', 'Pro สำหรับ workflow หนักขึ้น', 'Team สำหรับหลายผู้ใช้', 'Compare Plans เพื่อเทียบฟีเจอร์'],
        actions: [['เปิดหน้า Plans', 'plans.html'], ['ติดต่อเพื่อปรับแพ็กเกจ', 'contact.html']]
      },
      {
        key: 'basic',
        label: 'Basic',
        kicker: 'PLANS / BASIC',
        title: 'Basic — ใช้ฟีเจอร์หลักแบบเบาเครื่อง',
        desc: 'เหมาะกับการจัดคดี สร้างเอกสารพื้นฐาน และใช้งานคนเดียว เน้นคุ้มและไม่ซับซ้อน',
        items: ['จัดการคดีพื้นฐาน', 'สร้างเอกสารจาก template', 'เก็บข้อมูลบุคคลและทรัพย์', 'เหมาะกับเริ่มใช้งาน'],
        actions: [['ดู Basic', 'plans.html']]
      },
      {
        key: 'pro',
        label: 'Pro',
        kicker: 'PLANS / PRO',
        title: 'Pro — สำหรับงานเอกสารและ parser ที่หนักขึ้น',
        desc: 'เพิ่มเครื่องมือช่วยอ่าน/แปลงข้อมูล, template ขั้นสูง และ workflow ที่ต้องลดงานซ้ำจริงจัง',
        items: ['OCR / Smart Parsing', 'Template ขั้นสูง', 'ฟีเจอร์ช่วยตรวจข้อมูล', 'เหมาะกับ power user'],
        actions: [['ดู Pro', 'plans.html']]
      },
      {
        key: 'team',
        label: 'Team',
        kicker: 'PLANS / TEAM',
        title: 'Team — ใช้หลายเครื่อง หลายคน และ sync งาน',
        desc: 'สำหรับทีมที่ต้องแชร์ข้อมูลหรือใช้งานหลายเครื่อง มีแนวคิดเรื่อง workspace, permission และ sync ที่ชัดเจนขึ้น',
        items: ['หลายผู้ใช้', 'shared workspace', 'สิทธิ์การเข้าถึง', 'sync ข้อมูลระหว่างเครื่อง'],
        actions: [['ติดต่อเรื่อง Team', 'contact.html']]
      },
      {
        key: 'compare',
        label: 'Compare Plans',
        kicker: 'PLANS / COMPARE',
        title: 'เทียบแผนให้เห็นชัดว่าอะไรต่างกัน',
        desc: 'แสดงตารางเทียบฟีเจอร์หลัก เช่น เอกสาร, OCR, parser, sync, support และจำนวนผู้ใช้ เพื่อให้เลือกง่ายขึ้น',
        items: ['ตารางเทียบฟีเจอร์', 'จำนวนผู้ใช้', 'ระดับ support', 'ความสามารถ sync'],
        actions: [['ดูตารางเทียบ', 'plans.html']]
      },
      {
        key: 'faq',
        label: 'FAQ',
        kicker: 'PLANS / FAQ',
        title: 'คำถามพบบ่อยเรื่องแพ็กเกจ',
        desc: 'ตอบเรื่องไลเซนส์ เครื่องที่ใช้ได้ การย้ายเครื่อง อัปเดต และกรณีอยาก sync หลายเครื่อง',
        items: ['ย้ายเครื่องได้ไหม', 'ใช้หลายเครื่องยังไง', 'อัปเดตฟรีหรือไม่', 'ต้องต่ออายุเมื่อไร'],
        actions: [['อ่าน FAQ', 'plans.html'], ['ถามเพิ่มเติม', 'contact.html']]
      }
    ]
  }
};

const landingNodes = [...document.querySelectorAll('.landing-node')];
const allSectionButtons = [...document.querySelectorAll('[data-panel]')];
const panel = document.getElementById('expandPanel');
const kicker = document.getElementById('panelKicker');
const title = document.getElementById('panelTitle');
const text = document.getElementById('panelText');
const list = document.getElementById('panelList');
const actions = document.getElementById('panelActions');
const back = document.getElementById('backBtn');
const subNav = document.getElementById('subNav');
const currentIcon = document.getElementById('currentIcon');
const currentTitle = document.getElementById('currentTitle');
const currentDesc = document.getElementById('currentDesc');

let activeSection = 'feature';
let activeSub = 'overview';

function getSection(key) {
  return sections[key] || sections.feature;
}

function getSub(section, subKey) {
  return section.subs.find(item => item.key === subKey) || section.subs[0];
}

function renderSubNav(section, subKey) {
  if (!subNav) return;
  subNav.innerHTML = '';

  section.subs.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sub-btn';
    btn.dataset.sub = item.key;
    btn.innerHTML = `<span>${item.label}</span>`;
    btn.addEventListener('click', () => setPanel(activeSection, item.key, true));
    subNav.appendChild(btn);
  });

  subNav.querySelectorAll('.sub-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.sub === subKey);
  });
}

function renderPanel(sub) {
  if (!panel || !kicker || !title || !text || !list || !actions) return;

  kicker.textContent = sub.kicker;
  title.textContent = sub.title;
  text.textContent = sub.desc;

  list.innerHTML = '';
  (sub.items || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });

  actions.innerHTML = '';
  (sub.actions || []).forEach((action, index) => {
    const a = document.createElement('a');
    a.href = action[1] || '#';
    a.textContent = action[0];
    a.className = index === 0 ? 'action-primary' : 'action-secondary';
    actions.appendChild(a);
  });
}

function syncActiveStyles(sectionKey, subKey) {
  document.body.dataset.activePanel = sectionKey;

  allSectionButtons.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.panel === sectionKey);
  });

  subNav?.querySelectorAll('.sub-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.sub === subKey);
  });
}

function setPanel(sectionKey, subKey, open = false) {
  const normalizedKey = sections[sectionKey] ? sectionKey : 'feature';
  const section = getSection(normalizedKey);
  const normalizedSub = subKey || section.subs[0].key;
  const sub = getSub(section, normalizedSub);

  activeSection = normalizedKey;
  activeSub = sub.key;

  if (currentIcon) currentIcon.textContent = section.icon;
  if (currentTitle) currentTitle.textContent = section.label;
  if (currentDesc) currentDesc.textContent = section.subtitle;

  renderSubNav(section, activeSub);
  renderPanel(sub);
  syncActiveStyles(activeSection, activeSub);

  if (open) {
    document.body.classList.add('detail-open');
    panel?.classList.remove('zoom-flash');
    if (panel) void panel.offsetWidth;
    panel?.classList.add('zoom-flash');
  }
}

landingNodes.forEach(node => {
  node.addEventListener('mouseenter', () => {
    if (!document.body.classList.contains('detail-open')) {
      setPanel(node.dataset.panel, undefined, false);
    }
  });

  node.addEventListener('focus', () => {
    if (!document.body.classList.contains('detail-open')) {
      setPanel(node.dataset.panel, undefined, false);
    }
  });

  node.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    setPanel(node.dataset.panel, undefined, true);
  });
});


back?.addEventListener('click', () => {
  document.body.classList.remove('detail-open');
  setPanel(activeSection, activeSub, false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.body.classList.remove('detail-open');
});

setPanel('feature', 'overview', false);
