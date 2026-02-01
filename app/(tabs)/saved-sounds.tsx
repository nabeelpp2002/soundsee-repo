import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const savedSounds = [
    { id: '1', name: 'Doorbell', category: 'Household', date: '2023-10-25' },
    { id: '2', name: 'Baby Crying', category: 'Human', date: '2023-10-24' },
    { id: '3', name: 'Fire Alarm', category: 'Emergency', date: '2023-10-20' },
    { id: '4', name: 'Dog Barking', category: 'Animals', date: '2023-10-18' },
];

export default function SavedSounds() {
    const router = useRouter();

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.iconContainer}>
                <Ionicons name="bookmark" size={24} color="#6a5acd" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.soundName}>{item.name}</Text>
                <Text style={styles.soundCategory}>{item.category} • Saved on {item.date}</Text>
            </View>
            <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#999" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Sounds</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={savedSounds}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bookmark-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No saved sounds yet</Text>
                    </View>
                }
            />
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
    listContent: {
        padding: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    soundName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    soundCategory: {
        fontSize: 14,
        color: '#888',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 20,
        fontSize: 18,
        color: '#999',
    },
});
