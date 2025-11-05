import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Users, Building2, Calendar, Target } from "lucide-react";

export default function DashboardStats() {
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  const { overview, bookingsByService, bookingsByMonth, topCompanies } = stats;

  // Calculate percentage change
  const percentageChange = overview.totalBookingsLastMonth > 0
    ? Math.round(((overview.totalBookingsThisMonth - overview.totalBookingsLastMonth) / overview.totalBookingsLastMonth) * 100)
    : 0;

  const isPositiveChange = percentageChange >= 0;

  // Format month names for chart
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const formattedMonths = bookingsByMonth.map(item => {
    const [year, month] = item.month.split('-');
    return {
      month: `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`,
      count: item.count,
    };
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalBookingsThisMonth}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {isPositiveChange ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={isPositiveChange ? "text-green-500" : "text-red-500"}>
                {percentageChange > 0 ? "+" : ""}{percentageChange}%
              </span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.activeCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Empresas con calendario activo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluntarios Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.uniqueVolunteers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de voluntarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Slots reservados / Total slots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bookings by Service */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas por Servicio</CardTitle>
            <CardDescription>Distribución de reservas por tipo de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookingsByService.map((service) => {
                const total = bookingsByService.reduce((sum, s) => sum + s.count, 0);
                const percentage = total > 0 ? Math.round((service.count / total) * 100) : 0;
                
                return (
                  <div key={service.serviceSlug} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{service.serviceName}</span>
                      <span className="text-muted-foreground">{service.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          service.serviceSlug === 'mentoring' ? 'bg-blue-500' :
                          service.serviceSlug === 'estilismo' ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bookings by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Reservas</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formattedMonths.map((item, index) => {
                const maxCount = Math.max(...formattedMonths.map(m => m.count));
                const percentage = maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <span className="text-muted-foreground">{item.count} reservas</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Más Activas</CardTitle>
          <CardDescription>Top 5 empresas con más reservas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCompanies.map((company, index) => {
              const maxCount = Math.max(...topCompanies.map(c => c.bookingCount));
              const percentage = maxCount > 0 ? Math.round((company.bookingCount / maxCount) * 100) : 0;
              
              return (
                <div key={company.companySlug} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{company.companyName}</span>
                    </div>
                    <span className="text-muted-foreground">{company.bookingCount} reservas</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
