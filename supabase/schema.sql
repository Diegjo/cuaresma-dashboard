-- ============================================================
-- Schema SQL para Dashboard de Cuaresma
-- Copiar y pegar en el SQL Editor de Supabase
-- ============================================================

-- Tabla de usuarios/participantes
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL,
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

-- ============================================================
-- Datos iniciales: Insertar los 15 participantes
-- ============================================================

INSERT INTO users (name, pin) VALUES 
  ('Amigo 1', '1001'),
  ('Amigo 2', '1002'),
  ('Amigo 3', '1003'),
  ('Amigo 4', '1004'),
  ('Amigo 5', '1005'),
  ('Amigo 6', '1006'),
  ('Amigo 7', '1007'),
  ('Amigo 8', '1008'),
  ('Amigo 9', '1009'),
  ('Amigo 10', '1010'),
  ('Amigo 11', '1011'),
  ('Amigo 12', '1012'),
  ('Amigo 13', '1013'),
  ('Amigo 14', '1014'),
  ('Amigo 15', '1015')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Row Level Security (RLS) Policies
-- Descomentar si deseas habilitar RLS para mayor seguridad
-- ============================================================

-- -- Habilitar RLS en las tablas
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- -- Política para que los usuarios solo vean sus propios datos
-- CREATE POLICY "Users can view own data" ON users
--   FOR SELECT USING (true); -- Permitir ver todos los usuarios para el leaderboard

-- CREATE POLICY "Users can view own entries" ON daily_entries
--   FOR SELECT USING (true); -- Permitir ver todas las entries para el leaderboard

-- CREATE POLICY "Users can insert own entries" ON daily_entries
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can update own entries" ON daily_entries
--   FOR UPDATE USING (true);
