// Script de verificación de conexión a Supabase
const { createClient } = require('@supabase/supabase-js');

// Credenciales del proyecto
const supabaseUrl = 'https://eboqurfvcdiqdwbhcqmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib3F1cmZ2Y2RpcWR3YmhjcW14Iiwicm9sZSIsImFub24iLCJpYXQiOjE3NzEzODcwMzcsImV4cCI6MjA4Njk2MzAzN30.UYLRxn4f6d7Kt8HZcKXdjvFJdZTGH4lJHyRp3BY348I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyConnection() {
  console.log('🔌 Verificando conexión a Supabase...');
  console.log(`   URL: ${supabaseUrl}`);
  console.log('');

  try {
    // Verificar si la tabla users existe y obtener datos
    console.log('📋 Verificando tabla "users"...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('❌ Error al consultar tabla users:', usersError.message);
      console.error('   Código:', usersError.code);
      
      if (usersError.code === '42P01') {
        console.log('');
        console.log('⚠️  La tabla "users" no existe. Debes ejecutar el SQL en Supabase:');
        console.log('   1. Ve al SQL Editor: https://supabase.com/dashboard/project/eboqurfvcdiqdwbhcqmx/sql-editor');
        console.log('   2. Pega el contenido de supabase/schema.sql');
        console.log('   3. Ejecuta el script');
      }
      return false;
    }

    console.log(`✅ Tabla "users" existe con ${users.length} registros`);
    
    if (users.length > 0) {
      console.log('');
      console.log('👥 Participantes:');
      users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (PIN: ${user.pin})`);
      });
    }

    // Verificar tabla daily_entries
    console.log('');
    console.log('📋 Verificando tabla "daily_entries"...');
    const { data: entries, error: entriesError } = await supabase
      .from('daily_entries')
      .select('*')
      .limit(1);

    if (entriesError) {
      console.error('❌ Error al consultar tabla daily_entries:', entriesError.message);
      return false;
    }

    console.log('✅ Tabla "daily_entries" existe');

    // Verificar función get_user_streak
    console.log('');
    console.log('📋 Verificando función "get_user_streak"...');
    const { data: streak, error: streakError } = await supabase
      .rpc('get_user_streak', { user_uuid: users[0]?.id });

    if (streakError) {
      console.error('❌ Error al llamar función get_user_streak:', streakError.message);
      return false;
    }

    console.log('✅ Función "get_user_streak" existe y funciona');
    console.log(`   Racha de ${users[0]?.name}: ${streak} días`);

    console.log('');
    console.log('🎉 ¡Todas las verificaciones pasaron!');
    console.log('');
    console.log('📊 Resumen:');
    console.log(`   - Tabla "users": ${users.length} participantes`);
    console.log('   - Tabla "daily_entries": OK');
    console.log('   - Función "get_user_streak": OK');
    
    return true;

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    return false;
  }
}

verifyConnection().then(success => {
  process.exit(success ? 0 : 1);
});
