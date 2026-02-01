import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface TMAudioClassifierProps {
  modelUrl: string;
  onPrediction: (prediction: { className: string; probability: number }) => void;
  onReady?: (labels: string[]) => void;
  onError?: (error: string) => void;
  isProcessing: boolean;
}

const TMAudioClassifier: React.FC<TMAudioClassifierProps> = ({
  modelUrl,
  onPrediction,
  onReady,
  onError,
  isProcessing,
}) => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (isProcessing) {
      webViewRef.current?.injectJavaScript('startListening();');
    } else {
      webViewRef.current?.injectJavaScript('stopListening();');
    }
  }, [isProcessing]);

  // We point to the TFLite model on the backend
  const tfliteModelUrl = modelUrl + 'model.tflite';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MediaPipe Audio Classifier</title>
        <script src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0" crossorigin="anonymous"></script>
        <style>
          body { background: transparent; color: white; font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; overflow: hidden; }
          #status { font-size: 14px; margin-bottom: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px; text-align: center; }
        </style>
      </head>
      <body>
        <div id="status">Starting TFLite Engine...</div>
        
        <script type="module">
            import { AudioClassifier, AudioFilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0";

            let audioClassifier;
            const modelAssetPath = "${tfliteModelUrl}";
            let stream;
            let audioCtx;
            let isLoaded = false;

            async function init() {
                const statusDiv = document.getElementById("status");
                try {
                    statusDiv.innerText = "Loading TFLite Model...";
                    
                    const audio = await AudioFilesetResolver.forAudioTasks(
                        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm"
                    );

                    audioClassifier = await AudioClassifier.createFromOptions(audio, {
                        baseOptions: {
                            modelAssetPath: modelAssetPath,
                        },
                        runningMode: "AUDIO_STREAM"
                    });

                    isLoaded = true;
                    statusDiv.innerText = "TFLite Ready";
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({ 
                        type: 'READY', 
                        labels: [] // MediaPipe doesn't easily expose labels before first result in some versions
                    }));

                    // Auto-start if it was requested
                    // startListening();
                } catch (err) {
                    console.error(err);
                    statusDiv.innerText = "Engine Error: " + err.message;
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: err.message }));
                }
            }

            window.startListening = async () => {
                if (!isLoaded) {
                  await init();
                }
                
                const statusDiv = document.getElementById("status");
                try {
                    if (stream) return;

                    statusDiv.innerText = "Activating Mic...";
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioCtx = new AudioContext();
                    const source = audioCtx.createMediaStreamSource(stream);
                    
                    const container = document.createElement("div"); // Placeholder for visualization if needed
                    
                    statusDiv.innerText = "Listening (TFLite)...";

                    const scriptProcessor = audioCtx.createScriptProcessor(16384, 1, 1);
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(audioCtx.destination);

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        if (!isLoaded || !audioClassifier) return;
                        
                        const inputBuffer = audioProcessingEvent.inputBuffer;
                        const inputData = inputBuffer.getChannelData(0);
                        
                        // Run inference
                        const result = audioClassifier.classify(inputData, audioCtx.currentTime * 1000);
                        
                        if (result && result.length > 0) {
                            const topResult = result[0].classifications[0].categories[0];
                            if (topResult && topResult.score > 0.6) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'PREDICTION',
                                    className: topResult.categoryName,
                                    probability: topResult.score
                                }));
                            }
                        }
                    };
                } catch (err) {
                    statusDiv.innerText = "Mic Error: " + err.message;
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: "Mic Error: " + err.message }));
                }
            }

            window.stopListening = () => {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    stream = null;
                }
                if (audioCtx) {
                    audioCtx.close();
                    audioCtx = null;
                }
                document.getElementById("status").innerText = "Engine Paused";
            }

            init();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'PREDICTION') {
              onPrediction({
                className: data.className,
                probability: data.probability,
              });
            } else if (data.type === 'READY') {
              onReady?.(data.labels);
            } else if (data.type === 'ERROR') {
              onError?.(data.error);
            }
          } catch (e) {
            console.error('Error parsing WebView message:', e);
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 1,
    width: 1,
    opacity: 0,
    position: 'absolute',
  },
});

export default TMAudioClassifier;
