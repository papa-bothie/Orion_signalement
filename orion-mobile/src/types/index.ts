export type IncidentStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'CANCELLED';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: 'CITIZEN' | 'AGENT' | 'ADMIN';
    phone?: string;
    createdAt: string;
}

export interface Incident {
    id: string;
    reference?: string;
    type: 'SECURITY' | 'MEDICAL' | 'TECHNICAL' | 'LOGISTICS' | 'OTHER';
    urgency: 'URGENT' | 'NON_URGENT';
    location: string;
    latitude?: number;
    longitude?: number;
    description: string;
    photoUrl?: string;
    status: IncidentStatus;
    reporterId?: string;
    assignedAgentId?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    internalState?: {
        detectedType?: string;
        detectedUrgency?: string;
    };
}
