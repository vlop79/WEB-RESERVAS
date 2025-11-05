import { drizzle } from "drizzle-orm/mysql2";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const db = drizzle(process.env.DATABASE_URL!);

async function updatePassword() {
  try {
    const hashedPassword = await bcrypt.hash("Test123!", 10);
    
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, "prueba-cbre@test.com"));
    
    console.log("✅ Contraseña actualizada correctamente");
    console.log("\nCredenciales:");
    console.log("Email: prueba-cbre@test.com");
    console.log("Contraseña: Test123!");
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  process.exit(0);
}

updatePassword();
