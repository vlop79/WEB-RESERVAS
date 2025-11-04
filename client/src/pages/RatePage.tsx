import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function RatePage() {
  const [, setLocation] = useLocation();
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Get booking ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("booking");
    if (id) {
      setBookingId(parseInt(id));
    }
  }, []);

  // Check if rating already exists
  const { data: existingRating, isLoading: loadingExisting } = trpc.ratings.getByBookingId.useQuery(
    { bookingId: bookingId || 0 },
    { enabled: !!bookingId }
  );

  const createRatingMutation = trpc.ratings.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("¡Gracias por tu valoración!");
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar la valoración");
    },
  });

  const handleSubmit = () => {
    if (!bookingId) {
      toast.error("ID de reserva no válido");
      return;
    }

    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    createRatingMutation.mutate({
      bookingId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>No se encontró el ID de la reserva</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (existingRating || submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img
                src="/Logo_FQT.JPG"
                alt="Fundación Quiero Trabajo"
                className="h-20 mx-auto"
              />
            </div>
            <CardTitle className="text-2xl" style={{ color: "#ea6852" }}>
              ¡Gracias por tu valoración!
            </CardTitle>
            <CardDescription className="mt-4">
              Tu opinión nos ayuda a mejorar la experiencia para todas las participantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {existingRating && (
              <div className="mt-4">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= existingRating.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {existingRating.comment && (
                  <p className="text-sm text-gray-600 mt-2">"{existingRating.comment}"</p>
                )}
              </div>
            )}
            <Button
              onClick={() => setLocation("/")}
              className="mt-6"
              style={{ backgroundColor: "#ea6852" }}
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img
              src="/Logo_FQT.JPG"
              alt="Fundación Quiero Trabajo"
              className="h-20 mx-auto"
            />
          </div>
          <CardTitle className="text-2xl" style={{ color: "#ea6852" }}>
            ¿Cómo fue tu experiencia?
          </CardTitle>
          <CardDescription className="mt-2">
            Tu opinión es muy importante para nosotros y nos ayuda a mejorar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-gray-700">Califica tu experiencia</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && "Muy insatisfecho"}
                {rating === 2 && "Insatisfecho"}
                {rating === 3 && "Neutral"}
                {rating === 4 && "Satisfecho"}
                {rating === 5 && "Muy satisfecho"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Cuéntanos más (opcional)
            </label>
            <Textarea
              id="comment"
              placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || createRatingMutation.isPending}
            className="w-full"
            style={{ backgroundColor: "#ea6852" }}
          >
            {createRatingMutation.isPending ? "Enviando..." : "Enviar valoración"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
