import { getDb } from "./db";
import { companies, serviceTypes, slots } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Festivos nacionales de España 2025-2026
const spanishHolidays = [
  // 2025
  "2025-01-01", "2025-01-06", "2025-04-18", "2025-05-01", "2025-08-15",
  "2025-10-12", "2025-11-01", "2025-12-06", "2025-12-08", "2025-12-25",
  // 2026
  "2026-01-01", "2026-01-06", "2026-04-03", "2026-05-01", "2026-08-15",
  "2026-10-12", "2026-11-01", "2026-12-06", "2026-12-08", "2026-12-25",
];

// Configuración de días por empresa: [día de la semana (1=Lunes...5=Viernes), semana del mes (1-4)]
const companySchedule: Record<string, { dayOfWeek: number; weekOfMonth: number }> = {
  "acciona": { dayOfWeek: 2, weekOfMonth: 3 }, // 3r Martes
  "adaptive-consulting": { dayOfWeek: 1, weekOfMonth: 1 }, // 1r Lunes
  "aq-acentor": { dayOfWeek: 4, weekOfMonth: 3 }, // 3r Jueves
  "axa": { dayOfWeek: 2, weekOfMonth: 2 }, // 2º Martes
  "banco-santander": { dayOfWeek: 1, weekOfMonth: 4 }, // 4º Lunes
  "cargill": { dayOfWeek: 4, weekOfMonth: 2 }, // 2º Jueves
  "chep": { dayOfWeek: 4, weekOfMonth: 2 }, // 2º Jueves
  "deloitte": { dayOfWeek: 3, weekOfMonth: 1 }, // 1º Miércoles
  "disney": { dayOfWeek: 4, weekOfMonth: 4 }, // 4t Jueves
  "ey": { dayOfWeek: 1, weekOfMonth: 2 }, // 2º Lunes
  "gameloft": { dayOfWeek: 3, weekOfMonth: 3 }, // 3r Miércoles
  "havas-media-group": { dayOfWeek: 3, weekOfMonth: 1 }, // 1º Miércoles
  "isdin": { dayOfWeek: 3, weekOfMonth: 4 }, // 4º Miércoles
  "la-redoute": { dayOfWeek: 4, weekOfMonth: 4 }, // 4º Jueves
  "pwc": { dayOfWeek: 2, weekOfMonth: 4 }, // 4º Martes
  "pagegroup": { dayOfWeek: 1, weekOfMonth: 3 }, // 3º Lunes
  "rsm": { dayOfWeek: 2, weekOfMonth: 1 }, // 1º Martes
  "roca-junyent": { dayOfWeek: 2, weekOfMonth: 3 }, // 3r Martes
  "stellantis": { dayOfWeek: 3, weekOfMonth: 3 }, // 3r Miércoles
  "trane-technologies": { dayOfWeek: 2, weekOfMonth: 2 }, // 2º Martes
  "volotea": { dayOfWeek: 3, weekOfMonth: 3 }, // 3r Miércoles
};

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr + "T00:00:00");
  return date.getDay();
}

function isHoliday(dateStr: string): boolean {
  return spanishHolidays.includes(dateStr);
}

function getWeekOfMonth(dateStr: string): number {
  const date = new Date(dateStr + "T00:00:00");
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // Calcular en qué semana del mes está este día
  const adjustedDay = dayOfMonth + firstDayWeekday - 1;
  return Math.ceil(adjustedDay / 7);
}

function generateMonthsInRange(startDate: string, endDate: string): string[] {
  const months: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  
  while (current <= end) {
    months.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`);
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

function findNthDayOfMonth(year: number, month: number, dayOfWeek: number, weekOfMonth: number): string | null {
  const firstDay = new Date(year, month - 1, 1);
  const firstDayWeekday = firstDay.getDay();
  
  // Calcular el primer día de la semana deseado en el mes
  let firstOccurrence = 1 + ((dayOfWeek - firstDayWeekday + 7) % 7);
  
  // Calcular el día específico (1ra, 2da, 3ra, 4ta semana)
  const targetDay = firstOccurrence + (weekOfMonth - 1) * 7;
  
  // Verificar que el día existe en el mes
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (targetDay > lastDayOfMonth) {
    return null;
  }
  
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
  
  // Verificar que el día de la semana es correcto
  if (getDayOfWeek(dateStr) !== dayOfWeek) {
    return null;
  }
  
  return dateStr;
}

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("❌ Database not available");
    return;
  }
  
  console.log("🔄 Generando slots para nov-dic 2025 y todo 2026...");
  console.log("📌 Cada empresa tendrá slots SOLO 1 vez al mes en su día específico\n");
  
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
  console.log(`✅ Estilismo: ${estilistmoService.maxVolunteersPerSlot} estilistas por slot\n`);
  
  // Generar meses: nov-dic 2025 + todo 2026
  const months = generateMonthsInRange("2025-11-01", "2026-12-31");
  console.log(`📅 ${months.length} meses a procesar\n`);
  
  const slotsToInsert: any[] = [];
  let skippedHolidays = 0;
  let processedDays = 0;
  
  for (const company of allCompanies) {
    const schedule = companySchedule[company.slug];
    
    if (!schedule) {
      console.log(`⚠️  ${company.name} no tiene día asignado, saltando...`);
      continue;
    }
    
    console.log(`🏢 ${company.name}:`);
    
    for (const monthStr of months) {
      const [year, month] = monthStr.split('-').map(Number);
      
      // Encontrar el día específico del mes
      const dateStr = findNthDayOfMonth(year, month, schedule.dayOfWeek, schedule.weekOfMonth);
      
      if (!dateStr) {
        continue; // El día no existe en este mes
      }
      
      // Saltar festivos
      if (isHoliday(dateStr)) {
        console.log(`   ⏭️  ${dateStr} (festivo)`);
        skippedHolidays++;
        continue;
      }
      
      console.log(`   ✓ ${dateStr}`);
      processedDays++;
      
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
          date: dateStr,
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
          date: dateStr,
          startTime: hour.start,
          endTime: hour.end,
          maxVolunteers: 2,
          currentVolunteers: 0,
          active: 1,
        });
      }
    }
    console.log();
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   - Días procesados: ${processedDays}`);
  console.log(`   - Días festivos saltados: ${skippedHolidays}`);
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
}

main().catch(console.error);
