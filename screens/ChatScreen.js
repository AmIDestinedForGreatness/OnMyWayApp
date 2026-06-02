import {
  StyleSheet, View, Text, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';

const AUTO_RESPONSES = {
  1: {
    greeting: "Hi! Thanks for your interest in the house. It's a great property near Katipunan — newly renovated with garage and garden. Feel free to ask me anything!",
    responses: [
      "Yes, the property is still available. When would you like to schedule a viewing?",
      "Great question! The house has city water, Meralco electricity, and fiber-ready internet lines.",
      "I'm flexible with viewings — weekends or weekdays after 4pm work best. Let me know what day suits you.",
      "Price is negotiable for serious buyers. Feel free to drop by anytime!",
    ],
  },
  2: {
    greeting: "Hi po! Salamat for messaging. The condo is fully furnished and ready for move-in. Let me know what questions you have!",
    responses: [
      "Still available po! Viewing can be arranged this week.",
      "Utilities ay included na sa rent — water, association dues, pool access.",
      "Yes po, pets are allowed up to 10kg. Additional deposit lang for pet.",
      "Sure, I can show you the unit. Kailan ka free bumisita?",
    ],
  },
  3: {
    greeting: "Hello! Thank you for your interest in our Teachers Village property. This is a well-maintained family home in a quiet, secure neighborhood.",
    responses: [
      "Yes, the property is currently available. I'd be happy to arrange a viewing at your convenience.",
      "The lot is 200 sqm with floor area of 120 sqm across two floors. All bedrooms have built-in closets.",
      "Clean title, updated tax declarations. Ready for immediate transfer upon closing.",
      "I can meet you there today or tomorrow. Just let me know your preferred time.",
    ],
  },
  4: {
    greeting: "Hey! Thanks for reaching out 😊 The studio is perfect if you're a student or young professional near UP. Lemme know what you wanna know!",
    responses: [
      "Yes available pa! Ready for move-in this week.",
      "Yup utilities included — wifi, water, electricity. No hidden fees!",
      "Hehe sige I can give you a virtual tour first if you want, or you can just drop by. Both ok!",
      "Just let me know when you're coming 🏠 I'll meet you there!",
    ],
  },
  5: {
    greeting: "Good day! I appreciate your interest in our Sikatuna Village property. This is a premium family home in one of QC's most prestigious villages.",
    responses: [
      "The property is available. I'd like to personally accompany you on a viewing to show all the features.",
      "Yes, clean title with all documents ready. I can provide the complete documentation during our meeting.",
      "The village has 24/7 security, clubhouse, and is within walking distance of major schools.",
      "I am available for a viewing this weekend. May I confirm a time that works for you?",
    ],
  },
  6: {
    greeting: "Hi! Condo is still available. Message me anytime for questions 🏠",
    responses: [
      "Still available.",
      "Sure, viewing ok. When?",
      "Yes semi-furnished, aircon included.",
      "Sige, meet tayo sa unit.",
    ],
  },
};

export default function ChatScreen({ route, navigation }) {
  const { property } = route.params;
  const seller = property.seller;
  const sellerResponses = AUTO_RESPONSES[property.id] || AUTO_RESPONSES[1];

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'seller',
      text: sellerResponses.greeting,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [sellerReplyCount, setSellerReplyCount] = useState(0);
  const scrollRef = useRef(null);

  const canUseOMW = userMessageCount >= 1 && sellerReplyCount >= 1;

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
      const reply = sellerResponses.responses[responseIndex % sellerResponses.responses.length];
      const sellerMsg = {
        id: Date.now() + 1,
        sender: 'seller',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sellerMsg]);
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
            {seller.name.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{seller.name}</Text>
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
