import { Link } from "wouter";
import { Home } from "lucide-react";

interface HeaderProps {
  showAdminButton?: boolean;
}

export default function Header({ showAdminButton = true }: HeaderProps) {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/logo-fqt.jpg" alt="Fundación Quiero Trabajo" className="h-12 w-auto" />
          </Link>
          <Link href="/">
            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Home className="h-4 w-4" />
              Inicio
            </button>
          </Link>
        </div>
        {showAdminButton && (
          <div className="flex items-center gap-3">
            <Link href="/portal-voluntario/login">
              <button className="rounded-md border-2 border-[#ea6852] text-[#ea6852] px-4 py-2 text-sm font-medium hover:bg-[#ea6852] hover:text-white transition-colors">
                Accede como Voluntario
              </button>
            </Link>
            <Link href="/login">
              <button className="rounded-md border-2 border-[#ea6852] text-[#ea6852] px-4 py-2 text-sm font-medium hover:bg-[#ea6852] hover:text-white transition-colors">
                Accede como Empresa
              </button>
            </Link>
            <a href="https://web-reservas-production.up.railway.app/admin" target="_blank" rel="noopener noreferrer">
              <button className="rounded-md bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                Admin
              </button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
