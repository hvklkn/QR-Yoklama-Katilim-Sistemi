import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard - QR Yoklama Sistemi",
};

export default function AdminPage() {
  return (
    <>
      <main className="flex-1 container-max py-8">
        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Events */}
          <Link 
            href="/admin/events" 
            className="card-hover card-elevated p-6 border-t-4 border-primary-600 group bg-gradient-to-br from-white to-primary-50 fade-in"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">Etkinlikler</h3>
            <p className="text-gray-600 text-sm mb-4">
              Etkinlikler oluşturun, düzenleyin ve yönetin
            </p>
            <div className="text-primary-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Etkinliklere Git 
              <span className="text-xl">→</span>
            </div>
          </Link>

          {/* Participants */}
          <Link 
            href="/admin/participants" 
            className="card-hover card-elevated p-6 border-t-4 border-green-600 group bg-gradient-to-br from-white to-green-50 fade-in"
            style={{ animationDelay: "50ms" }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Katılımcılar</h3>
            <p className="text-gray-600 text-sm mb-4">
              Katılımcıları kaydedin, listeleyin ve export edin
            </p>
            <div className="text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Katılımcılara Git 
              <span className="text-xl">→</span>
            </div>
          </Link>

          {/* Attendance Records */}
          <Link 
            href="/admin/attendance" 
            className="card-hover card-elevated p-6 border-t-4 border-blue-600 group bg-gradient-to-br from-white to-blue-50 fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">✓</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Yoklama Kayıtları</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tarama kayıtlarını görüntüleyin ve raporlar oluşturun
            </p>
            <div className="text-blue-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Kayıtlara Git 
              <span className="text-xl">→</span>
            </div>
          </Link>

          {/* Reports */}
          <Link
            href="/admin/reports"
            className="card-hover card-elevated p-6 border-t-4 border-purple-600 group bg-gradient-to-br from-white to-purple-50 fade-in"
            style={{ animationDelay: "150ms" }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Raporlar</h3>
            <p className="text-gray-600 text-sm mb-4">
              Etkinlik istatistikleri ve CSV export
            </p>
            <div className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Raporlara Git
              <span className="text-xl">→</span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="card-hover card-elevated p-6 border-t-4 border-gray-600 group bg-gradient-to-br from-white to-gray-50 fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">Ayarlar</h3>
            <p className="text-gray-600 text-sm mb-4">
              QR, lokasyon ve hesap yapılandırması
            </p>
            <div className="text-gray-700 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Ayarlara Git
              <span className="text-xl">→</span>
            </div>
          </Link>

          {/* Webhooks */}
          <Link
            href="/admin/webhooks"
            className="card-hover card-elevated p-6 border-t-4 border-indigo-600 group bg-gradient-to-br from-white to-indigo-50 fade-in"
            style={{ animationDelay: "250ms" }}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🔗</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Webhooks</h3>
            <p className="text-gray-600 text-sm mb-4">
              n8n ve harici sistemlerle entegrasyon
            </p>
            <div className="text-indigo-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Webhook Yönet
              <span className="text-xl">→</span>
            </div>
          </Link>
        </div>

        {/* Quick Start Guide */}
        <div className="card-elevated p-8 border-l-4 border-primary-600 bg-gradient-to-r from-primary-50 to-white fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            🚀 Hızlı Başlangıç Rehberi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold flex items-center justify-center">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Etkinlik Oluştur</p>
                <p className="text-sm text-gray-600">Bir etkinlik oluşturun ve lokasyonunu belirleyin</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold flex items-center justify-center">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Katılımcı Ekle</p>
                <p className="text-sm text-gray-600">Katılımcıları manuel veya CSV dosyası ile ekleyin</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold flex items-center justify-center">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">QR Kod Oluştur</p>
                <p className="text-sm text-gray-600">Dinamik QR kod oluşturulacak ve her 5 dakikada yenilenecektir</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 text-white font-bold flex items-center justify-center">
                4
              </div>
              <div>
                <p className="font-semibold text-gray-900">Yoklama Alın</p>
                <p className="text-sm text-gray-600">Katılımcılar QR kodunu taradığında tarama kaydedilecektir</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
