#!/bin/bash
# Script para ejecutar SQL en Supabase usando curl
# Intenta crear las tablas usando la API REST

SUPABASE_URL="https://eboqurfvcdiqdwbhcqmx.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVib3F1cmZ2Y2RpcWR3YmhjcW14Iiwicm9sZSIsImFub24iLCJpYXQiOjE3NzEzODcwMzcsImV4cCI6MjA4Njk2MzAzN30.UYLRxn4f6d7Kt8HZcKXdjvFJdZTGH4lJHyRp3BY348I"

echo "🔌 Conectando a Supabase: $SUPABASE_URL"
echo ""

# Intentar verificar si la tabla users existe
echo "🔍 Verificando si la tabla 'users' existe..."

RESPONSE=$(curl -s -X GET "$SUPABASE_URL/rest/v1/users?limit=1" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q '"code":"42P01"'; then
  echo "❌ La tabla 'users' NO existe"
  echo ""
  echo "⚠️  IMPORTANTE: Debes ejecutar el SQL manualmente en el SQL Editor de Supabase"
  echo ""
  echo "📋 Pasos a seguir:"
  echo "1. Ve a https://supabase.com/dashboard/project/eboqurfvcdiqdwbhcqmx/sql-editor"
  echo "2. Crea una nueva consulta (New Query)"
  echo "3. Pega el contenido del archivo supabase/schema.sql"
  echo "4. Ejecuta el script (Run)"
  echo ""
  echo "📄 Contenido del SQL:"
  cat "$(dirname "$0")/../supabase/schema.sql"
  exit 1
else
  echo "✅ La tabla 'users' existe"
  echo ""
  echo "🎉 ¡Las tablas ya están creadas!"
  echo ""
  echo "Response: $RESPONSE"
  exit 0
fi
