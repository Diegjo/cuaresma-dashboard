# 🚀 Instrucciones de Setup

## Opción 1: Usar GitHub CLI (Recomendado)

1. **Instalar GitHub CLI** (si no lo tienes):
   ```bash
   # macOS
   brew install gh
   
   # Windows
   winget install --id GitHub.cli
   
   # Ubuntu/Debian
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update
   sudo apt install gh
   ```

2. **Autenticar con GitHub**:
   ```bash
   gh auth login
   ```

3. **Ejecutar el script de setup**:
   ```bash
   cd cuaresma-dashboard
   bash setup-github.sh
   ```

## Opción 2: Usar Git manualmente

1. **Crear repositorio en GitHub**:
   - Ve a https://github.com/new
   - Nombre: `cuaresma-dashboard`
   - Público
   - NO inicialices con README (ya existe)

2. **Subir el código**:
   ```bash
   cd cuaresma-dashboard
   git remote add origin https://github.com/TU_USUARIO/cuaresma-dashboard.git
   git branch -M main
   git push -u origin main
   ```

## 📦 Estructura del proyecto

```
cuaresma-dashboard/
├── src/
│   ├── app/              # Páginas de Next.js
│   │   ├── login/        # Página de login
│   │   ├── dashboard/    # Dashboard personal
│   │   ├── leaderboard/  # Ranking
│   │   └── globals.css   # Estilos
│   └── lib/
│       ├── config.ts     # Configuración
│       └── storage.ts    # Lógica de datos
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## ⚙️ Personalización antes de deploy

1. **Editar participantes** en `src/lib/config.ts`:
   ```typescript
   participants: [
     { id: '1', name: 'Tu Nombre', pin: '1234' },
     // ... más participantes
   ]
   ```

2. **Ajustar fechas** del reto:
   ```typescript
   startDate: '2025-03-05',
   endDate: '2025-04-13',
   ```

## 🌐 Deploy en Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Framework preset: Next.js
4. Deploy!

La app estará disponible en: `https://tu-proyecto.vercel.app`

## 🔑 Acceso para participantes

Los PINs por defecto son:
- Amigo 1 → `1001`
- Amigo 2 → `1002`
- ...
- Amigo 15 → `1015`

Puedes cambiarlos en `src/lib/config.ts`.

## 💾 Almacenamiento de datos

Por defecto, los datos se guardan en el **LocalStorage** del navegador de cada usuario.

Para sincronización en tiempo real entre usuarios, configura **Supabase**:

1. Crea proyecto en https://supabase.com
2. Copia URL y Anon Key
3. Agrega a `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
   ```

## 🆘 Soporte

Si tienes problemas:
1. Verifica que Node.js ≥ 18 esté instalado
2. Borra `node_modules` y vuelve a instalar: `rm -rf node_modules && npm install`
3. Revisa los logs de error con `npm run dev`

¡Que Dios bendiga tu Cuaresma! 📿
