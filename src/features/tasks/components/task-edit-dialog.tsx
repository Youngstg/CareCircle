"use client";

import { useActionState, useEffect, useRef } from "react";
import { MoreVertical, Trash2, X } from "lucide-react";
import type { ActionResult, CareTask, Member } from "@/types/domain";
import { deleteTask, updateTask } from "../actions";

const initialState: ActionResult = { ok: true, data: undefined };

export function TaskEditDialog({ task, members }: { task: CareTask; members: Member[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState(updateTask, initialState);

  useEffect(() => {
    if (state.ok && !pending && dialog.current?.open) {
      dialog.current.close();
    }
  }, [state, pending]);

  const defaultDue = task.dueAt ? new Date(task.dueAt).toISOString().split("T")[0] : "";

  return (
    <>
      <button
        type="button"
        className="icon-button"
        aria-label={`Ubah atau kelola tugas ${task.title}`}
        title="Ubah tugas"
        onClick={() => dialog.current?.showModal()}
        style={{ width: "32px", height: "32px", flexShrink: 0 }}
      >
        <MoreVertical size={16} />
      </button>

      <dialog ref={dialog} className="dialog" onCancel={() => dialog.current?.close()}>
        <div className="dialog-head">
          <div>
            <span className="eyebrow">Kelola Tugas</span>
            <h2>Ubah detail tugas</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Tutup" onClick={() => dialog.current?.close()}>
            <X size={20} />
          </button>
        </div>

        <form action={action} className="form-stack">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="circleId" value={task.circleId} />

          <label>
            Judul tugas
            <input name="title" required defaultValue={task.title} maxLength={120} />
          </label>

          <label>
            Berikan kepada
            <select name="assignedTo" required defaultValue={task.assignedTo ?? ""}>
              <option value="" disabled>
                Pilih anggota
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </label>

          <div className="form-grid">
            <label>
              Tenggat (opsional)
              <input name="dueAt" type="date" defaultValue={defaultDue} />
            </label>
            <label>
              Prioritas
              <select name="priority" defaultValue={task.priority}>
                <option value="normal">Normal</option>
                <option value="important">Penting</option>
              </select>
            </label>
          </div>

          <label>
            Deskripsi (opsional)
            <textarea name="description" rows={3} defaultValue={task.description ?? ""} maxLength={1000} />
          </label>

          {!state.ok && (
            <div className="alert alert-error" role="alert">
              {state.message}
            </div>
          )}

          <div className="dialog-actions" style={{ justifyContent: "space-between" }}>
            <form action={deleteTask} style={{ margin: 0 }}>
              <input type="hidden" name="taskId" value={task.id} />
              <input type="hidden" name="circleId" value={task.circleId} />
              <button
                type="submit"
                className="button button-secondary"
                style={{ color: "var(--danger)" }}
                onClick={(e) => {
                  if (!confirm(`Hapus tugas "${task.title}"?`)) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 size={16} />
                Hapus
              </button>
            </form>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" className="button button-secondary" onClick={() => dialog.current?.close()}>
                Batal
              </button>
              <button className="button button-primary" disabled={pending}>
                {pending ? "Menyimpan…" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}
