import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const insets = useSafeAreaInsets();

	return (
		<View className="flex-1 bg-red-800" style={{ paddingTop: Platform.OS === 'ios' ? insets.top : Constants.statusBarHeight }}>
			<StatusBar 
				barStyle="light-content" 
				backgroundColor="transparent"
				translucent={true}
			/>
			
			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-6 py-6">
				{/* Logo */}
				<View className="flex-1 items-center justify-center">
					<Image 
						source={require('../assets/logo.png')} 
						style={{ width: 200, height: 110 }}
					/>
					<Text className="text-white text-lg font-bold text-center">Cloud Storage Simplified</Text>
					<Text className="text-white text-lg opacity-80 text-center">Join 1 Million+ users wordlwide that trust KLOUDIUS for their cloud storage needs</Text>
				</View>
				
				{/* Buttons */}
				<View className="w-full space-y-4 gap-3">
					<TouchableOpacity
						onPress={() => navigation.navigate('Login')}
						className="border-2 border-white rounded-full py-4 shadow-sm"
					>
						<Text className="text-white text-center font-bold text-xl"> SIGN IN</Text>
					</TouchableOpacity>
					
					<TouchableOpacity
						onPress={() => navigation.navigate('Signup')}
						className="bg-white rounded-full py-4"
					>
						<Text className="text-red-800 text-center font-bold text-xl">SIGN UP</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
