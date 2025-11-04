# Variables de Entorno Necesarias para Vercel

Este documento lista todas las variables de entorno que debes configurar en Vercel para que la aplicación funcione correctamente.

## 📋 Variables Obligatorias

### Base de Datos
```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database
```
**Descripción:** Connection string de PostgreSQL  
**Ejemplo:** `postgresql://user:pass@db.railway.app:5432/fqt_reservas`

### Autenticación
```
JWT_SECRET=tu_secreto_jwt_aqui_minimo_32_caracteres
```
**Descripción:** Secreto para firmar tokens JWT (mínimo 32 caracteres)  
**Generar:** `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` 

```
COOKIE_NAME=fqt_session
```
**Descripción:** Nombre de la cookie de sesión

### Google Service Account (Calendar & Meet)
```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```
**Descripción:** JSON completo del Service Account de Google (en una sola línea)  
**Ubicación actual:** Archivo `.google-service-account.json` en el proyecto

```
GOOGLE_OAUTH_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=tu_client_secret
```
**Descripción:** Credenciales OAuth de Google Cloud Console

### Manus APIs (Storage)
```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu_api_key_de_manus
```
**Descripción:** API de Manus para almacenamiento S3

### Aplicación
```
VITE_APP_TITLE=Sistema de Reservas - Fundación Quiero Trabajo
VITE_APP_LOGO=https://tu-dominio.com/logo.png
VITE_APP_ID=fqt-reservas
```
**Descripción:** Configuración visual de la aplicación

```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
```
**Descripción:** URLs de OAuth de Manus

### Propietario (Admin)
```
OWNER_OPEN_ID=tu_owner_open_id
OWNER_NAME=Administrador FQT
```
**Descripción:** Identificación del propietario/administrador principal

---

## 🔧 Variables Opcionales

### Zoho Analytics (para dashboards de empresas)
```
ZOHO_ANALYTICS_WORKSPACE_ID=tu_workspace_id
ZOHO_ANALYTICS_VIEW_ID=tu_view_id
```
**Descripción:** IDs de Zoho Analytics para embeber dashboards

### Email SMTP Personalizado
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicación
SMTP_FROM=noreply@quierotrabajo.org
```
**Descripción:** Configuración SMTP si quieres usar tu propio servidor de email

### Analytics
```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=tu_website_id
```
**Descripción:** Analytics de Manus (opcional)

---

## 📝 Cómo Configurarlas en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade cada variable con su valor
4. Selecciona los entornos: **Production**, **Preview**, **Development**
5. Haz clic en "Save"

---

## ⚠️ Notas Importantes

- **NUNCA** subas el archivo `.env` a Git
- Usa valores diferentes para Development y Production
- El `JWT_SECRET` debe ser único y seguro
- `GOOGLE_SERVICE_ACCOUNT_JSON` debe estar en una sola línea (sin saltos de línea)
- Verifica que todas las URLs terminen sin `/` al final

---

## 🔐 Valores Actuales del Proyecto Manus

Las siguientes variables ya están configuradas en tu proyecto actual de Manus y debes copiarlas a Vercel:

- `BUILT_IN_FORGE_API_KEY`
- `BUILT_IN_FORGE_API_URL`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `OWNER_NAME`
- `OWNER_OPEN_ID`
- `VITE_APP_ID`
- `VITE_APP_LOGO`
- `VITE_APP_TITLE`
- `VITE_OAUTH_PORTAL_URL`

Puedes encontrar estos valores en el panel de Management UI → Settings → Secrets de tu proyecto Manus actual.
