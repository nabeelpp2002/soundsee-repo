import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure the router is ready
    const timer = setTimeout(() => {
      setIsReady(true);
      router.replace('/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, []);


  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#cc0000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return null;
}