import VolunteerLayout from "@/components/VolunteerLayout";
import { useVolunteerAuth } from "@/hooks/useVolunteerAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, TrendingUp, Star, Calendar, Trophy } from "lucide-react";
import SocialShareButtons from "@/components/SocialShareButtons";
import { useBadgeNotifications } from "@/components/BadgeNotification";

export default function VolunteerDashboard() {
  const { volunteer, token } = useVolunteerAuth();
  
  // Sistema de notificaciones de badges
  useBadgeNotifications(volunteer?.id);

  const { data: stats } = trpc.volunteer.getStats.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const { data: sessions } = trpc.volunteer.getSessions.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const { data: badges } = trpc.volunteer.getBadges.useQuery(
    { token: token || "" },
    { 
      enabled: !!token,
      onSuccess: (data) => {
        // Verificar si hay nuevos badges para notificar
        if ((window as any).checkNewBadges && data) {
          (window as any).checkNewBadges(data);
        }
      }
    }
  );

  const { data: certificates } = trpc.volunteer.getCertificates.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const statCards = [
    {
      title: "Sesiones Completadas",
      value: stats?.totalSessions || 0,
      icon: Calendar,
      color: "#ea6852",
      description: "Total de sesiones de voluntariado",
    },
    {
      title: "Badges Ganados",
      value: stats?.totalBadges || 0,
      icon: Award,
      color: "#ea6852",
      description: "Logros desbloqueados",
    },
    {
      title: "Certificados",
      value: stats?.totalCertificates || 0,
      icon: Trophy,
      color: "#ea6852",
      description: "Certificados obtenidos",
    },
    {
      title: "Mujeres Atendidas",
      value: sessions?.length || 0,
      icon: Users,
      color: "#ea6852",
      description: "Personas impactadas",
    },
  ];

  return (
    <VolunteerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#ea6852" }}>
            ¡Bienvenido/a, {volunteer?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Aquí puedes ver tu impacto y progreso como voluntario/a de FQT
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: "#ea6852" }} />
                Sesiones Recientes
              </CardTitle>
              <CardDescription>
                Últimas sesiones de voluntariado realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions && sessions.length > 0 ? (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">
                          {session.attendeeName} {session.attendeeSurname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.serviceType}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Aún no has completado ninguna sesión</p>
                  <p className="text-sm mt-1">¡Reserva tu primera sesión para empezar!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: "#f5a623" }} />
                Mis Badges
              </CardTitle>
              <CardDescription>
                Logros y reconocimientos obtenidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {badges && badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-br from-background to-secondary/20"
                    >
                      <div className="text-4xl mb-2">{badge.badgeIcon || "🏆"}</div>
                      <p className="text-sm font-medium text-center">{badge.badgeName}</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {badge.badgeDescription}
                      </p>
                      <div className="mt-3">
                        <SocialShareButtons
                          title={`¡He conseguido el badge "${badge.badgeName}"!`}
                          description={`Acabo de desbloquear este logro en Fundación Quiero Trabajo: ${badge.badgeDescription}`}
                          hashtags={["FQT", "Voluntariado", "ImpactoSocial"]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Aún no has ganado ningún badge</p>
                  <p className="text-sm mt-1">¡Completa sesiones para desbloquear logros!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: "#7cb342" }} />
              Tu Progreso
            </CardTitle>
            <CardDescription>
              Avanza hacia tus próximas microcredenciales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress to next badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Próximo Badge: 5 Sesiones</span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.totalSessions || 0} / 5
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ea6852] to-[#f5a623] transition-all"
                    style={{ width: `${Math.min(((stats?.totalSessions || 0) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Próximo Badge: 10 Sesiones</span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.totalSessions || 0} / 10
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7cb342] to-[#42a5f5] transition-all"
                    style={{ width: `${Math.min(((stats?.totalSessions || 0) / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VolunteerLayout>
  );
}
