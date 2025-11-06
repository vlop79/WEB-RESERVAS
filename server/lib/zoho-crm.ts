/**
 * Integración con Zoho CRM
 * Sincroniza reservas del sistema con Zoho CRM (Contactos y Tareas)
 */

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  domain: string;
  refreshToken: string;
}

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  api_domain: string;
  token_type: string;
}

interface ZohoContact {
  id: string;
  Email: string;
  First_Name: string;
  Last_Name: string;
  Account_Name?: {
    id: string;
    name: string;
  };
}

interface ZohoTaskData {
  Subject: string;
  Description: string;
  Due_Date: string;
  Status: string;
  Priority: string;
  Who_Id: {
    id: string;
  };
  What_Id?: {
    id: string;
  };
}

/**
 * Obtiene la configuración de Zoho desde variables de entorno
 */
function getZohoConfig(): ZohoConfig {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const domain = process.env.ZOHO_DOMAIN || 'eu';
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN || '';

  if (!clientId || !clientSecret) {
    throw new Error('Zoho CRM credentials not configured');
  }

  return { clientId, clientSecret, domain, refreshToken };
}

/**
 * Obtiene la URL base de la API según el dominio
 */
function getApiUrl(domain: string): string {
  return `https://www.zohoapis.${domain}`;
}

/**
 * Obtiene la URL de autenticación según el dominio
 */
function getAuthUrl(domain: string): string {
  return `https://accounts.zoho.${domain}`;
}

/**
 * Obtiene un access token válido usando el refresh token
 */
async function getAccessToken(): Promise<string> {
  const config = getZohoConfig();
  
  if (!config.refreshToken) {
    throw new Error('Zoho refresh token not configured. Please authorize the application first.');
  }

  const authUrl = getAuthUrl(config.domain);
  const tokenEndpoint = `${authUrl}/oauth/v2/token`;

  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get access token: ${error}`);
    }

    const data: ZohoTokenResponse = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('[Zoho CRM] Error getting access token:', error);
    throw error;
  }
}

/**
 * Busca un contacto en Zoho CRM por email
 */
export async function findContactByEmail(email: string): Promise<ZohoContact | null> {
  try {
    const config = getZohoConfig();
    const accessToken = await getAccessToken();
    const apiUrl = getApiUrl(config.domain);

    const searchUrl = `${apiUrl}/crm/v3/Contacts/search?email=${encodeURIComponent(email)}`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Zoho CRM] Error searching contact:', error);
      return null;
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error('[Zoho CRM] Error finding contact:', error);
    return null;
  }
}

/**
 * Crea una tarea en Zoho CRM asociada a un contacto
 */
export async function createTask(taskData: {
  contactEmail: string;
  subject: string;
  description: string;
  dueDate: string;
  priority?: 'High' | 'Medium' | 'Low';
}): Promise<boolean> {
  try {
    // Buscar el contacto primero
    const contact = await findContactByEmail(taskData.contactEmail);
    
    if (!contact) {
      console.warn(`[Zoho CRM] Contact not found for email: ${taskData.contactEmail}`);
      return false;
    }

    const config = getZohoConfig();
    const accessToken = await getAccessToken();
    const apiUrl = getApiUrl(config.domain);

    const taskPayload: ZohoTaskData = {
      Subject: taskData.subject,
      Description: taskData.description,
      Due_Date: taskData.dueDate,
      Status: 'Not Started',
      Priority: taskData.priority || 'High',
      Who_Id: {
        id: contact.id,
      },
    };

    // Si el contacto tiene una cuenta asociada, asociar la tarea también a la cuenta
    if (contact.Account_Name?.id) {
      taskPayload.What_Id = {
        id: contact.Account_Name.id,
      };
      console.log(`[Zoho CRM] Associating task to account: ${contact.Account_Name.name} (${contact.Account_Name.id})`);
    }

    const createUrl = `${apiUrl}/crm/v3/Tasks`;

    const response = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [taskPayload],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Zoho CRM] Error creating task:', error);
      return false;
    }

    const result = await response.json();
    console.log('[Zoho CRM] Task created successfully:', result);
    return true;
  } catch (error) {
    console.error('[Zoho CRM] Error creating task:', error);
    return false;
  }
}

/**
 * Genera la URL de autorización para obtener el código de autorización inicial
 */
export function getAuthorizationUrl(redirectUri: string): string {
  const config = getZohoConfig();
  const authUrl = getAuthUrl(config.domain);
  
  const params = new URLSearchParams({
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL',
    client_id: config.clientId,
    response_type: 'code',
    access_type: 'offline',
    redirect_uri: redirectUri,
  });

  return `${authUrl}/oauth/v2/auth?${params.toString()}`;
}

/**
 * Intercambia el código de autorización por un refresh token
 */
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
  const config = getZohoConfig();
  const authUrl = getAuthUrl(config.domain);
  const tokenEndpoint = `${authUrl}/oauth/v2/token`;

  const params = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange code for token: ${error}`);
    }

    const data = await response.json();
    return data.refresh_token;
  } catch (error) {
    console.error('[Zoho CRM] Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Sincroniza una reserva con Zoho CRM
 * Crea una tarea asociada al contacto del voluntario
 */
export async function syncBookingToZoho(booking: {
  volunteerEmail: string;
  volunteerName: string;
  companyName: string;
  serviceType: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string;
  office?: string;
}): Promise<boolean> {
  try {
    const subject = `Sesión de ${booking.serviceType} - ${booking.companyName}`;
    
    let description = `Voluntario: ${booking.volunteerName}\n`;
    description += `Empresa: ${booking.companyName}\n`;
    description += `Servicio: ${booking.serviceType}\n`;
    description += `Fecha: ${booking.date}\n`;
    description += `Horario: ${booking.startTime} - ${booking.endTime}\n`;
    
    if (booking.meetLink) {
      description += `\nEnlace Google Meet: ${booking.meetLink}`;
    }
    
    if (booking.office) {
      description += `\nOficina: ${booking.office}`;
    }

    const success = await createTask({
      contactEmail: booking.volunteerEmail,
      subject,
      description,
      dueDate: booking.date,
      priority: 'High',
    });

    return success;
  } catch (error) {
    console.error('[Zoho CRM] Error syncing booking:', error);
    return false;
  }
}
