import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { useAuth } from '~/context/AuthContext';

/**
 * Layout screen that handles authentication routing
 * If user is authenticated, redirects to Home
 * If user is not authenticated, redirects to Welcome
 */
export default function LayoutScreen() {
    const { user, isLoading } = useAuth();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
      // Only navigate when loading is complete
		if (!isLoading) {
			if (user) {
				// User is authenticated, navigate to Home
				navigation.reset({
					index: 0,
					routes: [{ name: 'Home' }],
				});
			} else {
				// User is not authenticated, navigate to Welcome
				navigation.reset({
					index: 0,
					routes: [{ name: 'Welcome' }],
				});
			}
		}
    }, [user, isLoading, navigation]);

    // Show loading indicator while checking authentication status
    return (
		<View className="flex-1 justify-center items-center bg-red-800">
			<ActivityIndicator size="large" color="#ffffff" />
		</View>
    );
}
