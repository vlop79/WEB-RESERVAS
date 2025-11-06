/**
 * Router temporal para autorización de Zoho CRM
 * Este router maneja el flujo OAuth para obtener el refresh token inicial
 */

import { Router } from 'express';
import { getAuthorizationUrl, exchangeCodeForToken } from './lib/zoho-crm';

const router = Router();

/**
 * GET /api/zoho/authorize
 * Redirige al usuario a la página de autorización de Zoho
 */
router.get('/authorize', (req, res) => {
  try {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/zoho/callback`;
    const authUrl = getAuthorizationUrl(redirectUri);
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Autorización Zoho CRM</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: #0066cc;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin-top: 20px;
            }
            .button:hover {
              background: #0052a3;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h1>🔐 Autorización Zoho CRM</h1>
          <p>Para completar la integración con Zoho CRM, necesitas autorizar esta aplicación.</p>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Solo necesitas hacer esto UNA VEZ. Después de autorizar, el sistema funcionará automáticamente.
          </div>
          
          <p>Al hacer clic en el botón, serás redirigido a Zoho para autorizar el acceso.</p>
          
          <a href="${authUrl}" class="button">Autorizar Zoho CRM</a>
          
          <p style="margin-top: 40px; font-size: 14px; color: #666;">
            Después de autorizar, serás redirigido de vuelta aquí con el token configurado.
          </p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('[Zoho Auth] Error generating authorization URL:', error);
    res.status(500).json({ error: 'Failed to generate authorization URL' });
  }
});

/**
 * GET /api/zoho/callback
 * Maneja el callback de Zoho después de la autorización
 */
router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    
    if (!code) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error - Autorización Zoho</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
              }
              .error {
                background: #f8d7da;
                border: 1px solid #f5c2c7;
                padding: 15px;
                border-radius: 6px;
                color: #842029;
              }
            </style>
          </head>
          <body>
            <h1>❌ Error</h1>
            <div class="error">
              No se recibió el código de autorización. Por favor, intenta nuevamente.
            </div>
            <p><a href="/api/zoho/authorize">Volver a intentar</a></p>
          </body>
        </html>
      `);
    }

    const redirectUri = `${req.protocol}://${req.get('host')}/api/zoho/callback`;
    const refreshToken = await exchangeCodeForToken(code, redirectUri);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>✅ Autorización Exitosa</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 700px;
              margin: 50px auto;
              padding: 20px;
            }
            .success {
              background: #d1e7dd;
              border: 1px solid #badbcc;
              padding: 20px;
              border-radius: 6px;
              color: #0f5132;
              margin: 20px 0;
            }
            .token-box {
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              padding: 15px;
              border-radius: 6px;
              font-family: monospace;
              word-break: break-all;
              margin: 20px 0;
            }
            .instructions {
              background: #cfe2ff;
              border: 1px solid #b6d4fe;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
            }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>✅ Autorización Exitosa</h1>
          
          <div class="success">
            <strong>¡Perfecto!</strong> La autorización con Zoho CRM se completó correctamente.
          </div>

          <div class="instructions">
            <h3>📋 Próximos Pasos:</h3>
            <ol>
              <li>Copia el Refresh Token que aparece abajo</li>
              <li>Ve a Railway → tu proyecto → Variables</li>
              <li>Actualiza la variable <code>ZOHO_REFRESH_TOKEN</code> con este valor</li>
              <li>Guarda los cambios en Railway</li>
            </ol>
          </div>

          <h3>🔑 Tu Refresh Token:</h3>
          <div class="token-box">
            ${refreshToken}
          </div>

          <div class="success">
            <strong>✨ ¡Listo!</strong> Después de añadir el token en Railway, la integración con Zoho CRM estará completamente funcional.
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('[Zoho Auth] Error exchanging code for token:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error - Autorización Zoho</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .error {
              background: #f8d7da;
              border: 1px solid #f5c2c7;
              padding: 15px;
              border-radius: 6px;
              color: #842029;
            }
          </style>
        </head>
        <body>
          <h1>❌ Error</h1>
          <div class="error">
            <strong>Error al obtener el token:</strong><br>
            ${error instanceof Error ? error.message : 'Error desconocido'}
          </div>
          <p><a href="/api/zoho/authorize">Volver a intentar</a></p>
        </body>
      </html>
    `);
  }
});

export default router;
