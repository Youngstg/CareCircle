# CareCircle

CareCircle adalah aplikasi koordinasi keluarga non-medis berbasis Next.js, Better Auth, Prisma 6, dan MySQL. Database tidak bergantung pada layanan database tertentu dan dapat dijalankan di Laragon, MySQL terkelola, atau VPS.

## Prasyarat

- Node.js 20+
- npm
- MySQL 8.x
- Docker Desktop/Compose untuk penyimpanan dokumen MinIO

Instal dependensi dan buat Prisma Client:

```bash
npm install
npm run prisma:generate
```

Simpan konfigurasi lokal di `.env.local` dan konfigurasi Compose di `.env`. Jangan commit file tersebut dan jangan gunakan awalan `NEXT_PUBLIC_` untuk secret.

## Laragon (Windows)

1. Jalankan MySQL dari Laragon.
2. Buat database kosong bernama `carecircle` melalui HeidiSQL, phpMyAdmin, atau terminal MySQL:

   ```sql
   CREATE DATABASE carecircle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Buat `.env.local`:

   ```dotenv
   DATABASE_URL="mysql://root:PASSWORD@127.0.0.1:3306/carecircle"
   BETTER_AUTH_SECRET="SECRET_ACAK_MINIMAL_32_KARAKTER"
   BETTER_AUTH_URL="http://localhost:3000"
   MINIO_ENDPOINT="http://127.0.0.1:9000"
   MINIO_REGION="us-east-1"
   MINIO_BUCKET="carecircle-documents"
   MINIO_ACCESS_KEY="CHANGE_ME_dev_minio_access_key"
   MINIO_SECRET_KEY="CHANGE_ME_dev_minio_secret_key_at_least_8_chars"
   MINIO_FORCE_PATH_STYLE="true"
   ```

   Ganti `PASSWORD` dengan password root Laragon. Jika password kosong, bentuk URL-nya `mysql://root:@127.0.0.1:3306/carecircle`. Percent-encode karakter khusus pada username/password.

4. Salin `.env.example` menjadi `.env`, ganti semua nilai `CHANGE_ME`, lalu jalankan **hanya MinIO** melalui Compose. MySQL tetap berjalan di Laragon:

   ```bash
   docker compose up -d minio minio-init
   docker compose ps minio minio-init
   ```

   Bucket privat `carecircle-documents` dibuat idempoten oleh `minio-init`. API tersedia hanya dari host lokal di `http://127.0.0.1:9000`; console admin hanya bind ke localhost di `http://127.0.0.1:9001` dan tidak boleh dipublikasikan.

5. Terapkan migration dan jalankan aplikasi dari host:

   ```bash
   npm run db:migrate
   npm run dev
   ```

`db:migrate` ditujukan untuk development dan dapat membuat migration baru. Jangan memakai `prisma db push` untuk staging atau production.

## Prisma dan model data

`prisma/schema.prisma` menggunakan provider `mysql` dan memuat:

- model inti Better Auth: `User`, `Session`, `Account`, dan `Verification`;
- `CareCircle` serta membership unik `CircleMember(circleId, userId)` dengan role `OWNER`, `COORDINATOR`, atau `MEMBER`;
- `Task` dengan relasi circle, assignee, creator, completer, status, prioritas, tenggat, dan timestamp penyelesaian;
- `Document` untuk metadata dokumen privat dan object key MinIO unik; binary file tidak disimpan di MySQL;
- `ActivityEvent` untuk riwayat aktivitas per circle, termasuk relasi dokumen opsional;
- index untuk query membership, daftar tugas, dokumen, dan aktivitas, plus cascade/restrict/set-null yang eksplisit.

| Script | Kegunaan |
| --- | --- |
| `npm run prisma:generate` | Membuat ulang Prisma Client |
| `npm run db:migrate` | Membuat/menerapkan migration development |
| `npm run db:deploy` | Menerapkan migration yang sudah di-commit |
| `npm run db:seed` | Menambahkan data fiktif secara opsional |
| `npm run postinstall` | Membuat Prisma Client setelah install |

