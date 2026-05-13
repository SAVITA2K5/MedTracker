// API base URL – change to your machine's LAN IP for physical device testing
export const API_BASE_URL = 'http://127.0.0.1:8000';

// Health score thresholds
export const HEALTH_SCORE = {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
    POOR: 0,
};

// Risk levels
export const RISK_LEVELS = {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
};

// Disease types
export const DISEASES = {
    DIABETES: 'diabetes',
    HEART: 'heart_disease',
};

// Async Storage keys
export const STORAGE_KEYS = {
    TOKEN: '@medtrack_token',
    USER: '@medtrack_user',
};

// App name
export const APP_NAME = 'MEDTRACK';
export const APP_TAGLINE = 'MedAI Guardian';
