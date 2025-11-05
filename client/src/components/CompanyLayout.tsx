import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
  const { user, loading: authLoading, logout } = useAuth();
  const [location] = useLocation();

  // Obtener información de la empresa asignada
  const { data: company, isLoading: companyLoading } = trpc.companyUser.getMyCompany.useQuery(
    undefined,
    { enabled: !!user && user.role === 'empresa' }
  );

  if (authLoading || companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'empresa') {
    return null;
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-2">Sin empresa asignada</h2>
          <p className="text-muted-foreground">
            Tu cuenta no tiene una empresa asignada. Por favor, contacta con el administrador.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "impacto",
      label: "Impacto de mi Empresa",
      icon: Building2,
      path: "/company/dashboard",
    },
    {
      id: "rankings",
      label: "Rankings",
      icon: Trophy,
      path: "/company/rankings",
    },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo FQT Icon */}
              <img 
                src="/logo-fqt-icon.png" 
                alt="FQT" 
                className="h-12 w-12 object-contain"
              />
              
              {/* Separador */}
              <div className="h-12 w-px bg-border"></div>
              
              {/* Logo Empresa */}
              {company.logoUrl && (
                <img 
                  src={company.logoUrl} 
                  alt={company.name} 
                  className="h-12 w-auto object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
                <p className="text-sm text-muted-foreground">Dashboard de Impacto</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-card">
        <div className="container">
          <nav className="flex gap-1" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors
                    border-b-2 -mb-px
                    ${
                      active
                        ? "border-[#ea6852] text-[#ea6852]"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }
                  `}
                  role="tab"
                  aria-selected={active}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}
