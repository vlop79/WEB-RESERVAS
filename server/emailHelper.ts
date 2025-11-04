import { getDb } from "./db";
import { bookings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Helper para enviar recordatorios de reservas
 */
export async function sendBookingReminderEmail(
  bookingId: number,
  reminderType: "24h" | "2h"
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Obtener detalles de la reserva
  const booking = await db.query.bookings.findFirst({
    where: eq(bookings.id, bookingId),
  });

  if (!booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  // TODO: Implementar envío de email usando el servicio de email
  // Por ahora solo log
  console.log(`[EmailHelper] Would send ${reminderType} reminder for booking ${bookingId}`);
  console.log(`[EmailHelper] Volunteer: ${booking.volunteerEmail}`);
  console.log(`[EmailHelper] Start time: ${booking.startTime}`);
}
