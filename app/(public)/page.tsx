export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            QR Kod ile Hızlı Yoklama
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Etkinlik, ders ve konferans ortamında QR kod aracılığıyla güvenli,
            hızlı ve kapsamlı yoklama sistemi
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/admin"
              className="btn-primary inline-block"
            >
              Admin Paneline Git
            </a>
            <a
              href="/scan"
              className="btn-secondary inline-block"
            >
              QR Kodunu Tara
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Mobil Uyumlu
            </h3>
            <p className="text-gray-600 text-sm">
              Tüm cihazlarda sorunsuz çalışan responsive tasarım
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Güvenli
            </h3>
            <p className="text-gray-600 text-sm">
              Dinamik QR kodlar ve lokasyon doğrulaması ile güvenlik
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Rapor
            </h3>
            <p className="text-gray-600 text-sm">
              Detaylı raporlar ve CSV/Excel export özellikleri
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="bg-primary-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Hemen Başlamaya Hazır mısınız?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Admin paneline giriş yaparak etkinlikler oluşturmaya başlayın
          </p>
          <a href="/admin" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Admin Paneli
          </a>
        </div>
      </section>
    </>
  );
}
