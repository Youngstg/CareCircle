const messages: Record<string, string> = {
  access_denied: "Login Google dibatalkan atau izinnya tidak diberikan. Anda bisa mencoba lagi atau masuk dengan email.",
  account_not_linked: "Email ini sudah memiliki akun CareCircle. Masuk dengan email dan kata sandi terlebih dahulu, lalu buka Kelola akun untuk menautkan Google.",
  email_does_not_match: "Email Google harus sama dengan email akun CareCircle Anda. Coba lagi dengan akun Google yang sesuai.",
  linking_different_emails_not_allowed: "Email Google harus sama dengan email akun CareCircle Anda. Coba lagi dengan akun Google yang sesuai.",
  account_already_linked_to_different_user: "Akun Google ini sudah terhubung ke akun CareCircle lain. Gunakan metode masuk yang sudah terhubung.",
  social_account_already_linked: "Akun Google ini sudah terhubung ke akun CareCircle lain. Gunakan metode masuk yang sudah terhubung.",
  email_not_verified: "Alamat email Google belum terverifikasi. Verifikasi email pada akun Google Anda sebelum mencoba lagi.",
  email_not_found: "Google tidak memberikan alamat email yang diperlukan. Coba akun Google lain atau gunakan email dan kata sandi.",
  state_not_found: "Sesi login Google tidak valid atau sudah berakhir. Mulai lagi dari halaman masuk dan gunakan tab browser yang sama.",
  state_mismatch: "Sesi login Google tidak valid atau sudah berakhir. Mulai lagi dari halaman masuk dan gunakan tab browser yang sama.",
  state_expired: "Sesi login Google sudah berakhir. Silakan mulai lagi.",
  invalid_state: "Sesi login Google tidak valid atau sudah berakhir. Silakan mulai lagi.",
  please_restart_the_process: "Sesi login Google sudah berakhir. Silakan mulai lagi.",
  provider_not_found: "Login Google belum tersedia saat ini. Silakan gunakan email dan kata sandi.",
  oauth_provider_not_found: "Login Google belum tersedia saat ini. Silakan gunakan email dan kata sandi.",
  unauthorized: "Sesi Anda sudah berakhir. Masuk kembali sebelum menautkan akun Google.",
  session_expired: "Sesi Anda sudah berakhir. Masuk kembali sebelum menautkan akun Google.",
  too_many_requests: "Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi.",
};

export function getGoogleAuthErrorMessage(code?: string): string {
  const key = code?.toLowerCase().replaceAll(" ", "_");
  if (key && Object.hasOwn(messages, key)) return messages[key];
  return "Belum berhasil terhubung dengan Google. Coba lagi atau gunakan email dan kata sandi. Jika masalah berlanjut, hubungi pengelola CareCircle.";
}
