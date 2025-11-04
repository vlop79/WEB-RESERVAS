import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Award, Calendar, Target, Star } from "lucide-react";

export default function VolunteerCompanyImpact() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();

  // Mock data - replace with actual tRPC queries
  const companyStats = {
    companyName: "Telefónica",
    totalVolunteers: 10,
    activevolunteers: 8,
    totalSessions: 78,
    totalHours: 156,
    womenHelped: 78,
    ranking: 3,
    averageRating: 4.7,
  };

  const topVolunteers = [
    { name: "Ana García López", sessions: 32, position: "Gerente" },
    { name: "Carlos Ruiz", sessions: 28, position: "Consultor Senior" },
    { name: "María González", sessions: 18, position: "Manager" },
  ];

  const monthlyTrend = [
    { month: "Jul", sessions: 15 },
    { month: "Ago", sessions: 18 },
    { month: "Sep", sessions: 22 },
    { month: "Oct", sessions: 23 },
  ];

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando impacto de tu empresa...</p>
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
            <Building2 className="h-8 w-8" />
            Impacto de {companyStats.companyName}
          </h1>
          <p className="text-gray-600 mt-2">
            El compromiso social de tu empresa con FQT
          </p>
        </div>

        {/* Company Ranking */}
        <Card className="border-2 border-[#ea6852]/20 bg-gradient-to-r from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-[#ea6852] text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-3xl font-bold">#{companyStats.ranking}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ranking de Empresas</p>
                  <p className="text-2xl font-bold text-gray-900">{companyStats.companyName}</p>
                  <p className="text-sm text-gray-600">Entre las empresas más activas de FQT</p>
                </div>
              </div>
              <Award className="h-12 w-12 text-[#ea6852]" />
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-[#ea6852]" />
                Voluntarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ea6852]">{companyStats.totalVolunteers}</p>
              <p className="text-xs text-gray-600 mt-1">{companyStats.activeVolunteers} activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-[#ea6852]" />
                Sesiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#ea6852]">{companyStats.totalSessions}</p>
              <p className="text-xs text-gray-600 mt-1">Completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-green-600" />
                Mujeres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{companyStats.womenHelped}</p>
              <p className="text-xs text-gray-600 mt-1">Ayudadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-[#f5a623]" />
                Valoración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#f5a623]">{companyStats.averageRating}</p>
              <p className="text-xs text-gray-600 mt-1">De 5 estrellas</p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#ea6852]" />
              Tendencia Mensual
            </CardTitle>
            <CardDescription>Evolución de sesiones completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrend.map((month) => (
                <div key={month.month}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{month.month}</span>
                    <span className="text-gray-600">{month.sessions} sesiones</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-[#ea6852] to-orange-500 h-3 rounded-full transition-all"
                      style={{ width: `${(month.sessions / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                📈 Tendencia positiva: +15% respecto al mes anterior
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Volunteers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#ea6852]" />
              Top Voluntarios de {companyStats.companyName}
            </CardTitle>
            <CardDescription>Los colaboradores más activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVolunteers.map((vol, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    vol.name === "Ana García López"
                      ? "bg-[#ea6852]/10 border-[#ea6852]"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : "bg-orange-300 text-orange-900"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        {vol.name}
                        {vol.name === "Ana García López" && (
                          <span className="text-xs bg-[#ea6852] text-white px-2 py-1 rounded">Tú</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">{vol.position}</p>
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

        {/* Impact Message */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Building2 className="h-16 w-16 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-2">Compromiso Corporativo</h3>
                <p className="text-white/90">
                  {companyStats.companyName} ha donado <strong>{companyStats.totalHours} horas</strong> de voluntariado
                  corporativo, impactando positivamente en <strong>{companyStats.womenHelped} mujeres</strong>. Este
                  compromiso refleja los valores de responsabilidad social de la empresa y su contribución al desarrollo
                  de la comunidad.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-2 border-[#ea6852]/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Conoces a alguien de tu empresa?</h3>
            <p className="text-gray-600 mb-4">
              Invita a más compañeros a unirse al programa de voluntariado y aumentar el impacto de {companyStats.companyName}
            </p>
            <p className="text-sm text-gray-500">
              Comparte tu experiencia y motiva a otros a participar
            </p>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
