-- ============================================================
-- Schema SQL para Dashboard de Cuaresma
-- Copiar y pegar en el SQL Editor de Supabase
-- ============================================================

-- Tabla de usuarios/participantes
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de registros diarios
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  habit1 BOOLEAN DEFAULT false, -- Ejercicio
  habit2 BOOLEAN DEFAULT false, -- No frituras ni refresco
  habit3 BOOLEAN DEFAULT false, -- No actos ni pensamientos impuros
  habit4 BOOLEAN DEFAULT false, -- Despertarse temprano
  habit5 BOOLEAN DEFAULT false, -- Leer un libro
  habit6 BOOLEAN DEFAULT false, -- Rezar mañana, tarde y noche
  habit7 BOOLEAN DEFAULT false, -- Misterio o Rosario
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en daily_entries
DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular la racha de un usuario
CREATE OR REPLACE FUNCTION get_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  current_date_var DATE := CURRENT_DATE;
  has_entry BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM daily_entries 
      WHERE user_id = user_uuid 
      AND date = current_date_var
      AND total_points > 0
    ) INTO has_entry;
    
    IF has_entry THEN
      streak := streak + 1;
      current_date_var := current_date_var - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql;

-- Función para contar usuarios (para limitar a 15)
CREATE OR REPLACE FUNCTION get_user_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM users);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Configuración: PINs disponibles para el grupo
-- Cada amigo elegirá un PIN del 1001 al 1015 y pondrá su nombre
-- ============================================================

-- NO insertamos usuarios predefinidos
-- Los amigos se registrarán al hacer login por primera vez
-- Elegirán un PIN del 1001-1015 y pondrán su nombre

-- ============================================================
-- Row Level Security (RLS) Policies - Opcional
-- ============================================================

-- -- Habilitar RLS en las tablas
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- -- Permitir lectura de todos los usuarios (para leaderboard)
-- CREATE POLICY "Allow read all users" ON users
--   FOR SELECT USING (true);

-- -- Permitir ver todas las entries (para leaderboard)
-- CREATE POLICY "Allow read all entries" ON daily_entries
--   FOR SELECT USING (true);
