import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
}); 