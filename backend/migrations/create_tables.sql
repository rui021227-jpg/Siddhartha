
-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    user_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT,
    topic TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    ended_at TIMESTAMPTZ
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
