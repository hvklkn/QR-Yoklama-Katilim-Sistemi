import { Header } from "@/app/components/Header";

export const metadata = {
  title: "Admin - QR Yoklama Sistemi",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
