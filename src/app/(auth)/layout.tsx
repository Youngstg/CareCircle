import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="auth-layout"><Logo />{children}<p className="auth-note">CareCircle membantu koordinasi non-medis dan tidak menggantikan panduan tenaga profesional.</p></main>;
}
