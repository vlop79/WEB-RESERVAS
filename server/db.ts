import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get user by email (for password login)
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Verify password for a user
 */
export async function verifyPassword(email: string, password: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  if (!user || !user.password) {
    return false;
  }

  return await bcrypt.compare(password, user.password);
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Create or update a user with password (for team members)
 */
export async function createOrUpdatePasswordUser(data: {
  email: string;
  name: string;
  password?: string; // Optional: only hash if provided
  role?: "user" | "admin" | "empresa";
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const existingUser = await getUserByEmail(data.email);
  
  if (existingUser) {
    // Update existing user
    const updateData: any = {
      name: data.name,
      updatedAt: new Date(),
    };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (data.role) {
      updateData.role = data.role;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.email, data.email));
  } else {
    // Create new user
    const insertData: any = {
      email: data.email,
      name: data.name,
      loginMethod: "password",
      role: data.role || "user",
      lastSignedIn: new Date(),
    };

    if (data.password) {
      insertData.password = await hashPassword(data.password);
    }

    await db.insert(users).values(insertData);
  }
}

// === COMPANIES ===
export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];
  const { companies } = await import("../drizzle/schema");
  return db.select().from(companies).orderBy(companies.name);
}

export async function getActiveCompanies() {
  const db = await getDb();
  if (!db) return [];
  const { companies } = await import("../drizzle/schema");
  return db.select().from(companies).where(eq(companies.active, 1)).orderBy(companies.name);
}

export async function getCompanyBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { companies } = await import("../drizzle/schema");
  const result = await db.select().from(companies).where(eq(companies.slug, slug)).limit(1);
  return result[0];
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { companies } = await import("../drizzle/schema");
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0];
}

export async function createCompany(data: { name: string; slug: string; logoUrl?: string; assignedDay?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { companies } = await import("../drizzle/schema");
  const result = await db.insert(companies).values(data);
  return result;
}

export async function updateCompany(id: number, data: Partial<{ name: string; slug: string; logoUrl: string; assignedDay: string; active: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { companies } = await import("../drizzle/schema");
  await db.update(companies).set(data).where(eq(companies.id, id));
}

// === SERVICE TYPES ===
export async function getAllServiceTypes() {
  const db = await getDb();
  if (!db) return [];
  const { serviceTypes } = await import("../drizzle/schema");
  return db.select().from(serviceTypes);
}

export async function getServiceTypeBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { serviceTypes } = await import("../drizzle/schema");
  const result = await db.select().from(serviceTypes).where(eq(serviceTypes.slug, slug)).limit(1);
  return result[0];
}

export async function getServiceTypeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { serviceTypes } = await import("../drizzle/schema");
  const result = await db.select().from(serviceTypes).where(eq(serviceTypes.id, id)).limit(1);
  return result[0];
}

// === SLOTS ===
export async function getAvailableSlots(companyId: number, serviceTypeId: number, fromDate: string) {
  const db = await getDb();
  if (!db) return [];
  const { slots } = await import("../drizzle/schema");
  const { and, gte, sql } = await import("drizzle-orm");
  
  return db.select().from(slots).where(
    and(
      eq(slots.companyId, companyId),
      eq(slots.serviceTypeId, serviceTypeId),
      eq(slots.active, 1),
      gte(slots.date, fromDate),
      sql`${slots.currentVolunteers} < ${slots.maxVolunteers}`
    )
  ).orderBy(slots.date, slots.startTime);
}

export async function getSlotById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { slots } = await import("../drizzle/schema");
  const result = await db.select().from(slots).where(eq(slots.id, id)).limit(1);
  return result[0];
}

