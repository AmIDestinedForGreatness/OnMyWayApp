import {
  StyleSheet, View, Text, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';

const AUTO_RESPONSES = {
  1: {
    greeting: "Hi! Thanks for checking out the Tagaytay cabin 🏔️ It's got a great Taal view and the fireplace is perfect for cold nights. What dates are you looking at?",
    responses: [
      "Available pa! Just send me your check-in and check-out dates and I'll confirm right away.",
      "The cabin fits up to 4 guests comfortably. Kitchen is fully stocked and WiFi is solid — around 50mbps.",
      "Minimum 2 nights po. Check-in is 2pm, check-out 12nn. Early check-in possible if available!",
      "No hidden fees — what you see is the nightly rate. Just message me when you're ready to book!",
    ],
  },
  2: {
    greeting: "Hi po! Salamat for messaging. The BGC condo is available for staycation — 28th floor, city view talaga. What dates po kayo?",
    responses: [
      "Available pa po! Pwede mag-check-in this week or weekend.",
      "Netflix, WiFi, pool access — lahat included sa rate. No extra charges po.",
      "Yes po, good for 2 guests. Good for couples or barkada ng dalawa lang 😊",
      "Just send me the dates at i-confirm ko agad. Looking forward to hosting you!",
    ],
  },
  3: {
    greeting: "Hello! Thank you for your interest in the Baguio bungalow. It's a quiet pine forest retreat — perfect for rest and reset. How can I help you?",
    responses: [
      "The property is available for your chosen dates. Please send them over and I will confirm promptly.",
      "The bungalow accommodates up to 6 guests. All bedrooms have thick blankets — Baguio nights can get cold!",
      "Check-in is at 2pm. The property is fully prepared and check-in ready for every booking.",
      "I am happy to answer any questions. Just let me know your preferred dates and I will take care of the rest.",
    ],
  },
  4: {
    greeting: "Hey! 👋 La Union beachfront studio here — wala pang ibang naka-book this weekend! What dates are you eyeing?",
    responses: [
      "Available pa! Grab it na before may kumuha 🏄",
      "Yup, beach access is right outside the door. WiFi medyo okay — good enough for WFH or streaming!",
      "Good for 2 guests. Super chill vibe, perfect for a quick escape from the city 🌊",
      "Just drop your dates and I'll confirm agad. See you soon!",
    ],
  },
  5: {
    greeting: "Good day! Thank you for your interest in the Batangas villa. This is a premium private property with a pool — ideal for group getaways. How may I assist you?",
    responses: [
      "The villa is available. Kindly send your preferred dates and number of guests so I can confirm availability.",
      "The property accommodates up to 12 guests. The private pool, outdoor BBQ, and full kitchen are all included.",
      "Minimum stay is 2 nights. The villa is fully serviced and check-in ready for every booking.",
      "I am available to answer any questions. This is one of our most popular weekend retreat properties.",
    ],
  },
  6: {
    greeting: "Hi! Glamping tent available. Message me for dates 🏕️",
    responses: [
      "Available. What dates?",
      "Good for 2. Breakfast included.",
      "Yes, check-in 3pm. Check-out 11am.",
      "Sige, send dates ko na i-confirm.",
    ],
  },
};

export default function ChatScreen({ route, navigation }) {
  const { property, checkIn, checkOut, nights } = route.params;
  const host = property.seller;
  const hostResponses = AUTO_RESPONSES[property.id] || AUTO_RESPONSES[1];

  const buildBookingMessage = () => {
    if (!checkIn || !checkOut || !nights) return '';
    const inDate = new Date(checkIn).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    const outDate = new Date(checkOut).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
    const total = (nights * property.pricePerNight).toLocaleString();
    return `Hi! I'd like to book from ${inDate} to ${outDate} (${nights} night${nights !== 1 ? 's' : ''}) — ₱${total} total. Is it available?`;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'host',
      text: hostResponses.greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState(buildBookingMessage);
  const [responseIndex, setResponseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [hostReplyCount, setSellerReplyCount] = useState(0);
  const scrollRef = useRef(null);

  const canUseOMW = userMessageCount >= 1 && hostReplyCount >= 1;

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setUserMessageCount((c) => c + 1);
    setIsTyping(true);

    setTimeout(() => {
      const reply = hostResponses.responses[responseIndex % hostResponses.responses.length];
      const hostMsg = {
        id: Date.now() + 1,
        sender: 'host',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, hostMsg]);
      setResponseIndex((i) => i + 1);
      setSellerReplyCount((c) => c + 1);
      setIsTyping(false);
    }, 1500);
  };

  const triggerOMW = () => {
    navigation.navigate('Map', { startNavigation: property });
  };

  // Simplified back: skip the modal stack, go straight to Home
  const handleBack = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>
            {host.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{host.name}</Text>
          <View style={styles.headerStatus}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerStatusText}>Online now</Text>
          </View>
        </View>
      </View>

      <View style={styles.propBanner}>
        <View style={[styles.propIcon, { backgroundColor: property.type === 'rent' ? '#0F6E56' : '#185FA5' }]}>
          <Text style={{ fontSize: 18 }}>🏠</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.propTitle} numberOfLines={1}>{property.title}</Text>
          <Text style={styles.propPrice}>{property.price}</Text>
        </View>
        {canUseOMW ? (
          <TouchableOpacity style={styles.compactOmw} onPress={triggerOMW}>
            <View style={styles.compactOmwPlay}>
              <View style={styles.triangle} />
            </View>
            <View>
              <Text style={styles.compactOmwText}>OMW!</Text>
              <Text style={styles.compactOmwSub}>Directions</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.propAddrWrap}>
            <Text style={styles.propAddr} numberOfLines={2}>{property.address}</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.msgRow, msg.sender === 'user' ? styles.msgRowUser : styles.msgRowSeller]}
            >
              <View
                style={[
                  styles.msgBubble,
                  msg.sender === 'user' ? styles.msgBubbleUser : styles.msgBubbleSeller,
                ]}
              >
                <Text style={msg.sender === 'user' ? styles.msgTextUser : styles.msgTextSeller}>
                  {msg.text}
                </Text>
                <Text style={msg.sender === 'user' ? styles.msgTimeUser : styles.msgTimeSeller}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.msgRow, styles.msgRowSeller]}>
              <View style={[styles.msgBubble, styles.msgBubbleSeller, styles.typingBubble]}>
                <View style={styles.typingDot} />
                <View style={[styles.typingDot, { marginLeft: 4 }]} />
                <View style={[styles.typingDot, { marginLeft: 4 }]} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#445566"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: '#1E3050', gap: 10 },
  backBtn: { paddingHorizontal: 6 },
  backText: { color: '#4A9EFF', fontSize: 24, fontWeight: '600' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111F35', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E3050' },
  headerAvatarText: { color: '#4A9EFF', fontSize: 14, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  headerStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#1D9E75' },
  headerStatusText: { color: '#8899AA', fontSize: 11 },
  propBanner: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#111F35', borderBottomWidth: 1, borderBottomColor: '#1E3050', gap: 10 },
  propIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  propTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  propPrice: { color: '#4A9EFF', fontSize: 13, fontWeight: '700', marginTop: 2 },
  propAddrWrap: { maxWidth: 110 },
  propAddr: { color: '#8899AA', fontSize: 10, textAlign: 'right' },
  compactOmw: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#CC0000', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 22, gap: 8 },
  compactOmwPlay: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  triangle: { width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderLeftWidth: 8, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#FFFFFF', marginLeft: 2 },
  compactOmwText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  compactOmwSub: { color: 'rgba(255,255,255,0.85)', fontSize: 9, marginTop: -1 },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, gap: 10 },
  msgRow: { flexDirection: 'row' },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowSeller: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  msgBubbleUser: { backgroundColor: '#185FA5', borderBottomRightRadius: 4 },
  msgBubbleSeller: { backgroundColor: '#111F35', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#1E3050' },
  msgTextUser: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  msgTextSeller: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  msgTimeUser: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 4, textAlign: 'right' },
  msgTimeSeller: { color: '#445566', fontSize: 10, marginTop: 4 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4A9EFF' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, gap: 10, borderTopWidth: 1, borderTopColor: '#1E3050', backgroundColor: '#0A1628' },
  input: { flex: 1, backgroundColor: '#111F35', borderWidth: 1, borderColor: '#1E3050', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: '#FFFFFF', fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#4A9EFF', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#1E3050' },
  sendBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});
