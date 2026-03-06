import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export function LoadingScreen() {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="Carregando...">
      <Text style={styles.logo}>🧠</Text>
      <ActivityIndicator size="large" color="#6C63FF" style={styles.spinner} />
      <Text style={styles.text}>Carregando MindEase...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { fontSize: 64, marginBottom: 24 },
  spinner: { marginBottom: 16 },
  text: { fontSize: 16, color: '#6B7280', fontWeight: '500' },
});
