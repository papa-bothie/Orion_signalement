import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
    setJson: async (key: string, value: unknown): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(`@orion_${key}`, jsonValue);
        } catch (error) {
            console.error(`Erreur de sauvegarde Storage: ${key}`, error);
        }
    },

    getJson: async <T>(key: string): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(`@orion_${key}`);
            return jsonValue != null ? JSON.parse(jsonValue) as T : null;
        } catch (error) {
            console.error(`Erreur de lecture Storage: ${key}`, error);
            return null;
        }
    },

    remove: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(`@orion_${key}`);
        } catch (error) {
            console.error(`Erreur de suppression Storage: ${key}`, error);
        }
    }
};
