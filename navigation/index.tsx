import { NavigationContainer, NavigationContainerRef, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { forwardRef } from 'react';
import WelcomeScreen from 'screens/welcome';
import LoginScreen from 'screens/login';
import SignupScreen from 'screens/signup';
import Home from 'screens/home';
import LayoutScreen from 'screens/layout';

export type RootStackParamList = {
  Layout: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

type NavigationProps = {
  theme?: Theme;
};

const Navigation = forwardRef<NavigationContainerRef<RootStackParamList>, NavigationProps>(
  ({ theme }, ref) => {
    return (
      <NavigationContainer ref={ref} theme={theme}>
        <Stack.Navigator initialRouteName="Layout" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Layout" component={LayoutScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
);

export default Navigation;
