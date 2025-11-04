import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const requestReset = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestReset.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo-fqt.jpg" alt="FQT" className="h-16 w-auto" />
            </div>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-[#ea6852]" />
            </div>
            <CardTitle className="text-2xl" style={{ color: '#ea6852' }}>
              Revisa tu correo
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un correo con instrucciones para recuperar tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-[#ea6852] bg-[#ea6852]/5">
              <AlertDescription>
                <strong>Tu impacto es importante para nosotros</strong> 🌟
                <br />
                Como empresa colaboradora, tu participación ayuda a transformar vidas. El enlace de recuperación será válido por 1 hora.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No olvides revisar tu carpeta de spam si no ves el correo en unos minutos.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-fqt.jpg" alt="FQT" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl" style={{ color: '#ea6852' }}>
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-[#ea6852] bg-[#ea6852]/5">
            <AlertDescription>
              <strong>Tu impacto es importante para nosotros</strong> 🌟
              <br />
              Como empresa colaboradora, tu participación en el programa de voluntariado corporativo ayuda a transformar vidas.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={requestReset.isPending}
                />
              </div>
            </div>

            {requestReset.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {requestReset.error.message || "Error al enviar el correo. Inténtalo de nuevo."}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#ea6852' }}
              disabled={requestReset.isPending}
            >
              {requestReset.isPending ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>

            <div className="text-center">
              <Link href="/login">
                <Button variant="link" className="text-sm">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
