/**
 * Sistema de generación automática de slots para empresas con calendario mensual completo
 * Mantiene siempre 3 meses de slots disponibles hacia el futuro
 */

import { getDb } from "../db";

// Festivos nacionales de España (actualizables cada año)
// Mapeo de días de la semana en español a números (0=domingo, 1=lunes, ...)
const DAY_NAMES: Record<string, number> = {
  'domingo': 0, 'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
  'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6
};

/**
 * Parsea un patrón de día asignado como "1r Miércoles", "2º Martes", etc.
 * @returns { occurrence: number, dayOfWeek: number } o null si no es un patrón válido
 */
function parseAssignedDayPattern(assignedDay: string): { occurrence: number; dayOfWeek: number } | null {
  if (!assignedDay || assignedDay === '') return null;
  
  // Primero intentar parsear patrón "1r Miércoles", "2º Martes", etc.
  // Nota: Incluye caracteres españoles (áéíóúñü) para capturar nombres de días correctamente
  const pattern = /^(\d+)\s*[rºª]\s*([\wáéíóúñüÁÉÍÓÚÑÜ]+)$/i;
  const match = assignedDay.match(pattern);
  
  // Si coincide con el patrón, procesarlo
  if (match) {
    const occurrence = parseInt(match[1], 10);
    const dayName = match[2].toLowerCase().trim();
    const dayOfWeek = DAY_NAMES[dayName];
    
    if (occurrence >= 1 && occurrence <= 4 && dayOfWeek !== undefined) {
      return { occurrence, dayOfWeek };
    }
  }
  
  // Si no es un patrón, intentar parsear como número simple (0-6)
  const simpleDay = parseInt(assignedDay, 10);
  if (!isNaN(simpleDay) && simpleDay >= 0 && simpleDay <= 6 && assignedDay === simpleDay.toString()) {
    // Es un día de la semana simple, devolver null para indicar que no es un patrón
    return null;
  }
  
  return null;
}

/**
 * Calcula la fecha de la N-ésima ocurrencia de un día de la semana en un mes
 * @param year Año
 * @param month Mes (0-11)
 * @param dayOfWeek Día de la semana (0=domingo, 1=lunes, ...)
 * @param occurrence Ocurrencia (1=primera, 2=segunda, ...)
 * @returns Fecha o null si no existe esa ocurrencia en el mes
 */
function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, occurrence: number): Date | null {
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay();
  
  // Calcular cuántos días hasta el primer día de la semana deseado
  let daysUntilTarget = (dayOfWeek - firstDayOfWeek + 7) % 7;
  
  // Calcular la fecha de la N-ésima ocurrencia
  const targetDate = 1 + daysUntilTarget + (occurrence - 1) * 7;
  
  // Verificar que la fecha esté dentro del mes
  const result = new Date(year, month, targetDate);
  if (result.getMonth() !== month) {
    return null; // La ocurrencia no existe en este mes
  }
  
  return result;
}

const SPANISH_HOLIDAYS = [
  // 2025
  '2025-12-06', '2025-12-08', '2025-12-25',
  // 2026
  '2026-01-01', '2026-01-06', '2026-04-03', '2026-04-06',
  '2026-05-01', '2026-08-15', '2026-10-12', '2026-11-01',
  '2026-12-06', '2026-12-08', '2026-12-25',
  // 2027
  '2027-01-01', '2027-01-06', '2027-03-26', '2027-03-29',
  '2027-05-01', '2027-08-15', '2027-10-12', '2027-11-01',
  '2027-12-06', '2027-12-08', '2027-12-25',
];

/**
 * Verifica si una empresa necesita slots generados y los crea automáticamente
 * @param companyId ID de la empresa
 * @param companyHasFullMonth Si tiene calendario mensual completo
 * @param assignedDay Día de la semana asignado (0=domingo, 1=lunes, ..., 6=sábado) o cadena vacía
 * @param assignedDay2 Día adicional 2 (opcional)
 * @param assignedDay3 Día adicional 3 (opcional)
 */
