import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { PainelCognitivoScreen } from '../screens/painel/PainelCognitivoScreen';
import { TarefasScreen } from '../screens/tarefas/TarefasScreen';
import { PerfilScreen } from '../screens/perfil/PerfilScreen';

export type MainTabParamList = {
  Painel: undefined;
  Tarefas: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainNavigator() {
  const { colors, fontSizeValue } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Painel') iconName = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'Tarefas') iconName = focused ? 'checkbox' : 'checkbox-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: fontSizeValue - 4,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: fontSizeValue + 2, fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Painel" component={PainelCognitivoScreen} options={{ title: '🧠 Painel' }} />
      <Tab.Screen name="Tarefas" component={TarefasScreen} options={{ title: '✅ Tarefas' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: '👤 Perfil' }} />
    </Tab.Navigator>
  );
}
