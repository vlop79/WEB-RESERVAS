import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: (User & { companyId?: number }) | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: (User & { companyId?: number }) | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
    
    // If user is empresa role, fetch their companyId from companyUsers table
    if (user && user.role === "empresa") {
      console.log("[Context] Usuario empresa detectado:", { userId: user.id, email: user.email, role: user.role });
      const { getDb } = await import("../db");
      const { companyUsers } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      
      if (db) {
        const companyUserRecord = await db
          .select()
          .from(companyUsers)
          .where(eq(companyUsers.userId, user.id))
          .limit(1);
        
        console.log("[Context] Registros de companyUsers encontrados:", companyUserRecord.length);
        
        if (companyUserRecord.length > 0) {
          user.companyId = companyUserRecord[0].companyId;
          console.log("[Context] companyId asignado:", user.companyId);
        } else {
          console.log("[Context] No se encontró registro en companyUsers para userId:", user.id);
        }
      } else {
        console.log("[Context] Base de datos no disponible");
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
