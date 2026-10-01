export const colors = {
  bg: '#09090B',
  surface: '#18181B',
  surfaceAlt: '#27272A',
  border: '#2F2F35',
  text: '#F4F4F5',
  textMuted: '#A1A1AA',
  textSoft: '#D4D4D8',
  gold: '#D6B66D',
  goldSoft: '#E8CF95',
  rose: '#E8B4BE',
  roseDeep: '#B76E79',
  blush: '#F5D8DC',
  sage: '#B7C9B0',
  ivory: '#F7F1E6',
  danger: '#F87171',
  success: '#86EFAC',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 34, lineHeight: 40, color: colors.text },
  h1: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, lineHeight: 34, color: colors.text },
  h2: { fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 22, lineHeight: 28, color: colors.text },
  h3: { fontFamily: 'Inter-SemiBold', fontSize: 18, lineHeight: 24, color: colors.text },
  body: { fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 24, color: colors.textSoft },
  bodyStrong: { fontFamily: 'Inter-SemiBold', fontSize: 15, lineHeight: 22, color: colors.text },
  small: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20, color: colors.textMuted },
  label: { fontFamily: 'Inter-Medium', fontSize: 12, lineHeight: 16, color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  quote: { fontFamily: 'PlayfairDisplay-Italic', fontSize: 18, lineHeight: 28, color: colors.goldSoft },
};
