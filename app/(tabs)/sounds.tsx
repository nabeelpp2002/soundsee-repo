import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Switch, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const SUPPORTED_SOUNDS = [
  { id: '1', key: 'fire_alarm', label: 'Fire Alarm', icon: 'flame', color: '#FF6B6B' },
  { id: '2', key: 'baby_cry', label: 'Baby Crying', icon: 'happy', color: '#4ECDC4' }, // 'happy' for baby face
  { id: '3', key: 'glass_shatter', label: 'Glass Shatter', icon: 'wine', color: '#45B7D1' }, // 'wine' as proxy for glass
  { id: '4', key: 'ambulance', label: 'Ambulance', icon: 'medkit', color: '#FFCC5C' },
  { id: '5', key: 'doorbell', label: 'Doorbell', icon: 'notifications', color: '#96CEB4' },
  { id: '6', key: 'dog_bark', label: 'Dog Barking', icon: 'paw', color: '#FFEEAD' },
];

type SoundItemProps = {
  item: any;
  isMuted: boolean;
  onToggle: (key: string) => void;
};

const SoundItem = ({ item, isMuted, onToggle }: SoundItemProps) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={24} color="white" />
      </View>
      <Text style={styles.soundLabel}>{item.label}</Text>
    </View>
    <Switch
      value={!isMuted}
      onValueChange={() => onToggle(item.key)}
      trackColor={{ false: "#ccc", true: "#6a5acd" }}
      thumbColor={"white"}
    />
  </View>
);

export default function SoundsScreen() {
  const { user, updateUser } = useAuth();
  const [mutedSounds, setMutedSounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.preferences?.muted_sounds) {
      setMutedSounds(user.preferences.muted_sounds);
    }
  }, [user]);

  const handleToggleSound = async (soundKey: string) => {
    if (!user) return;

    const isCurrentlyMuted = mutedSounds.includes(soundKey);
    let newMutedSounds;

    if (isCurrentlyMuted) {
      // Unmute
      newMutedSounds = mutedSounds.filter(k => k !== soundKey);
    } else {
      // Mute
      newMutedSounds = [...mutedSounds, soundKey];
    }

    // Optimistic update
    setMutedSounds(newMutedSounds);

    try {
      const newPreferences = { ...user.preferences, muted_sounds: newMutedSounds };
      await userService.updatePreferences(Number(user.id), newPreferences);
      await updateUser({ ...user, preferences: newPreferences });
    } catch (error) {
      console.error("Failed to update preferences", error);
      Alert.alert("Error", "Failed to save settings");
      // Revert
      setMutedSounds(mutedSounds);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sound Settings</Text>
        <Text style={styles.headerSubtitle}>Manage notifications for specific sounds</Text>
      </View>

      <FlatList
        data={SUPPORTED_SOUNDS}
        renderItem={({ item }) => (
          <SoundItem
            item={item}
            isMuted={mutedSounds.includes(item.key)}
            onToggle={handleToggleSound}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  soundLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});