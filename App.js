import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

// Context Import 
import { SettingsContext, SettingsProvider } from './context/SettingsContext';

// Screens
import AddRouteScreen from './screens/AddRouteScreen';
import DetailScreen from './screens/DetailScreen';
import EditRouteScreen from './screens/EditRouteScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isDarkMode } = useContext(SettingsContext);

  const themeOptions = {
    headerStyle: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    },
    headerTintColor: isDarkMode ? '#ffffff' : '#000000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    contentStyle: {
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={themeOptions}>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'EduRoute - Find Shuttles' }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Route Details' }} 
        />
        <Stack.Screen 
          name="AddRoute" 
          component={AddRouteScreen} 
          options={{ title: 'Add New Route' }} 
        />
        <Stack.Screen 
          name="EditRoute" 
          component={EditRouteScreen} 
          options={{ title: 'Edit Shuttle Route' }} 
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'App Settings' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Student Profile' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppNavigation />
    </SettingsProvider>
  );
}