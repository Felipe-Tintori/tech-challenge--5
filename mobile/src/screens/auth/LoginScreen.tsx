import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

function Toast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={toastStyles.container} accessibilityRole="alert">
      <Text style={toastStyles.text}>âš ï¸ {message}</Text>
    </View>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 14,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '500', lineHeight: 20 },
});

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const showToast = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!isLogin && !name.trim()) {
      errors.name = 'Nome é obrigatório.';
    }
    if (!email.trim()) {
      errors.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Informe um e-mail válido.';
    }
    if (!password) {
      errors.password = 'Senha é obrigatória.';
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        showToast('E-mail ou senha incorretos.');
      } else if (code === 'auth/email-already-in-use') {
        setFieldErrors((prev) => ({ ...prev, email: 'Este e-mail já está em uso.' }));
      } else if (code === 'auth/invalid-email') {
        setFieldErrors((prev) => ({ ...prev, email: 'E-mail inválido.' }));
      } else if (code === 'auth/weak-password') {
        setFieldErrors((prev) => ({ ...prev, password: 'A senha deve ter pelo menos 6 caracteres.' }));
      } else {
        showToast(err?.message || 'Erro ao processar sua solicitação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => {
    setIsLogin(!isLogin);
    setFieldErrors({});
    setToastVisible(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Toast message={toast} visible={toastVisible} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.header}>
            <Text style={styles.logoIcon}>🧠</Text>
            <Text style={styles.logoText}>MindEase</Text>
            <Text style={styles.logoSubtitle}>Acessibilidade Cognitiva</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>
              {isLogin ? 'Bem-vindo de volta!' : 'Criar sua conta'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? 'Entre com suas credenciais para continuar'
                : 'Junte-se ao MindEase e personalize sua experiência'}
            </Text>

            {/* Nome (só cadastro) */}
            {!isLogin && (
              <View style={styles.field}>
                <Text style={styles.label}>Nome completo <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, !!fieldErrors.name && styles.inputError]}
                  value={name}
                  onChangeText={(v) => { setName(v); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  editable={!isLoading}
                  accessibilityLabel="Nome completo"
                />
                {!!fieldErrors.name && <Text style={styles.fieldErrorText}>âš  {fieldErrors.name}</Text>}
              </View>
            )}

            {/* E-mail */}
            <View style={styles.field}>
              <Text style={styles.label}>E-mail <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, !!fieldErrors.email && styles.inputError]}
                value={email}
                onChangeText={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                accessibilityLabel="E-mail"
              />
              {!!fieldErrors.email && <Text style={styles.fieldErrorText}>âš  {fieldErrors.email}</Text>}
            </View>

            {/* Senha */}
            <View style={styles.field}>
              <Text style={styles.label}>Senha <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, !!fieldErrors.password && styles.inputError]}
                value={password}
                onChangeText={(v) => { setPassword(v); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                editable={!isLoading}
                accessibilityLabel="Senha"
              />
              {!!fieldErrors.password && <Text style={styles.fieldErrorText}>âš  {fieldErrors.password}</Text>}
            </View>

            {/* Botão principal */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={isLogin ? 'Entrar' : 'Criar conta'}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Entrar' : 'Criar conta'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </Text>
              <TouchableOpacity onPress={toggle} disabled={isLoading} accessibilityRole="button">
                <Text style={styles.toggleBtn}>
                  {isLogin ? 'Criar conta' : 'Fazer login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FF' },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 56, marginBottom: 8 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#6C63FF' },
  logoSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  required: { color: '#EF4444' },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A2E',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF5F5',
  },
  fieldErrorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  toggleLabel: { fontSize: 14, color: '#6B7280' },
  toggleBtn: { fontSize: 14, fontWeight: '700', color: '#6C63FF' },
});