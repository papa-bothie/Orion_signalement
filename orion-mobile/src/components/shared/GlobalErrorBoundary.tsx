import React, { ErrorInfo } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export class GlobalErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; errorMsg: string }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, errorMsg: '' };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, errorMsg: error.message };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("CRASH DÉTECTÉ :", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oups ! Une erreur ORION</Text>
                    <Text style={styles.msg}>{this.state.errorMsg}</Text>
                    <Button title="Relancer l'application" onPress={() => this.setState({ hasError: false })} />
                </View>
            );
        }
        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E40AF', marginBottom: 10 },
    msg: { color: 'red', textAlign: 'center', marginBottom: 20 }
});
