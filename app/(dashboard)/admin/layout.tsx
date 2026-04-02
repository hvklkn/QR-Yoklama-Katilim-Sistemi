export const metadata = {
  title: "Admin - QR Yoklama Sistemi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple layout - no header logic here
  // Each page/route manages its own header
  return <>{children}</>;
}
