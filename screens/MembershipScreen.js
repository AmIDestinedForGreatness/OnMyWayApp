import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProperties } from '../context/PropertiesContext';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Host',
    price: '₱99',
    period: '/month',
    coins: 100,
    color: '#185FA5',
    perks: [
      '100 OMW Coins / month',
      '1 active boost slot',
      'Standard pin size on map',
      'Priority in search results',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Host',
    price: '₱299',
    period: '/month',
    coins: 350,
    color: '#0F6E56',
    badge: 'BEST VALUE',
    perks: [
      '350 OMW Coins / month',
      '3 active boost slots',
      'Enlarged pin on map',
      'Featured listing badge',
      'Top of search results',
      'Priority host support',
    ],
  },
];

const BOOST_TIERS = [
  { label: '24hr Boost', coins: 50, desc: 'Pin floats to top for 24 hours' },
  { label: '3-Day Boost', coins: 120, desc: 'Stay featured for 3 days' },
  { label: '7-Day Featured', coins: 200, desc: 'Enlarged pin + top of search for a week' },
];

export default function MembershipScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { omwCoins, membershipTier } = useProperties();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OMW Membership</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Coins balance */}
        <View style={styles.coinsCard}>
          <Text style={styles.coinsLabel}>Your OMW Coins</Text>
          <Text style={styles.coinsValue}>🪙 {omwCoins}</Text>
          <Text style={styles.coinsNote}>Use coins to boost your listings on the map</Text>
          {membershipTier !== 'free' && (
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>{membershipTier === 'pro' ? '⭐ PRO HOST' : '✦ BASIC HOST'}</Text>
            </View>
          )}
        </View>

        {/* Boost tiers */}
        <Text style={styles.sectionTitle}>Boost your listing</Text>
        <Text style={styles.sectionSub}>Boosted listings appear at the top of search and have an enlarged map pin — even far from the user's location.</Text>
        {BOOST_TIERS.map(b => (
          <View key={b.label} style={styles.boostRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.boostLabel}>{b.label}</Text>
              <Text style={styles.boostDesc}>{b.desc}</Text>
            </View>
            <View style={styles.boostCost}>
              <Text style={styles.boostCostText}>🪙 {b.coins}</Text>
              <TouchableOpacity style={styles.boostBtn} onPress={() => {}}>
                <Text style={styles.boostBtnText}>Boost</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Plans */}
        <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Get coins monthly</Text>
        <Text style={styles.sectionSub}>Subscribe to get coins every month. Cancel anytime.</Text>

        {PLANS.map(plan => (
          <View key={plan.id} style={[styles.planCard, { borderColor: plan.color }]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planCoins}>🪙 {plan.coins} coins / month</Text>
              </View>
              <View style={styles.planPriceWrap}>
                {plan.badge && <Text style={[styles.planBadge, { backgroundColor: plan.color }]}>{plan.badge}</Text>}
                <Text style={styles.planPrice}>{plan.price}<Text style={styles.planPeriod}>{plan.period}</Text></Text>
              </View>
            </View>
            <View style={styles.planPerks}>
              {plan.perks.map(p => (
                <Text key={p} style={styles.perk}>✓  {p}</Text>
              ))}
            </View>
            <TouchableOpacity style={[styles.subscribeBtn, { backgroundColor: plan.color }]} onPress={() => {}}>
              <Text style={styles.subscribeBtnText}>
                {membershipTier === plan.id ? 'Current plan' : 'Subscribe — ' + plan.price + '/mo'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.disclaimer}>
          💳 Payments via GCash / Maya — available in Phase 2. Tap Subscribe to register your interest.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: '#1E3050' },
  backText: { color: '#4A9EFF', fontSize: 15, width: 50 },
  headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  content: { padding: 20 },
  coinsCard: { backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 28 },
  coinsLabel: { color: '#8899AA', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  coinsValue: { color: '#FFFFFF', fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  coinsNote: { color: '#445566', fontSize: 12, marginTop: 8, textAlign: 'center' },
  tierBadge: { marginTop: 12, backgroundColor: '#0F6E56', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 5 },
  tierBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 6 },
  sectionSub: { color: '#8899AA', fontSize: 12, lineHeight: 18, marginBottom: 14 },
  boostRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 12, padding: 14, marginBottom: 10 },
  boostLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  boostDesc: { color: '#8899AA', fontSize: 12, marginTop: 2 },
  boostCost: { alignItems: 'flex-end', gap: 8 },
  boostCostText: { color: '#4A9EFF', fontSize: 14, fontWeight: '800' },
  boostBtn: { backgroundColor: '#4A9EFF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  boostBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  planCard: { backgroundColor: '#111F35', borderWidth: 1.5, borderRadius: 16, padding: 18, marginBottom: 16 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  planName: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  planCoins: { color: '#8899AA', fontSize: 12, marginTop: 4 },
  planPriceWrap: { alignItems: 'flex-end', gap: 6 },
  planBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  planBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },  // unused — inline style used instead
  planPrice: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  planPeriod: { color: '#8899AA', fontSize: 13, fontWeight: '400' },
  planPerks: { gap: 6, marginBottom: 16 },
  perk: { color: '#8899AA', fontSize: 13 },
  subscribeBtn: { borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  subscribeBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  disclaimer: { color: '#445566', fontSize: 11, textAlign: 'center', lineHeight: 18, marginTop: 8 },
});
