import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function Booking() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedService, setSelectedService] = useState<string>("mentoring");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    volunteerName: "",
    volunteerEmail: "",
    volunteerPhone: "",
    oficina: "" as "Barcelona" | "Madrid" | "Málaga" | "",
  });

  const { data: company, isLoading: loadingCompany } = trpc.public.getCompany.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: slots, isLoading: loadingSlots, refetch: refetchSlots } = trpc.public.getAvailableSlots.useQuery(
    { companySlug: slug || "", serviceSlug: selectedService },
    { enabled: !!slug && !!selectedService }
  );

  const createBooking = trpc.public.createBooking.useMutation({
    onSuccess: () => {
      setBookingSuccess(true);
      refetchSlots();
      toast.success("¡Reserva confirmada!", {
        description: "Recibirás un email de confirmación en breve.",
      });
      // Trigger confetti celebration
      fireConfetti();
    },
    onError: (error) => {
      toast.error("Error al crear la reserva", {
        description: error.message,
      });
    },
  });

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Validar oficina para servicios presenciales
    if (selectedService === "estilismo" && !formData.oficina) {
      toast.error("Por favor, selecciona una oficina");
      return;
    }

    createBooking.mutate({
      slotId: selectedSlot,
      ...formData,
      oficina: selectedService === "estilismo" ? formData.oficina : undefined,
    });
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ea6852', '#ff8c69', '#ffa07a', '#ff7f50', '#ff6347'],
      });

      // Confetti from right
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ea6852', '#ff8c69', '#ffa07a', '#ff7f50', '#ff6347'],
      });
    }, 250);
  };

  if (loadingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Empresa no encontrada</CardTitle>
            <CardDescription>La empresa que buscas no existe o no está disponible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold" style={{ color: "#ea6852" }}>
              ¡Reserva Confirmada!
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              ¡Gracias por tu compromiso! Tu apoyo marca la diferencia en la vida de muchas mujeres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Recibirás un email de confirmación con todos los detalles de tu sesión, incluyendo el
              enlace de Google Meet.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button className="w-full" variant="default">
                  Volver al inicio
                </Button>
              </Link>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  setBookingSuccess(false);
                  setShowForm(false);
                  setSelectedSlot(null);
                      setFormData({ volunteerName: "", volunteerEmail: "", volunteerPhone: "", oficina: "" });
                }}
              >
                Hacer otra reserva
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots?.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, typeof slots>);

  const sortedDates = slotsByDate ? Object.keys(slotsByDate).sort() : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header showAdminButton={false} />
      
      {/* Company Info Bar */}
      <div className="border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {company.logoUrl && (
              <img src={company.logoUrl} alt={company.name} className="h-8 w-auto object-contain" />
            )}
            <div>
              <h1 className="text-lg font-semibold">{company.name}</h1>
              {company.accountManager && (
                <p className="text-sm text-muted-foreground">
                  Responsable: {company.accountManager}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mx-auto max-w-5xl">
          {!showForm ? (
            <>
              {/* Service Selection */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Selecciona el tipo de sesión</CardTitle>
                  <CardDescription>
                    Elige entre Mentoring, Estilismo o Shadowing según tus preferencias y experiencia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedService} onValueChange={setSelectedService}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="mentoring">
                        <Users className="mr-2 h-4 w-4" />
                        Mentoring
                      </TabsTrigger>
                      <TabsTrigger value="estilismo">
                        <Users className="mr-2 h-4 w-4" />
                        Estilismo
                      </TabsTrigger>
                      <TabsTrigger value="shadowing">
                        <Users className="mr-2 h-4 w-4" />
                        Shadowing
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="mentoring" className="mt-4">
                      <div className="rounded-lg bg-card border-2 border-primary/20 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <img src="/mentoring-icon.jpg" alt="Mentoring" className="h-16 w-16 rounded-full" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary">Mentoring</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Sesiones de mentoría individual con candidatas de FQT. Horario: 11:00 - 18:00.
                            </p>
                            <Badge className="mt-3" variant="secondary">
                              1 voluntaria por sesión
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="estilismo" className="mt-4">
                      <div className="rounded-lg bg-card border-2 border-primary/20 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <img src="/estilismo-icon.jpg" alt="Estilismo" className="h-16 w-16 rounded-full" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary">Estilismo</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Sesiones de asesoramiento de imagen con candidatas de FQT. Horario: 10:00 - 17:00.
                            </p>
                            <Badge className="mt-3" variant="secondary">
                              2 voluntarias por sesión
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="shadowing" className="mt-4">
                      <div className="rounded-lg bg-card border-2 border-primary/20 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <img src="/mentoring-icon.jpg" alt="Shadowing" className="h-16 w-16 rounded-full" />
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary">Shadowing (Mentoring a la Sombra)</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Ideal para voluntarios con menos experiencia. Acompaña a un mentor experimentado durante una sesión real de mentoring y aprende observando. Horario: 11:00 - 18:00. Modalidad virtual.
                            </p>
                            <Badge className="mt-3" variant="secondary">
                              2 voluntarios por sesión (1 mentor + 1 en shadowing)
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Available Slots */}
              <Card>
                <CardHeader>
                  <CardTitle>Horarios disponibles</CardTitle>
                  <CardDescription>
                    Selecciona el día y hora que mejor te convenga
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSlots ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : !slots || slots.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">
                        No hay horarios disponibles en este momento.
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Por favor, inténtalo más tarde o contacta con el administrador.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {sortedDates.map((date) => {
                        const dateSlots = slotsByDate![date];
                        const dateObj = new Date(date + "T00:00:00");
                        const formattedDate = dateObj.toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });

                        return (
                          <div key={date}>
                            <div className="mb-3 flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold capitalize">{formattedDate}</h3>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                              {dateSlots.map((slot) => {
                                const availableSpots = slot.maxVolunteers - slot.currentVolunteers;
                                return (
                                  <Button
                                    key={slot.id}
                                    variant="outline"
                                    className="h-auto flex-col items-start p-3 hover:border-primary hover:bg-primary/5"
                                    onClick={() => handleSlotSelect(slot.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span className="font-semibold">
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                    </div>
                                    <span className="mt-1 text-xs text-muted-foreground">
                                      {availableSpots} {availableSpots === 1 ? "plaza" : "plazas"}{" "}
                                      disponible{availableSpots !== 1 ? "s" : ""}
                                    </span>
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            /* Booking Form */
            <Card>
              <CardHeader>
                <CardTitle>Completa tu reserva</CardTitle>
                <CardDescription>
                  Introduce tus datos para confirmar la reserva
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.volunteerName}
                      onChange={(e) => setFormData({ ...formData, volunteerName: e.target.value })}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.volunteerEmail}
                      onChange={(e) => setFormData({ ...formData, volunteerEmail: e.target.value })}
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.volunteerPhone}
                      onChange={(e) => setFormData({ ...formData, volunteerPhone: e.target.value })}
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  {/* Selector de oficina solo para servicios presenciales (Estilismo) */}
                  {selectedService === "estilismo" && (
                    <div className="space-y-2">
                      <Label htmlFor="oficina">Oficina de atención *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Barcelona", "Madrid", "Málaga"].map((oficina) => (
                          <Button
                            key={oficina}
                            type="button"
                            variant={formData.oficina === oficina ? "default" : "outline"}
                            className="w-full"
                            onClick={() => setFormData({ ...formData, oficina: oficina as any })}
                          >
                            {oficina}
                          </Button>
                        ))}
                      </div>
                      {!formData.oficina && (
                        <p className="text-sm text-muted-foreground">
                          Selecciona la oficina donde deseas recibir el servicio
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowForm(false);
                        setSelectedSlot(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        "Confirmar reserva"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
