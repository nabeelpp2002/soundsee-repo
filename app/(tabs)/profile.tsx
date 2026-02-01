import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const Profile = () => {
  const router = useRouter();

  const [isNotificationOn, setIsNotificationOn] = useState(true);
  const [isSoundEffectsOn, setIsSoundEffectsOn] = useState(true);
  const [isVibrationOn, setIsVibrationOn] = useState(true);

  const toggleNotification = () => setIsNotificationOn(!isNotificationOn);
  const toggleSoundEffects = () => setIsSoundEffectsOn(!isSoundEffectsOn);
  const toggleVibration = () => setIsVibrationOn(!isVibrationOn);

  const { signOut, user, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const response = await userService.uploadProfileImage(Number(user.id), imageUri);

      if (response.user) {
        await updateUser(response.user);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: async () => await signOut() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather
            name="chevron-left"
            size={24}
            color="#6a5acd"
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/sounds')}>
          <Feather
            name="bell"
            size={24}
            color="#6a5acd"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={pickImage}
            disabled={isUploading}
          >
            <Image
              source={{
                uri: user?.profile_image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&size=300&background=6a5acd&color=fff&bold=true'
              }}
              style={styles.profileImage}
            />
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Feather name="edit-2" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>
            {user?.name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6a5acd"
              />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch
              value={isNotificationOn}
              onValueChange={toggleNotification}
              thumbColor={isNotificationOn ? "white" : "white"}
              trackColor={{ false: "#ccc", true: "#6a5acd" }}
            />
          </View>

          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="volume-high-outline"
                size={24}
                color="#6a5acd"
              />
              <Text style={styles.optionText}>Sound Effects</Text>
            </View>
            <Switch
              value={isSoundEffectsOn}
              onValueChange={toggleSoundEffects}
              thumbColor={isSoundEffectsOn ? "white" : "white"}
              trackColor={{ false: "#ccc", true: "#6a5acd" }}
            />
          </View>

          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons
                name="phone-portrait-outline"
                size={24}
                color="#6a5acd"
              />
              <Text style={styles.optionText}>Vibration</Text>
            </View>
            <Switch
              value={isVibrationOn}
              onValueChange={toggleVibration}
              thumbColor={isVibrationOn ? "white" : "white"}
              trackColor={{ false: "#ccc", true: "#6a5acd" }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History & Data</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/history')}
          >
            <View style={styles.menuItemLeft}>
              <FontAwesome5
                name="history"
                size={20}
                color="#6a5acd"
              />
              <Text style={styles.menuItemText}>Sound History</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/saved-sounds')}
          >
            <View style={styles.menuItemLeft}>
              <FontAwesome5
                name="bookmark"
                size={20}
                color="#6a5acd"
              />
              <Text style={styles.menuItemText}>Saved Sounds</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/help')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#6a5acd"
              />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/feedback')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#6a5acd"
              />
              <Text style={styles.menuItemText}>Send Feedback</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="#999"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/about')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#6a5acd"
              />
              <Text style={styles.menuItemText}>About SoundSee</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#6a5acd",
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6a5acd',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#6a5acd",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#6a5acd",
    fontSize: 16,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 15,
  },
  logoutButton: {
    backgroundColor: "#ff5252",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;