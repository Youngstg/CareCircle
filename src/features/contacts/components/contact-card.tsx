import { MapPin, MessageCircle, PhoneCall, Trash2 } from "lucide-react";
import { deleteContact } from "../actions";
import type { CareContactItem } from "../queries";

function sanitizeWa(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }
  return digits;
}

export function ContactCard({
  contact,
  circleId,
  canDelete,
}: {
  contact: CareContactItem;
  circleId: string;
  canDelete: boolean;
}) {
  const waNumber = contact.whatsapp ? sanitizeWa(contact.whatsapp) : sanitizeWa(contact.phoneNumber);
  const isEmergency = contact.role.includes("UGD") || contact.role.includes("Ambulans") || contact.role.includes("Dokter");

  return (
    <article className={`contact-card ${isEmergency ? "contact-card-priority" : ""}`}>
      <div className="contact-card-head">
        <div>
          <span className={`badge ${isEmergency ? "badge-warning" : "document-category"}`}>
            {contact.role}
          </span>
          <h2>{contact.name}</h2>
        </div>

        {canDelete && (
          <form action={deleteContact}>
            <input type="hidden" name="contactId" value={contact.id} />
            <input type="hidden" name="circleId" value={circleId} />
            <button className="icon-button" title={`Hapus kontak ${contact.name}`} aria-label={`Hapus kontak ${contact.name}`}>
              <Trash2 size={17} />
            </button>
          </form>
        )}
      </div>

      <div className="contact-actions-row">
        <a
          href={`tel:${contact.phoneNumber.replace(/[^\d+]/g, "")}`}
          className="button button-primary button-small"
          aria-label={`Hubungi telepon ${contact.name}`}
        >
          <PhoneCall size={16} />
          <span>{contact.phoneNumber}</span>
        </a>

        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary button-small"
            aria-label={`Chat WhatsApp ${contact.name}`}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
        )}
      </div>

      {contact.address && (
        <p className="contact-meta">
          <MapPin size={15} />
          <span>{contact.address}</span>
        </p>
      )}

      {contact.note && (
        <p className="contact-note">{contact.note}</p>
      )}

      <small className="contact-creator">
        Ditambahkan oleh {contact.creatorName}
      </small>
    </article>
  );
}
