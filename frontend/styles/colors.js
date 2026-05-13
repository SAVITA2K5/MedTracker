// MEDTRACK Colour Palette – strict brand theme
export const COLORS = {
    // ── Primary Deep Blue ──────────────────────────────────────
    primary: '#0A1628',
    primaryMid: '#0D2144',
    primaryLight: '#1A3A6B',

    // ── Navigation Mid Blue ────────────────────────────────────
    navBg: '#112240',
    navActive: '#1E90FF',

    // ── Accent / CTA ───────────────────────────────────────────
    accent: '#1E90FF',
    accentLight: '#64B5F6',

    // ── Success Green ──────────────────────────────────────────
    success: '#00C853',
    successLight: '#69F0AE',

    // ── Warning / XAI Yellow ───────────────────────────────────
    warning: '#FFD740',
    warningBg: '#FFF8E1',

    // ── Danger / High Risk ─────────────────────────────────────
    danger: '#FF1744',
    dangerLight: '#FF6E6E',

    // ── Neutral ────────────────────────────────────────────────
    white: '#FFFFFF',
    offWhite: '#F5F7FA',
    lightGrey: '#B0BEC5',
    grey: '#607D8B',
    darkGrey: '#37474F',
    black: '#000000',

    // ── Card backgrounds ───────────────────────────────────────
    cardBg: '#0D2144',
    cardBorder: '#1E3A5F',

    // ── Gradient stops ─────────────────────────────────────────
    gradientStart: '#0A1628',
    gradientEnd: '#1A3A6B',
};

export const RISK_COLORS = {
    Low: COLORS.success,
    Moderate: COLORS.warning,
    High: COLORS.danger,
};
