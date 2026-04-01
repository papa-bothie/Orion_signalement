import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/ui/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

export const ConfirmationScreen = ({ navigation, route }: Props) => {
    const { reference } = route.params;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Home');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>✅</Text>
                </View>
                <Text style={styles.title}>Signalement envoyé !</Text>
                <Text style={styles.desc}>Votre demande a été transmise avec succès à l'équipe ORION.</Text>

                <View style={styles.refBox}>
                    <Text style={styles.refLabel}>Référence</Text>
                    <Text style={styles.refCode}>{reference}</Text>
                </View>

                <Button label="Retour à l'accueil" onPress={() => navigation.navigate('Home')} />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    iconText: { fontSize: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
    desc: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 32 },
    refBox: { backgroundColor: '#F3F4F6', padding: 20, borderRadius: 12, alignItems: 'center', width: '100%', marginBottom: 32 },
    refLabel: { color: '#6B7280', fontSize: 14, marginBottom: 4 },
    refCode: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2 }
});
