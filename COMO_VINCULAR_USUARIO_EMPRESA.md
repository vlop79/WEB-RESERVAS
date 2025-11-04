# 📘 Cómo Vincular un Usuario con una Empresa

Esta guía te muestra **paso a paso** cómo vincular un usuario existente o nuevo con una empresa para que tenga acceso al CompanyDashboard.

---

## 🎯 Objetivo

Crear la relación en la tabla `companyUsers` que conecta:
- Un **usuario** (de la tabla `users`)
- Con una **empresa** (de la tabla `companies`)

---

## 📊 Estructura de las Tablas

### Tabla `users`
```
id (PK) | openId | name | email | role | password
--------|--------|------|-------|------|----------
690046  | test-axa-001 | Usuario Prueba AXA | prueba-axa@test.com | empresa | $2b$10$...
```

### Tabla `companies`
```
id (PK) | name | slug
--------|------|------
30145   | AXA  | /reservar/axa
```

### Tabla `companyUsers` (La que vincula)
```
id (PK) | userId (FK) | companyId (FK) | createdAt | updatedAt
--------|-------------|----------------|-----------|----------
1       | 690046      | 30145          | 2025-11-01| 2025-11-01
```

**Explicación:**
- `userId` → Apunta al `id` del usuario en la tabla `users`
- `companyId` → Apunta al `id` de la empresa en la tabla `companies`

---

## 🔧 Método 1: SQL Directo (Más Rápido)

### Paso 1: Identificar los IDs

Primero necesitas saber:
1. El **ID del usuario** que quieres vincular
2. El **ID de la empresa** con la que lo vincularás

```sql
-- Ver usuarios disponibles
SELECT id, name, email, role FROM users WHERE role = 'empresa';

-- Ver empresas disponibles
SELECT id, name, slug FROM companies ORDER BY name;
```

**Ejemplo de resultado:**

**Usuarios:**
| id | name | email | role |
|----|------|-------|------|
| 690046 | Usuario Prueba AXA | prueba-axa@test.com | empresa |
| 690107 | Usuario Prueba Amazon | prueba-amazon@test.com | empresa |

**Empresas:**
| id | name | slug |
|----|------|------|
| 30145 | AXA | /reservar/axa |
| 30158 | Amazon | /reservar/amazon |
| 30159 | Deloitte | /reservar/deloitte |

### Paso 2: Crear la Vinculación

Una vez que tienes los IDs, creas el registro en `companyUsers`:

```sql
-- Vincular usuario 690046 (Usuario Prueba AXA) con empresa 30145 (AXA)
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (690046, 30145, NOW(), NOW());
```

### Paso 3: Verificar la Vinculación

```sql
-- Ver todas las vinculaciones con nombres legibles
SELECT 
  cu.id,
  cu.userId,
  u.name as userName,
  u.email,
  cu.companyId,
  c.name as companyName
FROM companyUsers cu
JOIN users u ON cu.userId = u.id
JOIN companies c ON cu.companyId = c.id
ORDER BY c.name, u.name;
```

**Resultado esperado:**
| id | userId | userName | email | companyId | companyName |
|----|--------|----------|-------|-----------|-------------|
| 1 | 690046 | Usuario Prueba AXA | prueba-axa@test.com | 30145 | AXA |

---

## 🔧 Método 2: Proceso Completo (Usuario Nuevo + Vinculación)

Si necesitas crear un usuario **desde cero** y vincularlo:

### Paso 1: Generar Hash de Contraseña

```bash
cd /home/ubuntu/fqt-reservas
node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('contraseña_deseada', 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hash generado:', hash);
});
setTimeout(() => {}, 1000);
"
```

**Ejemplo de salida:**
```
Hash generado: $2b$10$XYZ123abc...
```

### Paso 2: Crear el Usuario

```sql
-- Crear usuario con rol 'empresa'
INSERT INTO users (openId, name, email, loginMethod, role, password, createdAt, updatedAt, lastSignedIn)
VALUES (
  'empresa-nueva-001',                    -- openId único
  'Juan Pérez',                           -- Nombre
  'juan.perez@empresa.com',               -- Email
  'password',                             -- Método de login
  'empresa',                              -- ROL IMPORTANTE: debe ser 'empresa'
  '$2b$10$XYZ123abc...',                  -- Hash del paso anterior
  NOW(),
  NOW(),
  NOW()
);
```

### Paso 3: Obtener el ID del Usuario Recién Creado

```sql
-- Opción A: Ver el último usuario creado
SELECT id, name, email FROM users ORDER BY id DESC LIMIT 1;

-- Opción B: Buscar por email
SELECT id, name, email FROM users WHERE email = 'juan.perez@empresa.com';
```

**Resultado:**
| id | name | email |
|----|------|-------|
| 690200 | Juan Pérez | juan.perez@empresa.com |

### Paso 4: Obtener el ID de la Empresa

```sql
-- Buscar la empresa por nombre
SELECT id, name FROM companies WHERE name = 'Nombre de la Empresa';
```

**Ejemplo:**
```sql
SELECT id, name FROM companies WHERE name = 'Deloitte';
```

**Resultado:**
| id | name |
|----|------|
| 30159 | Deloitte |

### Paso 5: Vincular Usuario con Empresa

```sql
-- Vincular el usuario 690200 con la empresa 30159 (Deloitte)
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (690200, 30159, NOW(), NOW());
```

### Paso 6: Verificación Final

```sql
-- Verificar que todo está correcto
SELECT 
  u.id as userId,
  u.name as userName,
  u.email,
  u.role,
  cu.companyId,
  c.name as companyName
FROM users u
JOIN companyUsers cu ON u.id = cu.userId
JOIN companies c ON cu.companyId = c.id
WHERE u.email = 'juan.perez@empresa.com';
```

