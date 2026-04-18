import { Incident } from '../types';
import { StorageService } from './storage.service';
import { apiClient } from './api';

const typeMap: Record<string, string> = {
    'SECURITY': 'SECURITE',
    'MEDICAL': 'MEDICAL',
    'TECHNICAL': 'TECHNIQUE',
    'LOGISTICS': 'LOGISTIQUE',
    'OTHER': 'AUTRE'
};

const urgencyMap: Record<string, string> = {
    'URGENT': 'HAUTE',
    'NON_URGENT': 'BASSE'
};

export const IncidentService = {
    createIncident: async (data: Partial<Incident>): Promise<Incident> => {
        try {
            // Mappe les propriétés de l'Application Mobile vers le Backend (CreateIncidentDto)
            const payload = {
                description: data.description || 'Description non fournie',
                type: data.type ? (typeMap[data.type] || 'AUTRE') : 'AUTRE',
                urgence: data.urgency ? (urgencyMap[data.urgency] || 'BASSE') : 'BASSE',
                // Coordonnées détectées ou Dakar par défaut
                latitude: data.latitude ?? 14.6928, 
                longitude: data.longitude ?? -17.4467,
                adresse: data.location || 'Localisation non précisée',
                mediaUrl: data.photoUrl || undefined,
            };

            // Envoi au backend
            const response = await apiClient.post('/incidents', payload);
            const createdIncident = response.data.incident;

            // Formatte le retour pour le fonctionnement mobile
            const newIncident: Incident = {
                ...data,
                id: createdIncident?.id || Date.now().toString(),
                reference: response.data.reference || createdIncident?.reference,
                status: 'PENDING',
                createdAt: createdIncident?.createdAt || new Date().toISOString()
            } as Incident;

            // Sauvegarde dans l'historique local pour l'utilisateur
            const existingList = await StorageService.getJson<Incident[]>('reports') || [];
            await StorageService.setJson('reports', [newIncident, ...existingList]);

            return newIncident;
        } catch (error: any) {
            console.error('Erreur API lors de la création du signalement :', error.response?.data || error.message);
            throw error;
        }
    },

    getUserIncidents: async (userId?: string): Promise<Incident[]> => {
        // En attendant de connecter la route GET /incidents sur le backend (qui demandera les filtres)
        // on peut conserver le renvoi depuis l'historique local pour l'APP Mobile
        const existingList = await StorageService.getJson<Incident[]>('reports') || [];
        return existingList;
    },
};
