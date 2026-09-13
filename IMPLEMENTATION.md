# CareCircle — Database and Deployment Implementation

Dokumen ini mencatat implementasi persistence MySQL dan deployment. Sumber kebenaran schema adalah `prisma/schema.prisma`; SQL awal berada di `prisma/migrations/20260913000000_init_mysql/migration.sql`.

## Batas implementasi

- Prisma 6 menggunakan connector MySQL.
- Better Auth menggunakan Prisma adapter dan model inti `User`, `Session`, `Account`, `Verification`.
- Domain yang persisten mencakup circle, membership, task, metadata dokumen privat, dan activity event.
- Otorisasi antar-circle tetap wajib dilakukan pada server untuk setiap query/mutation. MySQL tidak menyediakan kebijakan row-level aplikasi secara otomatis.

## Kontrak model

### Better Auth

Model inti mempertahankan nama field yang diperlukan adapter, termasuk `User.id/name/email/image`, token session unik, account provider, dan verification identifier. Menghapus `User` menghapus session, account, dan membership terkait. Circle/task yang dibuat user memakai `Restrict` agar audit ownership tidak hilang secara implisit.

### Circle

- `CareCircle`: `id`, `name`, `createdById`, timestamps, dan relasi `createdBy`.
- `CircleMember`: `circleId`, `userId`, `role`, timestamps.
- Pasangan `(circleId, userId)` unik.
- Menghapus circle menghapus membership, task, document, dan event di dalam circle.

Role disimpan sebagai `OWNER`, `COORDINATOR`, atau `MEMBER`, selaras dengan nilai yang digunakan aplikasi.

### Task

`Task` memiliki `id`, `circleId`, `title`, `description`, `assigneeId`, `createdById`, `status`, `priority`, `dueAt`, `completedAt`, `completedById`, `createdAt`, dan `updatedAt`. Relasi object bernama `assignedTo`, `createdBy`, dan `completedBy`.

- Status: `OPEN`, `IN_PROGRESS`, `COMPLETED`, atau `CANCELLED`.
- Prioritas: `LOW`, `NORMAL`, `HIGH`, atau `URGENT`; UI saat ini memetakan `HIGH`/`URGENT` menjadi penting.
- Assignee/completer yang dihapus menjadi `NULL` agar task tetap ada.
- Creator memakai `Restrict`.
- Index mendukung daftar task circle, urutan completion/due date, assignee, creator, completer, dan filter prioritas.

### Document

`Document` hanya menyimpan metadata: `id`, `circleId`, `title`, `category` string, `originalName`, `objectKey` unik, `mimeType`, `sizeBytes`, `note` opsional, `uploaderId`, dan timestamps. Isi binary berada di bucket MinIO privat `carecircle-documents`, bukan MySQL. Index `(circleId, category, createdAt)` mendukung listing/filter circle dan index `uploaderId` mendukung audit uploader. Circle deletion memakai `Cascade`; uploader memakai `Restrict` agar atribusi tidak hilang.

Kebijakan upload adalah maksimum 10 MB dan hanya PDF, JPEG/JPG, PNG, atau WebP. Implementasi server wajib memvalidasi membership circle, ukuran, MIME dan magic bytes, menghasilkan object key acak, serta tidak mempercayai `originalName` untuk path. Bucket/object tidak boleh dibuat publik.

### ActivityEvent

Event menyimpan `circleId`, actor opsional, task opsional, document opsional, `type`, metadata JSON opsional, dan `createdAt`. Event ikut terhapus bersama circle; actor/task/document yang dihapus menjadi `NULL`. Metadata tidak boleh menjadi tempat menyimpan secret, presigned URL, atau data sensitif yang tidak diperlukan.

## Alur migration

### Development/Laragon

1. Buat database `carecircle` dengan charset `utf8mb4`.
2. Set `DATABASE_URL` di `.env.local`.
3. Jalankan `npm run db:migrate`.
4. Commit schema dan migration yang dihasilkan setelah direview.

### Staging/production