**Resultado esperado:**
| userId | userName | email | role | companyId | companyName |
|--------|----------|-------|------|-----------|-------------|
| 690200 | Juan Pérez | juan.perez@empresa.com | empresa | 30159 | Deloitte |

---

## 🔧 Método 3: Script SQL Todo-en-Uno

Puedes ejecutar todo en un solo script:

```sql
-- ============================================
-- SCRIPT COMPLETO: Crear Usuario y Vincularlo
-- ============================================

-- 1. Crear el usuario
INSERT INTO users (openId, name, email, loginMethod, role, password, createdAt, updatedAt, lastSignedIn)
VALUES (
  'empresa-nueva-002',
  'María García',
  'maria.garcia@amazon.com',
  'password',
  'empresa',
  '$2b$10$TU_HASH_AQUI',
  NOW(),
  NOW(),
  NOW()
);

-- 2. Guardar el ID del usuario en una variable
SET @nuevoUserId = LAST_INSERT_ID();

-- 3. Obtener el ID de la empresa
SET @empresaId = (SELECT id FROM companies WHERE name = 'Amazon');

-- 4. Crear la vinculación
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (@nuevoUserId, @empresaId, NOW(), NOW());

-- 5. Verificar
SELECT 
  u.id as userId,
  u.name as userName,
  u.email,
  cu.companyId,
  c.name as companyName
FROM users u
JOIN companyUsers cu ON u.id = cu.userId
JOIN companies c ON cu.companyId = c.id
WHERE u.id = @nuevoUserId;
```

---

## ✅ Checklist de Verificación

Después de crear la vinculación, verifica que todo funcione:

- [ ] **Query de verificación ejecutada** - Confirma que el registro existe en `companyUsers`
- [ ] **Usuario puede hacer login** - Prueba con email y contraseña en `/login`
- [ ] **Redirección correcta** - Debe ir a `/company/dashboard` automáticamente
- [ ] **Dashboard muestra empresa correcta** - Logo y nombre de la empresa aparecen
- [ ] **Datos filtrados correctamente** - Solo ve reservas de su empresa

---

## 🔍 Ejemplo Completo Real

Aquí un ejemplo con los usuarios de prueba que ya existen:

```sql
-- Ver las vinculaciones actuales
SELECT 
  u.name as 'Usuario',
  u.email as 'Email',
  c.name as 'Empresa',
  cu.createdAt as 'Vinculado el'
FROM companyUsers cu
JOIN users u ON cu.userId = u.id
JOIN companies c ON cu.companyId = c.id
ORDER BY cu.createdAt DESC;
```

**Resultado actual del sistema:**

| Usuario | Email | Empresa | Vinculado el |
|---------|-------|---------|--------------|
| Usuario Prueba CBRE | prueba-cbre@test.com | CBRE | 2025-11-01 09:30:00 |
| Usuario Prueba Amazon | prueba-amazon@test.com | Amazon | 2025-11-01 09:30:00 |
| Usuario Prueba Deloitte | prueba-deloitte@test.com | Deloitte | 2025-11-01 09:30:00 |
| Usuario Prueba AXA | prueba-axa@test.com | AXA | 2025-11-01 09:24:00 |

---

## 🚨 Errores Comunes

### Error: "Usuario no tiene empresa asignada"

**Causa:** No existe el registro en `companyUsers`

**Solución:**
```sql
-- Verificar si existe la vinculación
SELECT * FROM companyUsers WHERE userId = TU_USER_ID;

-- Si no existe, crearla
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (TU_USER_ID, TU_COMPANY_ID, NOW(), NOW());
```

### Error: "Duplicate entry"

**Causa:** Ya existe una vinculación para ese usuario

**Solución:**
```sql
-- Ver la vinculación actual
SELECT * FROM companyUsers WHERE userId = TU_USER_ID;

-- Si quieres cambiar la empresa, actualiza en lugar de insertar
UPDATE companyUsers 
SET companyId = NUEVA_COMPANY_ID, updatedAt = NOW()
WHERE userId = TU_USER_ID;
```

### Error: "Foreign key constraint fails"

**Causa:** El `userId` o `companyId` no existe en sus tablas respectivas

**Solución:**
```sql
-- Verificar que el usuario existe
SELECT id, name FROM users WHERE id = TU_USER_ID;

-- Verificar que la empresa existe
SELECT id, name FROM companies WHERE id = TU_COMPANY_ID;
```

---

## 📝 Resumen Rápido

**Para vincular un usuario existente:**

```sql
-- 1. Buscar IDs
SELECT id FROM users WHERE email = 'email@usuario.com';
SELECT id FROM companies WHERE name = 'Nombre Empresa';

-- 2. Crear vinculación
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (ID_USUARIO, ID_EMPRESA, NOW(), NOW());
```

**Para crear usuario nuevo y vincularlo:**

```sql
-- 1. Generar hash de contraseña (en terminal)
-- 2. Crear usuario con rol 'empresa'
-- 3. Obtener ID del usuario con LAST_INSERT_ID()
-- 4. Insertar en companyUsers con userId y companyId
```

---

## 🎓 Conceptos Clave

1. **`userId`** = ID del registro en la tabla `users`
2. **`companyId`** = ID del registro en la tabla `companies`
3. **`companyUsers`** = Tabla de relación (junction table) que conecta ambas
4. **Rol 'empresa'** = El usuario DEBE tener este rol para acceder al CompanyDashboard
5. **Un usuario puede tener solo una empresa** = Actualmente el sistema soporta 1 empresa por usuario

---

**¿Necesitas ayuda?** Revisa la tabla `companyUsers` para ver ejemplos reales de vinculaciones existentes.

