import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Loader2, Heart, Filter, BarChart3, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface CompanyImpactProps {
  company: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
}

export default function CompanyImpact({ company }: CompanyImpactProps) {
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Obtener reservas de la empresa
  const { data: bookings, isLoading: bookingsLoading } = trpc.companyUser.getMyCompanyBookings.useQuery();

  // Obtener estadísticas
  const { data: stats, isLoading: statsLoading } = trpc.companyUser.getMyCompanyStats.useQuery();

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

  // Función para exportar a CSV
  const exportToCSV = () => {
    if (!filteredBookings || filteredBookings.length === 0) {
      return;
    }

    // Crear encabezados CSV
    const headers = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Servicio', 'Nombre Voluntaria', 'Email Voluntaria', 'Teléfono', 'Estado'];
    
    // Crear filas CSV
    const rows = filteredBookings.map((booking: any) => [
      new Date(booking.bookingDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      booking.startTime,
      booking.endTime,
      booking.serviceType === 'mentoring' ? 'Mentoring' : 'Estilismo',
      booking.candidateName,
      booking.candidateEmail,
      booking.candidatePhone || '',
      booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'
    ]);

    // Combinar encabezados y filas
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas_${company.slug}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (bookingsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // URL del dashboard de Zoho Analytics (sin filtro automático)
  const zohoCompanyDashboardUrl = `https://analytics.zoho.eu/open-view/54583000002119330/0960d97a7847fcd961fc14b725e6a48f`;

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-6 w-6 text-[#ea6852]" />
          <h2 className="text-3xl font-bold text-[#ea6852]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            El Impacto de {company.name}
          </h2>
        </div>
        <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Gracias por apoyar a las mujeres en su camino hacia el empleo
        </p>
      </div>

      {/* Impacto de la Empresa */}
      <Card className="border-2 border-[#ea6852]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#ea6852]" />
            <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>El Impacto de {company.name}</CardTitle>
          </div>
          <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
            Métricas específicas de voluntarios activos y participación de tu empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mensaje informativo con instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Filter className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  👉 Cómo ver los datos de {company.name}
                </h4>
                <p className="text-sm text-blue-800 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Este dashboard muestra datos de todas las empresas colaboradoras. Para ver solo los datos de <strong>{company.name}</strong>, sigue estos pasos:
                </p>
                <ol className="text-sm text-blue-800 space-y-2 ml-4" style={{ fontFamily: 'Roboto, sans-serif', listStyleType: 'decimal' }}>
                  <li>
                    <strong>Paso 1:</strong> Localiza el filtro <strong>"Nombre de Cuenta"</strong> en la parte superior del dashboard
                  </li>
                  <li>
                    <strong>Paso 2:</strong> Haz clic en el desplegable y selecciona <strong>"{company.name}"</strong>
                  </li>
                  <li>
                    <strong>Paso 3:</strong> Automáticamente se mostrarán solo los datos de tu empresa
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Iframe del dashboard */}
          <div className="w-full bg-gray-50 rounded-lg p-2" style={{ minHeight: '1220px' }}>
            <iframe
              src={zohoCompanyDashboardUrl}
              className="w-full rounded-lg shadow-sm"
              style={{ height: '1200px', border: '1px solid #e5e7eb' }}
              title={`Dashboard ${company.name}`}
              loading="lazy"
            />
          </div>
          
          <p className="text-xs text-gray-500 text-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
            📈 Dashboard actualizado en tiempo real desde Zoho Analytics
          </p>
        </CardContent>
      </Card>

      {/* Sección 3: Reservas de Voluntarias */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#ea6852]" />
                <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>Reservas de Voluntarias</CardTitle>
              </div>
              <CardDescription style={{ fontFamily: 'Roboto, sans-serif' }}>
                Listado de todas las sesiones reservadas en {company.name}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={filteredBookings.length === 0}
                className="border-[#ea6852] text-[#ea6852] hover:bg-[#ea6852] hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                  <SelectItem value="lastMonth">Mes pasado</SelectItem>
                  <SelectItem value="year">Este año</SelectItem>
                  <SelectItem value="upcoming">Próximas</SelectItem>
                  <SelectItem value="past">Pasadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                No hay reservas todavía
              </p>
              <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Las reservas aparecerán aquí cuando las voluntarias reserven sesiones
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Voluntaria</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {new Date(booking.bookingDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.serviceType === 'mentoring' ? 'default' : 'secondary'}>
                        {booking.serviceType === 'mentoring' ? 'Mentoring' : 'Estilismo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.candidateName}</p>
                        <p className="text-sm text-gray-500">{booking.candidateEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                        {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
