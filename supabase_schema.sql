-- ==============================================================================
-- DATABASE SCHEMA: LEKSIKA KAMUS BAHASA DAERAH SULAWESI TENGGARA
-- Target Project: https://mzdnmqkgebbfqgdgulln.supabase.co
-- Engine: PostgreSQL / Supabase
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL KOSAKATA KAMUS (DICTIONARY_WORDS)
-- Menyimpan seluruh kosakata resmi bahasa Tolaki, Moronene, Muna, Buton/Wolio & Indo
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.dictionary_words (
    id VARCHAR(100) PRIMARY KEY,
    source_lang_id VARCHAR(10) NOT NULL DEFAULT 'ind',
    target_lang_id VARCHAR(10) NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    phonetic TEXT,
    category VARCHAR(100) DEFAULT 'Umum',
    example_sentence TEXT,
    example_translation TEXT,
    cultural_context TEXT,
    dialect VARCHAR(100),
    synonyms TEXT[] DEFAULT '{}',
    antonyms TEXT[] DEFAULT '{}',
    is_user_contributed BOOLEAN DEFAULT FALSE,
    contributor_name VARCHAR(150),
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeks untuk pencarian cepat kata & bahasa target
CREATE INDEX IF NOT EXISTS idx_dict_target_lang ON public.dictionary_words(target_lang_id);
CREATE INDEX IF NOT EXISTS idx_dict_word ON public.dictionary_words(word);
CREATE INDEX IF NOT EXISTS idx_dict_translation ON public.dictionary_words(translation);
CREATE INDEX IF NOT EXISTS idx_dict_category ON public.dictionary_words(category);

-- ==============================================================================
-- 3. TABEL USULAN KOSAKATA KOMUNITAS (COMMUNITY_CONTRIBUTIONS)
-- Menyimpan usulan kata baru dari masyarakat umum (+Kata) untuk dimoderasi
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_contributions (
    id VARCHAR(100) PRIMARY KEY,
    source_lang_id VARCHAR(10) NOT NULL DEFAULT 'ind',
    target_lang_id VARCHAR(10) NOT NULL,
    word TEXT NOT NULL,
    translation TEXT NOT NULL,
    phonetic TEXT,
    category VARCHAR(100) DEFAULT 'Umum',
    example_sentence TEXT,
    example_translation TEXT,
    cultural_context TEXT,
    contributor_name VARCHAR(150) NOT NULL,
    contributor_email VARCHAR(200),
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    moderator_notes TEXT,
    moderated_by VARCHAR(100),
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contrib_status ON public.community_contributions(status);
CREATE INDEX IF NOT EXISTS idx_contrib_lang ON public.community_contributions(target_lang_id);

-- ==============================================================================
-- 4. TABEL PROFIL PENGGUNA (USER_PROFILES)
-- Menyimpan data profil pembelajar, XP, level, dan preferensi
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200),
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 1,
    badges TEXT[] DEFAULT '{}',
    favorites TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABEL AKUN ADMINISTRATOR & STAF (ADMIN_USERS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'Super Administrator', 'Linguist Editor', 'Moderator', 'Viewer'
    status VARCHAR(30) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABEL CATATAN AUDIT SISTEM (SYSTEM_AUDIT_LOGS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    user_name VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'words', 'moderation', 'users', 'roles', 'backup', 'auth'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_category ON public.system_audit_logs(category);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.system_audit_logs(created_at DESC);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

-- Dictionary: Siapa pun dapat membaca kamus publik
CREATE POLICY "Public Read Dictionary" 
ON public.dictionary_words 
FOR SELECT 
USING (true);

-- Dictionary: Penulisan oleh pengguna anon/autentikasi (atau via service role)
CREATE POLICY "Allow Insert/Update Dictionary" 
ON public.dictionary_words 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Contributions: Publik dapat mengirim usulan kata (+Kata)
CREATE POLICY "Public Insert Contributions" 
ON public.community_contributions 
FOR INSERT 
WITH CHECK (true);

-- Contributions: Siapa pun dapat membaca antrean kontribusi
CREATE POLICY "Public Read Contributions" 
ON public.community_contributions 
FOR SELECT 
USING (true);

-- Contributions: Update/Delete untuk moderasi
CREATE POLICY "Public Manage Contributions" 
ON public.community_contributions 
FOR UPDATE 
USING (true);

-- Profiles: Siapa pun dapat mengelola profilnya
CREATE POLICY "Public Profiles Access" 
ON public.user_profiles 
FOR ALL 
USING (true);

-- Audit Logs: Publik dapat membaca & menulis catatan audit
CREATE POLICY "Public Audit Logs Access" 
ON public.system_audit_logs 
FOR ALL 
USING (true);

-- Admin Users: Akses tabel staf
CREATE POLICY "Public Admin Users Access" 
ON public.admin_users 
FOR ALL 
USING (true);

-- ==============================================================================
-- 8. SEED DATA DEFAULT (KOSAKATA POPULER 4 BAHASA SULTRA)
-- ==============================================================================
INSERT INTO public.dictionary_words (
    id, source_lang_id, target_lang_id, word, translation, phonetic, category, 
    example_sentence, example_translation, cultural_context, is_popular
) VALUES
-- BAHASA TOLAKI
('tk-seed-1', 'ind', 'tk', 'Terima Kasih', 'Tarima kase', 'ta-ri-ma ka-se', 'Salam & Sapaan', 'Tarima kase meambo mbue.', 'Terima kasih banyak yang tak terhingga.', 'Diucapkan dengan meletakkan tangan di dada sebagai tanda takzim.', true),
('tk-seed-2', 'ind', 'tk', 'Apa Kabar', 'Ohae habari / Hae habari?', 'o-hae ha-ba-ri', 'Salam & Sapaan', 'Ohae habari miano laika?', 'Bagaimana kabar orang rumah?', 'Dijawab dengan "Habari meambo" (kabar baik).', true),
('tk-seed-3', 'ind', 'tk', 'Makan', 'Monga''a / Monga', 'mo-nga-a', 'Kebutuhan Sehari-hari', 'Maimo pembata monga sinonggi.', 'Mari singgah makan sinonggi bersama.', 'Sinonggi adalah makanan pokok tradisional berbahan sagu khas Tolaki.', true),
('tk-seed-4', 'ind', 'tk', 'Rumah', 'Laika', 'lai-ka', 'Benda & Tempat', 'Laikaaha no miano tuha.', 'Rumah besar milik tetua adat.', 'Laika adalah sebutan rumah panggung khas Tolaki.', true),
('tk-seed-5', 'ind', 'tk', 'Air', 'Wawo / Oe', 'wa-wo', 'Alam & Lingkungan', 'Wawo meambo i wiwi nggolo.', 'Air jernih di tepi sungai pegunungan.', 'Air dianggap sebagai sumber kesucian hidup.', true),

-- BAHASA MORONENE
('mrn-seed-1', 'ind', 'mrn', 'Terima Kasih', 'Mpu’u kosumanga', 'mpu-u ko-su-ma-nga', 'Salam & Sapaan', 'Mpu''u kosumanga doto.', 'Terima kasih yang sebesar-besarnya.', 'Bentuk penghormatan tulus penuh semangat persaudaraan khas Bombana.', true),
('mrn-seed-2', 'ind', 'mrn', 'Apa Kabar', 'Haba piapia? / Pandei habara?', 'ha-ba pi-a-pi-a', 'Salam & Sapaan', 'Haba piapia komiu?', 'Bagaimana kabar kalian semua?', 'Dijawab dengan "Piapia mpu''u" (sangat baik).', true),
('mrn-seed-3', 'ind', 'mrn', 'Makan', 'Mongkoni / Manga', 'mo-ngko-ni', 'Kebutuhan Sehari-hari', 'Maimo pembata mongkoni.', 'Ayo mampir makan bersama di rumah.', 'Kental dengan tradisi jamuan hangat suku Moronene.', true),
('mrn-seed-4', 'ind', 'mrn', 'Rumah', 'Banua / Laika', 'ba-nu-a', 'Benda & Tempat', 'Banua tambi komiu.', 'Rumah tinggal keluarga kalian.', 'Banua adalah hunian keluarga besar Moronene.', true),

-- BAHASA MUNA
('mun-seed-1', 'ind', 'mun', 'Terima Kasih', 'Tarima kasi / Fodhahi barakati', 'ta-ri-ma ka-si', 'Salam & Sapaan', 'Tarima kasi sepali toono kapande.', 'Terima kasih banyak orang bijaksana.', 'Ungkapan rasa syukur dan doa limpahan berkah khas Muna.', true),
('mun-seed-2', 'ind', 'mun', 'Apa Kabar', 'Hae habari? / Ohae habari?', 'o-hae ha-ba-ri', 'Salam & Sapaan', 'Hae habari aitu?', 'Bagaimana kabarmu saat ini?', 'Dijawab dengan "Habari keseno" (kabar baik penuh keselamatan).', true),
('mun-seed-3', 'ind', 'mun', 'Makan', 'Kumaa', 'ku-maa', 'Kebutuhan Sehari-hari', 'Maimo kumaa kambose we lambu.', 'Mari makan jagung kambose di rumah.', 'Kambose adalah olahan jagung putih khas Pulau Muna.', true),
('mun-seed-4', 'ind', 'mun', 'Rumah', 'Lambu', 'lam-bu', 'Benda & Tempat', 'Lambu wuna moghonu keda-keda.', 'Rumah tradisional Muna yang kokoh dan asri.', 'Lambu melambangkan keteduhan dan kehormatan keluarga Muna.', true),

-- BAHASA BUTON / WOLIO
('btn-seed-1', 'ind', 'btn', 'Terima Kasih', 'Tarima kasi / Sukuru', 'ta-ri-ma ka-si / su-ku-ru', 'Salam & Sapaan', 'Sukuru madaea incaimu.', 'Terima kasih dan rasa syukur mendalam kepadamu.', 'Berasal dari nilai spiritual kesyukuran falsafah Buton.', true),
('btn-seed-2', 'ind', 'btn', 'Apa Kabar', 'Haba maroa? / Apara habara?', 'ha-ba ma-ro-a', 'Salam & Sapaan', 'Haba maroa komiu incaimu?', 'Bagaimana kabar baik Anda?', 'Dijawab dengan "Maroa mpu''u" (sangat baik dan sentosa).', true),
('btn-seed-3', 'ind', 'btn', 'Makan', 'Kumaa / Mancana', 'ku-maa / man-ca-na', 'Kebutuhan Sehari-hari', 'Kumaa kasuami ronga ika tapa.', 'Makan kasuami bersama ikan bakar cakalang.', 'Kasuami berbahan singkong parut kukus kerucut khas Wolio Buton.', true),
('btn-seed-4', 'ind', 'btn', 'Rumah', 'Banua', 'ba-nu-a', 'Benda & Tempat', 'Banua Malige Keraton Baubau.', 'Rumah adat istana Malige di dalam Benteng Wolio.', 'Malige dibangun tanpa paku besi, mahakarya arsitektur Kesultanan Buton.', true)
ON CONFLICT (id) DO NOTHING;

-- SEED ADMIN DEFAULT
INSERT INTO public.admin_users (id, username, name, email, role, status) VALUES
('adm-1', 'admin', 'Dr. Muh. Arifin, M.Hum', 'admin@sultra-leksika.go.id', 'Super Administrator', 'active'),
('adm-2', 'editor', 'La Ode Suriadin, S.Pd', 'editor@sultra-leksika.go.id', 'Linguist Editor', 'active'),
('adm-3', 'moderator', 'Wa Ode Nurul Fadhilah', 'moderator@sultra-leksika.go.id', 'Moderator', 'active'),
('adm-4', 'viewer', 'Tim Peneliti Balai Bahasa', 'viewer@sultra-leksika.go.id', 'Viewer', 'active')
ON CONFLICT (id) DO NOTHING;
