export const metadata = {
  title: "Admin Girişi - QR Yoklama Sistemi",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login layout - parent admin layout will NOT show Header for /login
  return <>{children}</>;
}
