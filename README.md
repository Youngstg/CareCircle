# 💙 CareCircle — Family & Caregiver Coordination Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live%20Production-success?style=for-the-badge" alt="Production Status" />
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  <img src="https://img.shields.io/badge/Storage-MinIO%20S3-C72C48?style=for-the-badge&logo=minio" alt="MinIO" />
  <img src="https://img.shields.io/badge/Auth-Better%20Auth-purple?style=for-the-badge" alt="Better Auth" />
</p>

<p align="center">
  <strong>Platform koordinasi perawatan keluarga yang aman dan kolaboratif. Membantu keluarga dan perawat membagi tugas harian, menjadwalkan obat, mencatat perkembangan, dan mengarsipkan dokumen penting dalam satu lingkaran privat.</strong>
</p>

<p align="center">
  🌐 <strong>Live Demo:</strong> <a href="https://carecircle.mooo.com" target="_blank">https://carecircle.mooo.com</a>
</p>

---

## 💡 Latar Belakang & Masalah

Merawat anggota keluarga yang sakit atau lanjut usia sering kali menimbulkan *caregiver burnout*. Informasi jadwal obat, kontrol dokter, dan dokumen medis kerap tercecer di grup chat keluarga yang bising. Tidak ada pembagian tugas yang jelas mengenai siapa yang bertanggung jawab untuk setiap kebutuhan perawatan.

**CareCircle hadir untuk merapikan koordinasi tersebut:**
* Menyatukan seluruh caregiver dalam satu ruang privat (*Care Circle*).
* Memastikan tidak ada jadwal obat atau terapi yang terlewatkan.
* Mengamankan dokumen keluarga dengan enkripsi dan kontrol akses ketat.

---

## ✨ Fitur Unggulan

### 1. 👥 Multi-Role Care Circle Management
* **Role-Based Access Control (RBAC):** Struktur peran bertingkat: `OWNER` (pengelola utama), `COORDINATOR` (perawat/keluarga inti), dan `MEMBER` (keluarga pendamping).
* **Secure Invite System:** Undangan bergabung berbasis token dengan masa kedaluwarsa untuk memastikan privasi keluarga tetap terjaga.

### 2. 📋 Task Delegation & Smart Checklist
* Pembagian tugas perawatan harian (membeli obat, kontrol ke klinik, menyiapkan makanan) dengan penugasan spesifik (*assignee*).
* Checklist interaktif dengan riwayat siapa yang menyelesaikan tugas dan pencatatan waktu (*timestamp*) yang akurat.

### 3. 🗓️ Schedule & Routine Medication Reminders
* Penjadwalan agenda kunjungan medis, fisioterapi, dan rutinitas pengobatan berkala.
* Tampilan kalender intuitif yang sinkron antar seluruh anggota lingkaran perawatan.

### 4. 🔒 Private Document Vault (S3 & MinIO Compatible)
* Penyimpanan dokumen resep, hasil laboratorium, dan kartu asuransi dalam bucket privat terenkripsi.
* **Presigned Secure URLs:** File tidak pernah diekspos secara publik; akses unduhan hanya dapat dibuka oleh anggota terverifikasi melalui URL bertanda tangan kriptografis dengan masa aktif terbatas.

### 5. 📜 Transparent Activity Audit Trail
* Setiap aksi penting (penambahan tugas, penyelesaian checklist, pengunggahan dokumen, pinning catatan) dicatat ke dalam log aktivitas kronologis untuk mencegah miskomunikasi antar keluarga.

---

## 🏗️ Arsitektur Sistem

```
[ Pengguna Web / Mobile ]
            │
            ▼
   [ Nginx Reverse Proxy (SSL/TLS Let's Encrypt) ]
            │
            ▼
   [ Next.js 16 Production Runtime (Node.js 22) ]
      ├── Server Actions & React 19 Server Components
      ├── Better-Auth Session & Credential Layer
      └── Prisma ORM Engine
            │
     ┌──────┴────────────────────────┐
     ▼                               ▼
[ MySQL 8 Database ]     [ MinIO S3 Object Storage ]
  ├── User & Membership    └── Encrypted Document Vault
  ├── Tasks & Schedules         (Presigned Signed URLs)
  └── Activity Audits
```

---

## 🛠️ Tech Stack

* **Fullstack Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
* **Frontend:** [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
* **Database & ORM:** [MySQL 8.0](https://www.mysql.com/), [Prisma ORM 6](https://www.prisma.io/)
* **Object Storage:** [MinIO](https://min.io/) (S3-Compatible Object Store) via AWS SDK v3
* **Authentication:** [Better Auth](https://better-auth.com/) (Email & Password + OAuth Ready)
* **Validation:** [Zod](https://zod.dev/)
* **Testing:** [Vitest](https://vitest.dev/), Testing Library
* **Infrastructure & CI/CD:** Ubuntu Linux, Nginx, PM2, GitHub Actions Automated Pipeline

---

## 📄 Lisensi

Dibuat dengan kepedulian tinggi untuk membantu keluarga di seluruh dunia saling terhubung dan merawat dengan lebih baik.  
© 2026 **CareCircle Platform**. Seluruh hak cipta dilindungi.
