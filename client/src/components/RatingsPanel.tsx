import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Loader2 } from "lucide-react";

export default function RatingsPanel() {
  const { data: ratings, isLoading } = trpc.ratings.getAllWithDetails.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valoraciones de Voluntarios</CardTitle>
          <CardDescription>
            Aquí aparecerán las valoraciones que los voluntarios dejen después de sus sesiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No hay valoraciones todavía
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Valoraciones</CardDescription>
            <CardTitle className="text-3xl">{ratings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Calificación Promedio</CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl">{averageRating.toFixed(1)}</CardTitle>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valoraciones 5 Estrellas</CardDescription>
            <CardTitle className="text-3xl">
              {ratings.filter((r) => r.rating === 5).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Ratings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Valoraciones</CardTitle>
          <CardDescription>
            Feedback de voluntarios después de sus sesiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Voluntario</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Comentario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ratings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="text-sm">
                    {new Date(rating.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rating.volunteerName}</p>
                      <p className="text-xs text-gray-500">{rating.volunteerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{rating.companyName}</TableCell>
                  <TableCell>{rating.serviceName}</TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= rating.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {rating.comment ? (
                      <p className="text-sm text-gray-600 line-clamp-2">{rating.comment}</p>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Sin comentario</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
