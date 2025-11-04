import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function createTestCompanyUser() {
  try {
    // Crear usuario de empresa de prueba
    const testUser = {
      openId: "test-company-accenture-12345",
      name: "María López - Accenture",
      email: "maria.lopez@accenture.com",
      loginMethod: "email",
      role: "user", // Rol normal de empresa
    };

    await db.insert(users).values(testUser).onDuplicateKeyUpdate({
      set: {
        name: testUser.name,
        email: testUser.email,
        lastSignedIn: new Date(),
      },
    });

    console.log("✅ Usuario de empresa de prueba creado exitosamente:");
    console.log("   Email:", testUser.email);
    console.log("   OpenID:", testUser.openId);
    console.log("   Nombre:", testUser.name);
    console.log("\n📝 Para iniciar sesión en el portal de empresa:");
    console.log("   1. Ve a /login");
    console.log("   2. Usa el email:", testUser.email);
    console.log("   3. Contraseña: (cualquiera, ya que es sistema de prueba)");
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    process.exit(1);
  }
}

createTestCompanyUser();
