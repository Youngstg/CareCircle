"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult } from "@/types/domain";
import { createNote } from "../actions";

const initialState: ActionResult = { ok: true, data: undefined };

export function NoteCreate({ circleId, schedules }: { circleId: string; schedules: { id: string; title: string }[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createNote, initialState);
  useEffect(() => { if (state.ok && !pending && dialog.current?.open) { form.current?.reset(); dialog.current.close(); } }, [state, pending]);
  return <><button className="button button-primary" onClick={() => dialog.current?.showModal()}><Plus size={18} />Tambah catatan</button><dialog ref={dialog} className="dialog"><div className="dialog-head"><div><span className="eyebrow">Informasi keluarga</span><h2>Tambah catatan</h2></div><button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}><X /></button></div><form ref={form} action={action} className="form-stack"><input type="hidden" name="circleId" value={circleId} /><label>Isi catatan<textarea name="body" required rows={6} maxLength={2000} placeholder="Informasi singkat yang perlu diketahui keluarga" /></label><label>Jadwal terkait (opsional)<select name="scheduleId" defaultValue=""><option value="">Tidak terkait jadwal</option>{schedules.map((schedule) => <option key={schedule.id} value={schedule.id}>{schedule.title}</option>)}</select></label><label className="checkbox-label"><input name="isPinned" type="checkbox" />Sematkan sebagai catatan penting</label><p className="auth-note">Jangan tulis diagnosis, nomor identitas, atau informasi medis yang tidak diperlukan.</p>{!state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}<div className="dialog-actions"><button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>Batal</button><button className="button button-primary" disabled={pending}>{pending ? "Menyimpan…" : "Simpan catatan"}</button></div></form></dialog></>;
}
