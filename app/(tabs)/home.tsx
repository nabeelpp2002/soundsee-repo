import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { soundService } from '../services/api';

import { useAuth } from '../context/AuthContext';
import { useAudioClassification } from '../hooks/useAudioClassification';
import TMAudioClassifier from '../components/TMAudioClassifier';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import AudioMLScreen from '../components/AudioMLScreen';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const SoundSeeApp = () => {
  const { user } = useAuth();
  const {
    isProcessing,
    startClassification,
    stopClassification,
    predictions,
    setRealPrediction,
    modelUrl
  } = useAudioClassification();
  const [recordingStatus] = useState(new Animated.Value(0));
  const [modelStatus, setModelStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [modelError, setModelError] = useState<string | null>(null);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Notification permission required', 'Please enable notifications to get sound alerts.');
      }
    })();
  }, []);

  // Effect to handle predictions
  useEffect(() => {
    if (predictions.length > 0 && isProcessing) {
      handlePrediction(predictions[0]);
    }
  }, [predictions, isProcessing]);

  const handlePrediction = async (prediction: { className: string; probability: number }) => {
    const { className, probability } = prediction;
    const soundKey = getSoundKey(className);

    // Check if muted
    if (user?.preferences?.muted_sounds?.includes(soundKey)) {
      console.log(`Sound ${className} is muted.`);
      return;
    }

    // Trigger Alert if confidence is high
    if (probability > 0.8) { // 80% threshold
      // Haptics - use stronger feedback for critical sounds
      const isCritical = ['Fire Alarm', 'Baby Crying'].includes(className);
      if (isCritical) {
        // More intense haptic for critical alerts
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Local Notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Sound Detected!",
          body: `Identify: ${className} (${(probability * 100).toFixed(0)}%)`,
          data: { className },
        },
        trigger: null, // Immediate
      });

      // Log to Backend
      if (user?.id) {
        try {
          await soundService.logSound(Number(user.id), className, probability);
        } catch (e) {
          console.error("Failed to log sound", e);
        }
      }
    }
  };

  const getSoundKey = (label: string) => {
    // Map label from model to key used in preferences/database
    const map: Record<string, string> = {
      'Doorbell': 'doorbell',
      'Baby Crying': 'baby_cry',
      'baby_cry': 'baby_cry',
      'Fire Alarm': 'fire_alarm',
      'fire_alarm': 'fire_alarm',
      'Glass Shatter': 'glass_shatter',
      'Ambulance': 'ambulance',
      'Dog Barking': 'dog_bark'
    };
    return map[label] || label.toLowerCase();
  };

  const getDisplayName = (label: string) => {
    const map: Record<string, string> = {
      'baby_cry': 'Baby Crying',
      'fire_alarm': 'Fire Alarm',
      'doorbell': 'Doorbell',
      'dog_bark': 'Dog Barking',
      'glass_shatter': 'Glass Shatter',
      'ambulance': 'Ambulance'
    };
    return map[label] || label;
  };

  const toggleRecording = () => {
    if (isProcessing) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await startClassification();
      // Animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingStatus, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
          Animated.timing(recordingStatus, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: true })
        ])
      ).start();
    } catch (e) {
      console.error('Failed to start classification', e);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    await stopClassification();
    recordingStatus.stopAnimation();
  };

  const pulseAnimation = recordingStatus.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return (
    <View style={styles.container}>
      <TMAudioClassifier
        modelUrl={modelUrl}
        isProcessing={isProcessing}
        onPrediction={setRealPrediction}
        onReady={(labels) => {
          console.log('Model ready with labels:', labels);
          setModelStatus('ready');
        }}
        onError={(err) => {
          console.error('Model error:', err);
          setModelStatus('error');
          setModelError(err);
        }}
      />
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placehold.co/400x400/6a5acd/white?text=SoundSee' }}
          style={styles.logo}
        />
        <Text style={styles.title}>SoundSee</Text>
        <Text style={styles.subtitle}>Hear the world through AI</Text>
      </View>

      <AudioMLScreen />

      <View style={styles.recordingSection}>
        <Animated.View style={[styles.recordButtonContainer, { transform: [{ scale: pulseAnimation }] }]}>
          <TouchableOpacity
            style={[styles.recordButton, isProcessing && styles.recordingButton]}
            onPress={toggleRecording}
          >
            <Ionicons
              name={isProcessing ? "stop" : "mic"}
              size={40}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.recordText}>
          {isProcessing ? 'Listening for sounds...' : 'Tap to identify surrounding sounds'}
        </Text>

        {modelStatus === 'loading' && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: '#6a5acd', fontStyle: 'italic' }}>Loading AI Model...</Text>
          </View>
        )}

        {modelStatus === 'error' && (
          <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
            <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
              ⚠️ Model Load Failed: {modelError}
            </Text>
            <Text style={{ fontSize: 10, color: '#888', marginTop: 5 }}>
              Ensure your phone is on the same Wi-Fi as your PC.
            </Text>
          </View>
        )}

        {/* Display Live Prediction if any */}
        {isProcessing && predictions.length > 0 && (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#6a5acd' }}>
              {getDisplayName(predictions[0].className)}
            </Text>
            <Text style={{ color: '#888' }}>
              Confidence: {(predictions[0].probability * 100).toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      {/* Info Section remains same */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <View style={styles.infoItem}>
          <Ionicons name="mic-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>Record surrounding sounds</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="analytics-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>AI analyzes the audio</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="notifications-outline" size={24} color="#6a5acd" />
          <Text style={styles.infoText}>Get visual notifications</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#6a5acd',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  recordingSection: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
  },
  recordButtonContainer: {
    marginBottom: 15,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6a5acd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  recordingButton: {
    backgroundColor: '#e74c3c',
  },
  recordText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  infoSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 15,
  },
});

export default SoundSeeApp;