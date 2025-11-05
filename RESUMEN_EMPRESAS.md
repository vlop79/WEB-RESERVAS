# Base de Datos de Empresas - Sistema FQT Reservas

**Fecha de exportación:** 04 de noviembre de 2025  
**Total de empresas:** 43  
**Estado:** Previo a publicación

---

## 📊 Estadísticas Generales

| Métrica | Cantidad |
|---------|----------|
| **Total de empresas** | 43 |
| **Empresas activas** | 43 |
| **Empresas inactivas** | 0 |
| **Con calendario mensual completo** | 15 |
| **Con día de semana asignado** | 22 |
| **Sin configuración de calendario** | 6 |

---

## 📁 Archivos Exportados

1. **EMPRESAS_DATABASE.json** - Datos completos en formato JSON
2. **EMPRESAS_DATABASE.csv** - Datos en formato CSV para Excel
3. **RESUMEN_EMPRESAS.md** - Este documento resumen

---

## 🏢 Lista Completa de Empresas

### Empresas con Calendario Mensual Completo (15)

Estas empresas pueden recibir reservas **cualquier día del mes**:

1. **Admiral** - Account Manager: Andrea Moraru
2. **Amadeus** - Sin account manager asignado
3. **Amazon** - Sin account manager asignado
4. **AXA de las Personas** - Account Manager: Silvia Gutiérrez
5. **Coface** - Account Manager: Silvia Gutiérrez
6. **Disney** - Sin account manager asignado
7. **Escuela Universitaria ADEMA** - Account Manager: Silvia Gutiérrez
8. **Fieldfisher** - Account Manager: Javier Martínez
9. **Gameloft** - Sin account manager asignado
10. **Havas Media Group** - Account Manager: Silvia Gutiérrez
11. **La Mutua** - Account Manager: Silvia Gutiérrez
12. **Movinmedia** - Account Manager: Silvia Gutiérrez
13. **Page Personnel** - Account Manager: Silvia Gutiérrez
14. **Telefónica** - Account Manager: Silvia Gutiérrez
15. **Zurich** - Account Manager: Silvia Gutiérrez

### Empresas con Día de Semana Asignado (22)

Estas empresas reciben reservas en **días específicos del mes**:

#### Lunes
- **Adaptive Consulting** - 1r Lunes - Account Manager: Estefanía Ricard
- **Sabadell** - 3r Lunes - Account Manager: Silvia Gutiérrez

#### Martes
- **Acciona** - 3r Martes - Account Manager: Helena Díaz
- **AXA** - 2º Martes - Account Manager: Pilar Pérez Barriocanal
- **Santander** - 1r Martes - Account Manager: Silvia Gutiérrez
- **Velotax** - 2º Martes - Account Manager: Silvia Gutiérrez

#### Miércoles
- **Cargill** - 2º Miércoles - Account Manager: Silvia Gutiérrez
- **Deloitte** - 1r Miércoles - Account Manager: Silvia Gutiérrez
- **EY** - 2º Miércoles - Account Manager: Silvia Gutiérrez
- **ISDIN** - 3r Miércoles - Account Manager: Silvia Gutiérrez
- **RJ** - 1r Miércoles - Account Manager: Silvia Gutiérrez
- **Sanofi** - 3r Miércoles - Account Manager: Silvia Gutiérrez
- **Trane Technologies** - 2º Miércoles - Account Manager: Silvia Gutiérrez

#### Jueves
- **AQ Acentor** - 3r Jueves - Account Manager: Azucena Mora
- **CBRE** - 1r Jueves - Account Manager: Silvia Gutiérrez
- **Chep** - 2º Jueves - Account Manager: Silvia Gutiérrez
- **IBM** - 1r Jueves - Account Manager: Silvia Gutiérrez
- **KPMG** - 2º Jueves - Account Manager: Silvia Gutiérrez
- **Puertos del Estado** - 3r Jueves - Account Manager: Silvia Gutiérrez
- **RSM** - 1r Jueves - Account Manager: Silvia Gutiérrez
- **Xerox** - 3r Jueves - Account Manager: Silvia Gutiérrez

#### Viernes
- **CaixaBank** - 1r Viernes - Account Manager: Silvia Gutiérrez
- **JPMorgan** - 1r Viernes - Account Manager: Silvia Gutiérrez

### Empresas Sin Configuración de Calendario (6)

Estas empresas están registradas pero **no tienen calendario configurado**:

1. **Catalana Occidente** - Account Manager: Silvia Gutiérrez
2. **Grupo IS** - Account Manager: Silvia Gutiérrez
3. **Just Eat** - Account Manager: Silvia Gutiérrez
4. **Procter & Gamble** - Account Manager: Silvia Gutiérrez
5. **PwC** - Account Manager: Silvia Gutiérrez
6. **Unicaja Banco** - Account Manager: Silvia Gutiérrez

---

## 👥 Account Managers

### Distribución de Empresas por Account Manager

