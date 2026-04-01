import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
    label: string;
    onPress: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ label, onPress, isLoading, variant = 'primary' }: ButtonProps) => {
    const isPrimary = variant === 'primary';
    const isDanger = variant === 'danger';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            activeOpacity={0.8}
            style={[
                styles.baseBtn,
                isPrimary ? styles.primaryBtn : (isDanger ? styles.dangerBtn : styles.secondaryBtn)
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={isPrimary || isDanger ? '#FFF' : '#333'} />
            ) : (
                <Text style={[styles.text, isPrimary || isDanger ? styles.textPrimary : styles.textSecondary]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginVertical: 8 },
    primaryBtn: { backgroundColor: '#1E40AF' },
    dangerBtn: { backgroundColor: '#DC2626' },
    secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D5DB' },
    text: { fontSize: 16, fontWeight: 'bold' },
    textPrimary: { color: 'white' },
    textSecondary: { color: '#1F2937' }
});