### Seed aman

`prisma/seed.ts` tidak membuat `User`, `Account`, password, session, atau token. Daftarkan user melalui Better Auth terlebih dahulu, kemudian berikan email user tersebut:

```bash
SEED_USER_EMAIL="user@example.com" npm run db:seed
```

Di PowerShell:

```powershell
$env:SEED_USER_EMAIL="user@example.com"; npm run db:seed
```

Tanpa `SEED_USER_EMAIL`, seed berhenti tanpa menulis data. Seed juga berhenti bila user sudah memiliki membership, sehingga tidak menggandakan circle.

## Migrasi data dari database lama

Migration Prisma membuat struktur MySQL baru; migration ini tidak otomatis menyalin data dari sistem lama.

1. Backup sumber dan uji restore sebelum perubahan apa pun.
2. Terapkan schema pada database MySQL kosong dengan `npm run db:deploy`.
3. Ekspor data sumber melalui mekanisme resmi sumber tersebut.
4. Transform ID, timestamp UTC, enum role/prioritas, dan foreign key ke bentuk schema Prisma.
5. Impor berurutan: `User`, data Better Auth yang memang dapat dipertahankan, `CareCircle`, `CircleMember`, `Task`, `Document`, lalu `ActivityEvent`. Salin object dokumen ke bucket privat dan pertahankan pemetaan `objectKey`.
6. Jangan memindahkan password mentah. Jika hash/format credential lama tidak kompatibel dengan Better Auth, paksa reset password atau registrasi ulang.
7. Validasi jumlah record, orphan foreign key, email duplikat, membership unik, dan sampel data sebelum cutover.
8. Hentikan write pada sumber, lakukan delta import terakhir, jalankan smoke test, lalu alihkan aplikasi.

Lakukan latihan migrasi pada salinan data yang sudah disanitasi. Jangan menganggap migration schema sebagai bukti migrasi data berhasil.

## Generic remote MySQL

Gunakan user aplikasi khusus dengan hak minimum, bukan `root`:

```dotenv
DATABASE_URL="mysql://carecircle:URL_ENCODED_PASSWORD@db.example.internal:3306/carecircle"
```

Batasi port `3306` agar hanya dapat diakses host aplikasi/private network. Untuk koneksi lintas host, aktifkan TLS sesuai dokumentasi penyedia MySQL dan parameter TLS Prisma yang didukung penyedia tersebut. Mount CA sebagai runtime secret jika diperlukan, verifikasi sertifikat/hostname, dan jangan menonaktifkan certificate verification untuk production.

Gunakan `npm run db:deploy` saat rilis; jangan menjalankan `db:migrate` di production.

## Deployment VPS dengan Docker Compose

Buat `.env` di sebelah `docker-compose.yml`:

```dotenv
MYSQL_DATABASE=carecircle
MYSQL_USER=carecircle
MYSQL_PASSWORD=PASSWORD_APLIKASI_YANG_KUAT
MYSQL_ROOT_PASSWORD=PASSWORD_ROOT_YANG_BERBEDA
DATABASE_URL=mysql://carecircle:PASSWORD_APLIKASI_URL_ENCODED@db:3306/carecircle
BETTER_AUTH_SECRET=SECRET_ACAK_MINIMAL_32_KARAKTER
BETTER_AUTH_URL=https://carecircle.example.com
APP_PORT=3000
MINIO_REGION=us-east-1
MINIO_BUCKET=carecircle-documents
MINIO_ACCESS_KEY=AKSES_MINIO_YANG_DIGANTI
MINIO_SECRET_KEY=SECRET_MINIO_KUAT_YANG_DIGANTI
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
```

`DATABASE_URL` memakai hostname service `db`; percent-encode password di URL tersebut. Nilai di atas hanya contoh placeholder—jangan memasukkan secret ke `Dockerfile`, repository, atau build arguments. Jalankan:

```bash
docker compose up -d --build
docker compose ps
docker compose logs app
```

