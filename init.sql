-- Create enum types
CREATE TYPE link_status AS ENUM ('pending', 'processing', 'scraped', 'verified', 'failed');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(500),
    content TEXT,
    source_domain VARCHAR(255),
    author VARCHAR(255),
    published_at TIMESTAMP,
    status link_status DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    link_id INTEGER UNIQUE NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    credibility_score FLOAT,
    claims JSONB,
    sources_checked TEXT[],
    summary TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link chunks table (for RAG embeddings - stored as bytea for now)
CREATE TABLE IF NOT EXISTS link_chunks (
    id SERIAL PRIMARY KEY,
    link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link queries table (for Q&A history)
CREATE TABLE IF NOT EXISTS link_queries (
    id SERIAL PRIMARY KEY,
    link_id INTEGER NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_status ON links(status);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_chunks_link_id ON link_chunks(link_id);
CREATE INDEX IF NOT EXISTS idx_link_queries_link_id ON link_queries(link_id);
CREATE INDEX IF NOT EXISTS idx_link_queries_user_id ON link_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert sample test users (for development)
INSERT INTO users (email, name) VALUES 
    ('test@example.com', 'Test User'),
    ('demo@example.com', 'Demo User'),
    ('student@university.edu', 'Student User')
ON CONFLICT (email) DO NOTHING;
