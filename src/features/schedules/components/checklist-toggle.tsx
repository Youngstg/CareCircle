"use client";

import { useState, useTransition } from "react";
import { toggleChecklist } from "../actions";

export function ChecklistToggle({ id, circleId, label, completed, assignee, index }: { id: string; circleId: string; label: string; completed: boolean; assignee?: string | null; index: number }) {
  const [checked, setChecked] = useState(completed);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  function change(next: boolean) {
    setChecked(next); setError("");
    startTransition(async () => { const result = await toggleChecklist(id, circleId, next); if (!result.ok) { setChecked(!next); setError(result.message); } });
  }
  return <li className={checked ? "checklist-done" : undefined}><label><span className="checklist-number" aria-hidden="true">{index}.</span><input type="checkbox" checked={checked} disabled={pending} onChange={(event) => change(event.target.checked)} /><span>{label}</span></label>{assignee && <small>{assignee}</small>}{error && <small className="inline-error">{error}</small>}</li>;
}
