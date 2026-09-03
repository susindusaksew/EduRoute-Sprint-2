import { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SettingsContext } from '../context/SettingsContext';
import { updateRoute } from '../src/services/api';

export default function EditRouteScreen({ route, navigation }) {
  const { isDarkMode } = useContext(SettingsContext);

  // Detail/Home Screen 
  const { routeData } = route.params || {};

  const [routeName, setRouteName] = useState(routeData?.routeName || routeData?.name || '');
  const [departureTime, setDepartureTime] = useState(routeData?.departureTime || routeData?.time || '');
  const [fee, setFee] = useState(routeData?.fee || '');
  const [stops, setStops] = useState(
    Array.isArray(routeData?.stops) ? routeData.stops.join(', ') : routeData?.stops || ''
  );
  const [loading, setLoading] = useState(false);

  const handleUpdateRoute = async () => {
    if (!routeName.trim() || !departureTime.trim() || !fee.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const stopsArray = typeof stops === 'string'
        ? stops.split(',').map((stop) => stop.trim()).filter((stop) => stop.length > 0)
        : stops;

      const updatedData = {
        ...routeData,
        routeName: routeName.trim(),
        departureTime: departureTime.trim(),
        fee: fee.trim(),
        stops: stopsArray,
      };

      await updateRoute(routeData.id, updatedData);
      setLoading(false);

      Alert.alert('Success', 'Route updated successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update route. Please try again.');
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.heading, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
        Edit Shuttle Route
      </Text>

      {/* Route Name Input */}
      <Text style={[styles.label, { color: isDarkMode ? '#cccccc' : '#333333' }]}>
        Route Name *
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderColor: isDarkMode ? '#444444' : '#cccccc',
          },
        ]}
        value={routeName}
        onChangeText={setRouteName}
        placeholder="e.g., Route 01 - Kandy Express"
        placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
      />

      {/* Departure Time Input */}
      <Text style={[styles.label, { color: isDarkMode ? '#cccccc' : '#333333' }]}>
        Departure Time *
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderColor: isDarkMode ? '#444444' : '#cccccc',
          },
        ]}
        value={departureTime}
        onChangeText={setDepartureTime}
        placeholder="e.g., 07:30 AM"
        placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
      />

      {/* Fee Input */}
      <Text style={[styles.label, { color: isDarkMode ? '#cccccc' : '#333333' }]}>
        Monthly / Daily Fee *
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderColor: isDarkMode ? '#444444' : '#cccccc',
          },
        ]}
        value={fee}
        onChangeText={setFee}
        placeholder="e.g., LKR 8,500"
        placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
      />

      {/* Stops Input */}
      <Text style={[styles.label, { color: isDarkMode ? '#cccccc' : '#333333' }]}>
        Stops (Comma separated)
      </Text>
      <TextInput
        style={[
          styles.input,
          styles.multilineInput,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            borderColor: isDarkMode ? '#444444' : '#cccccc',
          },
        ]}
        value={stops}
        onChangeText={setStops}
        placeholder="e.g., Campus Main, Malabe, Kaduwela"
        placeholderTextColor={isDarkMode ? '#888888' : '#999999'}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.disabledBtn]}
        onPress={handleUpdateRoute}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitBtnText}>Update Route</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#007acc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: '#80bdff',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});