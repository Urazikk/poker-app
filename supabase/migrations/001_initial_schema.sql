-- ============================================================
-- POKER EXPRESSO - Schema Supabase
-- Format : 3 joueurs, 500 chips, blinds 10/20
-- ============================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. UTILISATEURS (profil etendu)
-- ============================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profil visible par tous" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Profil modifiable par son owner" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- 2. GUIDE THEORIQUE (CMS chapitres)
-- ============================================================
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,          -- Markdown
    category TEXT NOT NULL,         -- 'bases', 'ranges', 'erreurs', 'strategie'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. RANGES OPTIMALES
-- ============================================================
CREATE TABLE public.ranges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position TEXT NOT NULL,         -- 'BTN', 'SB', 'BB'
    stack_bb_min NUMERIC NOT NULL,  -- Stack min en BB pour cette range
    stack_bb_max NUMERIC NOT NULL,  -- Stack max en BB
    action TEXT NOT NULL,           -- 'push', 'fold', 'call', 'raise'
    hand TEXT NOT NULL,             -- Notation: 'AKs', 'QJo', '77', etc.
    frequency NUMERIC DEFAULT 1.0,  -- 0.0 a 1.0 (mix)
    context TEXT DEFAULT 'default', -- 'default', 'vs_push', 'open_raise'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ranges_position ON public.ranges(position, stack_bb_min, stack_bb_max);
CREATE INDEX idx_ranges_context ON public.ranges(context, position);

-- ============================================================
-- 4. PARCOURS GAMIFIE
-- ============================================================
CREATE TABLE public.learn_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_number INTEGER UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 50,
    required_xp INTEGER DEFAULT 0,  -- XP minimum pour debloquer
    category TEXT NOT NULL,          -- 'preflop', 'postflop', 'push_fold', 'icm'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.puzzles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID NOT NULL REFERENCES public.learn_levels(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,

    -- Situation de la main
    hero_hand TEXT NOT NULL,         -- Ex: 'AhKd'
    hero_position TEXT NOT NULL,     -- 'BTN', 'SB', 'BB'
    hero_stack INTEGER NOT NULL,     -- En chips
    villain_positions JSONB,         -- Positions et stacks des adversaires
    board TEXT,                      -- Ex: 'Ah7d2c' ou null (preflop)
    pot INTEGER NOT NULL,
    blinds TEXT NOT NULL,            -- Ex: '10/20', '15/30'
    action_to_hero TEXT,             -- Action precedente ('villain pushes', 'checked to hero'...)

    -- Reponse
    correct_action TEXT NOT NULL,    -- 'fold', 'call', 'raise', 'push'
    explanation TEXT,                -- Explication de la reponse
    xp_reward INTEGER DEFAULT 10,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_puzzles_level ON public.puzzles(level_id, sort_order);

-- Progression utilisateur sur les puzzles
CREATE TABLE public.user_puzzle_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    puzzle_id UUID NOT NULL REFERENCES public.puzzles(id) ON DELETE CASCADE,
    chosen_action TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, puzzle_id)
);

CREATE INDEX idx_user_puzzle ON public.user_puzzle_progress(user_id);

-- Progression utilisateur sur les niveaux
CREATE TABLE public.user_level_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    level_id UUID NOT NULL REFERENCES public.learn_levels(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'locked',    -- 'locked', 'unlocked', 'in_progress', 'completed'
    stars INTEGER DEFAULT 0,         -- 0 a 3 etoiles
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, level_id)
);

CREATE INDEX idx_user_level ON public.user_level_progress(user_id);

-- ============================================================
-- 5. SIMULATEUR - Parties jouees
-- ============================================================
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bot_difficulty TEXT NOT NULL,     -- 'recruit', 'regular', 'pro'
    multiplier INTEGER DEFAULT 2,    -- Multiplicateur Expresso (2x, 3x, 5x...)
    buy_in INTEGER DEFAULT 500,      -- Chips de depart
    result TEXT,                      -- 'win', 'lose', 'in_progress'
    prize INTEGER,                    -- Chips gagnes
    duration_seconds INTEGER,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_games_user ON public.games(user_id, started_at DESC);

-- Historique des mains jouees dans une partie
CREATE TABLE public.game_hands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    hand_number INTEGER NOT NULL,

    -- Etat de la main
    hero_hand TEXT NOT NULL,          -- 'AhKd'
    hero_position TEXT NOT NULL,
    hero_stack INTEGER NOT NULL,
    board TEXT,                        -- Cartes communes finales
    pot_final INTEGER,
    blinds TEXT NOT NULL,

    -- Actions du hero (JSON array)
    hero_actions JSONB NOT NULL,      -- [{street:'preflop', action:'raise', amount:60}, ...]

    -- Analyse
    optimal_action TEXT,               -- Action optimale selon les ranges
    is_optimal BOOLEAN,                -- Le hero a-t-il joue optimalement ?
    ev_loss NUMERIC,                   -- Perte d'EV estimee

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_hands ON public.game_hands(game_id, hand_number);

-- ============================================================
-- 6. REVIEW / RAPPORT DE PARTIE
-- ============================================================
CREATE TABLE public.game_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID UNIQUE NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    total_hands INTEGER NOT NULL,
    optimal_plays INTEGER NOT NULL,
    accuracy NUMERIC NOT NULL,         -- % de decisions optimales
    biggest_mistakes JSONB,            -- Top 3 erreurs [{hand_id, ev_loss, explanation}]
    summary TEXT,                       -- Resume texte du rapport
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================

-- Fonction pour creer un profil automatiquement a l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || LEFT(NEW.id::text, 8)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour ajouter de l'XP et level up
CREATE OR REPLACE FUNCTION public.add_xp(p_user_id UUID, p_amount INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN) AS $$
DECLARE
    current_xp INTEGER;
    current_level INTEGER;
    xp_for_next INTEGER;
BEGIN
    SELECT xp, level INTO current_xp, current_level
    FROM public.profiles WHERE id = p_user_id;

    current_xp := current_xp + p_amount;
    -- Formule : 100 * level^1.5 XP pour monter de niveau
    xp_for_next := FLOOR(100 * POWER(current_level, 1.5));

    IF current_xp >= xp_for_next THEN
        current_level := current_level + 1;
        current_xp := current_xp - xp_for_next;

        UPDATE public.profiles
        SET xp = current_xp, level = current_level, last_activity_at = NOW()
        WHERE id = p_user_id;

        RETURN QUERY SELECT current_xp, current_level, true;
    ELSE
        UPDATE public.profiles
        SET xp = current_xp, last_activity_at = NOW()
        WHERE id = p_user_id;

        RETURN QUERY SELECT current_xp, current_level, false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