Compose menjalankan aplikasi, MySQL 8.4, MinIO, dan job satu-kali `minio-init`. Aplikasi menunggu database/MinIO sehat dan bucket selesai dibuat, lalu container aplikasi menjalankan `prisma migrate deploy` sebelum `next start`. MySQL berada pada private Docker network; data persisten disimpan di volume `mysql_data` dan `minio_data`. Port aplikasi, API MinIO, dan console MinIO bind ke `127.0.0.1` secara default.

Endpoint bergantung pada lokasi proses: container aplikasi selalu memakai endpoint internal `http://minio:9000` yang ditetapkan oleh Compose, sedangkan aplikasi yang dijalankan langsung dari host memakai `MINIO_ENDPOINT=http://127.0.0.1:9000`. Jangan memakai endpoint localhost dari dalam container.

### Reverse proxy dan HTTPS

Tempatkan Caddy, Nginx, Traefik, atau reverse proxy terawat lainnya di depan `127.0.0.1:3000`:

- buka hanya port publik `80`/`443`;
- redirect HTTP ke HTTPS dan gunakan sertifikat valid;
- teruskan header `Host`, `X-Forwarded-For`, dan `X-Forwarded-Proto`;
- set `BETTER_AUTH_URL` tepat ke origin HTTPS publik;
- jangan mengekspos port MySQL, API MinIO `9000`, atau console MinIO `9001` ke internet;
- jangan reverse-proxy console MinIO; akses administrasi melalui SSH tunnel/VPN bila diperlukan;
- bila download/upload dilewatkan reverse proxy aplikasi, gunakan TLS, autentikasi, batas ukuran request, dan timeout yang sesuai. Jangan membuat bucket atau object menjadi publik.

### Backup

Volume Docker bukan backup. Jadwalkan backup terenkripsi ke lokasi off-host dengan retensi yang sesuai. Untuk database kecil, `mysqldump --single-transaction` dapat menjadi salah satu opsi; layanan terkelola dapat memakai snapshot/PITR. Backup MinIO harus mencakup seluruh object pada volume `minio_data` (misalnya replikasi/mirroring ke object store terpisah) dan metadata `Document` di MySQL secara konsisten. Lindungi file backup seperti data production, pantau keberhasilan job, dan lakukan restore drill berkala yang membuktikan object masih cocok dengan `objectKey`. Dokumentasikan RPO/RTO dan prosedur rollback sebelum cutover.

## Dokumen privat dan keamanan

- Bucket `carecircle-documents` bersifat privat; akses object harus diberikan server hanya setelah membership circle diverifikasi. Jangan menaruh URL publik permanen di database atau activity metadata.
- Batas upload aplikasi adalah **10 MB** per file. Format yang didukung: PDF, JPEG/JPG, PNG, dan WebP. Validasi ukuran, MIME type, dan signature/magic bytes di server; nama asli hanya metadata dan tidak boleh digunakan sebagai `objectKey`.
- `objectKey` harus acak/tidak dapat ditebak dan scoped ke circle. Hapus object dan record metadata secara terkoordinasi agar tidak menghasilkan orphan.
- Tidak ada enkripsi pada layer aplikasi. MinIO menyimpan byte yang diunggah apa adanya; gunakan disk/volume VPS terenkripsi, TLS HTTPS untuk semua trafik pengguna, dan backup terenkripsi off-host. Pertimbangkan server-side encryption/KMS terkelola bila threat model memerlukannya.
- Dokumen dapat berisi data pribadi. Terapkan least privilege, audit akses, retensi/penghapusan, pemindaian malware, dan jangan mencatat isi, presigned URL, credential, atau metadata sensitif.

Migration `20260913020000_add_private_documents` bersifat additive setelah migration invite. Terapkan di development dengan `npm run db:migrate`, dan di staging/production setelah backup dengan:

```bash
npm run db:deploy
```

Migration membuat tabel metadata `Document` serta foreign key opsional `ActivityEvent.documentId`; migration tidak mengunggah atau memindahkan file lama secara otomatis.
