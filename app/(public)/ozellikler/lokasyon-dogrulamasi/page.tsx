export const metadata = {
  title: "Lokasyon Doğrulaması | QR Yoklama Sistemi",
  description: "Coğrafi sınır (geofence) teknolojisi ile katılımcıların etkinlik alanında fiziksel olarak bulunduğunu doğrulayın.",
};

export default function LokasyonPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card-elevated p-8 md:p-12">
          <div className="mb-8">
            <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors flex items-center gap-1 mb-4">
              ← Ana Sayfaya Dön
            </a>
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">📍</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-3">
              Lokasyon Doğrulaması
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              GPS tabanlı coğrafi sınır (geofence) teknolojisi ile katılımcıların etkinlik alanında fiziksel olarak bulunduğunu otomatik doğrulayın.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">

            <section className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-orange-800 mb-3">📡 Nasıl Çalışır?</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Admin etkinlik oluştururken merkez koordinat ve yarıçap (metre) girer.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span>Katılımcı QR kodu tararken tarayıcı konumuna erişim izni ister.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span>Konum bilgisi sunucuya gönderilir; tanımlı bölge içinde olup olmadığı hesaplanır.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Bölge dışındaki taramalar reddedilir; bölge içindekiler onaylanır.</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🗺️ Geofence Ayarları</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-5 border-l-4 border-orange-500">
                  <h3 className="font-bold text-gray-900 mb-2">Merkez Koordinat</h3>
                  <p className="text-sm text-gray-600">Etkinlik alanının enlem ve boylam değerleri. Harita üzerinden seçilebilir veya manuel girilebilir.</p>
                </div>
                <div className="card p-5 border-l-4 border-orange-500">
                  <h3 className="font-bold text-gray-900 mb-2">Yarıçap (Metre)</h3>
                  <p className="text-sm text-gray-600">Kabul edilen bölgenin genişliği. Küçük salonlar için 50m, açık alanlar için 500m olarak ayarlanabilir.</p>
                </div>
                <div className="card p-5 border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-900 mb-2">Tolerans Payı</h3>
                  <p className="text-sm text-gray-600">GPS hata payını telafi etmek için otomatik tolerans eklenir (±15-30 metre).</p>
                </div>
                <div className="card p-5 border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-900 mb-2">Opsiyonel Kontrol</h3>
                  <p className="text-sm text-gray-600">Lokasyon doğrulaması etkinlik bazında açılıp kapatılabilir. Sadece gerektiğinde aktif edin.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Desteklenen Senaryolar</h2>
              <ul className="space-y-3">
                {[
                  "Kapalı sınıf veya konferans salonu yoklaması",
                  "Kampüs veya bina bazlı alan kontrolü",
                  "Açık hava etkinlikleri için geniş yarıçaplı geofence",
                  "Birden fazla salon için ayrı etkinlik tanımlaması",
                  "Uzaktan katılımın önüne geçme (online hile engeli)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Önemli Not</h3>
              <p className="text-sm text-yellow-700">
                Konum erişimi tarayıcı tarafından kullanıcıdan izin alınarak gerçekleştirilir.
                Katılımcının "Konuma İzin Ver" seçeneğini onaylaması gerekir. İzin verilmezse
                yoklama tamamlanamaz (lokasyon kontrolü aktifse).
              </p>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/ozellikler/csv-export" className="btn-outline inline-flex items-center justify-center gap-2">
                📊 CSV Export →
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
