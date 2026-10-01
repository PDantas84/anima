import { StyleSheet } from 'react-native';
export const palette = {
  background: '#1C191F',
  surface: '#27222B',
  elevated: '#332A35',
  line: '#4B3B4C',
  text: '#F4EAE2',
  muted: '#C0B0C3',
  quiet: '#AFA0B2',
  rose: '#DFBCAB',
  sage: '#BBC9B0',
  lavender: '#C6B4DA',
  danger: '#EBA8AD',
  ink: '#35252E',
};
export const fonts = {
  body: 'Inter',
  medium: 'InterMedium',
  title: 'Playfair',
  italic: 'PlayfairItalic',
};
export const type = StyleSheet.create({
  title: {
    fontFamily: fonts.title,
    fontSize: 34,
    lineHeight: 44,
    color: palette.text,
  },
  heading: {
    fontFamily: fonts.title,
    fontSize: 26,
    lineHeight: 35,
    color: palette.text,
  },
  subheading: {
    fontFamily: fonts.medium,
    fontSize: 17,
    lineHeight: 25,
    color: palette.text,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 24,
    color: palette.muted,
  },
  small: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 19,
    color: palette.muted,
  },
  eyebrow: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.6,
    color: palette.rose,
    textTransform: 'uppercase',
  },
});
