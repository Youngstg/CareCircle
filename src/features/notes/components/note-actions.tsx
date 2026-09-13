"use client";

import { useState, useTransition } from "react";
import { Pin, PinOff } from "lucide-react";
import { togglePinned } from "../actions";

export function NotePin({ id, circleId, initialPinned }: { id: string; circleId: string; initialPinned: boolean }) {
  const [pinned, setPinned] = useState(initialPinned);
  const [pending, startTransition] = useTransition();
  function toggle() { const next = !pinned; setPinned(next); startTransition(async () => { const result = await togglePinned(id, circleId, next); if (!result.ok) setPinned(!next); }); }
  return <button className="icon-button" type="button" disabled={pending} onClick={toggle} aria-label={pinned ? "Lepaskan sematan" : "Sematkan catatan"} title={pinned ? "Lepaskan sematan" : "Sematkan"}>{pinned ? <PinOff size={17} /> : <Pin size={17} />}</button>;
}
