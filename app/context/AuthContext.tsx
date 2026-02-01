import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

type User = {
    id: string;
    name: string;
    email: string;
    preferences?: any;
    profile_image?: string;
    phone?: string;
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    signIn: (userData: User) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (userData: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
    updateUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        // Check for stored session
        AsyncStorage.getItem('user').then((userJson) => {
            if (userJson) {
                setUser(JSON.parse(userJson));
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(tabs)';
        const currentRoute = segments[segments.length - 1];

        // Allow SignIn and SignUp pages even when not logged in
        const isPublicRoute = currentRoute === 'SignIn' || currentRoute === 'SignUp';

        if (!user && inAuthGroup && !isPublicRoute) {
            // If not logged in and trying to access protected route, redirect to Sign In
            console.log('Not logged in, redirecting to SignIn');
            router.replace('/SignIn');
        } else if (user && isPublicRoute) {
            // If logged in and on public route (like Sign In/SignUp), redirect to Home
            console.log('Already logged in, redirecting to home');
            router.replace('/home');
        }
    }, [user, segments, isLoading]);

    const signIn = async (userData: User) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        router.replace('/home');
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/SignIn');
    };

    const updateUser = async (userData: User) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}
