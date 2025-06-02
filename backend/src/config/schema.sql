-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    about_me TEXT,
    birthdate DATE,
    street_address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    current_step INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_config table
CREATE TABLE IF NOT EXISTS admin_config (
    id SERIAL PRIMARY KEY,
    page2_components JSONB NOT NULL DEFAULT '["aboutMe", "birthdate"]',
    page3_components JSONB NOT NULL DEFAULT '["address"]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin configuration
INSERT INTO admin_config (page2_components, page3_components)
VALUES ('["aboutMe", "birthdate"]', '["address"]')
ON CONFLICT DO NOTHING; 