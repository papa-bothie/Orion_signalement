import { Message, Incident } from '../types';

interface AIResponse {
    messageText: string;
    extractedData?: Partial<Incident>;
    isComplete: boolean;
}

export const AIService = {
    analyzeUserMessage: async (
        userText: string,
        conversationHistory: Message[]
    ): Promise<AIResponse> => {
        // Simulation réseau (1.5s)
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerMessage = userText.toLowerCase();
        let extracted: Partial<Incident> = {};
        let responseText = "Pouvez-vous m'en dire plus ?";
        let isComplete = false;

        // Logique Mock Mots-Clés
        if (lowerMessage.includes('accident') || lowerMessage.includes('blessé') || lowerMessage.includes('medical') || lowerMessage.includes('santé')) {
            extracted = { type: 'MEDICAL', urgency: 'URGENT' };
            responseText = "⚠️ Urgence médicale détectée ! Pouvez-vous me préciser le lieu exact ?";
        } else if (lowerMessage.includes('vol') || lowerMessage.includes('danger') || lowerMessage.includes('sécurité') || lowerMessage.includes('suspect')) {
            extracted = { type: 'SECURITY', urgency: 'URGENT' };
            responseText = "D'accord, incident de sécurité. Quel est le lieu ?";
        } else if (lowerMessage.includes('panne') || lowerMessage.includes('technique')) {
            extracted = { type: 'TECHNICAL' };
            responseText = "Compris, incident technique. Où vous trouvez-vous ?";
        } else if (lowerMessage.includes('logistique')) {
            extracted = { type: 'LOGISTICS' };
            responseText = "C'est noté pour le problème logistique. Quel est l'endroit ?";
        }

        if (lowerMessage.includes('urgent') || lowerMessage.includes('grave') || lowerMessage.includes('vite')) {
            extracted.urgency = 'URGENT';
        }

        // Checking if we have enough info in mock
        if (conversationHistory.length > 2 && (lowerMessage.includes('oui') || lowerMessage.includes('confirme'))) {
            responseText = "Votre signalement a été transmis avec succès. L'équipe ORION est prévenue.";
            isComplete = true;
        } else if (conversationHistory.length === 2 && !isComplete) {
            responseText = "Je localise l'endroit. Confirmez-vous ? (Oui/Non)";
        }

        return {
            messageText: responseText,
            extractedData: extracted,
            isComplete: isComplete,
        };
    }
};
