# Configuración de Recordatorios Automáticos

Este documento explica cómo configurar los recordatorios automáticos por email para el sistema de reservas de FQT.

## Tipos de Recordatorios

El sistema envía dos tipos de recordatorios:

### 1. Recordatorio 24 horas antes
- **Destinatario:** Voluntario
- **Cuándo:** 24 horas antes de la sesión
- **Contenido:** Detalles completos de la sesión (fecha, hora, ubicación/enlace Meet, anfitrión)

### 2. Recordatorio 2 horas antes
- **Destinatarios:** Voluntario + Anfitrión
- **Cuándo:** 2 horas antes de la sesión
- **Contenido:** Recordatorio urgente con enlace directo o ubicación

## Configuración con Cron Jobs

### Opción 1: Cron en el servidor (Linux)

Editar crontab:
```bash
crontab -e
```

Añadir estas líneas:

```cron
# Recordatorios 24h antes - ejecutar diariamente a las 9:00 AM
0 9 * * * curl -X POST https://tu-dominio.com/api/cron/reminders-24h

# Recordatorios 2h antes - ejecutar cada 2 horas
0 */2 * * * curl -X POST https://tu-dominio.com/api/cron/reminders-2h
```

### Opción 2: Servicio externo de cron (EasyCron, cron-job.org)

1. Crear cuenta en un servicio de cron jobs online
2. Configurar dos trabajos:
   - **24h reminders:** `https://tu-dominio.com/api/cron/reminders-24h` - Diario a las 9:00
   - **2h reminders:** `https://tu-dominio.com/api/cron/reminders-2h` - Cada 2 horas

### Opción 3: Trigger manual desde panel Admin

Los administradores pueden enviar recordatorios manualmente desde el panel de administración:

1. Ir a `/admin`
2. Sección "Recordatorios"
3. Botón "Enviar recordatorios 24h" o "Enviar recordatorios 2h"

## Endpoints API

### POST /api/trpc/admin.sendReminders

**Autenticación:** Requiere rol admin

**Body:**
```json
{
  "type": "24h" | "2h"
}
```

**Respuesta:**
```json
{
  "sent": 5,
  "failed": 0
}
```

## Implementación de Endpoints Cron

Para habilitar los endpoints públicos de cron (sin autenticación), añadir en `server/routers.ts`:

```typescript
// Public cron endpoints (proteger con API key en producción)
cron: router({
  send24HourReminders: publicProcedure
    .mutation(async () => {
      const { send24HourReminders } = await import("../lib/reminders");
      return send24HourReminders();
    }),
    
  send2HourReminders: publicProcedure
    .mutation(async () => {
      const { send2HourReminders } = await import("../lib/reminders");
      return send2HourReminders();
    }),
}),
```

## Monitoreo

Los recordatorios registran logs en la consola del servidor:

```
[Reminders] Starting 24-hour reminder job...
[Reminders] Found 3 bookings for 24h reminders
[Reminders] 24h reminders complete: 3 sent, 0 failed
```

## Consideraciones

- **Rate limiting:** El sistema incluye un delay de 100ms entre emails para evitar límites de tasa
- **Errores:** Si falla el envío de un email, se registra pero no detiene el proceso
- **Zona horaria:** Los recordatorios usan la hora del servidor (configurar correctamente)
- **Reservas canceladas:** No se envían recordatorios para reservas con status "cancelled"

## Testing

Para probar los recordatorios sin esperar:

1. Crear una reserva para mañana (24h test)
2. Crear una reserva para dentro de 2-3 horas (2h test)
3. Ejecutar manualmente desde panel Admin
4. Verificar emails recibidos

## Troubleshooting

### No se envían emails

1. Verificar que el servicio de notificaciones de Manus esté configurado
2. Revisar logs del servidor para errores
3. Verificar que las reservas tengan emails válidos
4. Comprobar que las reservas no estén canceladas

### Emails duplicados

- Asegurarse de que el cron job no se ejecute múltiples veces
- Verificar que no haya múltiples instancias del servidor corriendo

### Horarios incorrectos

- Verificar zona horaria del servidor
- Ajustar horarios de cron jobs según necesidad
