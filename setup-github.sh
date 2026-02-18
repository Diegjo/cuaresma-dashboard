#!/bin/bash
# Script para crear el repositorio en GitHub y subir el código

echo "🚀 Configurando repositorio de Cuaresma Dashboard en GitHub..."
echo ""

# Verificar si gh está instalado
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) no está instalado."
    echo ""
    echo "Instálalo desde: https://cli.github.com/"
    echo "O usa los comandos git manuales más abajo."
    exit 1
fi

# Verificar autenticación
echo "🔍 Verificando autenticación con GitHub..."
if ! gh auth status &> /dev/null; then
    echo "❌ No estás autenticado con GitHub."
    echo "Ejecuta: gh auth login"
    exit 1
fi

# Crear repositorio
echo "📦 Creando repositorio 'cuaresma-dashboard'..."
cd cuaresma-dashboard

gh repo create cuaresma-dashboard --public --source=. --remote=origin --push

echo ""
echo "✅ ¡Repositorio creado exitosamente!"
echo ""
echo "URL del repositorio: https://github.com/$(gh api user -q .login)/cuaresma-dashboard"