export async function createSlot(data: {
  companyId: number;
  serviceTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxVolunteers: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  const result = await db.insert(slots).values({ ...data, currentVolunteers: 0, active: 1 });
  return result;
}

export async function incrementSlotVolunteers(slotId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  const { sql } = await import("drizzle-orm");
  
  await db.update(slots)
    .set({ currentVolunteers: sql`${slots.currentVolunteers} + 1` })
    .where(eq(slots.id, slotId));
}

export async function decrementSlotVolunteers(slotId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  const { sql } = await import("drizzle-orm");
  
  await db.update(slots)
    .set({ currentVolunteers: sql`${slots.currentVolunteers} - 1` })
    .where(eq(slots.id, slotId));
}

export async function bulkCreateSlots(slotsData: Array<{
  companyId: number;
  serviceTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  maxVolunteers: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  
  const values = slotsData.map(slot => ({ ...slot, currentVolunteers: 0, active: 1 }));
  await db.insert(slots).values(values);
}

// === BOOKINGS ===
export async function createBooking(data: {
  slotId: number;
  companyId: number;
  serviceTypeId: number;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone?: string;
  hostEmail?: string;
  googleCalendarEventId?: string | null;
  googleMeetLink?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings } = await import("../drizzle/schema");
  
  const result = await db.insert(bookings).values({
    ...data,
    status: "confirmed",
  });
  
  return result;
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { bookings } = await import("../drizzle/schema");
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0];
}

export async function updateBooking(id: number, data: Partial<{
  status: "confirmed" | "cancelled";
  googleCalendarEventId: string;
  googleMeetLink: string;
  zohoRecordId: string;
  hostEmail: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings } = await import("../drizzle/schema");
  await db.update(bookings).set(data).where(eq(bookings.id, id));
}

export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];
  const { bookings, companies, serviceTypes, slots } = await import("../drizzle/schema");
  
  return db
    .select({
      id: bookings.id,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      volunteerPhone: bookings.volunteerPhone,
      status: bookings.status,
      googleMeetLink: bookings.googleMeetLink,
      createdAt: bookings.createdAt,
      companyName: companies.name,
      serviceName: serviceTypes.name,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
    })
    .from(bookings)
    .leftJoin(companies, eq(bookings.companyId, companies.id))
    .leftJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .leftJoin(slots, eq(bookings.slotId, slots.id))
    .orderBy(slots.date, slots.startTime);
}

// === ADDITIONAL SLOT FUNCTIONS ===
export async function getAllSlots() {
  const db = await getDb();
  if (!db) return [];
  const { slots, companies, serviceTypes } = await import("../drizzle/schema");
  
  return db
    .select({
      id: slots.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      maxVolunteers: slots.maxVolunteers,
      currentVolunteers: slots.currentVolunteers,
      active: slots.active,
      companyId: slots.companyId,
      serviceTypeId: slots.serviceTypeId,
      companyName: companies.name,
      serviceName: serviceTypes.name,
    })
    .from(slots)
    .leftJoin(companies, eq(slots.companyId, companies.id))
    .leftJoin(serviceTypes, eq(slots.serviceTypeId, serviceTypes.id))
    .orderBy(slots.date, slots.startTime);
}

export async function updateSlot(id: number, data: Partial<{
  date: string;
  startTime: string;
  endTime: string;
  maxVolunteers: number;
  active: number;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  await db.update(slots).set(data).where(eq(slots.id, id));
}

export async function deleteSlot(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { slots } = await import("../drizzle/schema");
  await db.delete(slots).where(eq(slots.id, id));
}

export async function cancelBooking(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { bookings } = await import("../drizzle/schema");
  
  // Get booking to decrement slot
  const booking = await getBookingById(id);
  if (booking) {
    await decrementSlotVolunteers(booking.slotId);
  }
  
  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, id));
}

// === ADVANCED BOOKING QUERIES ===
export async function getBookingsWithDetails() {
  const db = await getDb();
  if (!db) return [];
  const { bookings, companies, serviceTypes, slots } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  
  return db
    .select({
      id: bookings.id,
      slotId: bookings.slotId,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      volunteerPhone: bookings.volunteerPhone,
      status: bookings.status,
      googleMeetLink: bookings.googleMeetLink,
      googleCalendarEventId: bookings.googleCalendarEventId,
      zohoRecordId: bookings.zohoRecordId,
      createdAt: bookings.createdAt,
      companyId: companies.id,
      companyName: companies.name,
      companySlug: companies.slug,
      serviceTypeId: serviceTypes.id,
      serviceName: serviceTypes.name,
      serviceSlug: serviceTypes.slug,
      serviceModality: serviceTypes.modality,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      hostEmail: bookings.hostEmail,
      oficina: bookings.oficina,
    })
    .from(bookings)
    .leftJoin(companies, eq(bookings.companyId, companies.id))
    .leftJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .leftJoin(slots, eq(bookings.slotId, slots.id))
    .orderBy(desc(bookings.createdAt));
}

