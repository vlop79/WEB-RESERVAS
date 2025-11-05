import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { volunteerRouter } from "./volunteer-router";
import { publicProcedure, protectedProcedure, teamProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sdk } from "./_core/sdk";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  volunteer: volunteerRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    // Password login for team members
    loginWithPassword: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const { getUserByEmail, verifyPassword } = await import("./db");
        
        // Verify credentials
        const user = await getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Credenciales inválidas",
          });
        }

        const isValid = await verifyPassword(input.email, input.password);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Credenciales inválidas",
          });
        }

        // Update last sign in
        const { getDb } = await import("./db");
        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDb();
        if (db) {
          await db.update(users)
            .set({ lastSignedIn: new Date() })
            .where(eq(users.email, input.email));
        }

        // Create session token using SDK
        const openId = user.openId || `pwd_${user.id}`;
        const sessionToken = await sdk.createSessionToken(openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        // Set cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Request password reset
    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const { getUserByEmail, createPasswordResetToken } = await import("./db");
        const { sendPasswordResetEmail } = await import("../lib/email");

        const user = await getUserByEmail(input.email);
        
        // Always return success to prevent email enumeration
        if (!user || !user.password) {
          return { success: true };
        }

        // Only allow password reset for empresa users
        if (user.role !== "empresa") {
          return { success: true };
        }

        try {
          const token = await createPasswordResetToken(user.id);
          await sendPasswordResetEmail(user.email!, token, user.name || "Usuario");
        } catch (error) {
          console.error("[Password Reset] Error sending email:", error);
          // Don't throw error to prevent email enumeration
        }

        return { success: true };
      }),

    // Validate reset token
    validateResetToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const { validatePasswordResetToken } = await import("./db");
        const userId = await validatePasswordResetToken(input.token);
        return { valid: userId !== null };
      }),

    // Reset password with token
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const { validatePasswordResetToken, updateUserPassword, markTokenAsUsed } = await import("./db");

        const userId = await validatePasswordResetToken(input.token);
        if (!userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Token inválido o expirado",
          });
        }

        await updateUserPassword(userId, input.newPassword);
        await markTokenAsUsed(input.token);

        return { success: true };
      }),
  }),

  // Public routes for booking system
  public: router({
    // Get active companies
    getCompanies: publicProcedure.query(async () => {
      const { getActiveCompanies } = await import("./db");
      return getActiveCompanies();
    }),

    // Get company by slug
    getCompany: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getCompanyBySlug } = await import("./db");
        return getCompanyBySlug(input.slug);
      }),

    // Get service types
    getServiceTypes: publicProcedure.query(async () => {
      const { getAllServiceTypes } = await import("./db");
      return getAllServiceTypes();
    }),

    // Get available slots
    getAvailableSlots: publicProcedure
      .input(
        z.object({
          companySlug: z.string(),
          serviceSlug: z.string(),
        })
      )
      .query(async ({ input }) => {
        const { getCompanyBySlug, getServiceTypeBySlug, getAvailableSlots } = await import("./db");
        const { ensureSlotsForCompany } = await import("./lib/auto-generate-slots");
        
        const company = await getCompanyBySlug(input.companySlug);
        if (!company) throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
        
        const service = await getServiceTypeBySlug(input.serviceSlug);
        if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });
        
        // Generar slots automáticamente en background si la empresa tiene calendario completo o días asignados
        const hasAssignedDays = (company.assignedDay && company.assignedDay !== '') ||
                                (company.assignedDay2 && company.assignedDay2 !== '') ||
                                (company.assignedDay3 && company.assignedDay3 !== '');
        
        if (company.fullMonthCalendar === 1 || hasAssignedDays) {
          // No await - ejecutar en background sin bloquear la respuesta
          ensureSlotsForCompany(
            company.id, 
            company.fullMonthCalendar === 1, 
            company.assignedDay || '',
            company.assignedDay2 || '',
            company.assignedDay3 || ''
          ).catch(err => {
            console.error('[Auto-generate] Error generando slots:', err);
          });
        }
        
        const today = new Date().toISOString().split("T")[0];
        return getAvailableSlots(company.id, service.id, today);
      }),

    // Export booking to calendar
    exportBookingToCalendar: publicProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        const { getBookingById, getCompanyById, getServiceTypeById } = await import("./db");
        const { generateICSFile } = await import("../lib/calendarExport");

        const booking = await getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        }

        const company = await getCompanyById(booking.companyId);
        const service = await getServiceTypeById(booking.serviceTypeId);

        const { error, value } = generateICSFile({
          volunteerName: booking.volunteerName,
          volunteerEmail: booking.volunteerEmail,
          companyName: company?.name || "Empresa",
          serviceName: service?.name || "Sesión",
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
          hostName: booking.hostName || undefined,
          hostEmail: booking.hostEmail || undefined,
          meetLink: booking.meetLink || undefined,
        });

        if (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error generando archivo de calendario" });
        }

        return {
          icsContent: value,
          fileName: `reserva-${company?.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${booking.startTime.toISOString().split("T")[0]}.ics`,
        };
      }),

    // Create booking
    createBooking: publicProcedure
      .input(
        z.object({
          slotId: z.number(),
          volunteerName: z.string().min(1),
          volunteerEmail: z.string().email(),
          volunteerPhone: z.string().optional(),
          oficina: z.enum(["Barcelona", "Madrid", "Málaga"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getSlotById, createBooking, incrementSlotVolunteers, getCompanyById, getServiceTypeById, checkDuplicateBooking } = await import("./db");
        const { getNextHostEmail, createCalendarEvent } = await import("../lib/google-calendar");
        
        // Check for duplicate bookings (same email within 7 days)
        const isDuplicate = await checkDuplicateBooking(input.volunteerEmail, input.slotId);
        if (isDuplicate) {
          throw new TRPCError({ 
            code: "BAD_REQUEST", 
            message: "Ya tienes una reserva activa en fechas cercanas. Por favor, espera a completar tu sesión actual antes de reservar otra." 
          });
        }
        
        // Verify slot exists and has availability
        const slot = await getSlotById(input.slotId);
        if (!slot) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Slot not found" });
        }
        
        if (slot.currentVolunteers >= slot.maxVolunteers) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Slot is full" });
        }
        
        // Get company and service type details
        const company = await getCompanyById(slot.companyId);
        const serviceType = await getServiceTypeById(slot.serviceTypeId);
        
        if (!company || !serviceType) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Company or service type not found" });
        }
        
        // Assign host using round-robin
        const hostEmail = await getNextHostEmail();
        
        // Prepare calendar event data
        const startDateTime = `${slot.date}T${slot.startTime}:00`;
        const endDateTime = `${slot.date}T${slot.endTime}:00`;
        const includeGoogleMeet = serviceType.modality === 'virtual';
        
        let googleCalendarEventId: string | null = null;
        let googleMeetLink: string | null = null;
        
        // Try to create calendar event
        try {
          const calendarEvent = await createCalendarEvent({
            hostEmail,
            summary: `${serviceType.name} - ${company.name} - ${input.volunteerName}`,
            description: `Sesión de ${serviceType.name} con ${company.name}\n\nVoluntario: ${input.volunteerName}\nEmail: ${input.volunteerEmail}\nTeléfono: ${input.volunteerPhone || 'No proporcionado'}\n\nModalidad: ${serviceType.modality}`,
            startDateTime,
            endDateTime,
            attendees: [input.volunteerEmail],
            includeGoogleMeet,
          });
          
          googleCalendarEventId = calendarEvent.eventId;
          googleMeetLink = calendarEvent.meetLink;
        } catch (error: any) {
          console.error('Failed to create calendar event:', error);
          // Continue with booking creation even if calendar fails
        }
        
        // Create booking with calendar data
        await createBooking({
          slotId: input.slotId,
          companyId: slot.companyId,
          serviceTypeId: slot.serviceTypeId,
          volunteerName: input.volunteerName,
          volunteerEmail: input.volunteerEmail,
          volunteerPhone: input.volunteerPhone,
          oficina: input.oficina,
          hostEmail,
          googleCalendarEventId,
          googleMeetLink,
        });
        
        // Increment slot counter
        await incrementSlotVolunteers(input.slotId);
        
        // Send confirmation email to volunteer
        try {
          const { sendBookingConfirmationEmail } = await import("../lib/email");
          await sendBookingConfirmationEmail({
            volunteerName: input.volunteerName,
            volunteerEmail: input.volunteerEmail,
            companyName: company.name,
            serviceName: serviceType.name,
            serviceModality: serviceType.modality,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            oficina: input.oficina,
            googleMeetLink: googleMeetLink || undefined,
            hostEmail,
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the booking if email fails
        }
        
        // Send assignment notification to host
        try {
          const { sendHostAssignmentEmail } = await import("../lib/email");
          await sendHostAssignmentEmail({
            hostEmail,
            volunteerName: input.volunteerName,
            volunteerEmail: input.volunteerEmail,
            volunteerPhone: input.volunteerPhone,
            companyName: company.name,
            serviceName: serviceType.name,
            serviceModality: serviceType.modality,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            oficina: input.oficina,
            googleMeetLink: googleMeetLink || undefined,
          });
        } catch (emailError) {
          console.error('Failed to send host assignment email:', emailError);
          // Don't fail the booking if email fails
        }
        
        return { 
          success: true,
          meetLink: googleMeetLink,
          hostEmail,
        };
      }),
  }),

  // Admin routes
  admin: router({
    // Upload logo to S3
    uploadLogo: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64 encoded
          mimeType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.fileData, "base64");
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `logos/${input.fileName}-${randomSuffix}`;
        const result = await storagePut(fileKey, buffer, input.mimeType);
        return { url: result.url };
      }),

    // Companies management
    getAllCompanies: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllCompanies } = await import("./db");
      return getAllCompanies();
    }),

    createCompany: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          logoUrl: z.string().optional(),
          assignedDay: z.string().optional(),
          accountManager: z.string().optional(),
          fullMonthCalendar: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createCompany } = await import("./db");
        await createCompany(input);
        return { success: true };
      }),

    updateCompany: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          logoUrl: z.string().optional(),
          assignedDay: z.string().optional(),
          accountManager: z.string().optional(),
          fullMonthCalendar: z.number().optional(),
          active: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updateCompany } = await import("./db");
        await updateCompany(id, data);
        return { success: true };
      }),

    // Slots management
    bulkCreateSlots: protectedProcedure
      .input(
        z.object({
          companyId: z.number(),
          serviceTypeId: z.number(),
          dates: z.array(z.string()),
          startHour: z.number(),
          endHour: z.number(),
          maxVolunteers: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        
        const { bulkCreateSlots, getCompanyById } = await import("./db");
        const company = await getCompanyById(input.companyId);
        
        if (!company) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Empresa no encontrada" });
        }
        
        // Filter dates based on company settings
        let filteredDates = input.dates;
        
        if (company.fullMonthCalendar === 0 && company.assignedDay) {
          // Parse assignedDay (e.g., "3r Jueves", "1r Lunes")
          const match = company.assignedDay.match(/(\d+)r?\s+(\w+)/);
          if (match) {
            const weekNumber = parseInt(match[1]);
            const dayName = match[2].toLowerCase();
            
            const dayMap: Record<string, number> = {
              'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
              'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0
            };
            
            const targetDay = dayMap[dayName];
            if (targetDay !== undefined) {
              filteredDates = input.dates.filter(dateStr => {
                const date = new Date(dateStr + 'T00:00:00');
                const dayOfWeek = date.getDay();
                
                if (dayOfWeek !== targetDay) return false;
                
                // Calculate which occurrence of this day in the month
                const dayOfMonth = date.getDate();
                const occurrence = Math.ceil(dayOfMonth / 7);
                
                return occurrence === weekNumber;
              });
            }
          }
        }
        // If fullMonthCalendar === 1, use all dates (no filtering)
        
        const slots = [];
        for (const date of filteredDates) {
          for (let hour = input.startHour; hour < input.endHour; hour++) {
            slots.push({
              companyId: input.companyId,
              serviceTypeId: input.serviceTypeId,
              date,
              startTime: `${hour.toString().padStart(2, "0")}:00`,
              endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
              maxVolunteers: input.maxVolunteers,
            });
          }
        }
        
        await bulkCreateSlots(slots);
        return { success: true, count: slots.length };
      }),

    // Bookings management - accessible by team members
    getAllBookings: teamProcedure.query(async () => {
      const { getAllBookings } = await import("./db");
      return getAllBookings();
    }),

    cancelBooking: teamProcedure
      .input(z.object({ 
        id: z.number(),
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { getBookingById, cancelBooking, getCompanyById, getServiceTypeById, getSlotById } = await import("./db");
        const { deleteCalendarEvent } = await import("../lib/google-calendar-delete");
        const { sendCancellationEmailToVolunteer, sendCancellationEmailToHost } = await import("../lib/email");

        // Get booking details before cancellation
        const booking = await getBookingById(input.id);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        }

        if (booking.status === "cancelled") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "La reserva ya está cancelada" });
        }

        // Get additional details for emails
        const company = await getCompanyById(booking.companyId);
        const serviceType = await getServiceTypeById(booking.serviceTypeId);
        const slot = await getSlotById(booking.slotId);

        if (!company || !serviceType || !slot) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al obtener detalles de la reserva" });
        }

        // Delete Google Calendar event if exists
        if (booking.googleCalendarEventId && booking.hostEmail) {
          try {
            await deleteCalendarEvent({
              eventId: booking.googleCalendarEventId,
              hostEmail: booking.hostEmail,
            });
          } catch (error) {
            console.error("Failed to delete calendar event:", error);
            // Continue with cancellation even if calendar deletion fails
          }
        }

        // Cancel booking in database (also decrements slot)
        await cancelBooking(input.id);

        // Send cancellation emails
        try {
          await sendCancellationEmailToVolunteer({
            volunteerName: booking.volunteerName,
            volunteerEmail: booking.volunteerEmail,
            companyName: company.name,
            serviceName: serviceType.name,
            date: slot.date,
            startTime: slot.startTime,
            reason: input.reason,
          });
        } catch (error) {
          console.error("Failed to send cancellation email to volunteer:", error);
        }

        if (booking.hostEmail) {
          try {
            await sendCancellationEmailToHost({
              hostEmail: booking.hostEmail,
              volunteerName: booking.volunteerName,
              companyName: company.name,
              serviceName: serviceType.name,
              date: slot.date,
              startTime: slot.startTime,
              reason: input.reason,
            });
          } catch (error) {
            console.error("Failed to send cancellation email to host:", error);
          }
        }

        return { success: true };
      }),

    // Get team members
    getTeamMembers: teamProcedure.query(async () => {
      const { getTeamMembers } = await import("../lib/google-calendar");
      return getTeamMembers();
    }),

    // Change booking host
    changeBookingHost: teamProcedure
      .input(
        z.object({
          bookingId: z.number(),
          newHostEmail: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        const { getBookingById, updateBooking } = await import("./db");
        const { transferCalendarEvent } = await import("../lib/google-calendar");

        // Get booking details
        const booking = await getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        }

        const currentHostEmail = booking.hostEmail;
        const googleCalendarEventId = booking.googleCalendarEventId;

        if (!currentHostEmail || !googleCalendarEventId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "La reserva no tiene anfitrión o evento de calendario asignado",
          });
        }

        // Transfer calendar event
        let newEventId = googleCalendarEventId;
        try {
          const transferResult = await transferCalendarEvent({
            eventId: googleCalendarEventId,
            currentHostEmail,
            newHostEmail: input.newHostEmail,
          });

          if (!transferResult.success) {
            throw new Error(transferResult.error || "Error al transferir evento");
          }

          newEventId = transferResult.newEventId || googleCalendarEventId;
        } catch (error: any) {
          console.error("Failed to transfer calendar event:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error al transferir evento de calendario: ${error.message}`,
          });
        }

        // Update booking in database
        await updateBooking(input.bookingId, {
          hostEmail: input.newHostEmail,
          googleCalendarEventId: newEventId,
        });
        
        // Send assignment notification to new host
        try {
          const { getCompanyById, getServiceTypeById } = await import("./db");
          const { sendHostAssignmentEmail } = await import("../lib/email");
          
          const company = await getCompanyById(booking.companyId);
          const serviceType = await getServiceTypeById(booking.serviceTypeId);
          const slot = await (await import("./db")).getSlotById(booking.slotId);
          
          if (company && serviceType && slot) {
            await sendHostAssignmentEmail({
              hostEmail: input.newHostEmail,
              volunteerName: booking.volunteerName,
              volunteerEmail: booking.volunteerEmail,
              volunteerPhone: booking.volunteerPhone || undefined,
              companyName: company.name,
              serviceName: serviceType.name,
              serviceModality: serviceType.modality,
              date: slot.date,
              startTime: slot.startTime,
              endTime: slot.endTime,
              oficina: booking.oficina || undefined,
              googleMeetLink: booking.googleMeetLink || undefined,
            });
          }
        } catch (emailError) {
          console.error('Failed to send host assignment email:', emailError);
          // Don't fail the operation if email fails
        }

        return {
          success: true,
          newHostEmail: input.newHostEmail,
          newEventId,
        };
      }),

    // User management
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllUsers } = await import("./db");
      return getAllUsers();
    }),

    createUser: protectedProcedure
      .input(
        z.object({
          openId: z.string().min(1),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.enum(["admin", "user", "empresa"]).optional(),
          companyId: z.number().optional(),
          password: z.string().min(6).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { createUser, getDb } = await import("./db");
        const { companyUsers } = await import("../drizzle/schema");
        
        // Create user without companyId
        const { openId, name, email, role, password } = input;
        const result = await createUser({ openId, name, email, role, password });
        
        // If empresa role and companyId provided, create companyUsers entry
        if (input.role === "empresa" && input.companyId) {
          const db = await getDb();
          if (db) {
            // Get the newly created user ID from the result
            const userId = Number(result[0].insertId);
            await db.insert(companyUsers).values({
              userId,
              companyId: input.companyId,
            });
          }
        }
        
        return { success: true };
      }),

    updateUserRole: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          role: z.enum(["admin", "user", "empresa"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateUserRole } = await import("./db");
        await updateUserRole(input.userId, input.role);
        return { success: true };
      }),

    updateCompanyUser: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          companyId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateCompanyUser } = await import("./db");
        const { userId, ...data } = input;
        try {
          await updateCompanyUser(userId, data);
          return { success: true };
        } catch (error: any) {
          throw new TRPCError({ 
            code: "BAD_REQUEST", 
            message: error.message || "Failed to update user" 
          });
        }
      }),

    updateCompanyUserPassword: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          newPassword: z.string().min(6, "Password must be at least 6 characters"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateCompanyUserPassword } = await import("./db");
        await updateCompanyUserPassword(input.userId, input.newPassword);
        return { success: true };
      }),

    deleteUser: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteUser, getUserBookingsCount } = await import("./db");
        
        // Check if user has active bookings
        const bookingsCount = await getUserBookingsCount(input.userId);
        if (bookingsCount > 0) {
          throw new TRPCError({ 
            code: "BAD_REQUEST", 
            message: "No se puede eliminar un usuario con reservas activas" 
          });
        }
        
        await deleteUser(input.userId);
        return { success: true };
      }),

    // Slots management
    getAllSlots: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllSlots } = await import("./db");
      return getAllSlots();
    }),

    updateSlot: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          date: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          maxVolunteers: z.number().optional(),
          active: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        const { updateSlot } = await import("./db");
        await updateSlot(id, data);
        return { success: true };
      }),

    deleteSlot: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { deleteSlot } = await import("./db");
        await deleteSlot(input.id);
        return { success: true };
      }),

    // Advanced booking queries
    getBookingsWithDetails: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getBookingsWithDetails } = await import("./db");
      return getBookingsWithDetails();
    }),

    getBookingsByCompany: protectedProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { getBookingsByCompany } = await import("./db");
        return getBookingsByCompany(input.companyId);
      }),

    getBookingsByDateRange: protectedProcedure
      .input(
        z.object({
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { getBookingsByDateRange } = await import("./db");
        return getBookingsByDateRange(input.startDate, input.endDate);
      }),

    getBookingStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getBookingStats } = await import("./db");
      return getBookingStats();
    }),

    getSlotsByCompanyAndDate: protectedProcedure
      .input(
        z.object({
          companyId: z.number(),
          date: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { getSlotsByCompanyAndDate } = await import("./db");
        return getSlotsByCompanyAndDate(input.companyId, input.date);
      }),

    // Send reminders manually (for testing or manual trigger)
    sendReminders: protectedProcedure
      .input(z.object({
        type: z.enum(['24h', '2h']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { triggerRemindersManually } = await import("../lib/reminders");
        return triggerRemindersManually(input.type);
      }),

    // Email notification settings
    getEmailNotificationSettings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getEmailNotificationSettings, initializeEmailNotificationSettings } = await import("./db");
      // Initialize default settings if not exists
      await initializeEmailNotificationSettings();
      return getEmailNotificationSettings();
    }),

    updateEmailNotificationSetting: protectedProcedure
      .input(
        z.object({
          notificationType: z.string(),
          enabled: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { updateEmailNotificationSetting } = await import("./db");
        await updateEmailNotificationSetting(input.notificationType, input.enabled);
        return { success: true };
      }),
  }),

  // Company User router - for company role users to view their own company data
  companyUser: router({
    getMyCompany: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "empresa") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Solo usuarios de empresa pueden acceder a esta información" });
      }
      if (!ctx.user.companyId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Usuario no tiene empresa asignada" });
      }
      const { getCompanyByUserId } = await import("./db");
      const company = await getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Empresa no encontrada" });
      }
      return company;
    }),

    getMyCompanyBookings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "empresa") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Solo usuarios de empresa pueden acceder a esta información" });
      }
      if (!ctx.user.companyId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Usuario no tiene empresa asignada" });
      }
      const { getBookingsByCompanyIdWithDetails } = await import("./db");
      return getBookingsByCompanyIdWithDetails(ctx.user.companyId);
    }),

    getMyCompanyStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "empresa") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Solo usuarios de empresa pueden acceder a esta información" });
      }
      if (!ctx.user.companyId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Usuario no tiene empresa asignada" });
      }
      const { getCompanyStatsByCompanyId } = await import("./db");
      return getCompanyStatsByCompanyId(ctx.user.companyId);
    }),

  }),

  // === RATINGS ===
  ratings: router({
    // Create a rating (public - anyone can rate with booking ID)
    create: publicProcedure
      .input(
        z.object({
          bookingId: z.number(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createRating, getRatingByBookingId, getBookingById } = await import("./db");

        // Check if booking exists
        const booking = await getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Reserva no encontrada" });
        }

        // Check if rating already exists
        const existingRating = await getRatingByBookingId(input.bookingId);
        if (existingRating) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Ya existe una valoración para esta reserva" });
        }

        await createRating({
          bookingId: input.bookingId,
          rating: input.rating,
          comment: input.comment,
        });

        return { success: true };
      }),

    // Get rating by booking ID (public)
    getByBookingId: publicProcedure
      .input(z.object({ bookingId: z.number() }))
      .query(async ({ input }) => {
        const { getRatingByBookingId } = await import("./db");
        return getRatingByBookingId(input.bookingId);
      }),

    // Get all ratings with details (admin only)
    getAllWithDetails: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { getAllRatingsWithDetails } = await import("./db");
      return getAllRatingsWithDetails();
    }),

    // Get average rating for a company (admin only)
    getAverageByCompany: protectedProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { getAverageRatingByCompany } = await import("./db");
        return getAverageRatingByCompany(input.companyId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
