"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";
import type { ActionResult } from "@/types/domain";
import { deleteDocument } from "../actions";

const initialState: ActionResult = { ok: false, code: "IDLE", message: "" };

export function DocumentDelete({ documentId }: { documentId: string }) {
  const [state, action, pending] = useActionState(deleteDocument, initialState);
  return <form action={action} onSubmit={(event) => {
    if (!window.confirm("Hapus dokumen ini secara permanen? Tindakan ini tidak dapat dibatalkan.")) event.preventDefault();
  }}>
    <input type="hidden" name="documentId" value={documentId} />
    <button className="document-delete" type="submit" disabled={pending} aria-label="Hapus dokumen"><Trash2 size={17} aria-hidden="true" />{pending ? "Menghapus…" : "Hapus"}</button>
    {!state.ok && state.code !== "IDLE" && <span className="inline-error" role="alert">{state.message}</span>}
  </form>;
}
