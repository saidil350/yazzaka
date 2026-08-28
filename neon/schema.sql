-- =============================================================================
-- SKEMA DATABASE POSTGRESQL (NEON DATABASE) UNTUK SEKOLAH & CMS YAZZAKA
-- =============================================================================

-- 1. Tabel Profil Sekolah & Branding
CREATE TABLE IF NOT EXISTS school_profile (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    npsn VARCHAR(50),
    accreditation VARCHAR(20),
    established_year INT,
    student_count INT,
    teacher_count INT,
    alumni_count INT,
    hafiz_count INT,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    whatsapp VARCHAR(50),
    maps_embed_url TEXT,
    principal_data JSONB,
    vision TEXT,
    mission JSONB,
    values_data JSONB,
    branding JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Program Pendidikan
CREATE TABLE IF NOT EXISTS programs (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    image_url TEXT,
    icon_name VARCHAR(100),
    features JSONB,
    target_competencies JSONB,
    status VARCHAR(20) DEFAULT 'published',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Fasilitas
CREATE TABLE IF NOT EXISTS facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    capacity VARCHAR(100),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'published',
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Prestasi
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    competition_name VARCHAR(255) NOT NULL,
    level VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    date DATE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Artikel & Berita
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    category VARCHAR(100) NOT NULL,
    tags JSONB,
    author VARCHAR(100) NOT NULL,
    author_role VARCHAR(100),
    published_date DATE NOT NULL,
    read_time VARCHAR(50),
    status VARCHAR(20) DEFAULT 'published',
    featured BOOLEAN DEFAULT FALSE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Agenda & Kegiatan
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(100),
    location VARCHAR(255),
    category VARCHAR(100),
    cover_image TEXT,
    registration_url TEXT,
    status VARCHAR(20) DEFAULT 'upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Media Files
CREATE TABLE IF NOT EXISTS media_files (
    id VARCHAR(50) PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size VARCHAR(50),
    category VARCHAR(100),
    alt_text TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel Struktur Organisasi & Tenaga Pendidik
CREATE TABLE IF NOT EXISTS organization_members (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    photo_url TEXT,
    bio TEXT,
    qualifications TEXT,
    order_index INT DEFAULT 0
);

-- 9. Tabel Testimoni
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(50) PRIMARY KEY,
    quote TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    photo_url TEXT,
    graduation_year INT,
    child_name VARCHAR(255),
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel Informasi PPDB / Pendaftaran
CREATE TABLE IF NOT EXISTS admission_settings (
    id VARCHAR(50) PRIMARY KEY,
    period_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(50) NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    registration_url TEXT,
    consultation_whatsapp VARCHAR(50),
    timeline JSONB,
    requirements JSONB,
    fees JSONB,
    faqs JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabel Pesan Kontak Masuk (Inbox)
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'new'
);

-- 12. Tabel Pengguna CMS (RBAC: super_admin & editor)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'editor')),
    avatar_url TEXT,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tabel Log Aktivitas
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
