import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CreateAccount() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Create Account page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
}); 