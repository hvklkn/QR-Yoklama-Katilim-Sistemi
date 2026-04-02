export const metadata = {
  title: "Kullanım Koşulları | QR Yoklama Sistemi",
  description: "QR Yoklama Sistemi kullanım koşulları ve hizmet şartları.",
};

export default function KosullarPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card-elevated p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
              📋 Kullanım Koşulları
            </h1>
            <p className="text-gray-500 text-sm">Son güncelleme: Nisan 2026</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">1.</span> Kabul ve Onay
              </h2>
              <p className="leading-relaxed">
                QR Yoklama Sistemini kullanarak bu kullanım koşullarını okuduğunuzu,
                anladığınızı ve kabul ettiğinizi beyan etmiş olursunuz. Bu koşulları
                kabul etmiyorsanız lütfen sistemi kullanmayınız.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">2.</span> Hizmet Tanımı
              </h2>
              <p className="leading-relaxed">
                QR Yoklama Sistemi; etkinlik, seminer, ders ve toplantılarda katılımcı
                yoklamasını QR kod teknolojisi aracılığıyla hızlı ve güvenli şekilde
                gerçekleştirmeye yönelik bir yazılım hizmetidir. Sistem; etkinlik yönetimi,
                katılımcı kaydı, QR kod oluşturma ve yoklama raporlama işlevlerini kapsar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">3.</span> Kullanıcı Sorumlulukları
              </h2>
              <p className="leading-relaxed mb-3">Sistemi kullanan kişi ve kuruluşlar aşağıdaki kurallara uymakla yükümlüdür:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Sistemi yalnızca yasal ve meşru amaçlar için kullanmak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Başkasının yerine QR kod taratmamak (vekâleten yoklama yasaktır)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Sisteme zarar vermeye yönelik girişimlerde bulunmamak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Diğer katılımcıların kişisel verilerini izinsiz kullanmamak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 font-bold mt-0.5">•</span>
                  <span>Admin hesap bilgilerini üçüncü şahıslarla paylaşmamak</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">4.</span> Admin Kullanıcı Yükümlülükleri
              </h2>
              <p className="leading-relaxed mb-3">Sistem yöneticisi olarak hareket eden kullanıcılar ek olarak:</p>
              <ul className="space-y-2 pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Katılımcılardan gerekli veri işleme izinlerini almakla</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Toplanan verileri yalnızca belirtilen amaç doğrultusunda kullanmakla</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Etkinlik verilerini güvenli bir şekilde saklamakla</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>KVKK ve ilgili mevzuata uymakla yükümlüdür.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">5.</span> QR Kod Kullanımı
              </h2>
              <p className="leading-relaxed">
                Her etkinlik için oluşturulan QR kodları belirli bir süre ve konum
                ile sınırlıdır. QR kodların kopyalanarak farklı ortamlarda kullanılması,
                manipüle edilmesi veya yetkisiz kişilerle paylaşılması kesinlikle yasaktır.
                Bu tür girişimler tespit edildiğinde ilgili kayıtlar geçersiz sayılabilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">6.</span> Hizmet Sürekliliği
              </h2>
              <p className="leading-relaxed">
                Sistemin kesintisiz çalışması için azami özen gösterilmektedir. Bununla birlikte
                planlı bakım, teknik arızalar veya üçüncü taraf hizmet sağlayıcılardan kaynaklanan
                kesintiler nedeniyle hizmette geçici aksaklıklar yaşanabilir. Bu durumlarda
                sorumluluk kabul edilmemektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">7.</span> Fikri Mülkiyet
              </h2>
              <p className="leading-relaxed">
                Sistem arayüzü, tasarımı, kodu ve içerikleri fikri mülkiyet hakları kapsamında
                koruma altındadır. İzin alınmaksızın kopyalanamaz, dağıtılamaz veya ticari
                amaçla kullanılamaz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">8.</span> Değişiklikler
              </h2>
              <p className="leading-relaxed">
                Bu kullanım koşulları önceden bildirim yapılmaksızın güncellenebilir.
                Güncellenen koşullar yayınlandıktan sonra sistemi kullanmaya devam etmeniz,
                değişiklikleri kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-primary-600">9.</span> Uygulanacak Hukuk
              </h2>
              <p className="leading-relaxed">
                Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Anlaşmazlık
                durumunda Türk mahkemeleri yetkili olacaktır.
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
