import { drizzle } from "drizzle-orm/mysql2";
import { users, companyUsers, companies } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const db = drizzle(process.env.DATABASE_URL!);

async function createTestCompanyUser() {
  try {
    // Primero obtener una empresa (CBRE por ejemplo)
    const [company] = await db.select().from(companies).where(eq(companies.slug, "cbre")).limit(1);
    
    if (!company) {
      console.error("No se encontró la empresa CBRE");
      return;
    }

    console.log(`Empresa encontrada: ${company.name} (ID: ${company.id})`);

    // Verificar si ya existe el usuario
    const [existingUser] = await db.select().from(users).where(eq(users.email, "empresa-cbre@test.com")).limit(1);
    
    if (existingUser) {
      console.log("El usuario ya existe. Actualizando contraseña...");
      
      // Actualizar contraseña
      const hashedPassword = await bcrypt.hash("Test123!", 10);
      await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, "empresa-cbre@test.com"));
      
      console.log("✅ Contraseña actualizada correctamente");
      console.log("\nCredenciales:");
      console.log("Email: empresa-cbre@test.com");
      console.log("Contraseña: Test123!");
      return;
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash("Test123!", 10);
    
    const [newUser] = await db.insert(users).values({
      email: "empresa-cbre@test.com",
      name: "Usuario CBRE Test",
      password: hashedPassword,
      role: "empresa",
      loginMethod: "password",
    }).$returningId();

    console.log(`Usuario creado con ID: ${newUser.id}`);

    // Vincular usuario con empresa
    await db.insert(companyUsers).values({
      userId: newUser.id,
      companyId: company.id,
    });

    console.log("✅ Usuario de empresa creado y vinculado correctamente");
    console.log("\nCredenciales:");
    console.log("Email: empresa-cbre@test.com");
    console.log("Contraseña: Test123!");
    console.log(`Empresa: ${company.name}`);
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  process.exit(0);
}

createTestCompanyUser();
