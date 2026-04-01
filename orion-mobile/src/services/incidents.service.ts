import { Incident } from '../types';
import { StorageService } from './storage.service';

export const IncidentService = {
    createIncident: async (data: Partial<Incident>): Promise<Incident> => {
        const newIncident: Incident = {
            ...data,
            id: Date.now().toString(),
            status: 'PENDING',
            createdAt: new Date().toISOString()
        } as Incident;

        const existingList = await StorageService.getJson<Incident[]>('reports') || [];
        await StorageService.setJson('reports', [newIncident, ...existingList]);

        // Simulate API latency
        return new Promise((resolve) => setTimeout(() => resolve(newIncident), 1000));
    },

    getUserIncidents: async (userId?: string): Promise<Incident[]> => {
        const existingList = await StorageService.getJson<Incident[]>('reports') || [];
        return new Promise((resolve) => setTimeout(() => resolve(existingList), 500));
    },
};
