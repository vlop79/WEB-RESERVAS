import { getDb } from "./db";
import { companies } from "../drizzle/schema";

const empresasData = [
  // ALTA PRIORIDAD (20 empresas)
  { nombre: "Acciona", prioridad: "Alta", domain: "acciona.com" },
  { nombre: "Adaptive Consulting", prioridad: "Alta", domain: "weareadaptive.com" },
  { nombre: "AQ Acentor", prioridad: "Alta", domain: "aq-acentor.com" },
  { nombre: "Admiral", prioridad: "Alta", logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/108097131/AqhgXmrWGstiFUwE.png" },
  { nombre: "AXA", prioridad: "Alta", domain: "axa.es" },
  { nombre: "Banco Santander", prioridad: "Alta", domain: "santander.com" },
  { nombre: "Cargill", prioridad: "Alta", domain: "cargill.com" },
  { nombre: "CBRE", prioridad: "Alta", domain: "cbre.com" },
  { nombre: "Chep", prioridad: "Alta", domain: "chep.com" },
  { nombre: "Deloitte", prioridad: "Alta", domain: "deloitte.com" },
  { nombre: "EY", prioridad: "Alta", domain: "ey.com" },
  { nombre: "KPMG", prioridad: "Alta", domain: "kpmg.com" },
  { nombre: "PwC", prioridad: "Alta", domain: "pwc.com" },
  { nombre: "Roca Junyent", prioridad: "Alta", domain: "rocajunyent.com" },
  { nombre: "Stellantis", prioridad: "Alta", domain: "stellantis.com" },
  { nombre: "TotalEnergies", prioridad: "Alta", domain: "totalenergies.com" },
  { nombre: "Volotea", prioridad: "Alta", domain: "volotea.com" },
  { nombre: "Amazon", prioridad: "Alta", domain: "amazon.com" },
  { nombre: "Banco Sabadell", prioridad: "Alta", domain: "bancsabadell.com" },
  { nombre: "Zurich", prioridad: "Alta", domain: "zurich.com" },
  
  // PRIORIDAD NORMAL (7 empresas)
  { nombre: "Coface", prioridad: "Normal", domain: "coface.es" },
  { nombre: "GruposSky", prioridad: "Normal", domain: "grupossky.com" },
  { nombre: "Havas Media Group", prioridad: "Normal", domain: "havasmediagroup.com" },
  { nombre: "Isdin", prioridad: "Normal", domain: "isdin.com" },
  { nombre: "La Redoute", prioridad: "Normal", domain: "laredoute.es" },
  { nombre: "Morningstar", prioridad: "Normal", domain: "morningstar.com" },
  { nombre: "RSM", prioridad: "Normal", domain: "rsm.global" },
  
  // PRIORIDAD BAJA (8 empresas)
  { nombre: "Disney", prioridad: "Baja", domain: "disney.com" },
  { nombre: "Fieldfisher", prioridad: "Baja", domain: "fieldfisher.com" },
  { nombre: "Gameloft", prioridad: "Baja", domain: "gameloft.com" },
  { nombre: "IBM", prioridad: "Baja", domain: "ibm.com" },
  { nombre: "JPMorgan", prioridad: "Baja", domain: "jpmorgan.com" },
  { nombre: "PageGroup", prioridad: "Baja", domain: "pagegroup.com" },
  { nombre: "Trane Technologies", prioridad: "Baja", domain: "tranetechnologies.com" },
  { nombre: "3M", prioridad: "Baja", domain: "3m.com" },
];

async function cleanAndSeed() {
  const db = await getDb();
  if (!db) {
    console.error("No se pudo conectar a la base de datos");
    return;
  }

  console.log("🗑️  Limpiando base de datos...");
  
  // Eliminar todas las empresas existentes
  await db.delete(companies);
  
  console.log("✓ Base de datos limpiada\n");
  console.log(`📝 Poblando ${empresasData.length} empresas correctas...`);

  for (const empresa of empresasData) {
    const slug = empresa.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Logo de Clearbit o personalizado si se proporciona
    const logoUrl = (empresa as any).logoUrl || `https://logo.clearbit.com/${(empresa as any).domain}`;

    await db.insert(companies).values({
      name: empresa.nombre,
      slug,
      logoUrl,
      active: 1,
    });

    console.log(`✓ ${empresa.nombre} (${empresa.prioridad})`);
  }

  console.log("\n✅ ¡Listo! Base de datos repoblada con 34 empresas correctas.");
  console.log("   - 20 empresas de prioridad Alta");
  console.log("   - 7 empresas de prioridad Normal");
  console.log("   - 8 empresas de prioridad Baja");
  console.log("   ❌ Accenture y Aurora Energy eliminadas");
  
  process.exit(0);
}

cleanAndSeed().catch(console.error);
