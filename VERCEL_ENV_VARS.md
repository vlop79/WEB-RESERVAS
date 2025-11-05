# 🔐 Variables de Entorno para Vercel - Sistema de Reservas FQT

Este documento lista **todas** las variables de entorno que debes configurar en Vercel para que la aplicación funcione correctamente.

## 📍 Cómo Configurarlas

1. Ve a: **https://vercel.com/vanessas-projects-14661a5a/web-reservas/settings/environment-variables**
2. Para cada variable:
   - Haz clic en **"Add New"**
   - Nombre: Copia exactamente el nombre de la variable
   - Value: Pega el valor correspondiente
   - Environments: Selecciona **Production**, **Preview**, y **Development**
   - Haz clic en **"Save"**
3. Después de añadir todas las variables, **redespliega** el proyecto

---

## ✅ Variables Obligatorias (CRÍTICAS)

### 1. Base de Datos

```bash
DATABASE_URL
```
**Valor**: Connection string de MySQL/TiDB  
**Formato**: `mysql://usuario:contraseña@host:puerto/database`  
**Ejemplo**: `mysql://user:pass@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/fqt_reservas?ssl={"rejectUnauthorized":true}`

**⚠️ Importante**: 
- Debe ser MySQL o TiDB (compatible con MySQL)
- Incluir parámetros SSL si es necesario
- Verificar que el usuario tenga permisos de lectura/escritura

---

### 2. Autenticación JWT

```bash
JWT_SECRET
```
**Valor**: Cadena aleatoria de mínimo 32 caracteres  
**Generar nuevo**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**Ejemplo**: `a1b2c3d4e5f6789012345678901234567890abcdefghijklmnopqrstuvwxyz`

**⚠️ Importante**: 
- NUNCA uses el mismo secret en desarrollo y producción
- Guárdalo de forma segura
- Si lo cambias, todos los usuarios deberán volver a iniciar sesión

---

### 3. Google Service Account (Calendar & Meet)

```bash
GOOGLE_SERVICE_ACCOUNT_JSON
```
**Valor**: JSON completo del Service Account **en una sola línea**  
**Formato**:
```json
{"type":"service_account","project_id":"tu-proyecto","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@...iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**⚠️ Importante**: 
- Debe estar en **UNA SOLA LÍNEA** (sin saltos de línea)
- Los `\n` dentro de `private_key` deben mantenerse como `\n`
- Verifica que el Service Account tenga permisos de Google Calendar API

**Cómo obtenerlo**:
1. Ve a Google Cloud Console → IAM & Admin → Service Accounts
2. Descarga el JSON key del service account
3. Copia todo el contenido y pégalo en Vercel

---

### 4. Google OAuth (Login de Voluntarias)

```bash
GOOGLE_OAUTH_CLIENT_ID
```
**Valor**: Client ID de OAuth 2.0  
**Formato**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

```bash
GOOGLE_OAUTH_CLIENT_SECRET
```
**Valor**: Client Secret de OAuth 2.0  
**Formato**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

**Cómo obtenerlos**:
1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client IDs → Selecciona tu aplicación web
3. Copia Client ID y Client Secret

**⚠️ Importante**: 
- Añade `https://web-reservas-kappa.vercel.app` a las URIs autorizadas
- Añade `https://web-reservas-kappa.vercel.app/api/oauth/callback` a las redirect URIs

---

### 5. Manus APIs (Storage S3)

```bash
BUILT_IN_FORGE_API_URL
```
**Valor**: `https://api.manus.im`

```bash
BUILT_IN_FORGE_API_KEY
```
**Valor**: Tu API key de Manus  
**Formato**: Cadena alfanumérica larga

**Cómo obtenerlo**:
- Ve a tu proyecto actual en Manus
- Management UI → Settings → Secrets
- Copia el valor de `BUILT_IN_FORGE_API_KEY`

---

### 6. Configuración de la Aplicación

```bash
VITE_APP_TITLE
```
**Valor**: `Sistema de Reservas - Fundación Quiero Trabajo`

```bash
VITE_APP_LOGO
```
**Valor**: URL del logo de FQT  
**Ejemplo**: `https://quierotrabajo.org/logo.png`

```bash
VITE_APP_ID
```
**Valor**: `fqt-reservas`

---

### 7. OAuth de Manus

```bash
OAUTH_SERVER_URL
```
**Valor**: `https://api.manus.im`

