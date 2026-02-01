import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const faqs = [
    {
        question: 'How does SoundSee work?',
        answer: 'SoundSee uses advanced AI to listen to your surroundings and identify sounds. It then notifies you with visual alerts and vibrations.'
    },
    {
        question: 'Does it work offline?',
        answer: 'Yes, SoundSee is designed to work offline for core sound recognition features, ensuring you are always connected to your environment.'
    },
    {
        question: 'Can I customize the alerts?',
        answer: 'Absolutely! You can customize vibration patterns, flash alerts, and notification styles in the settings menu.'
    },
    {
        question: 'Is my privacy protected?',
        answer: 'Privacy is our top priority. Audio is processed locally on your device whenever possible and is never stored permanently without your permission.'
    },
];

export default function HelpSupport() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Text style={styles.answer}>{faq.answer}</Text>
                    </View>
                ))}

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Still need help?</Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Ionicons name="mail-outline" size={24} color="white" />
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    faqItem: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    answer: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    contactSection: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#6a5acd',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 15,
        elevation: 3,
    },
    contactButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
});
