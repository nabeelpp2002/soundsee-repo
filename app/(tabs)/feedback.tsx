import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Feedback() {
    const router = useRouter();
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (feedback.trim().length === 0) {
            Alert.alert('Error', 'Please enter your feedback before submitting.');
            return;
        }

        // Here you would typically send the feedback to your backend
        Alert.alert('Thank You', 'We appreciate your feedback!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Feedback</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.description}>
                    We would love to hear your thoughts, suggestions, or report any issues you've encountered.
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Email (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Feedback</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={feedback}
                        onChangeText={setFeedback}
                        placeholder="Tell us what you think..."
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        lineHeight: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 150,
    },
    submitButton: {
        backgroundColor: '#6a5acd',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