| Account Manager | Cantidad de Empresas |
|-----------------|---------------------|
| **Silvia Gutiérrez** | 31 |
| **Sin asignar** | 5 |
| **Andrea Moraru** | 1 |
| **Azucena Mora** | 1 |
| **Estefanía Ricard** | 1 |
| **Helena Díaz** | 1 |
| **Javier Martínez** | 1 |
| **Pilar Pérez Barriocanal** | 1 |
| **Silvia Gutiérrez** | 1 |

---

## 🎨 Logos

**Todas las empresas tienen logos configurados** ✅

Los logos están almacenados en:
- Forge Manus Storage (mayoría)
- Manus CDN (algunos)

---

## ⚙️ Configuración Técnica

### Campos de la Base de Datos

Cada empresa tiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID único de la empresa |
| `name` | varchar(255) | Nombre de la empresa |
| `slug` | varchar(255) | URL-friendly identifier |
| `logoUrl` | text | URL del logo |
| `description` | text | Descripción (opcional) |
| `assignedDay` | varchar(100) | Día asignado (ej: "1r Lunes") |
| `accountManager` | varchar(255) | Responsable de cuenta |
| `fullMonthCalendar` | int | 1 = calendario completo, 0 = día específico |
| `priority` | enum | alta, normal, baja |
| `active` | int | 1 = activa, 0 = inactiva |
| `createdAt` | timestamp | Fecha de creación |
| `updatedAt` | timestamp | Última actualización |

### Sistema de Prioridades

Todas las empresas tienen prioridad **"normal"** actualmente.

**Niveles disponibles:**
- `alta` - Empresas prioritarias
- `normal` - Prioridad estándar (todas actualmente)
- `baja` - Prioridad baja

---

## 📅 Sistema de Calendario

### Tipos de Configuración

#### 1. Calendario Mensual Completo (`fullMonthCalendar = 1`)
- La empresa puede recibir reservas **cualquier día del mes**
- El sistema genera slots automáticamente para los próximos 3 meses
- **15 empresas** con esta configuración

#### 2. Día de Semana Asignado (`assignedDay` configurado)
- La empresa recibe reservas en **días específicos** (ej: "1r Lunes" = primer lunes del mes)
- El sistema genera slots solo para esos días
- **22 empresas** con esta configuración

#### 3. Sin Configuración
- La empresa está registrada pero no tiene calendario activo
- No se generan slots automáticamente
- **6 empresas** en esta situación

### Formato de `assignedDay`

Ejemplos:
- `"1r Lunes"` - Primer lunes de cada mes
- `"2º Martes"` - Segundo martes de cada mes
- `"3r Miércoles"` - Tercer miércoles de cada mes
- `""` (vacío) - Sin día asignado

---

## 🔄 Generación Automática de Slots

El sistema tiene un **cron job** que se ejecuta cada 30 minutos para:

1. Verificar empresas con calendario completo o día asignado
2. Generar slots para los próximos 3 meses
3. Mantener siempre disponibilidad futura

**Horarios de slots generados:**
- **Mañana:** 9:00 - 10:30
- **Tarde:** 16:00 - 17:30

---

## 📝 Notas Importantes

### Empresas Destacadas

**Empresas con más flexibilidad (calendario completo):**
- Admiral, Amadeus, Amazon, Disney, Gameloft

**Empresas con Account Manager más activo:**
- Silvia Gutiérrez gestiona 31 de las 43 empresas (72%)

### Empresas Pendientes de Configuración

Las siguientes empresas están registradas pero **necesitan configuración de calendario**:

1. Catalana Occidente
2. Grupo IS
3. Just Eat
4. Procter & Gamble
5. PwC
6. Unicaja Banco

**Recomendación:** Asignar calendario mensual completo o día específico para activar reservas.

---

## 🎯 Próximos Pasos

### Para Activar Empresas Sin Calendario

1. Decidir si tendrán calendario completo o día asignado
2. Actualizar campo `fullMonthCalendar` o `assignedDay`
3. El sistema generará slots automáticamente

### Para Añadir Nuevas Empresas

1. Usar el panel de administración en `/admin`
2. Completar todos los campos obligatorios
3. Subir logo (recomendado: PNG transparente, 200x100px)
4. Configurar calendario (completo o día asignado)
5. Asignar account manager

---

## 📊 Datos Exportados

### Formato JSON (`EMPRESAS_DATABASE.json`)

Contiene el array completo de empresas con todos los campos:

```json
[
  {
    "id": 30143,
    "name": "AQ Acentor",
    "slug": "aq-acentor",
    "logoUrl": "https://...",
    "description": null,
    "assignedDay": "3r Jueves",
    "accountManager": "Azucena Mora",
    "fullMonthCalendar": 0,
    "priority": "normal",
    "active": 1,
    "createdAt": "2025-10-31T20:12:26.000Z",
    "updatedAt": "2025-11-01T08:37:19.000Z"
  },
  ...
]
```

### Formato CSV (`EMPRESAS_DATABASE.csv`)

Compatible con Excel y Google Sheets. Incluye todas las columnas en formato tabular.

---

**Última actualización:** 04 de noviembre de 2025  
**Versión del sistema:** b1f0cc25  
**Estado:** Listo para publicación
