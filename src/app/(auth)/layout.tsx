import Image from "next/image";
import { Logo } from "@/components/ui/logo";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.layout}>
      <div className={styles.shell}>
        <div className={styles.brand}>
          <Logo />
        </div>

        <div className={styles.formPanel}>
          {children}
          <p className={styles.note}>
            CareCircle membantu koordinasi non-medis dan tidak menggantikan panduan tenaga profesional.
          </p>
        </div>

        <aside className={styles.story} aria-labelledby="auth-story-title">
          <div className={styles.storyCopy}>
            <h2 id="auth-story-title">Bersama, lebih ringan.</h2>
            <p>
              Bagi tugas, atur jadwal, dan saling berkabar. Ada ruang untuk saling membantu.
            </p>
          </div>
          <div className={styles.photoFrame}>
            <Image
              src="/images/family-connection.webp"
              alt="Dua perempuan dari generasi berbeda berbincang sambil berpegangan tangan di taman."
              fill
              sizes="(min-width: 1280px) 520px, (min-width: 900px) 40vw, 1px"
              className={styles.photo}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
