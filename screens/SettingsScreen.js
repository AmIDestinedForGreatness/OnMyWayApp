import {
  StyleSheet, Text, View, TouchableOpacity, TextInput,
  ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProperties } from '../context/PropertiesContext';

const APP_VERSION = '1.0.0';

const DEFAULT_USER = {
  displayName: 'Yujin',
  email: 'yujin@email.com',
  phone: '09171234567',
  bio: 'Always looking for the next staycation 🏖️',
  memberSince: 'Host since 2026',
  rating: 5.0,
  totalReviews: 0,
  avatarUri: null,
};

export default function SettingsScreen({ navigation }) {
  const { user, updateUser } = useProperties();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return Alert.alert('Missing name', 'Display name cannot be empty.');
    updateUser({
      displayName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset app data?',
      'This will reset your profile to defaults and clear all your listings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            updateUser(DEFAULT_USER);
            setName(DEFAULT_USER.displayName);
            setEmail(DEFAULT_USER.email);
            setPhone(DEFAULT_USER.phone);
            Alert.alert('Reset complete', 'App data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveText, saved && styles.saveTextDone]}>
              {saved ? 'Saved ✓' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Account section */}
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Display name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#445566"
              maxLength={30}
            />
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor="#445566"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.divider} />
            <Text style={styles.fieldLabel}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="09171234567"
              placeholderTextColor="#445566"
              keyboardType="phone-pad"
            />
          </View>
          <Text style={styles.fieldHint}>Changes are saved locally on this device.</Text>

          {/* App info */}
          <Text style={styles.sectionLabel}>App info</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App name</Text>
              <Text style={styles.infoValue}>On My Way! Staycation</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>v{APP_VERSION}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
            </View>
          </View>

          {/* Danger zone */}
          <Text style={styles.sectionLabel}>Danger zone</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.resetRow} onPress={handleReset}>
              <View style={{ flex: 1 }}>
                <Text style={styles.resetTitle}>Clear app data</Text>
                <Text style={styles.resetSub}>Resets your profile and removes all your listings</Text>
              </View>
              <Text style={styles.resetArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  backText: { color: '#4A9EFF', fontSize: 15, width: 60 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  saveText: { color: '#4A9EFF', fontSize: 15, fontWeight: '700', width: 60, textAlign: 'right' },
  saveTextDone: { color: '#1D9E75' },
  scrollContent: { padding: 20 },
  sectionLabel: { color: '#8899AA', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 6 },
  fieldLabel: { color: '#8899AA', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 6 },
  input: { backgroundColor: '#0A1628', borderWidth: 1, borderColor: '#1E3050', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: '#FFFFFF', fontSize: 14, marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#1E3050', marginVertical: 4 },
  fieldHint: { color: '#445566', fontSize: 11, marginTop: 8, marginLeft: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  infoLabel: { color: '#8899AA', fontSize: 14 },
  infoValue: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  resetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  resetTitle: { color: '#FF4444', fontSize: 14, fontWeight: '700' },
  resetSub: { color: '#8899AA', fontSize: 12, marginTop: 2 },
  resetArrow: { color: '#FF4444', fontSize: 18 },
});
