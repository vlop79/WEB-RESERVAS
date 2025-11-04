import { getDb } from "./db";
import { companies } from "../drizzle/schema";

const empresasData = [
  // ALTA PRIORIDAD
  { nombre: "Acciona", prioridad: "Alta", domain: "acciona.com" },
  { nombre: "Adaptive Consulting", prioridad: "Alta", domain: "weareadaptive.com" },
  { nombre: "AQ Acentor", prioridad: "Alta", domain: "aq-acentor.com" },
  { nombre: "Admiral", prioridad: "Alta", domain: "admiral.es" },
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
  
  // PRIORIDAD NORMAL
  { nombre: "Coface", prioridad: "Normal", domain: "coface.es" },
  { nombre: "GruposSky", prioridad: "Normal", domain: "grupossky.com" },
  { nombre: "Havas Media Group", prioridad: "Normal", domain: "havasmediagroup.com" },
  { nombre: "Isdin", prioridad: "Normal", domain: "isdin.com" },
  { nombre: "La Redoute", prioridad: "Normal", domain: "laredoute.es" },
  { nombre: "Morningstar", prioridad: "Normal", domain: "morningstar.com" },
  { nombre: "RSM", prioridad: "Normal", domain: "rsm.global" },
  
  // PRIORIDAD BAJA
  { nombre: "Disney", prioridad: "Baja", domain: "disney.com" },
  { nombre: "Fieldfisher", prioridad: "Baja", domain: "fieldfisher.com" },
  { nombre: "Gameloft", prioridad: "Baja", domain: "gameloft.com" },
  { nombre: "IBM", prioridad: "Baja", domain: "ibm.com" },
  { nombre: "JPMorgan", prioridad: "Baja", domain: "jpmorgan.com" },
  { nombre: "PageGroup", prioridad: "Baja", domain: "pagegroup.com" },
  { nombre: "Trane Technologies", prioridad: "Baja", domain: "tranetechnologies.com" },
  { nombre: "3M", prioridad: "Baja", domain: "3m.com" },
];

async function seedCompanies() {
  const db = await getDb();
  if (!db) {
    console.error("No se pudo conectar a la base de datos");
    return;
  }

  console.log(`Poblando ${empresasData.length} empresas...`);

  for (const empresa of empresasData) {
    const slug = empresa.nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Logo de Clearbit (servicio gratuito de logos empresariales)
    const logoUrl = `https://logo.clearbit.com/${empresa.domain}`;

    await db.insert(companies).values({
      name: empresa.nombre,
      slug,
      logoUrl,
      active: 1,
    }).onDuplicateKeyUpdate({
      set: {
        name: empresa.nombre,
        logoUrl,
      },
    });

    console.log(`✓ ${empresa.nombre} (${empresa.prioridad})`);
  }

  console.log("\n¡Listo! Todas las empresas han sido creadas.");
  process.exit(0);
}

seedCompanies().catch(console.error);
