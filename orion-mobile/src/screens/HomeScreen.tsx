import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/ui/Button';
import { AlertCircle, MessageSquare } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>ORION</Text>
                    <Text style={styles.subtitle}>Signalez. Protégez. Coordonnez.</Text>
                    <Text style={styles.caption}>JOJ 2026 - Sénégal</Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        label="Signaler un incident"
                        variant="danger"
                        onPress={() => navigation.navigate('Report')}
                    />
                    <Button
                        label="Discuter avec ORION (IA)"
                        variant="primary"
                        onPress={() => navigation.navigate('AIChat')}
                    />
                </View>

                <Button
                    label="Voir mes signalements"
                    variant="secondary"
                    onPress={() => navigation.navigate('History')}
                />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    header: { alignItems: 'center', marginBottom: 60 },
    title: { fontSize: 48, fontWeight: '900', color: '#1E3A8A' },
    subtitle: { fontSize: 18, color: '#4B5563', marginTop: 10 },
    caption: { fontSize: 14, color: '#9CA3AF', marginTop: 5 },
    actions: { marginBottom: 30 }
});
