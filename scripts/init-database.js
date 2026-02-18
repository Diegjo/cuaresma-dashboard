// Script para inicializar la base de datos usando la API REST de Supabase
// Este script intenta crear las tablas y datos iniciales usando operaciones REST

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eboqurfvcdiqdwbhcqmx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida');
  console.error('   Asegúrate de tener el archivo .env.local configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos de los 15 participantes
const users = [
  { name: 'Amigo 1', pin: '1001' },
  { name: 'Amigo 2', pin: '1002' },
  { name: 'Amigo 3', pin: '1003' },
  { name: 'Amigo 4', pin: '1004' },
  { name: 'Amigo 5', pin: '1005' },
  { name: 'Amigo 6', pin: '1006' },
  { name: 'Amigo 7', pin: '1007' },
  { name: 'Amigo 8', pin: '1008' },
  { name: 'Amigo 9', pin: '1009' },
  { name: 'Amigo 10', pin: '1010' },
  { name: 'Amigo 11', pin: '1011' },
  { name: 'Amigo 12', pin: '1012' },
  { name: 'Amigo 13', pin: '1013' },
  { name: 'Amigo 14', pin: '1014' },
  { name: 'Amigo 15', pin: '1015' },
];

async function initializeDatabase() {
  console.log('🔌 Conectando a Supabase...');
  console.log(`   URL: ${supabaseUrl}`);
  console.log('');

  try {
    // Verificar si la tabla users existe
    console.log('📋 Verificando tabla "users"...');
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('count');

    if (checkError) {
      if (checkError.message.includes('Could not find the table')) {
        console.log('❌ La tabla "users" no existe');
        console.log('');
        console.log('⚠️  IMPORTANTE: Las tablas deben crearse manualmente en Supabase');
        console.log('');
        console.log('📋 Instrucciones:');
        console.log('   1. Ve al SQL Editor de tu proyecto:');
        console.log('      https://supabase.com/dashboard/project/eboqurfvcdiqdwbhcqmx/sql-editor');
        console.log('   2. Crea una nueva consulta (New Query)');
        console.log('   3. Copia y pega el siguiente SQL:');
        console.log('');
        
        // Leer y mostrar el SQL
        const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf-8');
        console.log('─'.repeat(60));
        console.log(sql);
        console.log('─'.repeat(60));
        console.log('');
        console.log('   4. Haz clic en "Run" para ejecutar el SQL');
        console.log('');
        
        return false;
      }
      throw checkError;
    }

    console.log(`✅ Tabla "users" existe`);

    // Verificar si hay usuarios
    const { data: usersCount, error: countError } = await supabase
      .from('users')
      .select('*');

    if (countError) throw countError;

    console.log(`   ${usersCount.length} usuarios encontrados`);

    if (usersCount.length === 0) {
      console.log('');
      console.log('📝 Insertando usuarios iniciales...');
      
      const { data: insertedUsers, error: insertError } = await supabase
        .from('users')
        .insert(users)
        .select();

      if (insertError) throw insertError;

      console.log(`✅ ${insertedUsers.length} usuarios insertados`);
    }

    // Mostrar usuarios
    console.log('');
    console.log('👥 Participantes:');
    const { data: allUsers } = await supabase.from('users').select('*').order('name');
    allUsers.forEach((user, i) => {
      console.log(`   ${i + 1}. ${user.name} (PIN: ${user.pin})`);
    });

    // Verificar tabla daily_entries
    console.log('');
    console.log('📋 Verificando tabla "daily_entries"...');
    const { data: entries, error: entriesError } = await supabase
      .from('daily_entries')
      .select('*')
      .limit(1);

    if (entriesError && entriesError.message.includes('Could not find the table')) {
      console.log('❌ La tabla "daily_entries" no existe');
      console.log('   Ejecuta el SQL en el SQL Editor para crearla');
      return false;
    }

    console.log('✅ Tabla "daily_entries" existe');

    // Verificar función get_user_streak
    console.log('');
    console.log('📋 Verificando función "get_user_streak"...');
    if (allUsers.length > 0) {
      const { data: streak, error: streakError } = await supabase
        .rpc('get_user_streak', { user_uuid: allUsers[0].id });

      if (streakError) {
        console.log('❌ Error al llamar función get_user_streak:', streakError.message);
        console.log('   La función puede no estar creada. Ejecuta el SQL completo.');
      } else {
        console.log('✅ Función "get_user_streak" existe y funciona');
        console.log(`   Racha de ${allUsers[0].name}: ${streak} días`);
      }
    }

    console.log('');
    console.log('🎉 ¡Verificación completada!');
    console.log('');
    console.log('📊 Resumen:');
    console.log(`   - Tabla "users": ${allUsers.length} participantes`);
    console.log('   - Tabla "daily_entries": OK');
    console.log('   - Conexión a Supabase: OK');

    return true;

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    return false;
  }
}

initializeDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
