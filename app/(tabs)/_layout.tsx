import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6a5acd',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 80,
            paddingTop: 8,
            borderRadius: 35,
            marginHorizontal: 20,
            marginBottom: 15,
            position: 'absolute',
            backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#fff',
            borderTopWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          tabBarItemStyle: {
            paddingVertical: 6,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="clock.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="sounds"
          options={{
            title: 'Sounds',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="waveform" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
          }}
        />
        {[
          "splash",
          "SignIn",
          "SignUp",
          "edit-profile",
          "saved-sounds",
          "help",
          "feedback",
          "about",
        ].map((screen) => (
          <Tabs.Screen
            key={screen}
            name={screen}
            options={{
              href: null,
              tabBarStyle: { display: "none" },
            }}
          />
        ))}
      </Tabs>
    </View>
  );
}