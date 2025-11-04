import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log("🗓️  Generando slots para empresas con calendario mensual completo\n");

// Festivos nacionales de España 2025-2026
const holidays = [
  '2025-12-06', '2025-12-08', '2025-12-25',
  '2026-01-01', '2026-01-06', '2026-04-03', '2026-04-06',
  '2026-05-01', '2026-08-15', '2026-10-12', '2026-11-01',
  '2026-12-06', '2026-12-08', '2026-12-25'
];

try {
  // 1. Obtener empresas con fullMonthCalendar = 1
  const [companies] = await connection.execute(
    "SELECT id, name FROM companies WHERE fullMonthCalendar = 1"
  );

  console.log(`📊 Empresas con calendario mensual completo: ${companies.length}\n`);

  if (companies.length === 0) {
    console.log("✅ No hay empresas con calendario mensual completo activado");
    process.exit(0);
  }

  // 2. Obtener tipos de servicio
  const [services] = await connection.execute(
    "SELECT id, name, slug FROM service_types"
  );

  console.log(`📋 Tipos de servicio disponibles: ${services.length}\n`);

  // 3. Generar fechas desde diciembre 2025 hasta diciembre 2026
  const startDate = new Date('2025-12-01');
  const endDate = new Date('2026-12-31');
  const allDates = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    
    // Excluir fines de semana y festivos
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateStr)) {
      allDates.push(dateStr);
    }
  }

  console.log(`📅 Días laborables a generar: ${allDates.length} días\n`);

  let totalSlotsCreated = 0;

  // 4. Para cada empresa, generar slots
  for (const company of companies) {
    console.log(`\n🏢 Procesando: ${company.name} (ID: ${company.id})`);
    
    // Verificar si ya tiene slots
    const [existingSlots] = await connection.execute(
      "SELECT COUNT(*) as count FROM slots WHERE companyId = ?",
      [company.id]
    );
    
    if (existingSlots[0].count > 0) {
      console.log(`   ⚠️  Ya tiene ${existingSlots[0].count} slots. Saltando...`);
      continue;
    }

    for (const service of services) {
      // Configuración según tipo de servicio
      const isMentoring = service.slug === 'mentoring';
      const startHour = isMentoring ? 11 : 10;
      const endHour = isMentoring ? 18 : 17;
      const maxVolunteers = isMentoring ? 3 : 2;
      const slotDuration = 1; // 1 hora

      let slotsForService = 0;

      for (const date of allDates) {
        for (let hour = startHour; hour < endHour; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
          const endTime = `${(hour + slotDuration).toString().padStart(2, '0')}:00:00`;

          await connection.execute(
            `INSERT INTO slots (companyId, serviceTypeId, date, startTime, endTime, maxVolunteers, currentVolunteers, active, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, 0, 1, NOW(), NOW())`,
            [company.id, service.id, date, startTime, endTime, maxVolunteers]
          );

          slotsForService++;
          totalSlotsCreated++;
        }
      }

      console.log(`   ✅ ${service.name}: ${slotsForService} slots creados`);
    }
  }

  console.log(`\n\n🎉 COMPLETADO`);
  console.log(`   Total de slots creados: ${totalSlotsCreated}`);
  console.log(`   Empresas procesadas: ${companies.length}`);
  console.log(`   Período: Diciembre 2025 - Diciembre 2026`);

} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
} finally {
  await connection.end();
}
