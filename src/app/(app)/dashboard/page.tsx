import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Plus } from "lucide-react";
import { listRecentActivities } from "@/features/activities/queries";
import { getCircleContext } from "@/features/circles/queries";
import { listSchedules } from "@/features/schedules/queries";
import { TaskRow } from "@/features/tasks/components/task-row";
import { listTasks } from "@/features/tasks/queries";

const activityDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ welcome?: string; joined?: string }> }) {
  const context = await getCircleContext();
  const [tasks, activities, schedules] = await Promise.all([
    listTasks(context.circleId, context.members),
    listRecentActivities(context.circleId),
    listSchedules(context.circleId),
  ]);
  const open = tasks.filter((task) => !task.completedAt).slice(0, 3);
  const nextSchedule = schedules.find((schedule) => schedule.startsAt >= new Date());
  const { welcome, joined } = await searchParams;
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return <>
    {welcome && <div className="alert alert-success" role="status"><CheckCircle2 size={18} />Care Circle siap. Tambahkan tugas pertama untuk mulai berkoordinasi.</div>}
    {joined && <div className="alert alert-success" role="status"><CheckCircle2 size={18} />Anda berhasil bergabung dengan Care Circle.</div>}
    <header className="page-header">
      <div><div className="eyebrow">{today}</div><h1>Selamat datang, {context.displayName.split(" ")[0]}</h1><p>Apa yang perlu disiapkan hari ini?</p></div>
      <Link className="button button-primary" href="/tasks"><Plus size={18} />Tambah tugas</Link>
    </header>

    <section className="next-agenda" id="jadwal" aria-labelledby="agenda-title">
      <span className="feature-icon"><CalendarDays /></span>
      {nextSchedule ? <div><div className="eyebrow">Agenda berikutnya</div><h2 id="agenda-title">{nextSchedule.title}</h2><p>{activityDateFormatter.format(nextSchedule.startsAt)}{nextSchedule.locationName ? ` · ${nextSchedule.locationName}` : ""}</p><p>{nextSchedule.checklist.filter((item) => item.completedAt).length} dari {nextSchedule.checklist.length} persiapan selesai</p><Link className="button button-secondary button-small" href="/schedule">Lihat jadwal</Link></div> : <div><div className="eyebrow">Agenda berikutnya</div><h2 id="agenda-title">Belum ada agenda bersama</h2><p>Tambahkan jadwal pertama agar keluarga dapat mulai bersiap.</p><Link className="button button-secondary button-small" href="/schedule">Tambah jadwal</Link></div>}
    </section>

    <div className="dashboard-grid">
      <section>
        <div className="section-heading"><div><h2>Perlu perhatian</h2><p>Tugas terbuka dari keluarga Anda.</p></div><Link href="/tasks">Lihat semua <ArrowRight size={16} /></Link></div>
        <div className="task-list compact">{open.length
          ? open.map((task) => <TaskRow key={task.id} task={task} />)
          : <div className="calm-empty"><CheckCircle2 /><div><strong>Belum ada tugas</strong><p>Tambahkan tugas pertama untuk membagi tanggung jawab keluarga.</p></div></div>}
        </div>
      </section>

      <aside className="activity-panel">
        <h2>Aktivitas terbaru</h2>
        {activities.length
          ? activities.map((activity) => <div className="activity-item" key={activity.id}><span><CheckCircle2 size={17} /></span><div><strong>{activity.summary}</strong><small>{activityDateFormatter.format(new Date(activity.createdAt))}</small></div></div>)
          : <div className="calm-empty"><Clock3 /><div><strong>Belum ada aktivitas</strong><p>Perubahan penting keluarga akan tampil di sini.</p></div></div>}
        <div className="privacy-note" id="lainnya"><Clock3 size={18} /><p>CareCircle hanya untuk koordinasi non-medis. Jangan simpan data kesehatan sensitif.</p></div>
      </aside>
    </div>
  </>;
}
