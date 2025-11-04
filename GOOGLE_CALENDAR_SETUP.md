# Configuración de Google Calendar - Instrucciones

## ✅ Estado Actual

La integración con Google Calendar está **funcionando correctamente** usando Domain-Wide Delegation.

**Prueba exitosa:**
- ✅ Evento creado en calendario de barcelona@quierotrabajo.org
- ✅ Google Meet generado automáticamente
- ✅ Sistema round-robin operativo

## 📋 Actualizar Secret (IMPORTANTE)

El secret `GOOGLE_SERVICE_ACCOUNT_JSON` actual tiene un formato incorrecto. Necesitas actualizarlo con el JSON correcto.

### Pasos para actualizar:

1. **Obtén el JSON correcto:**
   - El archivo correcto está guardado en: `/home/ubuntu/fqt-reservas/.google-service-account.json`
   - O usa el archivo original: `driven-density-470613-p2-de35b960de1c.json`

2. **Actualiza el secret en Manus:**
   - Ve al panel de gestión del proyecto
   - Busca el ícono de configuración (⚙️) en la esquina superior derecha
   - Haz clic en **"Settings"**
   - En el menú lateral, selecciona **"Secrets"**
   - Busca `GOOGLE_SERVICE_ACCOUNT_JSON`
   - Haz clic en el botón de **editar** (lápiz)
   - Reemplaza todo el contenido con el JSON correcto
   - Guarda los cambios

3. **Reinicia el servidor:**
   - Después de actualizar el secret, reinicia el servidor de desarrollo
   - Esto asegurará que el nuevo valor se cargue correctamente

## 🔑 Información de la Service Account

- **Email**: fqt-calendar-service@driven-density-470613-p2.iam.gserviceaccount.com
- **Client ID**: 109163351096722223912
- **Project ID**: driven-density-470613-p2

## 👥 Miembros del Equipo (Round-Robin)

El sistema distribuye las reservas equitativamente entre:

1. barcelona@quierotrabajo.org
2. madrid@quierotrabajo.org
3. malaga@quierotrabajo.org
4. silvia@quierotrabajo.org
5. proyecto@quierotrabajo.org

## 🧪 Probar la Integración

Para verificar que todo funciona correctamente:

```bash
cd /home/ubuntu/fqt-reservas
npx tsx scripts/test-google-calendar.ts
```

Este script:
- Verifica las credenciales
- Crea un evento de prueba en el calendario del primer miembro del equipo
- Genera un enlace de Google Meet
- Muestra los detalles del evento creado

## ⚙️ Configuración de Domain-Wide Delegation

Ya está configurada en Google Workspace Admin Console con:

- **Client ID**: 109163351096722223912
- **Scopes autorizados**:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`

## 🚀 Cómo Funciona

1. **Cuando se confirma una reserva:**
   - El sistema selecciona automáticamente al miembro del equipo con menos reservas (round-robin)
   - Crea un evento en el calendario de ese miembro
   - Si es sesión virtual (Mentoring), genera un enlace de Google Meet
   - Envía invitaciones automáticas por email al voluntario
   - Guarda el enlace de Meet y el anfitrión en la base de datos

2. **Campos en la base de datos:**
   - `hostEmail`: Email del miembro del equipo asignado
   - `googleCalendarEventId`: ID del evento en Google Calendar
   - `googleMeetLink`: Enlace de la reunión virtual (solo para Mentoring)

3. **Panel de administración:**
   - Muestra el anfitrión asignado para cada reserva
   - Botón para copiar el enlace de Google Meet
   - Exportación CSV incluye anfitrión y enlace

## 📝 Notas Importantes

- El archivo `.google-service-account.json` está en `.gitignore` por seguridad
- Nunca compartas las credenciales de la Service Account públicamente
- El sistema usa impersonación para crear eventos en nombre de cada miembro del equipo
- No es necesario que cada miembro autorice individualmente
