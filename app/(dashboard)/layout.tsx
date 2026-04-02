import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export const metadata = {
  title: "Admin - QR Yoklama Sistemi",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container-max py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
