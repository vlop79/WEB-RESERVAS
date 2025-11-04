import { getDb } from "./db.js";
import { companies } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

const logosToUpdate = [
  {
    name: "KPMG",
    logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/HimWlyPLoZkywQTP.png"
  },
  {
    name: "PageGroup",
    logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/IKFxYXoJqfIjVovC.png"
  }
];

async function updateLogos() {
  const db = await getDb();
  if (!db) {
    console.error("No se pudo conectar a la base de datos");
    process.exit(1);
  }

  console.log("🔄 Actualizando logos personalizados...\n");

  for (const company of logosToUpdate) {
    await db.update(companies)
      .set({ logoUrl: company.logoUrl })
      .where(eq(companies.name, company.name));
    
    console.log(`✓ ${company.name}`);
  }

  console.log("\n✅ Logos actualizados correctamente");
  process.exit(0);
}

updateLogos().catch(console.error);
