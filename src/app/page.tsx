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
  KeyRound,
  LockKeyhole,
  Pill,
  PlayCircle,
  PlusCircle,
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

      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.brandWrapper}>
            <Logo />
            <span className={styles.versionBadge}>
              <span className={styles.livePulseDot} aria-hidden="true" />
              Live v1.0
            </span>
          </div>

          <nav className={styles.navigation} aria-label="Navigasi publik">
            <a className={styles.navPillActive} href="#fitur">
              Fitur Utama
            </a>
            <a className={styles.navPill} href="#cara-kerja">
              Cara kerja
            </a>
            <a className={styles.navPill} href="#keamanan">
              Keamanan Dokumen
            </a>
            <a className={styles.navPill} href="#privasi">
              Privasi
            </a>
            <a className={styles.navPill} href="#faq">
              FAQ
            </a>
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
        {/* Top Ambient Glow & Grand Centered Hero Section */}
        <section className={styles.heroSection} aria-labelledby="hero-title">
          <div className={styles.ambientGlowTopLeft} aria-hidden="true" />
          <div className={styles.ambientGlowTopRight} aria-hidden="true" />

          <div className={styles.heroContentContainer}>
            {/* Live Badge Pill */}
            <div className={styles.liveBadgeWrapper}>
              <div className={styles.livePill}>
                <span className={styles.livePingDot} aria-hidden="true" />
                <span className={styles.livePillPlatform}>Live Demo: carecircle.us.ci</span>
                <span className={styles.livePillDot}>•</span>
                <span className={styles.livePillDesc}>Koordinasi Perawatan Keluarga Bebas Stres</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 id="hero-title" className={styles.heroTitle}>
              Hentikan Caregiver Burnout. <br className={styles.desktopBreak} />
              <span className={styles.heroTitleHighlight}>Koordinasikan Perawatan Keluarga</span> dalam Satu Lingkaran Aman.
            </h1>

            {/* Subheading */}
            <p className={styles.heroSubtitle}>
              Bukan lagi informasi obat dan jadwal kontrol dokter yang tercecer di grup WhatsApp keluarga yang bising. Bagi tugas, pantau resep, dan simpan dokumen medis dengan aman.
            </p>

            {/* CTAs */}
            <div className={styles.heroCtaGroup}>
              <Link className={`${styles.button} ${styles.heroPrimaryBtn}`} href="/sign-up">
                <PlusCircle size={19} aria-hidden="true" />
                Buat akun
              </Link>
              <a className={`${styles.button} ${styles.heroSecondaryBtn}`} href="#cara-kerja">
                <PlayCircle size={19} className={styles.playIcon} aria-hidden="true" />
                Lihat Cara Kerja
              </a>
            </div>

            {/* Micro Trust Note */}
            <p className={styles.heroMicroTrust}>
              Tanpa Biaya • Setup Mandiri Cepat • Enkripsi Berstandar Medis
            </p>

            {/* Grand Hero Visual: Rich Interactive Care Hub Simulation */}
            <div className={styles.careHubWrapper}>
              <div className={styles.careHubAmbientGlow1} aria-hidden="true" />
              <div className={styles.careHubAmbientGlow2} aria-hidden="true" />

              <div className={styles.careHubCard} aria-label="Simulasi antarmuka ruang CareCircle">
                {/* Patient Profile Header */}
                <div className={styles.patientProfileHeader}>
                  <div className={styles.patientIdentity}>
                    <div className={styles.patientAvatarBox}>
                      <span className={styles.patientAvatarText}>IR</span>
                      <span className={styles.patientOnlineDot} aria-hidden="true" />
                    </div>
                    <div>
                      <div className={styles.patientNameLine}>
                        <h3 className={styles.patientName}>Ibu Rahmawati</h3>
                        <span className={styles.patientAge}>(72 tahun)</span>
                        <span className={styles.patientStatusBadge}>
                          <span className={styles.patientStatusPulse} aria-hidden="true" /> Kondisi Stabil
                        </span>
                      </div>
                      <p className={styles.patientDiagnosis}>
                        <Activity size={15} aria-hidden="true" />
                        Hipertensi Kronis • Pemulihan Pasca-Operasi Sendi Lutut (Hari ke-14)
                      </p>
                    </div>
                  </div>

                  {/* Active Care Team Pills */}
                  <div className={styles.careTeamBox}>
                    <div className={styles.careTeamAvatars}>
                      <div className={`${styles.avatarCircle} ${styles.avatar1}`} title="dr. Sarah (Coordinator)">
                        DS
                      </div>
                      <div className={`${styles.avatarCircle} ${styles.avatar2}`} title="Dimas (Owner)">
                        DM
                      </div>
                      <div className={`${styles.avatarCircle} ${styles.avatar3}`} title="Suster Anita">
                        SA
                      </div>
                      <div className={`${styles.avatarCircle} ${styles.avatar4}`} title="Rani">
                        RN
                      </div>
                    </div>
                    <div className={styles.careTeamMeta}>
                      <div className={styles.careTeamLabel}>Care Circle</div>
                      <div className={styles.careTeamCount}>4 Anggota Aktif</div>
                    </div>
                  </div>
                </div>

                {/* Modular Fluid Grid: 7-Col & 5-Col Asymmetrical Split */}
                <div className={styles.hubGrid}>
                  {/* Left Column (7-Col): Realtime Schedule & Medication Checklist */}
                  <div className={styles.hubLeftCol}>
                    <div className={styles.medicationPanel}>
                      <div className={styles.panelHeader}>
                        <div className={styles.panelTitleGroup}>
                          <Pill size={19} className={styles.iconTeal} aria-hidden="true" />
                          <span className={styles.panelTitle}>Jadwal &amp; Catatan Obat Hari Ini</span>
                        </div>
                        <span className={styles.progressPill}>
                          <Check size={14} aria-hidden="true" /> 2 dari 3 Dosis Selesai
                        </span>
                      </div>

                      <div className={styles.medicationList}>
                        {/* Dose 1 */}
                        <div className={styles.medicationItem}>
                          <div className={styles.medicationItemLeft}>
                            <CheckCircle2 size={22} className={styles.iconEmerald} aria-hidden="true" />
                            <div>
                              <div className={styles.medicationItemTitle}>
                                Amlodipine 5mg <span className={styles.medicationDose}>• 1 Tablet</span>
                              </div>
                              <div className={styles.medicationItemTime}>Pagi (08:00 WIB) - Sesudah sarapan</div>
                              <div className={styles.medicationItemLog}>
                                ✓ Diberikan oleh Suster Anita pukul 08:02 WIB
                              </div>
                            </div>
                          </div>
                          <span className={styles.statusPillDone}>Tuntas</span>
                        </div>

                        {/* Dose 2 */}
                        <div className={styles.medicationItem}>
                          <div className={styles.medicationItemLeft}>
                            <CheckCircle2 size={22} className={styles.iconEmerald} aria-hidden="true" />
                            <div>
                              <div className={styles.medicationItemTitle}>
                                Glimepiride 2mg <span className={styles.medicationDose}>• 1 Tablet</span>
                              </div>
                              <div className={styles.medicationItemTime}>Siang (12:30 WIB) - 15 menit sebelum makan</div>
                              <div className={styles.medicationItemLog}>
                                ✓ Dikonfirmasi oleh Dimas pukul 12:28 WIB
                              </div>
                            </div>
                          </div>
                          <span className={styles.statusPillDone}>Tuntas</span>
                        </div>

                        {/* Dose 3 */}
                        <div className={`${styles.medicationItem} ${styles.medicationItemUpcoming}`}>
                          <div className={styles.medicationItemLeft}>
                            <Clock size={22} className={styles.iconAmber} aria-hidden="true" />
                            <div>
                              <div className={styles.medicationItemTitle}>
                                Atorvastatin 20mg <span className={styles.medicationDose}>• 1 Tablet</span>
                              </div>
                              <div className={styles.medicationItemTime}>Malam (21:00 WIB) - Sebelum istirahat tidur</div>
                              <div className={styles.medicationItemUpcomingLog}>
                                Pengingat push aktif ke Suster Anita &amp; Rani
                              </div>
                            </div>
                          </div>
                          <span className={styles.statusPillUpcoming}>Jadwal Berikut</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5-Col): Live Delegation & Encrypted MinIO Vault */}
                  <div className={styles.hubRightCol}>
                    {/* Live Delegation Card */}
                    <div className={styles.delegationPanel}>
                      <div className={styles.panelHeader}>
                        <div className={styles.panelTitleGroup}>
                          <HeartHandshake size={19} className={styles.iconSky} aria-hidden="true" />
                          <span className={styles.panelTitle}>Delegasi Tugas Keluarga</span>
                        </div>
                        <span className={styles.dateLabel}>Hari Ini</span>
                      </div>

                      <div className={styles.delegationList}>
                        <div className={styles.delegationItem}>
                          <div>
                            <div className={styles.delegationItemTitle}>Tebus Resep &amp; Strip Kolesterol</div>
                            <div className={styles.delegationItemAssignee}>Ditugaskan ke Rani • Target 16:00 WIB</div>
                          </div>
                          <span className={styles.assigneeBadge}>RN</span>
                        </div>

                        <div className={styles.delegationItem}>
                          <div>
                            <div className={styles.delegationItemDoneTitle}>Cek Tekanan Darah Siang</div>
                            <div className={styles.delegationItemResult}>Selesai (124/80 mmHg) oleh dr. Sarah</div>
                          </div>
                          <Check size={18} className={styles.iconEmerald} aria-hidden="true" />
                        </div>
                      </div>
                    </div>

                    {/* Encrypted MinIO S3 Vault Snapshot */}
                    <div className={styles.vaultPanel}>
                      <div className={styles.panelHeader}>
                        <div className={styles.panelTitleGroup}>
                          <FileLock2 size={19} className={styles.iconTeal} aria-hidden="true" />
                          <span className={styles.panelTitle}>Brankas Lab (MinIO S3)</span>
                        </div>
                        <span className={styles.vaultCipherBadge}>AES-256</span>
                      </div>

                      <div className={styles.vaultFileCard}>
                        <div className={styles.vaultFileMeta}>
                          <div className={styles.pdfIconBox}>
                            <FileText size={20} aria-hidden="true" />
                          </div>
                          <div className={styles.fileNameGroup}>
                            <p className={styles.fileName}>Lab_Lengkap_Siloam_Mei.pdf</p>
                            <p className={styles.fileExpiry}>2.4 MB • Presigned 15 Menit</p>
                          </div>
                        </div>
                        <span className={styles.vaultSecureTag}>Tautan Aman</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting Family Story & Reassurance Showcase */}
        <section className={styles.familyShowcaseSection} aria-label="Keluarga bersama CareCircle">
          <div className={`${styles.container} ${styles.familyShowcaseInner}`}>
            <div className={styles.familyPhotoCard}>
              <Image
                src="/images/family-together.webp"
                alt="Anggota keluarga menyiapkan makanan bersama di dapur."
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 600px"
                className={styles.photo}
              />
            </div>
            <div className={styles.familyStoryContent}>
              <span className={styles.sectionEyebrow}>Ketenangan untuk Semua</span>
              <h2>Ruang Privat untuk Keluarga Saling Membantu</h2>
              <p>
                Ketika seluruh keluarga memiliki akses ke informasi yang sama, waktu berkumpul tidak lagi habis untuk mencocokkan jadwal obat atau mencari resep yang terselip.
              </p>
              <div className={styles.reassurancePillsGrid}>
                <div className={styles.reassuranceItem}>
                  <UsersRound size={20} aria-hidden="true" />
                  <span>Satu ruang bersama</span>
                </div>
                <div className={styles.reassuranceItem}>
                  <UserCheck size={20} aria-hidden="true" />
                  <span>Tanggung jawab yang jelas</span>
                </div>
                <div className={styles.reassuranceItem}>
                  <LockKeyhole size={20} aria-hidden="true" />
                  <span>Hanya untuk anggota</span>
                </div>
                <div className={styles.reassuranceItem}>
                  <ShieldCheck size={20} aria-hidden="true" />
                  <span>100% Bebas biaya koordinasi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Problem vs Solution Matrix */}
        <section className={styles.comparisonSection} aria-labelledby="comparison-title">
          <div className={`${styles.container} ${styles.comparisonInner}`}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.sectionEyebrowRose}>Transformasi Perawatan</span>
              <h2 id="comparison-title">Kekacauan Grup Chat vs Kedamaian CareCircle</h2>
              <p>
                Merawat orang tua tidak seharusnya memicu stres dan perdebatan antar-saudara karena miskomunikasi jadwal dan resep tercecer.
              </p>
            </div>

            <div className={styles.comparisonGrid}>
              {/* The Old Chaos (WhatsApp Family Group) */}
              <div className={styles.comparisonCardBad}>
                <div className={styles.comparisonHead}>
                  <div className={styles.comparisonIconBad} aria-hidden="true">
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h3>Dulu di Grup Chat Keluarga</h3>
                    <p>Informasi tercecer, emosi menumpuk, rawan salah dosis</p>
                  </div>
                </div>

                <div className={styles.comparisonList}>
                  <div className={styles.comparisonItemBad}>
                    <div className={styles.comparisonItemMeta}>
                      <span>Pesan Grup WA • 07:45 WIB</span>
                      <span className={styles.textError}>Tenggelam oleh 84 chat</span>
                    </div>
                    <p className={styles.comparisonItemQuote}>
                      &ldquo;Obat tensi Ibu siapa yang beli ya? Stoknya habis dari kemarin loh...&rdquo;
                    </p>
                    <small>Dibalas 5 jam kemudian dengan stiker selamat pagi.</small>
                  </div>

                  <div className={styles.comparisonItemBad}>
                    <div className={styles.comparisonItemMeta}>
                      <span>Foto Resep Lab</span>
                      <span className={styles.textError}>File Expired / Hilang</span>
                    </div>
                    <p>Foto hasil lab terkompresi buram, terselip di galeri ponsel pribadi, tidak bisa diakses saat kontrol darurat ke IGD.</p>
                  </div>

                  <div className={styles.comparisonItemBad}>
                    <div className={styles.comparisonItemMeta}>
                      <span>Beban Caregiver Tunggal</span>
                      <span className={styles.textError}>Caregiver Burnout</span>
                    </div>
                    <p>Satu anak yang tinggal serumah menanggung semua beban fisik dan mental tanpa ada pembagian tugas transparan.</p>
                  </div>
                </div>

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
                    <h3 className={styles.textPrimary}>Sekarang di CareCircle</h3>
                    <p>Satu sumber kebenaran, akuntabilitas tanpa perdebatan</p>
                  </div>
                </div>

                <div className={styles.comparisonList}>
                  <div className={styles.comparisonItemGood}>
                    <div className={styles.comparisonItemMeta}>
                      <span className={styles.textPrimaryBold}>Jadwal Obat Tersinkron</span>
                      <span className={styles.textEmerald}>✓ Real-time Sync</span>
                    </div>
                    <p>Notifikasi tepat waktu dengan konfirmasi digital. Setiap anggota keluarga langsung tahu siapa yang sudah mendampingi minum obat.</p>
                  </div>

                  <div className={styles.comparisonItemGood}>
                    <div className={styles.comparisonItemMeta}>
                      <span className={styles.textPrimaryBold}>Brankas Dokumen Medis Terenkripsi</span>
                      <span className={styles.textSky}>MinIO S3 Secured</span>
                    </div>
                    <p>Arsip lab, foto rontgen, dan resume medis tersimpan rapi berformat PDF asli. Dapat diakses via tautan berbatas waktu 15 menit.</p>
                  </div>

                  <div className={styles.comparisonItemGood}>
                    <div className={styles.comparisonItemMeta}>
                      <span className={styles.textPrimaryBold}>Audit Trail &amp; Delegasi Terbuka</span>
                      <span className={styles.textEmerald}>100% Akuntabel</span>
                    </div>
                    <p>Tugas antar-saudara dibagi adil dengan penanggung jawab spesifik (assignee). Tidak ada lagi saling lempar tanggung jawab.</p>
                  </div>
                </div>

                <div className={styles.comparisonFootGood}>
                  Hasil: Pasien terawat prima, caregiver bernapas lega, keluarga kompak.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Bento Grid (5 Core Capabilities) */}
        <section className={styles.featuresSection} id="fitur" aria-labelledby="features-title">
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.sectionEyebrow}>Fitur Komprehensif</span>
              <h2 id="features-title">Arsitektur Perawatan yang Lengkap &amp; Teruji</h2>
              <p>Didesain secara khusus dari pengalaman perawat keluarga di Indonesia untuk efisiensi harian optimal.</p>
            </div>

            <div className={styles.bentoGrid}>
              {/* Card 1: Multi-Role Care Circle Management (7-Col) */}
              <div className={`${styles.bentoCard} ${styles.bento7Col}`}>
                <div className={styles.bentoCardTop}>
                  <div className={styles.bentoBadge}>
                    <UsersRound size={16} aria-hidden="true" />
                    <span>RBAC Engine</span>
                  </div>
                  <span className={styles.bentoSubCode}>Better-Auth Integrated</span>
                </div>

                <div className={styles.bentoTitleGroup}>
                  <h3>Multi-Role Care Circle Management</h3>
                  <p>
                    Kendalikan privasi data secara presisi dengan Role-Based Access Control bertingkat: Family Owner, Coordinator, Member, hingga Medical Guest.
                  </p>
                </div>

                {/* Role Simulator inside Bento */}
                <div className={styles.roleSimulator}>
                  <div className={styles.roleSimLabel}>Struktur Izin Akses Lingkaran:</div>
                  <div className={styles.roleSimGrid}>
                    <div className={styles.roleCard}>
                      <div className={styles.roleCardHead}>
                        <span className={styles.roleOwnerTag}>OWNER</span>
                        <KeyRound size={14} className={styles.iconTeal} aria-hidden="true" />
                      </div>
                      <strong>Kepala Keluarga</strong>
                      <p>Kelola anggota, hapus lingkaran, &amp; transfer kepemilikan</p>
                    </div>

                    <div className={styles.roleCard}>
                      <div className={styles.roleCardHead}>
                        <span className={styles.roleCoordTag}>COORDINATOR</span>
                        <UserCheck size={14} className={styles.iconSky} aria-hidden="true" />
                      </div>
                      <strong>Perawat Utama</strong>
                      <p>Atur resep obat, jadwal, &amp; delegasikan checklist</p>
                    </div>

                    <div className={styles.roleCard}>
                      <div className={styles.roleCardHead}>
                        <span className={styles.roleMemberTag}>MEMBER</span>
                        <UsersRound size={14} className={styles.iconMuted} aria-hidden="true" />
                      </div>
                      <strong>Keluarga Besar</strong>
                      <p>Pantau status, centang tugas, &amp; beri catatan</p>
                    </div>
                  </div>

                  <div className={styles.inviteTokenBar}>
                    <div className={styles.inviteTokenLeft}>
                      <KeyRound size={18} className={styles.iconEmerald} aria-hidden="true" />
                      <span className={styles.inviteTokenText}>carecircle.us.ci/join/circle_941bf28</span>
                    </div>
                    <span className={styles.inviteTokenBadge}>Token 48 Jam</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Task Delegation & Smart Checklist (5-Col) */}
              <div className={`${styles.bentoCard} ${styles.bento5Col}`}>
                <div className={styles.bentoCardTop}>
                  <div className={styles.bentoBadgeEmerald}>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span>Zero Miscommunication</span>
                  </div>
                </div>

                <div className={styles.bentoTitleGroup}>
                  <h3>Task Delegation &amp; Smart Checklist</h3>
                  <p>Tugaskan perawat spesifik untuk setiap kebutuhan harian: beli obat, ganti perban, atau antar kontrol ke faskes.</p>
                </div>

                <div className={styles.taskSimList}>
                  <div className={styles.taskSimItemDone}>
                    <div className={styles.taskSimLeft}>
                      <CheckCircle2 size={20} className={styles.iconEmerald} aria-hidden="true" />
                      <div>
                        <div className={styles.taskSimDoneText}>Ukur Tekanan Darah Pagi</div>
                        <small>Hasil: 128/82 mmHg • dicatat dr. Sarah</small>
                      </div>
                    </div>
                    <span className={styles.taskSimTime}>07:15 WIB</span>
                  </div>

                  <div className={styles.taskSimItemPending}>
                    <div className={styles.taskSimLeft}>
                      <Clock size={20} className={styles.iconAmber} aria-hidden="true" />
                      <div>
                        <div className={styles.taskSimPendingText}>Latihan Fisioterapi Kaki</div>
                        <small className={styles.textSky}>Ditugaskan ke: Suster Anita</small>
                      </div>
                    </div>
                    <span className={styles.taskSimTimeAmber}>15:00 WIB</span>
                  </div>
                </div>

                <p className={styles.bentoFootNote}>Dilengkapi notifikasi pengingat dan riwayat pencatatan akurat.</p>
              </div>

              {/* Card 3: Schedules & Routine Reminders (5-Col) */}
              <div className={`${styles.bentoCard} ${styles.bento5Col}`}>
                <div className={styles.bentoCardTop}>
                  <div className={styles.bentoBadgeSky}>
                    <CalendarDays size={16} aria-hidden="true" />
                    <span>Jadwal Rutinitas</span>
                  </div>
                </div>

                <div className={styles.bentoTitleGroup}>
                  <h3>Schedule &amp; Routine Reminders</h3>
                  <p>Atur frekuensi minum obat rutin (sebelum/sesudah makan, dosis khusus) dengan kalenderisasi medis terpadu.</p>
                </div>

                <div className={styles.progressSimBox}>
                  <div className={styles.progressSimHead}>
                    <span>Progres Konsumsi Hari Ini</span>
                    <strong className={styles.textEmerald}>75% Lengkap</strong>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: "75%" }} />
                  </div>
                  <div className={styles.progressStepsRow}>
                    <span>Pagi (08:00) ✓</span>
                    <span>Siang (13:00) ✓</span>
                    <span>Sore (17:00) ✓</span>
                    <span className={styles.textAmberBold}>Malam (21:00)</span>
                  </div>
                </div>

                <p className={styles.bentoFootNote}>Sinkronisasi otomatis ke seluruh perangkat keluarga secara bersamaan.</p>
              </div>

              {/* Card 4: S3 & MinIO Private Vault (7-Col) */}
              <div className={`${styles.bentoCard} ${styles.bento7Col}`}>
                <div className={styles.bentoCardTop}>
                  <div className={styles.bentoBadge}>
                    <FileLock2 size={16} aria-hidden="true" />
                    <span>Zero-Leakage Architecture</span>
                  </div>
                  <span className={styles.bentoSubCode}>MinIO / S3 Standard</span>
                </div>

                <div className={styles.bentoTitleGroup}>
                  <h3>Private Document Vault (S3 &amp; MinIO)</h3>
                  <p>
                    Data rekam medis Anda tidak disimpan sebagai aset publik. Akses dienkripsi via Presigned Cryptographic URLs dengan batas waktu kedaluwarsa ketat.
                  </p>
                </div>

                <div className={styles.vaultSimRow}>
                  <div className={styles.vaultSimCard}>
                    <div className={styles.vaultSimCardHead}>
                      <Clock size={18} className={styles.iconSky} aria-hidden="true" />
                      <strong>Presigned Short-Lived URL</strong>
                    </div>
                    <p>Tautan akses berkas dibuat secara dinamis dan kedaluwarsa otomatis dalam 15 menit untuk mencegah kebocoran tautan tidak sengaja.</p>
                  </div>

                  <div className={styles.vaultSimCard}>
                    <div className={styles.vaultSimCardHead}>
                      <ShieldCheck size={18} className={styles.iconTeal} aria-hidden="true" />
                      <strong>Kategori Arsip Tertata</strong>
                    </div>
                    <div className={styles.vaultCategoryPills}>
                      <span>Lab Darah</span>
                      <span>Rontgen / MRI</span>
                      <span>Resume Medis</span>
                      <span>Klaim Asuransi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5: Full-Width 12-Col Audit Trail Stream */}
              <div className={`${styles.bentoCard} ${styles.bento12Col}`}>
                <div className={styles.auditHeader}>
                  <div>
                    <div className={styles.bentoBadge}>
                      <Activity size={16} aria-hidden="true" />
                      <span>Transparansi Penuh</span>
                    </div>
                    <h3 className={styles.auditTitle}>Transparent Activity Audit Trail</h3>
                    <p className={styles.auditSubtitle}>
                      Setiap aksi tercatat rapi tanpa celah manipulasi: siapa yang mengubah dosis, mencentang obat, atau mengakses resep.
                    </p>
                  </div>
                  <div className={styles.liveStreamBadge}>
                    <span className={styles.liveStreamPulse} aria-hidden="true" />
                    Live Event Stream
                  </div>
                </div>

                <div className={styles.auditTimelineGrid}>
                  <div className={styles.auditItem}>
                    <Pill size={20} className={styles.iconTeal} aria-hidden="true" />
                    <div>
                      <strong>Konfirmasi Dosis Obat</strong>
                      <p>Amlodipine 5mg dicentang oleh <span>Suster Anita</span></p>
                      <small>Hari ini • 08:02:14 WIB</small>
                    </div>
                  </div>

                  <div className={styles.auditItem}>
                    <FileText size={20} className={styles.iconSky} aria-hidden="true" />
                    <div>
                      <strong>Unggah Dokumen Lab</strong>
                      <p>File PDF diunggah oleh <span>dr. Sarah (Coordinator)</span></p>
                      <small>Kemarin • 19:40:22 WIB</small>
                    </div>
                  </div>

                  <div className={styles.auditItem}>
                    <UserCheck size={20} className={styles.iconEmerald} aria-hidden="true" />
                    <div>
                      <strong>Anggota Baru Bergabung</strong>
                      <p>Rani bergabung sebagai <span>Member</span> via Invite Token</p>
                      <small>2 Hari Lalu • 11:12:05 WIB</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: How It Works (3 Steps) */}
        <section className={styles.stepsSection} id="cara-kerja" aria-labelledby="steps-title">
          <div className={styles.container}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.sectionEyebrow}>Alur Penggunaan</span>
              <h2 id="steps-title">Tiga Langkah Menuju Ketenangan Perawatan</h2>
              <p>Tidak perlu keahlian teknologi khusus. Siapapun anggota keluarga dapat mengoperasikannya dalam hitungan menit.</p>
            </div>

            <div className={styles.stepsList}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeaderLine}>
                    <h3>Buat Lingkaran Perawatan Mandiri</h3>
                    <span className={styles.stepTimingBadge}>
                      <Clock size={14} aria-hidden="true" /> Kurang dari 60 detik
                    </span>
                  </div>
                  <p>
                    Daftarkan anggota keluarga yang membutuhkan pendampingan medis (Orang Tua, Anak, atau Pasangan). Masukkan nama, usia, diagnosa utama, dan preferensi faskes rujukan tanpa birokrasi rumit.
                  </p>
                  <div className={styles.stepPillRow}>
                    <span>Profil Medis Ringkas</span>
                    <span>Kontak Darurat Terpusat</span>
                  </div>
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={`${styles.stepNumber} ${styles.stepNumberSky}`}>02</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeaderLine}>
                    <h3>Undang Saudara &amp; Tim Medis</h3>
                    <span className={styles.stepTimingBadgeSky}>
                      <LockKeyhole size={14} aria-hidden="true" /> Tautan Terenkripsi Sekali Pakai
                    </span>
                  </div>
                  <p>
                    Kirim tautan sekali pakai via WhatsApp atau email. Tetapkan wewenang akses dengan presisi: Family Owner untuk anak utama, Member untuk saudara lain, atau Caregiver Guest untuk perawat harian tanpa takut akses rahasia bocor.
                  </p>
                  <div className={styles.stepPillRow}>
                    <span>Role-Based Access (RBAC)</span>
                    <span>Token Kedaluwarsa Otomatis</span>
                  </div>
                </div>
              </div>

              <div className={styles.stepCard}>
                <div className={`${styles.stepNumber} ${styles.stepNumberEmerald}`}>03</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeaderLine}>
                    <h3>Mulai Koordinasi &amp; Pantau Bersama</h3>
                    <span className={styles.stepTimingBadgeEmerald}>
                      <Sparkles size={14} aria-hidden="true" /> Transparan &amp; Bebas Stres
                    </span>
                  </div>
                  <p>
                    Input jadwal minum obat harian, jadwalkan kontrol dokter, delegasikan pembagian belanja alat kesehatan, dan simpan hasil laboratorium. Setiap centang diverifikasi dengan log audit real-time.
                  </p>
                  <div className={styles.stepPillRow}>
                    <span>Push Notification Pengingat</span>
                    <span>Log Audit Waktu Nyata</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Companion Photo with Descriptive Alt */}
            <div className={styles.stepCompanionPhotoWrap}>
              <div className={styles.stepCompanionPhoto}>
                <Image
                  src="/images/family-moment.webp"
                  alt="Seorang pria lanjut usia dan perempuan muda melihat laptop bersama, dengan buku catatan di meja."
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 600px"
                  className={styles.photo}
                />
              </div>
              <div className={styles.stepCompanionCaption}>
                <h3>Kolaborasi yang Menghangatkan Hubungan Keluarga</h3>
                <p>
                  Teknologi yang sederhana membuat pendampingan lansia berjalan lancar tanpa friksi, menjaga kebersamaan tetap hangat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Security & Privacy Section */}
        <section className={styles.privacySection} id="privasi" aria-labelledby="privacy-title">
          <div className={`${styles.container} ${styles.privacyInner}`} id="keamanan">
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
                <ShieldCheck size={32} aria-hidden="true" />
              </span>
              <h2 id="privacy-title">
                Dekat dengan keluarga.<br />Tetap dalam ruang privat.
              </h2>
              <p>
                Tugas, jadwal, catatan, dan dokumen hanya tersedia untuk orang yang Anda undang. Anda berbagi di dalam Care Circle, bukan di ruang publik atau media sosial terbuka.
              </p>

              <ul className={styles.privacyList}>
                <li>
                  <UsersRound size={22} aria-hidden="true" />
                  <div>
                    <h3>Akses Khusus Anggota Terverifikasi</h3>
                    <p>Hanya anggota dengan token undangan sah yang dapat melihat data lingkaran keluarga.</p>
                  </div>
                </li>
                <li>
                  <FileLock2 size={22} aria-hidden="true" />
                  <div>
                    <h3>Penyimpanan Dokumen Terenkripsi</h3>
                    <p>Tautan sementara diberikan hanya setelah sesi autentikasi dan status keanggotaan diperiksa.</p>
                  </div>
                </li>
                <li>
                  <Server size={22} aria-hidden="true" />
                  <div>
                    <h3>Isolasi Data Multi-Tenant Ketat</h3>
                    <p>Data tiap lingkaran terisolasi secara aman di level basis data MySQL dan bucket MinIO S3.</p>
                  </div>
                </li>
              </ul>

              <p className={styles.nonMedical}>
                <ShieldCheck size={18} aria-hidden="true" />
                CareCircle adalah platform koordinasi keluarga dan tidak menyediakan diagnosis atau saran medis.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Foundation Strip */}
        <section className={styles.techStrip} aria-label="Spesifikasi teknologi sistem">
          <div className={`${styles.container} ${styles.techStripInner}`}>
            <div className={styles.techStripHeader}>
              <Server size={18} className={styles.iconTeal} aria-hidden="true" />
              <span>Fondasi Teknologi Modern &amp; Keamanan Teruji</span>
            </div>
            <div className={styles.techGrid}>
              <div className={styles.techItem}>
                <strong>Next.js 16</strong>
                <small>App Router</small>
              </div>
              <div className={styles.techItem}>
                <strong>React 19</strong>
                <small>Concurrent Engine</small>
              </div>
              <div className={styles.techItem}>
                <strong>MinIO S3</strong>
                <small>Presigned AES-256</small>
              </div>
              <div className={styles.techItem}>
                <strong>Better-Auth</strong>
                <small>Strict RBAC</small>
              </div>
              <div className={styles.techItem}>
                <strong>MySQL 8.0</strong>
                <small>ACID Compliance</small>
              </div>
              <div className={styles.techItem}>
                <strong>99.98%</strong>
                <small>High Uptime SLA</small>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: FAQ Accordion */}
        <section className={styles.faqSection} id="faq" aria-labelledby="faq-title">
          <div className={`${styles.container} ${styles.faqInner}`}>
            <div className={styles.sectionHeadingCenter}>
              <span className={styles.sectionEyebrow}>Tanya Jawab</span>
              <h2 id="faq-title">Pertanyaan yang Sering Diajukan</h2>
              <p>Segala hal yang perlu Anda ketahui mengenai keamanan, cara penggunaan, dan peran dalam CareCircle.</p>
            </div>

            <div className={styles.faqList}>
              <details className={styles.faqCard}>
                <summary className={styles.faqSummary}>
                  <span>Apakah CareCircle berbayar?</span>
                  <ChevronDown size={22} className={styles.faqArrow} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  Tidak. CareCircle disediakan sebagai platform koordinasi perawatan keluarga yang dapat digunakan secara bebas biaya tanpa biaya langganan dan tanpa memerlukan kartu kredit.
                </div>
              </details>

              <details className={styles.faqCard}>
                <summary className={styles.faqSummary}>
                  <span>Apakah data dan rekam medis keluarga kami aman?</span>
                  <ChevronDown size={22} className={styles.faqArrow} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  Sangat aman. Seluruh berkas diunggah langsung ke penyimpanan berbasis MinIO/S3 dengan enkripsi AES-256. Akses file dilindungi oleh Presigned Cryptographic URLs berbatas waktu singkat (15 menit), sehingga tidak ada berkas yang terpapar publik di internet.
                </div>
              </details>

              <details className={styles.faqCard}>
                <summary className={styles.faqSummary}>
                  <span>Bisakah mengundang perawat non-keluarga dengan akses terbatas?</span>
                  <ChevronDown size={22} className={styles.faqArrow} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  Ya. Melalui sistem Role-Based Access Control (RBAC), Anda dapat memberikan peran khusus seperti Coordinator untuk perawat utama atau Member untuk keluarga besar yang hanya dapat melihat jadwal obat dan mencentang tugas tanpa izin menghapus lingkaran atau mengakses berkas di luar wewenang.
                </div>
              </details>

              <details className={styles.faqCard}>
                <summary className={styles.faqSummary}>
                  <span>Bagaimana jika salah satu anggota keluarga tidak paham teknologi?</span>
                  <ChevronDown size={22} className={styles.faqArrow} aria-hidden="true" />
                </summary>
                <div className={styles.faqAnswer}>
                  Antarmuka CareCircle dirancang sangat bersih dan intuitif dengan teks ramah mata. Cukup satu ketukan untuk mencentang tugas yang sudah selesai. Tidak perlu instalasi aplikasi rumit, CareCircle berjalan lancar di browser ponsel apa pun.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Section 7: Final High-Impact Conversion Banner */}
        <section className={styles.finalCtaSection} aria-labelledby="closing-title">
          <div className={`${styles.container} ${styles.finalCtaInner}`}>
            <span className={styles.finalCtaBadge}>
              <span className={styles.livePulseDot} aria-hidden="true" /> Dukungan Sepenuh Hati
            </span>
            <h2 id="closing-title" className={styles.finalCtaTitle}>
              Beri Perawatan Terbaik Tanpa Beban Sendirian.
            </h2>
            <p className={styles.finalCtaSubtitle}>
              Keluarga yang tenang adalah obat terbaik bagi kesembuhan orang terkasih. Mulai koordinasi yang rapi hari ini bersama CareCircle.
            </p>
            <div className={styles.finalCtaButtonGroup}>
              <Link className={`${styles.button} ${styles.finalCtaBtn}`} href="/sign-up">
                <UsersRound size={19} aria-hidden="true" />
                Mulai Lingkaran Keluarga Anda Sekarang
              </Link>
            </div>
            <div className={styles.finalCtaTrustRow}>
              <span><Check size={16} aria-hidden="true" /> Bebas Biaya</span>
              <span><Check size={16} aria-hidden="true" /> Tanpa Kontrak Mengikat</span>
              <span><Check size={16} aria-hidden="true" /> Privasi Terlindungi</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerBrandCol}>
            <Logo />
            <p className={styles.footerBrandDesc}>
              Membantu keluarga merawat orang terkasih dengan tenang dan terkoordinasi. Mengurangi caregiver burnout melalui pembagian tugas otomatis dan rekam medis terenkripsi.
            </p>
            <div className={styles.footerBadgeRow}>
              <span className={styles.footerShieldBadge}>
                <LockKeyhole size={14} aria-hidden="true" /> S3 Enkripsi MinIO
              </span>
              <span className={styles.footerShieldBadge}>
                <ShieldCheck size={14} aria-hidden="true" /> RBAC 256-bit
              </span>
            </div>
          </div>

          <div className={styles.footerLinksCol}>
            <h4>Navigasi</h4>
            <ul>
              <li><a href="#fitur">Fitur Utama</a></li>
              <li><a href="#cara-kerja">Cara kerja</a></li>
              <li><a href="#keamanan">Keamanan Dokumen</a></li>
              <li><a href="#privasi">Privasi</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className={styles.footerLinksCol}>
            <h4>Akun</h4>
            <ul>
              <li><Link href="/sign-in">Masuk</Link></li>
              <li><Link href="/sign-up">Buat akun</Link></li>
            </ul>
          </div>

          <div className={styles.copyrightRow}>
            <p>&copy; 2026 CareCircle. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
