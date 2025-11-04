# Integración con Zoho - Portal del Voluntario FQT

## Resumen
Este documento describe la estructura preparada para integrar el portal del voluntario con Zoho CRM, Zoho Analytics y Zoho Survey.

## 1. Zoho CRM - Sesiones de Voluntariado

### Objetivo
Sincronizar las sesiones completadas por voluntarios desde Zoho CRM al portal.

### Estructura Actual
- Tabla `volunteerSessions` en base de datos
- Campos: `volunteerId`, `sessionDate`, `womenAttended`, `duration`, `notes`, `zohoSessionId`

### Integración Pendiente
1. **Webhook de Zoho CRM** → Endpoint `/api/webhooks/zoho-session`
2. **Campos a mapear**:
   - `zohoSessionId` → ID único de la sesión en Zoho
   - `womenAttended` → Número de mujeres atendidas (desde Zoho)
   - `sessionDate` → Fecha de la sesión
   - `duration` → Duración en minutos
   - `notes` → Notas de la sesión

### Endpoint a Crear
```typescript
// server/routers.ts
zohoWebhook: router({
  sessionCompleted: publicProcedure
    .input(z.object({
      volunteerId: z.number(),
      zohoSessionId: z.string(),
      sessionDate: z.date(),
      womenAttended: z.number(),
      duration: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Crear sesión en volunteerSessions
      // Actualizar badges si corresponde
      // Retornar confirmación
    }),
})
```

## 2. Zoho Analytics - Mi Impacto

### Objetivo
Mostrar métricas agregadas del impacto del voluntario desde Zoho Analytics.

### Métricas a Integrar
- Total mujeres ayudadas
- Horas totales donadas
- Valoración media de sesiones
- Racha actual (días consecutivos)
- Tendencias mensuales

### Integración Pendiente
1. **API de Zoho Analytics** → Consultas programadas cada 24h
2. **Caché en base de datos** para rendimiento
3. **Endpoint**: `/api/zoho/analytics/volunteer-impact/:volunteerId`

## 3. Zoho Survey - Valoraciones de Mujeres

### Objetivo
Importar valoraciones de las mujeres atendidas desde Zoho Survey.

### Estructura Actual
- Tabla `ratings` existente para valoraciones de voluntarios
- Nueva tabla necesaria: `womenFeedback` para feedback de las mujeres

### Integración Pendiente
1. **Webhook de Zoho Survey** → Endpoint `/api/webhooks/zoho-survey`
2. **Campos a mapear**:
   - `sessionId` → Vincular con sesión específica
   - `rating` → Valoración 1-5
   - `comment` → Comentario de la mujer
   - `womanName` → Nombre (opcional, según privacidad)

## 4. Sistema de Badges Automático

### Badges Implementados
Los badges se otorgan automáticamente basados en el número de sesiones:

1. **Iniciante** (1 sesión)
   - Texto: "¡Bienvenida al equipo! Has dado tu primer paso para transformar vidas"
   - Color: Verde

2. **Comprometida** (5 sesiones)
   - Texto: "Tu compromiso marca la diferencia. ¡5 mujeres ya cuentan contigo!"
   - Color: Azul

3. **Experta** (10 sesiones)
   - Texto: "Eres un pilar de FQT. Has impactado la vida de 10+ mujeres"
   - Color: Morado

4. **Mentora de Oro** (25 sesiones)
   - Texto: "Tu dedicación inspira. ¡25 vidas transformadas gracias a ti!"
   - Color: Dorado

5. **Leyenda FQT** (50 sesiones)
   - Texto: "Eres parte de la historia de FQT. 50+ mujeres tienen un futuro mejor gracias a ti"
   - Color: Platino

### Lógica de Otorgamiento
```typescript
// Después de cada sesión completada:
const sessionCount = await countVolunteerSessions(volunteerId);

if (sessionCount === 1) await createBadge(volunteerId, "Iniciante");
if (sessionCount === 5) await createBadge(volunteerId, "Comprometida");
if (sessionCount === 10) await createBadge(volunteerId, "Experta");
if (sessionCount === 25) await createBadge(volunteerId, "Mentora de Oro");
if (sessionCount === 50) await createBadge(volunteerId, "Leyenda FQT");
```

## 5. Próximos Pasos

### Prioridad Alta
1. ✅ Estructura de base de datos preparada
2. ✅ Sistema de badges con textos motivadores
3. ⏳ Crear endpoints de webhooks para Zoho
4. ⏳ Configurar webhooks en Zoho CRM y Survey
5. ⏳ Implementar consultas a Zoho Analytics API

### Prioridad Media
1. ⏳ Caché de datos de Analytics
2. ⏳ Panel de administración para ver integraciones
3. ⏳ Logs de sincronización

### Notas de Seguridad
- Todos los webhooks deben validar firma de Zoho
- Usar variables de entorno para API keys de Zoho
- Implementar rate limiting en endpoints públicos
