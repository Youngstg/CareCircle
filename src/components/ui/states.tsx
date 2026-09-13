import { ClipboardList } from "lucide-react";

export function EmptyState({ title = "Belum ada tugas", description = "Tambahkan tugas pertama agar tanggung jawab keluarga terlihat jelas." }: { title?: string; description?: string }) {
  return <div className="empty-state"><span><ClipboardList /></span><h2>{title}</h2><p>{description}</p></div>;
}

export function SkeletonState() {
  return <div className="skeleton-wrap" aria-label="Memuat konten" role="status"><span className="skeleton wide" /><span className="skeleton" /><span className="skeleton" /></div>;
}

