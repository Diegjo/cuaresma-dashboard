// Script para corregir el JWT y verificar
// El problema: el JWT tiene "cm9sZSIsImFub24i" (role","anon")
// Debería ser "cm9sZSI6ImFub24i" (role":"anon")

const originalKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib3F1cmZ2Y2RpcWR3YmhjcW14Iiwicm9sZSIsImFub24iLCJpYXQiOjE3NzEzODcwMzcsImV4cCI6MjA4Njk2MzAzN30.UYLRxn4f6d7Kt8HZcKXdjvFJdZTGH4lJHyRp3BY348I';

// Corregir el payload
const correctedPayload = {
  "iss": "supabase",
  "ref": "eboqurfvcdiqdwbhcqmx",
  "role": "anon",
  "iat": 1771387037,
  "exp": 2086963037
};

console.log('Original key parts:');
const parts = originalKey.split('.');
console.log('Header:', Buffer.from(parts[0], 'base64').toString());
console.log('Payload (raw):', Buffer.from(parts[1], 'base64').toString());
console.log('');

console.log('Payload corregido:', JSON.stringify(correctedPayload));

// Codificar el payload corregido
const correctedPayloadBase64 = Buffer.from(JSON.stringify(correctedPayload)).toString('base64').replace(/=/g, '');
console.log('Payload corregido (base64):', correctedPayloadBase64);

// Nota: Sin la clave secreta, no podemos generar la firma correcta
// La clave secreta es específica del proyecto y no está disponible
console.log('');
console.log('⚠️  NOTA: La firma del JWT será inválida sin la clave secreta del proyecto');
console.log('   Se necesita obtener la ANON_KEY correcta desde el dashboard de Supabase');
