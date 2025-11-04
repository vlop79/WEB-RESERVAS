import { getDb } from "./db";
import { companies, slots } from "../drizzle/schema";

async function seedCompanies() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding companies...");

  // Crear empresas de ejemplo
  const exampleCompanies = [
    {
      name: "Deloitte",
      slug: "deloitte",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
      active: 1,
    },
    {
      name: "Accenture",
      slug: "accenture",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
      active: 1,
    },
    {
      name: "PwC",
      slug: "pwc",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/PwC_Logo.svg",
      active: 1,
    },
  ];

  for (const company of exampleCompanies) {
    await db.insert(companies).values(company).onDuplicateKeyUpdate({ set: { name: company.name } });
  }

  console.log("Companies seeded!");

  // Crear slots de ejemplo para Deloitte
  console.log("Creating example slots for Deloitte...");

  const deloitteCompany = await db.select().from(companies).limit(1);
  if (deloitteCompany.length > 0) {
    const companyId = deloitteCompany[0].id;

    // Slots de Mentoring (serviceTypeId = 1) para las próximas 2 semanas
    const today = new Date();
    const mentoringSlots = [];

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      // Crear slots de 11:00 a 18:00 (7 slots de 1 hora)
      for (let hour = 11; hour < 18; hour++) {
        mentoringSlots.push({
          companyId,
          serviceTypeId: 1,
          date: dateStr,
          startTime: `${hour.toString().padStart(2, "0")}:00`,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
          maxVolunteers: 1,
          currentVolunteers: 0,
          available: 1,
        });
      }
    }

    // Slots de Estilismo (serviceTypeId = 2)
    const estilismoSlots = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      // Crear slots de 10:00 a 17:00 (7 slots de 1 hora)
      for (let hour = 10; hour < 17; hour++) {
        estilismoSlots.push({
          companyId,
          serviceTypeId: 2,
          date: dateStr,
          startTime: `${hour.toString().padStart(2, "0")}:00`,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
          maxVolunteers: 2,
          currentVolunteers: 0,
          available: 1,
        });
      }
    }

    await db.insert(slots).values([...mentoringSlots, ...estilismoSlots]);
    console.log(`Created ${mentoringSlots.length} mentoring slots and ${estilismoSlots.length} estilismo slots`);
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seedCompanies().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
