import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Loader2, Heart, Filter, BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import CompanyLayout from "@/components/CompanyLayout";

export default function CompanyImpact() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Obtener información de la empresa asignada
  const { data: company, isLoading: companyLoading } = trpc.companyUser.getMyCompany.useQuery(
    undefined,
    { enabled: !!user && user.role === 'empresa' }
  );

  // Obtener reservas de la empresa
  const { data: bookings, isLoading: bookingsLoading } = trpc.companyUser.getMyCompanyBookings.useQuery(
    undefined,
    { enabled: !!user && user.role === 'empresa' }
  );

  // Obtener estadísticas
  const { data: stats, isLoading: statsLoading } = trpc.companyUser.getMyCompanyStats.useQuery(
    undefined,
    { enabled: !!user && user.role === 'empresa' }
  );

  // Filtrar reservas por período
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return bookings.filter((booking: any) => {
      const bookingDate = new Date(booking.bookingDate);
      
      switch (dateFilter) {
        case "today":
          return bookingDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return bookingDate >= weekAgo;
        case "month":
          return bookingDate >= startOfMonth;
        case "lastMonth":
          return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
        case "year":
          return bookingDate >= startOfYear;
        case "upcoming":
          return bookingDate >= now;
        case "past":
          return bookingDate < now;
        default:
          return true;
      }
    });
  }, [bookings, dateFilter]);

  if (companyLoading || bookingsLoading || statsLoading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CompanyLayout>
    );
  }

  if (!company) {
    return <CompanyLayout><div>No se encontró información de la empresa</div></CompanyLayout>;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getServiceBadge = (serviceSlug: string) => {
    return serviceSlug === 'mentoring' ? (
      <Badge style={{ backgroundColor: '#ea6852' }}>Mentoring</Badge>
    ) : (
      <Badge style={{ backgroundColor: '#5a6670' }}>Estilismo</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; color: string }> = {
      pendiente: { label: 'Pendiente', color: '#f59e0b' },
      confirmada: { label: 'Confirmada', color: '#10b981' },
      completada: { label: 'Completada', color: '#6b7280' },
      cancelada: { label: 'Cancelada', color: '#ef4444' },
    };
    const config = variants[status] || variants.pendiente;
    return <Badge style={{ backgroundColor: config.color }}>{config.label}</Badge>;
  };

  return (
    <CompanyLayout>
      <div className="space-y-8">
        {/* Sección de Impacto */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" style={{ color: '#ea6852' }} />
            <div>
              <h2 className="text-3xl font-bold text-foreground">El Impacto de {company.name}</h2>
              <p className="text-muted-foreground">Gracias por apoyar a las mujeres en su camino hacia el empleo</p>
            </div>
          </div>
        </div>

        {/* Zoho Analytics - Impacto Global de FQT */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" style={{ color: '#5a6670' }} />
              <div>
                <CardTitle>Impacto Global de FQT</CardTitle>
                <CardDescription>
                  Datos generales del programa de voluntariado corporativo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-lg overflow-hidden border bg-muted/10">
              <iframe
                frameBorder="0"
                width="100%"
                height="600"
                src="https://analytics.zoho.eu/open-view/54583000004601244/4519ff3ef1926a4da905f077c02e8570"
                title="Impacto Global FQT"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Dashboard global actualizado en tiempo real desde Zoho Analytics
            </p>
          </CardContent>
        </Card>

        {/* Zoho Analytics - Impacto de la Empresa */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" style={{ color: '#ea6852' }} />
              <div>
                <CardTitle>El Impacto de {company.name}</CardTitle>
                <CardDescription>
                  Métricas específicas de voluntarios activos y participación de tu empresa
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-lg overflow-hidden border bg-muted/10">
              <iframe
                frameBorder="0"
                width="100%"
                height="600"
                src="https://analytics.zoho.eu/open-view/54583000002119330/0960d97a7847fcd961fc14b725e6a48f"
                title="Impacto de la Empresa"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Dashboard actualizado en tiempo real desde Zoho Analytics
            </p>
          </CardContent>
        </Card>

        {/* Tabla de Reservas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Reservas de Voluntarias</CardTitle>
                <CardDescription>
                  Listado de todas las sesiones reservadas en {company.name}
                </CardDescription>
              </div>
              
              {/* Filtro de Período */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="lastMonth">Mes pasado</SelectItem>
                      <SelectItem value="year">Este año</SelectItem>
                      <SelectItem value="upcoming">Próximas</SelectItem>
                      <SelectItem value="past">Pasadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBookings && filteredBookings.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voluntaria</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Oficina</TableHead>
                      <TableHead>Anfitrión</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.volunteerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.volunteerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceBadge(booking.serviceSlug)}</TableCell>
                        <TableCell className="font-medium">{formatDate(booking.bookingDate)}</TableCell>
                        <TableCell className="font-mono text-sm">{booking.bookingTime}</TableCell>
                        <TableCell>{booking.office}</TableCell>
                        <TableCell>{booking.hostName || 'No asignado'}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">
                  {dateFilter === "all" 
                    ? "No hay reservas todavía" 
                    : "No hay reservas en este período"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {dateFilter === "all"
                    ? "Las reservas aparecerán aquí cuando las voluntarias reserven sesiones"
                    : "Prueba con otro filtro de fecha"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CompanyLayout>
  );
}
