import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeMode, FontSize, SpacingMode } from '../../contexts/ThemeContext';
import { useAccessibility, ComplexityLevel } from '../../contexts/AccessibilityContext';
import { useAuth } from '../../contexts/AuthContext';

function SectionTitle({ title, colors, fontSize }: { title: string; colors: any; fontSize: number }) {
  return <Text style={[styles.sectionTitle, { color: colors.primary, fontSize: fontSize + 2 }]}>{title}</Text>;
}

function OptionGroup<T extends string>({
  options, current, onChange, colors, fontSize,
}: {
  options: { value: T; label: string; icon: string; description?: string }[];
  current: T;
  onChange: (v: T) => void;
  colors: any;
  fontSize: number;
}) {
  return (
    <View style={styles.optionGroup}>
      {options.map((opt) => {
        const active = current === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.optionBtn,
              { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + '18' : colors.surface },
            ]}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
          >
            <Text style={styles.optionIcon}>{opt.icon}</Text>
            <View style={styles.optionTextWrapper}>
              <Text style={[styles.optionLabel, { color: active ? colors.primary : colors.text, fontSize }]}>
                {opt.label}
              </Text>
              {opt.description ? (
                <Text style={[styles.optionDesc, { color: colors.textSecondary, fontSize: fontSize - 3 }]}>
                  {opt.description}
                </Text>
              ) : null}
            </View>
            {active && <Text style={[styles.optionCheck, { color: colors.primary }]}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function PainelCognitivoScreen() {
  const { theme, setTheme, fontSize, setFontSize, spacing, setSpacing, animationsEnabled, setAnimationsEnabled, colors, fontSizeValue } = useTheme();
  const { focusMode, setFocusMode, complexityLevel, setComplexityLevel, cognitiveAlerts, setCognitiveAlerts } = useAccessibility();
  const { user, logout } = useAuth();

  const THEMES: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Claro', icon: '☀️' },
    { value: 'dark', label: 'Escuro', icon: '🌙' },
    { value: 'high-contrast', label: 'Alto Contraste', icon: '⬛' },
  ];

  const FONT_SIZES: { value: FontSize; label: string; icon: string }[] = [
    { value: 'small', label: 'Pequeno', icon: 'A' },
    { value: 'medium', label: 'Médio', icon: 'A' },
    { value: 'large', label: 'Grande', icon: 'A' },
    { value: 'extra-large', label: 'Extra Grande', icon: 'A' },
  ];

  const SPACINGS: { value: SpacingMode; label: string; icon: string }[] = [
    { value: 'compact', label: 'Compacto', icon: '⬛' },
    { value: 'normal', label: 'Normal', icon: '🔲' },
    { value: 'comfortable', label: 'Confortável', icon: '⬜' },
    { value: 'spacious', label: 'Espaçoso', icon: '🟦' },
  ];

  const COMPLEXITY: { value: ComplexityLevel; label: string; icon: string; description: string }[] = [
    { value: 'minimal', label: 'Mínimo', icon: '🔹', description: 'Apenas o essencial, sem distrações' },
    { value: 'simple', label: 'Simples', icon: '🔷', description: 'Interface limpa com funções básicas' },
    { value: 'standard', label: 'Padrão', icon: '🔵', description: 'Equilíbrio entre recursos e clareza' },
    { value: 'detailed', label: 'Detalhado', icon: '💠', description: 'Todas as funcionalidades disponíveis' },
  ];

  const s = fontSizeValue;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.container, { paddingHorizontal: 16 }]} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroIcon}>🧠</Text>
          <Text style={styles.heroTitle}>Painel Cognitivo</Text>
          <Text style={styles.heroSub}>Personalize sua experiência, {user?.name?.split(' ')[0]}</Text>
        </View>

        {/* ---- Visual ---- */}
        <SectionTitle title="🎨 Aparência Visual" colors={colors} fontSize={s} />

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Tema</Text>
          <OptionGroup options={THEMES} current={theme} onChange={setTheme} colors={colors} fontSize={s - 1} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Tamanho de Fonte</Text>
          <OptionGroup options={FONT_SIZES} current={fontSize} onChange={setFontSize} colors={colors} fontSize={s - 1} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Espaçamento</Text>
          <OptionGroup options={SPACINGS} current={spacing} onChange={setSpacing} colors={colors} fontSize={s - 1} />
        </View>

        {/* ---- Suporte Cognitivo ---- */}
        <SectionTitle title="🧩 Suporte Cognitivo" colors={colors} fontSize={s} />

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Modo de Foco</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary, fontSize: s - 2 }]}>
                Reduz elementos distratores
              </Text>
            </View>
            <Switch
              value={focusMode}
              onValueChange={setFocusMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              accessibilityRole="switch"
              accessibilityLabel="Modo de foco"
              accessibilityState={{ checked: focusMode }}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Alertas Cognitivos</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary, fontSize: s - 2 }]}>
                Aviso após 90 min de foco contínuo
              </Text>
            </View>
            <Switch
              value={cognitiveAlerts}
              onValueChange={setCognitiveAlerts}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              accessibilityRole="switch"
              accessibilityLabel="Alertas cognitivos"
              accessibilityState={{ checked: cognitiveAlerts }}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Animações</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary, fontSize: s - 2 }]}>
                Desative para reduzir estímulos
              </Text>
            </View>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              accessibilityRole="switch"
              accessibilityLabel="Animações"
              accessibilityState={{ checked: animationsEnabled }}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontSize: s }]}>Nível de Complexidade</Text>
          <OptionGroup options={COMPLEXITY} current={complexityLevel} onChange={setComplexityLevel} colors={colors} fontSize={s - 1} />
        </View>

        {/* ---- Info sobre neurodivergência ---- */}
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
          <Text style={[styles.infoTitle, { color: colors.primary, fontSize: s }]}>💡 Para quem é o MindEase?</Text>
          <Text style={[styles.infoText, { color: colors.text, fontSize: s - 2 }]}>
            Desenvolvido para usuários com TDAH, TEA, Dislexia, Ansiedade e outras características neurodivergentes.
            Cada configuração acima adapta a interface às suas necessidades específicas.
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.error }]}
          onPress={() => {
            Alert.alert('Sair', 'Deseja sair da sua conta?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: logout },
            ]);
          }}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={[styles.logoutText, { color: colors.error, fontSize: s }]}>🚪 Sair da Conta</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingTop: 12 },
  heroCard: {
    borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24,
  },
  heroIcon: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  sectionTitle: { fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontWeight: '700', marginBottom: 8 },
  cardDesc: { marginTop: 2 },
  optionGroup: { gap: 8 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', padding: 12,
    borderRadius: 12, borderWidth: 1.5, gap: 10,
  },
  optionIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  optionTextWrapper: { flex: 1 },
  optionLabel: { fontWeight: '600' },
  optionDesc: { marginTop: 2 },
  optionCheck: { fontSize: 18, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleInfo: { flex: 1, marginRight: 12 },
  infoCard: {
    borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5,
  },
  infoTitle: { fontWeight: '700', marginBottom: 8 },
  infoText: { lineHeight: 20 },
  logoutBtn: {
    borderRadius: 12, borderWidth: 1.5, paddingVertical: 14,
    alignItems: 'center', marginBottom: 8,
  },
  logoutText: { fontWeight: '700' },
});
