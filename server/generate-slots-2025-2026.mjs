import { getDb } from "./db.ts";
import { companies, serviceTypes, slots } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

// Festivos nacionales de España 2025-2026
const FESTIVOS_NACIONALES = [
  // 2025
  "2025-01-01", // Año Nuevo
  "2025-01-06", // Reyes
  "2025-04-18", // Viernes Santo
  "2025-05-01", // Día del Trabajo
  "2025-08-15", // Asunción
  "2025-10-12", // Fiesta Nacional
  "2025-11-01", // Todos los Santos
  "2025-12-06", // Constitución
  "2025-12-08", // Inmaculada
  "2025-12-25", // Navidad
  
  // 2026
  "2026-01-01", // Año Nuevo
  "2026-01-06", // Reyes
  "2026-04-03", // Viernes Santo
  "2026-05-01", // Día del Trabajo
  "2026-08-15", // Asunción
  "2026-10-12", // Fiesta Nacional
  "2026-11-01", // Todos los Santos
  "2026-12-06", // Constitución
  "2026-12-08", // Inmaculada
  "2026-12-25", // Navidad
];

// Mapeo de días en español a números (0=Domingo, 1=Lunes, etc.)
const DIAS_SEMANA = {
  "domingo": 0,
  "lunes": 1,
  "martes": 2,
  "miércoles": 3,
  "miercoles": 3,
  "jueves": 4,
  "viernes": 5,
  "sábado": 6,
  "sabado": 6
};

// Mapeo de ordinales
const ORDINALES = {
  "1º": 1, "1r": 1, "1ª": 1, "primer": 1, "primera": 1,
  "2º": 2, "2r": 2, "2ª": 2, "segundo": 2, "segunda": 2,
  "3º": 3, "3r": 3, "3ª": 3, "tercer": 3, "tercera": 3,
  "4º": 4, "4r": 4, "4ª": 4, "cuarto": 4, "cuarta": 4
};

// Datos de empresas con sus días asignados (del Excel)
const EMPRESAS_DIAS = {
  "Acciona": "3r Martes",
  "Adaptive Consulting": "1r lunes",
  "AQ Acentor": "3r Jueves",
  "AXA": "2º Martes",
  "Banco Santander": "4º Lunes",
  "Cargill": "2º jueves",
  "Chep": "2º Jueves",
  "Deloitte": "1º miércoles",
  "Disney": "4t jueves",
  "EY": "2º Viernes",
  "Gameloft": "3r Miércoles",
  "Havas Media Group": "1º Miércoles",
  "Isdin": "4º Miércoles",
  "La Redoute": "4º Jueves",
  "PageGroup": "3º lunes",
  "PwC": "4º Martes",
  "RSM": "1º martes",
  "Roca Junyent": "3r Martes",
  "Stellantis": "1º Viernes",
  "Trane Technologies": "2º Martes",
  "Volotea": "3r Miércoles"
};

function parseDiaAsignado(diaStr) {
  if (!diaStr) return null;
  
  const lower = diaStr.toLowerCase().trim();
  const parts = lower.split(" ");
  
  if (parts.length < 2) return null;
  
  const ordinal = ORDINALES[parts[0]];
  const diaNombre = parts[1];
  const diaNumero = DIAS_SEMANA[diaNombre];
  
  if (!ordinal || diaNumero === undefined) return null;
  
  return { ordinal, diaSemana: diaNumero };
}

function getNthWeekdayOfMonth(year, month, weekday, nth) {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  
  let daysUntilFirst = (weekday - firstWeekday + 7) % 7;
  let targetDate = 1 + daysUntilFirst + (nth - 1) * 7;
  
  const date = new Date(year, month, targetDate);
  
  // Verificar que la fecha está en el mes correcto
  if (date.getMonth() !== month) return null;
  
  return date;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo o Sábado
}

async function generateSlots() {
  const db = await getDb();
  if (!db) {
    console.error("❌ No se pudo conectar a la base de datos");
    process.exit(1);
  }

  console.log("🗓️  Generando slots para nov-dic 2025 y todo 2026...\n");

  // 1. Crear tipos de servicio
  console.log("📋 Creando tipos de servicio...");
  
  await db.insert(serviceTypes).values([
    {
      name: "Mentoring",
      slug: "mentoring",
      description: "Sesión de mentoring profesional",
      startHour: 11,
      endHour: 18,
      maxVolunteersPerSlot: 1
    },
    {
      name: "Estilismo",
      slug: "estilismo",
      description: "Sesión de estilismo y asesoría de imagen",
      startHour: 10,
      endHour: 17,
      maxVolunteersPerSlot: 2
    }
  ]).onDuplicateKeyUpdate({ set: { name: "Mentoring" } });
  
  console.log("  ✓ Tipos de servicio creados\n");

  // 2. Obtener IDs de servicios y empresas
  const [mentoringService] = await db.select().from(serviceTypes).where(eq(serviceTypes.slug, "mentoring"));
  const [estilismoService] = await db.select().from(serviceTypes).where(eq(serviceTypes.slug, "estilismo"));
  const allCompanies = await db.select().from(companies);

  console.log(`📊 Empresas en BD: ${allCompanies.length}`);
  console.log(`📊 Empresas con días asignados: ${Object.keys(EMPRESAS_DIAS).length}\n`);

  // 3. Generar slots para cada empresa
  let totalSlots = 0;
  const startDate = new Date(2025, 10, 1); // Nov 2025
  const endDate = new Date(2026, 11, 31); // Dic 2026

  for (const company of allCompanies) {
    const diaAsignado = EMPRESAS_DIAS[company.name];
    
    if (!diaAsignado) {
      console.log(`⚠️  ${company.name}: Sin día asignado, saltando...`);
      continue;
    }

    const parsed = parseDiaAsignado(diaAsignado);
    if (!parsed) {
      console.log(`⚠️  ${company.name}: No se pudo parsear "${diaAsignado}"`);
      continue;
    }

    console.log(`✓ ${company.name}: ${diaAsignado}`);

    // Generar slots para cada mes
    for (let year = 2025; year <= 2026; year++) {
      const startMonth = (year === 2025) ? 10 : 0; // Nov 2025 o Ene 2026
      const endMonth = (year === 2026) ? 11 : 11; // Dic de cada año

      for (let month = startMonth; month <= endMonth; month++) {
        const slotDate = getNthWeekdayOfMonth(year, month, parsed.diaSemana, parsed.ordinal);
        
        if (!slotDate) continue;
        if (isWeekend(slotDate)) continue;
        
        const dateStr = formatDate(slotDate);
        if (FESTIVOS_NACIONALES.includes(dateStr)) continue;

        // Crear slots para Mentoring y Estilismo
        for (const service of [mentoringService, estilismoService]) {
          await db.insert(slots).values({
            companyId: company.id,
            serviceTypeId: service.id,
            date: dateStr,
            startTime: `${String(service.startHour).padStart(2, "0")}:00`,
            endTime: `${String(service.endHour).padStart(2, "0")}:00`,
            maxVolunteers: service.maxVolunteersPerSlot,
            currentVolunteers: 0,
            active: 1
          });
          totalSlots++;
        }
      }
    }
  }

  console.log(`\n✅ Total de slots generados: ${totalSlots}`);
  console.log(`📅 Período: Noviembre 2025 - Diciembre 2026 (14 meses)`);
  console.log(`🚫 Festivos excluidos: ${FESTIVOS_NACIONALES.length}`);
  
  process.exit(0);
}

generateSlots().catch(console.error);
