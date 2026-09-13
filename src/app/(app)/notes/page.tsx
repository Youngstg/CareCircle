import { NotebookPen, Pin, Trash2 } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { deleteNote } from "@/features/notes/actions";
import { NotePin } from "@/features/notes/components/note-actions";
import { NoteCreate } from "@/features/notes/components/note-create";
import { listNotes } from "@/features/notes/queries";
import { listSchedules } from "@/features/schedules/queries";

const formatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function NotesPage() {
  const context = await getCircleContext();
  const [notes, schedules] = await Promise.all([listNotes(context.circleId), listSchedules(context.circleId)]);
  return <><header className="page-header"><div><div className="eyebrow">{context.circleName}</div><h1>Catatan bersama</h1><p>Simpan informasi koordinasi singkat yang perlu diketahui keluarga.</p></div><NoteCreate circleId={context.circleId} schedules={schedules.map(({ id, title }) => ({ id, title }))} /></header>
    <section className="notes-feed" aria-label="Daftar catatan">{notes.length ? notes.map((note) => <article className={`note-card ${note.isPinned ? "note-pinned" : ""}`} key={note.id}><div className="note-card-head"><div>{note.isPinned && <span className="badge badge-warning"><Pin size={13} />Disematkan</span>}<strong>{note.createdBy.name}</strong><small>{formatter.format(note.createdAt)}</small></div><div className="note-controls"><NotePin id={note.id} circleId={context.circleId} initialPinned={note.isPinned} /><form action={deleteNote}><input type="hidden" name="noteId" value={note.id} /><input type="hidden" name="circleId" value={context.circleId} /><button className="icon-button" title="Hapus catatan" aria-label="Hapus catatan"><Trash2 size={17} /></button></form></div></div><p>{note.body}</p>{note.schedule && <small className="related-schedule">Terkait: {note.schedule.title}</small>}</article>) : <div className="empty-state"><span><NotebookPen /></span><h2>Belum ada catatan bersama</h2><p>Simpan informasi singkat yang perlu diketahui keluarga.</p></div>}</section>
  </>;
}
