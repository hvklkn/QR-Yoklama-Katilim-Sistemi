export default function Home() {
  return (
    <>
      {/* Hero Section with Animated Background */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden bg-gray-800">
        <div className="absolute inset-0 animated-bg -z-10 opacity-30"></div>
        <div className="container-max text-center mb-8 md:mb-12 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg px-4">
            QR Kod ile Hızlı Yoklama
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 drop-shadow-md px-4">
            Etkinlik, ders ve konferans ortamında QR kod aracılığıyla güvenli,
            hızlı ve kapsamlı yoklama sistemi
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <a
              href="/admin"
              className="px-4 py-2 md:px-6 md:py-3 border-2 border-white/30 text-white rounded-lg hover:border-primary-400 hover:text-primary-400 hover:bg-primary-500/10 hover:scale-105 md:hover:scale-110 transition-all duration-200 font-medium text-sm md:text-base"
            >
              Admin Paneline Git
            </a>
            <a
              href="/scan"
              className="px-4 py-2 md:px-6 md:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-500 hover:scale-105 md:hover:scale-110 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm md:text-base"
            >
              QR Kodunu Tara
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container-max">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">📱</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Mobil Uyumlu
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Tüm cihazlarda sorunsuz çalışan responsive tasarım
              </p>
            </div>

            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">🔒</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Güvenli
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Dinamik QR kodlar ve lokasyon doğrulaması ile güvenlik
              </p>
            </div>

            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">📊</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Rapor
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Detaylı raporlar ve CSV/Excel export özellikleri
              </p>
            </div>

            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">⚡</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Hızlı
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Gerçek zamanlı araştırma ve anlık tarama işlemleri
              </p>
            </div>

            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">📍</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Lokasyon Kontrolü
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Geofence ile tanımlanmış alanlarda katılım izlemesi
              </p>
            </div>

            <div className="card card-hover p-4 md:p-6">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <span className="text-xl md:text-2xl">👥</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                Kolay Yönetim
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Sezgisel arayüz ile kolay etkinlik ve katılımcı yönetimi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 bg-white overflow-x-hidden">
        <div className="container-max">
          <div className="relative">
            <div className="stats-scroll">
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">∞</div>
                <p className="text-gray-600 text-xs md:text-sm">Sınırsız Etkinlik</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📱</div>
                <p className="text-gray-600 text-xs md:text-sm">Mobil Uyumlu</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">🔐</div>
                <p className="text-gray-600 text-xs md:text-sm">Güvenliğe Uygun</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">⚡</div>
                <p className="text-gray-600 text-xs md:text-sm">Anlık İşlem</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📊</div>
                <p className="text-gray-600 text-xs md:text-sm">Detaylı Raporlar</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">👥</div>
                <p className="text-gray-600 text-xs md:text-sm">Kolay Yönetim</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📍</div>
                <p className="text-gray-600 text-xs md:text-sm">Lokasyon Kontrolü</p>
              </div>
              
              {/* Duplicate for seamless loop */}
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">∞</div>
                <p className="text-gray-600 text-xs md:text-sm">Sınırsız Etkinlik</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📱</div>
                <p className="text-gray-600 text-xs md:text-sm">Mobil Uyumlu</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">🔐</div>
                <p className="text-gray-600 text-xs md:text-sm">Güvenliğe Uygun</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">⚡</div>
                <p className="text-gray-600 text-xs md:text-sm">Anlık İşlem</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📊</div>
                <p className="text-gray-600 text-xs md:text-sm">Detaylı Raporlar</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">👥</div>
                <p className="text-gray-600 text-xs md:text-sm">Kolay Yönetim</p>
              </div>
              <div className="text-center px-2 md:px-4">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">📍</div>
                <p className="text-gray-600 text-xs md:text-sm">Lokasyon Kontrolü</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
