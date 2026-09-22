import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="logo" href="/" aria-label="CareCircle, halaman utama">
      <span className="logo-mark" aria-hidden="true">
        <Image
          src="/brand/carecircle-mark.svg"
          alt=""
          width={38}
          height={38}
          style={{ width: "100%", height: "100%" }}
        />
      </span>
      {!compact && <span>CareCircle</span>}
    </Link>
  );
}