```bash
VITE_OAUTH_PORTAL_URL
```
**Valor**: `https://login.manus.im`

---

### 8. Propietario/Administrador

```bash
OWNER_OPEN_ID
```
**Valor**: Tu OpenID de Manus  
**Cómo obtenerlo**: Ve a tu perfil en Manus y copia tu User ID

```bash
OWNER_NAME
```
**Valor**: Tu nombre o nombre de la organización  
**Ejemplo**: `Fundación Quiero Trabajo`

---

## 🔧 Variables Opcionales (Recomendadas)

### 9. Analytics de Manus

```bash
VITE_ANALYTICS_ENDPOINT
```
**Valor**: `https://analytics.manus.im`

```bash
VITE_ANALYTICS_WEBSITE_ID
```
**Valor**: ID de tu sitio en Manus Analytics (si lo tienes configurado)

---

### 10. Frontend Forge API (para cliente)

```bash
VITE_FRONTEND_FORGE_API_URL
```
**Valor**: `https://api.manus.im`

```bash
VITE_FRONTEND_FORGE_API_KEY
```
**Valor**: Tu API key de Manus (mismo que `BUILT_IN_FORGE_API_KEY`)

---

## 📋 Resumen - Lista de Verificación

Marca cada variable después de configurarla en Vercel:

### Críticas (Obligatorias):
- [ ] `DATABASE_URL` - Connection string de MySQL/TiDB
- [ ] `JWT_SECRET` - Secret para tokens JWT (32+ caracteres)
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON` - JSON del Service Account (una línea)
- [ ] `GOOGLE_OAUTH_CLIENT_ID` - Client ID de Google OAuth
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET` - Client Secret de Google OAuth
- [ ] `BUILT_IN_FORGE_API_URL` - URL de API de Manus
- [ ] `BUILT_IN_FORGE_API_KEY` - API Key de Manus
- [ ] `VITE_APP_TITLE` - Título de la aplicación
- [ ] `VITE_APP_LOGO` - URL del logo
- [ ] `VITE_APP_ID` - ID de la aplicación
- [ ] `OAUTH_SERVER_URL` - URL del servidor OAuth
- [ ] `VITE_OAUTH_PORTAL_URL` - URL del portal OAuth
- [ ] `OWNER_OPEN_ID` - OpenID del propietario
- [ ] `OWNER_NAME` - Nombre del propietario

### Opcionales:
- [ ] `VITE_ANALYTICS_ENDPOINT` - Endpoint de analytics
- [ ] `VITE_ANALYTICS_WEBSITE_ID` - ID del sitio en analytics
- [ ] `VITE_FRONTEND_FORGE_API_URL` - URL de API para frontend
- [ ] `VITE_FRONTEND_FORGE_API_KEY` - API Key para frontend

---

## 🚀 Después de Configurar

1. **Verifica** que todas las variables críticas estén configuradas
2. **Redespliega** el proyecto:
   - Ve a Deployments en Vercel
   - Haz clic en los 3 puntos del último deployment
   - Selecciona "Redeploy"
3. **Prueba** la aplicación:
   - Abre https://web-reservas-kappa.vercel.app
   - Verifica que puedas iniciar sesión
   - Crea una reserva de prueba
   - Verifica que se cree el evento en Google Calendar

---

## ⚠️ Notas de Seguridad

- **NUNCA** compartas estas variables públicamente
- **NUNCA** las subas a Git
- Usa valores diferentes para Development y Production
- Rota el `JWT_SECRET` periódicamente
- Revisa los logs de Vercel si algo no funciona

---

## 🔍 Troubleshooting

**Si la aplicación no carga:**
- Verifica que `DATABASE_URL` sea correcto
- Verifica que `JWT_SECRET` tenga al menos 32 caracteres

**Si no se crean eventos en Google Calendar:**
- Verifica que `GOOGLE_SERVICE_ACCOUNT_JSON` esté en una sola línea
- Verifica que el Service Account tenga permisos de Calendar API

**Si no funciona el login de Google:**
- Verifica que `GOOGLE_OAUTH_CLIENT_ID` y `GOOGLE_OAUTH_CLIENT_SECRET` sean correctos
- Añade la URL de Vercel a las URIs autorizadas en Google Cloud Console

**Si no se suben archivos:**
- Verifica que `BUILT_IN_FORGE_API_KEY` sea correcto
- Verifica que `BUILT_IN_FORGE_API_URL` sea `https://api.manus.im`
