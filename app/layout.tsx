import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CAT-ALYSIM | Project Showcase",
  description:
    "หน้าเว็บแนะนำโปรเจกต์ CAT-ALYSIM สำหรับอธิบายระบบ, ดูภาพหน้าจอ, และดาวน์โหลดแอปเดสก์ท็อป",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
