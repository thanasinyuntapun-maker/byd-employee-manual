# BYD Employee Manual — คู่มือความรู้พนักงาน BYD

เว็บคู่มือความรู้พนักงาน BYD แบบ **single-page HTML** (offline ใช้ได้ ไม่ต้องมีเซิร์ฟเวอร์) รวบรวมเนื้อหาจาก **คอร์สอบรมเทคนิคของ BYD** และข้อมูลรถจาก **Rever Automotive** — สำหรับใช้อ้างอิง/เทรนนิ่งภายใน

> โปรเจกต์นี้พัฒนาในบริบทการฝึกงานที่ Rever Automotive (ตัวแทนจำหน่าย BYD ในไทย)

---

## 🚀 วิธีเปิดใช้งาน

เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ใดก็ได้ (ดับเบิลคลิก) — ไม่ต้องติดตั้งอะไร ทุกอย่าง (ฟอนต์/ภาพ) เก็บแบบ self-hosted ในโฟลเดอร์

```
open index.html      # macOS
```

---

## 📁 โครงสร้างโฟลเดอร์

```
BYD_Employee_Manual/
├── index.html          # ตัวคู่มือ (เปิดไฟล์นี้)
├── README.md           # ไฟล์นี้
├── assets/
│   ├── *.png           # 414 ภาพสไลด์ (เรนเดอร์จาก PDF คอร์ส BYD)
│   └── fonts/          # ฟอนต์ DB Heavent Now (แบบเดียวกับ Rever)
├── source_text/        # ข้อความดิบที่ดึงจาก PDF คอร์ส 9 ไฟล์ (อ้างอิง)
└── graphify-out/       # Knowledge graph ของเนื้อหาคอร์ส
    ├── graph.html      #   กราฟ interactive (เปิดในเบราว์เซอร์)
    ├── GRAPH_REPORT.md #   รายงานวิเคราะห์
    └── graph.json      #   ข้อมูลกราฟดิบ
```

---

## 📚 เนื้อหาในคู่มือ (เมนูด้านซ้าย)

| กลุ่ม | หัวข้อ |
|-------|--------|
| **ภาพรวม** | ประวัติ BYD · อุตสาหกรรมหลัก · เทคโนโลยี · แบรนด์ในเครือ |
| **รุ่นรถ** | ภาพรวมรุ่น · ATTO 3 · DOLPHIN · SEAL · **สเปครถทุกรุ่น (10 รุ่น)** |
| **บำรุงรักษา** | การบำรุงรักษา · การชาร์จ |
| **เทคโนโลยีเชิงลึก** | แชสซีส์ · Blade Battery · 8in1 Powertrain · ระบบไฟฟ้าแรงสูง (HV) · ระบบไฟฟ้าแรงต่ำ (CAN/OBD) · ระบบจัดการอุณหภูมิ · **การทดสอบทางวิศวกรรม** · เปรียบเทียบคู่แข่ง |
| **ระบบบริการช่าง** | BYD TIS System · การแจ้งปัญหา (Fault Feedback — Rever) |
| **อ้างอิง** | BYD Thailand · คำศัพท์ (Glossary) |

---

## 🎨 ดีไซน์

- **ฟอนต์:** DB Heavent Now (ฟอนต์เดียวกับเว็บ reverautomotive.com — self-hosted ใน `assets/fonts/`)
- **ธีมสี:** แดง Rever `#d70c19` (ปรับผ่าน CSS variable `--byd-red` ที่เดียว)
- **Responsive:** sidebar ยุบบนจอมือถือ

---

## 🗂 แหล่งข้อมูล

| ข้อมูล | ที่มา |
|--------|-------|
| เนื้อหาเทคนิค + ภาพสไลด์ | คอร์สอบรม BYD 9 โมดูล (Company, Models, Chassis, Low/High Voltage, Thermal, Maintenance, TIS, Fault Feedback) |
| สเปครถ 10 รุ่น | หน้า `tech-spec` ของ reverautomotive.com (ดึงจาก `__NEXT_DATA__`) |
| มาตรฐานทดสอบระยะทาง | คอร์ส BYD (NEDC / WLTP / CLTC / EPA) |

> ⚠️ **หมายเหตุลิขสิทธิ์:** เนื้อหาและภาพเป็นของ BYD / Rever Automotive — ใช้เพื่อการอ้างอิงและเทรนนิ่งภายในเท่านั้น

---

## 🕸 Knowledge Graph (graphify-out/)

เนื้อหาคอร์สถูกแปลงเป็น knowledge graph: **173 concepts · 187 ความสัมพันธ์ · 15 กลุ่มหัวข้อ**

- เปิด `graphify-out/graph.html` เพื่อสำรวจแบบ interactive
- อัปเดตเมื่อแก้ไฟล์ใน `source_text/`: `/graphify source_text --update`
- ถามกราฟ: `/graphify query "คำถาม"`

---

## 🔧 การบำรุงรักษาโปรเจกต์

- **เพิ่ม/แก้เนื้อหา:** แก้ใน `index.html` โดยตรง (section ใช้ class เดิม: `.section`, `.fig`, `.spec-table`, `.info-box`, `.tech-grid`)
- **เพิ่มภาพสไลด์:** เรนเดอร์จาก PDF ด้วย `pdftoppm -png -r 95 <pdf> assets/<prefix>` แล้วอ้างอิงด้วย `<div class="fig">`
- **อัปเดตสเปกรถ:** ดึงใหม่จากหน้า `tech-spec` ของ Rever (ข้อมูลใน `__NEXT_DATA__`)
