import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/ui/Button';
import { IncidentService } from '../services/incidents.service';
import { Incident } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

export const ReportScreen = ({ navigation }: Props) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Pour le PoC on force quelques valeurs par défaut
    const handleSubmit = async () => {
        if (!description || !location) return;
        setIsLoading(true);

        try {
            const incident = await IncidentService.createIncident({
                type: 'OTHER',
                urgency: 'NON_URGENT',
                description,
                location
            });

            navigation.replace('Confirmation', {
                incidentId: incident.id,
                reference: `ORN-${incident.id.substring(0, 6).toUpperCase()}`
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Nouveau signalement</Text>

                <Text style={styles.label}>Où êtes-vous ?</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Stade de Dakar..."
                    value={location}
                    onChangeText={setLocation}
                />

                <Text style={styles.label}>Que se passe-t-il ?</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Décrivez l'incident..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                <Button
                    label="Envoyer le signalement"
                    variant="danger"
                    isLoading={isLoading}
                    onPress={handleSubmit}
                />
                <Button
                    label="Annuler"
                    variant="secondary"
                    onPress={() => navigation.goBack()}
                />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { paddingVertical: 40 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#111827' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#374151' },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontSize: 16
    },
    textArea: { height: 120, textAlignVertical: 'top' }
});
