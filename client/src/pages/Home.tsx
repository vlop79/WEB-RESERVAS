import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Loader2 } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import CookieBanner from "@/components/CookieBanner";

export default function Home() {
  const { data: companiesData, isLoading } = trpc.public.getCompanies.useQuery();
  
  // Ordenar empresas alfabéticamente por nombre
  const companies = companiesData ? [...companiesData].sort((a, b) => a.name.localeCompare(b.name)) : [];

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

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" style={{ color: '#ea6852' }}>
              Transforma vidas con tu tiempo
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Acompaña a mujeres en su camino hacia el empleo. Selecciona tu empresa en el calendario, 
              elige el servicio que mejor se adapte a tus habilidades (<strong>Mentoring</strong> para preparar entrevistas 
              o <strong>Estilismo</strong> para asesoramiento de imagen profesional), y reserva tu franja horaria. 
              Recibirás toda la información necesaria 24 horas antes de tu sesión.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/faqs">
                <Button variant="outline" size="lg" className="border-[#ea6852] text-[#ea6852] hover:bg-[#ea6852] hover:text-white">
                  ¿Cómo funciona? - FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="pb-24">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            {!companies || companies.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No hay empresas disponibles en este momento.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Por favor, contacta con el administrador.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <Link key={company.id} href={`/reservar/${company.slug}`}>
                    <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                      <CardHeader>
                        {company.logoUrl && (
                          <div className="mb-4 flex h-40 w-full items-center justify-center bg-white rounded-lg p-4">
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="h-32 w-full object-contain"
                            />
                          </div>
                        )}
                        <CardTitle className="text-center">{company.name}</CardTitle>
                        <CardDescription className="text-center">
                          Haz clic para reservar tu sesión
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant="default">
                          Reservar ahora
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="FQT" className="h-8 w-8" />
              <p className="text-sm text-muted-foreground">
                © 2025 Fundación Quiero Trabajo. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <a
                href="https://quierotrabajo.org/politica-de-privacidad/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Política de privacidad
              </a>
              <a
                href="https://quierotrabajo.org/aviso-legal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Aviso legal
              </a>
              <span className="hidden md:inline">|</span>
              <a href="mailto:contacto@quierotrabajo.org" className="text-primary hover:underline">
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}
