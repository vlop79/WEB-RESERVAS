

# Guía de Despliegue en Vercel - Sistema de Reservas FQT

**Autor:** Manus AI**Fecha:** 3 de noviembre de 2025**Proyecto:** Sistema de Reservas - Fundación Quiero Trabajo

---

## Introducción

Esta guía proporciona instrucciones detalladas para desplegar el sistema de reservas de FQT en Vercel, una plataforma de hosting moderna optimizada para aplicaciones React y Node.js. Vercel ofrece despliegue automático desde Git, SSL gratuito, CDN global y escalado automático, lo que la convierte en una excelente alternativa para proyectos full-stack como el nuestro.

El sistema de reservas FQT es una aplicación completa que incluye un portal público de reservas, un portal de voluntarios con autenticación, un panel de administración para el equipo FQT, y un dashboard específico para empresas colaboradoras. La aplicación utiliza React 19 con TypeScript en el frontend, Express con tRPC en el backend, y PostgreSQL como base de datos.

---

## Requisitos Previos

Antes de comenzar el proceso de despliegue, asegúrate de tener lo siguiente:

**Cuentas necesarias:**

- Una cuenta de Vercel (gratuita en [vercel.com](https://vercel.com))

- Una cuenta de GitHub, GitLab o Bitbucket para alojar el código

- Una base de datos PostgreSQL en la nube (recomendamos Vercel Postgres, Railway o Supabase)

**Archivos del proyecto:**

- El código completo del proyecto descargado desde Manus (usa el botón "Download All Files" en el panel Code)

- Acceso a todas las variables de entorno actuales del proyecto

**Servicios externos configurados:**

- Cuenta de servicio de Google configurada para Calendar y Meet

- Bucket de AWS S3 para almacenamiento de archivos

- Credenciales de Zoho Analytics (opcional, para dashboards de empresas)

---

## Paso 1: Preparar el Repositorio de Git

El primer paso es subir tu código a un repositorio de Git, ya que Vercel se integra directamente con servicios de control de versiones para habilitar despliegues automáticos.

### 1.1 Crear un Repositorio en GitHub

Accede a [GitHub](https://github.com) y crea un nuevo repositorio:

1. Haz clic en el botón **"New repository"** en la esquina superior derecha

1. Asigna un nombre al repositorio (por ejemplo: `fqt-reservas`)

1. Selecciona **"Private"** para mantener el código privado

1. **No inicialices** el repositorio con README, .gitignore o licencia (ya que tu proyecto ya tiene estos archivos)

1. Haz clic en **"Create repository"**

### 1.2 Subir el Código al Repositorio

Una vez descargado el proyecto desde Manus, descomprime el archivo ZIP y abre una terminal en la carpeta del proyecto. Ejecuta los siguientes comandos para inicializar Git y subir el código:

```bash
# Inicializar repositorio Git (si no está inicializado)
git init

# Añadir todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Sistema de Reservas FQT"

# Añadir el remote de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/fqt-reservas.git

# Subir el código
git branch -M main
git push -u origin main
```

**Nota importante:** Asegúrate de que el archivo `.env` **NO** esté incluido en el repositorio. El archivo `.gitignore` ya está configurado para excluirlo, pero verifica que no aparezca en tu commit.

---

## Paso 2: Configurar la Base de Datos

El sistema FQT requiere una base de datos PostgreSQL. Tienes varias opciones para alojarla en la nube.

### Opción A: Vercel Postgres (Recomendado)

Vercel ofrece su propio servicio de PostgreSQL que se integra perfectamente con tu aplicación:

1. Ve a tu proyecto en Vercel (después de crearlo en el Paso 3)

1. Navega a la pestaña **"Storage"**

1. Haz clic en **"Create Database"**

1. Selecciona **"Postgres"**

1. Elige la región más cercana a tus usuarios (Europa para España)

1. Haz clic en **"Create"**

Vercel automáticamente añadirá la variable de entorno `DATABASE_URL` a tu proyecto.

### Opción B: Railway

Railway es otra excelente opción para bases de datos PostgreSQL:

1. Crea una cuenta en [railway.app](https://railway.app)

1. Crea un nuevo proyecto y añade PostgreSQL

1. Copia la **Connection URL** que te proporciona Railway

1. Esta URL tendrá el formato: `postgresql://usuario:contraseña@host:puerto/database`

### Opción C: Supabase

Supabase ofrece PostgreSQL con características adicionales como autenticación y storage:

1. Crea una cuenta en [supabase.com](https://supabase.com)

1. Crea un nuevo proyecto

1. Ve a **Settings → Database**

1. Copia la **Connection string** en modo "Session"

### 2.1 Migrar el Schema de la Base de Datos

Una vez que tengas tu base de datos configurada, necesitas crear las tablas. El proyecto usa Drizzle ORM para gestionar el schema.

**Desde tu máquina local:**

```bash
# Instalar dependencias
npm install

# Configurar la variable de entorno DATABASE_URL
export DATABASE_URL="tu_connection_string_aqui"

# Ejecutar migraciones
npm run db:push
```

Este comando creará todas las tablas necesarias: `users`, `companies`, `serviceTypes`, `slots`, `bookings`, `volunteers`, `volunteerSessions`, `badges`, `certificates`, `resources`, `resourceDownloads`, `passwordResetTokens`, y `companyUsers`.

---

## Paso 3: Crear el Proyecto en Vercel

Ahora que tienes tu código en GitHub y tu base de datos configurada, es momento de crear el proyecto en Vercel.

### 3.1 Importar el Repositorio

1. Accede a [vercel.com](https://vercel.com) e inicia sesión

1. Haz clic en **"Add New..."** → **"Project"**

1. Selecciona tu proveedor de Git (GitHub, GitLab o Bitbucket)

1. Autoriza a Vercel para acceder a tus repositorios

1. Busca y selecciona el repositorio `fqt-reservas`

1. Haz clic en **"Import"**

### 3.2 Configurar el Proyecto

En la pantalla de configuración del proyecto:

**Framework Preset:** Vercel debería detectar automáticamente que es un proyecto Vite. Si no lo hace, selecciona **"Vite"**.

**Root Directory:** Deja el valor por defecto (`.`)

**Build Command:**

```bash
npm run build
```

**Output Directory:**

```bash
dist
```

**Install Command:**

```bash
npm install
```

**Node Version:** Asegúrate de usar Node.js 18.x o superior (configurable en Settings → General → Node.js Version)

---

## Paso 4: Configurar Variables de Entorno

Las variables de entorno son críticas para el funcionamiento de la aplicación. Vercel permite configurarlas de forma segura en su panel de control.

### 4.1 Acceder a la Configuración de Variables

1. En tu proyecto de Vercel, ve a **Settings → Environment Variables**

1. Aquí añadirás todas las variables necesarias

### 4.2 Variables de Base de Datos

```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database
```

**Nota:** Si usas Vercel Postgres, esta variable se añade automáticamente.

### 4.3 Variables de Autenticación

```
JWT_SECRET=tu_secreto_jwt_aqui_minimo_32_caracteres
COOKIE_NAME=fqt_session
```

**Importante:** Genera un JWT_SECRET seguro. Puedes usar este comando en tu terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 Variables de Google OAuth y Service Account

Para la integración con Google Calendar y Meet:

```
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
GOOGLE_OAUTH_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=tu_client_secret
```

**Nota:** El contenido de `GOOGLE_SERVICE_ACCOUNT_JSON` debe ser el JSON completo en una sola línea. Puedes encontrar este archivo en tu proyecto actual como `.google-service-account.json`.

### 4.5 Variables de AWS S3

Para el almacenamiento de archivos (logos de empresas, fotos de perfil):

```
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=tu_api_key_de_manus
```

**Alternativa:** Si prefieres usar tu propio bucket de S3:

```
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=eu-west-1
AWS_S3_BUCKET=tu-bucket-name
```

### 4.6 Variables de Aplicación

```
VITE_APP_TITLE=Sistema de Reservas - Fundación Quiero Trabajo
VITE_APP_LOGO=https://tu-dominio.com/logo.png
VITE_APP_ID=fqt-reservas
```

### 4.7 Variables de Zoho Analytics (Opcional)

Si quieres habilitar los dashboards de Zoho Analytics para empresas:

```
ZOHO_ANALYTICS_WORKSPACE_ID=tu_workspace_id
ZOHO_ANALYTICS_VIEW_ID=tu_view_id
```

### 4.8 Variables de Email (Opcional)

Si configuras un servicio de email personalizado para notificaciones:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicación
SMTP_FROM=noreply@quierotrabajo.org
```

### 4.9 Configurar Entornos

Vercel permite configurar variables para diferentes entornos:

- **Production:** Variables que se usan en el sitio publicado

- **Preview:** Variables para despliegues de preview (ramas que no son main)

- **Development:** Variables para desarrollo local

**Recomendación:** Configura todas las variables para **Production** y **Preview**. Para Development, usa un archivo `.env.local` en tu máquina.

---

## Paso 5: Configurar el Build

El proyecto FQT es una aplicación full-stack que requiere configuración especial en Vercel.

### 5.1 Crear archivo `vercel.json`

Crea un archivo `vercel.json` en la raíz del proyecto con la siguiente configuración:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/index.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  }
}
```

Esta configuración le indica a Vercel que:

- Todas las rutas `/api/*` deben ser manejadas por el servidor Express

- La función serverless debe usar Node.js 18

- El timeout máximo es de 30 segundos

### 5.2 Adaptar el Servidor para Vercel

Vercel usa **serverless functions**, por lo que necesitamos adaptar nuestro servidor Express. Crea un archivo `api/index.js` en la raíz del proyecto:

```javascript
// api/index.js
import app from '../server/_core/index.ts';

export default app;
```

Sin embargo, dado que tu proyecto ya tiene un servidor Express configurado en `server/_core/index.ts`, necesitamos verificar que exporta correctamente la aplicación.

**Verifica que ****`server/_core/index.ts`**** tenga:**

```typescript
// Al final del archivo
export default app;
```

### 5.3 Actualizar `package.json`

Asegúrate de que tu `package.json` tenga los scripts correctos:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "tsc && vite build",
    "start": "NODE_ENV=production node dist/server/_core/index.js",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
}
```

---

## Paso 6: Desplegar la Aplicación

Una vez configurado todo, es momento de desplegar.

### 6.1 Primer Despliegue

Si aún no has hecho clic en **"Deploy"** en Vercel:

1. Revisa que todas las variables de entorno estén configuradas

1. Haz clic en **"Deploy"**

1. Vercel comenzará a construir tu aplicación

El proceso de build tomará entre 2-5 minutos. Vercel mostrará los logs en tiempo real.

### 6.2 Verificar el Despliegue

Una vez completado el despliegue:

1. Vercel te proporcionará una URL (por ejemplo: `fqt-reservas.vercel.app`)

1. Haz clic en **"Visit"** para abrir tu aplicación

1. Verifica que la página principal carga correctamente

1. Prueba el flujo de reserva completo

### 6.3 Solucionar Problemas Comunes

**Error: "Cannot find module"**

- Verifica que todas las dependencias estén en `package.json`

- Ejecuta `npm install` localmente y confirma que funciona

**Error: "Database connection failed"**

- Verifica que `DATABASE_URL` esté correctamente configurada

- Asegúrate de que la base de datos permite conexiones desde las IPs de Vercel

**Error: "Function execution timeout"**

- Aumenta el `maxDuration` en `vercel.json`

- Optimiza las queries de base de datos lentas

**Error 404 en rutas de API**

- Verifica que `vercel.json` tenga las reglas de rewrite correctas

- Confirma que el servidor Express está exportado correctamente

---

## Paso 7: Configurar Dominio Personalizado

Vercel te proporciona un dominio gratuito (`*.vercel.app`), pero probablemente quieras usar tu propio dominio.

### 7.1 Añadir Dominio en Vercel

1. En tu proyecto de Vercel, ve a **Settings → Domains**

1. Haz clic en **"Add"**

1. Introduce tu dominio (por ejemplo: `reservas.quierotrabajo.org`)

1. Haz clic en **"Add"**

### 7.2 Configurar DNS

Vercel te mostrará los registros DNS que debes añadir en tu proveedor de dominios:

**Para subdominios (recomendado):**

```
Type: CNAME
Name: reservas
Value: cname.vercel-dns.com
```

**Para dominios raíz:**

```
Type: A
Name: @
Value: 76.76.21.21
```

### 7.3 Verificar Configuración

Una vez configurados los registros DNS:

1. La propagación puede tomar entre 5 minutos y 48 horas

1. Vercel verificará automáticamente la configuración

1. Una vez verificado, Vercel generará un certificado SSL gratuito

1. Tu sitio estará disponible en `https://tu-dominio.com`

---

## Paso 8: Configurar Despliegues Automáticos

Una de las grandes ventajas de Vercel es el despliegue automático desde Git.

### 8.1 Despliegues de Production

Por defecto, cada push a la rama `main` desplegará automáticamente a producción:

```bash
git add .
git commit -m "Actualización de funcionalidad"
git push origin main
```

Vercel detectará el push y comenzará un nuevo despliegue automáticamente.

### 8.2 Despliegues de Preview

Cada push a otras ramas creará un **deployment preview**:

```bash
git checkout -b feature/nueva-funcionalidad
git add .
git commit -m "Añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

Vercel creará una URL temporal para que puedas probar los cambios antes de fusionarlos a `main`.

### 8.3 Protección de Rama Main

Recomendamos configurar protección en GitHub para la rama `main`:

1. Ve a tu repositorio en GitHub

1. Settings → Branches → Add rule

1. Marca **"Require pull request reviews before merging"**

1. Esto asegura que los cambios sean revisados antes de ir a producción

---

## Paso 9: Monitoreo y Logs

Vercel proporciona herramientas para monitorear tu aplicación en producción.

### 9.1 Ver Logs en Tiempo Real

1. En tu proyecto de Vercel, ve a la pestaña **"Logs"**

1. Aquí verás todos los logs del servidor en tiempo real

1. Puedes filtrar por tipo (error, warning, info)

### 9.2 Métricas de Rendimiento

1. Ve a la pestaña **"Analytics"**

1. Vercel te mostrará:
  - Tiempo de respuesta promedio
  - Tasa de errores
  - Uso de ancho de banda
  - Visitas por página

### 9.3 Configurar Alertas

1. Ve a **Settings → Notifications**

1. Configura alertas por email para:
  - Errores de despliegue
  - Errores en producción
  - Uso excesivo de recursos

---

## Paso 10: Tareas Post-Despliegue

Una vez desplegada la aplicación, hay algunas tareas adicionales importantes.

### 10.1 Poblar la Base de Datos

Si es tu primer despliegue, necesitas poblar la base de datos con datos iniciales:

**Empresas:** El sistema incluye 34 empresas colaboradoras. Puedes poblarlas manualmente desde el panel de administración o ejecutar un script de seed.

**Usuarios del equipo FQT:** Crea los 5 usuarios del equipo con sus emails:

- [barcelona@quierotrabajo.org](mailto:barcelona@quierotrabajo.org)

- [madrid@quierotrabajo.org](mailto:madrid@quierotrabajo.org)

- [malaga@quierotrabajo.org](mailto:malaga@quierotrabajo.org)

- [silvia@quierotrabajo.org](mailto:silvia@quierotrabajo.org)

- [proyecto@quierotrabajo.org](mailto:proyecto@quierotrabajo.org)

**Tipos de servicio:**

- Mentoring (virtual)

- Estilismo (presencial)

### 10.2 Configurar Recordatorios Automáticos

El sistema incluye recordatorios automáticos por email (24h y 2h antes de las sesiones). Para habilitarlos en Vercel, necesitas configurar **Vercel Cron Jobs**:

1. Crea un archivo `vercel.json` con la configuración de cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-24h-reminders",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/send-2h-reminders",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

1. Crea los endpoints correspondientes en tu servidor para manejar estas llamadas

### 10.3 Configurar Backups de Base de Datos

Es crítico tener backups regulares de tu base de datos:

**Si usas Vercel Postgres:**

- Los backups automáticos están incluidos

- Puedes crear backups manuales desde el panel de Vercel

**Si usas Railway o Supabase:**

- Configura backups automáticos diarios

- Guarda los backups en un bucket de S3 separado

### 10.4 Actualizar URLs en Servicios Externos

Actualiza las URLs de callback en tus servicios externos:

**Google OAuth:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com)

1. APIs & Services → Credentials

1. Edita tu OAuth 2.0 Client ID

1. Añade a "Authorized redirect URIs": `https://tu-dominio.com/api/oauth/callback`

**Zoho Analytics:**

1. Actualiza las URLs permitidas para embeber iframes

1. Añade tu dominio de producción a la whitelist

---

## Paso 11: Optimizaciones de Producción

Para asegurar el mejor rendimiento en producción, considera estas optimizaciones.

### 11.1 Configurar Caché

Vercel cachea automáticamente los assets estáticos, pero puedes optimizar más:

```javascript
// En tu servidor Express
app.use(express.static('dist', {
  maxAge: '1y',
  immutable: true
}));
```

### 11.2 Comprimir Respuestas

Añade compresión gzip a tu servidor:

```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### 11.3 Optimizar Imágenes

Los logos de empresas deben estar optimizados:

1. Usa formatos modernos (WebP)

1. Implementa lazy loading

1. Usa CDN para servir imágenes (Vercel lo hace automáticamente)

### 11.4 Implementar Rate Limiting

Protege tu API de abuso con rate limiting:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

---

## Paso 12: Seguridad

Asegura que tu aplicación en producción esté protegida.

### 12.1 Configurar CORS

Restringe los orígenes permitidos:

```javascript
import cors from 'cors';

app.use(cors({
  origin: ['https://tu-dominio.com', 'https://www.tu-dominio.com'],
  credentials: true
}));
```

### 12.2 Configurar Headers de Seguridad

Añade headers de seguridad importantes:

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 12.3 Validar Variables de Entorno

Al inicio de tu aplicación, valida que todas las variables críticas estén presentes:

```javascript
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GOOGLE_SERVICE_ACCOUNT_JSON'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

---

## Troubleshooting

Esta sección cubre problemas comunes y sus soluciones.

### Problema: "Build failed" en Vercel

**Síntomas:** El despliegue falla durante la fase de build.

**Soluciones:**

1. Revisa los logs de build en Vercel para identificar el error específico

1. Verifica que todas las dependencias estén en `package.json`

1. Asegúrate de que el comando de build funciona localmente: `npm run build`

1. Verifica que la versión de Node.js en Vercel coincida con tu versión local

### Problema: "Cannot connect to database"

**Síntomas:** La aplicación se despliega pero no puede conectarse a la base de datos.

**Soluciones:**

1. Verifica que `DATABASE_URL` esté correctamente configurada en Vercel

1. Asegúrate de que la base de datos permite conexiones desde las IPs de Vercel

1. Si usas SSL, añade `?sslmode=require` al final de tu connection string

1. Prueba la conexión desde tu máquina local usando la misma URL

### Problema: "Google Calendar API not working"

**Síntomas:** Las reservas se crean pero no generan eventos en Google Calendar.

**Soluciones:**

1. Verifica que `GOOGLE_SERVICE_ACCOUNT_JSON` esté correctamente configurada

1. Asegúrate de que el Service Account tiene Domain-Wide Delegation habilitado

1. Verifica que los scopes correctos estén configurados en Google Workspace

1. Revisa los logs de Vercel para ver errores específicos de la API de Google

### Problema: "Session cookies not working"

**Síntomas:** Los usuarios no pueden mantener la sesión iniciada.

**Soluciones:**

1. Verifica que `JWT_SECRET` esté configurado

1. Asegúrate de que las cookies se están enviando con `credentials: 'include'`

1. Si usas un dominio personalizado, verifica que las cookies tengan el dominio correcto

1. En producción, las cookies deben tener `secure: true` y `sameSite: 'none'` si el frontend y backend están en dominios diferentes

### Problema: "Serverless function timeout"

**Síntomas:** Algunas requests tardan más de 10 segundos y fallan.

**Soluciones:**

1. Aumenta `maxDuration` en `vercel.json` (máximo 60s en plan Pro)

1. Optimiza las queries de base de datos lentas

1. Implementa paginación para queries que devuelven muchos resultados

1. Considera mover operaciones pesadas a background jobs

---

## Mantenimiento Continuo

Una vez desplegada la aplicación, es importante mantenerla actualizada y monitoreada.

### Actualizaciones de Dependencias

Mantén las dependencias actualizadas para seguridad y rendimiento:

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (con precaución)
npm install package@latest
```

### Monitoreo de Errores

Considera implementar un servicio de monitoreo de errores como:

- **Sentry:** Tracking de errores en tiempo real

- **LogRocket:** Grabación de sesiones y errores

- **Datadog:** Monitoreo completo de aplicación

### Backups Regulares

Establece una rutina de backups:

- **Diario:** Backup automático de base de datos

- **Semanal:** Backup del código (Git ya lo hace)

- **Mensual:** Backup de archivos en S3

### Revisión de Logs

Revisa los logs regularmente para identificar:

- Errores recurrentes

- Patrones de uso inusuales

- Oportunidades de optimización

---

## Recursos Adicionales

**Documentación oficial:**

- [Vercel Documentation](https://vercel.com/docs)

- [Vercel CLI](https://vercel.com/docs/cli)

- [Vercel Serverless Functions](https://vercel.com/docs/functions)

**Comunidad:**

- [Vercel Discord](https://vercel.com/discord)

- [GitHub Discussions](https://github.com/vercel/vercel/discussions)

**Soporte:**

- [Vercel Support](https://vercel.com/support)

- Email: [support@vercel.com](mailto:support@vercel.com)

---

## Conclusión

Desplegar el sistema de reservas FQT en Vercel proporciona una solución robusta, escalable y fácil de mantener. La integración con Git permite despliegues automáticos, mientras que las herramientas de monitoreo de Vercel facilitan la identificación y resolución de problemas.

Siguiendo esta guía paso a paso, deberías tener tu aplicación funcionando en producción en menos de una hora. Recuerda mantener las variables de entorno seguras, configurar backups regulares, y monitorear el rendimiento de tu aplicación continuamente.

Si encuentras problemas durante el despliegue, consulta la sección de Troubleshooting o contacta con el soporte de Vercel. La comunidad de Vercel es muy activa y generalmente responde rápidamente a preguntas en Discord y GitHub.

---

**Autor:** Manus AI**Última actualización:** 3 de noviembre de 2025**Versión del documento:** 1.0

