import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ScreenWrapper = ({ children, noPadding = false }: { children: ReactNode, noPadding?: boolean }) => {
    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
            <KeyboardAvoidingView
                style={[styles.container, !noPadding && styles.paddedContainer]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { flex: 1 },
    paddedContainer: { paddingHorizontal: 16 }
});