export async function getBookingsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  const { bookings, serviceTypes, slots } = await import("../drizzle/schema");
  
  return db
    .select({
      id: bookings.id,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      status: bookings.status,
      serviceName: serviceTypes.name,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
    })
    .from(bookings)
    .leftJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .leftJoin(slots, eq(bookings.slotId, slots.id))
    .where(eq(bookings.companyId, companyId))
    .orderBy(slots.date, slots.startTime);
}

export async function getBookingsByDateRange(startDate: string, endDate: string) {
  const db = await getDb();
  if (!db) return [];
  const { bookings, companies, serviceTypes, slots } = await import("../drizzle/schema");
  const { and, gte, lte } = await import("drizzle-orm");
  
  return db
    .select({
      id: bookings.id,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      status: bookings.status,
      companyName: companies.name,
      serviceName: serviceTypes.name,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
    })
    .from(bookings)
    .leftJoin(companies, eq(bookings.companyId, companies.id))
    .leftJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .leftJoin(slots, eq(bookings.slotId, slots.id))
    .where(
      and(
        gte(slots.date, startDate),
        lte(slots.date, endDate)
      )
    )
    .orderBy(slots.date, slots.startTime);
}

export async function getBookingStats() {
  const db = await getDb();
  if (!db) return { 
    total: 0, 
    confirmed: 0, 
    cancelled: 0, 
    byCompany: [], 
    byService: [], 
    byOficina: [],
    byHost: [],
  };
  const { bookings, companies, serviceTypes } = await import("../drizzle/schema");
  const { sql, count } = await import("drizzle-orm");
  
  // Total bookings
  const totalResult = await db.select({ count: count() }).from(bookings);
  const total = totalResult[0]?.count || 0;
  
  // By status
  const confirmedResult = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, "confirmed"));
  const confirmed = confirmedResult[0]?.count || 0;
  
  const cancelledResult = await db.select({ count: count() }).from(bookings).where(eq(bookings.status, "cancelled"));
  const cancelled = cancelledResult[0]?.count || 0;
  
  // By company (top 10)
  const { desc } = await import("drizzle-orm");
  const countAlias = count();
  const byCompany = await db
    .select({
      companyName: companies.name,
      count: countAlias,
    })
    .from(bookings)
    .leftJoin(companies, eq(bookings.companyId, companies.id))
    .groupBy(companies.id, companies.name)
    .orderBy(desc(countAlias))
    .limit(10);
  
  // By service
  const byService = await db
    .select({
      serviceName: serviceTypes.name,
      count: count(),
    })
    .from(bookings)
    .leftJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .groupBy(serviceTypes.id);
  
  // By oficina
  const byOficina = await db
    .select({
      oficina: bookings.oficina,
      count: count(),
    })
    .from(bookings)
    .where(sql`${bookings.oficina} IS NOT NULL`)
    .groupBy(bookings.oficina);
  
  // By host
  const byHost = await db
    .select({
      hostEmail: bookings.hostEmail,
      count: count(),
    })
    .from(bookings)
    .where(sql`${bookings.hostEmail} IS NOT NULL`)
    .groupBy(bookings.hostEmail);
  
  return {
    total,
    confirmed,
    cancelled,
    byCompany,
    byService,
    byOficina,
    byHost,
  };
}

