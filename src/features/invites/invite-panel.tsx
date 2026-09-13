"use client";

import { Check, Copy, KeyRound, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createInvite, type CreatedInvite } from "./actions";
import type { ActionResult } from "@/types/domain";

const initialState: ActionResult<CreatedInvite> = { ok: false, code: "IDLE", message: "" };

function CreateButton() {
  const { pending } = useFormStatus();
  return <button className="button button-primary" type="submit" disabled={pending}>
    {pending ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : <KeyRound size={18} aria-hidden="true" />}
    {pending ? "Membuat…" : "Buat kode undangan"}
  </button>;
}

export function InvitePanel({ circleId }: { circleId: string }) {
  const [state, action] = useActionState(createInvite, initialState);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!state.ok) return;
    try {
      await navigator.clipboard.writeText(state.data.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return <section className="invite-panel" aria-labelledby="invite-title">
    <div><div className="eyebrow">Undang keluarga</div><h2 id="invite-title">Kode undangan</h2><p>Kode berlaku 7 hari dan dapat digunakan hingga 10 kali. Bagikan hanya kepada orang yang Anda percaya.</p></div>
    <form action={action}>
      <input type="hidden" name="circleId" value={circleId} />
      <CreateButton />
    </form>
    {!state.ok && state.code !== "IDLE" && <div className="alert alert-error" role="alert">{state.message}</div>}
    {state.ok && <div className="invite-code-result" role="status">
      <p>Kode ini hanya ditampilkan sekarang. Salin sebelum meninggalkan halaman.</p>
      <div className="invite-code-row"><code>{state.data.code}</code><button className="button button-secondary button-small" type="button" onClick={copyCode} aria-label="Salin kode undangan">{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? "Tersalin" : "Salin"}</button></div>
      <span className="sr-only" aria-live="polite">{copied ? "Kode undangan tersalin." : ""}</span>
    </div>}
  </section>;
}
