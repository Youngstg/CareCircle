"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Clock3 } from "lucide-react";
import type { RecentActivity } from "@/features/activities/queries";

const activityDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function NotificationPopover({ activities }: { activities: RecentActivity[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="notification-wrapper" ref={containerRef} style={{ position: "relative" }}>
      <button
        className="icon-button"
        aria-label="Notifikasi aktivitas keluarga"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        style={{ position: "relative" }}
      >
        <Bell size={20} />
        {activities.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "8px",
              height: "8px",
              backgroundColor: "var(--accent, #e7a86e)",
              borderRadius: "50%",
            }}
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          className="notification-popover"
          role="dialog"
          aria-label="Pemberitahuan aktivitas"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: "min(340px, calc(100vw - 32px))",
            backgroundColor: "var(--surface, #fff)",
            border: "1px solid var(--border, #dce5e0)",
            borderRadius: "14px",
            boxShadow: "0 14px 40px rgba(23, 35, 31, 0.12)",
            padding: "16px",
            zIndex: 50,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              paddingBottom: "8px",
              borderBottom: "1px solid var(--border, #dce5e0)",
            }}
          >
            <strong style={{ fontSize: "0.92rem" }}>Aktivitas Keluarga</strong>
            <small style={{ color: "var(--muted, #60706a)", fontSize: "0.75rem" }}>
              {activities.length} terbaru
            </small>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "360px", overflowY: "auto" }}>
            {activities.length > 0 ? (
              activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "9px",
                    fontSize: "0.82rem",
                    lineHeight: 1.4,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "var(--secondary, #e4efe9)",
                      color: "var(--primary, #356859)",
                      display: "grid",
                      placeItems: "center",
                      marginTop: "2px",
                    }}
                  >
                    <CheckCircle2 size={14} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 550 }}>{act.summary}</div>
                    <small style={{ color: "var(--muted, #60706a)", fontSize: "0.74rem" }}>
                      {activityDateFormatter.format(new Date(act.createdAt))}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--muted, #60706a)" }}>
                <Clock3 size={24} style={{ margin: "0 auto 6px", display: "block" }} />
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Belum ada aktivitas baru</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