export async function getSlotsByCompanyAndDate(companyId: number, date: string) {
  const db = await getDb();
  if (!db) return [];
  const { slots, serviceTypes } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  
  return db
    .select({
      id: slots.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      maxVolunteers: slots.maxVolunteers,
      currentVolunteers: slots.currentVolunteers,
      active: slots.active,
      serviceName: serviceTypes.name,
      serviceSlug: serviceTypes.slug,
    })
    .from(slots)
    .leftJoin(serviceTypes, eq(slots.serviceTypeId, serviceTypes.id))
    .where(
      and(
        eq(slots.companyId, companyId),
        eq(slots.date, date)
      )
    )
    .orderBy(slots.startTime);
}

// === USER MANAGEMENT ===

export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users);
  return result;
}

export async function createUser(data: { openId: string; name?: string; email?: string; role?: "admin" | "user" | "empresa"; password?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Hash password if provided
  let hashedPassword: string | undefined;
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10);
  }
  
  const result = await db.insert(users).values({
    openId: data.openId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "user",
  });
  return result;
}

export async function updateUser(userId: number, data: Partial<{ role: "admin" | "user" | "empresa" }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set(data).where(eq(users.id, userId));
}

export async function updateUserRole(userId: number, role: "admin" | "user" | "empresa") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0];
}

/**
 * Update company user details (name, email, company assignment)
 */
export async function updateCompanyUser(userId: number, data: { name?: string; email?: string; companyId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if email is being changed and if it's already in use
  if (data.email) {
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0 && existingUser[0].id !== userId) {
      throw new Error("Email already in use by another user");
    }
  }
  
  const updateData: any = {
    ...data,
    updatedAt: new Date(),
  };
  
  await db.update(users).set(updateData).where(eq(users.id, userId));
}

/**
 * Update company user password
 */
export async function updateCompanyUserPassword(userId: number, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await db.update(users).set({ 
    password: hashedPassword,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Get count of bookings for a user (to check before deletion)
 */
export async function getUserBookingsCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const { bookings } = await import("../drizzle/schema");
  const { count } = await import("drizzle-orm");
  
  // Count bookings where the user is the host (hostEmail matches user email)
  const user = await getUserById(userId);
  if (!user || !user.email) return 0;
  
  const result = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.hostEmail, user.email));
  
  return result[0]?.count || 0;
}

/**
 * Delete a user from the system
 */
export async function deleteUser(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { companyUsers } = await import("../drizzle/schema");
  
  // First delete from companyUsers table if exists
  await db.delete(companyUsers).where(eq(companyUsers.userId, userId));
  
  // Then delete the user
  await db.delete(users).where(eq(users.id, userId));
}

/**
 * Check if a volunteer has a duplicate booking (same email within 7 days of the slot date)
 */
export async function checkDuplicateBooking(volunteerEmail: string, slotId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const { bookings, slots } = await import("../drizzle/schema");
  const { and, gte, lte, ne, sql } = await import("drizzle-orm");
  
  // Get the slot date
  const slot = await getSlotById(slotId);
  if (!slot) return false;
  
  const slotDate = new Date(slot.date);
  const sevenDaysBefore = new Date(slotDate);
  sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);
  const sevenDaysAfter = new Date(slotDate);
  sevenDaysAfter.setDate(sevenDaysAfter.getDate() + 7);
  
  const beforeStr = sevenDaysBefore.toISOString().split('T')[0];
  const afterStr = sevenDaysAfter.toISOString().split('T')[0];
  
  // Check for active bookings in the date range
  const existingBookings = await db
    .select({ id: bookings.id })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .where(
      and(
        eq(bookings.volunteerEmail, volunteerEmail),
        ne(bookings.status, "cancelled"),
        gte(slots.date, beforeStr),
        lte(slots.date, afterStr)
      )
    )
    .limit(1);
  
  return existingBookings.length > 0;
}

// === COMPANY USER FUNCTIONS ===

/**
 * Get company by user ID (for company role users)
 */
export async function getCompanyByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const { companies, companyUsers } = await import("../drizzle/schema");
  
  // Get companyId from companyUsers table
  const companyUserRecord = await db
    .select()
    .from(companyUsers)
    .where(eq(companyUsers.userId, userId))
    .limit(1);
  
  if (!companyUserRecord.length) return undefined;
  
  const companyId = companyUserRecord[0].companyId;
  
  // Get company details
  const company = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);
  
  return company.length > 0 ? company[0] : undefined;
}

