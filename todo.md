# TODO - Sistema de Reservas FQT

## Fase 1: Base de Datos y Estructura
- [x] Crear esquema de base de datos (empresas, servicios, slots, reservas)
- [x] Configurar tipos y relaciones
- [x] Migrar esquema a la base de datos

## Fase 2: Backend (tRPC Procedures)
- [x] Procedures para gestión de empresas (CRUD)
- [x] Procedures para gestión de slots
- [x] Procedures para reservas públicas
- [x] Lógica de prevención de doble reserva
- [ ] Integración con Zoho CRM API
- [ ] Integración con Google Calendar API

## Fase 3: Frontend Público
- [ ] Página de reserva por empresa (/reservas/:empresaSlug)
- [ ] Selector de servicio (Mentoring/Estilismo)
- [ ] Calendario visual de slots disponibles
- [ ] Formulario de reserva
- [ ] Confirmación y email

## Fase 4: Panel de Administración
- [ ] Dashboard con estadísticas
- [ ] Gestión de empresas (añadir/editar/desactivar)
- [ ] Gestión de slots mensuales
- [ ] Vista de reservas
- [ ] Exportación de datos

## Fase 5: Integraciones
- [ ] Configurar Zoho CRM OAuth
- [ ] Configurar Google Calendar API
- [ ] Sincronización automática de reservas
- [ ] Generación de Google Meet

## Fase 6: Testing y Checkpoint
- [ ] Probar flujo completo de reserva
- [ ] Probar panel de administración
- [ ] Verificar integraciones
- [ ] Crear checkpoint

## Fase 7: Documentación
- [ ] Guía de configuración de APIs
- [ ] Guía de uso del panel de administración
- [ ] Guía para voluntarios

