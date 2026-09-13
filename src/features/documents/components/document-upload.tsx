"use client";

import { FileUp, ShieldAlert, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/types/domain";
import { uploadDocument } from "../actions";
import { documentCategories, documentCategoryLabels } from "../schemas";

const initialState: ActionResult = { ok: false, code: "IDLE", message: "" };

export function DocumentUpload({ circleId }: { circleId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [state, action, pending] = useActionState(uploadDocument, initialState);

  useEffect(() => {
    if (!state.ok) return;
    form.current?.reset();
    const timer = window.setTimeout(() => setSelectedFileName(""), 0);
    return () => window.clearTimeout(timer);
  }, [state]);

  return <>
    <button className="button button-primary" type="button" onClick={() => dialog.current?.showModal()}>
      <FileUp size={18} aria-hidden="true" />Unggah dokumen
    </button>
    <dialog ref={dialog} className="dialog" onCancel={() => dialog.current?.close()}>
      <div className="dialog-head">
        <div><span className="eyebrow">Penyimpanan privat</span><h2>Unggah dokumen</h2></div>
        <button className="icon-button" type="button" aria-label="Tutup dialog unggah" onClick={() => dialog.current?.close()}><X /></button>
      </div>
      <form ref={form} action={action} className="form-stack">
        <input type="hidden" name="circleId" value={circleId} />
        <label>Judul dokumen<input name="title" required maxLength={120} /></label>
        <label>Kategori<select name="category" required defaultValue=""><option value="" disabled>Pilih kategori</option>{documentCategories.map((category) => <option key={category} value={category}>{documentCategoryLabels[category]}</option>)}</select></label>
        <label>File
          <span className="file-picker">
            <span className={selectedFileName ? "file-picker-name selected" : "file-picker-name"}>{selectedFileName || "Belum ada file dipilih"}</span>
            <span className="file-picker-button">Pilih file</span>
            <input ref={fileInput} className="file-picker-input" name="file" type="file" required accept="application/pdf,image/jpeg,image/png,image/webp" aria-describedby="document-file-help" onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")} />
          </span>
          <small id="document-file-help">PDF, JPEG, PNG, atau WebP. Maksimal 10 MB.</small>
        </label>
        <label>Catatan (opsional)<textarea name="note" rows={3} maxLength={1000} /></label>
        <div className="sensitive-consent"><ShieldAlert size={22} aria-hidden="true" /><div><strong>Dokumen dapat berisi data sensitif</strong><p>File disimpan privat dan hanya dapat diakses anggota Care Circle. Dokumen dapat dilihat atau diunduh oleh anggota, tetapi CareCircle tidak mengindeks isi dokumen.</p></div></div>
        <label className="checkbox-label"><input name="consent" type="checkbox" value="accepted" required />Saya memahami dan menyetujui penyimpanan data sensitif ini.</label>
        {!state.ok && state.code !== "IDLE" && <div className="alert alert-error" role="alert">{state.message}</div>}
        {state.ok && <div className="alert alert-success" role="status">Dokumen berhasil disimpan secara privat.</div>}
        <div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => dialog.current?.close()}>Tutup</button><button className="button button-primary" type="submit" disabled={pending}>{pending ? "Mengunggah…" : "Unggah privat"}</button></div>
      </form>
    </dialog>
  </>;
}
