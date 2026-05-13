-- MEDTRACK PostgreSQL Schema
-- Run this to initialise the database

CREATE DATABASE IF NOT EXISTS medtrack;

\c medtrack;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth VARCHAR(20),
    gender VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Health data table
CREATE TABLE IF NOT EXISTS health_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER NOT NULL,
    gender VARCHAR(10),
    bmi FLOAT,
    blood_pressure_systolic FLOAT,
    blood_pressure_diastolic FLOAT,
    -- Diabetes features
    glucose FLOAT,
    insulin FLOAT,
    skin_thickness FLOAT,
    diabetes_pedigree FLOAT,
    pregnancies INTEGER,
    -- Heart disease features
    cholesterol FLOAT,
    chest_pain_type INTEGER,
    max_heart_rate FLOAT,
    exercise_angina INTEGER,
    st_depression FLOAT,
    fasting_blood_sugar INTEGER,
    resting_ecg INTEGER,
    slope INTEGER,
    ca INTEGER,
    thal INTEGER,
    -- Prediction results
    diabetes_risk FLOAT,
    heart_risk FLOAT,
    health_score FLOAT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_data_user_id ON health_data(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);

SELECT*FROM USERS;
SELECT*FROM health_data;
SELECT*FROM emergency_contacts;