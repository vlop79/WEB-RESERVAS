# Guía: Cómo Crear Usuarios Empresa

Esta guía explica el proceso para crear usuarios con acceso al **CompanyDashboard** para cualquier empresa registrada en el sistema.

## 📋 Requisitos Previos

1. La empresa debe estar registrada en la tabla `companies`
2. Tener acceso al panel de administración o a la base de datos

## 🔧 Método 1: Desde el Panel de Administración (Recomendado)

### Paso 1: Acceder al Panel de Usuarios

1. Iniciar sesión como administrador en `/admin`
2. Navegar a la sección **"Gestión de Usuarios"**
3. Hacer clic en el botón **"Nuevo Usuario"**

### Paso 2: Completar el Formulario

Ingresar los siguientes datos:

- **Nombre**: Nombre completo del usuario (ej: "Juan Pérez - AXA")
- **Email**: Email corporativo del usuario (ej: "juan.perez@axa.com")
- **Rol**: Seleccionar **"empresa"**
- **Empresa**: Seleccionar la empresa de la lista desplegable
- **Contraseña**: Crear una contraseña segura (mínimo 6 caracteres)

### Paso 3: Guardar y Notificar

1. Hacer clic en **"Crear Usuario"**
2. El sistema creará automáticamente:
   - El usuario en la tabla `users`
   - La relación en la tabla `companyUsers`
3. Enviar las credenciales al usuario por email seguro

## 🔧 Método 2: Directamente en la Base de Datos

### Paso 1: Generar Hash de Contraseña

Ejecutar en el servidor:

```bash
cd /home/ubuntu/fqt-reservas
node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('contraseña_deseada', 10, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hash:', hash);
});
setTimeout(() => {}, 1000);
"
```

### Paso 2: Crear Usuario en la Base de Datos

```sql
-- 1. Crear el usuario
INSERT INTO users (openId, name, email, loginMethod, role, password, createdAt, updatedAt, lastSignedIn)
VALUES (
  'unique-openid-001',           -- Identificador único (ej: 'empresa-axa-001')
  'Nombre del Usuario',          -- Nombre completo
  'email@empresa.com',           -- Email corporativo
  'password',                    -- Método de login
  'empresa',                     -- Rol DEBE ser 'empresa'
  '$2b$10$hash_generado...',    -- Hash de bcrypt del paso anterior
  NOW(),                         -- Fecha de creación
  NOW(),                         -- Fecha de actualización
  NOW()                          -- Último inicio de sesión
);

-- 2. Obtener el ID del usuario recién creado
SET @userId = (SELECT id FROM users WHERE openId = 'unique-openid-001');

-- 3. Obtener el ID de la empresa
SET @companyId = (SELECT id FROM companies WHERE name = 'Nombre de la Empresa');

-- 4. Vincular usuario con empresa
INSERT INTO companyUsers (userId, companyId, createdAt, updatedAt)
VALUES (@userId, @companyId, NOW(), NOW());

-- 5. Verificar que se creó correctamente
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
WHERE u.openId = 'unique-openid-001';
```

## 🔐 Credenciales de Prueba Existentes

Actualmente hay usuarios de prueba creados para demostración:

| Empresa | Email | Contraseña | Estado |
|---------|-------|------------|--------|
| AXA | prueba-axa@test.com | test123 | ✅ Activo |
| Deloitte | prueba-deloitte@test.com | deloitte123 | ✅ Activo |
| Amazon | prueba-amazon@test.com | amazon123 | ✅ Activo |
| CBRE | prueba-cbre@test.com | cbre123 | ✅ Activo |

**⚠️ IMPORTANTE:** Estos usuarios son solo para pruebas. Eliminar o cambiar contraseñas antes de producción.

## 📊 Qué Verá el Usuario Empresa

Una vez creado el usuario, al iniciar sesión en `/login` será redirigido automáticamente a `/company/dashboard` donde verá:

### Estadísticas de Impacto
- **Voluntarias Ayudadas**: Total de mujeres que han reservado sesiones con su empresa
- **Sesiones Completadas**: Número de sesiones de mentoring y estilismo realizadas
- **Horas de Voluntariado**: Tiempo total dedicado por los anfitriones de su empresa
- **Próximas Sesiones**: Reservas confirmadas pendientes de realizar

### Tabla de Reservas
Lista completa de todas las reservas **solo de su empresa**, con:
- Nombre y email de la voluntaria
- Servicio solicitado (Mentoring o Estilismo)
- Fecha y hora de la sesión
- Oficina donde se realizará
- Anfitrión asignado
- Estado de la reserva (Pendiente, Confirmada, Completada, Cancelada)

### Filtros Disponibles
- Todas las fechas
- Hoy
- Esta semana
- Este mes
- Último mes
- Este año
- Próximas sesiones
- Sesiones pasadas

