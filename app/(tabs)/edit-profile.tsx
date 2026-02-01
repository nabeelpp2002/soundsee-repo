import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

export default function EditProfile() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [profileImage, setProfileImage] = useState(user?.profile_image || '');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || '');
            setProfileImage(user.profile_image || '');
        }
    }, [user]);

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
                setProfileImage(response.imageUrl);
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

    const handleSave = async () => {
        if (!user) return;

        if (!name || !email) {
            Alert.alert('Error', 'Name and email are required');
            return;
        }

        try {
            const response = await userService.updateProfile(Number(user.id), name, email, phone);
            if (response.user) {
                await updateUser(response.user);
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
        }
    };

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name || 'User') + '&size=300&background=6a5acd&color=fff&bold=true';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Profile Image Section */}
                <View style={styles.imageSection}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: profileImage || defaultAvatar }}
                            style={styles.profileImage}
                        />
                        {isUploading && (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator size="large" color="#6a5acd" />
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.changePhotoButton}
                        onPress={pickImage}
                        disabled={isUploading}
                    >
                        <Ionicons name="camera" size={20} color="#6a5acd" />
                        <Text style={styles.changePhotoText}>
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
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
    content: {
        flex: 1,
        padding: 20,
    },
    imageSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#6a5acd',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    changePhotoText: {
        color: '#6a5acd',
        fontSize: 16,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#6a5acd',
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 20,
        elevation: 2,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
