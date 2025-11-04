import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { volunteers, volunteerSessions, badges, certificates, InsertVolunteer, Volunteer } from "../drizzle/schema";
import bcrypt from "bcryptjs";

/**
 * Crear un nuevo voluntario con contraseña hasheada
 */
export async function createVolunteer(data: Omit<InsertVolunteer, "password"> & { password: string }): Promise<Volunteer | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = await db.insert(volunteers).values({
      ...data,
      password: hashedPassword,
    });

    // Get the created volunteer
    const volunteerId = Number(result[0].insertId);
    const volunteer = await getVolunteerById(volunteerId);
    
    return volunteer;
  } catch (error) {
    console.error("[volunteer-db] Error creating volunteer:", error);
    return null;
  }
}

/**
 * Obtener voluntario por email
 */
export async function getVolunteerByEmail(email: string): Promise<Volunteer | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(volunteers).where(eq(volunteers.email, email)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[volunteer-db] Error getting volunteer by email:", error);
    return null;
  }
}

/**
 * Obtener voluntario por ID
 */
export async function getVolunteerById(id: number): Promise<Volunteer | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(volunteers).where(eq(volunteers.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[volunteer-db] Error getting volunteer by id:", error);
    return null;
  }
}

/**
 * Verificar contraseña de voluntario
 */
export async function verifyVolunteerPassword(email: string, password: string): Promise<Volunteer | null> {
  const volunteer = await getVolunteerByEmail(email);
  if (!volunteer || !volunteer.password) return null;

  const isValid = await bcrypt.compare(password, volunteer.password);
  return isValid ? volunteer : null;
}

/**
 * Actualizar datos de voluntario
 */
export async function updateVolunteer(id: number, data: Partial<Omit<Volunteer, "id" | "createdAt">>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.update(volunteers).set(data).where(eq(volunteers.id, id));
    return true;
  } catch (error) {
    console.error("[volunteer-db] Error updating volunteer:", error);
    return false;
  }
}

/**
 * Actualizar último login
 */
export async function updateLastLogin(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.update(volunteers).set({ lastLoginAt: new Date() }).where(eq(volunteers.id, id));
  } catch (error) {
    console.error("[volunteer-db] Error updating last login:", error);
  }
}

/**
 * Obtener sesiones de un voluntario
 */
export async function getVolunteerSessions(volunteerId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(volunteerSessions).where(eq(volunteerSessions.volunteerId, volunteerId));
  } catch (error) {
    console.error("[volunteer-db] Error getting volunteer sessions:", error);
    return [];
  }
}

/**
 * Obtener badges de un voluntario
 */
export async function getVolunteerBadges(volunteerId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(badges).where(eq(badges.volunteerId, volunteerId));
  } catch (error) {
    console.error("[volunteer-db] Error getting volunteer badges:", error);
    return [];
  }
}

/**
 * Obtener certificados de un voluntario
 */
export async function getVolunteerCertificates(volunteerId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(certificates).where(eq(certificates.volunteerId, volunteerId));
  } catch (error) {
    console.error("[volunteer-db] Error getting volunteer certificates:", error);
    return [];
  }
}

/**
 * Contar sesiones totales de un voluntario
 */
export async function countVolunteerSessions(volunteerId: number): Promise<number> {
  const sessions = await getVolunteerSessions(volunteerId);
  return sessions.length;
}

// ==================== Resource Downloads ====================

import { resourceDownloads } from "../drizzle/schema";
import { desc, sql } from "drizzle-orm";

export async function trackResourceDownload(data: {
  resourceId: string;
  resourceName: string;
  volunteerId?: number;
  volunteerEmail?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  const [result] = await db.insert(resourceDownloads).values(data);
  return result;
}

export async function getResourceDownloadStats() {
  const db = await getDb();
  if (!db) return [];

  const stats = await db
    .select({
      resourceId: resourceDownloads.resourceId,
      resourceName: resourceDownloads.resourceName,
      downloadCount: sql<number>`COUNT(*)`.as('downloadCount'),
    })
    .from(resourceDownloads)
    .groupBy(resourceDownloads.resourceId, resourceDownloads.resourceName)
    .orderBy(sql`COUNT(*) DESC`);

  return stats;
}

export async function getResourceDownloadHistory(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  const history = await db
    .select()
    .from(resourceDownloads)
    .orderBy(desc(resourceDownloads.downloadedAt))
    .limit(limit);

  return history;
}

export async function updateVolunteerPhoto(volunteerId: number, photoUrl: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(volunteers)
    .set({ photoUrl, updatedAt: new Date() })
    .where(eq(volunteers.id, volunteerId));
}
