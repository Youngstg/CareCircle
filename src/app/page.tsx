import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileLock2,
  FileText,
  HeartHandshake,
  LockKeyhole,
  Pill,
  Server,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#konten-utama">
        Lewati ke konten utama
      </a>

      {/* Header / Navigation */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Logo />
          <nav className={styles.navigation} aria-label="Navigasi publik">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#fitur">Fitur utama</a>
            <a href="#privasi">Privasi</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className={styles.accountLinks}>
            <Link className={styles.signIn} href="/sign-in">
              Masuk
            </Link>
            <Link className={`${styles.button} ${styles.primary} ${styles.navButton}`} href="/sign-up">
              Buat akun <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main id="konten-utama" tabIndex={-1}>
        {/* Hero Section with Interactive Care Hub Simulation */}
        <section className={`${styles.container} ${styles.heroSection}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <div className={styles.badgeRow}>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} aria-hidden="true" />
                Ruang Privat Terenkripsi
              </span>
            </div>
            <h1 id="hero-title" className={styles.heroTitle}>
              Merawat bersama, <span>lebih terarah dan tenang.</span>
            </h1>
            <p className={styles.heroDescription}>
              Bagi tugas harian, atur jadwal obat rutin, dan simpan dokumen medis keluarga dalam satu lingkaran privat yang aman tanpa kekacauan chat.
            </p>
            <div className={styles.heroActions}>
              <Link className={`${styles.button} ${styles.primary}`} href="/sign-up">
                Buat akun keluarga <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a className={`${styles.button} ${styles.secondary}`} href="#cara-kerja">
                Cara kerja
              </a>
            </div>
            <div className={styles.heroTrust}>
              <span><Check size={16} aria-hidden="true" /> Tanpa biaya langganan</span>
              <span><Check size={16} aria-hidden="true" /> Akses khusus anggota</span>
              <span><Check size={16} aria-hidden="true" /> Enkripsi MinIO S3</span>
            </div>
          </div>

          {/* Hero Visual: Companion Photo + Interactive Care Hub Simulation */}
          <div className={styles.heroVisualWrap}>
            <div className={styles.heroPhotoCard}>
              <Image
                src="/images/family-together.webp"
                alt="Anggota keluarga menyiapkan makanan bersama di dapur."
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 560px"
                className={styles.photo}
              />
            </div>

            {/* Interactive Care Hub Preview Card */}
            <div className={styles.careHubCard} aria-label="Simulasi antarmuka CareCircle">
              <div className={styles.careHubHeader}>
                <div className={styles.patientMeta}>
                  <div className={styles.patientAvatar} aria-hidden="true">
                    IR
                  </div>
                  <div>
                    <div className={styles.patientNameLine}>
                      <strong>Ibu Rahmawati</strong>
                      <span className={styles.patientAge}>(72 th)</span>
                      <span className={styles.statusPill}>
                        <span className={styles.statusDot} aria-hidden="true" /> Kondisi Terpantau
                      </span>
                    </div>
                    <p className={styles.patientSub}>Perawatan Rutin Hipertensi &amp; Sendi</p>
                  </div>
                </div>
                <div className={styles.memberTag}>4 Anggota Aktif</div>
              </div>

              {/* Today's Schedule & Routine Checklist */}
              <div className={styles.hubSection}>
                <div className={styles.hubSectionHead}>
                  <span className={styles.hubSectionTitle}>
                    <Pill size={16} aria-hidden="true" /> Jadwal Obat Hari Ini
                  </span>
                  <span className={styles.hubSectionStatus}>2 dari 3 Tuntas</span>
                </div>
                <div className={styles.hubList}>
                  <div className={styles.hubItem}>
                    <CheckCircle2 size={18} className={styles.iconDone} aria-hidden="true" />
                    <div className={styles.hubItemContent}>
                      <div className={styles.hubItemTitle}>
                        Amlodipine 5mg <span className={styles.hubItemMeta}>• 1 Tablet (08:00 WIB)</span>
                      </div>
                      <small className={styles.hubItemAuthor}>Dikonfirmasi oleh Suster Anita pukul 08:02</small>
                    </div>
                    <span className={styles.badgeDone}>Tuntas</span>
                  </div>

                  <div className={styles.hubItem}>
                    <CheckCircle2 size={18} className={styles.iconDone} aria-hidden="true" />
                    <div className={styles.hubItemContent}>
                      <div className={styles.hubItemTitle}>
                        Glimepiride 2mg <span className={styles.hubItemMeta}>• 1 Tablet (12:30 WIB)</span>
                      </div>
                      <small className={styles.hubItemAuthor}>Dikonfirmasi oleh Dimas pukul 12:28</small>
                    </div>
                    <span className={styles.badgeDone}>Tuntas</span>
                  </div>

                  <div className={`${styles.hubItem} ${styles.hubItemUpcoming}`}>
                    <Clock size={18} className={styles.iconUpcoming} aria-hidden="true" />
                    <div className={styles.hubItemContent}>
                      <div className={styles.hubItemTitle}>
                        Atorvastatin 20mg <span className={styles.hubItemMeta}>• 1 Tablet (21:00 WIB)</span>
                      </div>
                      <small className={styles.hubItemAuthor}>Pengingat push otomatis ke keluarga</small>
                    </div>
                    <span className={styles.badgeUpcoming}>Malam</span>
                  </div>
                </div>
              </div>

              {/* Delegation & Secure Vault Widget Snapshot */}
              <div className={styles.hubBottomRow}>
                <div className={styles.hubMiniCard}>
                  <div className={styles.hubMiniHead}>
                    <HeartHandshake size={15} aria-hidden="true" />
                    <span>Delegasi Tugas</span>
                  </div>
                  <p className={styles.hubMiniTitle}>Tebus Resep &amp; Strip Uji</p>
                  <small className={styles.hubMiniAssignee}>Ditugaskan ke: Rani (Adik)</small>
                </div>

                <div className={styles.hubMiniCard}>
                  <div className={styles.hubMiniHead}>
                    <FileLock2 size={15} aria-hidden="true" />
                    <span>Brankas Lab (MinIO)</span>
                  </div>
                  <p className={styles.hubMiniTitle}>Lab_Darah_Rutin.pdf</p>
                  <small className={styles.hubMiniAssignee}>AES-256 • Presigned 15 Menit</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reassurance Value Strip */}
        <section className={styles.reassurance} aria-label="Tentang ruang keluarga Anda">
          <div className={`${styles.container} ${styles.reassuranceInner}`}>
            <span>
              <UsersRound size={20} aria-hidden="true" />
              Satu ruang bersama
            </span>
            <span>
              <UserCheck size={20} aria-hidden="true" />
              Tanggung jawab yang jelas
            </span>
            <span>
              <LockKeyhole size={20} aria-hidden="true" />
              Hanya untuk anggota
            </span>
            <span>
              <ShieldCheck size={20} aria-hidden="true" />
              100% Bebas biaya koordinasi
            </span>
          </div>
        </section>

        {/* Problem vs Solution Comparison Section */}
        <section className={`${styles.container} ${styles.comparisonSection}`} aria-labelledby="comparison-title">
          <div className={styles.sectionHeadingCenter}>
            <span className={styles.sectionEyebrow}>Transformasi Perawatan</span>
            <h2 id="comparison-title">Kekacauan Chat Biasa vs Kedamaian CareCircle</h2>
            <p>
              Merawat orang tua dan anggota keluarga tidak seharusnya memicu stres karena informasi tertimbun dan kelalaian jadwal.
            </p>
          </div>

          <div className={styles.comparisonGrid}>
            {/* The Old Chaos */}
            <div className={styles.comparisonCardBad}>
              <div className={styles.comparisonHead}>
                <div className={styles.comparisonIconBad} aria-hidden="true">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h3>Dulu di Grup Chat Biasa</h3>
                  <p>Informasi tercecer, rawan salah dosis, emosi menumpuk</p>
                </div>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <div className={styles.comparisonItemTime}>Pesan Penting Tertimbun</div>
                  <p>&ldquo;Obat tensi Ibu siapa yang beli ya?&rdquo; tenggelam oleh ratusan pesan obrolan dan stiker.</p>
                </li>
                <li>
                  <div className={styles.comparisonItemTime}>Foto Resep &amp; Lab Hilang</div>
                  <p>Foto terkompresi buram, terselip di galeri ponsel pribadi, sulit dicari saat kontrol mendadak ke IGD.</p>
                </li>
                <li>
                  <div className={styles.comparisonItemTime}>Beban di Caregiver Tunggal</div>
                  <p>Satu anggota keluarga menanggung semua beban ingatan tanpa pembagian tugas yang terukur.</p>
                </li>
              </ul>
              <div className={styles.comparisonFootBad}>
                Hasil: Beban mental berat, obat terlewat, dan konflik internal keluarga.
              </div>
            </div>

            {/* The CareCircle Sanctuary */}
            <div className={styles.comparisonCardGood}>
              <div className={styles.comparisonHead}>
                <div className={styles.comparisonIconGood} aria-hidden="true">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3>Sekarang di CareCircle</h3>
                  <p>Satu sumber kebenaran, akuntabilitas tanpa perdebatan</p>
                </div>
              </div>
              <ul className={styles.comparisonList}>
                <li>
                  <div className={styles.comparisonItemTimeGood}>Jadwal Obat Tersinkron Nyata</div>
                  <p>Pengingat waktu minum obat dengan konfirmasi digital. Semua anggota langsung tahu siapa yang mendampingi.</p>
                </li>
                <li>
                  <div className={styles.comparisonItemTimeGood}>Brankas Dokumen Terenkripsi</div>
                  <p>Hasil laboratorium, resume dokter, dan resep tersimpan rapi berformat PDF asli via tautan privat berbatas waktu.</p>
                </li>
                <li>
                  <div className={styles.comparisonItemTimeGood}>Delegasi Tugas Terbuka</div>
                  <p>Tugas dibagi adil dengan penanggung jawab spesifik (assignee) sehingga saling membantu jadi lebih teratur.</p>
                </li>
              </ul>
              <div className={styles.comparisonFootGood}>
                Hasil: Pasien terawat prima, caregiver bernapas lega, keluarga kompak.
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities Bento Grid */}
        <section className={`${styles.container} ${styles.features}`} id="fitur" aria-labelledby="features-title">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>Fitur Terpadu</span>
            <h2 id="features-title">
              Informasi penting,<br className={styles.desktopBreak} /> tidak lagi tercecer.
            </h2>
            <p>
              Dirancang khusus dari kebutuhan nyata perawat keluarga di Indonesia: tata kelola peran, pengingat rutinitas, dan brankas berkas aman.
            </p>
          </div>

          <div className={styles.bentoGrid}>
            {/* Card 1: Multi-Role Management */}
            <article className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoIcon}>
                <UsersRound size={24} aria-hidden="true" />
              </div>
              <div className={styles.bentoContent}>
                <div className={styles.bentoTag}>Struktur Izin Berjenjang</div>
                <h3>Multi-Role Care Circle</h3>
                <p>
                  Kendalikan hak akses informasi keluarga dengan aman: Family Owner (Kepala Keluarga), Coordinator (Perawat Utama), dan Member (Keluarga Besar).
                </p>
                <div className={styles.rolePillsRow}>
                  <span className={styles.rolePillOwner}>Owner: Atur Lingkaran</span>
                  <span className={styles.rolePillCoord}>Coordinator: Kelola Jadwal</span>
                  <span className={styles.rolePillMember}>Member: Pantau &amp; Bantu</span>
                </div>
              </div>
            </article>

            {/* Card 2: Task Delegation */}
            <article className={styles.bentoCard}>
              <div className={styles.bentoIcon}>
                <UserCheck size={24} aria-hidden="true" />
              </div>
              <div className={styles.bentoContent}>
                <div className={styles.bentoTag}>Akuntabilitas</div>
                <h3>Delegasi Tugas &amp; Checklist</h3>
                <p>
                  Tugaskan perawat atau saudara untuk kebutuhan harian: beli obat, ganti perban, atau antar kontrol ke faskes.
                </p>
                <div className={styles.featureFootnote}>
                  <Check size={16} aria-hidden="true" /> Penanggung jawab jelas untuk tiap tugas
                </div>
              </div>
            </article>

            {/* Card 3: Schedules & Routines */}
            <article className={styles.bentoCard}>
              <div className={styles.bentoIcon}>
                <CalendarDays size={24} aria-hidden="true" />
              </div>
              <div className={styles.bentoContent}>
                <div className={styles.bentoTag}>Kalender Medis</div>
                <h3>Jadwal &amp; Pengingat Rutinitas</h3>
                <p>
                  Satukan jadwal minum obat sebelum atau sesudah makan dan agenda kontrol dokter agar tidak ada yang terlewat.
                </p>
                <div className={styles.featureFootnote}>
                  <Clock size={16} aria-hidden="true" /> Waktu minum obat &amp; kontrol dokter
                </div>
              </div>
            </article>

            {/* Card 4: S3 Encrypted Document Vault */}
            <article className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <div className={styles.bentoIcon}>
                <FileLock2 size={24} aria-hidden="true" />
              </div>
              <div className={styles.bentoContent}>
                <div className={styles.bentoTag}>Penyimpanan Berstandar S3</div>
                <h3>Brankas Dokumen Medis Privat</h3>
                <p>
                  Simpan hasil lab, rontgen, dan resume medis. Berkas tidak terpapar publik, melainkan diunduh lewat Presigned Cryptographic URLs dengan batas kedaluwarsa ketat.
                </p>
                <div className={styles.vaultBadges}>
                  <span>Enkripsi AES-256</span>
                  <span>Presigned URL 15 Menit</span>
                  <span>Verifikasi Sesi Ketat</span>
                </div>
              </div>
            </article>

            {/* Card 5: Activity Audit Trail */}
            <article className={`${styles.bentoCard} ${styles.bentoFull}`}>
              <div className={styles.auditHeaderRow}>
                <div>
                  <div className={styles.bentoTag}>Transparansi Penuh</div>
                  <h3>Log Aktivitas &amp; Jejak Waktu Nyata</h3>
                  <p>
                    Setiap aksi tercatat rapi: siapa yang mencentang dosis obat, mengunggah riwayat lab, atau menambahkan tugas baru.
                  </p>
                </div>
                <div className={styles.auditStreamStatus}>
                  <Activity size={16} aria-hidden="true" /> Aliran Aktivitas Terverifikasi
                </div>
              </div>

              <div className={styles.auditTimelineGrid}>
                <div className={styles.auditItem}>
                  <Pill size={18} className={styles.auditIcon} aria-hidden="true" />
                  <div>
                    <strong>Konfirmasi Minum Obat</strong>
                    <p>Amlodipine 5mg dicentang oleh Suster Anita</p>
                    <small>Hari ini • 08:02 WIB</small>
                  </div>
                </div>

                <div className={styles.auditItem}>
                  <FileText size={18} className={styles.auditIcon} aria-hidden="true" />
                  <div>
                    <strong>Unggah Berkas Lab</strong>
                    <p>Lab_Darah_Rutin.pdf ditambahkan oleh dr. Sarah</p>
                    <small>Kemarin • 19:40 WIB</small>
                  </div>
                </div>

                <div className={styles.auditItem}>
                  <Sparkles size={18} className={styles.auditIcon} aria-hidden="true" />
                  <div>
                    <strong>Tugas Baru Selesai</strong>
                    <p>Cek Tekanan Darah (124/80 mmHg) oleh Dimas</p>
                    <small>Kemarin • 12:35 WIB</small>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Step-by-Step Onboarding Workflow */}
        <section className={`${styles.container} ${styles.stepsSection}`} id="cara-kerja" aria-labelledby="steps-title">
          <div className={styles.sectionHeadingCenter}>
            <span className={styles.sectionEyebrow}>Alur Penggunaan</span>
            <h2 id="steps-title">Tiga Langkah Menuju Ketenangan Perawatan</h2>
            <p>
              Tidak membutuhkan keahlian teknis khusus. Siapapun anggota keluarga dapat mengoperasikannya dalam hitungan menit.
            </p>
          </div>

          <div className={styles.stepsWrap}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber} aria-hidden="true">
                01
              </div>
              <div className={styles.stepBody}>
                <h3>Buat Lingkaran Perawatan</h3>
                <p>
                  Daftarkan nama anggota keluarga yang memerlukan pendampingan, diagnosa utama, serta preferensi faskes rujukan secara mandiri.
                </p>
                <div className={styles.stepPill}>Profil Perawatan Terpusat</div>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber} aria-hidden="true">
                02
              </div>
              <div className={styles.stepBody}>
                <h3>Undang Saudara &amp; Pendamping</h3>
                <p>
                  Kirim kode undangan privat ke anggota keluarga. Tentukan wewenang peran (Owner, Coordinator, atau Member) tanpa khawatir akses bocor.
                </p>
                <div className={styles.stepPill}>Kode Undangan Berbatas Waktu</div>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber} aria-hidden="true">
                03
              </div>
              <div className={styles.stepBody}>
                <h3>Koordinasi &amp; Pantau Bersama</h3>
                <p>
                  Masukkan rutinitas obat harian, jadwalkan kontrol dokter, dan simpan arsip medis penting dalam satu ruang yang selalu sinkron.
                </p>
                <div className={styles.stepPill}>Sinkronisasi Semua Perangkat</div>
              </div>
            </div>
          </div>

          {/* Supporting photo */}
          <div className={styles.stepPhotoWrap}>
            <div className={styles.stepPhoto}>
              <Image
                src="/images/family-moment.webp"
                alt="Seorang pria lanjut usia dan perempuan muda melihat laptop bersama, dengan buku catatan di meja."
                fill
                loading="lazy"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 600px"
                className={styles.photo}
              />
            </div>
            <div className={styles.stepPhotoCaption}>
              <h3>Pendampingan yang harmonis dan terstruktur</h3>
              <p>Membantu keluarga tetap fokus pada kasih sayang dan pemulihan, tanpa beban koordinasi yang berantakan.</p>
            </div>
          </div>
        </section>

        {/* Security & Privacy Section */}
        <section className={`${styles.container} ${styles.privacy}`} id="privasi" aria-labelledby="privacy-title">
          <div className={styles.privacyPhoto}>
            <Image
              src="/images/family-connection.webp"
              alt="Dua perempuan dari generasi berbeda berbincang sambil berpegangan tangan di taman."
              fill
              loading="lazy"
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 40vw, 480px"
              className={styles.photo}
            />
          </div>

          <div className={styles.privacyCopy}>
            <span className={styles.privacyIcon}>
              <ShieldCheck size={28} aria-hidden="true" />
            </span>
            <h2 id="privacy-title">
              Dekat dengan keluarga.<br />Tetap dalam ruang privat.
            </h2>
            <p>
              Tugas, jadwal, catatan, dan dokumen hanya tersedia untuk orang yang Anda undang. Anda berbagi di dalam Care Circle, bukan di ruang publik atau media sosial.
            </p>
            <ul className={styles.privacyList}>
              <li>
                <UsersRound size={21} aria-hidden="true" />
                <div>
                  <h3>Akses Khusus Anggota Terdaftar</h3>
                  <p>Hanya mereka yang memiliki token undangan sah yang dapat melihat data lingkaran keluarga.</p>
                </div>
              </li>
              <li>
                <FileLock2 size={21} aria-hidden="true" />
                <div>
                  <h3>Penyimpanan Berkas Terenkripsi</h3>
                  <p>Tautan sementara diberikan hanya setelah sesi autentikasi dan status keanggotaan diperiksa.</p>
                </div>
              </li>
              <li>
                <Server size={21} aria-hidden="true" />
                <div>
                  <h3>Pemisahan Data Multi-Tenant Aman</h3>
                  <p>Data tiap lingkaran terisolasi secara ketat di level basis data MySQL dan MinIO S3 bucket.</p>
                </div>
              </li>
            </ul>
            <p className={styles.nonMedical}>
              <ShieldCheck size={17} aria-hidden="true" />
              CareCircle adalah platform koordinasi keluarga dan tidak memberikan diagnosis atau saran medis.
            </p>
          </div>
        </section>

        {/* Technology Stack Trust Strip */}
        <section className={styles.techStrip} aria-label="Spesifikasi teknologi sistem">
          <div className={`${styles.container} ${styles.techStripInner}`}>
            <div className={styles.techStripHeading}>
              <Server size={18} aria-hidden="true" />
              <span>Arsitektur Sistem Modern &amp; Teruji</span>
            </div>
            <div className={styles.techBadgesGrid}>
              <div className={styles.techBadgeItem}>
                <strong>Next.js 16</strong>
                <small>App Router</small>
              </div>
              <div className={styles.techBadgeItem}>
                <strong>React 19</strong>
                <small>Server Components</small>
              </div>
              <div className={styles.techBadgeItem}>
                <strong>MinIO S3</strong>
                <small>AES-256 Presigned</small>
              </div>
              <div className={styles.techBadgeItem}>
                <strong>Better-Auth</strong>
                <small>Strict RBAC</small>
              </div>
              <div className={styles.techBadgeItem}>
                <strong>MySQL 8.0</strong>
                <small>Prisma ORM ACID</small>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Section */}
        <section className={`${styles.container} ${styles.faqSection}`} id="faq" aria-labelledby="faq-title">
          <div className={styles.sectionHeadingCenter}>
            <span className={styles.sectionEyebrow}>Tanya Jawab</span>
            <h2 id="faq-title">Pertanyaan yang Sering Diajukan</h2>
            <p>Penjelasan lengkap mengenai penggunaan, keamanan data, dan peran dalam CareCircle.</p>
          </div>

          <div className={styles.faqList}>
            <details className={styles.faqCard}>
              <summary className={styles.faqSummary}>
                <span>Apakah CareCircle berbayar?</span>
                <ChevronDown size={20} className={styles.faqArrow} aria-hidden="true" />
              </summary>
              <div className={styles.faqAnswer}>
                Tidak. CareCircle disediakan sebagai platform koordinasi perawatan keluarga yang dapat digunakan secara bebas biaya tanpa biaya langganan dan tanpa memerlukan kartu kredit.
              </div>
            </details>

            <details className={styles.faqCard}>
              <summary className={styles.faqSummary}>
                <span>Apakah data dan dokumen medis keluarga kami aman?</span>
                <ChevronDown size={20} className={styles.faqArrow} aria-hidden="true" />
              </summary>
              <div className={styles.faqAnswer}>
                Sangat aman. Seluruh berkas disimpan menggunakan penyimpanan objek MinIO/S3 dengan enkripsi AES-256. Akses file dilindungi oleh Presigned Cryptographic URLs berbatas waktu singkat (15 menit), sehingga tidak ada berkas yang dapat diakses secara terbuka di internet.
              </div>
            </details>

            <details className={styles.faqCard}>
              <summary className={styles.faqSummary}>
                <span>Bisakah kami mengundang perawat luar dengan akses terbatas?</span>
                <ChevronDown size={20} className={styles.faqArrow} aria-hidden="true" />
              </summary>
              <div className={styles.faqAnswer}>
                Bisa. Sistem wewenang peran (Role-Based Access Control) memungkinkan Anda menentukan tingkat izin seperti Coordinator untuk perawat utama atau Member untuk keluarga besar, sehingga privasi tetap terlindungi.
              </div>
            </details>

            <details className={styles.faqCard}>
              <summary className={styles.faqSummary}>
                <span>Apakah aplikasi ini menggantikan instruksi dokter atau rumah sakit?</span>
                <ChevronDown size={20} className={styles.faqArrow} aria-hidden="true" />
              </summary>
              <div className={styles.faqAnswer}>
                Tidak. CareCircle adalah perangkat lunak koordinasi tugas harian dan pencatatan non-medis untuk keluarga. CareCircle tidak menyediakan diagnosis medis maupun saran terapi klinis mandiri.
              </div>
            </details>
          </div>
        </section>

        {/* Closing Call to Action */}
        <section className={`${styles.container} ${styles.closing}`} aria-labelledby="closing-title">
          <div className={styles.closingInner}>
            <div>
              <h2 id="closing-title">Mulai dari satu ruang bersama.</h2>
              <p>Tempat untuk berbagi tanggung jawab perawatan orang terkasih, agar tidak semua harus diingat sendiri.</p>
            </div>
            <Link className={`${styles.button} ${styles.primary}`} href="/sign-up">
              Buat akun keluarga <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Logo />
            <p>Ruang privat untuk koordinasi dan informasi keluarga.</p>
          </div>
          <nav className={styles.footerLinks} aria-label="Navigasi footer">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#fitur">Fitur utama</a>
            <a href="#privasi">Privasi</a>
            <a href="#faq">FAQ</a>
            <Link href="/sign-in">Masuk</Link>
            <Link href="/sign-up">Buat akun</Link>
          </nav>
          <small className={styles.copyright}>&copy; 2026 CareCircle. Hak cipta dilindungi.</small>
        </div>
      </footer>
    </div>
  );
}