/**
 * Get bookings for a company with full details
 */
export async function getBookingsByCompanyIdWithDetails(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  const { bookings, serviceTypes, slots } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  return db
    .select({
      id: bookings.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      hostEmail: bookings.hostEmail,
      status: bookings.status,
      serviceSlug: serviceTypes.slug,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .innerJoin(serviceTypes, eq(slots.serviceTypeId, serviceTypes.id))
    .where(eq(slots.companyId, companyId))
    .orderBy(desc(slots.date));
}

/**
 * Get bookings for a company formatted for PDF generation
 */
export async function getBookingsByCompanyIdForPDF(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  const { bookings, serviceTypes, slots, users } = await import("../drizzle/schema");
  const { desc, eq } = await import("drizzle-orm");

  const results = await db
    .select({
      id: bookings.id,
      date: slots.date,
      startTime: slots.startTime,
      endTime: slots.endTime,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      hostEmail: bookings.hostEmail,
      office: bookings.office,
      status: bookings.status,
      serviceName: serviceTypes.name,
    })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .innerJoin(serviceTypes, eq(slots.serviceTypeId, serviceTypes.id))
    .where(eq(slots.companyId, companyId))
    .orderBy(desc(slots.date));

  // Format results to match PDF generator expectations
  return results.map(booking => ({
    id: booking.id,
    volunteerName: booking.volunteerName,
    volunteerEmail: booking.volunteerEmail,
    serviceName: booking.serviceName,
    date: booking.date,
    time: booking.startTime,
    hostName: booking.hostEmail,
    office: booking.office,
    status: booking.status,
  }));
}

/**
 * Get statistics for a company
 */
export async function getCompanyStatsByCompanyId(companyId: number) {
  const db = await getDb();
  if (!db) return { totalBookings: 0, upcomingBookings: 0, completedBookings: 0 };

  const { bookings, slots } = await import("../drizzle/schema");
  const today = new Date().toISOString().split('T')[0];

  const allBookings = await db
    .select({ id: bookings.id, status: bookings.status, date: slots.date })
    .from(bookings)
    .innerJoin(slots, eq(bookings.slotId, slots.id))
    .where(eq(slots.companyId, companyId));

  const totalBookings = allBookings.length;
  const upcomingBookings = allBookings.filter(
    (b) => b.date >= today && (b.status === 'pendiente' || b.status === 'confirmada' || b.status === 'confirmed')
  ).length;
  const completedBookings = allBookings.filter((b) => b.status === 'completada').length;

  return { totalBookings, upcomingBookings, completedBookings };
}

/**
 * Create a password reset token for a user
 */
export async function createPasswordResetToken(userId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { passwordResetTokens } = await import("../drizzle/schema");
  const crypto = await import("crypto");

  // Generate secure random token
  const token = crypto.randomBytes(32).toString("hex");
  
  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await db.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
    used: 0,
  });

  return token;
}

/**
 * Validate a password reset token
 */
export async function validatePasswordResetToken(token: string): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  const { passwordResetTokens } = await import("../drizzle/schema");

  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  if (!result.length) return null;

  const resetToken = result[0];

  // Check if token is expired or already used
  if (resetToken.used === 1 || new Date() > new Date(resetToken.expiresAt)) {
    return null;
  }

  return resetToken.userId;
}

/**
 * Mark a password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const { passwordResetTokens } = await import("../drizzle/schema");

  await db
    .update(passwordResetTokens)
    .set({ used: 1 })
    .where(eq(passwordResetTokens.token, token));
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: number, newPassword: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));
}


/**
 * Get all email notification settings
 */
export async function getEmailNotificationSettings() {
  const db = await getDb();
  if (!db) return [];

  const { emailNotificationSettings } = await import("../drizzle/schema");

  return await db.select().from(emailNotificationSettings);
}

