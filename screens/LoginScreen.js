import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to find properties near you</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email address</Text>
        <TextInput style={styles.input} placeholder="juan@email.com" placeholderTextColor="#445566" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Your password" placeholderTextColor="#445566" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.replace('Home')}>
          <Text style={styles.btnPrimaryText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>No account yet? <Text style={styles.signupLinkBlue}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0A1628', paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  back: { marginBottom: 24 },
  backText: { color: '#4A9EFF', fontSize: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#8899AA', marginTop: 6, marginBottom: 32 },
  form: { gap: 8 },
  label: { fontSize: 13, color: '#8899AA', fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFFFFF', fontSize: 15 },
  forgotText: { color: '#4A9EFF', fontSize: 13, textAlign: 'right', marginTop: 8 },
  btnPrimary: { backgroundColor: '#4A9EFF', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  signupLink: { color: '#8899AA', textAlign: 'center', marginTop: 16, fontSize: 14 },
  signupLinkBlue: { color: '#4A9EFF', fontWeight: '600' },
});
