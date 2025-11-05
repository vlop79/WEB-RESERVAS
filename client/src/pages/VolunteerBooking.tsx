import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

/**
 * Pestaña "Reservar Sesión" en el portal de voluntarios
 * Muestra el listado de empresas disponibles para reservar sesiones
 * Reutiliza la misma lógica y diseño del landing público
 * Última actualización: 2025-01-05
 */
export default function VolunteerBooking() {
  const { data: companiesData, isLoading } = trpc.public.getCompanies.useQuery();
  
  // Ordenar empresas alfabéticamente por nombre
  const companies = companiesData ? [...companiesData].sort((a, b) => a.name.localeCompare(b.name)) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#ea6852' }}>
          Reservar Sesión
        </h1>
        <p className="mt-2 text-muted-foreground">
          Selecciona una empresa para reservar tu sesión de voluntariado
        </p>
      </div>

      {/* Companies Grid */}
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
  );
}
