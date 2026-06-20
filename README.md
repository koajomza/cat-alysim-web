CAT-ALYSIM Space Energy Orb v34 + Mobile Separate Entry

วิธีเปิดแบบง่าย:
1. Desktop: ดับเบิลคลิก index.html หรือรัน `npm run desktop`
2. Mobile แยก: เปิด `mobile.html` หรือรัน `npm run mobile`
3. เปิดให้มือถือจริงในวง Wi‑Fi เดียวกัน: รัน `npm run dev` แล้วเอา URL ที่เป็น Network ไปเปิดในมือถือ และเติม `/mobile.html`

สิ่งที่เพิ่มในแพตช์นี้:
- เพิ่ม `mobile.html` เป็นหน้า mobile entry แยกจาก desktop landing
- เพิ่ม `mobile.css` สำหรับ layout มือถือโดยเฉพาะ แตะง่าย sticky tab โหลดเบากว่า
- เพิ่ม `mobile.js` สำหรับเมนูมือถือ ไม่ผูกกับ three.js/robot เพื่อไม่ให้มือถือหนัก
- เพิ่ม npm scripts: `npm run mobile` และ `npm run desktop`
- ไม่ยุ่งกับ `index.html`, `styles.css`, `landing.js`, `app.js` ของ desktop หลัก

หมายเหตุ:
- หน้า mobile ใช้เป็นหน้าแยก ไม่ใช่ media query ทับ desktop
- ถ้าจะ deploy ขึ้น Vercel เปิดได้ที่ `/mobile.html`

## Cloudflare Pages Build Settings

ใช้แบบ Vite multi-page ไม่ต้องใช้ static root:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: เว้นว่าง

ไฟล์ `vite.config.js` ตั้งค่าให้ build หลายหน้า เช่น `index.html`, `mobile.html`, `feature.html`, `download.html`, `about.html`, `contact.html`, `guide.html`, `plans.html` และ copy ไฟล์ runtime ที่ต้องใช้ (`app.js`, `landing.js`, `mobile.js`, `robot.glb`) เข้า `dist` ให้ด้วย
