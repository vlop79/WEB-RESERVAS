import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ExternalLink } from "lucide-react";

export default function ZohoSetup() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [domain, setDomain] = useState("eu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthorize = async () => {
    if (!clientId || !clientSecret || !domain) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/zoho/init-oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          domain,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar autorización");
      }

      const data = await response.json();
      
      // Redirect to Zoho authorization page
      window.location.href = data.authUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Configurar Integración con Zoho CRM</CardTitle>
            <CardDescription>
              Conecta el sistema de reservas con Zoho CRM para sincronizar contactos, empresas y actividades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instructions */}
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold">📋 Antes de empezar:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Ve a <a href="https://api-console.zoho.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      Zoho API Console <ExternalLink className="h-3 w-3" />
                    </a></li>
                    <li>Crea una aplicación "Server-based Applications"</li>
                    <li>Copia el Client ID y Client Secret</li>
                    <li>Pégalos abajo y haz clic en "Autorizar con Zoho"</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  placeholder="1000.ABC123XYZ..."
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="abc123xyz..."
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Dominio de Zoho</Label>
                <select
                  id="domain"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  <option value="com">Internacional (.com)</option>
                  <option value="eu">Europa (.eu)</option>
                  <option value="in">India (.in)</option>
                  <option value="com.au">Australia (.com.au)</option>
                  <option value="jp">Japón (.jp)</option>
                </select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAuthorize}
                disabled={loading || !clientId || !clientSecret}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirigiendo a Zoho...
                  </>
                ) : (
                  "Autorizar con Zoho CRM"
                )}
              </Button>
            </div>

            {/* Help text */}
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-semibold">¿Qué sucederá después?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Serás redirigido a Zoho para autorizar la aplicación</li>
                <li>Después de autorizar, verás las credenciales generadas</li>
                <li>Copia las credenciales y añádelas en Settings → Secrets</li>
                <li>¡La integración estará lista para usar!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
