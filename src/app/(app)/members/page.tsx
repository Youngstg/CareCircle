import { CircleAlert, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { getCircleContext } from "@/features/circles/queries";
import { revokeInvite } from "@/features/invites/actions";
import { InvitePanel } from "@/features/invites/invite-panel";
import { listInvites } from "@/features/invites/queries";

const roleLabels = { owner: "Owner", coordinator: "Koordinator", member: "Anggota" } as const;
const dateFormatter = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const context = await getCircleContext();
  const canManageInvites = context.role === "OWNER" || context.role === "COORDINATOR";
  const invites = canManageInvites ? await listInvites(context.circleId) : [];
  const params = await searchParams;

  return <>
    <header className="page-header"><div><div className="eyebrow">Care Circle</div><h1>Anggota</h1><p>{context.members.length} orang di {context.circleName}.</p></div><span className="feature-icon"><UsersRound /></span></header>
    {params.error && <div className="alert alert-error" role="alert"><CircleAlert size={18} />{params.error}</div>}
    {params.success && <div className="alert alert-success" role="status"><ShieldCheck size={18} />{params.success}</div>}
    <div className="members-layout">
      <section className="members-card" aria-labelledby="member-list-title">
        <h2 id="member-list-title">Daftar anggota</h2>
        <ul className="member-list">{context.members.map((member) => <li key={member.id}><span className="avatar" aria-hidden="true">{member.displayName.slice(0, 1).toUpperCase()}</span><div><strong>{member.displayName}</strong>{member.id === context.userId && <small>Anda</small>}</div><span className={`role-badge role-${member.role}`}>{roleLabels[member.role]}</span></li>)}</ul>
      </section>
      {canManageInvites ? <div><InvitePanel circleId={context.circleId} />
        {invites.length > 0 && <section className="invite-history" aria-labelledby="invite-history-title"><h2 id="invite-history-title">Riwayat undangan</h2><ul>{invites.map((invite) => {
          return <li key={invite.id}><div><strong>{invite.status}</strong><small>Dibuat {invite.createdBy} · {invite.useCount}/{invite.maxUses} penggunaan · hingga {dateFormatter.format(new Date(invite.expiresAt))}</small></div>{!invite.unavailable && <form action={revokeInvite}><input type="hidden" name="inviteId" value={invite.id} /><input type="hidden" name="circleId" value={context.circleId} /><button className="text-button" type="submit">Cabut</button></form>}</li>;
        })}</ul></section>}
      </div> : <aside className="invite-panel"><UserRound /><h2>Undangan dikelola koordinator</h2><p>Hubungi owner atau koordinator jika ada keluarga yang perlu bergabung.</p></aside>}
    </div>
  </>;
}
