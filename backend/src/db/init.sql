-- Extensión para IDs únicos y seguros
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USUARIOS (Credenciales básicas)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    nickname TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERFILES (Personalización y Psicoanálisis)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    nickname TEXT,
    personality_type TEXT,
    personality_data JSONB,
    vicio_principal TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    enabled_modules JSONB DEFAULT '{"fortaleza": true, "diario": true, "academia": true}',
    focus_slot_pref TEXT DEFAULT 'musica'
);

-- 3. FORTALEZAS (Sober Tracker)
CREATE TABLE IF NOT EXISTS habit_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    is_unlocked BOOLEAN DEFAULT FALSE,
    selected_habits JSONB DEFAULT '[]',
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    last_check_in TIMESTAMP WITH TIME ZONE,
    badges_earned JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    checked_at DATE DEFAULT CURRENT_DATE,
    UNIQUE(user_id, checked_at)
);

-- 4. DIARIO Y ESTADOS DE ÁNIMO (Journal & History)
CREATE TABLE IF NOT EXISTS mood_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood_score INTEGER NOT NULL,
    title TEXT,
    emotional_load TEXT,
    note TEXT,
    ai_insight TEXT,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SESIONES DE IA (Biometría y Terapia)
CREATE TABLE IF NOT EXISTS ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_type TEXT,
    transcript TEXT,
    biometrics JSONB,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LIBRERÍA DE CONTENIDO (Cursos, Música, Facts)
CREATE TABLE IF NOT EXISTS library_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    category TEXT,
    title TEXT NOT NULL,
    content_body TEXT,
    url_link TEXT,
    tags JSONB
);
-- 7. DAILY QUESTS (Rutinas diarias)
CREATE TABLE IF NOT EXISTS daily_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score FLOAT,
    result_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- 7. USUARIO POR DEFECTO PARA DESARROLLO (MOCK)
INSERT INTO users (id, email, password_hash, is_verified)
VALUES ('00000000-0000-0000-0000-000000000000', 'dev@wysiati.com', 'no_hash', true)
ON CONFLICT (id) DO NOTHING;
