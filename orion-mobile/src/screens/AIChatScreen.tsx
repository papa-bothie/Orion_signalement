import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { AIService } from '../services/ai.service';
import { Message, Incident } from '../types';
import { IncidentService } from '../services/incidents.service';

type Props = NativeStackScreenProps<RootStackParamList, 'AIChat'>;

export const AIChatScreen = ({ navigation }: Props) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Bonjour ! Que souhaitez-vous signaler ?", sender: 'ai', timestamp: new Date().toISOString() }
    ]);
    const [text, setText] = useState('');
    const [draft, setDraft] = useState<Partial<Incident>>({});
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        if (!text.trim()) return;
        const userText = text;
        setText('');

        const newMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user', timestamp: new Date().toISOString() };
        const newHistory = [...messages, newMsg];
        setMessages(newHistory);
        setIsTyping(true);

        const aiRes = await AIService.analyzeUserMessage(userText, newHistory);

        if (aiRes.extractedData) {
            setDraft(prev => ({ ...prev, ...aiRes.extractedData }));
        }

        const aiMsg: Message = { id: Date.now().toString(), text: aiRes.messageText, sender: 'ai', timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);

        if (aiRes.isComplete) {
            setTimeout(async () => {
                const incident = await IncidentService.createIncident({
                    ...draft,
                    description: "Signalement via IA"
                });
                navigation.replace('Confirmation', { incidentId: incident.id, reference: `ORN-${incident.id.substring(0, 6).toUpperCase()}` });
            }, 1500);
        }
    };

    return (
        <ScreenWrapper noPadding>
            <View style={styles.container}>
                <View style={styles.header}><Text style={styles.headerText}>ORION AI</Text></View>

                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.chatArea}
                    renderItem={({ item }) => (
                        <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                            <Text style={styles.bubbleText(item.sender)}>{item.text}</Text>
                        </View>
                    )}
                />

                {isTyping && <Text style={styles.typing}>ORION écrit...</Text>}

                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Écrivez ici..."
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Text style={styles.sendText}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { padding: 16, backgroundColor: '#1E3A8A', alignItems: 'center' },
    headerText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    chatArea: { padding: 16, gap: 12 },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#E5E7EB' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#3B82F6' },
    bubbleText: (sender: string) => ({ color: sender === 'user' ? '#1F2937' : '#FFF', fontSize: 16 }),
    typing: { paddingHorizontal: 16, color: '#6B7280', fontStyle: 'italic', marginBottom: 8 },
    inputArea: { flexDirection: 'row', padding: 8, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E5E7EB' },
    input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, fontSize: 16, height: 40 },
    sendBtn: { justifyContent: 'center', paddingHorizontal: 16 },
    sendText: { color: '#2563EB', fontWeight: 'bold', fontSize: 16 }
});
