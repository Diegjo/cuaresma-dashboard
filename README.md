# 📿 Reto de Cuaresma - Dashboard

Dashboard de seguimiento para un reto de Cuaresma de 40 días entre 15 amigos.

## ✨ Características

- 🔐 **Login simple**: Nombre + PIN
- ✅ **Registro diario**: 7 hábitos con checkboxes
- 📊 **Dashboard personal**: Progreso, racha y calendario
- 🏆 **Leaderboard**: Ranking de participantes
- 📱 **Mobile-first**: Diseño responsive y minimalista

## 🛠️ Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **Supabase** (opcional) / LocalStorage

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/cuaresma-dashboard.git
   cd cuaresma-dashboard
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional)**
   
   Crear archivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```
   
   > Si no configuras Supabase, los datos se guardan en LocalStorage.

4. **Configurar participantes**
   
   Editar `src/lib/config.ts`:
   ```typescript
   participants: [
     { id: '1', name: 'Juan', pin: '1234' },
     { id: '2', name: 'María', pin: '5678' },
     // ... hasta 15 participantes
   ]
   ```

5. **Configurar fechas del reto**
   
   En `src/lib/config.ts`:
   ```typescript
   startDate: '2025-03-05', // Miércoles de Ceniza
   endDate: '2025-04-13',   // Domingo de Ramos
   totalDays: 40,
   ```

6. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir en el navegador**
   
   [http://localhost:3000](http://localhost:3000)

## 📦 Build para producción

```bash
npm run build
```

Los archivos estáticos se generan en la carpeta `dist/`.

## 🌐 Deploy en Vercel

1. **Subir a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create cuaresma-dashboard --public --source=. --remote=origin --push
   ```

2. **Importar en Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Importar proyecto desde GitHub
   - Framework preset: Next.js
   - Deploy

## 📝 Estructura del proyecto

```
cuaresma-dashboard/
├── src/
│   ├── app/
│   │   ├── login/         # Página de login
│   │   ├── dashboard/     # Dashboard personal
│   │   ├── leaderboard/   # Ranking de participantes
│   │   ├── layout.tsx     # Layout principal
│   │   ├── page.tsx       # Redirección
│   │   └── globals.css    # Estilos globales
│   └── lib/
│       ├── config.ts      # Configuración del reto
│       └── storage.ts     # Lógica de almacenamiento
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Personalización

### Hábitos
Editar el array `habits` en `src/lib/config.ts`:

```typescript
habits: [
  { id: 'habit1', name: 'Ejercicio 5 días a la semana', emoji: '💪' },
  { id: 'habit2', name: 'No frituras ni refresco', emoji: '🥗' },
  // ... más hábitos
]
```

### Colores
Los colores se definen en `src/app/globals.css`:

```css
:root {
  --color-accent: #7c3aed;      /* Púrpura principal */
  --color-success: #10b981;      /* Verde éxito */
  --color-warning: #f59e0b;      /* Naranja advertencia */
}
```

## 🔑 PINs por defecto

Los PINs se configuran en `src/lib/config.ts`. Por defecto:
- Amigo 1: `1001`
- Amigo 2: `1002`
- ...
- Amigo 15: `1015`

## 📊 Modelo de datos

### Users
- `id`: string
- `name`: string
- `pin`: string
- `totalPoints`: number
- `currentStreak`: number

### DailyEntries
- `id`: string
- `userId`: string
- `date`: string (YYYY-MM-DD)
- `habit1` - `habit7`: boolean
- `totalPoints`: number

## ⚠️ Notas importantes

- Sin Supabase, los datos se guardan en el LocalStorage del navegador
- Cada usuario debe usar su propio dispositivo/navegador
- Para datos persistentes y sincronizados, configurar Supabase

## 📄 Licencia

MIT - Libre para usar y modificar.

---

*"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito"* - Juan 3:16
