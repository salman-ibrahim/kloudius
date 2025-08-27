import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '~/context/AuthContext';

// Validation schema
const SignupSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required'),
});

export default function SignupScreen() {
	const { signup } = useAuth();
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const insets = useSafeAreaInsets();
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSignup = async (values: { name: string; email: string; password: string }) => {
		setErrorMsg(null);
		const result = await signup(values.name, values.email, values.password);
		
		if (result.success) {
		navigation.reset({
			index: 0,
			routes: [{ name: 'Home' }],
		});
		} else {
		setErrorMsg(result.error || 'Signup failed');
		}
	};

	return (
		<>
			<View className="flex-1 bg-red-800" style={{ paddingTop: Platform.OS === 'ios' ? insets.top : Constants.statusBarHeight }}>
				<StatusBar 
					barStyle="light-content" 
					backgroundColor="transparent"
					translucent={true}
				/>
				
				{/* Header Section */}
				<View className="bg-red-800 pt-8 pb-12 px-6">
					<Text className="text-white text-3xl font-bold">Create Your</Text>
					<Text className="text-white text-3xl font-bold">Account</Text>
				</View>
				
				{/* Form Section */}
				<View className="bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-10 flex-1">
					<ScrollView className="flex-1">
						
						<Formik
							initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
							validationSchema={SignupSchema}
							onSubmit={handleSignup}
						>
							{({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
								<View className="space-y-5">
									{/* Name Input */}
									<View className="mb-6">
										<Text className="text-red-800 font-medium mb-1">Full Name</Text>
										<View className="flex-row items-center border-b border-gray-300 pb-2">
											<TextInput
												className="flex-1 text-gray-800 text-base"
												placeholder="John Smith"
												placeholderTextColor="rgb(156, 163, 175)"
												value={values.name}
												onChangeText={handleChange('name')}
												onBlur={handleBlur('name')}
											/>
											{!errors.name && touched.name && (
												<Ionicons name="checkmark" size={20} color="rgb(34, 197, 94)" />
											)}
										</View>
										{touched.name && errors.name && (
											<Text className="text-red-500 mt-1 text-sm">{errors.name}</Text>
										)}
									</View>

									{/* Email Input */}
									<View className="mb-6">
										<Text className="text-red-800 font-medium mb-1">Email</Text>
										<View className="flex-row items-center border-b border-gray-300 pb-2">
											<TextInput
												className="flex-1 text-gray-800 text-base"
												placeholder="youremail@gmail.com"
												placeholderTextColor="rgb(156, 163, 175)"
												keyboardType="email-address"
												autoCapitalize="none"
												value={values.email}
												onChangeText={handleChange('email')}
												onBlur={handleBlur('email')}
											/>
											{!errors.email && touched.email && (
												<Ionicons name="checkmark" size={20} color="rgb(34, 197, 94)" />
											)}
										</View>
										{touched.email && errors.email && (
											<Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
										)}
									</View>

									{/* Password Input */}
									<View className="mb-6">
										<Text className="text-red-800 font-medium mb-1">Password</Text>
										<View className="flex-row items-center border-b border-gray-300 pb-2">
											<TextInput
												className="flex-1 text-gray-800 text-base"
												placeholder="••••••••"
												placeholderTextColor="rgb(156, 163, 175)"
												secureTextEntry={!showPassword}
												value={values.password}
												onChangeText={handleChange('password')}
												onBlur={handleBlur('password')}
												autoCapitalize='none'
											/>
											<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
												<Ionicons 
												name={showPassword ? "eye-off-outline" : "eye-outline"} 
												size={20} 
												color="rgb(239, 68, 68)" 
												/>
											</TouchableOpacity>
										</View>
										{touched.password && errors.password && (
											<Text className="text-red-500 mt-1 text-sm">{errors.password}</Text>
										)}
									</View>

									{/* Confirm Password Input */}
									<View className="mb-8">
										<Text className="text-red-800 font-medium mb-1">Confirm Password</Text>
										<View className="flex-row items-center border-b border-gray-300 pb-2">
											<TextInput
												className="flex-1 text-gray-800 text-base"
												placeholder="••••••••"
												placeholderTextColor="rgb(156, 163, 175)"
												secureTextEntry={!showConfirmPassword}
												value={values.confirmPassword}
												onChangeText={handleChange('confirmPassword')}
												onBlur={handleBlur('confirmPassword')}
												autoCapitalize='none'
											/>
											<TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
												<Ionicons 
												name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
												size={20} 
												color="rgb(239, 68, 68)" 
												/>
											</TouchableOpacity>
										</View>
										{touched.confirmPassword && errors.confirmPassword && (
											<Text className="text-red-500 mt-1 text-sm">{errors.confirmPassword}</Text>
										)}
									</View>

									{/* Error Message */}
									{errorMsg && (
										<Text className="text-red-500 text-sm text-center">{errorMsg}</Text>
									)}

									{/* Signup Button */}
									<TouchableOpacity
										onPress={() => handleSubmit()}
										disabled={isSubmitting}
										className={`bg-red-800 rounded-full py-4 shadow-sm ${isSubmitting ? 'opacity-70' : ''}`}
									>
										<Text className="text-white text-center font-bold text-base">
											{isSubmitting ? 'Creating account...' : 'SIGN UP'}
										</Text>
									</TouchableOpacity>

									{/* Login Link */}
									<View className="flex-row justify-center mt-8">
										<Text className="text-gray-600 mr-1">Don't have account?</Text>
										<TouchableOpacity onPress={() => navigation.navigate('Login')}>
											<Text className="text-red-800 font-bold">Sign In</Text>
										</TouchableOpacity>
									</View>
								</View>
							)}
						</Formik>
					</ScrollView>
				</View>
			</View>
		</>
	);
}
