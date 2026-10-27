import { PhoneCall, ShieldAlert } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { ContactCard } from "@/features/contacts/components/contact-card";
import { ContactCreate } from "@/features/contacts/components/contact-create";
import { listContacts } from "@/features/contacts/queries";

export default async function ContactsPage() {
  const context = await getCircleContext();
  const contacts = await listContacts(context.circleId);

  const emergencyContacts = contacts.filter((c) =>
    c.role.includes("UGD") || c.role.includes("Ambulans") || c.role.includes("Dokter Spesialis")
  );
  const otherContacts = contacts.filter((c) => !emergencyContacts.includes(c));

  return (
    <>
      <header className="page-header">
        <div>
          <div className="eyebrow">{context.circleName}</div>
          <h1>Kontak penting & darurat</h1>
          <p>Nomor fasilitas kesehatan, dokter, dan keluarga yang dapat dihubungi langsung saat dibutuhkan.</p>
        </div>
        <ContactCreate circleId={context.circleId} />
      </header>

      <aside className="document-privacy">
        <ShieldAlert size={22} aria-hidden="true" />
        <div>
          <strong>Akses Cepat Satu Sentuhan</strong>
          <p>Tekan tombol nomor untuk langsung melakukan panggilan telepon atau memulai percakapan WhatsApp dengan fasilitas terkait.</p>
        </div>
      </aside>

      {contacts.length > 0 ? (
        <div className="contacts-feed">
          {emergencyContacts.length > 0 && (
            <section className="contacts-section">
              <div className="section-heading">
                <h2>Kontak Darurat & Medis Utama</h2>
                <p>Prioritas pertama saat membutuhkan pertolongan cepat.</p>
              </div>
              <div className="contacts-grid">
                {emergencyContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    circleId={context.circleId}
                    canDelete={contact.createdById === context.userId || context.role === "OWNER" || context.role === "COORDINATOR"}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="contacts-section">
            {emergencyContacts.length > 0 && (
              <div className="section-heading">
                <h2>Semua Kontak Terdaftar</h2>
              </div>
            )}
            <div className="contacts-grid">
              {(emergencyContacts.length > 0 ? otherContacts : contacts).map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  circleId={context.circleId}
                  canDelete={contact.createdById === context.userId || context.role === "OWNER" || context.role === "COORDINATOR"}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="empty-state">
          <span>
            <PhoneCall size={28} />
          </span>
          <h2>Belum ada kontak penting</h2>
          <p>Tambahkan nomor telepon dokter, rumah sakit, apotek, atau keluarga agar tidak perlu mencarinya saat genting.</p>
        </section>
      )}
    </>
  );
}
