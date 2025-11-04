import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Calendar, MapPin, User, Clock, Mail, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { getLoginUrl } from "@/const";

interface BookingEvent {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  companyName: string;
  serviceName: string;
  serviceModality: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone?: string;
  hostEmail?: string;
  googleMeetLink?: string;
  oficina?: string;
  status: string;
}

export default function CalendarView() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterOficina, setFilterOficina] = useState<string>("all");
  const [filterHost, setFilterHost] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingEvent | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const { data: bookings, isLoading } = trpc.admin.getBookingsWithDetails.useQuery(undefined, {
    enabled: isAuthenticated && (user?.role === "admin" || user?.role === "user"),
  });

  // Get unique hosts for filter
  const uniqueHosts = useMemo(() => {
    if (!bookings) return [];
    const hosts = bookings
      .map((b) => b.hostEmail)
      .filter((email): email is string => !!email)
      .filter((email, index, self) => self.indexOf(email) === index);
    return hosts;
  }, [bookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((booking) => {
      if (filterOficina !== "all" && booking.oficina !== filterOficina) return false;
      if (filterHost !== "all" && booking.hostEmail !== filterHost) return false;
      if (booking.status !== "confirmed") return false; // Only show confirmed bookings
      return true;
    });
  }, [bookings, filterOficina, filterHost]);

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<{
      date: number;
      isCurrentMonth: boolean;
      bookings: BookingEvent[];
    }> = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        bookings: [],
      });
    }

    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
      const dayBookings = filteredBookings.filter((b) => b.date === dateStr);
      days.push({
        date,
        isCurrentMonth: true,
        bookings: dayBookings,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        bookings: [],
      });
    }

    return days;
  }, [currentDate, filteredBookings]);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingClick = (booking: BookingEvent) => {
    setSelectedBooking(booking);
    setShowDetailDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>Debes iniciar sesión para acceder al calendario</CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">Iniciar sesión</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>No tienes permisos para acceder al calendario</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
            <p className="text-muted-foreground">Vista mensual de todas las sesiones programadas</p>
          </div>
          <Calendar className="h-8 w-8 text-primary" />
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra las reservas por oficina y anfitrión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Oficina</Label>
                <Select value={filterOficina} onValueChange={setFilterOficina}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Barcelona">Barcelona</SelectItem>
                    <SelectItem value="Madrid">Madrid</SelectItem>
                    <SelectItem value="Málaga">Málaga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Anfitrión</Label>
                <Select value={filterHost} onValueChange={setFilterHost}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueHosts.map((host) => (
                      <SelectItem key={host} value={host}>
                        {host}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFilterOficina("all");
                    setFilterHost("all");
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Hoy
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {/* Week day headers */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-sm py-2 text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarData.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] border rounded-lg p-2 ${
                      day.isCurrentMonth
                        ? "bg-background"
                        : "bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{day.date}</div>
                    <div className="space-y-1">
                      {day.bookings.slice(0, 3).map((booking) => (
                        <button
                          key={booking.id}
                          onClick={() => handleBookingClick(booking)}
                          className={`w-full text-left text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                            booking.serviceModality === "virtual"
                              ? "bg-orange-100 text-orange-800 border border-orange-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          <div className="font-medium truncate">{booking.startTime}</div>
                          <div className="truncate">{booking.companyName}</div>
                        </button>
                      ))}
                      {day.bookings.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{day.bookings.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                <span className="text-sm">Mentoring (Virtual)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span className="text-sm">Estilismo (Presencial)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
            <DialogDescription>Información completa de la sesión programada</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Empresa</Label>
                  <p className="font-medium">{selectedBooking.companyName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Servicio</Label>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{selectedBooking.serviceName}</p>
                    <Badge variant="outline">{selectedBooking.serviceModality}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </Label>
                  <p className="font-medium">
                    {new Date(selectedBooking.date + "T00:00:00").toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horario
                  </Label>
                  <p className="font-medium">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
              </div>

              {selectedBooking.oficina && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Oficina
                  </Label>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedBooking.oficina}
                  </Badge>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Información del Voluntario</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedBooking.volunteerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedBooking.volunteerEmail}</span>
                  </div>
                  {selectedBooking.volunteerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedBooking.volunteerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Información del Equipo FQT</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Anfitrión Asignado</Label>
                    <p className="font-medium text-blue-600">
                      {selectedBooking.hostEmail || "No asignado"}
                    </p>
                  </div>
                  {selectedBooking.googleMeetLink && (
                    <div>
                      <Label className="text-muted-foreground">Enlace Google Meet</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedBooking.googleMeetLink) {
                              navigator.clipboard.writeText(selectedBooking.googleMeetLink);
                              toast.success("Enlace copiado al portapapeles");
                            }
                          }}
                        >
                          Copiar enlace
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            if (selectedBooking.googleMeetLink) {
                              window.open(selectedBooking.googleMeetLink, "_blank");
                            }
                          }}
                        >
                          Abrir Meet
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
