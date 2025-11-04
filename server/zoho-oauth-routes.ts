/**
 * Zoho OAuth routes for generating refresh token
 */

import { Router } from 'express';

const router = Router();

// Store temporary data during OAuth flow
const oauthState: {
  clientId?: string;
  clientSecret?: string;
  domain?: string;
} = {};

/**
 * Initiate Zoho OAuth flow
 * POST /api/zoho/init-oauth
 */
router.post('/init-oauth', (req, res) => {
  const { clientId, clientSecret, domain } = req.body;

  if (!clientId || !clientSecret || !domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Store credentials temporarily
  oauthState.clientId = clientId;
  oauthState.clientSecret = clientSecret;
  oauthState.domain = domain;

  // Get the current host for redirect URI
  const protocol = req.protocol;
  const host = req.get('host');
  const redirectUri = `${protocol}://${host}/api/zoho/callback`;

  // Generate authorization URL
  const authUrl = `https://accounts.zoho.${domain}/oauth/v2/auth?` +
    `scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL&` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.json({ authUrl });
});

/**
 * OAuth callback from Zoho
 * GET /api/zoho/callback
 */
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).send('Missing authorization code');
  }

  if (!oauthState.clientId || !oauthState.clientSecret || !oauthState.domain) {
    return res.status(400).send('OAuth state not found. Please restart the authorization process.');
  }

  try {
    // Exchange code for refresh token
    const protocol = req.protocol;
    const host = req.get('host');
    const redirectUri = `${protocol}://${host}/api/zoho/callback`;

    const tokenUrl = `https://accounts.zoho.${oauthState.domain}/oauth/v2/token`;
    const params = new URLSearchParams({
      code,
      client_id: oauthState.clientId,
      client_secret: oauthState.clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch(`${tokenUrl}?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code: ${errorText}`);
    }

    const data: any = await response.json();

    if (!data.refresh_token) {
      throw new Error('No refresh token in response');
    }

    // Success! Show the credentials
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Zoho CRM - Autorización Exitosa</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #22c55e;
            margin-bottom: 20px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .credentials {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
          }
          .credential-item {
            margin: 10px 0;
            word-break: break-all;
          }
          .label {
            font-weight: bold;
            color: #666;
          }
          .value {
            color: #000;
            user-select: all;
          }
          .instructions {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
          }
          .copy-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
          }
          .copy-btn:hover {
            background: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>¡Autorización Exitosa!</h1>
          <p>El Refresh Token de Zoho CRM se ha generado correctamente.</p>
          
          <div class="instructions">
            <strong>📋 Próximos pasos:</strong>
            <ol>
              <li>Copia las credenciales de abajo</li>
              <li>Ve a <strong>Settings → Secrets</strong> en el panel de administración</li>
              <li>Añade cada una de estas variables como un nuevo secret</li>
            </ol>
          </div>

          <div class="credentials" id="credentials">
            <div class="credential-item">
              <span class="label">ZOHO_CLIENT_ID=</span><span class="value">${oauthState.clientId}</span>
            </div>
            <div class="credential-item">
              <span class="label">ZOHO_CLIENT_SECRET=</span><span class="value">${oauthState.clientSecret}</span>
            </div>
            <div class="credential-item">
              <span class="label">ZOHO_REFRESH_TOKEN=</span><span class="value">${data.refresh_token}</span>
            </div>
            <div class="credential-item">
              <span class="label">ZOHO_DOMAIN=</span><span class="value">${oauthState.domain}</span>
            </div>
          </div>

          <button class="copy-btn" onclick="copyCredentials()">📋 Copiar Todas las Credenciales</button>
          
          <p style="margin-top: 30px; color: #666;">
            Una vez añadidas las credenciales en Settings → Secrets, la integración con Zoho CRM estará lista para usar.
          </p>
        </div>

        <script>
          function copyCredentials() {
            const text = \`ZOHO_CLIENT_ID=${oauthState.clientId}
ZOHO_CLIENT_SECRET=${oauthState.clientSecret}
ZOHO_REFRESH_TOKEN=${data.refresh_token}
ZOHO_DOMAIN=${oauthState.domain}\`;
            
            navigator.clipboard.writeText(text).then(() => {
              alert('✅ Credenciales copiadas al portapapeles');
            }).catch(err => {
              console.error('Error al copiar:', err);
            });
          }
        </script>
      </body>
      </html>
    `;

    // Clear oauth state
    delete oauthState.clientId;
    delete oauthState.clientSecret;
    delete oauthState.domain;

    res.send(html);
  } catch (error: any) {
    console.error('Error in Zoho OAuth callback:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

export default router;
