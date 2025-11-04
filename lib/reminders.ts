/**
 * Sistema de recordatorios automáticos para sesiones de voluntariado
 * 
 * Este módulo proporciona funciones para enviar recordatorios por email
 * a voluntarios y anfitriones antes de sus sesiones programadas.
 * 
 * Uso recomendado:
 * - Configurar cron job para ejecutar send24HourReminders() diariamente
 * - Configurar cron job para ejecutar send2HourReminders() cada 2 horas
 */

import { getDb } from "../server/db";
import { eq, and, gte, lte, ne } from "drizzle-orm";
import { bookings, slots, companies, serviceTypes } from "../drizzle/schema";

interface ReminderBooking {
  bookingId: number;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone: string | null;
  hostEmail: string | null;
  companyName: string;
  serviceName: string;
  serviceModality: string;
  date: string;
  startTime: string;
  endTime: string;
  oficina: string | null;
  googleMeetLink: string | null;
}

/**
 * Get bookings that need 24-hour reminders
 * Returns bookings scheduled for tomorrow
 */
async function getBookingsFor24HourReminder(): Promise<ReminderBooking[]> {
  const db = await getDb();
  if (!db) return [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const results = await db
    .select({
      bookingId: bookings.id,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      volunteerPhone: bookings.volunteerPhone,
      hostEmail: bookings.hostEmail,
      companyName: companies.name,
      serviceName: serviceTypes.name,
      serviceModality: serviceTypes.modality,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      oficina: bookings.oficina,
      googleMeetLink: bookings.googleMeetLink,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .innerJoin(companies, eq(bookings.companyId, companies.id))
    .innerJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .where(
      and(
        eq(slots.date, tomorrowStr),
        ne(bookings.status, "cancelled")
      )
    );

  return results;
}

/**
 * Get bookings that need 2-hour reminders
 * Returns bookings scheduled for 2 hours from now
 */
async function getBookingsFor2HourReminder(): Promise<ReminderBooking[]> {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const todayStr = now.toISOString().split('T')[0];
  const twoHoursStr = twoHoursLater.toISOString().split('T')[1].substring(0, 5); // HH:MM
  const threeHoursStr = threeHoursLater.toISOString().split('T')[1].substring(0, 5);

  const results = await db
    .select({
      bookingId: bookings.id,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      volunteerPhone: bookings.volunteerPhone,
      hostEmail: bookings.hostEmail,
      companyName: companies.name,
      serviceName: serviceTypes.name,
      serviceModality: serviceTypes.modality,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      oficina: bookings.oficina,
      googleMeetLink: bookings.googleMeetLink,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .innerJoin(companies, eq(bookings.companyId, companies.id))
    .innerJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .where(
      and(
        eq(slots.date, todayStr),
        gte(slots.startTime, twoHoursStr),
        lte(slots.startTime, threeHoursStr),
        ne(bookings.status, "cancelled")
      )
    );

  return results;
}

/**
 * Send 24-hour reminder email to volunteer
 */
async function send24HourReminderToVolunteer(booking: ReminderBooking): Promise<boolean> {
  try {
    const { sendNotification } = await import("../server/_core/notification");
    
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let locationInfo = '';
    if (booking.serviceModality === 'virtual' && booking.googleMeetLink) {
      locationInfo = `\n\n**Enlace de la reunión:**\n${booking.googleMeetLink}`;
    } else if (booking.oficina) {
      locationInfo = `\n\n**Ubicación:**\nOficina de ${booking.oficina}`;
    }

    const content = `Hola ${booking.volunteerName},

Te recordamos que mañana tienes tu sesión de ${booking.serviceName} con ${booking.companyName}.

**Detalles de la sesión:**
- Fecha: ${formattedDate}
- Hora: ${booking.startTime} - ${booking.endTime}
- Modalidad: ${booking.serviceModality === 'virtual' ? 'Virtual' : 'Presencial'}${locationInfo}

${booking.hostEmail ? `Tu anfitrión será: ${booking.hostEmail}` : ''}

¡Te esperamos!

Fundación Quiero Trabajo`;

    await sendNotification({
      to: booking.volunteerEmail,
      title: `Recordatorio: Sesión mañana con ${booking.companyName}`,
      content,
    });

    return true;
  } catch (error) {
    console.error(`Failed to send 24h reminder to ${booking.volunteerEmail}:`, error);
    return false;
  }
}

/**
 * Send 2-hour reminder email to volunteer and host
 */
async function send2HourReminderToVolunteer(booking: ReminderBooking): Promise<boolean> {
  try {
    const { sendNotification } = await import("../server/_core/notification");

    let locationInfo = '';
    if (booking.serviceModality === 'virtual' && booking.googleMeetLink) {
      locationInfo = `\n\n**Enlace de la reunión:**\n${booking.googleMeetLink}\n\n*Por favor, únete unos minutos antes.*`;
    } else if (booking.oficina) {
      locationInfo = `\n\n**Ubicación:**\nOficina de ${booking.oficina}\n\n*Por favor, llega unos minutos antes.*`;
    }

    const content = `Hola ${booking.volunteerName},

Tu sesión de ${booking.serviceName} con ${booking.companyName} comienza en aproximadamente 2 horas.

**Detalles:**
- Hora: ${booking.startTime} - ${booking.endTime}
- Modalidad: ${booking.serviceModality === 'virtual' ? 'Virtual' : 'Presencial'}${locationInfo}

¡Nos vemos pronto!

Fundación Quiero Trabajo`;

    await sendNotification({
      to: booking.volunteerEmail,
      title: `⏰ Tu sesión comienza en 2 horas - ${booking.companyName}`,
      content,
    });

    return true;
  } catch (error) {
    console.error(`Failed to send 2h reminder to ${booking.volunteerEmail}:`, error);
    return false;
  }
}

/**
 * Send 2-hour reminder email to host
 */
async function send2HourReminderToHost(booking: ReminderBooking): Promise<boolean> {
  if (!booking.hostEmail) return false;

  try {
    const { sendNotification } = await import("../server/_core/notification");

    let locationInfo = '';
    if (booking.serviceModality === 'virtual' && booking.googleMeetLink) {
      locationInfo = `\n\n**Enlace de la reunión:**\n${booking.googleMeetLink}`;
    } else if (booking.oficina) {
      locationInfo = `\n\n**Ubicación:**\nOficina de ${booking.oficina}`;
    }

    const content = `Hola,

Te recordamos que tienes una sesión de ${booking.serviceName} en aproximadamente 2 horas.

**Detalles de la sesión:**
- Empresa: ${booking.companyName}
- Hora: ${booking.startTime} - ${booking.endTime}
- Modalidad: ${booking.serviceModality === 'virtual' ? 'Virtual' : 'Presencial'}${locationInfo}

**Voluntario:**
- Nombre: ${booking.volunteerName}
- Email: ${booking.volunteerEmail}
${booking.volunteerPhone ? `- Teléfono: ${booking.volunteerPhone}` : ''}

¡Gracias por tu colaboración!

Fundación Quiero Trabajo`;

    await sendNotification({
      to: booking.hostEmail,
      title: `⏰ Sesión en 2 horas - ${booking.companyName}`,
      content,
    });

    return true;
  } catch (error) {
    console.error(`Failed to send 2h reminder to host ${booking.hostEmail}:`, error);
    return false;
  }
}

/**
 * Main function to send all 24-hour reminders
 * Should be called once per day (recommended: 9:00 AM)
 */
export async function send24HourReminders(): Promise<{ sent: number; failed: number }> {
  console.log('[Reminders] Starting 24-hour reminder job...');
  
  const bookingsToRemind = await getBookingsFor24HourReminder();
  console.log(`[Reminders] Found ${bookingsToRemind.length} bookings for 24h reminders`);

  let sent = 0;
  let failed = 0;

  for (const booking of bookingsToRemind) {
    const success = await send24HourReminderToVolunteer(booking);
    if (success) {
      sent++;
    } else {
      failed++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`[Reminders] 24h reminders complete: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

/**
 * Main function to send all 2-hour reminders
 * Should be called every 2 hours
 */
export async function send2HourReminders(): Promise<{ sent: number; failed: number }> {
  console.log('[Reminders] Starting 2-hour reminder job...');
  
  const bookingsToRemind = await getBookingsFor2HourReminder();
  console.log(`[Reminders] Found ${bookingsToRemind.length} bookings for 2h reminders`);

  let sent = 0;
  let failed = 0;

  for (const booking of bookingsToRemind) {
    // Send to volunteer
    const volunteerSuccess = await send2HourReminderToVolunteer(booking);
    if (volunteerSuccess) sent++;
    else failed++;
    
    // Send to host
    const hostSuccess = await send2HourReminderToHost(booking);
    if (hostSuccess) sent++;
    else if (booking.hostEmail) failed++;
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`[Reminders] 2h reminders complete: ${sent} sent, ${failed} failed`);
  return { sent, failed };
}

/**
 * Manual trigger endpoint for testing
 * Can be called from admin panel or via API
 */
export async function triggerRemindersManually(type: '24h' | '2h'): Promise<{ sent: number; failed: number }> {
  if (type === '24h') {
    return send24HourReminders();
  } else {
    return send2HourReminders();
  }
}
