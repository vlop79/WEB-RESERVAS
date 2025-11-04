import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Elimina un evento de Google Calendar
 */
export async function deleteCalendarEvent(params: {
  eventId: string;
  hostEmail: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { eventId, hostEmail } = params;

    // Load service account credentials
    const serviceAccountPath = join(process.cwd(), '.google-service-account.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

    // Create OAuth2 client with domain-wide delegation
    const auth = new google.auth.JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      subject: hostEmail, // Impersonate the host
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Delete the event
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    console.log(`[Google Calendar] Event deleted: ${eventId} from ${hostEmail}'s calendar`);
    
    return { success: true };
  } catch (error: any) {
    console.error('[Google Calendar] Failed to delete event:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}
