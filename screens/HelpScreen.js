import {
  StyleSheet, Text, View, TouchableOpacity,
  ScrollView, SafeAreaView, Linking, Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';

const FAQ = [
  {
    q: 'How does the OMW! button work?',
    a: 'After exchanging at least one message with a host, a red OMW! button appears in the chat. Tap it to start turn-by-turn navigation to the property on the map — like Waze, but for staycations.',
  },
  {
    q: 'How do I list my space?',
    a: 'From the Home screen, tap "Host your space." Fill in your photos, nightly rate, amenities, and location. Once published, your listing appears as a pin on the map instantly.',
  },
  {
    q: 'Is On My Way! free to use?',
    a: 'Yes — completely free for guests and hosts during our beta period. We will introduce optional listing boosts in the future, but browsing and messaging will always be free.',
  },
  {
    q: 'What areas are covered?',
    a: 'Currently focused on Metro Manila, Tagaytay, Baguio, La Union, and Batangas. More destinations are being added. If your area is not covered, list your space and you will be the first pin there!',
  },
  {
    q: 'How do I contact a host?',
    a: 'Tap any property pin on the map, scroll to the bottom of the detail sheet, and tap "Message host." This opens a chat directly with the host.',
  },
];

export default function HelpScreen({ navigation }) {
  const [openFaq, setOpenFaq] = useState(null);
  const insets = useSafeAreaInsets();

  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  const reportBug = () => {
    const url = 'mailto:support@onmyway.ph?subject=Bug Report — On My Way! v' + APP_VERSION;
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert('Email not available', 'Please email us at support@onmyway.ph');
    });
  };

  const STEPS = [
    { icon: '🗺️', title: 'Browse the map', desc: 'Open the map and explore property pins near you.' },
    { icon: '📍', title: 'Tap a pin', desc: 'Tap any pin to see photos, price, amenities, and host info.' },
    { icon: '💬', title: 'Chat with the host', desc: 'Message the host to ask questions and confirm availability.' },
    { icon: '🚗', title: 'Hit OMW!', desc: 'Unlock the red OMW! button and get directions straight to the property.' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* How to use */}
        <Text style={styles.sectionLabel}>How to use</Text>
        <View style={styles.card}>
          {STEPS.map((step, idx) => (
            <View key={idx}>
              <View style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <View style={styles.stepNumWrap}>
                  <Text style={styles.stepNum}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
              {idx < STEPS.length - 1 && (
                <View style={styles.stepConnector}>
                  <Text style={styles.stepConnectorDot}>│</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionLabel}>Frequently asked questions</Text>
        <View style={styles.card}>
          {FAQ.map((item, idx) => (
            <View key={idx}>
              <TouchableOpacity style={styles.faqRow} onPress={() => toggleFaq(idx)}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Text style={styles.faqChevron}>{openFaq === idx ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {openFaq === idx && (
                <Text style={styles.faqA}>{item.a}</Text>
              )}
              {idx < FAQ.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.supportRow} onPress={reportBug}>
            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>🐛 Report a bug</Text>
              <Text style={styles.supportSub}>Something not working? Let us know.</Text>
            </View>
            <Text style={styles.supportArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.aboutInner}>
            <Text style={styles.aboutLogo}>🗺️</Text>
            <Text style={styles.aboutName}>On My Way! Staycation</Text>
            <Text style={styles.aboutTagline}>Tara, staycation! ✨</Text>
            <Text style={styles.aboutVersion}>Version {APP_VERSION}</Text>
            <Text style={styles.aboutDesc}>
              A map-first staycation rental app built for Filipinos. Discover Filipino-owned rentals near you, chat with hosts, and navigate straight to your weekend escape.
            </Text>
            <View style={styles.aboutBadge}>
              <Text style={styles.aboutBadgeText}>🇵🇭 Built for Filipino travelers</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  backText: { color: '#4A9EFF', fontSize: 15, width: 60 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  scrollContent: { padding: 20 },
  sectionLabel: { color: '#8899AA', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 10, marginLeft: 4 },
  card: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#1E3050', marginVertical: 2 },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, gap: 12 },
  stepIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0A1628', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E3050' },
  stepIcon: { fontSize: 22 },
  stepNumWrap: { position: 'absolute', left: 30, top: 10, width: 18, height: 18, borderRadius: 9, backgroundColor: '#4A9EFF', alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  stepTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 3 },
  stepDesc: { color: '#8899AA', fontSize: 13, lineHeight: 18 },
  stepConnector: { paddingLeft: 21, marginVertical: -4 },
  stepConnectorDot: { color: '#1E3050', fontSize: 16 },

  // FAQ
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, gap: 12 },
  faqQ: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', flex: 1, lineHeight: 20 },
  faqChevron: { color: '#4A9EFF', fontSize: 10 },
  faqA: { color: '#8899AA', fontSize: 13, lineHeight: 20, paddingBottom: 14, paddingRight: 8 },

  // Support
  supportRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  supportTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  supportSub: { color: '#8899AA', fontSize: 12, marginTop: 2 },
  supportArrow: { color: '#4A9EFF', fontSize: 18 },

  // About
  aboutInner: { alignItems: 'center', paddingVertical: 24 },
  aboutLogo: { fontSize: 48, marginBottom: 12 },
  aboutName: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  aboutTagline: { color: '#4A9EFF', fontSize: 14, fontWeight: '600', marginTop: 4 },
  aboutVersion: { color: '#445566', fontSize: 12, marginTop: 6 },
  aboutDesc: { color: '#8899AA', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 14, paddingHorizontal: 8 },
  aboutBadge: { marginTop: 16, backgroundColor: '#0A1628', borderWidth: 1, borderColor: '#1E3050', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  aboutBadgeText: { color: '#8899AA', fontSize: 12 },
});
