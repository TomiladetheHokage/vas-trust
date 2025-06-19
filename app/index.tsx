import { useRouter } from 'expo-router';
import React from 'react';
import LoginScreen from './auth/login';

export default function Index() {
  const router = useRouter();
  // For demo: show login, then allow navigation to tabs/home
  return <LoginScreen onLogin={() => router.replace('/tabs/home')} />;
}