## Mejoras de Diseño
- [ ] Aplicar tipografía Montserrat para títulos
- [ ] Aplicar tipografía Roboto para textos
- [ ] Mejorar colores corporativos (coral #EA6A5A, beige #F5F1E8)
- [ ] Mejorar diseño visual general

- [ ] Adaptar cabecera con diseño de FQT (fondo coral, logo blanco)

## Poblar Empresas del Excel
- [x] Leer Excel con todas las empresas
- [x] Descargar logos de todas las empresas
- [x] Crear script para poblar base de datos
- [x] Priorizar empresas marcadas como "Alta"
- [x] Dejar al final empresas marcadas como "Baja"

- [x] Eliminar Aurora Energy del listado de empresas

- [x] Eliminar Accenture de la lista (no trabajamos con ellos)
- [x] Limpiar base de datos de empresas de prueba y Aurora Energy
- [x] Repoblar base de datos solo con las 34 empresas correctas

- [x] Eliminar Admiral de la lista (revertido - sí es cliente)

- [x] Re-añadir Admiral con el logo correcto (Admiral Consulting Group)
- [x] Subir logo de Admiral a S3 y actualizar base de datos

- [x] Uniformizar tamaño de todos los logos de empresas

- [x] Uniformizar tamaño de todos los logos de empresas

- [ ] Ampliar tamaño del nombre de empresa (mantener logos)

- [ ] Actualizar logo de KPMG con versión proporcionada
- [ ] Actualizar otros logos personalizados según se proporcionen

- [x] Eliminar IBM de la lista de empresas
- [x] Añadir XEROX a la lista de empresas
- [x] Actualizar todos los logos personalizados (KPMG, PageGroup, Morningstar, GruposSky)

- [x] Eliminar 3M de la lista de empresas

## Panel de Administración
- [ ] Crear página de administración con autenticación
- [ ] Implementar gestión de empresas (CRUD completo)
- [ ] Implementar gestión de slots (crear, cancelar, modificar)
- [ ] Implementar visualización de reservas
- [ ] Implementar gestión de candidatas
- [ ] Añadir filtros y búsqueda en todas las secciones
- [ ] Implementar exportación de datos a Excel

## Creación de Slots
- [x] Leer días asignados a cada empresa desde Excel
- [x] Crear slots mensuales automáticamente para nov-dic 2025 y todo 2026 (14 meses total)
- [x] Excluir festivos nacionales de España
- [x] Asignar horarios (Mentoring 11:00-18:00, Estilismo 10:00-17:00)
- [x] Crear tipos de sesión (Mentoring, Estilismo)

## Integraciones
- [ ] Integrar con Zoho CRM para sincronizar reservas
- [ ] Integrar con Google Calendar para crear eventos automáticos
- [ ] Configurar notificaciones por email

- [x] Actualizar logo de Acciona con versión correcta

- [x] Actualizar logo de AQ Acentor con versión correcta
- [x] Cambiar logo de FQT a blanco en el header

## Ajustes de Diseño
- [x] Actualizar logo en cabecera con nuevo logo FQT
- [x] Quitar título "Fundación Quiero Trabajo" del header
- [x] Cambiar color de elementos resaltados a #ea6852 (rojo corporativo FQT)

## Panel de Administración
- [ ] Crear página principal de admin con dashboard
- [ ] Crear página de gestión de empresas (CRUD completo)
- [ ] Crear página de gestión de slots (ver, crear, editar, eliminar)
- [ ] Crear página de visualización de reservas
- [ ] Implementar filtros y búsqueda en todas las páginas

## Flujo de Reservas
- [ ] Crear página de selección de slots por empresa
- [ ] Implementar calendario de disponibilidad
- [ ] Crear formulario de reserva con datos de voluntaria
- [ ] Implementar confirmación de reserva

## Integraciones (estructura preparada)
- [ ] Preparar módulo de integración con Google Calendar
- [ ] Preparar módulo de integración con Google Meet
- [ ] Preparar módulo de integración con Zoho CRM
- [ ] Crear página de configuración de integraciones en admin

## Corrección de Slots
- [x] Eliminar todos los slots actuales (generados incorrectamente)
- [x] Actualizar schema para incluir tipo de servicio (virtual/presencial)
- [x] Regenerar slots con horarios correctos:
  - Mentoring: 6 slots/día (11-12, 12-13, 13-14, 14-15, 16-17, 17-18), 3 voluntarios, virtual
  - Estilismo: 7 slots/día (10-11, 11-12, 12-13, 13-14, 14-15, 15-16, 16-17), 2 estilistas, presencial
- [ ] Implementar generación de enlace Google Meet al reservar
- [ ] Implementar integración con Google Calendar

## Tareas Urgentes
- [x] Eliminar todos los slots existentes
- [x] Regenerar slots con especificaciones correctas (Mentoring: 6 slots/día, 3 voluntarios; Estilismo: 7 slots/día, 2 estilistas)
- [x] Cambiar logo del header por nuevo logo LOGOENBLANCO.png

## URGENTE - Corrección Slots
- [x] Regenerar slots correctamente: solo 1 vez al mes en el día específico (ej: 3r Jueves = solo tercer jueves del mes)

## Cambios de Diseño
- [x] Cambiar fondo de la aplicación a blanco
- [x] Reemplazar logo actual por Logo_FQT.JPG
- [x] Cambiar color del título a #ea6852

## Panel de Gestión de Reservas
- [x] Crear queries en server/db.ts para gestión de reservas
- [x] Crear routers en server/routers.ts para admin
- [x] Crear página de gestión de reservas con filtros
- [x] Implementar cancelación de reservas
- [ ] Implementar modificación de reservas
- [x] Añadir sistema de exportación a CSV
- [x] Crear vista de estadísticas y reportes
- [ ] Implementar gestión manual de slots (activar/desactivar)

## Vista de Calendario
- [ ] Crear componente de calendario con vistas día/semana/mes
- [ ] Implementar navegación entre períodos
- [ ] Mostrar reservas visualmente con colores por servicio
- [ ] Añadir modal de detalles al hacer clic en reserva
- [ ] Implementar filtros por empresa y servicio
- [ ] Añadir indicadores de capacidad de slots

## Edición de Empresas
- [x] Añadir modal de edición de empresas en Admin
- [x] Implementar formulario de edición pre-rellenado
- [x] Añadir botón de editar en tabla de empresas
- [x] Permitir cambiar estado activo/inactivo

## Sistema de Carga de Logos
- [x] Añadir endpoint tRPC para subir archivos a S3
- [x] Implementar campo de carga de archivo en formulario de empresa (URGENTE)
- [x] Añadir vista previa del logo
- [x] Subir logo de Havas Media Group

## Edición de Días/Slots de Empresas
- [x] Añadir campo assignedDay a tabla companies
- [x] Actualizar formulario de edición con campo de día asignado
- [ ] Implementar función de regeneración de slots
- [ ] Añadir vista de slots actuales por empresa
- [ ] Opción para eliminar y regenerar slots

## Soporte para Múltiples Días por Empresa
- [x] Revisar Excel para identificar empresas con múltiples días
- [ ] Actualizar todas las empresas con días correctos del Excel
- [ ] Modificar script de generación de slots para procesar múltiples días separados por comas
- [ ] Regenerar todos los slots con configuración correcta

## Gestión de Usuarios con Rol Empresa
- [x] Añadir rol 'empresa' al schema de users
- [x] Añadir campo companyId a users para vincular con empresa
- [x] Crear endpoints tRPC para gestión de usuarios
- [x] Añadir sección de usuarios en panel Admin
- [x] Formulario para crear usuarios con rol empresa y asignar empresa
- [x] Crear panel específico para usuarios empresa (CompanyDashboard)
- [x] Filtrar reservas por empresa para usuarios empresa

## Integración Google Calendar y Meet (Round-Robin)
- [x] Guardar credenciales de Google Service Account en secrets
- [x] Instalar googleapis npm package
- [x] Configurar OAuth 2.0 para miembros del equipo
- [x] Implementar sistema de autorización OAuth para 5 miembros del equipo
- [x] Crear tabla para almacenar tokens OAuth de miembros del equipo (google_tokens)
- [x] Implementar sistema de asignación round-robin automática
- [x] Crear helper para autenticación con Google APIs usando OAuth
- [x] Implementar función para crear eventos en Google Calendar del miembro asignado
- [x] Implementar función para generar enlaces de Google Meet
- [x] Integrar creación de evento al confirmar reserva
- [x] Añadir campo hostEmail (anfitrion) y meetLink a tabla bookings
- [x] Crear página de autorización OAuth para miembros del equipo
- [x] Crear endpoint OAuth callback para recibir tokens
- [x] Crear endpoint para obtener estado de autorización del equipo
- [x] Añadir botón en panel Admin para acceder a autorización Google
- [x] Mostrar enlace de Meet y anfitrion en panel de gestión de reservas
- [ ] Probar flujo completo de reserva con creación de evento y Meet

## Vista de Calendario para Panel Admin
- [ ] Crear componente de calendario mensual con grid de días
- [ ] Mostrar reservas en cada día del calendario
- [ ] Implementar navegación entre meses (anterior/siguiente)
- [ ] Añadir filtros por empresa y servicio
- [ ] Crear modal de detalles al hacer clic en reserva
- [ ] Mostrar colores diferentes por tipo de servicio (Mentoring/Estilismo)
- [ ] Añadir indicadores de capacidad de slots
- [ ] Crear ruta /admin/calendario y añadir a navegación
- [ ] Integrar con endpoint de reservas existente

## Migración a Domain-Wide Delegation (Service Account)
- [x] Reemplazar OAuth individual por Service Account con delegación de dominio
- [x] Actualizar lib/google-calendar.ts para usar impersonación
- [x] Eliminar endpoints OAuth innecesarios
- [x] Eliminar página /admin/google-auth
- [x] Eliminar tabla google_tokens del schema
- [x] Actualizar lógica de creación de eventos
- [x] Probar creación de eventos con impersonación (FUNCIONA)
- [x] Documentar pasos de configuración en Google Workspace Admin Console
- [x] Guardar archivo .google-service-account.json local
- [x] Configurar código para usar archivo local

## Vista de Calendario - Panel Admin (Nueva Implementación)
- [ ] Crear componente CalendarView con diseño mensual
- [ ] Implementar navegación entre meses (anterior/siguiente/hoy)
- [ ] Mostrar reservas en cada día con colores por servicio
- [ ] Añadir filtros por empresa y servicio
- [ ] Crear modal de detalles de reserva con toda la información
- [ ] Mostrar indicadores visuales (capacidad, estado, modalidad)
- [ ] Crear ruta /admin/calendario
- [ ] Añadir enlace en navegación del panel admin
- [ ] Diseño responsive y fácil de usar

## Sistema de Autenticación con Contraseña para Equipo
- [x] Añadir campo password (hash) a tabla users
- [x] Instalar bcrypt para hash de contraseñas
- [ ] Crear endpoint de login con email/contraseña
- [ ] Crear página de login (/login)
- [ ] Actualizar panel Admin para crear usuarios con contraseña
- [ ] Implementar cambio de contraseña
- [ ] Mantener OAuth para administradora principal
- [ ] Probar login con usuarios del equipo

## Sistema de Oficinas para Reservas Presenciales
- [x] Añadir campo "oficina" (Barcelona, Madrid, Málaga) a tabla bookings
- [x] Actualizar formulario de reserva con selector de oficina
- [x] Mostrar selector solo para servicios presenciales (Estilismo)
- [x] Actualizar panel de gestión para mostrar oficina
- [x] Añadir filtros por oficina en panel de reservas
- [x] Permitir acceso de usuarios del equipo (role="user") al panel de reservas
- [x] Indicadores visuales de oficina en cada reserva (Badge azul)
- [x] Añadir columna oficina en exportación CSV
- [ ] Crear vista de calendario compartida para todo el equipo

## Vista de Calendario Visual
- [x] Crear componente CalendarView con vista mensual
- [x] Implementar navegación entre meses (anterior/siguiente)
- [x] Añadir filtros por oficina en calendario
- [x] Añadir filtros por anfitrión en calendario
- [x] Mostrar reservas en días correspondientes con colores
- [x] Diferenciar Mentoring (naranja) y Estilismo (azul)
- [x] Implementar modal de detalles al hacer clic en reserva
- [x] Añadir ruta /admin/calendario
- [x] Integrar calendario en navegación del panel admin
- [x] Botón "Ver Calendario" en panel admin
- [x] Leyenda de colores (naranja=virtual, azul=presencial)

## Sistema de Notificaciones por Email
- [x] Crear helper de envío de emails (lib/email.ts)
- [x] Crear plantilla de email para voluntario (confirmación de reserva)
- [x] Integrar envío de email al crear reserva
- [x] Enviar email al voluntario con detalles de la sesión
- [x] Incluir enlace Google Meet en email (si es virtual)
- [x] Incluir dirección de oficina en email (si es presencial)
- [x] Manejar errores de envío de email sin bloquear la reserva
- [ ] Verificar que enlace Meet esté visible en calendario
- [ ] Probar envío de emails en creación de reserva real

## Asignación Manual de Anfitriones
- [x] Añadir selector de anfitrión en panel de gestión de reservas
- [x] Crear endpoint para cambiar anfitrión de una reserva
- [x] Implementar función de transferencia de evento en Google Calendar
- [x] Mantener mismo enlace de Google Meet al transferir
- [x] Actualizar base de datos con nuevo anfitrión
- [x] Crear endpoint para obtener lista de miembros del equipo
- [x] Selector desplegable funcional en tabla de reservas
- [ ] Mostrar indicador visual de anfitrión asignado en calendario
- [ ] Probar transferencia de eventos entre anfitriones

## Notificaciones por Email a Anfitriones
- [x] Crear plantilla de email para anfitriones con detalles de asignación
- [x] Enviar email al anfitrión cuando se crea una reserva (asignación automática)
- [x] Enviar email al nuevo anfitrión cuando se cambia manualmente
- [x] Incluir datos del voluntario en el email
- [x] Incluir enlace de Google Meet en el email (si es virtual)
- [x] Incluir dirección de oficina en el email (si es presencial)
- [ ] Probar envío de emails a anfitriones en reserva real

## Sistema de Cancelaciones
- [x] Añadir campo status (pendiente/confirmada/completada/cancelada) a tabla bookings
- [x] Crear endpoint para cancelar reserva
- [x] Liberar slot automáticamente al cancelar
- [x] Eliminar evento de Google Calendar al cancelar
- [x] Enviar email de cancelación a voluntario
- [x] Enviar email de cancelación a anfitrión
- [x] Añadir botón cancelar en panel de gestión
- [x] Modal de confirmación con motivo de cancelación
- [x] Mostrar reservas canceladas en panel (con filtro)

## Dashboard de Estadísticas
- [x] Crear página de dashboard (/admin/dashboard)
- [x] Endpoint para obtener estadísticas generales
- [x] Total de reservas por mes
- [x] Reservas por empresa (top 10)
- [x] Reservas por oficina
- [x] Reservas por anfitrión
- [x] Gráficos visuales con recharts
- [ ] Filtros por rango de fechas
- [ ] Exportar reportes a CSV

## Validaciones y Estados
- [x] Validar reservas duplicadas (mismo email + fecha cercana)
- [x] Límite de reservas activas por voluntario
- [ ] Confirmación antes de cambiar anfitrión
- [x] Validar capacidad de slots antes de reservar
- [x] Estados de reserva visibles en panel
- [x] Filtros por estado en panel de gestión

## Recordatorios Automáticos
- [x] Crear función de recordatorio 24h antes
- [x] Crear función de recordatorio 2h antes
- [x] Endpoint para enviar recordatorios
- [x] Documentar cómo configurar cron jobs
- [x] Template de email para recordatorio 24h
- [x] Template de email para recordatorio 2h

## Mejoras UX
- [x] Búsqueda en panel de gestión (por nombre, email, empresa)
- [ ] Indicadores de disponibilidad en slots
- [x] Paginación en tabla de reservas
- [ ] Ordenamiento de columnas
- [ ] Tooltips explicativos
- [x] Mensajes de éxito/error más claros
- [x] Loading states en todas las acciones


## Mejoras UX Solicitadas
- [x] Ordenar reservas más recientes primero en panel de gestión
- [x] Mejorar experiencia de usuario en todos los tableros
- [x] Optimizar visualización de datos
- [x] Mejorar navegación entre secciones


## Reorganización de Layout
- [x] Mover tabla de reservas antes de los filtros en página de gestión


## Página de FAQs para Voluntarios
- [x] Extraer contenido del PDF de FAQs
- [x] Copiar imagen de cabecera al proyecto
- [x] Crear página /faqs con diseño atractivo
- [x] Incluir información sobre acuerdo de colaboración
- [x] Añadir paso a paso del proceso de voluntariado
- [x] Enlazar desde landing page principal


## Footer y Cookies
- [ ] Añadir enlaces a Política de Privacidad en footer
- [ ] Añadir enlaces a Aviso Legal en footer
- [ ] Implementar banner de cookies según web principal
- [ ] Configurar almacenamiento de consentimiento de cookies


## Footer y Cookies
- [x] Añadir enlaces a política de privacidad en footer
- [x] Añadir enlace a aviso legal en footer
- [x] Crear componente CookieBanner
- [x] Implementar mensaje de cookies según web de FQT
- [x] Añadir footer a todas las páginas públicas (Home y FAQs)


## Campo Responsable Cuenta
- [x] Añadir campo accountManager a tabla companies en schema
- [x] Migrar cambios a base de datos (db:push)
- [x] Actualizar formulario de creación/edición de empresas
- [x] Mostrar nombre del Responsable en página de reserva (/reservar/:slug)
- [ ] Actualizar script de población de empresas si es necesario


## Bug: Input Controlado/No Controlado
- [x] Corregir error de input cambiando de controlado a no controlado en Admin.tsx


## Verificar visualización de Responsable cuenta
- [ ] Verificar que el campo accountManager se muestre en página de reserva
- [ ] Comprobar que el backend devuelva el campo accountManager en getCompany


## Bug: Botón Guardar en Formulario de Empresas
- [x] Hacer el diálogo de empresas scrollable para que el botón sea visible
- [x] Asegurar que el botón guarda todos los campos incluyendo accountManager


## Bug: Campo accountManager no se guarda
- [x] Verificar que el formulario envía accountManager en la mutación
- [x] Verificar que el backend actualiza el campo accountManager
- [x] Comprobar que el campo se lee correctamente de la BD


## Calendario Completo para Empresas sin Día Asignado
- [x] Añadir campo fullMonthCalendar a schema de companies
- [x] Migrar cambios a base de datos
- [x] Añadir checkbox en formulario de empresas para activar calendario completo
- [x] Actualizar endpoints createCompany y updateCompany para incluir fullMonthCalendar
- [x] Mejorar interfaz de creación de slots con selector de rango de fechas
- [x] Permitir selección de años futuros (2026, 2027, etc.)
- [x] Modificar lógica de creación de slots para:
  - Empresas con calendario completo: generar todos los días del rango
  - Empresas con día asignado: generar solo días que coincidan
- [ ] Actualizar página de reserva para mostrar todos los días disponibles

## Bug: Botón Nueva Empresa no abre diálogo
- [x] Revisar evento onClick del botón Nueva Empresa
- [x] Verificar estado del Dialog (open/onOpenChange)
- [x] Comprobar si hay conflictos con otros diálogos


## Bug: Checkbox fullMonthCalendar no refleja valor al editar empresa
- [ ] Verificar que el valor se carga correctamente desde la base de datos
- [ ] Comprobar que el checkbox muestra el estado correcto al abrir edición

## Bug: Checkbox fullMonthCalendar no refleja valor al editar empresa
- [x] Verificar que el valor se carga correctamente desde la base de datos
- [x] Comprobar que el checkbox muestra el estado correcto al abrir edición
- [x] Corregido: Cambiado operador || por ?? para preservar valor 0


## Bug: Slots no aparecen cuando fullMonthCalendar está activado
- [ ] Implementar generación dinámica de slots (próximos 3 meses)
- [ ] Crear función que genere slots automáticamente al consultar disponibilidad
- [ ] Sistema perpetuo: siempre mantener 3 meses de slots disponibles
- [ ] Aplicar a todas las empresas que tengan fullMonthCalendar activado
- [ ] Probar con Purever que tiene fullMonthCalendar=1

## Bug: Checkbox fullMonthCalendar no refleja valor al editar empresa
- [x] Corregido operador || por ?? para preservar valor 0
- [x] Verificado funcionamiento correcto del checkbox

## Feature: Generación automática de slots para calendario mensual completo
- [x] Implementada función ensureSlotsForCompany en server/lib/auto-generate-slots.ts
- [x] Generación automática de slots para próximo mes
- [x] Sistema perpetuo: mantiene siempre 1 mes de slots disponibles
- [x] Generación en background (no bloquea respuesta al usuario)
- [x] Optimizado con lotes de 20 slots usando bulkCreateSlots
- [x] Excluye fines de semana y festivos españoles
- [x] Integrado en endpoint getAvailableSlots
- [x] Probado con Purever - funciona correctamente

## Edición de Usuarios Empresa
- [x] Implementar endpoint tRPC para editar usuarios empresa
- [x] Añadir funcionalidad de cambio de contraseña
- [x] Crear modal de edición de usuarios en Admin
- [x] Añadir botón de editar en tabla de usuarios
- [x] Implementar formulario pre-rellenado con datos actuales
- [x] Permitir cambiar empresa asignada
- [x] Validar que email no esté duplicado al editar

## Contraseña en Creación de Usuarios
- [x] Actualizar endpoint createUser para aceptar contraseña opcional
- [x] Añadir campo de contraseña al formulario de creación
- [x] Añadir campo de confirmación de contraseña
- [x] Validar que las contraseñas coincidan
- [x] Hash de contraseña con bcrypt antes de guardar

## Bug: Slots no se generan correctamente para patrones como "1r Miércoles"
- [ ] Implementar parser para patrones "1r/2º/3r/4º + Día"
- [ ] Generar slots solo para la ocurrencia específica del mes
- [ ] Borrar slots incorrectos de TotalEnergies
- [ ] Probar con TotalEnergies (1r Miércoles)

## Generación Automática de Slots con Patrones
- [x] Implementar parser para patrones "1r/2º/3r/4º + Día" (ej: "1º Miércoles")
- [x] Corregir regex para capturar caracteres españoles (áéíóúñü)
- [x] Generar slots solo para la ocurrencia específica del mes
- [x] Implementar función getNthDayOfMonth para calcular fechas
- [x] Generación automática en background (no bloquea usuario)
- [x] Sistema perpetuo: mantiene 1 mes de slots disponibles
- [x] Probar con TotalEnergies (1º Miércoles) - FUNCIONA ✅

## Edición de Usuarios Empresa
- [x] Implementar endpoint tRPC para editar usuarios empresa
- [x] Añadir funcionalidad de cambio de contraseña
- [x] Crear modal de edición de usuarios en Admin
- [x] Añadir botón de editar en tabla de usuarios
- [x] Implementar formulario pre-rellenado con datos actuales
- [x] Permitir cambiar empresa asignada
- [x] Validar que email no esté duplicado al editar

## Contraseña en Creación de Usuarios
- [x] Actualizar endpoint createUser para aceptar contraseña
- [x] Añadir campo de contraseña al formulario de creación
- [x] Añadir campo de confirmación de contraseña
- [x] Validar que las contraseñas coincidan
- [x] Hash de contraseña con bcrypt antes de guardar

## Error tRPC devuelve HTML
- [ ] Diagnosticar endpoint que devuelve HTML en lugar de JSON
- [ ] Verificar configuración de rutas en servidor
- [ ] Corregir middleware o routing que causa el error

## Vista para Usuarios Empresa
- [ ] Crear página CompanyDashboard para usuarios con rol empresa
- [ ] Mostrar solo reservas de su empresa asignada
- [ ] Implementar filtrado automático por companyId
- [ ] Añadir estadísticas básicas de su empresa
- [ ] Redirigir automáticamente según rol del usuario

# Dashboard para Usuarios Empresa (CompanyDashboard)

- [x] Completar componente CompanyDashboard.tsx
- [x] Mostrar información de la empresa del usuario
- [x] Listar reservas de la empresa con filtros
- [x] Mostrar estadísticas básicas (total reservas, próximas, completadas)
- [x] Implementar routing: usuarios empresa → CompanyDashboard, admin/team → Admin
- [x] Probar flujo completo con usuario empresa
- [x] Crear componente RoleBasedRedirect para routing automático
- [x] Añadir ruta /company/dashboard en App.tsx
- [x] Verificar que el sistema funciona correctamente

# Integración Zoho CRM (POSPUESTO)

- [x] Intentar OAuth (demasiado complejo, pospuesto)
- [ ] POSPUESTO: Implementar cuando el sistema principal esté completo y probado

# Seguridad: Aislamiento de datos por empresa

- [ ] Auditar router companyUser.getMyCompany para verificar filtrado por companyId
- [ ] Auditar router companyUser.getMyCompanyBookings para verificar filtrado por companyId
- [ ] Auditar router companyUser.getMyCompanyStats para verificar filtrado por companyId
- [ ] Verificar que usuarios empresa no puedan acceder a datos de otras empresas
- [ ] Probar con usuario empresa real y verificar aislamiento de datos

# Mejoras CompanyDashboard

- [ ] Añadir sección "Impacto de tu Empresa" con métricas visuales
- [ ] Mostrar número de voluntarias ayudadas
- [ ] Mostrar horas de voluntariado aportadas
- [ ] Añadir gráficos de evolución temporal
- [ ] Hacer diseño más atractivo y motivador

# Ajustes de Diseño CompanyDashboard

- [x] Añadir logo de FQT en la cabecera junto al logo de la empresa
- [x] Cambiar fondo a blanco completamente (eliminar degradado)
- [x] Eliminar sección "Información de la Empresa"
- [x] Ajustar espaciado y diseño con fondo blanco
- [x] Añadir filtro de calendario para filtrar reservas por períodos

- [x] Aplicar colores consistentes del diseño principal (#ea6852 naranja, #5a6670 gris)
- [x] Usar misma tipografía y formatos que el resto de la página (Montserrat/Roboto)

# Bug: Error en creación de usuarios empresa

- [x] Eliminar campo companyId de tabla users en schema.ts
- [x] Ejecutar migración para eliminar columna companyId
- [x] Actualizar lógica de creación de usuarios en admin para usar companyUsers
- [x] Verificar que la creación de usuarios empresa funcione correctamente
- [x] Probar CompanyDashboard con usuario empresa real

# Demostración CompanyDashboard y Zoho Analytics

- [ ] Crear usuario empresa de prueba (AXA)
- [ ] Mostrar CompanyDashboard funcionando al usuario
- [ ] Decidir qué métricas de Zoho Analytics integrar
- [ ] Decidir método de integración (iframe vs API)
- [ ] Implementar integración elegida con filtrado por empresa

## CompanyDashboard - Demostración Completada ✅
- [x] Crear tabla companyUsers en el schema para vincular usuarios con empresas
- [x] Implementar sistema de login con contraseña para usuarios empresa
- [x] Actualizar contexto para incluir companyId automáticamente cuando usuario es rol "empresa"
- [x] Corregir función getCompanyByUserId para usar tabla companyUsers (JOIN correcto)
- [x] Crear usuario empresa de prueba vinculado a AXA (prueba-axa@test.com / test123)
- [x] Verificar que CompanyDashboard muestre datos filtrados por empresa correctamente
- [x] Implementar redirección automática según rol de usuario (empresa → /company/dashboard)
- [x] Agregar import faltante de useAuth en CompanyDashboard.tsx
- [x] Probar flujo completo de login y acceso al dashboard de empresa

## Próximas Mejoras para CompanyDashboard 📋
- [ ] Corregir formato de fechas en CompanyDashboard (actualmente muestra "Invalid Date")
- [ ] Agregar más datos de prueba para demostrar estadísticas completas
- [ ] Implementar funcionalidad para que empresas puedan crear usuarios adicionales
- [ ] Documentar proceso de creación de usuarios empresa para administradores
- [ ] Agregar validación de permisos en todos los endpoints de companyUser
- [ ] Permitir a empresas ver histórico completo de reservas
- [ ] Añadir gráficos de impacto en CompanyDashboard


## Verificación Multi-Empresa Completada ✅
- [x] Revisar arquitectura y lógica de filtrado por empresa
- [x] Confirmar que ctx.user.companyId se usa en todos los endpoints de companyUser
- [x] Verificar asignación automática de companyId en el contexto
- [x] Crear usuarios de prueba para Deloitte, Amazon y CBRE
- [x] Probar login y acceso al dashboard con usuario de Deloitte (0 reservas)
- [x] Probar login y acceso al dashboard con usuario de Amazon (0 reservas)
- [x] Confirmar que cada empresa solo ve sus propios datos
- [x] Documentar proceso de creación de usuarios empresa (GUIA_USUARIOS_EMPRESA.md)
- [x] Verificar que el sistema es escalable para cualquier número de empresas


## Funcionalidad de Creación Automática de Usuarios Empresa 🔄
- [ ] Verificar si existe formulario de creación de usuarios en el panel admin
- [ ] Añadir campo de selección de empresa al formulario de creación de usuarios
- [ ] Actualizar endpoint createUser para crear automáticamente la vinculación en companyUsers
- [ ] Probar creación de usuario empresa desde el panel admin
- [ ] Verificar que la vinculación se crea automáticamente
- [ ] Documentar el proceso en la guía de usuario


## Arreglar Ruta /calendario (Error 404) 🔧
- [x] Verificar rutas existentes en App.tsx
- [x] Encontrar el componente de calendario
- [x] Añadir ruta /calendario al router
- [x] Probar que la ruta funciona correctamente


## Restaurar Landing Original con Calendarios 🏠
- [x] Verificar qué componente está en Home.tsx actualmente
- [x] Buscar el landing original con calendarios de empresas
- [x] Eliminar RoleBasedRedirect de la ruta /
- [x] Restaurar el landing como página principal
- [x] Verificar que el botón Admin funcione correctamente
- [x] Probar flujo: landing → login admin → panel según rol


## Ajustar Validación de Contraseñas 🔐
- [ ] Buscar validación de contraseñas en el código
- [ ] Ajustar requisitos a algo más flexible (ej: mínimo 6 caracteres)
- [ ] Actualizar mensaje de error
- [ ] Probar registro con nueva validación


## Corregir Error SQL en Login 🐛
- [x] Encontrar query que selecciona companyId de users
- [x] Eliminar companyId del select (no existe en users)
- [x] Probar login con usuario empresa
- [x] Verificar que el contexto obtiene companyId de companyUsers


## Actualizar Logo FQT 🎨
- [x] Copiar logo FQT (persona con corazón coral) a /client/public
- [x] Actualizar VITE_APP_LOGO en variables de entorno
- [x] Verificar logo en todas las páginas (landing, login, dashboards)
- [x] Guardar checkpoint con nuevo logo


## Cambiar Texto "Voluntarias Ayudadas" 📝
- [x] Buscar "Voluntarias Ayudadas" en CompanyDashboard.tsx
- [x] Cambiar por "Impacto del Voluntariado"
- [x] Verificar el cambio en el navegador
- [x] Guardar checkpoint


## Añadir Botón "Accede como Empresa" en Header 🏢
- [x] Añadir botón "Accede como Empresa" junto al botón Admin en el header del landing page
- [x] Botón debe redirigir a /login (página de login con contraseña)
- [x] Estilizar botón de forma consistente con el botón Admin


## Sistema de Recuperación de Contraseña 🔐
- [x] Añadir tabla passwordResetTokens al schema (token, userId, expiresAt)
- [x] Crear endpoint requestPasswordReset (envía email con token)
- [x] Crear endpoint validateResetToken (verifica si token es válido)
- [x] Crear endpoint resetPassword (cambia contraseña con token válido)
- [x] Crear página /forgot-password (solicitar recuperación)
- [x] Crear página /reset-password (establecer nueva contraseña)
- [x] Añadir enlace "¿Olvidaste tu contraseña?" en formulario de login
- [x] Implementar plantilla de email para recuperación
- [x] Probar flujo completo de recuperación


## Integración de Zoho Analytics por Empresa 📊
- [x] Añadir sección de Analytics en CompanyDashboard con iframe
- [x] Implementar filtrado dinámico por empresa usando ZOHO_CRITERIA
- [x] Probar visualización con usuarios de diferentes empresas
- [x] Ajustar diseño y altura del iframe
- [x] Documentar cómo funciona el filtrado


## Ajustar Filtro de Zoho Analytics 🔧
- [x] Cambiar filtro de "Empresa" a "Nombre de Cuenta" en CompanyDashboard
- [x] Probar visualización con usuario empresa
- [x] Usuario actualizó campos en Zoho a "Nombre de la Empresa"
- [x] Actualizar filtro a "Nombre de la Empresa" en CompanyDashboard


## Implementar Dos Iframes de Zoho Analytics 📊📊
- [ ] Añadir iframe global "Impacto de FQT" sin filtros
- [ ] Añadir iframe filtrado "El impacto de tu empresa" con filtro por empresa
- [ ] Organizar ambos iframes en secciones separadas del dashboard
- [ ] Probar visualización con usuario empresa


## Actualizar Formato de Iframes de Zoho 🔄
- [x] Actualizar iframe global con formato correcto proporcionado por usuario
- [x] Solicitar iframe filtrado con formato correcto
- [x] Probar visualización de ambos iframes


## Corregir Sintaxis de Filtro ZOHO_CRITERIA 🔍
- [x] Investigar sintaxis correcta de ZOHO_CRITERIA para Zoho Analytics
- [x] Probar sintaxis alternativas (sin comillas, con URL encoding diferente)
- [ ] Eliminar filtro si no funciona y dejar iframe sin filtrar
- [x] Usuario proporcionó nombre correcto del campo en Zoho ("Nombre de cuenta")
- [x] Implementar conversión a Title Case para compatibilidad
- [x] Usuario arregló columnas duplicadas en Zoho Analytics
- [x] Actualizar filtro a usar "Cuenta" como nombre de campo
- [ ] Probar filtro con nombre de campo correcto
- [ ] Verificar que el iframe filtrado muestre datos correctamente


## Simplificar Dashboard de Empresa 🔧
- [x] Quitar parámetro ZOHO_CRITERIA del segundo iframe
- [x] Eliminar las 4 tarjetas de métricas superiores
- [x] Mantener los dos iframes de Zoho Analytics y tabla de reservas
- [x] Probar que ambos iframes se visualicen correctamente


## Funcionalidad de Descarga en PDF 📄
- [x] Eliminar botones de descarga de PDF del CompanyDashboard (filtros no funcionan)
- [x] Eliminar endpoints de PDF del backend
- [x] Limpiar código relacionado con generación de PDFs


## Revisión Final de Diseño y UX 🎨
- [x] Uniformizar tamaño de todos los logos de empresas en landing page (formato Gameloft)
- [x] Asegurar que todos los logos tengan contenedores del mismo tamaño
- [x] Verificar que los logos se vean correctamente en todos los tamaños de pantalla
- [x] Añadir logo FQT en página de login
- [x] Añadir logo FQT en página de forgot-password
- [x] Añadir logo FQT en página de reset-password
- [x] Revisar coherencia de colores en todas las páginas
- [x] Revisar tipografía y espaciados en todas las páginas
- [x] Verificar responsive design en todas las páginas

## Funcionalidad de Eliminar Usuarios 🗑️
- [x] Añadir botón de eliminar en tabla de usuarios del panel Admin
- [x] Crear endpoint backend para eliminar usuarios
- [x] Implementar confirmación antes de eliminar
- [ ] Probar eliminación de usuarios de prueba
- [x] Verificar que no se puedan eliminar usuarios con reservas activas


## Sistema de Gestión de Emails Automáticos 📧
- [x] Crear tabla email_settings para configuración de notificaciones
- [x] Crear endpoints backend para gestión de notificaciones
- [x] Inicializar configuración por defecto de notificaciones
- [x] Añadir switches on/off para cada tipo de email en Admin
- [x] Implementar previsualización de emails antes de activar
- [x] Crear sección "Notificaciones" en panel Admin
- [x] Mostrar lista de todos los tipos de emails automáticos
- [x] Permitir activar/desactivar cada tipo individualmente
- [x] Botón "Previsualizar" para ver cómo se verá el email
- [x] Integrar con sistema de plantillas editables existente

## Recordatorios Automáticos 🔔
- [ ] Crear sistema de cron jobs para recordatorios
- [ ] Implementar recordatorio 24h antes de la sesión
- [ ] Implementar recordatorio 2h antes de la sesión
- [ ] Usar plantillas de email editables desde Admin
- [ ] Añadir switch on/off para recordatorios en Admin
- [ ] Probar envío de recordatorios

## Exportación de Calendario 📅
- [ ] Crear función para generar archivos .ics
- [ ] Añadir botón "Añadir a calendario" en confirmación de reserva
- [ ] Incluir todos los detalles de la sesión en el evento
- [ ] Probar compatibilidad con Google Calendar
- [ ] Probar compatibilidad con Outlook

## Sistema de Valoraciones ⭐
- [ ] Crear tabla de valoraciones en base de datos
- [ ] Añadir formulario de valoración post-sesión
- [ ] Implementar sistema de estrellas (1-5)
- [ ] Añadir campo de comentario opcional
- [ ] Mostrar valoraciones promedio en dashboard Admin
- [ ] Enviar email solicitando valoración después de la sesión (con switch on/off)

## Portal del Voluntario
- [ ] Diseñar esquema de base de datos para voluntarios
- [ ] Crear tabla volunteers con perfil completo
- [ ] Crear tabla volunteer_sessions para tracking de sesiones
- [ ] Crear tabla badges para sistema de logros
- [ ] Crear tabla certificates para certificados digitales
- [ ] Implementar sistema de autenticación (login/registro) para voluntarios
- [ ] Crear página de registro de voluntarios
- [ ] Crear página de login de voluntarios
- [ ] Implementar recuperación de contraseña
- [ ] Crear layout principal del portal del voluntario
- [ ] Implementar sección "Mi Perfil" con datos editables
- [ ] Añadir carga de foto de perfil
- [ ] Crear dashboard principal del voluntario
- [ ] Implementar sección "Mujeres Atendidas" con integración Zoho
- [ ] Crear sistema de badges por hitos (1, 5, 10 sesiones)
- [ ] Implementar ranking de voluntarios
- [ ] Implementar ranking de empresas más activas
- [ ] Crear sistema de certificados digitales descargables
- [ ] Implementar progreso visual hacia microcredenciales
- [ ] Crear sección "Mi Impacto en FQT"
- [ ] Crear sección "El Impacto de mi Empresa"
- [ ] Implementar biblioteca de recursos
- [ ] Añadir acceso a cursos de Trainer Central
- [ ] Aplicar coherencia visual con el resto de la web
- [ ] Pruebas completas del portal del voluntario

## Portal del Voluntario - COMPLETADO
- [x] Sistema de autenticación (login/registro) para voluntarios
- [x] Base de datos: volunteers, volunteerSessions, badges, certificates, resources
- [x] Backend: volunteer-db.ts y volunteer-router.ts con todos los endpoints
- [x] Página de registro de voluntarios
- [x] Página de login de voluntarios
- [x] Dashboard principal del voluntario
- [x] Sección Mi Perfil (editable con foto)
- [x] Sección Mi Impacto en FQT
- [x] Sección Impacto de mi Empresa
- [x] Rankings de voluntarios y empresas
- [x] Sistema de certificados digitales descargables
- [x] Biblioteca de recursos con búsqueda
- [x] Acceso a cursos FQT en Trainer Central
- [x] Layout del portal con navegación colorida
- [x] Sistema de badges por hitos (primera sesión, 5 sesiones, 10 sesiones)
- [x] Coherencia visual con el resto de la web (color #ea6852)

## Nuevas Funcionalidades Implementadas
- [x] Exportación de calendario (.ics) para reservas
- [x] Sistema de valoraciones post-sesión (ratings)
- [x] Panel de valoraciones en Admin
- [x] Mensaje de agradecimiento con confetti al completar reserva

## Sistema de Compartición Social
- [ ] Crear componente SocialShareButtons
- [ ] Integrar compartición en Dashboard (badges)
- [ ] Integrar compartición en página de Certificados
- [ ] Integrar compartición en Mi Impacto
- [ ] Probar compartición en LinkedIn, Twitter y Facebook

## Ajustes Portal del Voluntario
- [ ] Unificar colores del portal con color corporativo #ea6852
- [ ] Cambiar nombre "Cursos FQT" a "FQT Volunteer Academy"
- [ ] Subir materiales reales a Biblioteca
- [ ] Subir materiales reales a FQT Volunteer Academy

- [x] Añadir miniatura visual al curso "En Clave de Género"
- [x] Unificar todos los colores del portal con #ea6852 (coral corporativo)
- [x] Verificar logo FQT visible en todas las páginas

- [x] Eliminar recurso de podcast de la Biblioteca

- [x] Renombrar "FQT Volunteer Academy" a "Academia de Voluntariado FQT"

- [x] Añadir 3 tipologías de voluntariado a la Biblioteca (Servicio Individual, Programas Formativos, Estilistas)
- [x] Añadir documentación general (Código Ético y Glosario de Igualdad)

- [x] Añadir 8 nuevos documentos a la Biblioteca (guías de mentoring, entrevistas, CVs, portales)
- [x] Añadir disclaimer de confidencialidad y propiedad intelectual en la Biblioteca

- [x] Cambiar diseño de biblioteca a 3 columnas para reducir scroll

- [x] Convertir todos los archivos DOC/DOCX de la biblioteca a PDF
- [x] Implementar contador de descargas para cada documento
- [x] Mostrar estadísticas de descargas en panel de admin (equipo FQT)

- [x] Crear usuario de prueba para el portal del voluntario

## Integraciones Portal del Voluntario
- [x] Implementar carga de foto de perfil (documentos o cámara)
- [ ] Vincular sesiones completadas con sistema de reservas
- [ ] Crear sistema de badges automáticos por número de mentorizaciones
- [ ] Añadir textos motivadores alineados con FQT a los badges
- [ ] Preparar estructura para integración con Zoho CRM (sesiones)
- [ ] Preparar estructura para integración con Zoho Analytics (mi impacto)
- [ ] Preparar estructura para integración con Zoho Survey (valoraciones)
- [ ] Mover disclaimer de confidencialidad al encabezado de la biblioteca

- [x] Implementar sistema de notificaciones para badges ganados

## Corrección de Errores tRPC
- [x] Corregir error "Unexpected token '<', "<!doctype "... is not valid JSON" en página principal
- [x] Verificar configuración de rutas tRPC en servidor
- [x] Asegurar que todas las llamadas tRPC devuelven JSON correctamente

## Añadir Nuevo Administrador
- [x] Añadir a Dora Bárcenas (comunicacion@quierotrabajo.org) como administradora del sistema
- [x] Actualizar lista de emails autorizados en el código
- [x] Verificar que puede acceder al panel de administración

## Configurar Acceso OAuth para Dora Bárcenas
- [x] Modificar schema para permitir openId en usuarios con contraseña
- [x] Implementar endpoint de vinculación de cuentas
- [x] Actualizar lógica de autenticación OAuth para vincular cuentas existentes
- [ ] Probar que funciona el login con Google y con contraseña

## Corregir Error 404 en Ruta /volunteer
- [x] Revisar configuración de rutas en App.tsx
- [x] Verificar que existe el componente VolunteerPortal
- [x] Corregir la ruta y verificar que funciona

## Revisar Integraciones Google Calendar y Meet
- [x] Buscar implementación de Google Calendar API en el código
- [x] Buscar implementación de Google Meet en el código
- [x] Verificar si las credenciales están configuradas
- [x] Documentar estado actual de las integraciones

## Crear Pestaña Acceso Voluntarios y Modificar Pestaña Empresa con Rankings
- [ ] Analizar componentes existentes del Design System (tabs, cards, filtros, rankings)
- [ ] Crear endpoints backend para acciones de voluntariado (GET /api/volunteer-actions)
- [ ] Crear endpoints backend para rankings (GET /api/rankings/volunteers y /companies)
- [ ] Implementar pestaña "Acceso voluntarios" con header de métricas personales
- [ ] Implementar listado de acciones con filtros (estado, fecha, modalidad) y buscador
- [ ] Añadir CTAs (Apuntarme / Cancelar / Ver detalle) en acciones
- [ ] Modificar pestaña "Empresa" para incluir ranking de voluntarios
- [ ] Modificar pestaña "Empresa" para incluir ranking de empresas
- [ ] Implementar lógica de ordenación y desempate en rankings (score → hours → sessions → nombre)
- [ ] Añadir paginación servidor (20 ítems) con skeletons
- [ ] Implementar filtros persistentes por pestaña con botón "Restablecer"
- [ ] Verificar coherencia visual con Design System (colores, tipografías, espaciados)
- [ ] Añadir accesibilidad (tabs por teclado, contraste WCAG AA, aria-*)
- [ ] Implementar telemetría (tab_viewed, ranking_viewed, filter_changed, action_applied)
- [ ] Verificar roles y permisos (volunteer, company_admin, fqt_admin)

## Crear Pestaña "Reservar Sesión" en Portal de Voluntarios
- [ ] Añadir nueva pestaña "Reservar Sesión" en VolunteerLayout
- [ ] Crear componente VolunteerBooking que muestre el listado de empresas
- [ ] Integrar con el sistema de reservas público existente
- [ ] Mantener coherencia visual con Design System

## Modificar Pestaña "Impacto de mi Empresa" con Rankings
- [ ] Añadir sección de ranking de voluntarios (reutilizar componente de Rankings)
- [ ] Añadir sección de ranking de empresas (reutilizar componente de Rankings)
- [ ] Mantener secciones actuales sin cambios
- [ ] Verificar coherencia visual con Design System

## Añadir Botón Voluntarios en Landing
- [x] Añadir botón "Accede como Voluntario" en header del landing
- [x] Posicionar junto a "Accede como Empresa"
- [x] Mantener coherencia visual con Design System
- [x] Verificar que redirige correctamente al portal de voluntarios

## Modificar Pestaña Impacto de mi Empresa con Rankings
- [x] Extraer componente RankingVolunteers reutilizable
- [x] Extraer componente RankingCompanies reutilizable
- [x] Integrar RankingVolunteers en VolunteerCompanyImpact
- [x] Integrar RankingCompanies en VolunteerCompanyImpact
- [x] Mantener secciones actuales sin cambios
- [x] Verificar coherencia visual con Design System
- [x] Verificar lógica de ordenación (score desc → hours desc → sessions desc → nombre asc)

## Corregir Error HTML Anidado en VolunteerLogin
- [x] Identificar el <a> anidado en línea 98-99 de VolunteerLogin.tsx
- [x] Reemplazar Link de wouter por navegación programática
- [x] Verificar que el error de hydration desaparece

## Crear Pestañas en Portal de Empresas
- [ ] Analizar estructura actual del portal de empresas (CompanyDashboard)
- [ ] Crear pestaña "Impacto de mi Empresa" adaptada para empresas
- [ ] Crear pestaña "Rankings" adaptada para empresas
- [ ] Reutilizar componentes RankingVolunteers y RankingCompanies
- [ ] Preparar estructura de datos para integración Zoho CRM
- [ ] Verificar coherencia visual con Design System

## Agregar Pestañas de Navegación en Portal de Empresas
- [x] Analizar estructura actual del CompanyDashboard
- [x] Diseñar sistema de pestañas para navegación (Impacto / Rankings)
- [x] Crear componente de navegación con pestañas
- [x] Separar contenido actual en CompanyImpact.tsx
- [x] Crear CompanyRankings.tsx adaptado para empresas
- [x] Actualizar rutas en App.tsx
- [x] Probar navegación entre pestañas
- [x] Verificar que cada empresa solo ve sus datos

## Exportación CSV en Portal de Empresas
- [x] Implementar función de exportación a CSV en CompanyImpact
- [x] Añadir botón de descarga en la sección de reservas
- [x] Exportar datos filtrados según el filtro de fecha activo
- [x] Incluir todas las columnas relevantes (fecha, hora, servicio, voluntaria, estado)
- [x] Probar exportación con diferentes filtros

## Corregir Visualización de Iframes Zoho Analytics
- [x] Investigar URLs correctas de Zoho Analytics para embebido público
- [x] Verificar permisos de compartición en Zoho Analytics
- [x] Actualizar URLs en CompanyImpact.tsx
- [x] Actualizar URLs en CompanyRankings.tsx
- [x] Probar visualización en navegador
- [x] Documentar URLs correctas para futuras referencias

## Subir Proyecto a GitHub
- [ ] Clonar repositorio vlop79/WEB-RESERVAS
- [ ] Copiar archivos del proyecto al repositorio
- [ ] Crear .gitignore apropiado
- [ ] Hacer commit de todos los archivos
- [ ] Push a GitHub
- [ ] Verificar que el código se subió correctamente
