import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/y8KI62z4J/';

export const useAudioClassification = () => {
    const [isModelReady, setIsModelReady] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const isProcessingRef = useRef(false);
    const [predictions, setPredictions] = useState<any[]>([]);

    const startClassification = async () => {
        console.log('Starting classification state with online model...');
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                console.error('Microphone permission not granted');
                return;
            }

            setIsProcessing(true);
            isProcessingRef.current = true;
        } catch (err) {
            console.error('Failed to update classification state', err);
        }
    };

    const stopClassification = async () => {
        console.log('Stopping classification...');
        setIsProcessing(false);
        isProcessingRef.current = false;
        setPredictions([]);
    };

    const setRealPrediction = (prediction: { className: string; probability: number }) => {
        setPredictions([prediction]);
    };

    return {
        isModelReady,
        isProcessing,
        predictions,
        startClassification,
        stopClassification,
        setRealPrediction,
        modelUrl: MODEL_URL
    };
};
