import { Slot, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Footer from './components/Footer';
import Header from './components/Header';

const tabMap = [
  { key: 'home', route: '/tabs/home' },
  { key: 'transfer', route: '/tabs/transfer-options' },
  { key: 'history', route: '/tabs/transactions' },
  { key: 'profile', route: '/tabs/profile' },
];

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  // Hide header/footer on /, /auth/login, /auth/register
  const isAuthPage =
    (!segments[0]) ||
    (segments[0] === 'auth' && (segments[1] === 'login' || segments[1] === 'register'));

  // Determine selected tab from current route
  let selected = 'home';
  if (segments[0] === 'tabs') {
    if (segments[1] === 'transfer') selected = 'transfer';
    else if (segments[1] === 'transactions') selected = 'history';
    else if (segments[1] === 'profile') selected = 'profile';
  }

  const handleSelect = (key: string) => {
    const found = tabMap.find(t => t.key === key);
    if (found) router.replace(found.route as any);
  };

  const handleLogout = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isAuthPage && <Header onLogout={handleLogout} />}
      <View style={styles.content}>
        <Slot />
      </View>
      {!isAuthPage && <Footer selected={selected} onSelect={handleSelect} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1 },
});
