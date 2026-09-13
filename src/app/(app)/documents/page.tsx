import { Download, Eye, FileLock2, ShieldCheck } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { DocumentDelete } from "@/features/documents/components/document-delete";
import { DocumentUpload } from "@/features/documents/components/document-upload";
import { listDocuments } from "@/features/documents/queries";
import { documentCategoryLabels, type DocumentCategory } from "@/features/documents/schemas";

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

export default async function DocumentsPage() {
  const context = await getCircleContext();
  const documents = await listDocuments(context.circleId);

  return <>
    <header className="page-header"><div><div className="eyebrow">{context.circleName}</div><h1>Dokumen privat</h1><p>Simpan dan akses dokumen penting bersama tanpa pengindeksan isi.</p></div><DocumentUpload circleId={context.circleId} /></header>
    <aside className="document-privacy"><ShieldCheck size={21} aria-hidden="true" /><div><strong>Akses terbatas untuk Care Circle</strong><p>Akses lihat dan unduh hanya diberikan setelah sesi dan keanggotaan diperiksa, melalui tautan sementara selama 60 detik.</p></div></aside>
    {documents.length > 0 ? <section className="document-grid" aria-label="Daftar dokumen privat">{documents.map((document) => {
      const canDelete = document.uploaderId === context.userId || context.role === "OWNER" || context.role === "COORDINATOR";
      return <article className="document-card" key={document.id}>
        <div className="document-card-head"><span className="document-icon"><FileLock2 aria-hidden="true" /></span><span className="badge document-category">{categoryLabel(document.category)}</span></div>
        <h2>{document.title}</h2>
        {document.note && <p className="document-note">{document.note}</p>}
        <dl><div><dt>File</dt><dd>{document.originalName}</dd></div><div><dt>Ukuran</dt><dd>{formatFileSize(document.sizeBytes)}</dd></div><div><dt>Diunggah</dt><dd>{dateFormatter.format(new Date(document.createdAt))} oleh {document.uploaderName}</dd></div></dl>
        <div className="document-actions"><a className="button button-secondary button-small" href={`/api/documents/${encodeURIComponent(document.id)}/view`} target="_blank" rel="noopener noreferrer"><Eye size={17} aria-hidden="true" />Lihat</a><a className="button button-secondary button-small" href={`/api/documents/${encodeURIComponent(document.id)}/download`}><Download size={17} aria-hidden="true" />Unduh</a>{canDelete && <DocumentDelete documentId={document.id} />}</div>
      </article>;
    })}</section> : <section className="document-empty"><span><FileLock2 aria-hidden="true" /></span><h2>Belum ada dokumen</h2><p>Unggah dokumen penting agar anggota Care Circle dapat mengaksesnya saat dibutuhkan.</p></section>}
  </>;
}
