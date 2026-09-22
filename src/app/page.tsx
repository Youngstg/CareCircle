import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ClipboardCheck, FileLock2, LockKeyhole, NotebookPen, ShieldCheck, UsersRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#konten-utama">Lewati ke konten utama</a>
      <header className={styles.header}>
        <div className={styles.navbar}>
          <Logo />
          <nav className={styles.navigation} aria-label="Navigasi publik">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#privasi">Privasi</a>
          </nav>
          <div className={styles.accountLinks}>
            <Link className={styles.signIn} href="/sign-in">Masuk</Link>
            <Link className={`${styles.button} ${styles.primary} ${styles.navButton}`} href="/sign-up">
              Buat akun <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main id="konten-utama" tabIndex={-1}>
        <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Satu ruang privat untuk keluarga</p>
            <h1 id="hero-title">Merawat bersama, <span>lebih terarah.</span></h1>
            <p className={styles.heroDescription}>
              Atur jadwal, bagi tugas, dan simpan informasi penting. Lebih sedikit mencari, lebih banyak waktu untuk keluarga.
            </p>
            <div className={styles.heroActions}>
              <Link className={`${styles.button} ${styles.primary}`} href="/sign-up">
                Buat akun <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a className={`${styles.button} ${styles.secondary}`} href="#cara-kerja">Cara kerja</a>
            </div>
          </div>
          <div className={styles.heroPhoto}>
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
        </section>

        <section className={styles.reassurance} aria-label="Tentang ruang keluarga Anda">
          <div className={`${styles.container} ${styles.reassuranceInner}`}>
            <span><UsersRound size={20} aria-hidden="true" />Satu ruang bersama</span>
            <span><ClipboardCheck size={20} aria-hidden="true" />Tanggung jawab yang jelas</span>
            <span><LockKeyhole size={20} aria-hidden="true" />Hanya untuk anggota</span>
          </div>
        </section>

        <section className={`${styles.container} ${styles.features}`} id="cara-kerja" aria-labelledby="features-title">
          <div className={styles.sectionHeading}>
            <h2 id="features-title">Informasi penting,<br className={styles.desktopBreak} /> tidak lagi tercecer.</h2>
            <p>Tak perlu menyusun ulang rencana dari chat, galeri, dan ingatan. Kebutuhan keluarga punya tempatnya sendiri.</p>
          </div>
          <div className={styles.featureGrid}>
            <article className={styles.featureLead}>
              <div className={styles.featureLeadCopy}>
                <span className={styles.featureIcon}><ClipboardCheck size={25} aria-hidden="true" /></span>
                <h3>Tanggung jawab yang jelas</h3>
                <p>Setiap tugas menunjukkan siapa yang menangani dan kapan perlu selesai. Saling membantu jadi lebih mudah.</p>
              </div>
              <div className={styles.featurePhoto}>
                <Image
                  src="/images/family-moment.webp"
                  alt="Seorang pria lanjut usia dan perempuan muda melihat laptop bersama, dengan buku catatan di meja."
                  fill
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 48vw, 600px"
                  className={styles.photo}
                />
              </div>
            </article>
            <article className={`${styles.featureDetail} ${styles.scheduleFeature}`}>
              <span className={styles.featureIcon}><CalendarDays size={25} aria-hidden="true" /></span>
              <h3>Persiapan lebih terarah</h3>
              <p>Satukan agenda dan daftar persiapan agar tidak ada yang perlu ditebak.</p>
              <div className={styles.featureFootnote}><Check size={17} aria-hidden="true" />Jadwal dan daftar persiapan bersama</div>
            </article>
            <article className={`${styles.featureDetail} ${styles.documentsFeature}`}>
              <span className={styles.featureIcon}><FileLock2 size={25} aria-hidden="true" /></span>
              <h3>Dokumen tersimpan bersama</h3>
              <p>Simpan, lihat, dan unduh dokumen penting di ruang privat yang hanya dapat diakses anggota.</p>
              <div className={styles.featureFootnote}><NotebookPen size={17} aria-hidden="true" />Lengkapi dengan catatan keluarga</div>
            </article>
          </div>
        </section>

        <section className={`${styles.container} ${styles.privacy}`} id="privasi" aria-labelledby="privacy-title">
          <div className={styles.privacyPhoto}>
            <Image
              src="/images/family-connection.webp"
              alt="Dua perempuan dari generasi berbeda berbincang sambil berpegangan tangan di taman."
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 40vw, 480px"
              className={styles.photo}
            />
          </div>
          <div className={styles.privacyCopy}>
            <span className={styles.privacyIcon}><ShieldCheck size={28} aria-hidden="true" /></span>
            <h2 id="privacy-title">Dekat dengan keluarga.<br />Tetap dalam ruang privat.</h2>
            <p>Tugas, jadwal, catatan, dan dokumen tersedia untuk orang yang tepat. Anda berbagi di dalam Care Circle, bukan di ruang publik.</p>
            <ul className={styles.privacyList}>
              <li>
                <UsersRound size={21} aria-hidden="true" />
                <div><h3>Akses untuk anggota</h3><p>Informasi hanya tersedia bagi anggota Care Circle Anda.</p></div>
              </li>
              <li>
                <FileLock2 size={21} aria-hidden="true" />
                <div><h3>Penyimpanan dokumen privat</h3><p>Tautan sementara diberikan setelah sesi dan keanggotaan diperiksa.</p></div>
              </li>
            </ul>
            <p className={styles.nonMedical}><ShieldCheck size={17} aria-hidden="true" />CareCircle tidak memberikan diagnosis atau saran medis.</p>
          </div>
        </section>

        <section className={`${styles.container} ${styles.closing}`} aria-labelledby="closing-title">
          <div className={styles.closingInner}>
            <div>
              <h2 id="closing-title">Mulai dari satu ruang bersama.</h2>
              <p>Tempat untuk berbagi tanggung jawab, agar tak semua harus diingat sendiri.</p>
            </div>
            <Link className={`${styles.button} ${styles.primary}`} href="/sign-up">
              Buat akun <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Logo />
            <p>Ruang privat untuk koordinasi dan informasi keluarga.</p>
          </div>
          <nav className={styles.footerLinks} aria-label="Navigasi footer">
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#privasi">Privasi</a>
            <Link href="/sign-in">Masuk</Link>
            <Link href="/sign-up">Buat akun</Link>
          </nav>
          <small className={styles.copyright}>© 2026 CareCircle</small>
        </div>
      </footer>
    </div>
  );
}
