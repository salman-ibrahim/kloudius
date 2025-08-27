import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Image, ScrollView, Platform } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '~/context/AuthContext';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginScreen() {
    const { login } = useAuth();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (values: { email: string; password: string }) => {
        setErrorMsg(null);
        const result = await login(values.email, values.password);
        
        if (result.success) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } else {
            setErrorMsg(result.error || 'Login failed');
        }
    };

    return (
        <View className="flex-1 bg-red-800" style={{ paddingTop: Platform.OS === 'ios' ? insets.top : Constants.statusBarHeight }}>
            <StatusBar 
                barStyle="light-content" 
                // className='bg-red-800'
                backgroundColor="transparent"
                translucent={true}
            />
        
            {/* Header Section */}
            <View className="bg-red-800 pt-8 pb-12 px-6">
                <Text className="text-white text-3xl font-bold">Hello</Text>
                <Text className="text-white text-3xl font-bold">Sign in!</Text>
            </View>
        
            {/* Form Section */}
            <View className="bg-white rounded-t-3xl -mt-6 px-6 pt-8 pb-10 flex-1">
                <ScrollView className="flex-1">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                            <View className="space-y-5">
                                {/* Email Input */}
                                <View className="mb-6">
                                    <Text className="text-red-800 font-medium mb-1">Email</Text>
                                    <View className="flex-row items-center border-b border-gray-300 pb-2">
                                        <TextInput
                                            className="flex-1 text-gray-800 text-base"
                                            placeholder="youremail@gmail.com"
                                            placeholderTextColor="rgb(156, 163, 175)"
                                            keyboardType="email-address"
                                            autoCapitalize='none'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                        />
                                        {!errors.email && touched.email && (
                                            <Ionicons name="checkmark" size={20} color="green" />
                                        )}
                                    </View>
                                    {touched.email && errors.email && (
                                        <Text className="text-red-500 mt-1 text-sm">{errors.email}</Text>
                                    )}
                                </View>

                                {/* Password Input */}
                                <View className="mb-4">
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
                                
                                {/* Forgot Password */}
                                <TouchableOpacity className="mb-8">
                                    <Text className="text-gray-600 text-right text-sm">Forgot password?</Text>
                                </TouchableOpacity>

                                {/* Error Message */}
                                {errorMsg && (
                                    <Text className="text-red-500 text-sm text-center">{errorMsg}</Text>
                                )}

                                {/* Login Button */}
                                <TouchableOpacity
                                    onPress={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className={`bg-red-800 rounded-full py-4 shadow-sm ${isSubmitting ? 'opacity-70' : ''}`}
                                >
                                    <Text className="text-white text-center font-bold text-base">
                                        {isSubmitting ? 'Logging in...' : 'SIGN IN'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Signup Link */}
                                <View className="flex-row justify-center mt-8">
                                    <Text className="text-gray-600 mr-1">Don't have account?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                        <Text className="text-red-800 font-bold">Sign up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </View>
        </View>
    );
}
