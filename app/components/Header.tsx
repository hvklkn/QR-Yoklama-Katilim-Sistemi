import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              QR
            </div>
            <span className="font-bold text-gray-900">Yoklama</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
            <Link href="/scan" className="text-gray-600 hover:text-gray-900">
              Scan
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="text-gray-600">
              <span className="sr-only">Menu</span>
              {/* Hamburger icon would go here */}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
