import { Pill } from "lucide-react";
import type { DailyRoutineItem } from "../queries";
import { RoutineCreate } from "./routine-create";
import { RoutineRow } from "./routine-row";

const timeLabels: Record<string, { label: string; iconTime: string }> = {
  MORNING: { label: "Pagi", iconTime: "🌅" },
  AFTERNOON: { label: "Siang", iconTime: "☀️" },
  EVENING: { label: "Sore", iconTime: "🌇" },
  NIGHT: { label: "Malam", iconTime: "🌙" },
};

export function RoutinesSection({
  routines,
  circleId,
  dateStr,
  canManage,
}: {
  routines: DailyRoutineItem[];
  circleId: string;
  dateStr: string;
  canManage: boolean;
}) {
  const completedCount = routines.filter((r) => r.isCompleted).length;
  const totalCount = routines.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const grouped = {
    MORNING: routines.filter((r) => r.timeOfDay === "MORNING"),
    AFTERNOON: routines.filter((r) => r.timeOfDay === "AFTERNOON"),
    EVENING: routines.filter((r) => r.timeOfDay === "EVENING"),
    NIGHT: routines.filter((r) => r.timeOfDay === "NIGHT"),
  };

  return (
    <section className="routines-widget" style={{ marginBottom: "28px" }}>
      <div className="section-heading" style={{ marginBottom: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Rutinitas & Obat Hari Ini</h2>
            {totalCount > 0 && (
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: completedCount === totalCount ? "var(--success)" : "var(--primary)",
                  backgroundColor: completedCount === totalCount ? "#e7f3eb" : "var(--secondary)",
                  padding: "2px 9px",
                  borderRadius: "99px",
                }}
              >
                {completedCount}/{totalCount} Selesai ({progressPercent}%)
              </span>
            )}
          </div>
          <p style={{ margin: "2px 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            Checklist berkala harian yang otomatis diperbarui setiap hari.
          </p>
        </div>
        <RoutineCreate circleId={circleId} />
      </div>

      {totalCount > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "18px 20px",
          }}
        >
          {Object.entries(grouped).map(([timeKey, items]) => {
            if (items.length === 0) return null;
            const meta = timeLabels[timeKey];
            return (
              <div key={timeKey} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  <span>{meta.iconTime}</span>
                  <span>{meta.label}</span>
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {items.map((routine) => (
                    <RoutineRow
                      key={routine.id}
                      routine={routine}
                      dateStr={dateStr}
                      canManage={canManage}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            padding: "24px",
            backgroundColor: "var(--surface)",
            border: "1px dashed var(--border)",
            borderRadius: "16px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "var(--secondary)",
              color: "var(--primary)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Pill size={20} />
          </span>
          <strong style={{ fontSize: "0.95rem" }}>Belum ada rutinitas obat harian</strong>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", maxWidth: "420px" }}>
            Tambahkan jadwal obat rutin (pagi, siang, malam) atau cek tensi agar keluarga dapat saling memantau kepatuhan perawatan.
          </p>
        </div>
      )}
    </section>
  );
}