1. Backup dan verifikasi kemampuan restore.
2. Build artifact/image dari revision yang sama dengan migration.
3. Jalankan `npm run db:deploy` satu kali pada tahap deployment.
4. Jalankan smoke test autentikasi, pembuatan circle, create/complete task, dan isolasi antar-circle.
5. Rollback aplikasi bila perlu; rollback database harus berupa migration maju yang sudah direncanakan, bukan menghapus tabel secara spontan.

Migration awal hanya cocok untuk database target kosong. Bila migration dengan nama tersebut pernah diterapkan dalam bentuk berbeda, jangan edit history pada database itu: buat migration koreksi baru atau bangun ulang database development yang disposable.

`20260913020000_add_private_documents` adalah migration additive setelah `20260913010000_add_circle_invites`. Migration ini membuat metadata `Document` dan menambahkan relasi nullable `ActivityEvent.documentId`; tidak ada migration lama yang diubah dan tidak ada object file yang dipindahkan otomatis.

## Migrasi data sistem lama

Gunakan pipeline export-transform-import terpisah dari migration schema. Pertahankan referential integrity dan urutan parent sebelum child. Credential hanya boleh dipindahkan bila format hash serta metadata kompatibel dan telah diverifikasi; jangan membuat account password fiktif atau password default. Bila kompatibilitas tidak dapat dibuktikan, gunakan reset password/registrasi ulang.

Checklist verifikasi cutover:

- count dan checksum/sampling record;
- email unik dan normalisasi yang konsisten;
- tidak ada orphan membership/task/event;
- role dan priority berada dalam enum MySQL;
- timestamp ditafsirkan dalam zona waktu yang benar;
- user tidak dapat membaca atau memutasi circle lain;
- backup final sumber tersedia dan dapat direstore.

## Seed

Seed menerima `SEED_USER_EMAIL` milik user yang sudah mendaftar. Seed tidak membuat record autentikasi atau credential. Data yang dibuat bersifat fiktif dan seed berhenti bila user sudah memiliki membership.

## Operasional Docker

`Dockerfile` memakai build multi-stage dan menjalankan proses sebagai user non-root. Image tetap menyertakan Prisma CLI karena startup menerapkan committed migrations. `docker-compose.yml` menyediakan:

- MySQL 8.4 dengan persistent volume dan healthcheck;
- MinIO dengan persistent volume `minio_data`, healthcheck, dan bucket privat yang dibuat idempoten oleh service `minio-init` (`minio/mc`);
- aplikasi yang menunggu database dan MinIO sehat serta inisialisasi bucket selesai;
- healthcheck HTTP aplikasi;
- database pada internal network tanpa published port;
- bind aplikasi, API MinIO, dan console MinIO ke loopback; console tidak boleh dipublikasikan atau dipasang di reverse proxy.

Container aplikasi memakai endpoint internal `http://minio:9000`. Proses development yang berjalan di host memakai `http://127.0.0.1:9000`; `localhost` dari container tidak menunjuk ke service MinIO. Laragon dapat tetap menyediakan MySQL sementara hanya `minio` dan `minio-init` dijalankan melalui Compose.

Semua secret diberikan saat runtime melalui environment Compose. Secret tidak boleh dimasukkan ke image layer, source control, atau nama image.

## Production readiness

- Gunakan HTTPS pada reverse proxy dan origin Better Auth yang tepat.
- Untuk remote MySQL, wajibkan TLS terverifikasi dan firewall/private networking.
- Jalankan backup terenkripsi off-host untuk MySQL dan seluruh object MinIO, lalu lakukan restore drill yang memverifikasi kecocokan `Document.objectKey`.
- Pantau kegagalan migration, healthcheck, kapasitas disk/volume, koneksi database, dan backup.
- Terapkan least privilege pada user MySQL aplikasi.
- Review retensi `ActivityEvent` dan dokumen, minimisasi metadata, audit akses, dan pertimbangkan pemindaian malware.
- Tidak ada enkripsi di layer aplikasi: wajibkan TLS pada trafik pengguna, disk/volume VPS terenkripsi, dan backup terenkripsi; gunakan SSE/KMS bila threat model membutuhkannya.
- Reverse proxy hanya aplikasi melalui HTTPS. Jangan mengekspos MySQL, API MinIO, atau console MinIO ke internet.
- Uji upgrade MySQL/Prisma pada staging sebelum production.
