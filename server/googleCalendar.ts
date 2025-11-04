import { google } from 'googleapis';

// Initialize Google Calendar API with service account
function getCalendarClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}');
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });

  return google.calendar({ version: 'v3', auth });
}

interface CreateEventParams {
  summary: string;
  description: string;
  startDateTime: string; // ISO 8601 format
  endDateTime: string; // ISO 8601 format
  attendeeEmail: string;
  location?: string;
  createMeetLink?: boolean; // For virtual sessions
}

/**
 * Create a Google Calendar event and optionally generate a Meet link
 */
export async function createCalendarEvent(params: CreateEventParams) {
  try {
    const calendar = getCalendarClient();
    
    const event: any = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime,
        timeZone: 'Europe/Madrid',
      },
      end: {
        dateTime: params.endDateTime,
        timeZone: 'Europe/Madrid',
      },
      attendees: [
        { email: params.attendeeEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    // Add location if provided (for presencial sessions)
    if (params.location) {
      event.location = params.location;
    }

    // Add Meet link if requested (for virtual sessions)
    if (params.createMeetLink) {
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: params.createMeetLink ? 1 : 0,
      sendUpdates: 'all', // Send email invitations to attendees
    });

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      meetLink: response.data.conferenceData?.entryPoints?.find(
        (ep) => ep.entryPointType === 'video'
      )?.uri,
    };
  } catch (error: any) {
    console.error('[Google Calendar] Error creating event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete a Google Calendar event
 */
export async function deleteCalendarEvent(eventId: string) {
  try {
    const calendar = getCalendarClient();
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: 'all', // Notify attendees
    });

    return { success: true };
  } catch (error: any) {
    console.error('[Google Calendar] Error deleting event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}
