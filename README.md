# CAT-ALYSIM Showcase Website

เว็บตัวนี้ถูกทำใหม่ให้เหลือหน้าที่หลักแค่ 3 อย่าง:

1. อธิบายโปรเจกต์ CAT-ALYSIM
2. แสดงภาพหน้าจอของระบบจริง
3. ปล่อยไฟล์ดาวน์โหลดแอปเดสก์ท็อป

## เหมาะกับอะไร

- แทนเว็บเก่าที่มีระบบสมาชิก / แชท / backend / supabase เยอะเกินจำเป็น
- ใช้เป็น landing page แบบเรียบแต่ดูมีของ
- Deploy ขึ้น Vercel หรือ GitHub ได้ตรง ๆ

## วิธีรัน

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

## วิธี deploy ใหม่แบบล้างของเก่า

### ถ้าใช้ GitHub repo เดิม

1. ลบไฟล์ใน repo เดิมให้หมด หรือสร้าง branch ใหม่ก็ได้
2. เอาไฟล์โปรเจกต์ชุดนี้ลงแทนทั้งหมด
3. commit และ push ขึ้น GitHub
4. ใน Vercel เลือก redeploy project เดิม หรือสร้าง project ใหม่จาก repo นี้

### ถ้าอยากเริ่ม repo ใหม่เลย

```bash
git init
git add .
git commit -m "reset site: new CAT-ALYSIM showcase"
git branch -M main
git remote add origin <YOUR_NEW_REPO_URL>
git push -u origin main
```

## เรื่องไฟล์ดาวน์โหลด

ปุ่มดาวน์โหลดตอนนี้อ้างถึงไฟล์นี้:

```text
public/downloads/CAT-ALYSIM-Setup.exe
```

ให้เอาไฟล์ติดตั้งจริงของแอปมาวางที่ path นี้ หรือแก้ชื่อไฟล์ใน `app/page.tsx`

## โครงสร้าง

- `app/page.tsx` หน้า landing page หลัก
- `app/globals.css` สไตล์ทั้งหมด
- `public/screenshots/` ภาพหน้าจอจากระบบจริง
- `public/downloads/` ใส่ไฟล์ setup ของจริง

## แนะนำรอบต่อไป

ถ้าจะเพิ่มอะไร เพิ่มแค่นี้พอ:

- changelog แบบสั้น ๆ
- ปุ่มคู่มือ / วิดีโอสาธิต
- ลิงก์ติดต่อ

อย่างอื่นถ้ายังไม่จำเป็น อย่าเพิ่งยัด เดี๋ยวเว็บจะกลับไปอ้วนอีก
