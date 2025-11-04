import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function ZohoTokenGenerator() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [domain, setDomain] = useState("eu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [copied, setCopied] = useState(false);

  const generateToken = async () => {
    if (!clientId || !clientSecret || !authCode) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");
    setRefreshToken("");

    try {
      const tokenUrl = `https://accounts.zoho.${domain}/oauth/v2/token`;
      const params = new URLSearchParams({
        code: authCode.trim(),
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        grant_type: "authorization_code",
      });

      const response = await fetch(`${tokenUrl}?${params.toString()}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de Zoho: ${errorText}`);
      }

      const data = await response.json();

      if (!data.refresh_token) {
        throw new Error("No se recibió refresh token en la respuesta");
      }

      setRefreshToken(data.refresh_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    const text = `ZOHO_CLIENT_ID=${clientId}
ZOHO_CLIENT_SECRET=${clientSecret}
ZOHO_REFRESH_TOKEN=${refreshToken}
ZOHO_DOMAIN=${domain}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAuthUrl = () => {
    if (!clientId) return "";
    return `https://accounts.zoho.${domain}/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&client_id=${encodeURIComponent(clientId)}&response_type=code&access_type=offline&redirect_uri=https://www.zoho.com`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Generar Refresh Token de Zoho CRM</CardTitle>
            <CardDescription>
              Herramienta para generar el Refresh Token necesario para la integración con Zoho CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Credentials */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Paso 1: Credenciales de la aplicación</h3>
              
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
            </div>

            {/* Step 2: Generate Code */}
            {clientId && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-semibold">Paso 2: Generar código de autorización</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Haz clic en el botón de abajo para abrir la página de autorización de Zoho</li>
                      <li>Inicia sesión en Zoho y autoriza la aplicación</li>
                      <li>Después de autorizar, serás redirigido a zoho.com</li>
                      <li>Copia el <strong>código</strong> que aparece en la URL (después de <code>code=</code>)</li>
                      <li>Pégalo en el campo de abajo</li>
                    </ol>
                    <a
                      href={generateAuthUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Abrir página de autorización de Zoho
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Step 3: Auth Code */}
            <div className="space-y-2">
              <Label htmlFor="authCode">Código de autorización (del paso 2)</Label>
              <Textarea
                id="authCode"
                placeholder="1000.abc123xyz..."
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Pega aquí el código que obtuviste después de autorizar en Zoho
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              onClick={generateToken}
              disabled={loading || !clientId || !clientSecret || !authCode}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando Refresh Token...
                </>
              ) : (
                "Generar Refresh Token"
              )}
            </Button>

            {/* Success Result */}
            {refreshToken && (
              <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">¡Refresh Token generado exitosamente!</span>
                </div>

                <div className="space-y-2">
                  <Label>Credenciales completas:</Label>
                  <div className="bg-white p-4 rounded border font-mono text-xs space-y-1 overflow-x-auto">
                    <div>ZOHO_CLIENT_ID={clientId}</div>
                    <div>ZOHO_CLIENT_SECRET={clientSecret}</div>
                    <div>ZOHO_REFRESH_TOKEN={refreshToken}</div>
                    <div>ZOHO_DOMAIN={domain}</div>
                  </div>
                </div>

                <Button onClick={copyCredentials} variant="outline" className="w-full">
                  {copied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar todas las credenciales
                    </>
                  )}
                </Button>

                <Alert>
                  <AlertDescription>
                    <p className="font-semibold mb-2">Próximos pasos:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Ve a <strong>Settings → Secrets</strong> en el panel de administración</li>
                      <li>Añade cada una de estas 4 variables como un nuevo secret</li>
                      <li>¡La integración con Zoho CRM estará lista!</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
