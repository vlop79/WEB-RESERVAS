import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  /** Hashed password for team members (bcrypt). Null for OAuth users. */
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "empresa"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Empresas participantes en el programa de voluntariado
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logoUrl: text("logoUrl"),
  description: text("description"),
  assignedDay: varchar("assignedDay", { length: 100 }), // e.g., "1r Lunes", "3r Jueves"
  assignedDay2: varchar("assignedDay2", { length: 100 }), // Día adicional 2 (opcional)
  assignedDay3: varchar("assignedDay3", { length: 100 }), // Día adicional 3 (opcional)
  accountManager: varchar("accountManager", { length: 255 }), // Responsable de cuenta
  fullMonthCalendar: int("fullMonthCalendar").default(0).notNull(), // 1 = calendario completo mensual, 0 = solo día asignado
  priority: mysqlEnum("priority", ["alta", "normal", "baja"]).default("normal").notNull(),
  active: int("active").default(1).notNull(), // 1 = active, 0 = inactive
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Tipos de servicio (Mentoring, Estilismo, Shadowing)
 */
export const serviceTypes = mysqlTable("service_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // "Mentoring", "Estilismo" o "Shadowing"
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  startHour: int("startHour").notNull(), // 11 para Mentoring/Shadowing, 10 para Estilismo
  endHour: int("endHour").notNull(), // 18 para Mentoring/Shadowing, 17 para Estilismo
  maxVolunteersPerSlot: int("maxVolunteersPerSlot").default(1).notNull(), // 3 para Mentoring, 2 para Estilismo/Shadowing
  modality: mysqlEnum("modality", ["virtual", "presencial"]).notNull(), // virtual para Mentoring/Shadowing, presencial para Estilismo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ServiceType = typeof serviceTypes.$inferSelect;
export type InsertServiceType = typeof serviceTypes.$inferInsert;

/**
 * Slots de disponibilidad para cada empresa y servicio
 */
export const slots = mysqlTable("slots", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  serviceTypeId: int("serviceTypeId").notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  startTime: varchar("startTime", { length: 5 }).notNull(), // HH:MM
  endTime: varchar("endTime", { length: 5 }).notNull(), // HH:MM
  maxVolunteers: int("maxVolunteers").default(1).notNull(),
  currentVolunteers: int("currentVolunteers").default(0).notNull(),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Slot = typeof slots.$inferSelect;
export type InsertSlot = typeof slots.$inferInsert;

/**
 * Reservas realizadas por voluntarios
 */
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  slotId: int("slotId").notNull(),
  companyId: int("companyId").notNull(),
  serviceTypeId: int("serviceTypeId").notNull(),
  volunteerName: varchar("volunteerName", { length: 255 }).notNull(),
  volunteerEmail: varchar("volunteerEmail", { length: 320 }).notNull(),
  volunteerPhone: varchar("volunteerPhone", { length: 50 }),
  oficina: mysqlEnum("oficina", ["Barcelona", "Madrid", "Málaga"]), // Oficina para servicios presenciales (Estilismo)
  status: mysqlEnum("status", ["confirmed", "cancelled"]).default("confirmed").notNull(),
  hostEmail: varchar("hostEmail", { length: 320 }), // Email del miembro del equipo FQT asignado como anfitrión
  googleCalendarEventId: varchar("googleCalendarEventId", { length: 255 }),
  googleMeetLink: text("googleMeetLink"),
  zohoRecordId: varchar("zohoRecordId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Relación entre usuarios empresa y empresas
 * Permite que un usuario empresa esté vinculado a una empresa específica
 */
export const companyUsers = mysqlTable("companyUsers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyId: int("companyId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyUser = typeof companyUsers.$inferSelect;
export type InsertCompanyUser = typeof companyUsers.$inferInsert;

/**
 * Tokens de recuperación de contraseña
 * Permite a usuarios empresa recuperar acceso a su cuenta
 */
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  used: int("used").default(0).notNull(), // 0 = no usado, 1 = ya usado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Configuración de notificaciones por email
 * Permite activar/desactivar cada tipo de email automático
 */
export const emailNotificationSettings = mysqlTable("emailNotificationSettings", {
  id: int("id").autoincrement().primaryKey(),
  notificationType: varchar("notificationType", { length: 100 }).notNull().unique(),
  enabled: int("enabled").default(1).notNull(), // 1 = activado, 0 = desactivado
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailNotificationSetting = typeof emailNotificationSettings.$inferSelect;
export type InsertEmailNotificationSetting = typeof emailNotificationSettings.$inferInsert;

/**
 * Valoraciones post-sesión de voluntarios
 * Permite a los voluntarios calificar su experiencia después de la sesión
 */
export const ratings = mysqlTable("ratings", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull().unique(), // Una valoración por reserva
  rating: int("rating").notNull(), // Calificación de 1 a 5 estrellas
  comment: text("comment"), // Comentario opcional del voluntario
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

/**
 * Voluntarios registrados en el portal
 * Perfil completo de cada voluntario con datos personales y profesionales
 */
export const volunteers = mysqlTable("volunteers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // Hashed con bcrypt
  name: varchar("name", { length: 255 }).notNull(),
  surname: varchar("surname", { length: 255 }),
  photoUrl: text("photoUrl"), // URL de la foto de perfil en S3
  position: varchar("position", { length: 255 }), // Cargo
  companyId: int("companyId"), // Empresa a la que pertenece
  birthDate: varchar("birthDate", { length: 10 }), // YYYY-MM-DD
  phone: varchar("phone", { length: 50 }),
  active: int("active").default(1).notNull(), // 1 = activo, 0 = inactivo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
});

export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = typeof volunteers.$inferInsert;

/**
 * Sesiones de voluntariado realizadas
 * Tracking de todas las sesiones completadas por cada voluntario
 * Conectado con Zoho para sincronizar datos de mujeres atendidas
 */
export const volunteerSessions = mysqlTable("volunteerSessions", {
  id: int("id").autoincrement().primaryKey(),
  volunteerId: int("volunteerId").notNull(),
  bookingId: int("bookingId"), // Vinculado con tabla bookings si aplica
  sessionDate: timestamp("sessionDate").notNull(),
  serviceType: varchar("serviceType", { length: 100 }), // "Mentoring" o "Estilismo"
  attendeeName: varchar("attendeeName", { length: 255 }), // Nombre de la mujer atendida
  attendeeSurname: varchar("attendeeSurname", { length: 255 }),
  zohoRecordId: varchar("zohoRecordId", { length: 255 }), // ID del registro en Zoho
  notes: text("notes"), // Notas adicionales
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VolunteerSession = typeof volunteerSessions.$inferSelect;
export type InsertVolunteerSession = typeof volunteerSessions.$inferInsert;

/**
 * Badges y logros de voluntarios
 * Sistema de reconocimiento por hitos alcanzados
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  volunteerId: int("volunteerId").notNull(),
  badgeType: varchar("badgeType", { length: 100 }).notNull(), // "first_session", "5_sessions", "10_sessions", etc.
  badgeName: varchar("badgeName", { length: 255 }).notNull(),
  badgeDescription: text("badgeDescription"),
  badgeIcon: varchar("badgeIcon", { length: 255 }), // URL del icono o emoji
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Certificados digitales de voluntarios
 * Certificados descargables por sesiones completadas
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  volunteerId: int("volunteerId").notNull(),
  certificateType: varchar("certificateType", { length: 100 }).notNull(), // "completion", "excellence", etc.
  certificateName: varchar("certificateName", { length: 255 }).notNull(),
  sessionsCount: int("sessionsCount").notNull(), // Número de sesiones que certifica
  pdfUrl: text("pdfUrl"), // URL del PDF generado en S3
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Recursos de la biblioteca para voluntarios
 * Materiales de apoyo y guías para mejorar la experiencia
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // "guias", "videos", "documentos", etc.
  fileUrl: text("fileUrl"), // URL del archivo en S3
  externalUrl: text("externalUrl"), // URL externa si aplica
  thumbnailUrl: text("thumbnailUrl"), // Miniatura del recurso
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Registro de descargas de recursos de la biblioteca
 */
export const resourceDownloads = mysqlTable("resourceDownloads", {
  id: int("id").autoincrement().primaryKey(),
  resourceId: varchar("resourceId", { length: 100 }).notNull(), // ID del recurso descargado
  resourceName: varchar("resourceName", { length: 255 }).notNull(), // Nombre del recurso
  volunteerId: int("volunteerId"), // ID del voluntario (si está autenticado)
  volunteerEmail: varchar("volunteerEmail", { length: 320 }), // Email del voluntario
  downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
});

export type ResourceDownload = typeof resourceDownloads.$inferSelect;
export type InsertResourceDownload = typeof resourceDownloads.$inferInsert;
