import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation';
import { Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '~/context/AuthContext';

// Define icon type for TypeScript
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Dummy folder data
const dummyFolders = [
    {
        id: '1',
        name: 'Documents',
        files: 128,
        size: '1.2 GB',
        color: 'rgb(239, 246, 255)', // blue-50
        iconColor: 'rgb(59, 130, 246)', // blue-500
        icon: 'document-text-outline' as IconName
    },
    {
        id: '2',
        name: 'Images',
        files: 53,
        size: '0.4 GB',
        color: 'rgb(254, 252, 232)', // yellow-50
        iconColor: 'rgb(250, 204, 21)', // yellow-400
        icon: 'image-outline' as IconName
    },
    {
        id: '3',
        name: 'Videos',
        files: 12,
        size: '2.1 GB',
        color: 'rgb(240, 253, 244)', // green-50
        iconColor: 'rgb(34, 197, 94)', // green-500
        icon: 'videocam-outline' as IconName
    },
    {
        id: '4',
        name: 'Music',
        files: 32,
        size: '0.3 GB',
        color: 'rgb(254, 242, 242)', // red-50
        iconColor: 'rgb(239, 68, 68)', // red-500
        icon: 'musical-notes-outline' as IconName
    }
];

// Calculate storage usage from folder data
const calculateStorageInfo = (folders: typeof dummyFolders) => {
    // Total storage limit in GB
    const totalStorage = 10;
    
    // Calculate used storage by summing up folder sizes
    const usedStorage = folders.reduce((total, folder) => {
        // Extract numeric value from size string (e.g., "1.2 GB" -> 1.2)
        const sizeMatch = folder.size.match(/([\d.]+)\s*GB/);
        if (sizeMatch && sizeMatch[1]) {
          return total + parseFloat(sizeMatch[1]);
        }
        return total;
    }, 0);
    
    // Calculate percentage used (capped at 100%)
    const percentageUsed = Math.min(Math.round((usedStorage / totalStorage) * 100), 100);
    
    return {
        usedStorage: usedStorage.toFixed(1),
        totalStorage,
        percentageUsed
    };
};

export default function Home() {
    const { user, logout } = useAuth();
    const insets = useSafeAreaInsets();
    
    // Calculate storage information
    const storageInfo = calculateStorageInfo(dummyFolders);

    return (
        <View className="flex-1 bg-gray-100" style={{ paddingTop: Platform.OS === 'ios' ? insets.top : Constants.statusBarHeight }}>
            <StatusBar 
              barStyle="dark-content" 
              backgroundColor="transparent"
              translucent={true}
            />
            <ScrollView className="flex-1">
              {/* Header Section */}
                <View className="bg-red-800 pt-8 pb-12 px-6 rounded-3xl mx-4 my-2">
                  {/* User Info */}
                    <View className="flex-row items-start justify-between mb-6">
                        <View>
                            <Text className="text-white text-lg font-medium mb-0.5">Hi, {user?.name || 'User'}</Text>
                            <View className="flex-row items-center mb-2">
                                <Text className="text-white/70 text-sm ml-1">{user?.email || 'user@example.com'}</Text>
                            </View>
                        </View>
                        <View className="flex-row">
                            <TouchableOpacity 
                                className="bg-white/20 dark:bg-gray-800/30 rounded-full p-2 ml-3"
                                onPress={logout}
                            >
                                <Ionicons name="log-out-outline" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                      
                      {/* Search Bar */}
                      <View className="flex-row bg-white rounded-full px-4 py-3 items-center">
                        <Ionicons name="search-outline" size={20} color="rgb(156, 163, 175)" />
                        <Text className="text-gray-400 ml-2">Search files</Text>
                      </View>
                  </View>
                
                {/* Storage Section */}
                <View className="px-6 mt-6">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-gray-800 dark:text-white text-lg font-bold">Storage</Text>
						<TouchableOpacity>
							<Text className="text-red-800 font-medium">View all</Text>
						</TouchableOpacity>
					</View>
					
					{/* Storage Card */}
					<View className="bg-white rounded-2xl p-5 border border-gray-200 mb-6">
						<View className="flex-row justify-between items-center mb-4">
							<View className="flex-row items-center">
								<View className="bg-blue-50 p-3 rounded-lg mr-3">
									<Ionicons name="cloud-outline" size={24} color={Platform.OS === 'ios' ? "rgb(59, 130, 246)" : "rgb(59, 130, 246)"} />
								</View>
								<View>
									<Text className="text-gray-800 dark:text-white font-bold">Cloud Storage</Text>
									<Text className="text-gray-500 dark:text-gray-400 text-xs">Used: {storageInfo.usedStorage} GB of {storageInfo.totalStorage} GB</Text>
								</View>
							</View>
							<TouchableOpacity>
								<Ionicons name="ellipsis-vertical" size={20} color="rgb(156, 163, 175)" />
							</TouchableOpacity>
						</View>
						
						{/* Progress Bar */}
						<View className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-2">
							<View 
								className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" 
								style={{ width: `${storageInfo.percentageUsed}%` }} 
							/>
						</View>
						<Text className="text-right text-xs text-gray-500 dark:text-gray-400">{storageInfo.usedStorage} GB of {storageInfo.totalStorage} GB used</Text>
					</View>
                </View>
                
                {/* Quick Access Section */}
                <View className="px-6 mt-2 mb-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold">Quick Access</Text>
                        <TouchableOpacity>
                            <Text className="text-red-800 font-medium">View all</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Folder Grid */}
                    <View className="mb-8">
						{dummyFolders.length > 0 ? (
							<View className="flex-row flex-wrap" style={{ gap: 16 }}>
							{dummyFolders.map(item => (
								<TouchableOpacity 
									key={item.id}
									className="bg-white rounded-xl p-4 border border-gray-200"
									style={{ width: '47%' }}
								>
									<View className="flex-row justify-between items-start mb-3">
										<View style={{ backgroundColor: item.color }} className="p-3 rounded-lg">
											<Ionicons name={item.icon} size={24} color={item.iconColor} />
										</View>
										<TouchableOpacity>
											<Ionicons name="ellipsis-vertical" size={18} color="rgb(156, 163, 175)" />
										</TouchableOpacity>
									</View>
									<Text className="text-gray-800 font-bold">{item.name}</Text>
									<Text className="text-gray-500 text-xs mt-1">{item.files} files, {item.size}</Text>
								</TouchableOpacity>
							))}
							</View>
						) : (
							<View className="items-center justify-center py-10">
								<View className="bg-gray-100 rounded-full p-6 mb-4">
									<Ionicons name="folder-open-outline" size={48} color="rgb(59, 130, 246)" />
								</View>
								<Text className="text-gray-800 font-bold text-lg mb-2">No files yet</Text>
								<Text className="text-gray-500 text-center">Your uploaded files will appear here</Text>
							</View>
						)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
