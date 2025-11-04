import { getDb } from "./db.ts";
import { companies } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

async function updateCompanies() {
  const db = await getDb();
  if (!db) {
    console.error("❌ No se pudo conectar a la base de datos");
    process.exit(1);
  }

  console.log("🔄 Actualizando empresas y logos...\n");

  // 1. Eliminar IBM y 3M
  console.log("🗑️  Eliminando empresas:");
  await db.delete(companies).where(eq(companies.name, "IBM"));
  console.log("  ✓ IBM eliminada");
  
  await db.delete(companies).where(eq(companies.name, "3M"));
  console.log("  ✓ 3M eliminada");

  // 2. Añadir XEROX
  console.log("\n➕ Añadiendo nueva empresa:");
  const xeroxLogo = "https://logo.clearbit.com/xerox.com";
  
  await db.insert(companies).values({
    name: "Xerox",
    slug: "xerox",
    description: "Haz clic para reservar tu sesión",
    logoUrl: xeroxLogo,
    priority: "normal"
  });
  console.log("  ✓ Xerox añadida");

  // 3. Actualizar logos personalizados
  console.log("\n🎨 Actualizando logos personalizados:");
  
  const logosToUpdate = [
    {
      name: "KPMG",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/HimWlyPLoZkywQTP.png"
    },
    {
      name: "PageGroup",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/IKFxYXoJqfIjVovC.png"
    },
    {
      name: "Morningstar",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/sAOfXeaVlYlfkQjI.png"
    },
    {
      name: "GruposSky",
      logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/XCoyZiAXhnLDpyyZ.png"
    }
  ];

  for (const company of logosToUpdate) {
    await db.update(companies)
      .set({ logoUrl: company.logoUrl })
      .where(eq(companies.name, company.name));
    
    console.log(`  ✓ ${company.name}`);
  }

  console.log("\n✅ Todas las actualizaciones completadas");
  console.log("\n📊 Resumen:");
  console.log("  • Empresas eliminadas: IBM, 3M");
  console.log("  • Empresas añadidas: Xerox");
  console.log("  • Logos actualizados: KPMG, PageGroup, Morningstar, GruposSky");
  console.log("  • Total de empresas: 33");
  
  process.exit(0);
}

updateCompanies().catch(console.error);
