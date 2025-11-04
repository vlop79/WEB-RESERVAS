import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createVolunteer,
  verifyVolunteerPassword,
  getVolunteerById,
  updateVolunteer,
  updateLastLogin,
  getVolunteerSessions,
  getVolunteerBadges,
  getVolunteerCertificates,
  countVolunteerSessions,
} from "./volunteer-db";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";

const VOLUNTEER_TOKEN_SECRET = ENV.jwtSecret || "volunteer-secret-key";

export const volunteerRouter = router({
  /**
   * Registro de nuevo voluntario
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
        surname: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if email already exists
      const { getVolunteerByEmail } = await import("./volunteer-db");
      const existing = await getVolunteerByEmail(input.email);
      
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este email ya está registrado",
        });
      }

      const volunteer = await createVolunteer(input);

      if (!volunteer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear la cuenta",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { volunteerId: volunteer.id, email: volunteer.email },
        VOLUNTEER_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        token,
        volunteer: {
          id: volunteer.id,
          email: volunteer.email,
          name: volunteer.name,
          surname: volunteer.surname,
        },
      };
    }),

  /**
   * Login de voluntario
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const volunteer = await verifyVolunteerPassword(input.email, input.password);

      if (!volunteer) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email o contraseña incorrectos",
        });
      }

      if (!volunteer.active) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Tu cuenta está desactivada",
        });
      }

      // Update last login
      await updateLastLogin(volunteer.id);

      // Generate JWT token
      const token = jwt.sign(
        { volunteerId: volunteer.id, email: volunteer.email },
        VOLUNTEER_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        token,
        volunteer: {
          id: volunteer.id,
          email: volunteer.email,
          name: volunteer.name,
          surname: volunteer.surname,
          photoUrl: volunteer.photoUrl,
          position: volunteer.position,
          companyId: volunteer.companyId,
        },
      };
    }),

  /**
   * Obtener perfil del voluntario autenticado
   */
  getProfile: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
          email: string;
        };

        const volunteer = await getVolunteerById(decoded.volunteerId);

        if (!volunteer || !volunteer.active) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Sesión inválida",
          });
        }

        // Remove password from response
        const { password, ...volunteerData } = volunteer;

        return volunteerData;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida o expirada",
        });
      }
    }),

  /**
   * Actualizar perfil del voluntario
   */
  updateProfile: publicProcedure
    .input(
      z.object({
        token: z.string(),
        name: z.string().optional(),
        surname: z.string().optional(),
        photoUrl: z.string().optional(),
        position: z.string().optional(),
        birthDate: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
        };

        const { token, ...updateData } = input;

        const success = await updateVolunteer(decoded.volunteerId, updateData);

        if (!success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al actualizar el perfil",
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida",
        });
      }
    }),

  /**
   * Obtener sesiones del voluntario
   */
  getSessions: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
        };

        const sessions = await getVolunteerSessions(decoded.volunteerId);
        return sessions;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida",
        });
      }
    }),

  /**
   * Obtener badges del voluntario
   */
  getBadges: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
        };

        const badges = await getVolunteerBadges(decoded.volunteerId);
        return badges;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida",
        });
      }
    }),

  /**
   * Obtener certificados del voluntario
   */
  getCertificates: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
        };

        const certificates = await getVolunteerCertificates(decoded.volunteerId);
        return certificates;
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida",
        });
      }
    }),

  /**
   * Obtener estadísticas del voluntario
   */
  getStats: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as {
          volunteerId: number;
        };

        const totalSessions = await countVolunteerSessions(decoded.volunteerId);
        const badges = await getVolunteerBadges(decoded.volunteerId);
        const certificates = await getVolunteerCertificates(decoded.volunteerId);

        return {
          totalSessions,
          totalBadges: badges.length,
          totalCertificates: certificates.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sesión inválida",
        });
      }
    }),

  /**
   * Registrar descarga de recurso
   */
  trackDownload: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
        resourceName: z.string(),
        token: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { trackResourceDownload } = await import("./volunteer-db");
      
      let volunteerId: number | undefined;
      let volunteerEmail: string | undefined;

      // Si hay token, extraer info del voluntario
      if (input.token) {
        try {
          const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as { volunteerId: number; email: string };
          volunteerId = decoded.volunteerId;
          volunteerEmail = decoded.email;
        } catch (error) {
          // Token inválido, continuar sin voluntario
        }
      }

      await trackResourceDownload({
        resourceId: input.resourceId,
        resourceName: input.resourceName,
        volunteerId,
        volunteerEmail,
      });

      return { success: true };
    }),

  /**
   * Obtener estadísticas de descargas (solo para admin)
   */
  getDownloadStats: publicProcedure.query(async () => {
    const { getResourceDownloadStats } = await import("./volunteer-db");
    return await getResourceDownloadStats();
  }),

  /**
   * Obtener historial de descargas (solo para admin)
   */
  getDownloadHistory: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const { getResourceDownloadHistory } = await import("./volunteer-db");
      return await getResourceDownloadHistory(input.limit);
    }),

  /**
   * Subir foto de perfil
   */
  uploadPhoto: publicProcedure
    .input(
      z.object({
        token: z.string(),
        photoData: z.string(), // Base64 string
        fileName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const decoded = jwt.verify(input.token, VOLUNTEER_TOKEN_SECRET) as { volunteerId: number; email: string };
        const { updateVolunteerPhoto } = await import("./volunteer-db");
        const { storagePut } = await import("./storage");

        // Extraer datos de la imagen base64
        const matches = input.photoData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Formato de imagen inválido",
          });
        }

        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        // Subir a S3
        const fileExtension = input.fileName.split(".").pop() || "jpg";
        const fileKey = `volunteers/${decoded.volunteerId}/profile-${Date.now()}.${fileExtension}`;
        
        const { url } = await storagePut(fileKey, buffer, contentType);

        // Actualizar en base de datos
        await updateVolunteerPhoto(decoded.volunteerId, url);

        return { success: true, photoUrl: url };
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Sesión inválida",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al subir la foto",
        });
      }
    }),
});

