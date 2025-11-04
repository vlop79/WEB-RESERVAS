import { createEvent, EventAttributes } from "ics";

/**
 * Genera un archivo .ics para añadir una reserva al calendario
 */
export function generateICSFile(booking: {
  volunteerName: string;
  volunteerEmail: string;
  companyName: string;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  hostName?: string;
  hostEmail?: string;
  meetLink?: string;
}): { error: Error | undefined; value: string | undefined } {
  const event: EventAttributes = {
    start: [
      booking.startTime.getFullYear(),
      booking.startTime.getMonth() + 1,
      booking.startTime.getDate(),
      booking.startTime.getHours(),
      booking.startTime.getMinutes(),
    ],
    end: [
      booking.endTime.getFullYear(),
      booking.endTime.getMonth() + 1,
      booking.endTime.getDate(),
      booking.endTime.getHours(),
      booking.endTime.getMinutes(),
    ],
    title: `${booking.serviceName} - ${booking.companyName}`,
    description: `Sesión de ${booking.serviceName} con ${booking.companyName}\\n\\nAnfitrión: ${booking.hostName || "Por asignar"}\\nEmail: ${booking.hostEmail || ""}${booking.meetLink ? `\\n\\nLink de reunión: ${booking.meetLink}` : ""}`,
    location: booking.meetLink || "Por confirmar",
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: {
      name: booking.hostName || "Fundación Quiero Trabajo",
      email: booking.hostEmail || "info@quierotrabajo.org",
    },
    attendees: [
      {
        name: booking.volunteerName,
        email: booking.volunteerEmail,
        rsvp: true,
        partstat: "ACCEPTED",
        role: "REQ-PARTICIPANT",
      },
    ],
  };

  return createEvent(event);
}

/**
 * Genera el nombre del archivo .ics
 */
export function generateICSFileName(companyName: string, date: Date): string {
  const dateStr = date.toISOString().split("T")[0];
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `reserva-${slug}-${dateStr}.ics`;
}
