"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

export function WhatsAppShareButton({
  circleName,
  nextAgenda,
  openTasksCount,
  topTasks,
  routinesCount,
}: {
  circleName: string;
  nextAgenda?: { title: string; time: string; location?: string | null };
  openTasksCount: number;
  topTasks?: { title: string; assignee?: string | null }[];
  routinesCount?: { completed: number; total: number };
}) {
  const [copied, setCopied] = useState(false);

  const todayStr = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  let summaryText = `💙 *Ringkasan CareCircle Hari Ini*\n`;
  summaryText += `Lingkaran: *${circleName}*\n`;
  summaryText += `Tanggal: ${todayStr}\n\n`;

  if (nextAgenda) {
    summaryText += `🗓️ *Agenda Terdekat:*\n`;
    summaryText += `• ${nextAgenda.title}\n  Waktu: ${nextAgenda.time}${nextAgenda.location ? `\n  Lokasi: ${nextAgenda.location}` : ""}\n\n`;
  }

  if (routinesCount && routinesCount.total > 0) {
    summaryText += `💊 *Rutinitas & Obat:* ${routinesCount.completed} dari ${routinesCount.total} selesai\n\n`;
  }

  summaryText += `📋 *Status Tugas:* ${openTasksCount} tugas belum selesai\n`;
  if (topTasks && topTasks.length > 0) {
    topTasks.forEach((t) => {
      summaryText += `• [ ] ${t.title}${t.assignee ? ` (${t.assignee})` : ""}\n`;
    });
  }

  summaryText += `\n_Dikoordinasikan via CareCircle_ 🌿`;

  const waUrl = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="button button-secondary button-small"
        title="Bagikan ringkasan koordinasi hari ini ke grup WhatsApp keluarga"
        style={{ color: "#25D366" }}
      >
        <MessageCircle size={16} />
        <span>Kirim ke WhatsApp</span>
      </a>

      <button
        type="button"
        className="button button-secondary button-small"
        onClick={handleCopy}
        title="Salin teks ringkasan untuk ditempel ke aplikasi lain"
      >
        {copied ? <Check size={16} style={{ color: "var(--success)" }} /> : <Copy size={16} />}
        <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
      </button>
    </div>
  );
}
