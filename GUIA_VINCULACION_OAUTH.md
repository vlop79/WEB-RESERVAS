# Guía de Vinculación de Cuentas OAuth

## 🔗 Sistema de Vinculación Automática

El sistema ahora permite que los usuarios del equipo FQT puedan acceder **tanto con contraseña como con OAuth de Google** usando la misma cuenta.

### 📋 Cómo Funciona

Cuando un usuario inicia sesión con OAuth (Google/Microsoft/Apple) a través de Manus, el sistema:

1. **Verifica si existe una cuenta** con ese email
2. **Si existe una cuenta con contraseña** pero sin `openId`:
   - Vincula automáticamente el `openId` de OAuth a esa cuenta
   - Mantiene el rol y permisos existentes
   - Permite usar ambos métodos de login
3. **Si no existe cuenta** o ya tiene `openId`:
   - Procede con el flujo normal de OAuth

### ✅ Beneficios

- **Flexibilidad:** Los usuarios pueden elegir cómo iniciar sesión
- **Seguridad:** Mantiene los roles y permisos existentes
- **Simplicidad:** La vinculación es automática, sin pasos adicionales

---

## 👥 Para Dora Bárcenas (Comunicación)

### Método 1: Login con Contraseña

**URL:** https://3000-icqtlv98dvt363kz1eomz-f5455846.manusvm.computer/login

**Credenciales:**
- Email: comunicacion@quierotrabajo.org
- Contraseña: Comunicacion2025!

**Pasos:**
1. Ir a la URL de login
2. Ingresar email y contraseña
3. Hacer clic en "Iniciar Sesión"
4. Acceso inmediato al panel de administración

### Método 2: Login con Google OAuth

**URL:** https://3000-icqtlv98dvt363kz1eomz-f5455846.manusvm.computer/admin

**Pasos:**
1. Hacer clic en el botón "Admin" en el header
2. Hacer clic en "Iniciar sesión"
3. Seleccionar "Continue with Google"
4. **Importante:** Usar la cuenta de Google asociada a **comunicacion@quierotrabajo.org**
5. El sistema vinculará automáticamente las cuentas
6. Acceso inmediato al panel de administración

### 🔐 Primera Vez con OAuth

**La primera vez que Dora inicie sesión con Google:**

1. El sistema detectará que existe una cuenta con email `comunicacion@quierotrabajo.org`
2. Vinculará automáticamente su `openId` de Google a esa cuenta
3. Mantendrá su rol de **Administradora**
4. En el log del servidor aparecerá:
   ```
   [OAuth] Linking OAuth account to existing password account: comunicacion@quierotrabajo.org
   [Database] Successfully linked openId xxx to user yyy
   ```

### ✅ Después de la Primera Vinculación

Una vez vinculadas las cuentas, Dora podrá:

- ✅ Iniciar sesión con contraseña en `/login`
- ✅ Iniciar sesión con Google OAuth en `/admin`
- ✅ Ambos métodos acceden a la **misma cuenta**
- ✅ Mantiene rol de **Administradora** en ambos casos
- ✅ Mismos permisos y acceso en ambos métodos

---

## 🔧 Detalles Técnicos

### Cambios Implementados

1. **OAuth Callback (`server/_core/oauth.ts`)**
   - Verifica si existe usuario con el email del OAuth
   - Si existe sin `openId`, vincula las cuentas
   - Si no existe o ya tiene `openId`, flujo normal

2. **Función de Vinculación (`server/db.ts`)**
   - `linkOAuthToUser(userId, openId)`: Actualiza el `openId` de un usuario existente
   - Mantiene todos los datos existentes (rol, email, nombre, etc.)
   - Actualiza `lastSignedIn` y `updatedAt`

3. **Schema de Base de Datos**
   - Campo `openId` puede ser NULL (permite cuentas solo con contraseña)
   - Campo `password` puede ser NULL (permite cuentas solo con OAuth)
   - Ambos campos pueden estar presentes (cuenta híbrida)

### Seguridad

- ✅ La vinculación solo ocurre si el email coincide exactamente
- ✅ Solo se vinculan cuentas que **no tienen** `openId` (evita sobrescribir)
- ✅ Los roles y permisos se mantienen intactos
- ✅ Logs detallados de cada vinculación

---

## 📝 Para Otros Miembros del Equipo

Todos los miembros del equipo FQT pueden usar este sistema:

### Usuarios Actuales con Contraseña

- barcelona@quierotrabajo.org
- madrid@quierotrabajo.org
- malaga@quierotrabajo.org
- silvia@quierotrabajo.org
- proyecto@quierotrabajo.org
- comunicacion@quierotrabajo.org

**Todos pueden:**
1. Iniciar sesión con su contraseña en `/login`
2. Vincular su cuenta de Google iniciando sesión con OAuth
3. Usar ambos métodos después de la vinculación

---

## ⚠️ Notas Importantes

1. **Email debe coincidir:** La cuenta de Google debe usar el mismo email que la cuenta con contraseña
2. **Primera vez:** La vinculación ocurre automáticamente en el primer login con OAuth
3. **Irreversible:** Una vez vinculada, la cuenta tendrá ambos métodos de acceso
4. **Seguridad:** Se recomienda cambiar la contraseña temporal después del primer login

---

## 🆘 Solución de Problemas

### "No tengo permisos de administrador al iniciar con Google"

**Causa:** Usaste una cuenta de Google diferente al email registrado

**Solución:**
1. Cierra sesión
2. Inicia sesión con Google usando **comunicacion@quierotrabajo.org**
3. El sistema vinculará automáticamente

### "Ya tengo una cuenta OAuth pero quiero vincular mi contraseña"

**Causa:** Iniciaste sesión con OAuth antes de crear la cuenta con contraseña

**Solución:**
1. Contacta con el administrador del sistema
2. Se puede vincular manualmente en la base de datos

---

**Última actualización:** 04 de noviembre de 2025
