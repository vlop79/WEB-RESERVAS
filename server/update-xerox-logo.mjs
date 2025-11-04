import { getDb } from "./db.ts";
import { companies } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

async function updateXeroxLogo() {
  const db = await getDb();
  if (!db) {
    console.error("❌ No se pudo conectar a la base de datos");
    process.exit(1);
  }

  await db.update(companies)
    .set({ logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/aSRzbieRiaJEjoio.png" })
    .where(eq(companies.name, "Xerox"));

  console.log("✅ Logo de Xerox actualizado correctamente");
  process.exit(0);
}

updateXeroxLogo().catch(console.error);
