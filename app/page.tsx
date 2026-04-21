import Image from "next/image";

type Feature = {
  title: string;
  description: string;
  image: string;
  badge: string;
};

const features: Feature[] = [
  {
    title: "แดชบอร์ดรวมคดี",
    description:
      "ดูภาพรวมคดี รายการโปรด และการแจ้งเตือนในหน้าเดียว ไม่ต้องกดมั่วไปหลายหน้าให้ปวดหัว",
    image: "/screenshots/dashboard.png",
    badge: "Dashboard",
  },
  {
    title: "โปรไฟล์ผู้ใช้งาน",
    description:
      "จัดการข้อมูลผู้ใช้, รูปโปรไฟล์ และข้อมูลสำหรับการสร้างเอกสารได้ในหน้าที่อ่านง่ายขึ้น",
    image: "/screenshots/profile.png",
    badge: "Profile",
  },
  {
    title: "PDAR / Workbench",
    description:
      "กรอกฟอร์ม สร้างข้อความ และจัดการเทมเพลตงานในโครงสร้างที่แยกเป็นระบบ ไม่รกเหมือนยัดทุกอย่างลงหม้อเดียว",
    image: "/screenshots/pdar.png",
    badge: "PDAR",
  },
  {
    title: "จัดการคดี",
    description:
      "แยกโมดูลอาญา จราจร และยาเสพติด พร้อมตัวกรอง สถานะคดี และรายการโปรด",
    image: "/screenshots/cases.png",
    badge: "Cases",
  },
  {
    title: "ตารางเวร",
    description:
      "ดูเวรประจำวัน, บันทึกงาน, และจัดการกิจกรรมจากปฏิทินในหน้าเดียวแบบไม่ต้องเดา UI",
    image: "/screenshots/calendar.png",
    badge: "Calendar",
  },
  {
    title: "คลังคำให้การ / คลังข้อหา / OCR",
    description:
      "มีทั้งศูนย์รวมคำถาม-คำตอบ คลังข้อหา และหน้า OCR สำหรับงานเอกสารที่ต้องใช้บ่อย",
    image: "/screenshots/forms.png",
    badge: "Tools",
  },
];

const extraShots = [
  "/screenshots/law-library.png",
  "/screenshots/ocr.png",
];

