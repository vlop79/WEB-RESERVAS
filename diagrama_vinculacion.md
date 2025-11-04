# Diagrama de Vinculación Usuario-Empresa

```
┌─────────────────────────┐
│      Tabla: users       │
├─────────────────────────┤
│ id (PK)         690046  │ ←──┐
│ openId     test-axa-001 │    │
│ name   Usuario Prueba   │    │
│ email  prueba@test.com  │    │
│ role         empresa    │    │  Relación 1:1
│ password   $2b$10$...   │    │  (Un usuario → Una empresa)
└─────────────────────────┘    │
                               │
                               │
                    ┌──────────┴──────────┐
                    │ Tabla: companyUsers │
                    ├─────────────────────┤
                    │ id (PK)           1 │
                    │ userId (FK)  690046 │ ← Apunta a users.id
                    │ companyId (FK) 30145│ ← Apunta a companies.id
                    │ createdAt  2025-... │
                    │ updatedAt  2025-... │
                    └──────────┬──────────┘
                               │
                               │
                               ↓
┌─────────────────────────┐
│   Tabla: companies      │
├─────────────────────────┤
│ id (PK)          30145  │
│ name              AXA   │
│ slug    /reservar/axa   │
│ ...                     │
└─────────────────────────┘
```

## Flujo de Vinculación

```
1. Crear/Identificar Usuario
   ↓
   INSERT INTO users (...)
   VALUES (..., role='empresa', ...)
   ↓
   Obtener userId (ej: 690046)

2. Identificar Empresa
   ↓
   SELECT id FROM companies WHERE name='AXA'
   ↓
   Obtener companyId (ej: 30145)

3. Crear Vinculación
   ↓
   INSERT INTO companyUsers (userId, companyId)
   VALUES (690046, 30145)
   ↓
   ✅ Usuario vinculado con empresa

4. Autenticación
   ↓
   Usuario hace login → Sistema busca en companyUsers
   ↓
   ctx.user.companyId = 30145
   ↓
   Dashboard muestra solo datos de AXA
```

## Ejemplo SQL Paso a Paso

```sql
-- PASO 1: Ver usuarios disponibles
SELECT id, name, email, role FROM users WHERE role = 'empresa';

-- PASO 2: Ver empresas disponibles
SELECT id, name FROM companies ORDER BY name;

-- PASO 3: Crear vinculación
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (
  690046,  -- ID del usuario (de PASO 1)
  30145,   -- ID de la empresa (de PASO 2)
  NOW(),
  NOW()
);

-- PASO 4: Verificar
SELECT 
  u.name as Usuario,
  c.name as Empresa
FROM companyUsers cu
JOIN users u ON cu.userId = u.id
JOIN companies c ON cu.companyId = c.id
WHERE cu.userId = 690046;
```

## Resultado Final

```
┌──────────────────────┬──────────┐
│      Usuario         │ Empresa  │
├──────────────────────┼──────────┤
│ Usuario Prueba AXA   │   AXA    │
└──────────────────────┴──────────┘
```

El usuario ahora puede:
✅ Hacer login en /login
✅ Ver su CompanyDashboard en /company/dashboard
✅ Ver solo las reservas de AXA
✅ Ver estadísticas de impacto de AXA
