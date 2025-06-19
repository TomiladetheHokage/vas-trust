import { useSegments } from 'expo-router';
import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Footer from './components/Footer';
import Header from './components/Header';

export default function Layout({ children }: { children: ReactNode }) {
  const segments = useSegments();
  // Hide footer on /auth/login and /auth/register
  const hideFooter =
    (segments[0] === 'auth' && (segments[1] === 'login' || segments[1] === 'register'));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.content}>{children}</View>
      {!hideFooter && <Footer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef4ff' },
  content: { flex: 1 },
}); 