const appHighlights = [
  "ออกแบบสำหรับงานเอกสารและการจัดการข้อมูลคดีบนเดสก์ท็อป",
  "มีหน้าแสดงภาพรวมของระบบจริง ไม่ใช่เว็บโม้ลอย ๆ",
  "เว็บนี้ตั้งใจให้เป็นหน้าบ้าน: อธิบายโปรเจกต์ + โหลดแอป + ดูภาพประกอบ",
  "ไม่มีระบบสมาชิก ไม่มีแชท ไม่มี Supabase ไม่มีอะไรแถมมั่ว ๆ",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero section">
        <div className="hero-copy">
          <span className="eyebrow">CAT-ALYSIM PROJECT</span>
          <h1>หน้าเว็บใหม่ แบบคลีน ๆ สำหรับโชว์โปรเจกต์และปล่อยไฟล์ติดตั้ง</h1>
          <p className="hero-text">
            รีเซ็ตใหม่ให้เว็บทำหน้าที่แค่ที่ควรทำ: อธิบายระบบ, โชว์หน้าตาโปรแกรม, และให้ดาวน์โหลดแอปเดสก์ท็อปได้ตรง ๆ
            จบ ไม่ต้องลาก auth/chat/backend มาปนจนเว็บบวมเหมือนยัดทุกอย่างลงหม้อไฟ.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#download">ดาวน์โหลดแอป</a>
            <a className="button secondary" href="#features">ดูฟีเจอร์</a>
          </div>
          <div className="mini-stats">
            <div className="stat-card"><strong>Static-first</strong><span>ไม่มี backend</span></div>
            <div className="stat-card"><strong>Deploy ง่าย</strong><span>โยนขึ้น Vercel/GitHub ได้เลย</span></div>
            <div className="stat-card"><strong>โฟกัสชัด</strong><span>โชว์งาน + โหลดแอป</span></div>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <Image
              src="/screenshots/dashboard.png"
              alt="CAT-ALYSIM dashboard"
              width={1600}
              height={900}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section intro-grid">
        <div className="panel">
          <h2>เว็บนี้ควรมีอะไร</h2>
          <ul className="clean-list">
            {appHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="panel muted">
          <h2>โครงสร้างที่แนะนำ</h2>
          <p>
            หน้าเดียวพอ หรือถ้าจะแยกก็แค่ <strong>Home</strong>, <strong>Features</strong>, <strong>Gallery</strong>, <strong>Download</strong>, <strong>FAQ</strong>.
            แค่นี้เว็บก็มีประโยชน์แล้ว ไม่ต้องเปิดจักรวาล Marvel ของระบบสมาชิก.
          </p>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-head">
          <span className="eyebrow">FEATURES</span>
          <h2>ฟีเจอร์หลักจากตัวโปรแกรม</h2>
          <p>อ้างอิงจากภาพหน้าจอที่มีอยู่จริง เพื่อให้คนเข้าเว็บแล้วเห็นของจริง ไม่ใช่คำโม้ล้วน ๆ</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-image-wrap">
                <span className="feature-badge">{feature.badge}</span>
                <Image src={feature.image} alt={feature.title} width={1200} height={760} />
              </div>
              <div className="feature-copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section gallery-section">
        <div className="section-head">
          <span className="eyebrow">GALLERY</span>
          <h2>ภาพหน้าจอเพิ่มเติม</h2>
        </div>
        <div className="gallery-grid">
          {extraShots.map((src) => (
            <div className="gallery-card" key={src}>
              <Image src={src} alt="ภาพหน้าจอเพิ่มเติมของ CAT-ALYSIM" width={1200} height={760} />
            </div>
          ))}
        </div>
      </section>

      <section className="section download-section" id="download">
        <div className="download-card">
          <div>
            <span className="eyebrow">DOWNLOAD</span>
            <h2>ปล่อยไฟล์ติดตั้งจากหน้าเว็บนี้ได้เลย</h2>
            <p>
              ตอนนี้ปุ่มดาวน์โหลดยิงไปที่ไฟล์ตัวอย่างในโฟลเดอร์ <code>public/downloads</code>.
              ตอนเอาไปใช้จริงก็แค่เอาไฟล์ติดตั้งของมึงไปวางทับ แล้วแก้ชื่อไฟล์ในโค้ดนิดเดียว จบ.
            </p>
          </div>
          <div className="download-actions">
            <a className="button primary large" href="/downloads/CAT-ALYSIM-Setup.exe" download>
              ดาวน์โหลด CAT-ALYSIM สำหรับ Windows
            </a>
            <p className="download-note">* ถ้ายังไม่มีไฟล์ติดตั้ง ให้เอา placeholder ออกก่อน deploy ไม่งั้นปุ่มจะกดแล้วแห้ว</p>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>คำถามที่ควรตอบในเว็บ</h2>
        </div>
        <div className="faq-grid">
          <div className="faq-card">
            <h3>ใช้งานบนอะไร</h3>
            <p>เน้น Windows desktop สำหรับเปิดใช้งานแอปหลัก</p>
          </div>
          <div className="faq-card">
            <h3>ต้องสมัครสมาชิกไหม</h3>
            <p>ไม่ เว็บนี้เป็นหน้าแนะนำและดาวน์โหลด ไม่ได้ทำระบบผู้ใช้บนเว็บ</p>
          </div>
          <div className="faq-card">
            <h3>ข้อมูลจริงอยู่บนเว็บไหม</h3>
            <p>ไม่ เว็บนี้มีไว้โชว์โปรเจกต์และปล่อยไฟล์เท่านั้น ข้อมูลการใช้งานอยู่ที่ตัวแอป</p>
          </div>
        </div>
      </section>
    </main>
  );
}
