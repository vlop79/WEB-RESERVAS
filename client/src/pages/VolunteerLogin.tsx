import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import { Loader2, LogIn } from "lucide-react";
import { APP_LOGO } from "@/const";

export default function VolunteerLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = trpc.volunteer.login.useMutation({
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem("volunteerToken", data.token);
      toast.success("¡Bienvenido/a de nuevo!");
      setLocation("/portal-voluntario/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Error al iniciar sesión");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src="/logo-fqt.jpg" alt="Fundación Quiero Trabajo" className="h-16" />
          </div>
          <CardTitle className="text-2xl" style={{ color: "#ea6852" }}>
            Portal del Voluntario
          </CardTitle>
          <CardDescription>
            Inicia sesión para acceder a tu dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
              style={{ backgroundColor: "#ea6852" }}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>

            <div className="text-center text-sm space-y-2">
              <div className="text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="/portal-voluntario/registro">
                  <a className="font-medium underline" style={{ color: "#ea6852" }}>
                    Regístrate aquí
                  </a>
                </Link>
              </div>
              <div>
                <Link href="/portal-voluntario/recuperar-contrasena">
                  <a className="text-gray-600 hover:underline text-sm">
                    ¿Olvidaste tu contraseña?
                  </a>
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
