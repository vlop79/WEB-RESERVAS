import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "wouter";

export default function VolunteerForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implementar endpoint de recuperación de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
      toast.success("Email enviado", {
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña"
      });
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo enviar el email de recuperación"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="/logo-fqt.jpg" alt="Fundación Quiero Trabajo" className="h-16" />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{ color: "#ea6852" }}>
              Recuperar Contraseña
            </CardTitle>
            <CardDescription>
              {emailSent 
                ? "Email enviado correctamente"
                : "Ingresa tu email para recibir instrucciones"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <Button
                asChild
                className="w-full"
                style={{ backgroundColor: "#ea6852" }}
              >
                <Link href="/portal-voluntario/login">
                  Volver al Login
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                style={{ backgroundColor: "#ea6852" }}
              >
                {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </Button>

              <div className="text-center text-sm">
                <Link href="/portal-voluntario/login" className="text-[#ea6852] hover:underline">
                  Volver al Login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
