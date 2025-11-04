import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import VolunteerLayout from "@/components/VolunteerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Heart, TrendingUp, Users, Clock, Star, Target } from "lucide-react";

export default function VolunteerMyImpact() {
  const { volunteer, isLoading: authLoading } = useVolunteerAuth();

  // Mock data - replace with actual tRPC queries
  const stats = {
    totalSessions: 7,
    totalHours: 14, // 2 hours per session
    womenHelped: 7,
    averageRating: 4.8,
    completionRate: 100,
    currentStreak: 3, // weeks
  };

  const recentSessions = [
    {
      id: 1,
      date: "2024-10-28",
      attendee: "María González",
      service: "Mentoring",
      duration: 2,
      feedback: "Excelente sesión, muy útil",
    },
    {
      id: 2,
      date: "2024-10-21",
      attendee: "Laura Martínez",
      service: "Estilismo",
      duration: 2,
      feedback: "Gracias por tu tiempo y dedicación",
    },
    {
      id: 3,
      date: "2024-10-14",
      attendee: "Carmen Ruiz",
      service: "Mentoring",
      duration: 2,
      feedback: "Me ayudó mucho en mi búsqueda de empleo",
    },
  ];

  const monthlyProgress = [
    { month: "Julio", sessions: 2 },
    { month: "Agosto", sessions: 1 },
    { month: "Septiembre", sessions: 2 },
    { month: "Octubre", sessions: 2 },
  ];

  if (authLoading) {
    return (
      <VolunteerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tu impacto...</p>
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
            <Heart className="h-8 w-8" />
            Mi Impacto en FQT
          </h1>
          <p className="text-gray-600 mt-2">
            El cambio que estás generando en la vida de las mujeres
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-[#ea6852]/20 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ea6852]">
                <Users className="h-5 w-5" />
                Mujeres Ayudadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-[#ea6852]">{stats.womenHelped}</p>
              <p className="text-sm text-gray-600 mt-2">Vidas impactadas positivamente</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#ea6852]/20 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#ea6852]">
                <Clock className="h-5 w-5" />
                Horas Donadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-[#ea6852]">{stats.totalHours}h</p>
              <p className="text-sm text-gray-600 mt-2">De tu tiempo voluntario</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Star className="h-5 w-5" />
                Valoración Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold text-green-600">{stats.averageRating}</p>
              <p className="text-sm text-gray-600 mt-2">De 5 estrellas</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress and Streak */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#ea6852]" />
                Tu Progreso Mensual
              </CardTitle>
              <CardDescription>Sesiones completadas por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month) => (
                  <div key={month.month}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-gray-600">{month.sessions} sesiones</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#ea6852] h-2 rounded-full transition-all"
                        style={{ width: `${(month.sessions / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#ea6852]" />
                Racha Actual
              </CardTitle>
              <CardDescription>Semanas consecutivas con actividad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#ea6852] to-orange-500 text-white mb-4">
                  <span className="text-4xl font-bold">{stats.currentStreak}</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">Semanas consecutivas</p>
                <p className="text-sm text-gray-600 mt-2">¡Sigue así! La consistencia es clave</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#ea6852]" />
              Sesiones Recientes
            </CardTitle>
            <CardDescription>Tus últimas sesiones de voluntariado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{session.attendee}</p>
                      <p className="text-sm text-gray-600">{session.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString("es-ES")}
                      </p>
                      <p className="text-xs text-gray-600">{session.duration}h</p>
                    </div>
                  </div>
                  {session.feedback && (
                    <div className="mt-3 p-3 bg-[#ea6852]/5 rounded border border-blue-100">
                      <p className="text-sm text-gray-700 italic">"{session.feedback}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card className="bg-gradient-to-r from-[#ea6852] to-orange-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Award className="h-16 w-16 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-2">¡Tu impacto es real!</h3>
                <p className="text-white/90">
                  Has dedicado <strong>{stats.totalHours} horas</strong> de tu tiempo para ayudar a{" "}
                  <strong>{stats.womenHelped} mujeres</strong> en su camino hacia el empleo. Cada sesión marca una
                  diferencia significativa en sus vidas. ¡Gracias por tu compromiso!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
