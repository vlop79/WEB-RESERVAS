import 'dotenv/config';
import { createCalendarEvent, getTeamMembers } from '../lib/google-calendar';

async function testGoogleCalendar() {
  console.log('🧪 Probando integración de Google Calendar con Domain-Wide Delegation...\n');

  try {
    // Verificar que las credenciales estén configuradas
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error('❌ GOOGLE_SERVICE_ACCOUNT_JSON no está configurado en las variables de entorno');
    }

    console.log('✅ Credenciales de Service Account encontradas');

    // Obtener lista de miembros del equipo
    const teamMembers = getTeamMembers();
    console.log(`✅ Miembros del equipo configurados: ${teamMembers.length}`);
    teamMembers.forEach((email, index) => {
      console.log(`   ${index + 1}. ${email}`);
    });

    // Usar el primer miembro del equipo para la prueba
    const testHostEmail = teamMembers[0];
    console.log(`\n🎯 Creando evento de prueba en el calendario de: ${testHostEmail}`);

    // Crear un evento de prueba para mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(15, 0, 0, 0);

    const startDateTime = tomorrow.toISOString();
    const endDateTime = endTime.toISOString();

    console.log(`📅 Fecha: ${tomorrow.toLocaleDateString('es-ES')}`);
    console.log(`⏰ Hora: ${tomorrow.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`);

    const result = await createCalendarEvent({
      hostEmail: testHostEmail,
      summary: '🧪 Prueba - Sistema de Reservas FQT',
      description: 'Este es un evento de prueba creado automáticamente por el sistema de reservas.\n\nSi ves este evento, significa que la integración con Google Calendar funciona correctamente.',
      startDateTime,
      endDateTime,
      attendees: ['test@example.com'],
      includeGoogleMeet: true,
    });

    console.log('\n✅ ¡Evento creado exitosamente!');
    console.log(`📋 ID del evento: ${result.eventId}`);
    console.log(`🔗 Enlace del evento: ${result.htmlLink}`);
    
    if (result.meetLink) {
      console.log(`📹 Enlace de Google Meet: ${result.meetLink}`);
    } else {
      console.log('⚠️  No se generó enlace de Google Meet');
    }

    console.log('\n✅ La integración funciona correctamente');
    console.log('💡 Puedes verificar el evento en Google Calendar');
    console.log(`💡 Revisa el calendario de: ${testHostEmail}`);

  } catch (error: any) {
    console.error('\n❌ Error al probar la integración:');
    console.error(error.message);
    
    if (error.message.includes('Domain-wide delegation')) {
      console.error('\n💡 Solución:');
      console.error('   1. Ve a Google Workspace Admin Console (admin.google.com)');
      console.error('   2. Security → API Controls → Domain-wide Delegation');
      console.error('   3. Verifica que el Client ID de la Service Account esté autorizado');
      console.error('   4. Scopes requeridos:');
      console.error('      - https://www.googleapis.com/auth/calendar');
      console.error('      - https://www.googleapis.com/auth/calendar.events');
    }

    if (error.message.includes('Invalid impersonation')) {
      console.error('\n💡 Solución:');
      console.error('   El email del usuario debe pertenecer al dominio de Google Workspace');
      console.error('   Verifica que los emails del equipo sean correctos');
    }

    process.exit(1);
  }
}

testGoogleCalendar();
