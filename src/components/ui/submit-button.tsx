"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary" type="submit" disabled={pending}>
      {pending && <LoaderCircle className="spin" size={18} aria-hidden="true" />}
      {pending ? "Memproses…" : children}
    </button>
  );
}
