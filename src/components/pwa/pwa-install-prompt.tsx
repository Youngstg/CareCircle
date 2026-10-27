"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register service worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failed or unsupported in this context
      });
    }

    // 2. Check if already running in standalone mode (already installed)
    const inStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(inStandalone);
    if (inStandalone) return;

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 4. Capture BeforeInstallPrompt on Android/Desktop
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Check if user previously dismissed today
      const dismissed = localStorage.getItem("carecircle_pwa_dismissed");
      if (!dismissed || Date.now() - Number(dismissed) > 24 * 60 * 60 * 1000) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (isStandalone || !showBanner) return null;

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem("carecircle_pwa_dismissed", Date.now().toString());
  }

  return (
    <aside
      className="pwa-install-banner"
      role="banner"
      style={{
        position: "fixed",
        bottom: "80px",
        left: "16px",
        right: "16px",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "var(--surface, #fff)",
        border: "1px solid var(--border, #dce5e0)",
        borderRadius: "16px",
        boxShadow: "0 12px 36px rgba(23, 35, 31, 0.16)",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        zIndex: 40,
      }}
    >
      <span
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: "var(--secondary, #e4efe9)",
          color: "var(--primary, #356859)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Smartphone size={22} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ display: "block", fontSize: "0.92rem", color: "var(--text, #17231f)" }}>
          Pasang CareCircle di Layar HP
        </strong>
        <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--muted, #60706a)" }}>
          {isIos
            ? "Tekan tombol Bagikan (Share) lalu pilih 'Tambahkan ke Layar Utama'."
            : "Akses lebih cepat dan lancar tanpa membuka browser."}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {!isIos && deferredPrompt && (
          <button
            type="button"
            className="button button-primary button-small"
            onClick={handleInstall}
            style={{ minHeight: "36px", padding: "0 12px", fontSize: "0.82rem" }}
          >
            <Download size={14} />
            Pasang
          </button>
        )}
        <button
          type="button"
          className="icon-button"
          onClick={handleDismiss}
          aria-label="Tutup saran pemasangan aplikasi"
          style={{ width: "32px", height: "32px" }}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
