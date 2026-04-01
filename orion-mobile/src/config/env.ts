import Constants from 'expo-constants';

export const CONFIG = {
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.orion.sn/v1',
    IS_PRODUCTION: process.env.EXPO_PUBLIC_APP_ENV === 'production',
    SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'https://ws.orion.sn',
};
