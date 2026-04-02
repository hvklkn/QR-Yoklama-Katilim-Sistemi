import { Header } from "@/app/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard - QR Yoklama Sistemi",
};

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container-max py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Etkinliklerinizi yönetin, katılımcıları izleyin
          </p>
        </div>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Events */}
        <Link href="/admin/events" className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Etkinlikler</h3>
          <p className="text-gray-600 text-sm">
            Etkinlikler oluşturun, düzenleyin ve yönetin
          </p>
          <div className="mt-4 text-primary-600 font-medium">Etkinliklere Git →</div>
        </Link>

        {/* Participants */}
        <Link href="/admin/participants" className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Katılımcılar</h3>
          <p className="text-gray-600 text-sm">
            Katılımcıları kaydedin, listeleyin ve export edin
          </p>
          <div className="mt-4 text-primary-600 font-medium">Katılımcılara Git →</div>
        </Link>

        {/* Attendance Records */}
        <Link href="/admin/attendance" className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Yoklama Kayıtları</h3>
          <p className="text-gray-600 text-sm">
            Tarama kayıtlarını görüntüleyin ve raporlar oluşturun
          </p>
          <div className="mt-4 text-primary-600 font-medium">Kayıtlara Git →</div>
        </Link>

        {/* Reports */}
        <div className="card p-6 opacity-50 cursor-not-allowed">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Raporlar</h3>
          <p className="text-gray-600 text-sm">
            Detaylı istatistikler ve analizler (Yakında)
          </p>
          <div className="mt-4 text-gray-400 font-medium">Yakında →</div>
        </div>

        {/* Settings */}
        <div className="card p-6 opacity-50 cursor-not-allowed">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ayarlar</h3>
          <p className="text-gray-600 text-sm">
            Sistem ayarlarını ve entegrasyonları yapılandırın (Yakında)
          </p>
          <div className="mt-4 text-gray-400 font-medium">Yakında →</div>
        </div>

        {/* Webhooks */}
        <div className="card p-6 opacity-50 cursor-not-allowed">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Webhooks</h3>
          <p className="text-gray-600 text-sm">
            n8n ve harici sistemlerle entegrasyonu yönetin (Yakında)
          </p>
          <div className="mt-4 text-gray-400 font-medium">Yakında →</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Hızlı Başlangıç</h2>
        <ol className="space-y-3 text-gray-700">
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 min-w-fit">1.</span>
            <span>Bir etkinlik oluşturun ve lokasyonunu belirleyin</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 min-w-fit">2.</span>
            <span>Katılımcıları manuel veya CSV dosyası ile ekleyin</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 min-w-fit">3.</span>
            <span>Dinamik QR kod oluşturulacak ve her 5 dakikada yenilenecektir</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 min-w-fit">4.</span>
            <span>Katılımcılar QR kodunu taradığında yapılan tarama kaydedilecektir</span>
          </li>
        </ol>
      </div>
    </main>
    </div>
  );
}
