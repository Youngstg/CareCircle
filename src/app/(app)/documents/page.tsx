import { Download, Eye, FileLock2, Search, ShieldCheck } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { DocumentDelete } from "@/features/documents/components/document-delete";
import { DocumentUpload } from "@/features/documents/components/document-upload";
import { listDocuments } from "@/features/documents/queries";
import { documentCategories, documentCategoryLabels, type DocumentCategory } from "@/features/documents/schemas";

const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const numberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${numberFormatter.format(bytes / 1024)} KB`;
  return `${numberFormatter.format(bytes / (1024 * 1024))} MB`;
}

function categoryLabel(category: string): string {
  return category in documentCategoryLabels
    ? documentCategoryLabels[category as DocumentCategory]
    : documentCategoryLabels.OTHER;
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const context = await getCircleContext();
  const allDocuments = await listDocuments(context.circleId);
  const { category = "ALL", q = "" } = await searchParams;

  const documents = allDocuments.filter((doc) => {
    const matchCategory = category === "ALL" || doc.category === category;
    const matchQuery =
      !q ||
      doc.title.toLowerCase().includes(q.toLowerCase()) ||
      (doc.note && doc.note.toLowerCase().includes(q.toLowerCase())) ||
      doc.originalName.toLowerCase().includes(q.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">{context.circleName}</div>
          <h1>Dokumen privat</h1>
          <p>Simpan dan akses dokumen penting bersama tanpa pengindeksan isi.</p>
        </div>
        <DocumentUpload circleId={context.circleId} />
      </header>

      <aside className="document-privacy">
        <ShieldCheck size={21} aria-hidden="true" />
        <div>
          <strong>Akses terbatas untuk Care Circle</strong>
          <p>Akses lihat dan unduh hanya diberikan setelah sesi dan keanggotaan diperiksa, melalui tautan sementara selama 60 detik.</p>
        </div>
      </aside>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginBottom: "20px" }}>
        <nav className="filter-tabs" aria-label="Filter kategori dokumen" style={{ margin: 0, flex: 1 }}>
          <a
            href={`/documents?category=ALL${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            aria-current={category === "ALL" ? "page" : undefined}
          >
            Semua
          </a>
          {documentCategories.map((cat) => (
            <a
              key={cat}
              href={`/documents?category=${cat}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={category === cat ? "page" : undefined}
            >
              {documentCategoryLabels[cat]}
            </a>
          ))}
        </nav>

        <form method="get" action="/documents" style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <input type="hidden" name="category" value={category} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari dokumen…"
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

      {documents.length > 0 ? (
        <section className="document-grid" aria-label="Daftar dokumen privat">
          {documents.map((document) => {
            const canDelete =
              document.uploaderId === context.userId || context.role === "OWNER" || context.role === "COORDINATOR";
            return (
              <article className="document-card" key={document.id}>
                <div className="document-card-head">
                  <span className="document-icon">
                    <FileLock2 aria-hidden="true" />
                  </span>
                  <span className="badge document-category">{categoryLabel(document.category)}</span>
                </div>
                <h2>{document.title}</h2>
                {document.note && <p className="document-note">{document.note}</p>}
                <dl>
                  <div>
                    <dt>File</dt>
                    <dd>{document.originalName}</dd>
                  </div>
                  <div>
                    <dt>Ukuran</dt>
                    <dd>{formatFileSize(document.sizeBytes)}</dd>
                  </div>
                  <div>
                    <dt>Diunggah</dt>
                    <dd>
                      {dateFormatter.format(new Date(document.createdAt))} oleh {document.uploaderName}
                    </dd>
                  </div>
                </dl>
                <div className="document-actions">
                  <a
                    className="button button-secondary button-small"
                    href={`/api/documents/${encodeURIComponent(document.id)}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye size={17} aria-hidden="true" />
                    Lihat
                  </a>
                  <a
                    className="button button-secondary button-small"
                    href={`/api/documents/${encodeURIComponent(document.id)}/download`}
                  >
                    <Download size={17} aria-hidden="true" />
                    Unduh
                  </a>
                  {canDelete && <DocumentDelete documentId={document.id} />}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="document-empty">
          <span>
            <FileLock2 aria-hidden="true" />
          </span>
          <h2>{allDocuments.length ? "Tidak ada dokumen yang cocok" : "Belum ada dokumen"}</h2>
          <p>
            {allDocuments.length
              ? "Coba ubah kata kunci pencarian atau pilih kategori lain."
              : "Unggah dokumen penting agar anggota Care Circle dapat mengaksesnya saat dibutuhkan."}
          </p>
        </section>
      )}
    </>
  );
}
