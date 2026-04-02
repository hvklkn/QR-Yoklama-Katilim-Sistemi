export const metadata = {
  title: "Gizlilik Politikası | QR Yoklama Sistemi",
  description: "QR Yoklama Sistemi gizlilik politikası ve kişisel veri işleme ilkeleri.",
};

export default function GizlilikPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card-elevated p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
              🔒 Gizlilik Politikası
            </h1>
            <p className="text-gray-500 text-sm">Son güncelleme: Nisan 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">1.</span> Genel Bilgi
              </h2>
              <p className="leading-relaxed">
                QR Yoklama Sistemi olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz.
                Bu gizlilik politikası, sistemimizi kullanırken toplanan, işlenen ve saklanan
                kişisel veriler hakkında sizi bilgilendirmek amacıyla hazırlanmıştır. Verileriniz,
                6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">2.</span> Toplanan Veriler
              </h2>
              <p className="leading-relaxed mb-3">Sistemimiz aracılığıyla aşağıdaki veriler toplanabilir:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span><strong>Ad ve Soyad:</strong> Etkinlik katılımcılarının kimlik bilgileri</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span><strong>E-posta Adresi:</strong> İletişim ve doğrulama amacıyla</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span><strong>Telefon Numarası:</strong> Opsiyonel iletişim bilgisi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span><strong>Konum Bilgisi:</strong> QR kod tarama sırasında yoklama doğrulaması için anlık konum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span><strong>Katılım Kayıtları:</strong> Hangi etkinliğe, ne zaman katıldığınıza dair veriler</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">3.</span> Verilerin Kullanım Amacı
              </h2>
              <p className="leading-relaxed mb-3">Toplanan veriler yalnızca şu amaçlarla kullanılmaktadır:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Etkinlik yoklama ve katılım takibi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Katılımcı kimlik doğrulaması</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Etkinlik organizatörlerine raporlama</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Teknik destek ve sistem iyileştirmeleri</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">4.</span> Konum Verisi
              </h2>
              <p className="leading-relaxed">
                QR kod tarama işlemi sırasında konum bilginize erişmemiz gerekebilir. Bu bilgi
                yalnızca etkinlik alanında bulunduğunuzu doğrulamak amacıyla anlık olarak kullanılır
                ve kalıcı olarak saklanmaz. Konum erişimi tarayıcı üzerinden sizin onayınızla gerçekleşir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">5.</span> Veri Güvenliği
              </h2>
              <p className="leading-relaxed">
                Verileriniz şifreli bağlantılar (HTTPS) üzerinden iletilmekte ve güvenli bulut
                veritabanlarında saklanmaktadır. Yetkisiz erişimi önlemek için endüstri standardı
                güvenlik önlemleri uygulanmaktadır. Yalnızca yetkili sistem yöneticileri
                kişisel verilere erişebilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">6.</span> Üçüncü Taraf Paylaşımı
              </h2>
              <p className="leading-relaxed">
                Kişisel verileriniz; yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz,
                satılmaz veya kiralanmaz. Etkinlik organizatörü olan kurum/kuruluş ile yalnızca
                ilgili etkinliğin katılım verileri paylaşılır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">7.</span> Haklarınız
              </h2>
              <p className="leading-relaxed mb-3">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>İşlenen verilere erişim ve düzeltme talep etme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Verilerin silinmesini veya yok edilmesini talep etme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Veri işlemenin kısıtlanmasını isteme</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">8.</span> İletişim
              </h2>
              <p className="leading-relaxed">
                Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için
                sistem yöneticinizle iletişime geçebilirsiniz. Talebiniz en geç 30 gün
                içinde yanıtlanacaktır.
              </p>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 text-center">
              <a
                href="/"
                className="btn-outline inline-flex items-center gap-2"
              >
                ← Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
