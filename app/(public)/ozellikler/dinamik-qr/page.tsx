export const metadata = {
  title: "Dinamik QR Kodlar | QR Yoklama Sistemi",
  description: "Her tarama turunda otomatik yenilenen, kopyalanamaz güvenli QR kodlar ile yoklama alın.",
};

export default function DinamikQRPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card-elevated p-8 md:p-12">
          <div className="mb-8">
            <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors flex items-center gap-1 mb-4">
              ← Ana Sayfaya Dön
            </a>
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">🔲</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
              Dinamik QR Kodlar
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Her etkinlik için otomatik yenilenen, kopyalanamaz ve zaman sınırlı QR kodlar. Sahteciliğe karşı en güçlü yoklama yöntemi.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">

            <section className="bg-primary-50 border border-primary-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-primary-800 mb-3">⚡ Nasıl Çalışır?</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Admin etkinlik başlatır ve QR kodu aktif eder.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span>QR kod belirlenen süre aralığında (örn. her 5 dakikada bir) otomatik olarak yenilenir.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span>Katılımcı ekran üzerindeki güncel QR kodu tarar; eski kodlar geçersiz sayılır.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Yoklama kaydı anlık olarak sistemde oluşturulur.</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🛡️ Güvenlik Avantajları</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-5 border-l-4 border-green-500">
                  <h3 className="font-bold text-gray-900 mb-2">Kopyalanmaz</h3>
                  <p className="text-sm text-gray-600">Her QR token tek kullanımlık ve zamana bağlıdır. Ekran görüntüsü ile yoklama alınamaz.</p>
                </div>
                <div className="card p-5 border-l-4 border-green-500">
                  <h3 className="font-bold text-gray-900 mb-2">Zaman Sınırlı</h3>
                  <p className="text-sm text-gray-600">Süresi dolan tokenlar otomatik geçersiz olur. Geç gelenler eski kodu kullanamaz.</p>
                </div>
                <div className="card p-5 border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-900 mb-2">Tek Tarama</h3>
                  <p className="text-sm text-gray-600">Her katılımcı aynı etkinlikte yalnızca bir kez tarayabilir. Çifte kayıt önlenir.</p>
                </div>
                <div className="card p-5 border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-900 mb-2">Şifreli Token</h3>
                  <p className="text-sm text-gray-600">QR içindeki token, sunucu tarafında kriptografik olarak doğrulanır.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Özellikler</h2>
              <ul className="space-y-3">
                {[
                  "Otomatik token yenileme (yapılandırılabilir süre)",
                  "Süresi dolan kodların anlık geçersizleştirilmesi",
                  "Her taramada katılımcı kimlik doğrulaması",
                  "Çevrimdışı tarama desteği (internet bağlantısı kesilse bile)",
                  "Yönetici panelinden anlık izleme",
                  "Toplu QR kod devre dışı bırakma",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/ozellikler/lokasyon-dogrulamasi" className="btn-outline inline-flex items-center justify-center gap-2">
                📍 Lokasyon Doğrulaması →
              </a>
              <a href="/admin" className="btn-primary inline-flex items-center justify-center gap-2">
                Admin Paneline Git →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
