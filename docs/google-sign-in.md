# Panduan login Google CareCircle

CareCircle sudah mendukung **masuk/daftar dengan Google** dan **penautan Google ke akun yang sudah ada** melalui Better Auth. Fitur ini hanya untuk autentikasi. Integrasi penyedia pengiriman email, reminder, dan Google Calendar **belum diimplementasikan**; login email dan kata sandi yang sudah ada tetap terpisah dari layanan pengiriman email.

## 1. Siapkan proyek dan consent screen Google

1. Buka [Google Cloud Console](https://console.cloud.google.com/), lalu buat atau pilih proyek yang dikelola tim Anda. Sebaiknya pisahkan proyek/client development dan production agar pengujian tidak mengubah konfigurasi pengguna production.
2. Buka **Google Auth Platform**. Jika belum dikonfigurasi, pilih **Get Started**. Pengaturan consent screen berada di **Branding**, **Audience**, dan **Data Access**; pada tampilan Console lain, pintu masuknya dapat bernama **APIs & Services → OAuth consent screen**.
3. Isi nama aplikasi CareCircle, **User support email**, dan kontak developer dengan informasi pengelola yang benar dan aktif. Untuk domain publik, daftarkan domain milik Anda pada **Authorized domains** sebelum mengisi URL branding/client; selesaikan verifikasi kepemilikan domain bila diminta Google.
4. Pilih audience:
   - **External** untuk pengguna akun Google di luar organisasi Anda, termasuk Gmail pribadi.
   - **Internal** hanya jika proyek dan pengguna berada dalam organisasi Google Workspace/Cloud Identity yang sesuai. Ini bukan pilihan untuk membuka akses bagi semua akun Gmail.
5. Untuk pengujian External, gunakan status **Testing**, lalu buka **Audience → Test users → Add users** dan tambahkan alamat akun Google nyata milik penguji. Simpan perubahan. Ikuti pembatasan audience/testing yang ditampilkan Google; status Testing dan daftar test user **bukan pengganti kontrol akses atau membership CareCircle**.
6. Di **Data Access**, batasi akses ke identitas dasar: `openid`, `email`, dan `profile` (Console dapat menampilkan nama/URL scope yang ekuivalen). Jangan tambahkan scope Calendar, Gmail, atau akses offline. Tidak perlu mengaktifkan API Calendar/Gmail untuk login ini.

Untuk rilis publik, lihat [persiapan production](#6-persiapan-production-dan-publish). Nama menu dan persyaratan verifikasi Google dapat berubah; rujukan resminya adalah [konfigurasi consent screen](https://developers.google.com/workspace/guides/configure-oauth-consent) dan [pengaturan branding OAuth](https://support.google.com/cloud/answer/10311615). Rujukan Workspace tersebut menjelaskan Console, bukan berarti CareCircle mengintegrasikan API Workspace.

## 2. Buat OAuth client bertipe Web application

1. Buka **Google Auth Platform → Clients → Create client**, atau **APIs & Services → Credentials → Create credentials → OAuth client ID**.
2. Pilih **Application type: Web application**. Jangan gunakan client Android, iOS, Desktop, service account, atau API key untuk konfigurasi ini.
3. Beri nama yang membedakan lingkungan, lalu isi **Authorized redirect URIs** dengan callback yang tepat:

   | Lingkungan | Origin aplikasi / `BETTER_AUTH_URL` | Authorized redirect URI |
   | --- | --- | --- |
   | Lokal | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
   | Production, contoh | `https://carecircle.example.com` | `https://carecircle.example.com/api/auth/callback/google` |

   Domain `carecircle.example.com` hanya contoh, bukan alamat deployment proyek. Untuk production, gunakan **origin HTTPS publik milik Anda + `/api/auth/callback/google`**. Daftarkan URI lengkap, bukan wildcard. Scheme, hostname, port, path, dan trailing slash harus cocok dengan request OAuth.
4. Alur Better Auth ini memakai redirect server. **Authorized JavaScript origins tidak menggantikan Authorized redirect URIs**. Jika mengisi kolom JavaScript origins, gunakan hanya origin aplikasi, misalnya `http://localhost:3000` atau origin HTTPS production, tanpa path callback.
5. Buat/simpan client. Salin **Client ID** dan **Client secret** dari client yang sama ke penyimpanan konfigurasi server yang aman, seperti dijelaskan di bawah. Jangan commit unduhan JSON credential, menaruh secret di dokumentasi, atau membagikannya lewat screenshot/log.

**Jangan mencampur `localhost` dan `127.0.0.1`.** Untuk setup lokal di atas, buka aplikasi dari `http://localhost:3000`, gunakan origin itu pada `BETTER_AUTH_URL`, dan daftarkan callback `localhost` yang sama di Google. Walaupun mengarah ke komputer yang sama, kedua hostname itu berbeda untuk pencocokan redirect dan cookie/state browser. Mengganti hostname atau port di tengah alur dapat menyebabkan `redirect_uri_mismatch` atau sesi OAuth tidak valid. Hostname database/MinIO dan alamat internal container bukan origin autentikasi.

`/dashboard`, `/onboarding`, dan `/account` adalah tujuan navigasi **setelah** autentikasi, bukan callback yang didaftarkan di Google.

## 3. Atur environment pada server/runtime

Jangan menyalin contoh secret dari dokumentasi. Masukkan nilai asli hanya melalui konfigurasi privat pengelola deployment:

| Variabel | Isi dan aturan |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Client ID OAuth **Web application** dari Google. Harus berpasangan dengan secret client yang sama. |
| `GOOGLE_CLIENT_SECRET` | Client secret Google tersebut. Rahasia, hanya untuk server. |
| `BETTER_AUTH_URL` | **Origin aplikasi saja**, lokal `http://localhost:3000` atau origin HTTPS publik production. Jangan tambahkan `/api/auth`, path lain, query, fragment, atau username/password. |
| `BETTER_AUTH_SECRET` | Pertahankan secret aplikasi yang sudah ada: minimal **32 karakter acak** dari generator kriptografis, stabil antar-restart/deploy dan konsisten antar-instance dalam lingkungan yang sama. Ini bukan Client secret Google. Jika deployment benar-benar baru, buat dan simpan secret secara privat. |

Semua variabel di atas dikonfigurasi **server-only**, tanpa awalan `NEXT_PUBLIC_`. Jangan memasukkannya ke kode client, konfigurasi `env` yang dibundel melalui `next.config`, Docker build arguments, atau layer image. Client ID memang dapat muncul pada URL otorisasi Google; itu tidak berarti Client secret atau `BETTER_AUTH_SECRET` boleh dikirim ke browser. Jangan mengganti `BETTER_AUTH_SECRET` hanya untuk mengaktifkan Google: rotasi tanpa rencana dapat mengganggu sesi dan pembacaan token terenkripsi.

### Lokasi konfigurasi dan penerapannya

| Cara menjalankan aplikasi | Tempat konfigurasi |
| --- | --- |
| Next.js langsung di host | `.env.local` privat pada root proyek, sejajar `package.json`, bukan di `src/`. Pastikan tersedia untuk proses server saat runtime, tidak dimasukkan ke repository/image. |
| Penyedia hosting/deployment | UI **Environment variables / Secrets** milik penyedia. Pilih layanan dan lingkungan yang benar, misalnya production atau preview, dan pastikan nilai tersedia untuk runtime, bukan hanya job build. |
| Docker Compose | `.env` privat di sebelah `docker-compose.yml`, atau environment yang disuplai ke Compose. Compose meneruskan nilai melalui `services.app.environment`; mengubah `.env.local` di host saja tidak mengonfigurasi container. |

Jaga konfigurasi database dan secret yang sudah valid; jangan menimpa seluruh file environment hanya untuk menambahkan Google. Environment proses yang sudah disetel dapat mengalahkan nilai file, jadi periksa sumber konfigurasi yang digunakan tanpa mencetak secret.

**Restart/redeploy runtime setelah perubahan.** Konfigurasi auth dibaca saat modul server diinisialisasi, bukan setiap kali tombol diklik. Pada hosting, terapkan deployment baru sesuai mekanisme penyedia. Pada Compose, recreate container `app` agar environment baru diterapkan; `docker compose restart` saja tidak memperbarui environment container.

Jika image sudah tersedia dan database/MinIO sudah berjalan sehat, pengelola dapat menerapkan ulang environment Compose tanpa build dengan:

```bash
docker compose up -d --no-deps --no-build --force-recreate app
```

**Perhatian:** startup container yang ada menjalankan `npm run db:deploy` sebelum `next start`. Recreate tersebut bukan operasi tanpa akses database; jadwalkan sesuai prosedur deployment/migrasi. Tidak ada migrasi khusus Google yang perlu dibuat.

### Kapan tombol Google aktif?

`src/lib/auth-options.ts` hanya mendaftarkan provider Google bila **kedua** credential, setelah di-trim, tidak kosong dan `BETTER_AUTH_URL` merupakan origin HTTP/HTTPS yang valid. `src/lib/auth.ts` mengekspor status ini sebagai `googleAuthEnabled`.

- Jika kedua credential belum ada, hanya salah satu yang ada, atau origin belum valid, tombol **Lanjutkan dengan Google** / **Tautkan akun Google** dinonaktifkan dengan pesan bahwa fitur belum tersedia.
- Login **email dan kata sandi tetap diaktifkan**. Akun yang sudah memiliki kata sandi valid tetap dapat masuk selama konfigurasi inti auth, database, dan runtime juga valid.
- Flag aktif hanya menunjukkan kelengkapan konfigurasi, **bukan** bahwa Google sudah menerima Client ID/secret. Nilai yang salah tetapi tidak kosong tetap dapat menghasilkan tombol aktif lalu gagal saat OAuth.
- Akun yang hanya dibuat melalui Google tidak otomatis memperoleh kata sandi; jangan menganggap fallback kata sandi tersedia untuk akun tersebut.

### Konektivitas Docker Compose

`docker-compose.yml` sudah meneruskan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` sebagai **opsional**, dengan nilai kosong jika tidak disediakan. Service `app` terhubung ke `backend` dan jaringan **`app-egress`** agar dapat mengakses internet.

- `backend` tetap `internal: true`. MySQL (`db`) hanya terhubung ke jaringan ini dan tidak memiliki port host yang dipublikasikan.
- MinIO tetap memakai `backend` serta jaringan `storage-access` yang sudah ada; port API/console hanya bind ke `127.0.0.1`. MinIO dan `db` tidak ditambahkan ke `app-egress`.
- Runtime aplikasi memerlukan DNS dan **outbound HTTPS (TCP 443) ke endpoint OAuth/OIDC Google**, termasuk pertukaran authorization code/token dan pengambilan identitas/kunci publik yang diperlukan. Browser pengguna juga harus dapat mencapai Google dan callback aplikasi.
- Jaringan egress aplikasi **tidak berarti database atau MinIO perlu diekspos ke internet**. Jangan membuka port MySQL/MinIO atau menonaktifkan isolasi `backend` untuk memperbaiki OAuth. Periksa firewall/egress hosting jika callback mengalami timeout.

## 4. Cara menggunakan login dan penautan

### Pengguna baru atau Google yang sudah terhubung

1. Buka `/sign-in` atau `/sign-up`, lalu pilih **Lanjutkan dengan Google**.
2. Pilih akun Google dan lanjutkan persetujuan. Aplikasi menggunakan pemilih akun (`prompt: select_account`).
3. Untuk identitas Google baru yang belum memiliki akun CareCircle, autentikasi membuat akun lalu mengarahkan ke **`/onboarding`**. Tidak ada Care Circle atau membership yang dibuat otomatis: pengguna harus memilih membuat circle atau bergabung melalui undangan.
4. Untuk Google yang sudah terhubung, tujuan setelah login adalah **`/dashboard`**. Bila pengguna belum mempunyai membership circle, guard mengarahkannya kembali ke **`/onboarding`**.

### Akun lama dengan email dan kata sandi

Email yang sama **tidak memicu penautan otomatis**, termasuk bila email akun lokal sudah terverifikasi. Jika mencoba login Google sebelum menautkan akun lama, pengguna diarahkan ke pesan aman yang meminta masuk dengan email dan kata sandi terlebih dahulu.

Untuk menambahkan Google sebagai cara masuk:

1. Masuk menggunakan email dan kata sandi akun CareCircle yang sudah ada.
2. Buka **Kelola akun** (`/account`) melalui profil/avatar di header aplikasi. Jika belum memiliki circle, tautan **Kelola akun** juga tersedia pada halaman onboarding; tidak perlu membuat circle dulu. Halaman ini membutuhkan sesi login, bukan membership circle.
3. Klik **Tautkan akun Google**. Pilih akun dengan **email Google terverifikasi yang sama dengan email akun CareCircle**.
4. Setelah berhasil, kembali ke `/account` dan tampil status **Akun Google sudah terhubung**. Keluar lalu uji login Google; identitas dan membership CareCircle yang digunakan harus tetap sama. Metode kata sandi yang sudah ada tetap dapat dipakai.

Email berbeda atau email Google yang belum terverifikasi ditolak. Identitas Google yang sudah dimiliki akun CareCircle lain tidak boleh dipindahkan lewat alur ini. Penautan tidak melakukan merge otomatis antar-`User` lokal, tidak membuat circle, tidak memberi membership, dan tidak menambah role/izin. Jika penautan gagal atau dibatalkan, gunakan metode masuk yang sudah tersedia, bukan mencoba menggabungkan record database secara manual.

## 5. Batas akses, penyimpanan, dan error

- Scope Google yang digunakan adalah default **`openid`, `email`, `profile`**. Konfigurasi memakai **`accessType: "online"`** dan `includeGrantedScopes: false`; tidak meminta Calendar, Gmail, atau akses offline untuk pekerjaan latar belakang. Jangan menjanjikan refresh token/offline access dari login ini.
- Better Auth dikonfigurasi dengan **`encryptOAuthTokens: true`** untuk mengenkripsi **access token dan refresh token, bila ada**, yang disimpan. Pernyataan ini **bukan jaminan enkripsi ID token**. Database, backup, dan secret tetap harus dilindungi. `storeAccountCookie: false` menonaktifkan cookie data account, bukan cookie sesi login.
- Implementasi memakai model **`User`, `Account`, `Verification`, dan `Session` yang sudah ada** di `prisma/schema.prisma`. Tidak diperlukan perubahan schema atau migrasi baru untuk Google. **Jangan menjalankan `db:seed` untuk setup/uji login Google**; buat akun uji melalui alur aplikasi. Migrasi aplikasi yang sudah ada tetap mengikuti prosedur deployment normal.
- `onAPIError.errorURL` diarahkan ke **`/auth/error`**. Tombol login juga memakai halaman itu; penautan memakai `/auth/error?flow=link` agar tautan kembali menuju `/account`.
- Halaman error dan pesan tombol memetakan kode error yang dikenal ke pesan Bahasa Indonesia melalui `getGoogleAuthErrorMessage`; kode tidak dikenal memakai fallback aman. UI tidak menampilkan mentah teks provider, `error_description`, atau isi query yang tidak dikenal. Error yang berhenti di halaman Google, misalnya URI callback tidak cocok, perlu diperbaiki di Console dan tidak selalu mencapai halaman error CareCircle.

### Pemeriksaan masalah umum

| Gejala | Yang diperiksa |
| --- | --- |
| Tombol Google nonaktif | Kedua variabel Google lengkap, origin valid, lingkungan/runtime yang benar, dan restart/redeploy sudah dilakukan. Jangan cetak nilai secret untuk diagnosis. |
| `redirect_uri_mismatch` | Authorized redirect URI tepat sama dengan origin aplikasi + `/api/auth/callback/google`; jangan campur `localhost`/`127.0.0.1`, HTTP/HTTPS, port, atau trailing slash. |
| Google menolak akses penguji | Audience Internal/External, akun test user yang dipilih, status publish/verifikasi, dan kebijakan administrator Workspace. |
| Email sudah memiliki akun / `account_not_linked` | Masuk dengan kata sandi, lalu lakukan penautan eksplisit lewat Kelola akun. |
| Email tidak cocok saat menautkan | Pilih email Google terverifikasi yang sama; jangan membuat merge pengguna untuk melewati pemeriksaan. |
| State/sesi OAuth tidak valid atau kedaluwarsa | Mulai alur baru dari aplikasi, gunakan tab dan origin yang sama, serta pastikan cookie tidak diblokir. Jangan memutar ulang URL callback lama. |
| Callback timeout | Periksa DNS, outbound HTTPS Google, TLS, dan reverse proxy. Tidak perlu mengekspos database. |

Saat meminta bantuan, bagikan kode error yang aman dan lingkungan yang terdampak, bukan secret, token, authorization code, cookie, atau URL callback lengkap yang membawa parameter sensitif.

## 6. Persiapan production dan publish

Sebelum membuka login Google untuk pengguna umum:

- Siapkan **domain publik milik pengelola dengan HTTPS valid**. Set `BETTER_AUTH_URL` ke origin publik itu, bukan alamat container/proxy internal, dan daftarkan callback HTTPS persis di client production. Pastikan reverse proxy meneruskan host/protokol yang benar.
- Lengkapi **Branding**, kontak dukungan, dan Authorized domains. Siapkan homepage yang menjelaskan aplikasi, **URL kebijakan privasi yang benar-benar dapat diakses publik**, serta ketentuan layanan sesuai persyaratan Google. Tautkan kebijakan privasi dari homepage dan gunakan URL yang sama di consent screen.
- Kebijakan privasi perlu sesuai praktik nyata akses, penggunaan, penyimpanan, dan pembagian data pengguna. Pengelola harus menyiapkan dan meninjau teks legalnya; panduan ini tidak membuat teks legal, URL kebijakan fiktif, atau mengasumsikan halaman kebijakan sudah tersedia di aplikasi.
- Tinjau **Audience → Publishing status**, lalu lakukan **Publish app / In production** ketika siap. Publishing status berbeda dari verifikasi branding dan scope. Scope identitas dasar tidak berarti seluruh kewajiban branding/domain otomatis gugur; ikuti **Verification Center** dan persyaratan Google yang berlaku, termasuk verifikasi/publikasi branding bila diminta. Perubahan nama, logo, URL, atau scope dapat membutuhkan peninjauan lagi.
- Simpan credential melalui konfigurasi privat runtime, pertahankan `BETTER_AUTH_SECRET`, pastikan egress Google tersedia, lalu restart/redeploy runtime.
- Selesaikan matriks uji di bawah pada deployment sebenarnya sebelum menyatakan integrasi siap dipakai. Preview dengan origin berbeda memerlukan konfigurasi client/callback yang sesuai; jangan memakai wildcard callback.

## 7. Validasi dan matriks uji manual

**Status verifikasi implementasi:** 151 tes aplikasi, lint, pemeriksaan TypeScript, dan build Next.js langsung telah lolos. Pemeriksaan browser terisolasi juga lolos untuk tampilan desktop/mobile, tema terang/gelap, status provider aktif/nonaktif, pengalihan akun tanpa sesi, loading/retry, pesan error aman, pemulihan BFCache, dan pengalihan SDK ke tujuan Google yang dimock. Tidak ditemukan overflow horizontal, gambar rusak, atau pelanggaran Axe pada tampilan yang diperiksa.

Kredensial Google nyata belum tersedia, sehingga keberhasilan OAuth live **belum diverifikasi**. Pemeriksaan browser memakai credential dummy dan database uji yang tidak dapat dijangkau; pengalihan Google dimock, bukan proses persetujuan akun nyata. Tidak ada migrasi atau seed yang dijalankan dalam validasi ini. Pengelola perlu menyediakan credential dan akun Google uji nyata, lalu menyelesaikan matriks pengujian runtime di bawah.

`tests/unit/google-auth.test.ts` menggunakan Better Auth dengan **memory adapter terisolasi**, memalsukan verifikasi identitas/profil eksternal, dan melarang akses jaringan. Tes tersebut mencakup konfigurasi, password tanpa Google, scope, state, penautan, dan penyimpanan token. Itu **bukan** pengujian live Google, persetujuan Console, jaringan deployment, atau database production.

`tests/unit/google-auth-pages.test.tsx` memeriksa render halaman, pelestarian formulir kata sandi, tombol Google, pesan callback, guard sesi, dan pembatasan query akun milik pengguna.

Untuk menjalankan ulang tes terarah:

```bash
npm run test:run -- tests/unit/google-auth.test.ts tests/unit/google-auth-pages.test.tsx
```

Jika hanya memerlukan pengecekan build frontend/Next.js, gunakan langsung:

```bash
npx --no-install next build
```

Perintah langsung tersebut melewati lifecycle `postbuild` milik proyek. **Jangan memakai `npm run build` sebagai pemeriksaan tanpa migrasi**: `package.json` memiliki `postbuild: prisma migrate deploy`. `Dockerfile` saat ini juga memanggil `npm run build` di builder, selain `db:deploy` saat startup container. Tinjau kebutuhan akses database/migrasi pipeline sebelum deployment; jangan menyiasatinya dengan memasukkan secret ke build arguments. Melewati `postbuild` bukan bukti keberhasilan OAuth dan tidak menghilangkan kebutuhan konfigurasi server yang mungkin diperlukan build.

### Uji dengan akun Google nyata

Gunakan lingkungan lokal/staging terisolasi, akun milik penguji, dan data non-sensitif. Pengujian signup/link memang membuat data autentikasi; jangan memakai seed atau menghapus/menggabungkan akun production. Siapkan akun Google baru, akun lokal berkata sandi dengan email Google yang sama, serta akun Google kedua untuk uji email berbeda. Tambahkan penguji di Console dan restart runtime setelah setiap variasi konfigurasi.

| Skenario | Langkah | Hasil yang harus diverifikasi |
| --- | --- | --- |
| Daftar melalui Google | Dari `/sign-up`, pilih Google yang belum terdaftar. Ulangi dari `/sign-in` dengan identitas uji baru lainnya. | Akun dibuat, menuju `/onboarding`; tidak ada circle/membership otomatis. |
| Masuk Google yang sudah terhubung, punya circle | Keluar lalu masuk Google dengan akun yang sudah memiliki membership. | Menuju `/dashboard`, menggunakan akun dan membership yang sama, bukan duplikat. |
| Masuk Google yang sudah terhubung, tanpa circle | Keluar lalu masuk kembali sebelum membuat/bergabung ke circle. | Tujuan login `/dashboard` dijaga dan dialihkan ke `/onboarding`. |
| Akun lama, email sama, belum ditautkan | Buat/gunakan akun kata sandi, keluar, lalu coba Google dengan email yang sama. | Tidak ada auto-link/merge; pesan meminta login kata sandi lalu Kelola akun. |
| Penautan eksplisit | Login kata sandi, buka Kelola akun, tautkan Google terverifikasi dengan email sama; keluar dan masuk Google. | Kembali ke `/account` dengan status terhubung; login berikutnya menggunakan akun yang sama, tanpa memberi membership baru. |
| Akses Kelola akun | Buka melalui profil saat punya circle, dan melalui onboarding saat belum punya circle. Coba `/account` tanpa sesi. | Kedua tautan bekerja; tanpa sesi diarahkan ke `/sign-in`. |
| Pembatalan | Tolak/batalkan persetujuan yang mengembalikan error dari Google, untuk alur login dan link. | Pesan aman pada `/auth/error` (link memakai `flow=link`), dapat mencoba lagi; tidak ada penautan/membership baru akibat pembatalan. |
| Email tidak cocok | Saat login lokal, coba tautkan Google dengan email berbeda. | Penautan ditolak dengan pesan aman; akun dan membership tidak berubah. |
| Origin/callback tidak cocok | Hanya pada client/lingkungan uji, coba callback yang sengaja tidak cocok, lalu pulihkan konfigurasi. | OAuth tidak berhasil; perbaikan URI/origin menyelesaikan mismatch tanpa membuka port database. |
| Tanpa/parsial konfigurasi Google | Uji kedua credential kosong, hanya Client ID, lalu hanya Client secret; restart runtime tiap variasi, pertahankan konfigurasi inti auth/database yang valid. | Tombol Google nonaktif; login akun dengan email/kata sandi valid tetap berhasil pada setiap variasi. |
| Regresi login kata sandi | Dengan Google lengkap, dan setelah berhasil menautkan akun lama, keluar lalu login memakai kata sandi lama yang valid. | Login kata sandi tetap berhasil; guard circle tetap berlaku. |

Kasus identitas Google dengan email belum terverifikasi atau subject yang sudah dimiliki pengguna lain juga ditangani dalam tes memory. Jangan mengklaim kasus tersebut sudah diuji live hanya dari profil/verifier mock.

## Acuan implementasi

Panduan ini didasarkan pada konfigurasi dan alur yang ada, bukan rencana integrasi mendatang:

- `src/lib/auth-options.ts` dan `src/lib/auth.ts`: aktivasi provider, origin, scope/opsi, kebijakan linking, enkripsi token, serta fallback error.
- `src/features/auth/google-auth-button.tsx` dan `src/features/auth/google-errors.ts`: tombol, tujuan redirect, dan pesan aman.
- `src/app/(auth)/account/page.tsx`, `src/app/(auth)/auth/error/page.tsx`, `src/app/onboarding/page.tsx`, `src/components/layout/app-shell.tsx`, dan `src/features/circles/queries.ts`: Kelola akun, navigasi, serta guard membership.
- `prisma/schema.prisma`, `docker-compose.yml`, `Dockerfile`, `package.json`, dan `tests/unit/google-auth.test.ts`: penyimpanan yang sudah ada, runtime/jaringan, efek migrasi saat deployment, dan batas bukti pengujian.
