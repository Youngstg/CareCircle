import { Search } from "lucide-react";
import { EmptyState } from "@/components/ui/states";
import { getCircleContext } from "@/features/circles/queries";
import { TaskCreate } from "@/features/tasks/components/task-create";
import { TaskRow } from "@/features/tasks/components/task-row";
import { listTasks } from "@/features/tasks/queries";

const filters = ["semua", "milik-saya", "terbuka", "selesai"] as const;
type Filter = typeof filters[number];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const context = await getCircleContext();
  const tasks = await listTasks(context.circleId, context.members);
  const { filter: requested, q: search = "" } = await searchParams;
  const filter: Filter = filters.includes(requested as Filter) ? (requested as Filter) : "semua";

  const visible = tasks
    .filter((task) => {
      const matchFilter =
        filter === "semua" ||
        (filter === "milik-saya" && task.assignedTo === context.userId) ||
        (filter === "terbuka" && !task.completedAt) ||
        (filter === "selesai" && task.completedAt);

      const matchSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase())) ||
        task.assigneeName.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">{context.circleName}</div>
          <h1>Tugas keluarga</h1>
          <p>Bagi tanggung jawab dan lihat siapa yang menanganinya. Tekan ikon opsi di samping tugas untuk mengubah detail.</p>
        </div>
        <TaskCreate circleId={context.circleId} members={context.members} />
      </header>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "16px" }}>
        <nav className="filter-tabs" aria-label="Filter tugas" style={{ margin: 0, flex: 1 }}>
          {filters.map((item) => (
            <a
              key={item}
              href={`/tasks?filter=${item}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              aria-current={filter === item ? "page" : undefined}
            >
              {item === "semua"
                ? "Semua"
                : item === "milik-saya"
                ? "Milik saya"
                : item === "terbuka"
                ? "Belum selesai"
                : "Selesai"}
            </a>
          ))}
        </nav>

        <form method="get" action="/tasks" style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <input type="hidden" name="filter" value={filter} />
          <input
            name="q"
            defaultValue={search}
            placeholder="Cari tugas…"
            style={{
              padding: "8px 12px 8px 34px",
              borderRadius: "99px",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
              background: "#fff",
              minHeight: "40px",
            }}
          />
          <Search size={16} style={{ position: "absolute", left: "12px", color: "var(--muted)", pointerEvents: "none" }} />
        </form>
      </div>

      <section className="task-list" aria-label="Daftar tugas">
        {visible.length ? (
          visible.map((task) => <TaskRow key={task.id} task={task} members={context.members} />)
        ) : (
          <EmptyState
            title={tasks.length ? "Tidak ada tugas yang cocok" : undefined}
            description={tasks.length ? "Coba ganti kata kunci pencarian atau pilih filter lain." : undefined}
          />
        )}
      </section>
    </>
  );
}
