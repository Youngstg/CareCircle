"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult } from "@/types/domain";
import { createRoutine } from "../actions";
import { routineCategories, routineTimes } from "../schemas";

const initialState: ActionResult = { ok: true, data: undefined };

export function RoutineCreate({ circleId }: { circleId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createRoutine, initialState);

  useEffect(() => {
    if (state.ok && !pending && dialog.current?.open) {
      form.current?.reset();
      dialog.current.close();
    }
  }, [state, pending]);

  return (
    <>
      <button
        type="button"
        className="button button-secondary button-small"
        onClick={() => dialog.current?.showModal()}
        title="Tambah rutinitas harian baru"
      >
        <Plus size={16} />
        Tambah Rutinitas
      </button>

      <dialog ref={dialog} className="dialog" onCancel={() => dialog.current?.close()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Rutinitas Harian</span>
            <h2>Tambah obat / rutinitas harian</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}>
            <X size={20} />
          </button>
        </div>

        <form ref={form} action={action} className="form-stack">
          <input type="hidden" name="circleId" value={circleId} />

          <label>
            Nama obat / kegiatan rutin
            <input name="title" required placeholder="Contoh: Amlodipine 5mg (sesudah makan) / Cek Tensi" maxLength={120} />
          </label>

          <div className="form-grid">
            <label>
              Kategori
              <select name="category" defaultValue="MEDICATION" required>
                {routineCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Waktu Pelaksanaan
              <select name="timeOfDay" defaultValue="MORNING" required>
                {routineTimes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Jam Spesifik (opsional)
            <input name="customTime" placeholder="Contoh: 08:00 WIB" maxLength={20} />
          </label>

          <label>
            Catatan / Dosis / Cara minum (opsional)
            <textarea name="note" rows={2} placeholder="Contoh: 1 tablet setelah sarapan pagi, jangan diminum saat perut kosong" maxLength={500} />
          </label>

          <p className="auth-note">
            Rutinitas ini akan muncul setiap hari sebagai checklist bersama seluruh keluarga.
          </p>

          {!state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}

          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>
              Batal
            </button>
            <button className="button button-primary" disabled={pending}>
              {pending ? "Menyimpan…" : "Simpan Rutinitas"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
