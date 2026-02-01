import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function About() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About SoundSee</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: 'https://placehold.co/400x400/6a5acd/white?text=SoundSee' }}
                        style={styles.logo}
                    />
                    <Text style={styles.appName}>SoundSee</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                <Text style={styles.description}>
                    SoundSee is an innovative application designed to help you visualize the sounds around you.
                    Using advanced AI technology, it identifies and categorizes environmental sounds in real-time,
                    providing accessible visual alerts and haptic feedback.
                </Text>

                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.linkItem}>
                        <Text style={styles.linkText}>Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkItem}>
                        <Text style={styles.linkText}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkItem}>
                        <Text style={styles.linkText}>Open Source Licenses</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.copyright}>
                    © 2024 SoundSee Inc. All rights reserved.
                </Text>
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
        padding: 20,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    version: {
        fontSize: 16,
        color: '#888',
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    linksContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    linkText: {
        fontSize: 16,
        color: '#333',
    },
    copyright: {
        fontSize: 14,
        color: '#999',
        marginBottom: 20,
    },
});
