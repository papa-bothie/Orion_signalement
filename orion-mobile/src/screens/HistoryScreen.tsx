import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { IncidentService } from '../services/incidents.service';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export const HistoryScreen = ({ navigation }: Props) => {
    const { data: incidents, isLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: () => IncidentService.getUserIncidents(),
    });

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mes signalements</Text>
                </View>

                {isLoading ? (
                    <Text style={styles.empty}>Chargement de l'historique...</Text>
                ) : !incidents || incidents.length === 0 ? (
                    <Text style={styles.empty}>Aucun signalement pour le moment.</Text>
                ) : (
                    <FlatList
                        data={incidents}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.type}>Type: {item.type}</Text>
                                    <Text style={styles.status(item.status)}>{item.status}</Text>
                                </View>
                                <Text style={styles.location}>📍 {item.location || 'Localisation inconnue'}</Text>
                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString('fr-FR')}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingVertical: 20, borderBottomWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 40, color: '#6B7280', fontSize: 16 },
    list: { paddingBottom: 20 },
    card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    type: { fontWeight: 'bold', fontSize: 16 },
    status: (status: string) => ({
        fontSize: 12, fontWeight: 'bold', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
        backgroundColor: status === 'PENDING' ? '#FDE047' : '#D1FAE5',
        color: status === 'PENDING' ? '#854D0E' : '#065F46'
    }),
    location: { color: '#4B5563', marginBottom: 4 },
    date: { color: '#9CA3AF', fontSize: 12 }
});
