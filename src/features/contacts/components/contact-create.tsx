"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import type { ActionResult } from "@/types/domain";
import { createContact } from "../actions";
import { contactRoles } from "../schemas";

const initialState: ActionResult = { ok: true, data: undefined };

export function ContactCreate({ circleId }: { circleId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(createContact, initialState);

  useEffect(() => {
    if (state.ok && !pending && dialog.current?.open) {
      form.current?.reset();
      dialog.current.close();
    }
  }, [state, pending]);

  return (
    <>
      <button className="button button-primary" onClick={() => dialog.current?.showModal()}>
        <Plus size={18} />
        Tambah kontak
      </button>

      <dialog ref={dialog} className="dialog">
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Direktori Keluarga</span>
            <h2>Tambah kontak penting</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}>
            <X size={20} />
          </button>
        </div>

        <form ref={form} action={action} className="form-stack">
          <input type="hidden" name="circleId" value={circleId} />

          <label>
            Nama kontak atau fasilitas
            <input name="name" required placeholder="Contoh: dr. Bambang Sp.PD / RS Medika" maxLength={120} />
          </label>

          <label>
            Peran / Kategori
            <select name="role" defaultValue={contactRoles[0]} required>
              {contactRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <div className="form-grid">
            <label>
              Nomor Telepon
              <input name="phoneNumber" type="tel" required placeholder="08123456789 atau (021) 123456" maxLength={50} />
            </label>
            <label>
              Nomor WhatsApp (opsional)
              <input name="whatsapp" type="tel" placeholder="08123456789" maxLength={50} />
            </label>
          </div>

          <label>
            Alamat / Lokasi (opsional)
            <input name="address" placeholder="Contoh: Gedung A Lt. 2, Jl. Sudirman No. 10" maxLength={255} />
          </label>

          <label>
            Catatan tambahan (opsional)
            <textarea name="note" rows={3} placeholder="Contoh: Jadwal praktek Senin-Kamis 10:00-14:00, perlu janji temu via WA" maxLength={500} />
          </label>

          <p className="auth-note">
            Kontak ini hanya dapat dilihat oleh anggota Care Circle Anda.
          </p>

          {!state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}

          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>
              Batal
            </button>
            <button className="button button-primary" disabled={pending}>
              {pending ? "Menyimpan…" : "Simpan kontak"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
