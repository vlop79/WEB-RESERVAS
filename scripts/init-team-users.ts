import 'dotenv/config';
import { createOrUpdatePasswordUser } from '../server/db';

const TEAM_MEMBERS = [
  {
    email: 'barcelona@quierotrabajo.org',
    name: 'Barcelona FQT',
    password: 'Barcelona2025!', // Cambiar después del primer login
    role: 'user' as const,
  },
  {
    email: 'madrid@quierotrabajo.org',
    name: 'Madrid FQT',
    password: 'Madrid2025!',
    role: 'user' as const,
  },
  {
    email: 'malaga@quierotrabajo.org',
    name: 'Málaga FQT',
    password: 'Malaga2025!',
    role: 'user' as const,
  },
  {
    email: 'silvia@quierotrabajo.org',
    name: 'Silvia FQT',
    password: 'Silvia2025!',
    role: 'user' as const,
  },
  {
    email: 'proyecto@quierotrabajo.org',
    name: 'Proyecto FQT',
    password: 'Proyecto2025!',
    role: 'user' as const,
  },
];

async function initTeamUsers() {
  console.log('🔧 Inicializando usuarios del equipo FQT...\n');

  try {
    for (const member of TEAM_MEMBERS) {
      console.log(`➕ Creando/actualizando usuario: ${member.email}`);
      await createOrUpdatePasswordUser(member);
      console.log(`   ✅ Usuario creado: ${member.name}`);
      console.log(`   🔑 Contraseña temporal: ${member.password}`);
      console.log('');
    }

    console.log('✅ Todos los usuarios del equipo han sido inicializados\n');
    console.log('📋 Resumen de credenciales:');
    console.log('═'.repeat(60));
    TEAM_MEMBERS.forEach((member) => {
      console.log(`Email: ${member.email}`);
      console.log(`Contraseña: ${member.password}`);
      console.log('─'.repeat(60));
    });
    console.log('');
    console.log('⚠️  IMPORTANTE:');
    console.log('   - Estas son contraseñas temporales');
    console.log('   - Los usuarios deben cambiarlas después del primer login');
    console.log('   - Acceso: https://tu-dominio/login');
    console.log('');

  } catch (error: any) {
    console.error('❌ Error al inicializar usuarios:', error.message);
    process.exit(1);
  }
}

initTeamUsers();
