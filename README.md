# 📿 Reto de Cuaresma - Dashboard

Dashboard de seguimiento para un reto de Cuaresma de 40 días entre 15 amigos.

## ✨ Características

- 🔐 **Login simple**: Nombre + PIN
- ✅ **Registro diario**: 7 hábitos con checkboxes
- 📊 **Dashboard personal**: Progreso, racha y calendario
- 🏆 **Leaderboard**: Ranking de participantes en tiempo real
- 📱 **Mobile-first**: Diseño responsive y minimalista
- 🔄 **Datos sincronizados**: Todos ven el mismo leaderboard gracias a Supabase

## 🛠️ Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS v4**
- **Supabase** (PostgreSQL + Realtime)

## 🚀 Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/cuaresma-dashboard.git
cd cuaresma-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Clic en "New Project"
3. Elige un nombre (ej: "cuaresma-dashboard")
4. Selecciona la región más cercana a tus usuarios
5. Clic en "Create new project"
6. Espera a que se cree (toma unos minutos)

### 4. Obtener credenciales de Supabase

1. En tu proyecto de Supabase, ve a **Project Settings** (icono de engranaje)
2. Selecciona **API** en el menú lateral
3. Copia los siguientes valores:
   - **URL** (Project URL): `https://xxxxx.supabase.co`
   - **anon/public** (Project API keys): `eyJhbG...`

### 5. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local
```

Editar `.env.local` con tus credenciales:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 6. Crear tablas en Supabase

1. En tu proyecto de Supabase, ve al **SQL Editor**
2. Clic en "New query"
3. Copia y pega el contenido de `supabase/schema.sql`
4. Clic en "Run"

Esto creará:
- Tabla `users` con los 15 participantes
- Tabla `daily_entries` para los registros diarios
- Función `get_user_streak()` para calcular rachas

### 7. Verificar usuarios creados

1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `users`
3. Deberías ver 15 usuarios con PINs del 1001 al 1015

### 8. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

## 📦 Build para producción

```bash
npm run build
```

## 🌐 Deploy en Vercel

### 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create cuaresma-dashboard --public --source=. --remote=origin --push
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Clic en "Add New Project"
3. Importa tu repositorio de GitHub
4. En **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
5. Clic en "Deploy"

## 📁 Estructura del proyecto

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
│       ├── storage.ts     # Lógica de Supabase
│       └── supabase.ts    # Cliente de Supabase
├── supabase/
│   └── schema.sql         # Schema SQL para Supabase
├── .env.local.example     # Ejemplo de variables de entorno
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

### Fechas del reto
En `src/lib/config.ts`:

```typescript
startDate: '2025-03-05', // Miércoles de Ceniza
endDate: '2025-04-13',   // Domingo de Ramos
totalDays: 40,
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

Los PINs están configurados en la base de datos:
- Amigo 1: `1001`
- Amigo 2: `1002`
- ...
- Amigo 15: `1015`

Para cambiarlos, edita la tabla `users` en el **Table Editor** de Supabase.

## 📊 Modelo de datos

### Tabla: users
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único del usuario |
| name | TEXT | Nombre del participante |
| pin | TEXT | PIN de 4 dígitos |
| total_points | INTEGER | Puntos acumulados |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: daily_entries
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único de la entrada |
| user_id | UUID | Referencia al usuario |
| date | DATE | Fecha del registro |
| habit1-habit7 | BOOLEAN | Estado de cada hábito |
| total_points | INTEGER | Puntos del día |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

## 🔧 Solución de problemas

### Error: "Failed to connect to Supabase"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que el proyecto de Supabase esté activo

### No se ven los usuarios en el login
- Verifica que ejecutaste el SQL en el SQL Editor de Supabase
- Revisa la tabla `users` en el Table Editor

### Error al guardar el día
- Verifica la conexión a internet
- Revisa la consola del navegador para errores
- Asegúrate de que la tabla `daily_entries` exista

## 📄 Licencia

MIT - Libre para usar y modificar.

---

*"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito"* - Juan 3:16
