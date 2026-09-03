import { useContext } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';

export default function DetailScreen({ route, navigation }) {
  const { routeDetail } = route.params || {};
  const { isMiles, isDarkMode } = useContext(SettingsContext);

  // Distance Calculation
  const displayDistance = isMiles && routeDetail?.distanceKm
    ? `${(routeDetail.distanceKm * 0.621371).toFixed(1)} mi`
    : `${routeDetail?.distanceKm || 0} km`;

  // Dynamic Theme Styles
  const sectionBoxStyle = [
    styles.section,
    { 
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderColor: isDarkMode ? '#444' : '#e0e0e0'
    }
  ];

  const textColor = { color: isDarkMode ? '#e0e0e0' : '#222' };
  const headerTextColor = { color: isDarkMode ? '#ffffff' : '#000000' };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#64b5f6' : '#0d47a1' }]}>
        {routeDetail?.routeName || 'Route Details'}
      </Text>

      {/* Schedule & Logistics */}
      <View style={sectionBoxStyle}>
        <Text style={[styles.sectionHeader, headerTextColor]}>Schedule & Logistics</Text>
        <Text style={[styles.info, textColor]}>Departure Time: {routeDetail?.departureTime || 'N/A'}</Text>
        <Text style={[styles.info, textColor]}>Monthly Fee: {routeDetail?.fee || routeDetail?.monthlyFee || 'N/A'}</Text>
        <Text style={[styles.info, textColor]}>Total Distance: {displayDistance}</Text>
      </View>

      {/* Driver Contact */}
      <View style={sectionBoxStyle}>
        <Text style={[styles.sectionHeader, headerTextColor]}>Driver Contact</Text>
        <Text style={[styles.info, textColor]}>Driver Name: {routeDetail?.driverName || 'N/A'}</Text>
        <Text style={[styles.info, textColor]}>Contact No: {routeDetail?.contactNo || routeDetail?.phone || 'N/A'}</Text>
        <Text style={[styles.info, textColor]}>Vehicle No: {routeDetail?.vehicleNo || 'N/A'}</Text>
      </View>

      {/* Route Stops */}
      <View style={sectionBoxStyle}>
        <Text style={[styles.sectionHeader, headerTextColor]}>Route Stops</Text>
        {Array.isArray(routeDetail?.stops) && routeDetail.stops.length > 0 ? (
          routeDetail.stops.map((stop, index) => (
            <Text key={index} style={[styles.stopItem, textColor]}>
              Stop {index + 1}: {stop}
            </Text>
          ))
        ) : (
          <Text style={[styles.info, textColor]}>No stops available.</Text>
        )}
      </View>

      {/* Edit Route Button */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('EditRoute', { routeData: routeDetail })}
      >
        <Text style={styles.editBtnText}>✏️ Edit Route</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  section: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1, 
    elevation: 1,
  },
  sectionHeader: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8, 
  },
  info: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 6 
  },
  stopItem: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginVertical: 4 
  },
  editBtn: {
    backgroundColor: '#007acc',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  editBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});