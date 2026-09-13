"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult, Member } from "@/types/domain";
import { createTask } from "../actions";

const initialState: ActionResult = { ok: true, data: undefined };

export function TaskCreate({ circleId, members }: { circleId: string; members: Member[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createTask, initialState);
  useEffect(() => { if (state.ok && !pending && dialog.current?.open) { form.current?.reset(); dialog.current.close(); } }, [state, pending]);
  return <>
    <button className="button button-primary" onClick={() => dialog.current?.showModal()}><Plus size={18} />Tambah tugas</button>
    <dialog ref={dialog} className="dialog" onCancel={() => dialog.current?.close()}>
      <div className="dialog-head"><div><span className="eyebrow">Tanggung jawab baru</span><h2>Tambah tugas</h2></div><button className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}><X /></button></div>
      <form ref={form} action={action} className="form-stack">
        <input type="hidden" name="circleId" value={circleId} />
        <label>Judul tugas<input name="title" required maxLength={120} aria-describedby={!state.ok ? "task-error" : undefined} /></label>
        <label>Berikan kepada<select name="assignedTo" required defaultValue=""><option value="" disabled>Pilih anggota</option>{members.map((member) => <option key={member.id} value={member.id}>{member.displayName}</option>)}</select></label>
        <div className="form-grid"><label>Tenggat (opsional)<input name="dueAt" type="date" /></label><label>Prioritas<select name="priority" defaultValue="normal"><option value="normal">Normal</option><option value="important">Penting</option></select></label></div>
        <label>Deskripsi (opsional)<textarea name="description" rows={3} maxLength={1000} /></label>
        {!state.ok && <div id="task-error" className="alert alert-error" role="alert">{state.message}</div>}
        <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => dialog.current?.close()}>Batal</button><button className="button button-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan tugas"}</button></div>
      </form>
    </dialog>
  </>;
}
