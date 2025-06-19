import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}><Slot /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingBottom: 60 }, // leave space for footer
}); 