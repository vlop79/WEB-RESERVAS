import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Award, Building2, User } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function VolunteerRankings() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();
  
  // Mock data for rankings - replace with actual tRPC queries
  const topVolunteers = [
    { id: 1, name: "María González", sessions: 45, position: "Consultora Senior", company: "AXA" },
    { id: 2, name: "Carlos Ruiz", sessions: 38, position: "Director RRHH", company: "Coca-Cola" },
    { id: 3, name: "Ana García López", sessions: 32, position: "Gerente", company: "Telefónica" },
    { id: 4, name: "Laura Martínez", sessions: 28, position: "Manager", company: "Santander" },
    { id: 5, name: "Pedro Sánchez", sessions: 25, position: "Consultor", company: "BBVA" },
  ];

  const topCompanies = [
    { id: 1, name: "AXA", volunteers: 15, sessions: 120, logo: "🏢" },
    { id: 2, name: "Coca-Cola", volunteers: 12, sessions: 95, logo: "🥤" },
    { id: 3, name: "Telefónica", volunteers: 10, sessions: 78, logo: "📱" },
    { id: 4, name: "Santander", volunteers: 9, sessions: 65, logo: "🏦" },
    { id: 5, name: "BBVA", volunteers: 8, sessions: 52, logo: "💳" },
  ];

  const myRank = 3; // Current volunteer's rank
  const myCompanyRank = 3; // Current company's rank

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando rankings...</p>
          </div>
        </div>
      </VolunteerLayout>
    );
  }

  return (
    <VolunteerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#ea6852] flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Rankings
          </h1>
          <p className="text-gray-600 mt-2">
            Descubre quiénes están marcando la diferencia en FQT
          </p>
        </div>

        {/* My Position Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-[#ea6852]/20 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ea6852]">
                <Award className="h-5 w-5" />
                Tu Posición
              </CardTitle>
              <CardDescription>En el ranking de voluntarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-[#ea6852]">#{myRank}</div>
                <p className="text-gray-600 mt-2">de {topVolunteers.length} voluntarios activos</p>
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Tus sesiones completadas</p>
                  <p className="text-2xl font-bold text-[#ea6852]">{topVolunteers[myRank - 1]?.sessions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#ea6852]/20 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ea6852]">
                <Building2 className="h-5 w-5" />
                Posición de tu Empresa
              </CardTitle>
              <CardDescription>En el ranking de empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-[#ea6852]">#{myCompanyRank}</div>
                <p className="text-gray-600 mt-2">de {topCompanies.length} empresas participantes</p>
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Sesiones de tu empresa</p>
                  <p className="text-2xl font-bold text-[#ea6852]">{topCompanies[myCompanyRank - 1]?.sessions || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#ea6852]" />
              Top Voluntarios
            </CardTitle>
            <CardDescription>Los voluntarios más activos de FQT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVolunteers.map((vol, index) => (
                <div
                  key={vol.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    index + 1 === myRank
                      ? "bg-[#ea6852]/10 border-[#ea6852] shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                          ? "bg-orange-300 text-orange-900"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {vol.name}
                        {index + 1 === myRank && (
                          <span className="text-xs bg-[#ea6852] text-white px-2 py-1 rounded">Tú</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vol.position} en {vol.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#ea6852]">{vol.sessions}</p>
                    <p className="text-xs text-gray-600">sesiones</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#ea6852]" />
              Top Empresas
            </CardTitle>
            <CardDescription>Las empresas más comprometidas con FQT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    index + 1 === myCompanyRank
                      ? "bg-[#ea6852]/5 border-[#ea6852] shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                          ? "bg-orange-300 text-orange-900"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-3xl">{company.logo}</div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {company.name}
                        {index + 1 === myCompanyRank && (
                          <span className="text-xs bg-[#ea6852] text-white px-2 py-1 rounded">Tu empresa</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">{company.volunteers} voluntarios activos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#ea6852]">{company.sessions}</p>
                    <p className="text-xs text-gray-600">sesiones</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivation Card */}
        <Card className="bg-gradient-to-r from-[#ea6852] to-orange-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-12 w-12" />
              <div>
                <h3 className="text-xl font-bold">¡Sigue así!</h3>
                <p className="text-white/90 mt-1">
                  Cada sesión cuenta. Estás haciendo una diferencia real en la vida de muchas mujeres.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