/**
 * Update email notification setting
 */
export async function updateEmailNotificationSetting(
  notificationType: string,
  enabled: boolean
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { emailNotificationSettings } = await import("../drizzle/schema");

  await db
    .update(emailNotificationSettings)
    .set({ enabled: enabled ? 1 : 0 })
    .where(eq(emailNotificationSettings.notificationType, notificationType));
}

/**
 * Initialize default email notification settings
 */
export async function initializeEmailNotificationSettings(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const { emailNotificationSettings } = await import("../drizzle/schema");

  const defaultSettings = [
    {
      notificationType: "booking_confirmation_volunteer",
      enabled: 1,
      description: "Email de confirmación enviado al voluntario al crear una reserva",
    },
    {
      notificationType: "booking_confirmation_host",
      enabled: 1,
      description: "Email de confirmación enviado al anfitrión al crear una reserva",
    },
    {
      notificationType: "booking_cancellation",
      enabled: 1,
      description: "Email de cancelación enviado al voluntario y anfitrión",
    },
    {
      notificationType: "reminder_24h",
      enabled: 0,
      description: "Recordatorio enviado 24 horas antes de la sesión",
    },
    {
      notificationType: "reminder_2h",
      enabled: 0,
      description: "Recordatorio enviado 2 horas antes de la sesión",
    },
    {
      notificationType: "rating_request",
      enabled: 0,
      description: "Solicitud de valoración enviada después de la sesión",
    },
    {
      notificationType: "host_reassignment",
      enabled: 1,
      description: "Email enviado al nuevo anfitrión cuando se reasigna una reserva",
    },
  ];

  // Insert only if not exists
  for (const setting of defaultSettings) {
    const existing = await db
      .select()
      .from(emailNotificationSettings)
      .where(eq(emailNotificationSettings.notificationType, setting.notificationType))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(emailNotificationSettings).values(setting);
    }
  }
}

/**
 * Check if a notification type is enabled
 */
export async function isNotificationEnabled(notificationType: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const { emailNotificationSettings } = await import("../drizzle/schema");

  const result = await db
    .select()
    .from(emailNotificationSettings)
    .where(eq(emailNotificationSettings.notificationType, notificationType))
    .limit(1);

  if (result.length === 0) return false;

  return result[0].enabled === 1;
}

// === RATINGS ===

/**
 * Create a rating for a booking
 */
