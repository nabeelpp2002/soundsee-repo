import React, { useRef } from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const AudioMLScreen: React.FC = () => {
  const modelURL = "https://teachablemachine.withgoogle.com/models/y8KI62z4J/";

  // Bridge to see logs from the HTML inside your RN terminal
  const onMessage = (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("[WebView Log]", data.message);
    if (data.type === 'error') {
      Alert.alert("Model Error", data.message);
    }
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/audio"></script>
    <script>
      // Function to send logs to React Native
      function sendToNative(type, message) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, message }));
      }

      const URL = "${modelURL}";
      let recognizer;

      async function startListening() {
        const resultEl = document.getElementById("result");
        try {
          resultEl.innerText = "Loading model...";
          sendToNative('log', 'Starting model load from: ' + URL);

          recognizer = await tmAudio.create(URL + "model.json", URL + "metadata.json");
          await recognizer.ensureModelLoaded();
          
          sendToNative('log', 'Model loaded successfully. Requesting mic...');
          resultEl.innerText = "Model loaded! Speak now...";

          recognizer.listen(result => {
            const scores = result.scores;
            const labels = recognizer.wordLabels();
            let maxIndex = scores.indexOf(Math.max(...scores));
            resultEl.innerText = labels[maxIndex] + " (" + (scores[maxIndex] * 100).toFixed(1) + "%)";
          }, { 
            probabilityThreshold: 0.70,
            overlapFactor: 0.5 
          });
        } catch (err) {
          sendToNative('error', 'Error: ' + err.message);
          resultEl.innerText = "Error: " + err.message;
        }
      }
    </script>
    <style>
      body { font-family: sans-serif; text-align: center; padding: 20px; background: #f0f0f0; }
      #result { font-size: 22px; font-weight: bold; margin-top: 20px; color: #333; }
      button { padding: 15px 30px; font-size: 18px; border-radius: 10px; border: none; background: #007AFF; color: white; }
    </style>
  </head>
  <body>
    <h3>Audio Classification</h3>
    <button onclick="startListening()">Start Listening</button>
    <p id="result">Waiting...</p>
  </body>
</html>
`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        // Essential for Audio/Video in WebViews
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        // Native permission handling (Android specific)
        androidLayerType="hardware"
        mixedContentMode="always"
        onMessage={onMessage}
        source={{ html: htmlContent }}

        
      />
    </View>
  );
};

export default AudioMLScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});