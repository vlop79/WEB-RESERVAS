/**
 * Script to generate Zoho CRM Refresh Token from authorization code
 * Run with: tsx scripts/generate-zoho-token.ts
 */

const ZOHO_CLIENT_ID = '1000.HKJ5GTF7CT2AO2RU5AYUU3O5JQ9RPR';
const ZOHO_CLIENT_SECRET = 'b6d99e92993e092d6043806d45e3c441e33431d22c';
const ZOHO_CODE = '1000.eb22369a0ea5c8d6b86260b8f13c5f88.fcfd67f25039b0f4142d716565f4228d';
const ZOHO_DOMAIN = 'eu';
const REDIRECT_URI = 'https://3000-icqtlv98dvt363kz1eomz-f5455846.manusvm.computer/api/zoho/callback';

async function generateRefreshToken() {
  const tokenUrl = `https://accounts.zoho.${ZOHO_DOMAIN}/oauth/v2/token`;

  const params = new URLSearchParams({
    code: ZOHO_CODE,
    client_id: ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  try {
    console.log('🔄 Generando Refresh Token de Zoho CRM...\n');
    
    const response = await fetch(`${tokenUrl}?${params.toString()}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error al generar token:', response.status, errorText);
      return;
    }

    const data = await response.json();
    
    console.log('✅ ¡Refresh Token generado exitosamente!\n');
    console.log('📋 Respuesta completa de Zoho:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n📋 Configuración de Zoho CRM:');
    console.log('=====================================');
    console.log(`ZOHO_CLIENT_ID=${ZOHO_CLIENT_ID}`);
    console.log(`ZOHO_CLIENT_SECRET=${ZOHO_CLIENT_SECRET}`);
    console.log(`ZOHO_REFRESH_TOKEN=${data.refresh_token || 'NO DISPONIBLE - Ver respuesta arriba'}`);
    console.log(`ZOHO_DOMAIN=${ZOHO_DOMAIN}`);
    console.log('=====================================\n');
    console.log('🔐 Copia estas variables y añádelas a los Secrets del proyecto en Settings → Secrets\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

generateRefreshToken();
