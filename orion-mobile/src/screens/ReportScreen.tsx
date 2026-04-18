import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ScreenWrapper } from '../components/shared/ScreenWrapper';
import { Button } from '../components/ui/Button';
import { IncidentService } from '../services/incidents.service';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

export const ReportScreen = ({ navigation }: Props) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState<number | undefined>();
    const [longitude, setLongitude] = useState<number | undefined>();
    
    // Nouveaux champs
    const [type, setType] = useState<'SECURITY' | 'MEDICAL' | 'TECHNICAL' | 'LOGISTICS' | 'OTHER'>('OTHER');
    const [isUrgent, setIsUrgent] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | undefined>();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    // Fonction pour détecter la postion
    const detectLocation = async () => {
        setIsDetecting(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Impossible d'accéder à la localisation.");
                setIsDetecting(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLatitude(loc.coords.latitude);
            setLongitude(loc.coords.longitude);
            setLocation(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)} (Détecté automatiquement)`);
        } catch (error) {
            Alert.alert("Erreur", "La détection a échoué.");
            console.error(error);
        } finally {
            setIsDetecting(false);
        }
    };

    // Fonction pour prendre une photo
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setPhotoUrl(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!description || (!location && !latitude)) {
             Alert.alert("Erreur", "La description et la localisation sont obligatoires.");
             return;
        }
        setIsLoading(true);

        try {
            const incident = await IncidentService.createIncident({
                type,
                urgency: isUrgent ? 'URGENT' : 'NON_URGENT',
                description,
                location,
                latitude,
                longitude,
                photoUrl
            });

            navigation.replace('Confirmation', {
                incidentId: incident.id,
                reference: incident.reference || `ORN-${incident.id.substring(0, 6).toUpperCase()}`
            });
        } catch (e) {
            console.error(e);
            Alert.alert("Erreur", "L'envoi a échoué.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Nouveau signalement</Text>

                <Text style={styles.label}>Type d'incident</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue)}
                    >
                        <Picker.Item label="Technique" value="TECHNICAL" />
                        <Picker.Item label="Sécurité" value="SECURITY" />
                        <Picker.Item label="Médical" value="MEDICAL" />
                        <Picker.Item label="Logistique" value="LOGISTICS" />
                        <Picker.Item label="Autre" value="OTHER" />
                    </Picker>
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.label}>Niveau Critique / Urgent ?</Text>
                    <Switch
                        value={isUrgent}
                        onValueChange={setIsUrgent}
                        trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
                    />
                </View>

                <Text style={styles.label}>Où êtes-vous ?</Text>
                <View style={styles.locationRow}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8 }]}
                        placeholder="Ex: Stade de Dakar..."
                        value={location}
                        onChangeText={setLocation}
                    />
                    <TouchableOpacity style={styles.detectBtn} onPress={detectLocation}>
                        <Text style={styles.detectBtnText}>{isDetecting ? "..." : "GPS"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }} />

                <Text style={styles.label}>Que se passe-t-il ? (Description)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Décrivez l'incident en détail..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Preuve visuelle (Optionnel)</Text>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Text style={styles.imageButtonText}>+ Ajouter une photo</Text>
                </TouchableOpacity>
                {photoUrl && (
                    <Image source={{ uri: photoUrl }} style={styles.imagePreview} />
                )}

                <View style={{ marginTop: 20 }}>
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
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: { paddingVertical: 40, paddingHorizontal: 16 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
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
    pickerContainer: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        marginBottom: 20,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detectBtn: {
        backgroundColor: '#1E3A8A',
        padding: 14,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detectBtnText: { color: '#FFF', fontWeight: 'bold' },
    textArea: { height: 120, textAlignVertical: 'top' },
    imageButton: {
        backgroundColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#9CA3AF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    imageButtonText: {
        color: '#4B5563',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    }
});
