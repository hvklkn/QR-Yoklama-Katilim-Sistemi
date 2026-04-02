export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 mt-12 md:mt-16 w-full">
      <div className="container-max py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <h3 className="font-bold text-white mb-3 md:mb-4 text-base md:text-lg">QR Yoklama Sistemi</h3>
            <p className="text-gray-300 text-xs md:text-sm">
              Etkinlik ve derslere hızlı, güvenli yoklama alan modern çözüm.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">Özellikler</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Dinamik QR Kodlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Lokasyon Doğrulaması
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  CSV Export
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-base md:text-lg">İletişim</h4>
            <p className="text-xs md:text-sm text-gray-300">
              <a href="mailto:info@example.com" className="hover:text-white transition-colors">
                info@example.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-gray-300 text-center md:text-left">
            &copy; {currentYear} QR Yoklama Sistemi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 mt-0">
            <a href="/gizlilik" className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
              Gizlilik
            </a>
            <a href="/kosullar" className="text-xs md:text-sm text-gray-300 hover:text-white transition-colors">
              Koşullar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