## 🔒 Seguridad y Aislamiento de Datos

El sistema garantiza que:

1. ✅ Cada usuario empresa **solo ve datos de su propia empresa**
2. ✅ El filtrado se realiza en el **backend** (no puede ser manipulado desde el frontend)
3. ✅ El `companyId` se asigna **automáticamente** al autenticarse
4. ✅ Todas las queries verifican el `ctx.user.companyId` antes de devolver datos
5. ✅ No es posible acceder a datos de otras empresas, incluso modificando URLs

## 🛠️ Arquitectura Técnica

### Flujo de Autenticación

```
1. Usuario ingresa email/contraseña en /login
   ↓
2. Backend verifica credenciales en tabla `users`
   ↓
3. Si rol = "empresa", busca en `companyUsers` el companyId
   ↓
4. Crea sesión con user.companyId incluido
   ↓
5. Redirige a /company/dashboard
   ↓
6. Todos los endpoints usan ctx.user.companyId para filtrar
```

### Tablas Involucradas

**`users`**: Información básica del usuario
- `id`: ID único del usuario
- `openId`: Identificador único para OAuth/login
- `name`: Nombre completo
- `email`: Email de contacto
- `role`: **"empresa"** para usuarios de dashboard
- `password`: Hash bcrypt de la contraseña

**`companyUsers`**: Relación usuario-empresa
- `userId`: FK a `users.id`
- `companyId`: FK a `companies.id`

**`companies`**: Información de empresas
- `id`: ID único de la empresa
- `name`: Nombre de la empresa
- `slug`: URL-friendly identifier

### Endpoints tRPC

Los usuarios empresa tienen acceso a estos endpoints:

- **`companyUser.getMyCompany`**: Obtiene información de su empresa
- **`companyUser.getMyCompanyBookings`**: Lista de reservas filtradas por su empresa
- **`companyUser.getMyCompanyStats`**: Estadísticas de impacto de su empresa

Todos estos endpoints verifican:
```typescript
if (ctx.user.role !== "empresa") {
  throw new TRPCError({ code: "FORBIDDEN" });
}
if (!ctx.user.companyId) {
  throw new TRPCError({ code: "BAD_REQUEST", message: "Usuario no tiene empresa asignada" });
}
```

## 📝 Checklist para Crear Usuario Empresa

- [ ] Verificar que la empresa existe en `companies`
- [ ] Generar hash bcrypt de la contraseña
- [ ] Crear usuario con rol "empresa" en `users`
- [ ] Vincular usuario con empresa en `companyUsers`
- [ ] Verificar la relación con query de validación
- [ ] Probar login con las credenciales
- [ ] Verificar que el dashboard muestre datos correctos
- [ ] Enviar credenciales al usuario de forma segura
- [ ] Solicitar cambio de contraseña en primer login (recomendado)

## 🚀 Escalabilidad

El sistema está diseñado para soportar:

- ✅ **Múltiples usuarios por empresa**: Crear varios usuarios con el mismo `companyId`
- ✅ **Múltiples empresas**: Cada empresa tiene su propio dashboard aislado
- ✅ **Crecimiento ilimitado**: No hay límite en el número de empresas o usuarios
- ✅ **Rendimiento optimizado**: Las queries usan índices en `companyId` para búsquedas rápidas

## 🔄 Gestión de Usuarios

### Cambiar Empresa de un Usuario

```sql
UPDATE companyUsers 
SET companyId = (SELECT id FROM companies WHERE name = 'Nueva Empresa')
WHERE userId = (SELECT id FROM users WHERE email = 'usuario@email.com');
```

### Desactivar Usuario

```sql
-- Opción 1: Cambiar rol (recomendado)
UPDATE users 
SET role = 'user' 
WHERE email = 'usuario@email.com';

-- Opción 2: Eliminar relación con empresa
DELETE FROM companyUsers 
WHERE userId = (SELECT id FROM users WHERE email = 'usuario@email.com');
```

### Resetear Contraseña

```bash
# Generar nuevo hash
node -e "
const bcrypt = require('bcrypt');
bcrypt.hash('nueva_contraseña', 10, (err, hash) => {
  console.log('Nuevo hash:', hash);
});
setTimeout(() => {}, 1000);
"

# Actualizar en base de datos
UPDATE users 
SET password = '$2b$10$nuevo_hash...' 
WHERE email = 'usuario@email.com';
```

## 📞 Soporte

Para problemas o dudas sobre la creación de usuarios empresa:

1. Revisar los logs del servidor en caso de errores de autenticación
2. Verificar que la relación en `companyUsers` existe
3. Confirmar que el rol del usuario es exactamente "empresa"
4. Validar que el hash de contraseña se generó correctamente

---

**Última actualización**: 1 de noviembre de 2025  
**Versión del sistema**: 8a06d494
