"use client";

import { useActionState, useEffect, useRef } from "react";
import { Edit2, X } from "lucide-react";
import type { ActionResult, Member } from "@/types/domain";
import { updateSchedule } from "../actions";

const initialState: ActionResult = { ok: true, data: undefined };

function toDatetimeLocal(date: Date | string): string {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

export function ScheduleEditDialog({
  schedule,
  circleId,
  members,
}: {
  schedule: {
    id: string;
    title: string;
    startsAt: Date | string;
    endsAt?: Date | string | null;
    locationName?: string | null;
    description?: string | null;
    companionUserId?: string | null;
  };
  circleId: string;
  members: Member[];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(updateSchedule, initialState);

  useEffect(() => {
    if (state.ok && !pending && dialog.current?.open) {
      dialog.current.close();
    }
  }, [state, pending]);

  return (
    <>
      <button
        type="button"
        className="icon-button"
        title="Ubah detail jadwal"
        aria-label={`Ubah jadwal ${schedule.title}`}
        onClick={() => dialog.current?.showModal()}
        style={{ width: "32px", height: "32px" }}
      >
        <Edit2 size={16} />
      </button>

      <dialog ref={dialog} className="dialog" onCancel={() => dialog.current?.close()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Agenda Keluarga</span>
            <h2>Ubah Jadwal</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}>
            <X size={20} />
          </button>
        </div>

        <form action={action} className="form-stack">
          <input type="hidden" name="scheduleId" value={schedule.id} />
          <input type="hidden" name="circleId" value={circleId} />

          <label>
            Nama kegiatan / agenda
            <input name="title" defaultValue={schedule.title} required maxLength={120} />
          </label>

          <div className="form-grid">
            <label>
              Waktu Mulai
              <input name="startsAt" type="datetime-local" defaultValue={toDatetimeLocal(schedule.startsAt)} required />
            </label>
            <label>
              Waktu Selesai (opsional)
              <input name="endsAt" type="datetime-local" defaultValue={schedule.endsAt ? toDatetimeLocal(schedule.endsAt) : ""} />
            </label>
          </div>

          <label>
            Lokasi (opsional)
            <input name="locationName" defaultValue={schedule.locationName ?? ""} placeholder="Contoh: Poli Jantung RS Medika" maxLength={191} />
          </label>

          <label>
            Pendamping dari keluarga
            <select name="companionUserId" defaultValue={schedule.companionUserId ?? ""}>
              <option value="">Belum ditentukan</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.displayName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Catatan agenda (opsional)
            <textarea name="description" rows={3} defaultValue={schedule.description ?? ""} maxLength={1000} />
          </label>

          {!state.ok && <div className="alert alert-error" role="alert">{state.message}</div>}

          <div className="dialog-actions">
            <button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>
              Batal
            </button>
            <button className="button button-primary" disabled={pending}>
              {pending ? "Menyimpan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
