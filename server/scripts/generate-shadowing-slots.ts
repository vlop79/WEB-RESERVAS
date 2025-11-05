/**
 * Script para generar slots de Shadowing para todas las empresas existentes
 * que ya tienen slots de Mentoring
 */

import { getDb } from "../db";
import { ensureSlotsForCompany } from "../lib/auto-generate-slots";

async function generateShadowingSlots() {
  const db = await getDb();
  if (!db) {
    console.error("No se pudo conectar a la base de datos");
    process.exit(1);
  }

  const { companies } = await import("../../drizzle/schema");
  const { eq } = await import("drizzle-orm");

  // Obtener todas las empresas activas
  const activeCompanies = await db
    .select()
    .from(companies)
    .where(eq(companies.active, 1));

  console.log(`\n🚀 Generando slots de Shadowing para ${activeCompanies.length} empresas activas...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const company of activeCompanies) {
    try {
      console.log(`\n📍 Procesando: ${company.name}`);
      console.log(`   - Día asignado: ${company.assignedDay || 'N/A'}`);
      console.log(`   - Calendario completo: ${company.fullMonthCalendar ? 'Sí' : 'No'}`);

      // La función ensureSlotsForCompany ya genera slots para TODOS los servicios
      // incluyendo Mentoring, Estilismo y Shadowing
      await ensureSlotsForCompany(
        company.id,
        company.fullMonthCalendar === 1,
        company.assignedDay || undefined
      );

      successCount++;
      console.log(`   ✅ Completado`);
    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error: ${error}`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Empresas procesadas exitosamente: ${successCount}`);
  console.log(`❌ Empresas con errores: ${errorCount}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(0);
}

// Ejecutar el script
generateShadowingSlots().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
