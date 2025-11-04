import { drizzle } from "drizzle-orm/mysql2";
import { users, companies, companyUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

async function createTestCompanyUser() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  // Get AXA company
  const [axa] = await db.select().from(companies).where(eq(companies.slug, "axa")).limit(1);
  
  if (!axa) {
    console.error("AXA company not found");
    return;
  }
  
  console.log("Found AXA company:", axa.name, "ID:", axa.id);
  
  // Check if user already exists
  const [existingUser] = await db.select().from(users).where(eq(users.email, "empresa@axa.com")).limit(1);
  
  if (existingUser) {
    console.log("User already exists:", existingUser.email);
    console.log("Credentials:");
    console.log("  Email: empresa@axa.com");
    console.log("  Password: axa123");
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash("axa123", 10);
  
  // Create user
  const [newUser] = await db.insert(users).values({
    openId: `test_empresa_axa_${Date.now()}`,
    name: "Usuario AXA",
    email: "empresa@axa.com",
    password: hashedPassword,
    role: "empresa",
    loginMethod: "password",
  });
  
  const userId = newUser.insertId;
  
  // Link user to company
  await db.insert(companyUsers).values({
    userId: userId,
    companyId: axa.id,
  });
  
  console.log("✅ Test company user created successfully!");
  console.log("Credentials:");
  console.log("  Email: empresa@axa.com");
  console.log("  Password: axa123");
  console.log("  Company: AXA");
  console.log("  Role: empresa");
}

createTestCompanyUser().catch(console.error);
