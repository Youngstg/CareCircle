"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult, Member } from "@/types/domain";
import { createSchedule } from "../actions";

const initialState: ActionResult = { ok: true, data: undefined };

export function ScheduleCreate({ circleId, members }: { circleId: string; members: Member[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createSchedule, initialState);
  useEffect(() => { if (state.ok && !pending && dialog.current?.open) { form.current?.reset(); dialog.current.close(); } }, [state, pending]);

  return <>
    <button className="button button-primary" onClick={() => dialog.current?.showModal()}><Plus size={18} />Tambah jadwal</button>
    <dialog ref={dialog} className="dialog"><div className="dialog-head"><div><span className="eyebrow">Agenda keluarga</span><h2>Tambah jadwal</h2></div><button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}><X /></button></div>
      <form ref={form} action={action} className="form-stack">
        <input type="hidden" name="circleId" value={circleId} />
        <label>Judul<input name="title" required maxLength={120} /></label>
        <div className="form-grid"><label>Mulai<input name="startsAt" type="datetime-local" required /></label><label>Selesai (opsional)<input name="endsAt" type="datetime-local" /></label></div>
        <label>Lokasi (opsional)<input name="locationName" maxLength={191} /></label>
        <label>Pendamping (opsional)<select name="companionUserId" defaultValue=""><option value="">Belum ditentukan</option>{members.map((member) => <option key={member.id} value={member.id}>{member.displayName}</option>)}</select></label>
        <label>Deskripsi (opsional)<textarea name="description" rows={3} maxLength={1000} /></label>
        <label>Daftar persiapan (opsional)<textarea name="checklist" rows={5} placeholder={"1. Siapkan dokumen yang diperlukan\n2. Konfirmasi transportasi\n3. Hubungi pendamping"} maxLength={2000} /><small>Tulis satu item per baris. Nomor di awal baris akan dirapikan otomatis, maksimal 20 item.</small></label>
        {!state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}
        <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>Batal</button><button className="button button-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan jadwal"}</button></div>
      </form>
    </dialog>
  </>;
}
