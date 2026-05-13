import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styles/colors';
import { sendMessage } from '../../services/chatbotService';
import { useAuth } from '../../context/AuthContext';

const INITIAL_MSG = {
    id: '0',
    role: 'bot',
    text: "Hi! I'm MedAI 🤖 – your personal health assistant. Ask me about diabetes, heart disease, or your health score!",
};

export default function ChatbotScreen() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([INITIAL_MSG]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const flatRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Web Speech API for desktop use
    useEffect(() => {
        if (Platform.OS === 'web') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => setIsRecording(true);
                recognition.onend = () => setIsRecording(false);
                recognition.onerror = () => setIsRecording(false);
                
                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        transcript += event.results[i][0].transcript;
                    }
                    setInput(transcript);
                };
                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleRecording = () => {
        if (Platform.OS !== 'web' || !recognitionRef.current) {
            Alert.alert('Microphone', 'Speech recognition is currently optimized for Web browers (Chrome/Edge).');
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setInput('');
            recognitionRef.current.start();
        }
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: Date.now().toString(), role: 'user', text };
        setMessages((m) => [...m, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const reply = await sendMessage(text, user?.id);
            const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: reply };
            setMessages((m) => [...m, botMsg]);
        } catch {
            setMessages((m) => [
                ...m,
                { id: (Date.now() + 1).toString(), role: 'bot', text: '⚠️ Network error. Please check your connection.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
            {item.role === 'bot' && (
                <View style={styles.botAvatar}>
                    <Text style={{ fontSize: 14 }}>🤖</Text>
                </View>
            )}
            <View style={[styles.bubbleInner, item.role === 'user' ? styles.userInner : styles.botInner]}>
                <Text style={[styles.bubbleText, item.role === 'user' && { color: COLORS.white }]}>
                    {item.text}
                </Text>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.botAvatarLg}>
                    <Text style={{ fontSize: 28 }}>🤖</Text>
                </View>
                <View>
                    <Text style={styles.title}>MedAI Assistant</Text>
                    <Text style={styles.status}>● Online</Text>
                </View>
            </View>

            {/* Chat */}
            <FlatList
                ref={flatRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.chatList}
                onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
            />

            {loading && (
                <View style={styles.typing}>
                    <ActivityIndicator size="small" color={COLORS.accent} />
                    <Text style={styles.typingText}>MedAI is thinking...</Text>
                </View>
            )}

            {/* Input bar */}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder={isRecording ? "Listening..." : "Ask about your health..."}
                    placeholderTextColor={isRecording ? COLORS.danger : COLORS.grey}
                    multiline
                    onSubmitEditing={handleSend}
                    returnKeyType="send"
                />

                {/* Voice Record Button */}
                <TouchableOpacity
                    style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]}
                    onPress={toggleRecording}
                >
                    <Ionicons name="mic" size={18} color={isRecording ? COLORS.white : COLORS.accent} />
                </TouchableOpacity>

                {/* Send Button */}
                <TouchableOpacity
                    style={[styles.sendBtn, !input.trim() && { opacity: 0.4 }]}
                    onPress={handleSend}
                    disabled={!input.trim()}
                >
                    <Ionicons name="send" size={18} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.primary },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.navBg,
        paddingTop: 56,
        paddingBottom: 14,
        paddingHorizontal: 20,
        gap: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.cardBorder,
    },
    botAvatarLg: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: COLORS.accent + '22',
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 17, fontWeight: '700', color: COLORS.white },
    status: { fontSize: 12, color: COLORS.success, marginTop: 2 },
    chatList: { padding: 16, paddingBottom: 8 },
    bubble: { flexDirection: 'row', marginBottom: 12 },
    userBubble: { justifyContent: 'flex-end' },
    botBubble: { justifyContent: 'flex-start', alignItems: 'flex-start' },
    botAvatar: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.accent + '22',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 8, marginTop: 2,
    },
    bubbleInner: { maxWidth: '78%', borderRadius: 16, padding: 12 },
    userInner: { backgroundColor: COLORS.accent, borderBottomRightRadius: 4 },
    botInner: { backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder, borderBottomLeftRadius: 4 },
    bubbleText: { color: COLORS.lightGrey, fontSize: 14, lineHeight: 20 },
    typing: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8, gap: 8 },
    typingText: { color: COLORS.grey, fontSize: 12 },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
        backgroundColor: COLORS.navBg,
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: COLORS.white,
        fontSize: 15,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    sendBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: COLORS.accent,
        justifyContent: 'center', alignItems: 'center',
    },
    voiceBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: COLORS.cardBg,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.accent,
    },
    voiceBtnActive: {
        backgroundColor: COLORS.danger,
        borderColor: COLORS.danger,
    },
});
