import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Award, TrendingUp, Building2, BookOpen, GraduationCap, Trophy, Calendar } from "lucide-react";
import { APP_LOGO } from "@/const";

interface VolunteerLayoutProps {
  children: React.ReactNode;
}

export default function VolunteerLayout({ children }: VolunteerLayoutProps) {
  const { volunteer, isLoading, isAuthenticated, logout } = useVolunteerAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/portal-voluntario/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: TrendingUp, label: "Dashboard", path: "/portal-voluntario/dashboard" },
    { icon: Calendar, label: "Reservar Sesión", path: "/portal-voluntario/reservar" },
    { icon: User, label: "Mi Perfil", path: "/portal-voluntario/perfil" },
    { icon: Award, label: "Mi Impacto", path: "/portal-voluntario/impacto" },
    { icon: Building2, label: "Impacto de mi Empresa", path: "/portal-voluntario/empresa" },
    { icon: Trophy, label: "Rankings", path: "/portal-voluntario/rankings" },
    { icon: BookOpen, label: "Biblioteca", path: "/portal-voluntario/biblioteca" },
    { icon: GraduationCap, label: "Academia de Voluntariado FQT", path: "/portal-voluntario/cursos" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-fqt.jpg" alt="Fundación Quiero Trabajo" className="h-12" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-gray-700">
              <p className="text-sm font-medium">{volunteer?.name} {volunteer?.surname}</p>
              <p className="text-xs text-gray-500">{volunteer?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container">
          <div className="flex gap-1 overflow-x-auto py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLocation(item.path)}
                  className={isActive ? "bg-[#ea6852] hover:bg-[#ea6852]/90" : ""}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto py-6 bg-secondary/10">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Fundación Quiero Trabajo. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
