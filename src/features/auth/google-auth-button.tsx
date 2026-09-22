"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getGoogleAuthErrorMessage } from "@/features/auth/google-errors";
import styles from "./google-auth-button.module.css";

type Props = {
  enabled: boolean;
  mode?: "sign-in" | "link";
};

export function GoogleAuthButton({ enabled, mode = "sign-in" }: Props) {
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const messageId = useId();

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        pendingRef.current = false;
        setPending(false);
        setErrorMessage(null);
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleClick() {
    if (!enabled || pendingRef.current) return;

    pendingRef.current = true;
    setPending(true);
    setErrorMessage(null);

    try {
      const { data, error } = mode === "link"
        ? await authClient.linkSocial({
            provider: "google",
            callbackURL: "/account",
            errorCallbackURL: "/auth/error?flow=link",
          })
        : await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
            newUserCallbackURL: "/onboarding",
            errorCallbackURL: "/auth/error",
          });

      // The SDK redirects; stay busy until navigation or a BFCache restore.
      if (!error && data?.url) return;

      setErrorMessage(getGoogleAuthErrorMessage(error?.code));
    } catch {
      setErrorMessage(getGoogleAuthErrorMessage());
    }

    pendingRef.current = false;
    setPending(false);
  }

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick}
        disabled={!enabled || pending}
        aria-busy={pending}
        aria-describedby={!enabled || errorMessage ? messageId : undefined}
      >
        <Image
          src="/brand/google.png"
          width={20}
          height={20}
          alt=""
          className={styles.logo}
        />
        <span>
          {pending ? "Menghubungkan…" : mode === "link" ? "Tautkan akun Google" : "Lanjutkan dengan Google"}
        </span>
      </button>
      {!enabled ? (
        <p id={messageId} className={styles.availability}>
          {mode === "link" ? "Penautan akun Google belum tersedia saat ini." : "Masuk dengan Google belum tersedia saat ini."}
        </p>
      ) : errorMessage ? (
        <p id={messageId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      ) : null}
      {mode === "sign-in" && (
        <div className={styles.separator}>atau gunakan email</div>
      )}
    </div>
  );
}
