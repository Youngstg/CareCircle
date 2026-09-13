"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionResult } from "@/types/domain";
import { joinCircle } from "./actions";

const initialState: ActionResult = { ok: false, code: "IDLE", message: "" };

export function JoinForm({ compact = false }: { compact?: boolean }) {
  const [state, action] = useActionState(joinCircle, initialState);
  return <form action={action} className="form-stack">
    <label htmlFor={compact ? "onboarding-code" : "invite-code"}>Kode undangan
      <input
        id={compact ? "onboarding-code" : "invite-code"}
        name="code"
        placeholder="ABCD-EFGH"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        minLength={8}
        maxLength={9}
        required
        aria-describedby={!state.ok && state.code !== "IDLE" ? `${compact ? "onboarding" : "join"}-error` : undefined}
      />
    </label>
    {!state.ok && state.code !== "IDLE" && <div id={`${compact ? "onboarding" : "join"}-error`} className="alert alert-error" role="alert">{state.message}</div>}
    <SubmitButton>Gabung Care Circle</SubmitButton>
  </form>;
}
