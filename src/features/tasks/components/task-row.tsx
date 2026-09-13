"use client";

import { useState, useTransition } from "react";
import { CircleAlert, Flag, UserRound } from "lucide-react";
import { formatDate, isOverdue } from "@/lib/dates";
import type { CareTask } from "@/types/domain";
import { toggleTask } from "../actions";

export function TaskRow({ task }: { task: CareTask }) {
  const [checked, setChecked] = useState(Boolean(task.completedAt));
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function change(next: boolean) {
    setChecked(next); setMessage("");
    startTransition(async () => {
      const result = await toggleTask(task.id, task.circleId, next);
      if (!result.ok) { setChecked(!next); setMessage(result.message); }
      else setMessage(next ? "Tugas selesai." : "Tugas dibuka kembali.");
    });
  }
  const overdue = isOverdue(task.dueAt, checked ? new Date().toISOString() : null);
  return <article className={`task-row ${checked ? "completed" : ""}`}>
    <label className="task-check"><input type="checkbox" checked={checked} disabled={pending} onChange={(event) => change(event.target.checked)} /><span className="sr-only">Tandai {task.title} sebagai {checked ? "belum selesai" : "selesai"}</span></label>
    <div className="task-content"><div className="task-title-line"><h3>{task.title}</h3>{task.priority === "important" && <span className="badge badge-warning"><Flag size={13} />Penting</span>}</div>{task.description && <p>{task.description}</p>}<div className="task-meta"><span><UserRound size={15} />{task.assigneeName}</span><span className={overdue ? "overdue" : ""}>{overdue && <CircleAlert size={15} />}{overdue ? "Terlambat · " : ""}{formatDate(task.dueAt)}</span></div>{message && <span className={message.includes("belum dapat") ? "inline-error" : "inline-success"} role="status">{message}</span>}</div>
  </article>;
}
