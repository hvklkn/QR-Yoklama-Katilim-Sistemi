export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container-max py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">QR Yoklama Sistemi</h3>
            <p className="text-gray-600 text-sm">
              Etkinlik ve derslere hızlı, güvenli yoklama alan modern çözüm.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Özellikler</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900">
                  Dinamik QR Kodlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  Lokasyon Doğrulaması
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900">
                  CSV Export
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">İletişim</h4>
            <p className="text-sm text-gray-600">
              <a href="mailto:info@example.com" className="hover:text-gray-900">
                info@example.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} QR Yoklama Sistemi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Gizlilik
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Koşullar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
