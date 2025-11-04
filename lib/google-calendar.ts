import { google } from 'googleapis';
import { getDb } from '../server/db';
import { bookings } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 5 miembros del equipo FQT para round-robin
const FQT_TEAM_EMAILS = [
  'barcelona@quierotrabajo.org',
  'madrid@quierotrabajo.org',
  'malaga@quierotrabajo.org',
  'silvia@quierotrabajo.org',
  'proyecto@quierotrabajo.org',
];

/**
 * Obtiene el siguiente miembro del equipo usando round-robin
 * Distribuye las reservas equitativamente entre los 5 miembros
 */
export async function getNextHostEmail(): Promise<string> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Contar reservas por cada host
  const hostCounts: Record<string, number> = {};
  
  // Inicializar contadores en 0 para todos los miembros
  FQT_TEAM_EMAILS.forEach(email => {
    hostCounts[email] = 0;
  });

  // Obtener todas las reservas confirmadas con hostEmail asignado
  const allBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.status, 'confirmed'));

  // Contar reservas por host
  allBookings.forEach(booking => {
    if (booking.hostEmail && hostCounts[booking.hostEmail] !== undefined) {
      hostCounts[booking.hostEmail]++;
    }
  });

  // Encontrar el host con menos reservas
  let minCount = Infinity;
  let selectedHost = FQT_TEAM_EMAILS[0];

  FQT_TEAM_EMAILS.forEach(email => {
    if (hostCounts[email] < minCount) {
      minCount = hostCounts[email];
      selectedHost = email;
    }
  });

  return selectedHost;
}

/**
 * Crea un cliente autenticado usando Service Account con Domain-Wide Delegation
 * Permite impersonar a cualquier usuario del dominio
 */
function getAuthenticatedClient(userEmail: string) {
  try {
    let credentials;
    
    // Try to use local file first (for development/testing)
    const localFilePath = join(__dirname, '../.google-service-account.json');
    
    if (existsSync(localFilePath)) {
      // Use local file if it exists
      const fileContent = readFileSync(localFilePath, 'utf8');
      credentials = JSON.parse(fileContent);
      console.log('[Google Calendar] Using local service account file');
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      // Fallback to environment variable
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      
      // Fix private key format: replace literal \n with actual newlines
      let privateKey = credentials.private_key;
      if (typeof privateKey === 'string' && privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
        credentials.private_key = privateKey;
      }
      console.log('[Google Calendar] Using environment variable');
    } else {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not found in environment or local file');
    }

    // Validate that private key has proper format
    if (!credentials.private_key.startsWith('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('Invalid private key format. Key must start with "-----BEGIN PRIVATE KEY-----"');
    }

    // Create JWT client with domain-wide delegation
    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      subject: userEmail, // Impersonate this user
    });

    return jwtClient;
  } catch (error: any) {
    console.error('Error creating authenticated client:', error);
    throw new Error(`Failed to create authenticated client: ${error.message}`);
  }
}

/**
 * Crea un evento en Google Calendar con Google Meet
 */
export async function createCalendarEvent(params: {
  hostEmail: string;
  summary: string;
  description: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  attendees: string[]; // Lista de emails de asistentes
  includeGoogleMeet: boolean;
}) {
  const { hostEmail, summary, description, startDateTime, endDateTime, attendees, includeGoogleMeet } = params;

  try {
    // Obtener cliente autenticado impersonando al host
    const auth = getAuthenticatedClient(hostEmail);
    const calendar = google.calendar({ version: 'v3', auth });

    // Crear evento
    const event: any = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Madrid',
      },
      attendees: attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    };

    // Añadir Google Meet si es necesario
    if (includeGoogleMeet) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      };
    }

    // Crear evento en el calendario
    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: includeGoogleMeet ? 1 : 0,
      sendUpdates: 'all', // Enviar invitaciones por email
      requestBody: event,
    });

    const createdEvent = response.data;

    return {
      eventId: createdEvent.id!,
      meetLink: createdEvent.conferenceData?.entryPoints?.[0]?.uri || null,
      htmlLink: createdEvent.htmlLink!,
    };
  } catch (error: any) {
    console.error('Error creating calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}

/**
 * Cancela un evento en Google Calendar
 */
export async function cancelCalendarEvent(hostEmail: string, eventId: string) {
  try {
    const auth = getAuthenticatedClient(hostEmail);
    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all', // Notificar a los asistentes
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error canceling calendar event:', error);
    throw new Error(`Failed to cancel calendar event: ${error.message}`);
  }
}

/**
 * Obtiene la lista de miembros del equipo
 */
export function getTeamMembers(): string[] {
  return [...FQT_TEAM_EMAILS];
}

/**
 * Transfiere un evento de calendario de un anfitrión a otro
 * Mantiene el mismo enlace de Google Meet
 */
export async function transferCalendarEvent(params: {
  eventId: string;
  currentHostEmail: string;
  newHostEmail: string;
}): Promise<{ success: boolean; newEventId?: string; error?: string }> {
  try {
    const { eventId, currentHostEmail, newHostEmail } = params;

    // Obtener cliente autenticado para el host actual
    const currentAuth = getAuthenticatedClient(currentHostEmail);
    const currentCalendar = google.calendar({ version: 'v3', auth: currentAuth });

    // Obtener el evento del calendario del host actual
    const eventResponse = await currentCalendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const event = eventResponse.data;

    if (!event) {
      return {
        success: false,
        error: 'Evento no encontrado',
      };
    }

    // Obtener cliente autenticado para el nuevo host
    const newAuth = getAuthenticatedClient(newHostEmail);
    const newCalendar = google.calendar({ version: 'v3', auth: newAuth });

    // Crear una copia del evento en el calendario del nuevo host
    // Esto mantiene el mismo enlace de Meet si existe
    const newEvent = await newCalendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees,
        conferenceData: event.conferenceData, // Preserva el enlace de Meet
        reminders: event.reminders,
      },
      conferenceDataVersion: event.conferenceData ? 1 : 0,
      sendUpdates: 'all', // Notificar a los asistentes del cambio
    });

    // Eliminar el evento del calendario del host anterior
    await currentCalendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'none', // No notificar de la eliminación, ya se notificó del nuevo evento
    });

    console.log(`[Google Calendar] Evento transferido de ${currentHostEmail} a ${newHostEmail}`);
    console.log(`[Google Calendar] Nuevo ID de evento: ${newEvent.data.id}`);

    return {
      success: true,
      newEventId: newEvent.data.id!,
    };
  } catch (error: any) {
    console.error('[Google Calendar] Error transfiriendo evento:', error);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
}
