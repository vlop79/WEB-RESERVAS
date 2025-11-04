import { getDb } from "./db";
import { serviceTypes } from "../drizzle/schema";

/**
 * Script para inicializar los tipos de servicio (Mentoring y Estilismo)
 * Solo se ejecuta una vez para crear los servicios base
 */
async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding service types...");

  // Verificar si ya existen servicios
  const existing = await db.select().from(serviceTypes);
  if (existing.length > 0) {
    console.log("Service types already exist, skipping seed");
    return;
  }

  // Crear los dos tipos de servicio
  await db.insert(serviceTypes).values([
    {
      name: "Mentoring",
      slug: "mentoring",
      description: "Sesiones de mentoría virtuales con candidatas de FQT (Google Meet)",
      startHour: 11,
      endHour: 18,
      maxVolunteersPerSlot: 3,
      modality: "virtual" as const,
    },
    {
      name: "Estilismo",
      slug: "estilismo",
      description: "Sesiones presenciales de asesoramiento de imagen en oficinas FQT",
      startHour: 10,
      endHour: 17,
      maxVolunteersPerSlot: 2,
      modality: "presencial" as const,
    },
  ]);

  console.log("Service types seeded successfully!");
}

seed().catch(console.error);
