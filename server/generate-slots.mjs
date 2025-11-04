import { drizzle } from "drizzle-orm/mysql2";
import { companies, serviceTypes, slots } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

// Festivos nacionales de España 2025-2026
const spanishHolidays = [
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

// Días asignados por empresa
const companyDays = {
  "acciona": 5, // Viernes
  "adaptive-consulting": 4, // Jueves
  "aq-acentor": 1, // Lunes
  "axa": 2, // Martes
  "banco-santander": 3, // Miércoles
  "cargill": 5, // Viernes
  "chep": 4, // Jueves
  "deloitte": 1, // Lunes
  "ey": 2, // Martes
  "gameloft": 3, // Miércoles
  "havas-media-group": 4, // Jueves
  "isdin": 5, // Viernes
  "la-redoute": 1, // Lunes
  "pagegroup": 2, // Martes
  "pwc": 3, // Miércoles
  "rsm": 4, // Jueves
  "roca-junyent": 5, // Viernes
  "stellantis": 1, // Lunes
  "trane-technologies": 2, // Martes
  "volotea": 3, // Miércoles
};

function getDayOfWeek(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.getDay();
}

function isHoliday(dateStr) {
  return spanishHolidays.includes(dateStr);
}

function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL);
  
  console.log("🔄 Generando slots para nov-dic 2025 y todo 2026...");
  
  // Obtener todas las empresas
  const allCompanies = await db.select().from(companies);
  console.log(`📊 ${allCompanies.length} empresas encontradas`);
  
  // Obtener tipos de servicio
  const mentoring = await db.select().from(serviceTypes).where(eq(serviceTypes.slug, "mentoring")).limit(1);
  const estilismo = await db.select().from(serviceTypes).where(eq(serviceTypes.slug, "estilismo")).limit(1);
  
  if (mentoring.length === 0 || estilismo.length === 0) {
    console.error("❌ No se encontraron los tipos de servicio");
    return;
  }
  
  const mentoringService = mentoring[0];
  const estilistmoService = estilismo[0];
  
  console.log(`✅ Mentoring: ${mentoringService.maxVolunteersPerSlot} voluntarios por slot`);
  console.log(`✅ Estilismo: ${estilistmoService.maxVolunteersPerSlot} estilistas por slot`);
  
  // Generar fechas: nov-dic 2025 + todo 2026
  const dates = [
    ...generateDateRange("2025-11-01", "2025-12-31"),
    ...generateDateRange("2026-01-01", "2026-12-31"),
  ];
  
  console.log(`📅 ${dates.length} días totales a procesar`);
  
  const slotsToInsert = [];
  let skippedDays = 0;
  
  for (const company of allCompanies) {
    const assignedDay = companyDays[company.slug];
    
    if (!assignedDay) {
      console.log(`⚠️  ${company.name} no tiene día asignado, saltando...`);
      continue;
    }
    
    console.log(`🏢 Procesando ${company.name} (día ${assignedDay})...`);
    
    for (const date of dates) {
      const dayOfWeek = getDayOfWeek(date);
      
      // Saltar si no es el día asignado
      if (dayOfWeek !== assignedDay) continue;
      
      // Saltar festivos
      if (isHoliday(date)) {
        skippedDays++;
        continue;
      }
      
      // Generar slots de Mentoring (11-18h, 6 slots)
      const mentoringHours = [
        { start: "11:00", end: "12:00" },
        { start: "12:00", end: "13:00" },
        { start: "13:00", end: "14:00" },
        { start: "14:00", end: "15:00" },
        { start: "16:00", end: "17:00" },
        { start: "17:00", end: "18:00" },
      ];
      
      for (const hour of mentoringHours) {
        slotsToInsert.push({
          companyId: company.id,
          serviceTypeId: mentoringService.id,
          date,
          startTime: hour.start,
          endTime: hour.end,
          maxVolunteers: 3,
          currentVolunteers: 0,
          active: 1,
        });
      }
      
      // Generar slots de Estilismo (10-17h, 7 slots)
      const estilistmoHours = [
        { start: "10:00", end: "11:00" },
        { start: "11:00", end: "12:00" },
        { start: "12:00", end: "13:00" },
        { start: "13:00", end: "14:00" },
        { start: "14:00", end: "15:00" },
        { start: "15:00", end: "16:00" },
        { start: "16:00", end: "17:00" },
      ];
      
      for (const hour of estilistmoHours) {
        slotsToInsert.push({
          companyId: company.id,
          serviceTypeId: estilistmoService.id,
          date,
          startTime: hour.start,
          endTime: hour.end,
          maxVolunteers: 2,
          currentVolunteers: 0,
          active: 1,
        });
      }
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   - Días festivos saltados: ${skippedDays}`);
  console.log(`   - Slots totales a crear: ${slotsToInsert.length}`);
  console.log(`   - Slots de Mentoring: ${slotsToInsert.filter(s => s.serviceTypeId === mentoringService.id).length}`);
  console.log(`   - Slots de Estilismo: ${slotsToInsert.filter(s => s.serviceTypeId === estilistmoService.id).length}`);
  
  // Insertar en lotes de 1000
  const batchSize = 1000;
  for (let i = 0; i < slotsToInsert.length; i += batchSize) {
    const batch = slotsToInsert.slice(i, i + batchSize);
    await db.insert(slots).values(batch);
    console.log(`✅ Insertados ${Math.min(i + batchSize, slotsToInsert.length)} / ${slotsToInsert.length} slots`);
  }
  
  console.log("\n✅ ¡Slots generados correctamente!");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
