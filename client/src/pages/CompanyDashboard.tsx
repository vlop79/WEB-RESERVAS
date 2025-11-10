import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { APP_LOGO } from "@/const";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyImpact from "./CompanyImpact";
import CompanyRankings from "./CompanyRankings";
import CompanyFQTImpact from "./CompanyFQTImpact";

export default function CompanyDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("impact");

  // Obtener información de la empresa asignada
  const { data: company, isLoading: companyLoading, error: companyError } = trpc.companyUser.getMyCompany.useQuery(
    undefined,
    { enabled: !!user && user.role === 'empresa' }
  );

  console.log('[CompanyDashboard] Estado:', { user, authLoading, companyLoading, company, companyError });

  if (authLoading || companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'empresa') {
    console.log('[CompanyDashboard] Usuario no válido o no es empresa:', { user });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso no autorizado</CardTitle>
            <CardDescription>
              Debes iniciar sesión como usuario de empresa para acceder a esta página.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No se pudo cargar la información de tu empresa. Por favor, contacta al administrador.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo FQT */}
            <img 
              src={APP_LOGO} 
              alt="FQT" 
              className="h-12 w-auto object-contain"
            />
            
            {/* Logo Empresa */}
            {company.logoUrl && (
              <img 
                src={company.logoUrl} 
                alt={company.name} 
                className="h-12 w-auto object-contain"
              />
            )}
            
            {/* Nombre y subtítulo */}
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {company.name}
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Dashboard de Impacto
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Usuario {company.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="border-[#ea6852] text-[#ea6852] hover:bg-[#ea6852] hover:text-white"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="impact">📊 Impacto de mi Empresa</TabsTrigger>
            <TabsTrigger value="rankings">🏆 Rankings</TabsTrigger>
            <TabsTrigger value="fqt-impact">🌍 El Impacto de FQT</TabsTrigger>
          </TabsList>
          
          <TabsContent value="impact">
            <CompanyImpact company={company} />
          </TabsContent>
          
          <TabsContent value="rankings">
            <CompanyRankings company={company} />
          </TabsContent>
          
          <TabsContent value="fqt-impact">
            <CompanyFQTImpact company={company} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
