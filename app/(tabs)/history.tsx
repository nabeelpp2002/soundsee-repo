import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { soundService } from '../services/api';

const HistoryItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
      <Ionicons name={item.icon} size={24} color="white" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.soundName}>{item.sound}</Text>
      <Text style={styles.timestamp}>{item.date} • {item.time}</Text>
    </View>
    <View style={styles.confidenceContainer}>
      <Text style={styles.confidenceLabel}>Confidence</Text>
      <Text style={styles.confidenceValue}>{item.confidence}</Text>
    </View>
  </View>
);

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Backend returns: [{ id, sound_label, confidence, timestamp }]
        const data = await soundService.getHistory(user.id);

        // Map backend data to UI format
        const formattedData = data.map((item: any) => ({
          id: item.id.toString(),
          sound: item.sound_label,
          // Format date/time locally
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.timestamp).toLocaleDateString(),
          confidence: `${(item.confidence * 100).toFixed(0)}%`,
          icon: getIconForSound(item.sound_label),
          color: getColorForSound(item.sound_label)
        }));
        setHistoryData(formattedData);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  // Helper helpers
  const getIconForSound = (sound: string) => {
    const s = sound ? sound.toLowerCase() : '';
    if (s.includes('door')) return 'notifications';
    if (s.includes('dog')) return 'paw';
    if (s.includes('car')) return 'car';
    if (s.includes('baby')) return 'happy';
    if (s.includes('fire')) return 'warning';
    return 'easel'; // default
  };

  const getColorForSound = (sound: string) => {
    const s = sound || '';
    // Generate consistent color based on string
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFCC5C', '#FFEEAD'];
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerSubtitle}>Recent sound detections</Text>
      </View>

      <FlatList
        data={historyData}
        renderItem={({ item }) => <HistoryItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6a5acd']} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#888' }}>No sounds detected yet.</Text>
            </View>
          ) : null
        }
      />
      {loading && !refreshing && (
        <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -20 }}>
          <ActivityIndicator size="large" color="#6a5acd" />
        </View>
      )}
    </View>
  );
};

export default HistoryScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#6a5acd',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100, // Space for tab bar
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
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a5acd',
  },
});