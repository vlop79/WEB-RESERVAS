import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation, useRoute } from "wouter";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/reset-password");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  // Get token from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  // Validate token
  const { data: tokenValidation, isLoading: validatingToken } = trpc.auth.validateResetToken.useQuery(
    { token },
    { enabled: !!token }
  );

  const resetPassword = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setResetComplete(true);
      setTimeout(() => {
        setLocation("/login");
      }, 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    // Validate passwords
    if (newPassword.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    resetPassword.mutate({ token, newPassword });
  };

  // Loading state
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea6852] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Validando enlace...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid or expired token
  if (!token || (tokenValidation && !tokenValidation.valid)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo-fqt.jpg" alt="FQT" className="h-16 w-auto" />
            </div>
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">
              Enlace inválido o expirado
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Este enlace de recuperación no es válido o ya ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Los enlaces de recuperación son válidos por 1 hora. Si necesitas restablecer tu contraseña, solicita un nuevo enlace.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setLocation("/forgot-password")}
              className="w-full"
              style={{ backgroundColor: '#ea6852' }}
            >
              Solicitar nuevo enlace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (resetComplete) {
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
              ¡Contraseña actualizada!
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Tu contraseña ha sido restablecida exitosamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 border-[#ea6852] bg-[#ea6852]/5">
              <AlertDescription>
                <strong>¡Bienvenido de vuelta!</strong> 🌟
                <br />
                Redirigiendo al inicio de sesión en unos segundos...
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => setLocation("/login")}
              className="w-full"
              style={{ backgroundColor: '#ea6852' }}
            >
              Ir al inicio de sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-fqt.jpg" alt="FQT" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl" style={{ color: '#ea6852' }}>
            Establecer nueva contraseña
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
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
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={resetPassword.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={resetPassword.isPending}
                />
              </div>
            </div>

            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {resetPassword.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {resetPassword.error.message || "Error al restablecer la contraseña. Inténtalo de nuevo."}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#ea6852' }}
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Actualizando..." : "Restablecer contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
