"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, UserRound } from "lucide-react";

type CalendarSchedule = {
  id: string;
  title: string;
  startsAt: string | Date;
  locationName: string | null;
  companion: { name: string } | null;
  checklistCount: number;
  completedChecklistCount: number;
};

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function ScheduleCalendar({ schedules }: { schedules: CalendarSchedule[] }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const schedulesByDate = useMemo(() => {
    const map = new Map<string, CalendarSchedule[]>();
    schedules.forEach((s) => {
      const d = new Date(s.startsAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const list = map.get(key) || [];
      list.push(s);
      map.set(key, list);
    });
    return map;
  }, [schedules]);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert so Monday is 0
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  const calendarDays = [];
  for (let i = 0; i < startOffset; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push({
      day,
      dateKey,
      isToday: dateKey === todayStr,
      events: schedulesByDate.get(dateKey) || [],
    });
  }

  const selectedEvents = selectedDate ? schedulesByDate.get(selectedDate) || [] : [];

  return (
    <div className="schedule-calendar-wrap" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        className="calendar-card"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
            {monthNames[month]} {year}
          </h2>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              className="icon-button"
              onClick={prevMonth}
              aria-label="Bulan sebelumnya"
              style={{ width: "36px", height: "36px" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={nextMonth}
              aria-label="Bulan berikutnya"
              style={{ width: "36px", height: "36px" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            fontWeight: 650,
            fontSize: "0.82rem",
            color: "var(--muted)",
            paddingBottom: "10px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {dayNames.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Grid of days */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
            marginTop: "8px",
          }}
        >
          {calendarDays.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} style={{ minHeight: "68px" }} />;
            }

            const isSelected = selectedDate === item.dateKey;
            const hasEvents = item.events.length > 0;

            return (
              <button
                key={item.dateKey}
                type="button"
                onClick={() => setSelectedDate(isSelected ? null : item.dateKey)}
                style={{
                  minHeight: "68px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "6px 2px",
                  borderRadius: "10px",
                  border: isSelected ? "2px solid var(--primary)" : "1px solid transparent",
                  backgroundColor: item.isToday
                    ? "var(--secondary)"
                    : isSelected
                    ? "rgba(53, 104, 89, 0.08)"
                    : "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: item.isToday || isSelected ? 700 : 500,
                    color: item.isToday ? "var(--primary)" : "inherit",
                    width: "24px",
                    height: "24px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                  }}
                >
                  {item.day}
                </span>

                {hasEvents && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", padding: "0 4px", marginTop: "2px" }}>
                    {item.events.slice(0, 2).map((ev) => (
                      <span
                        key={ev.id}
                        title={ev.title}
                        style={{
                          fontSize: "0.68rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          backgroundColor: "var(--primary)",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "1px 4px",
                          lineHeight: 1.2,
                        }}
                      >
                        {ev.title}
                      </span>
                    ))}
                    {item.events.length > 2 && (
                      <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                        +{item.events.length - 2} lagi
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day agenda details */}
      {selectedDate && (
        <section
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, fontSize: "1.05rem" }}>
              Agenda Tanggal {selectedDate}
            </h3>
            <button
              type="button"
              className="text-button"
              onClick={() => setSelectedDate(null)}
              style={{ fontSize: "0.82rem" }}
            >
              Tutup
            </button>
          </div>

          {selectedEvents.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedEvents.map((ev) => {
                const timeStr = new Intl.DateTimeFormat("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(ev.startsAt));

                return (
                  <div
                    key={ev.id}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--background)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <strong style={{ fontSize: "1rem", display: "block" }}>{ev.title}</strong>
                    <div style={{ display: "flex", gap: "16px", marginTop: "6px", color: "var(--muted)", fontSize: "0.84rem", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={15} /> {timeStr} WIB
                      </span>
                      {ev.locationName && (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <MapPin size={15} /> {ev.locationName}
                        </span>
                      )}
                      {ev.companion && (
                        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          <UserRound size={15} /> Pendamping: {ev.companion.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem" }}>
              Tidak ada agenda keluarga pada tanggal ini.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
