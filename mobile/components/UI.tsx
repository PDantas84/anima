import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, HeartHandshake, X } from 'lucide-react-native';
import { palette, fonts, type } from '../theme';
import { useMobile, selectionHaptic } from '../Store';
import { Mood, moodLabels } from '@/domain/model';
import { Face } from './Artwork';
export function Screen({
  children,
  title,
  eyebrow,
  description,
  back = false,
  action,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  description?: string;
  back?: boolean;
  action?: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const { error } = useMobile();
  const content = (
    <>
      {title && (
        <View style={s.header}>
          {back && (
            <IconButton
              label="Voltar"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace('/(tabs)')
              }
              icon={<ArrowLeft size={22} color={palette.rose} />}
            />
          )}
          <View style={{ flex: 1 }}>
            {eyebrow && <Text style={type.eyebrow}>{eyebrow}</Text>}
            <Text accessibilityRole="header" style={type.title}>
              {title}
            </Text>
          </View>
          {action ?? (
            <IconButton
              label="Encontrar apoio"
              onPress={() => router.push('/crisis')}
              icon={<HeartHandshake size={21} color={palette.rose} />}
            />
          )}
        </View>
      )}
      {description && (
        <Text style={[type.body, { marginTop: -10 }]}>{description}</Text>
      )}
      {error ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/profile')}
          style={s.error}
        >
          <Text style={[type.small, { color: palette.danger }]}>{error}</Text>
          <Text style={[type.small, { color: palette.rose, marginTop: 6 }]}>
            Abrir Meu espaço →
          </Text>
        </Pressable>
      ) : null}
      {children}
    </>
  );
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[s.safe, style]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              s.content,
              { paddingBottom: 30 + insets.bottom },
            ]}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={[s.content, { flex: 1, paddingBottom: insets.bottom }]}>
            {content}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  busy = false,
  style,
  testID,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  busy?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const fg =
    variant === 'primary'
      ? palette.ink
      : variant === 'danger'
        ? palette.danger
        : palette.rose;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        variant === 'primary'
          ? s.primary
          : variant === 'secondary'
            ? s.secondary
            : variant === 'danger'
              ? s.danger
              : s.ghost,
        pressed && { opacity: 0.75 },
        (disabled || busy) && { opacity: 0.45 },
        style,
      ]}
    >
      {busy ? <ActivityIndicator color={fg} /> : icon}
      <Text style={[s.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}
export function IconButton({
  label,
  onPress,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  icon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        s.iconButton,
        pressed && { backgroundColor: palette.elevated },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}
export function Field({
  label,
  style,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 9 }}>
      <Text style={[type.small, { color: palette.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={palette.quiet}
        {...props}
        style={[s.input, props.multiline && s.multiline, style]}
      />
    </View>
  );
}
export function MoodPicker({
  value,
  onChange,
  disabled = false,
}: {
  value?: Mood;
  onChange: (mood: Mood) => void;
  disabled?: boolean;
}) {
  return (
    <View style={s.moods}>
      {([1, 2, 3, 4, 5] as Mood[]).map((mood) => (
        <Pressable
          key={mood}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={moodLabels[mood]}
          accessibilityState={{ selected: value === mood, disabled }}
          onPress={() => {
            selectionHaptic();
            onChange(mood);
          }}
          style={[s.mood, value === mood && s.moodActive]}
        >
          <Face
            mood={mood}
            color={
              ['#BCA8CE', '#D1AABD', '#D8C5B2', '#BCCAB3', '#DDCC9B'][mood - 1]
            }
          />
          <Text
            style={[s.moodLabel, value === mood && { color: palette.text }]}
          >
            {moodLabels[mood]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={s.section}>
      <Text accessibilityRole="header" style={[type.heading, { flex: 1 }]}>
        {title}
      </Text>
      {action && onPress && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={[type.small, { color: palette.rose }]}>{action} →</Text>
        </Pressable>
      )}
    </View>
  );
}
export function Empty({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card style={s.empty}>
      <View style={s.emptyIcon}>{icon}</View>
      <Text
        accessibilityRole="header"
        style={[type.heading, { textAlign: 'center' }]}
      >
        {title}
      </Text>
      <Text style={[type.body, { textAlign: 'center' }]}>{description}</Text>
      {action}
    </Card>
  );
}
export const common = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stack: { gap: 18 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.line,
  },
  separator: { height: 1, backgroundColor: palette.line },
  note: { ...type.small, textAlign: 'center', marginVertical: 6 },
  link: { ...type.small, color: palette.rose },
  flex: { flex: 1 },
});
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  content: { paddingHorizontal: 22, paddingTop: 14, gap: 22 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  error: {
    backgroundColor: '#422C35',
    borderColor: '#956572',
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
  },
  button: {
    minHeight: 52,
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primary: { backgroundColor: palette.rose },
  secondary: {
    backgroundColor: palette.elevated,
    borderWidth: 1,
    borderColor: '#69505E',
  },
  ghost: { backgroundColor: 'transparent' },
  danger: {
    backgroundColor: '#472D38',
    borderWidth: 1,
    borderColor: '#77505E',
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    flexShrink: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 22,
    padding: 22,
    gap: 14,
  },
  input: {
    color: palette.text,
    backgroundColor: '#211C25',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#625064',
    padding: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    minHeight: 54,
  },
  multiline: { minHeight: 150, textAlignVertical: 'top', lineHeight: 26 },
  moods: { flexDirection: 'row', gap: 3, justifyContent: 'space-between' },
  mood: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 84,
  },
  moodActive: { borderColor: '#A98086', backgroundColor: '#4A3744' },
  moodLabel: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 9,
    lineHeight: 15,
    textAlign: 'center',
  },
  section: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 18 },
  emptyIcon: {
    height: 70,
    width: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#493444',
  },
});
