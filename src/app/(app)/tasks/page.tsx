import { EmptyState } from "@/components/ui/states";
import { getCircleContext } from "@/features/circles/queries";
import { TaskCreate } from "@/features/tasks/components/task-create";
import { TaskRow } from "@/features/tasks/components/task-row";
import { listTasks } from "@/features/tasks/queries";

const filters = ["semua", "milik-saya", "terbuka", "selesai"] as const;
type Filter = typeof filters[number];

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const context = await getCircleContext();
  const tasks = await listTasks(context.circleId, context.members);
  const requested = (await searchParams).filter;
  const filter: Filter = filters.includes(requested as Filter) ? requested as Filter : "semua";
  const visible = tasks.filter((task) => filter === "semua" || (filter === "milik-saya" && task.assignedTo === context.userId) || (filter === "terbuka" && !task.completedAt) || (filter === "selesai" && task.completedAt));
  return <><header className="page-header"><div><div className="eyebrow">{context.circleName}</div><h1>Tugas keluarga</h1><p>Bagi tanggung jawab dan lihat siapa yang menanganinya. “Belum selesai” berarti tugas yang masih perlu dikerjakan.</p></div><TaskCreate circleId={context.circleId} members={context.members} /></header><nav className="filter-tabs" aria-label="Filter tugas">{filters.map((item) => <a key={item} href={`/tasks?filter=${item}`} aria-current={filter === item ? "page" : undefined}>{item === "semua" ? "Semua" : item === "milik-saya" ? "Milik saya" : item === "terbuka" ? "Belum selesai" : "Selesai"}</a>)}</nav><section className="task-list" aria-label="Daftar tugas">{visible.length ? visible.map((task) => <TaskRow key={task.id} task={task} />) : <EmptyState title={tasks.length ? "Tidak ada tugas di filter ini" : undefined} description={tasks.length ? "Pilih filter lain untuk melihat tugas keluarga." : undefined} />}</section></>;
}
