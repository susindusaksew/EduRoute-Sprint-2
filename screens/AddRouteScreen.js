import { useContext, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { SettingsContext } from '../context/SettingsContext';
import { addRoute } from '../src/services/api';

export default function AddRouteScreen({ navigation }) {
  const { isDarkMode } = useContext(SettingsContext);

  const [routeName, setRouteName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [fee, setFee] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [stops, setStops] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddRoute = async () => {
    if (!routeName || !driverName || !fee) {
      Alert.alert('Error', 'Please fill in Route Name, Driver Name, and Fee.');
      return;
    }

    try {
      setSubmitting(true);
      const newRouteObj = {
        routeName,
        driverName,
        contactNo,
        fee: fee.startsWith('LKR') ? fee : `LKR ${fee}`,
        vehicleNo,
        departureTime,
        distanceKm: Number(distanceKm) || 0,
        stops: stops ? stops.split(',').map((s) => s.trim()) : [],
      };

      await addRoute(newRouteObj);
      Alert.alert('Success', 'New Route added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add route to MockAPI.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#000000',
      borderColor: isDarkMode ? '#444444' : '#cccccc',
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#64b5f6' : '#0d47a1' }]}>
        Add New Shuttle Route
      </Text>

      <TextInput
        style={inputStyle}
        placeholder="Route Name (e.g. Route 16 - Kottawa Express)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={routeName}
        onChangeText={setRouteName}
      />
      <TextInput
        style={inputStyle}
        placeholder="Driver Name"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={driverName}
        onChangeText={setDriverName}
      />
      <TextInput
        style={inputStyle}
        placeholder="Contact Number"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="phone-pad"
        value={contactNo}
        onChangeText={setContactNo}
      />
      <TextInput
        style={inputStyle}
        placeholder="Monthly Fee (e.g. 8,500)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={fee}
        onChangeText={setFee}
      />
      <TextInput
        style={inputStyle}
        placeholder="Vehicle Number (e.g. WP NC-1234)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={vehicleNo}
        onChangeText={setVehicleNo}
      />
      <TextInput
        style={inputStyle}
        placeholder="Departure Time (e.g. 06:30 AM)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={departureTime}
        onChangeText={setDepartureTime}
      />
      <TextInput
        style={inputStyle}
        placeholder="Distance in KM (e.g. 15)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={distanceKm}
        onChangeText={setDistanceKm}
      />
      <TextInput
        style={inputStyle}
        placeholder="Stops (Comma separated: Station, Gate, Town)"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={stops}
        onChangeText={setStops}
      />

      <TouchableOpacity 
        style={[styles.saveBtn, { opacity: submitting ? 0.6 : 1 }]} 
        onPress={handleAddRoute}
        disabled={submitting}
      >
        <Text style={styles.btnText}>{submitting ? 'Saving...' : '➕ Add Route'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#1a73e8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  btnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 },
});