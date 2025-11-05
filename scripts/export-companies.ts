import { getDb } from '../server/db';
import { companies } from '../drizzle/schema';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function exportCompanies() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  const allCompanies = await db.select().from(companies).orderBy(companies.name);
  
  console.log(`📊 Exportando ${allCompanies.length} empresas...`);
  
  // Export as JSON
  const jsonPath = join(process.cwd(), 'EMPRESAS_DATABASE.json');
  writeFileSync(jsonPath, JSON.stringify(allCompanies, null, 2), 'utf-8');
  
  // Export as CSV
  const csvPath = join(process.cwd(), 'EMPRESAS_DATABASE.csv');
  const headers = Object.keys(allCompanies[0]).join(',');
  const rows = allCompanies.map(company => 
    Object.values(company).map(val => 
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',')
  );
  writeFileSync(csvPath, [headers, ...rows].join('\n'), 'utf-8');
  
  console.log(`✅ JSON exportado a: ${jsonPath}`);
  console.log(`✅ CSV exportado a: ${csvPath}`);
  console.log(`\n📋 Resumen:`);
  console.log(`   Total empresas: ${allCompanies.length}`);
  console.log(`   Activas: ${allCompanies.filter(c => c.active === 1).length}`);
  console.log(`   Inactivas: ${allCompanies.filter(c => c.active === 0).length}`);
  console.log(`   Con calendario completo: ${allCompanies.filter(c => c.fullMonthCalendar === 1).length}`);
  console.log(`   Con día asignado: ${allCompanies.filter(c => c.assignedDay && c.assignedDay !== '').length}`);
}

exportCompanies().catch(console.error);
