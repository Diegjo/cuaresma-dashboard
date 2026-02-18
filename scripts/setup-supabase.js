// Script para ejecutar el schema SQL en Supabase
// Uso: node scripts/setup-supabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eboqurfvcdiqdwbhcqmx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib3F1cmZ2Y2RpcWR3YmhjcW14Iiwicm9sZSIsImFub24iLCJpYXQiOjE3NzEzODcwMzcsImV4cCI6MjA4Njk2MzAzN30.UYLRxn4f6d7Kt8HZcKXdjvFJdZTGH4lJHyRp3BY348I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  try {
    console.log('📦 Conectando a Supabase...');
    console.log(`🌐 URL: ${supabaseUrl}`);
    
    // Leer el archivo SQL
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');
    
    // Dividir el SQL en statements individuales
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`🔧 Encontrados ${statements.length} statements SQL`);
    
    // Vamos a probar primero con una simple consulta para verificar conexión
    console.log('\n🔍 Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError && testError.code !== '42P01') { // 42P01 = table doesn't exist
      console.error('❌ Error de conexión:', testError.message);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    
    // Como no podemos ejecutar SQL arbitrario con el cliente anon,
    // necesitamos usar el SQL Editor de Supabase directamente
    // O crear las tablas manualmente mediante la API de Supabase Management
    
    console.log('\n⚠️  Para crear las tablas, debes:');
    console.log('1. Ir al SQL Editor de tu proyecto Supabase');
    console.log('2. Pegar el contenido de supabase/schema.sql');
    console.log('3. Ejecutar el script');
    console.log('\n📋 Contenido del SQL a ejecutar:');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

executeSQL();