export async function createRating(data: {
  bookingId: number;
  rating: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { ratings } = await import("../drizzle/schema");
  
  const result = await db.insert(ratings).values({
    bookingId: data.bookingId,
    rating: data.rating,
    comment: data.comment || null,
  });
  
  return result;
}

/**
 * Get rating by booking ID
 */
export async function getRatingByBookingId(bookingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { ratings } = await import("../drizzle/schema");
  
  const result = await db
    .select()
    .from(ratings)
    .where(eq(ratings.bookingId, bookingId))
    .limit(1);
  
  return result[0];
}

/**
 * Get all ratings with booking details
 */
export async function getAllRatingsWithDetails() {
  const db = await getDb();
  if (!db) return [];
  
  const { ratings, bookings, companies, serviceTypes } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  
  return await db
    .select({
      id: ratings.id,
      bookingId: ratings.bookingId,
      rating: ratings.rating,
      comment: ratings.comment,
      createdAt: ratings.createdAt,
      volunteerName: bookings.volunteerName,
      volunteerEmail: bookings.volunteerEmail,
      companyName: companies.name,
      serviceName: serviceTypes.name,
    })
    .from(ratings)
    .innerJoin(bookings, eq(ratings.bookingId, bookings.id))
    .innerJoin(companies, eq(bookings.companyId, companies.id))
    .innerJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .orderBy(desc(ratings.createdAt));
}

/**
 * Get average rating for a company
 */
export async function getAverageRatingByCompany(companyId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const { ratings, bookings } = await import("../drizzle/schema");
  const { avg } = await import("drizzle-orm");
  
  const result = await db
    .select({ avgRating: avg(ratings.rating) })
    .from(ratings)
    .innerJoin(bookings, eq(ratings.bookingId, bookings.id))
    .where(eq(bookings.companyId, companyId));
  
  return result[0]?.avgRating || 0;
}

/**
 * Link OAuth account (openId) to existing password-based user account
 * This allows users to login with both password and OAuth
 */
export async function linkOAuthToUser(userId: number, openId: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    await db.update(users)
      .set({ 
        openId: openId,
        lastSignedIn: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    console.log(`[Database] Successfully linked openId ${openId} to user ${userId}`);
  } catch (error) {
    console.error("[Database] Failed to link OAuth account:", error);
    throw error;
  }
}

/**
 * Get dashboard statistics for admin panel
 */
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;

  const { bookings, companies, serviceTypes, slots } = await import("../drizzle/schema");
  const { count, sql, eq, and, gte, desc } = await import("drizzle-orm");

  // Get current date and first day of current month
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];

  // Total bookings this month
  const currentMonthBookings = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        gte(bookings.createdAt, new Date(currentMonthStart)),
        eq(bookings.status, 'confirmed')
      )
    );

  // Total bookings last month
  const lastMonthBookings = await db
    .select({ count: count() })
    .from(bookings)
    .where(
      and(
        gte(bookings.createdAt, new Date(lastMonthStart)),
        sql`${bookings.createdAt} < ${new Date(currentMonthStart)}`,
        eq(bookings.status, 'confirmed')
      )
    );

  // Total active companies
  const activeCompanies = await db
    .select({ count: count() })
    .from(companies)
    .where(eq(companies.active, 1));

  // Unique volunteers (count distinct emails)
  const uniqueVolunteers = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${bookings.volunteerEmail})` })
    .from(bookings)
    .where(eq(bookings.status, 'confirmed'));

  // Bookings by service type
  const bookingsByService = await db
    .select({
      serviceName: serviceTypes.name,
      serviceSlug: serviceTypes.slug,
      count: count(),
    })
    .from(bookings)
    .innerJoin(serviceTypes, eq(bookings.serviceTypeId, serviceTypes.id))
    .where(eq(bookings.status, 'confirmed'))
    .groupBy(serviceTypes.id, serviceTypes.name, serviceTypes.slug);

  // Bookings by month (last 6 months)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const bookingsByMonth = await db
    .select({
      month: sql<string>`DATE_FORMAT(${bookings.createdAt}, '%Y-%m')`,
      count: count(),
    })
    .from(bookings)
    .where(
      and(
        gte(bookings.createdAt, sixMonthsAgo),
        eq(bookings.status, 'confirmed')
      )
    )
    .groupBy(sql`DATE_FORMAT(${bookings.createdAt}, '%Y-%m')`)
    .orderBy(sql`DATE_FORMAT(${bookings.createdAt}, '%Y-%m')`);

  // Top 5 most active companies
  const topCompanies = await db
    .select({
      companyName: companies.name,
      companySlug: companies.slug,
      bookingCount: count(),
    })
    .from(bookings)
    .innerJoin(companies, eq(bookings.companyId, companies.id))
    .where(eq(bookings.status, 'confirmed'))
    .groupBy(companies.id, companies.name, companies.slug)
    .orderBy(desc(count()))
    .limit(5);

  // Calculate occupancy rate (booked slots / total slots)
  const totalSlots = await db
    .select({ count: count() })
    .from(slots)
    .where(eq(slots.active, 1));

  const bookedSlots = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, 'confirmed'));

  const occupancyRate = totalSlots[0].count > 0 
    ? Math.round((bookedSlots[0].count / totalSlots[0].count) * 100) 
    : 0;

  return {
    overview: {
      totalBookingsThisMonth: currentMonthBookings[0].count,
      totalBookingsLastMonth: lastMonthBookings[0].count,
      activeCompanies: activeCompanies[0].count,
      uniqueVolunteers: uniqueVolunteers[0].count,
      occupancyRate,
    },
    bookingsByService,
    bookingsByMonth,
    topCompanies,
  };
}
