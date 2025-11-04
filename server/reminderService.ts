import cron from "node-cron";
import { getDb } from "./db";
import { bookings, users } from "../drizzle/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { sendBookingReminderEmail } from "./emailHelper";

/**
 * Servicio de recordatorios automáticos
 * Envía emails 24h y 2h antes de las sesiones programadas
 */

// Verificar si los recordatorios están habilitados
async function isReminderEnabled(type: "24h" | "2h"): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const notificationType = type === "24h" ? "reminder_24h" : "reminder_2h";
  const result = await db.query.emailNotificationSettings.findFirst({
    where: (settings, { eq }) => eq(settings.notificationType, notificationType),
  });

  return result?.enabled === 1;
}

// Enviar recordatorios 24h antes
async function send24hReminders() {
  console.log("[Reminders] Checking for 24h reminders...");
  
  if (!(await isReminderEnabled("24h"))) {
    console.log("[Reminders] 24h reminders are disabled");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Reminders] Database not available");
    return;
  }

  try {
    // Buscar reservas que sean mañana (entre 23h y 25h desde ahora)
    const now = new Date();
    const tomorrow23h = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const tomorrow25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    const upcomingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "confirmed"),
          gte(bookings.startTime, tomorrow23h),
          lte(bookings.startTime, tomorrow25h)
        )
      );

    console.log(`[Reminders] Found ${upcomingBookings.length} bookings for 24h reminders`);

    for (const booking of upcomingBookings) {
      try {
        await sendBookingReminderEmail(booking.id, "24h");
        console.log(`[Reminders] Sent 24h reminder for booking ${booking.id}`);
      } catch (error) {
        console.error(`[Reminders] Error sending 24h reminder for booking ${booking.id}:`, error);
      }
    }
  } catch (error) {
    console.error("[Reminders] Error in send24hReminders:", error);
  }
}

// Enviar recordatorios 2h antes
async function send2hReminders() {
  console.log("[Reminders] Checking for 2h reminders...");
  
  if (!(await isReminderEnabled("2h"))) {
    console.log("[Reminders] 2h reminders are disabled");
    return;
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Reminders] Database not available");
    return;
  }

  try {
    // Buscar reservas que sean en 2 horas (entre 1h 50min y 2h 10min desde ahora)
    const now = new Date();
    const in1h50m = new Date(now.getTime() + 110 * 60 * 1000);
    const in2h10m = new Date(now.getTime() + 130 * 60 * 1000);

    const upcomingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.status, "confirmed"),
          gte(bookings.startTime, in1h50m),
          lte(bookings.startTime, in2h10m)
        )
      );

    console.log(`[Reminders] Found ${upcomingBookings.length} bookings for 2h reminders`);

    for (const booking of upcomingBookings) {
      try {
        await sendBookingReminderEmail(booking.id, "2h");
        console.log(`[Reminders] Sent 2h reminder for booking ${booking.id}`);
      } catch (error) {
        console.error(`[Reminders] Error sending 2h reminder for booking ${booking.id}:`, error);
      }
    }
  } catch (error) {
    console.error("[Reminders] Error in send2hReminders:", error);
  }
}

/**
 * Inicializar cron jobs para recordatorios
 */
export function initializeReminderService() {
  // Ejecutar cada hora para recordatorios de 24h
  cron.schedule("0 * * * *", send24hReminders);
  console.log("[Reminders] 24h reminder cron job initialized (runs every hour)");

  // Ejecutar cada 30 minutos para recordatorios de 2h
  cron.schedule("*/30 * * * *", send2hReminders);
  console.log("[Reminders] 2h reminder cron job initialized (runs every 30 minutes)");
}
