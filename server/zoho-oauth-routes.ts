import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Zoho OAuth configuration from environment variables
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || 'https://accounts.zoho.eu'; // EU region
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || 'https://web-reservas-production.up.railway.app/api/zoho/callback';

/**
 * Step 1: Authorization page - shows button to start OAuth flow
 */
router.get('/authorize', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Autorizar Zoho CRM</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #ea6852;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background-color: #ea6852;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
        }
        .button:hover {
          background-color: #d55742;
        }
        .info {
          margin: 20px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <h1>Autorizar Zoho CRM</h1>
      <div class="info">
        <p><strong>Paso 1:</strong> Haz clic en el botón para autorizar la aplicación</p>
        <p><strong>Paso 2:</strong> Inicia sesión en Zoho si es necesario</p>
        <p><strong>Paso 3:</strong> Acepta los permisos solicitados</p>
        <p><strong>Paso 4:</strong> Copia el Refresh Token que te mostraremos</p>
        <p><strong>Paso 5:</strong> Añade el token en Railway como variable ZOHO_REFRESH_TOKEN</p>
      </div>
      <a href="/api/zoho/auth" class="button">Autorizar Zoho CRM</a>
    </body>
    </html>
  `;
  res.send(html);
});

/**
 * Step 2: Redirect to Zoho authorization
 */
router.get('/auth', (req, res) => {
  const scope = 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL';
  const authUrl = `${ZOHO_DOMAIN}/oauth/v2/auth?` +
    `response_type=code&` +
    `client_id=${ZOHO_CLIENT_ID}&` +
    `scope=${scope}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  console.log('[Zoho OAuth] Redirecting to:', authUrl);
  res.redirect(authUrl);
});

/**
 * Step 3: Handle OAuth callback and exchange code for tokens
 */
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error de Autorización</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          h1 { color: #d9534f; }
          .error {
            padding: 15px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>Error de Autorización</h1>
        <div class="error">
          <p><strong>Error:</strong> ${error}</p>
        </div>
        <p><a href="/api/zoho/authorize">Volver a intentar</a></p>
      </body>
      </html>
    `);
  }

  if (!code) {
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          h1 { color: #d9534f; }
        </style>
      </head>
      <body>
        <h1>Error</h1>
        <p>No se recibió el código de autorización</p>
        <p><a href="/api/zoho/authorize">Volver a intentar</a></p>
      </body>
      </html>
    `);
  }

  try {
    console.log('[Zoho OAuth] Exchanging code for tokens...');
    
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(
      `${ZOHO_DOMAIN}/oauth/v2/token`,
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: ZOHO_CLIENT_ID,
          client_secret: ZOHO_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: code as string,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    console.log('[Zoho OAuth] Tokens received successfully');
    console.log('[Zoho OAuth] Access Token:', access_token);
    console.log('[Zoho OAuth] Refresh Token:', refresh_token);
    console.log('[Zoho OAuth] Expires in:', expires_in, 'seconds');

    // Display the refresh token to the user
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Autorización Exitosa</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
          }
          h1 {
            color: #5cb85c;
            text-align: center;
          }
          .success {
            padding: 15px;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
          }
          .token-box {
            margin: 20px 0;
            padding: 15px;
            background-color: #f5f5f5;
            border: 2px solid #ea6852;
            border-radius: 5px;
            font-family: monospace;
            word-break: break-all;
          }
          .instructions {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
          }
          .instructions ol {
            text-align: left;
            margin: 10px 0;
          }
          .copy-button {
            padding: 10px 20px;
            background-color: #ea6852;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
          }
          .copy-button:hover {
            background-color: #d55742;
          }
        </style>
      </head>
      <body>
        <h1>✅ Autorización Exitosa</h1>
        <div class="success">
          <p><strong>¡Perfecto!</strong> La autorización con Zoho CRM fue exitosa.</p>
        </div>
        
        <div class="instructions">
          <h3>📋 Próximos Pasos:</h3>
          <ol>
            <li>Copia el <strong>Refresh Token</strong> que aparece abajo</li>
            <li>Ve a Railway → tu proyecto → Variables</li>
            <li>Actualiza o crea la variable <code>ZOHO_REFRESH_TOKEN</code></li>
            <li>Pega el token copiado como valor</li>
            <li>Guarda los cambios</li>
            <li>Railway redesplegará automáticamente</li>
          </ol>
        </div>

        <h3>🔑 Refresh Token:</h3>
        <div class="token-box" id="refreshToken">${refresh_token}</div>
        <button class="copy-button" onclick="copyToken()">📋 Copiar Token</button>

        <script>
          function copyToken() {
            const token = document.getElementById('refreshToken').textContent;
            navigator.clipboard.writeText(token).then(() => {
              alert('✅ Token copiado al portapapeles');
            }).catch(err => {
              console.error('Error al copiar:', err);
              alert('❌ Error al copiar. Por favor, copia manualmente el token.');
            });
          }
        </script>

        <div style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-radius: 5px;">
          <p><strong>ℹ️ Información Técnica:</strong></p>
          <p>Access Token (válido por ${expires_in} segundos): <code>${access_token.substring(0, 20)}...</code></p>
          <p>Este Access Token es temporal. El Refresh Token es permanente y se usará para generar nuevos Access Tokens automáticamente.</p>
        </div>
      </body>
      </html>
    `);

  } catch (error: any) {
    console.error('[Zoho OAuth] Error exchanging code for tokens:', error.response?.data || error.message);
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error al Obtener Tokens</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          h1 { color: #d9534f; }
          .error {
            padding: 15px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            margin: 20px 0;
            text-align: left;
          }
          pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <h1>Error al Obtener Tokens</h1>
        <div class="error">
          <p><strong>Error:</strong></p>
          <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
        </div>
        <p><a href="/api/zoho/authorize">Volver a intentar</a></p>
      </body>
      </html>
    `);
  }
});

export default router;
