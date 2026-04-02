export const metadata = {
  title: "CSV Export | QR Yoklama Sistemi",
  description: "Yoklama verilerini CSV formatında dışa aktarın, Excel ile analiz edin.",
};

export default function CSVExportPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card-elevated p-8 md:p-12">
          <div className="mb-8">
            <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors flex items-center gap-1 mb-4">
              ← Ana Sayfaya Dön
            </a>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
              CSV Export
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Etkinlik yoklama verilerini tek tıkla CSV formatında indirin. Excel, Google Sheets veya herhangi bir tablo aracıyla doğrudan açın.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">

            <section className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-green-800 mb-3">📥 Nasıl İndirilir?</h2>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  <span>Admin panelinden ilgili etkinliği açın.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  <span><strong>Yoklama Kayıtları</strong> sekmesine gidin.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  <span><strong>"CSV İndir"</strong> butonuna tıklayın.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  <span>Dosya otomatik olarak indirilir — Excel veya Google Sheets ile açabilirsiniz.</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 CSV Dosya İçeriği</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-bold text-gray-800">Sütun</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-800">Açıklama</th>
                      <th className="px-4 py-3 text-left font-bold text-gray-800">Örnek</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      ["Ad", "Katılımcının adı", "Ahmet"],
                      ["Soyad", "Katılımcının soyadı", "Yılmaz"],
                      ["E-posta", "E-posta adresi", "ahmet@ornek.com"],
                      ["Telefon", "Telefon numarası", "0555 123 4567"],
                      ["Tarama Zamanı", "Yoklama tarihi ve saati", "2026-04-02 09:35"],
                      ["Durum", "Başarılı / Başarısız", "Başarılı"],
                      ["Konum", "Geofence sonucu", "Bölge İçinde"],
                    ].map(([col, desc, example]) => (
                      <tr key={col} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-semibold text-primary-700">{col}</td>
                        <td className="px-4 py-3 text-gray-600">{desc}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Özellikler</h2>
              <ul className="space-y-3">
                {[
                  "UTF-8 kodlaması — Türkçe karakterler sorunsuz aktarılır",
                  "Tüm yoklama geçmişini tek dosyada görün",
                  "Başarılı ve başarısız taramaları filtreleyin",
                  "Excel, LibreOffice, Google Sheets ile tam uyumluluk",
                  "Anlık indirme — işlem gerektirmez",
                  "Aynı veriyi CSV ile içe aktarabilirsiniz (gidiş-dönüş format)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📤 CSV ile İçe Aktarma</h2>
              <p className="leading-relaxed mb-4">
                CSV export'un yanı sıra katılımcı listesini de CSV formatında sisteme yükleyebilirsiniz.
                Beklenen format:
              </p>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <div className="text-gray-500 mb-1"># Başlık satırı (zorunlu)</div>
                <div>Ad,Soyad,E-posta,Telefon</div>
                <div className="mt-2 text-gray-500"># Veri satırları</div>
                <div>Ahmet,Yılmaz,ahmet@ornek.com,05551234567</div>
                <div>Ayşe,Kaya,ayse@ornek.com,05559876543</div>
              </div>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/ozellikler/dinamik-qr" className="btn-outline inline-flex items-center justify-center gap-2">
                🔲 Dinamik QR Kodlar →
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
