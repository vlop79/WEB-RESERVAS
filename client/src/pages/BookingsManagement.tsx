import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Calendar, Download, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function BookingsManagement() {
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterService, setFilterService] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterOficina, setFilterOficina] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: bookings, isLoading, refetch } = trpc.admin.getBookingsWithDetails.useQuery();
  const { data: companies } = trpc.admin.getAllCompanies.useQuery();
  const { data: stats } = trpc.admin.getBookingStats.useQuery();
  const { data: teamMembers } = trpc.admin.getTeamMembers.useQuery();

  const changeHost = trpc.admin.changeBookingHost.useMutation({
    onSuccess: () => {
      toast.success("Anfitrión cambiado correctamente");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error al cambiar anfitrión: ${error.message}`);
    },
  });

  const cancelBooking = trpc.admin.cancelBooking.useMutation({
    onSuccess: () => {
      toast.success("Reserva cancelada correctamente");
      refetch();
      setShowCancelDialog(false);
      setSelectedBooking(null);
    },
    onError: (error) => {
      toast.error("Error al cancelar la reserva", {
        description: error.message,
      });
    },
  });

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      if (filterCompany !== "all" && booking.companyId?.toString() !== filterCompany) return false;
      if (filterService !== "all" && booking.serviceSlug !== filterService) return false;
      if (filterStatus !== "all" && booking.status !== filterStatus) return false;
      if (filterOficina !== "all" && booking.oficina !== filterOficina) return false;
      if (filterDate && booking.date !== filterDate) return false;
      if (searchEmail && !booking.volunteerEmail.toLowerCase().includes(searchEmail.toLowerCase())) return false;
      if (searchName && !booking.volunteerName.toLowerCase().includes(searchName.toLowerCase())) return false;
      return true;
    });
  }, [bookings, filterCompany, filterService, filterStatus, filterOficina, filterDate, searchEmail, searchName]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filterCompany, filterService, filterStatus, filterOficina, filterDate, searchEmail, searchName]);

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelBooking.mutate({ 
        id: selectedBooking,
        reason: cancelReason || undefined,
      });
    }
  };

  const exportToCSV = () => {
    if (!filteredBookings || filteredBookings.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    const headers = [
      "ID",
      "Fecha",
      "Hora Inicio",
      "Hora Fin",
      "Empresa",
      "Servicio",
      "Modalidad",
      "Oficina",
      "Voluntario",
      "Email",
      "Teléfono",
      "Anfitrión",
      "Enlace Meet",
      "Estado",
      "Fecha Reserva",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.date || "",
      booking.startTime || "",
      booking.endTime || "",
      booking.companyName || "",
      booking.serviceName || "",
      booking.serviceModality || "",
      booking.oficina || "",
      booking.volunteerName,
      booking.volunteerEmail,
      booking.volunteerPhone || "",
      booking.hostEmail || "",
      booking.googleMeetLink || "",
      booking.status,
      new Date(booking.createdAt).toLocaleString("es-ES"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `reservas_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exportado correctamente");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#ea6852" }}>
            Gestión de Reservas
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra todas las reservas del sistema
          </p>
        </div>


        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Reservas ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Oficina</TableHead>
                    <TableHead>Voluntario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Anfitrión</TableHead>
                    <TableHead>Google Meet</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                        No se encontraron reservas con los filtros aplicados
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          {booking.date
                            ? new Date(booking.date + "T00:00:00").toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {booking.startTime} - {booking.endTime}
                        </TableCell>
                        <TableCell>{booking.companyName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{booking.serviceName}</span>
                            <Badge variant="outline" className="w-fit mt-1">
                              {booking.serviceModality}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.oficina ? (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {booking.oficina}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>{booking.volunteerName}</TableCell>
                        <TableCell className="text-sm">{booking.volunteerEmail}</TableCell>
                        <TableCell className="text-sm">
                          {booking.status === "confirmed" && teamMembers ? (
                            <Select
                              value={booking.hostEmail || ""}
                              onValueChange={(newHost) => {
                                if (newHost !== booking.hostEmail) {
                                  changeHost.mutate({
                                    bookingId: booking.id,
                                    newHostEmail: newHost,
                                  });
                                }
                              }}
                              disabled={changeHost.isLoading}
                            >
                              <SelectTrigger className="w-[200px] text-xs">
                                <SelectValue placeholder="Seleccionar anfitrión" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map((email) => (
                                  <SelectItem key={email} value={email} className="text-xs">
                                    {email.split('@')[0]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : booking.hostEmail ? (
                            <span className="text-blue-600">{booking.hostEmail}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.googleMeetLink ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(booking.googleMeetLink!);
                                toast.success("Enlace copiado al portapapeles");
                              }}
                              className="text-xs"
                            >
                              Copiar enlace
                            </Button>
                          ) : booking.serviceModality === 'presencial' ? (
                            <Badge variant="secondary" className="text-xs">Presencial</Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">No disponible</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "destructive"}
                          >
                            {booking.status === "confirmed" ? "Confirmada" : "Cancelada"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === "confirmed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking.id);
                                setShowCancelDialog(true);
                              }}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)} de{" "}
                  {filteredBookings.length} reservas
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.confirmed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.cancelled || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.byCompany?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra las reservas por diferentes criterios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {companies?.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Servicio</Label>
                <Select value={filterService} onValueChange={setFilterService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="mentoring">Mentoring</SelectItem>
                    <SelectItem value="estilismo">Estilismo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nombre Voluntario</Label>
                <Input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Voluntario</Label>
                <Input
                  type="text"
                  placeholder="Buscar por email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterCompany("all");
                  setFilterService("all");
                  setFilterStatus("all");
                  setFilterOficina("all");
                  setFilterDate("");
                  setSearchEmail("");
                  setSearchName("");
                }}
              >
                Limpiar Filtros
              </Button>
              <Button onClick={exportToCSV} className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={(open) => {
        setShowCancelDialog(open);
        if (!open) setCancelReason("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de cancelación (opcional)</Label>
              <Input
                id="reason"
                placeholder="Ej: El voluntario no puede asistir"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              No, mantener
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={cancelBooking.isPending}
            >
              {cancelBooking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
