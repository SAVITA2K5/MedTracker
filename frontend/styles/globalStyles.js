import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const globalStyles = StyleSheet.create({
    // ── Containers ─────────────────────────────────────────────
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    padding: {
        padding: 20,
    },
    paddingH: {
        paddingHorizontal: 20,
    },
    paddingV: {
        paddingVertical: 16,
    },

    // ── Cards ──────────────────────────────────────────────────
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },

    // ── Typography ─────────────────────────────────────────────
    h1: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    h2: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.white,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.white,
    },
    body: {
        fontSize: 14,
        color: COLORS.lightGrey,
        lineHeight: 22,
    },
    caption: {
        fontSize: 12,
        color: COLORS.grey,
    },
    accent: {
        color: COLORS.accent,
    },

    // ── Inputs ─────────────────────────────────────────────────
    input: {
        backgroundColor: COLORS.navBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.white,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    inputFocused: {
        borderColor: COLORS.accent,
    },
    label: {
        fontSize: 13,
        color: COLORS.lightGrey,
        marginBottom: 6,
        marginLeft: 2,
    },

    // ── Divider ────────────────────────────────────────────────
    divider: {
        height: 1,
        backgroundColor: COLORS.cardBorder,
        marginVertical: 16,
    },

    // ── Badge ──────────────────────────────────────────────────
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.white,
    },
});
