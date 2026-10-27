"use client";

import { useState, useTransition } from "react";
import { Check, Clock, Pill, Trash2 } from "lucide-react";
import { deleteRoutine, toggleRoutineToday } from "../actions";
import type { DailyRoutineItem } from "../queries";

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

export function RoutineRow({
  routine,
  dateStr,
  canManage,
}: {
  routine: DailyRoutineItem;
  dateStr: string;
  canManage: boolean;
}) {
  const [checked, setChecked] = useState(routine.isCompleted);
  const [completerName, setCompleterName] = useState(routine.completedByName);
  const [pending, startTransition] = useTransition();

  function handleChange(next: boolean) {
    setChecked(next);
    startTransition(async () => {
      const result = await toggleRoutineToday(routine.id, routine.circleId, next, dateStr);
      if (!result.ok) {
        setChecked(!next);
      } else {
        setCompleterName(next ? "Anda" : null);
      }
    });
  }

  return (
    <div
      className={`routine-item-row ${checked ? "routine-done" : ""}`}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "12px",
        backgroundColor: checked ? "rgba(47, 125, 85, 0.05)" : "var(--surface)",
        border: "1px solid",
        borderColor: checked ? "rgba(47, 125, 85, 0.2)" : "var(--border)",
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          paddingTop: "2px",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={pending}
          onChange={(e) => handleChange(e.target.checked)}
          style={{ width: "20px", height: "20px", accentColor: "var(--success)" }}
        />
        <span className="sr-only">Tandai {routine.title}</span>
      </label>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <strong
            style={{
              fontSize: "0.92rem",
              textDecoration: checked ? "line-through" : "none",
              color: checked ? "var(--muted)" : "var(--text)",
            }}
          >
            {routine.title}
          </strong>

          {routine.customTime && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "0.72rem",
                color: "var(--primary)",
                backgroundColor: "var(--secondary)",
                padding: "2px 8px",
                borderRadius: "99px",
                fontWeight: 600,
              }}
            >
              <Clock size={11} />
              {routine.customTime}
            </span>
          )}
        </div>

        {routine.note && (
          <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
            {routine.note}
          </p>
        )}

        {checked && completerName && (
          <small
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "4px",
              fontSize: "0.75rem",
              color: "var(--success)",
              fontWeight: 550,
            }}
          >
            <Check size={12} />
            Selesai dicatat oleh {completerName}
            {routine.completedAt && ` · ${timeFormatter.format(new Date(routine.completedAt))}`}
          </small>
        )}
      </div>

      {canManage && (
        <form action={deleteRoutine} style={{ margin: 0 }}>
          <input type="hidden" name="routineId" value={routine.id} />
          <input type="hidden" name="circleId" value={routine.circleId} />
          <button
            type="submit"
            className="icon-button"
            style={{ width: "28px", height: "28px", color: "var(--muted)" }}
            title={`Hapus rutinitas ${routine.title}`}
            aria-label={`Hapus rutinitas ${routine.title}`}
            onClick={(e) => {
              if (!confirm(`Hapus rutinitas "${routine.title}"?`)) {
                e.preventDefault();
              }
            }}
          >
            <Trash2 size={14} />
          </button>
        </form>
      )}
    </div>
  );
}
