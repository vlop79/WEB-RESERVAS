import { getDb } from "./db.ts";
import { companies } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

async function updateLogos() {
  const db = await getDb();
  if (!db) {
    console.error("❌ No se pudo conectar a la base de datos");
    process.exit(1);
  }

  console.log("🎨 Actualizando logos...\n");

  const logosToUpdate = [
    {
      name: "Acciona",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/gMasLJfAbnxGTplb.png"
    },
    {
      name: "AQ Acentor",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/FmnypJmxqWJyLZTG.png"
    }
  ];

  for (const company of logosToUpdate) {
    await db.update(companies)
      .set({ logoUrl: company.logoUrl })
      .where(eq(companies.name, company.name));
    
    console.log(`  ✓ ${company.name}`);
  }

  console.log("\n✅ Logos actualizados correctamente");
  process.exit(0);
}

updateLogos().catch(console.error);