export async function ensureSlotsForCompany(
  companyId: number, 
  companyHasFullMonth: boolean, 
  assignedDay?: string,
  assignedDay2?: string,
  assignedDay3?: string
) {
  // Si no tiene calendario completo ni días asignados, no generamos slots
  const hasAssignedDays = (assignedDay && assignedDay !== '') || 
                          (assignedDay2 && assignedDay2 !== '') || 
                          (assignedDay3 && assignedDay3 !== '');
  
  if (!companyHasFullMonth && !hasAssignedDays) {
    return;
  }

  const db = await getDb();
  if (!db) return;

  const { slots, serviceTypes, companies } = await import("../../drizzle/schema");
  const { and, eq, gte } = await import("drizzle-orm");

  // Verificar hasta qué fecha tiene slots
  const { desc } = await import("drizzle-orm");
  
  const existingSlots = await db
    .select({ maxDate: slots.date })
    .from(slots)
    .where(eq(slots.companyId, companyId))
    .orderBy(desc(slots.date))
    .limit(1);

  const today = new Date();
  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  let startDate: Date;
  
  if (existingSlots.length === 0) {
    // No tiene slots, empezar desde hoy
    startDate = today;
  } else {
    // Tiene slots, verificar si necesita extender
    const lastSlotDate = new Date(existingSlots[0].maxDate);
    
    if (lastSlotDate >= oneMonthFromNow) {
      // Ya tiene suficientes slots
      return;
    }
    
    // Empezar desde el día siguiente al último slot
    startDate = new Date(lastSlotDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  // Obtener todos los tipos de servicio
  const allServices = await db.select().from(serviceTypes);

  console.log(`[Auto-generate] Generando slots para empresa ${companyId} desde ${startDate.toISOString().split('T')[0]} hasta ${oneMonthFromNow.toISOString().split('T')[0]}`);

  // Preparar todos los slots en memoria primero (batch insert)
  const slotsToInsert: any[] = [];
  const now = new Date();

  // Parsear los patrones de días asignados (hasta 3)
  const assignedDays = [assignedDay, assignedDay2, assignedDay3].filter(day => day && day !== '');
  console.log(`[Auto-generate] Días asignados recibidos:`, { assignedDay, assignedDay2, assignedDay3 });
  console.log(`[Auto-generate] Días filtrados:`, assignedDays);
  const dayPatterns = assignedDays.map(day => parseAssignedDayPattern(day!)).filter(p => p !== null);
  console.log(`[Auto-generate] Patrones parseados:`, dayPatterns);
  const assignedDayNums = assignedDays
    .map(day => {
      const pattern = parseAssignedDayPattern(day!);
      if (pattern) return null;
      const num = parseInt(day!, 10);
      return !isNaN(num) ? num : null;
    })
    .filter(n => n !== null);
  
  // Si tiene patrones (ej: "1r Miércoles"), generar solo esas fechas específicas
  if (dayPatterns.length > 0) {
    // Generar solo la N-ésima ocurrencia de cada mes para cada patrón
    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = oneMonthFromNow.getMonth();
    const endYear = oneMonthFromNow.getFullYear();
    
    // Iterar sobre cada patrón de día asignado
    for (const dayPattern of dayPatterns) {
      for (let year = startYear; year <= endYear; year++) {
        const monthStart = year === startYear ? startMonth : 0;
        const monthEnd = year === endYear ? endMonth : 11;
        
        for (let month = monthStart; month <= monthEnd; month++) {
          const targetDate = getNthDayOfMonth(year, month, dayPattern.dayOfWeek, dayPattern.occurrence);
          
          if (!targetDate || targetDate < startDate || targetDate > oneMonthFromNow) {
            continue;
          }
          
          const dateStr = targetDate.toISOString().split('T')[0];
          
          // Excluir festivos
          if (SPANISH_HOLIDAYS.includes(dateStr)) {
            continue;
          }
          
          // Crear slots para esta fecha específica
          for (const service of allServices) {
          // Shadowing usa los mismos horarios que Mentoring
          const isMentoringOrShadowing = service.slug === 'mentoring' || service.slug === 'shadowing';
          const startHour = isMentoringOrShadowing ? 11 : 10;
          const endHour = isMentoringOrShadowing ? 18 : 17;
          const maxVolunteers = service.slug === 'mentoring' ? 3 : 2;

          for (let hour = startHour; hour < endHour; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

            slotsToInsert.push({
              companyId,
              serviceTypeId: service.id,
              date: dateStr,
              startTime,
              endTime,
              maxVolunteers,
              currentVolunteers: 0,
              active: 1,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }
    }
    }
  } else {
    // Lógica original para días de semana fijos o calendario completo
    for (let d = new Date(startDate); d <= oneMonthFromNow; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      
      // Si tiene días asignados específicos, solo generar para esos días
      if (assignedDayNums.length > 0 && !assignedDayNums.includes(dayOfWeek)) {
        continue;
      }
      
      // Excluir fines de semana y festivos
      if (dayOfWeek === 0 || dayOfWeek === 6 || SPANISH_HOLIDAYS.includes(dateStr)) {
        continue;
      }

      // Crear slots para cada tipo de servicio
      for (const service of allServices) {
        // Shadowing usa los mismos horarios que Mentoring
        const isMentoringOrShadowing = service.slug === 'mentoring' || service.slug === 'shadowing';
        const startHour = isMentoringOrShadowing ? 11 : 10;
        const endHour = isMentoringOrShadowing ? 18 : 17;
        const maxVolunteers = service.slug === 'mentoring' ? 3 : 2;

        for (let hour = startHour; hour < endHour; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;

          slotsToInsert.push({
            companyId,
            serviceTypeId: service.id,
            date: dateStr,
            startTime,
            endTime,
            maxVolunteers,
            currentVolunteers: 0,
            active: 1,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }
  }

  // Insertar en lotes pequeños usando la función existente
  const { bulkCreateSlots } = await import("../db");
  const BATCH_SIZE = 20; // Lotes muy pequeños para evitar errores
  let totalCreated = 0;
  const totalSlots = slotsToInsert.length;
  
  console.log(`[Auto-generate] Insertando ${totalSlots} slots en lotes de ${BATCH_SIZE}...`);
  
  for (let i = 0; i < slotsToInsert.length; i += BATCH_SIZE) {
    const batch = slotsToInsert.slice(i, i + BATCH_SIZE);
    await bulkCreateSlots(batch);
    totalCreated += batch.length;
    
    if (totalCreated % 100 === 0 || totalCreated === totalSlots) {
      console.log(`[Auto-generate] Progreso: ${totalCreated}/${totalSlots} slots (${Math.round(totalCreated/totalSlots*100)}%)`);
    }
  }

  console.log(`[Auto-generate] Creados ${totalCreated} slots para empresa ${companyId}`);
}

/**
 * Tarea de mantenimiento: verificar todas las empresas con calendario completo
 * y asegurar que tengan slots para los próximos 3 meses
 */
export async function maintainFullMonthSlots() {
  const db = await getDb();
  if (!db) return;

  const { companies } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  // Obtener todas las empresas con calendario completo
  const fullMonthCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.fullMonthCalendar, 1));

  console.log(`[Maintenance] Verificando ${fullMonthCompanies.length} empresas con calendario completo`);

  for (const company of fullMonthCompanies) {
    await ensureSlotsForCompany(
      company.id, 
      true,
      company.assignedDay || '',
      company.assignedDay2 || '',
      company.assignedDay3 || ''
    );
  }

  console.log(`[Maintenance] Mantenimiento completado`);
}
