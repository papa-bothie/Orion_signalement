import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { AIChatScreen } from '../screens/AIChatScreen';
import { ConfirmationScreen } from '../screens/ConfirmationScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen
                name="Confirmation"
                component={ConfirmationScreen}
                options={{ gestureEnabled: false, animation: 'fade' }}
            />
            <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
    );
};
