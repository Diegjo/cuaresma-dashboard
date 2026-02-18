// Script para probar con el JWT corregido
const { createClient } = require('@supabase/supabase-js');

// Intentar con el payload corregido (aunque la firma sea inválida)
const correctedPayload = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib3F1cmZ2Y2RpcWR3YmhjcW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzODcwMzcsImV4cCI6MjA4Njk2MzAzN30';
const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const originalSignature = 'UYLRxn4f6d7Kt8HZcKXdjvFJdZTGH4lJHyRp3BY348I';

// JWT corregido (pero con firma original que probablemente no coincida)
const correctedKey = `${header}.${correctedPayload}.${originalSignature}`;

console.log('JWT corregido:', correctedKey);
console.log('');

const supabaseUrl = 'https://eboqurfvcdiqdwbhcqmx.supabase.co';
const supabase = createClient(supabaseUrl, correctedKey);

async function testConnection() {
  console.log('Probando conexión con JWT corregido...');
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else {
    console.log('✅ Conexión exitosa!');
    console.log('Datos:', data);
  }
}

testConnection();
