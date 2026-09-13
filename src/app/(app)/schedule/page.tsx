import { CalendarDays, Clock3, MapPin, Trash2, UserRound } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { deleteSchedule } from "@/features/schedules/actions";
import { ChecklistToggle } from "@/features/schedules/components/checklist-toggle";
import { ScheduleCreate } from "@/features/schedules/components/schedule-create";
import { listSchedules } from "@/features/schedules/queries";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function SchedulePage() {
  const context = await getCircleContext();
  const schedules = await listSchedules(context.circleId);
  const now = new Date();
  const upcoming = schedules.filter((schedule) => schedule.startsAt >= now);
  const past = schedules.filter((schedule) => schedule.startsAt < now).reverse();
  const renderSchedule = (schedule: typeof schedules[number]) => {
    const complete = schedule.checklist.filter((item) => item.completedAt).length;
    return <article className="schedule-card" key={schedule.id}>
      <div className="schedule-card-head"><span className="feature-icon"><CalendarDays /></span><div><h2>{schedule.title}</h2><p><Clock3 size={16} />{dateFormatter.format(schedule.startsAt)}</p>{schedule.locationName && <p><MapPin size={16} />{schedule.locationName}</p>}{schedule.companion && <p><UserRound size={16} />Pendamping: {schedule.companion.name}</p>}</div><form action={deleteSchedule}><input type="hidden" name="scheduleId" value={schedule.id} /><input type="hidden" name="circleId" value={context.circleId} /><button className="icon-button" title="Hapus jadwal" aria-label={`Hapus jadwal ${schedule.title}`}><Trash2 size={18} /></button></form></div>
      {schedule.description && <p className="schedule-description">{schedule.description}</p>}
      <div className="checklist-section"><strong>Persiapan · {complete} dari {schedule.checklist.length} selesai</strong>{schedule.checklist.length ? <ul>{schedule.checklist.map((item, index) => <ChecklistToggle key={item.id} id={item.id} circleId={context.circleId} label={item.label} completed={Boolean(item.completedAt)} assignee={item.assignedTo?.name} index={index + 1} />)}</ul> : <p>Belum ada daftar persiapan.</p>}</div>
    </article>;
  };
  return <><header className="page-header"><div><div className="eyebrow">{context.circleName}</div><h1>Jadwal keluarga</h1><p>Atur agenda dan persiapan yang perlu diselesaikan bersama.</p></div><ScheduleCreate circleId={context.circleId} members={context.members} /></header>
    <section><div className="section-heading"><div><h2>Akan datang</h2><p>{upcoming.length} agenda mendatang.</p></div></div><div className="schedule-list">{upcoming.length ? upcoming.map(renderSchedule) : <div className="empty-state"><span><CalendarDays /></span><h2>Belum ada agenda bersama</h2><p>Tambahkan jadwal pertama agar keluarga dapat mulai bersiap.</p></div>}</div></section>
    {past.length > 0 && <section className="past-section"><div className="section-heading"><h2>Sudah berlalu</h2></div><div className="schedule-list">{past.map(renderSchedule)}</div></section>}
  </>;
}
