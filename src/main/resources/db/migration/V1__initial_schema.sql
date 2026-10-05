-- Game Time - Initial Schema

CREATE TABLE slot (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date_time       TIMESTAMP WITH TIME ZONE NOT NULL,
    location        VARCHAR(100) NOT NULL DEFAULT 'Lobby lounge',
    games           VARCHAR(255),
    group_chat_link VARCHAR(500),
    cancelled       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE participant (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id         UUID NOT NULL REFERENCES slot(id) ON DELETE CASCADE,
    first_name      VARCHAR(50) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    confirmed       BOOLEAN DEFAULT FALSE,
    cancelled       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for looking up participants by slot
CREATE INDEX idx_participant_slot_id ON participant(slot_id);

-- Index for finding upcoming slots
CREATE INDEX idx_slot_date_time ON slot(date_time);

-- Admin config table for app settings
CREATE TABLE app_config (
    key             VARCHAR(100) PRIMARY KEY,
    value           TEXT NOT NULL,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO app_config (key, value) VALUES
    ('host_name', 'Nathan'),
    ('host_floor', '4th floor'),
    ('default_location', 'Lobby lounge'),
    ('default_games', 'Monopoly Deal, SkyJo, Skip-Bo, Cribbage'),
    ('group_chat_link', '');
