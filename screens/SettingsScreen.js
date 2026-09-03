import { useContext, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SettingsContext } from '../context/SettingsContext';

export default function SettingsScreen() {
  // toggleMiles and toggleDarkMode Functions  import
  const { isMiles, toggleMiles, isDarkMode, toggleDarkMode } = useContext(SettingsContext);

  // Local State for Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000' }]}>
        Application Settings
      </Text>

      {/* 1. Distance Unit Setting */}
      <View style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#eee' }]}>
        <Text style={[styles.label, { color: isDarkMode ? '#ddd' : '#333' }]}>
          Use Miles instead of Kilometers
        </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#1a73e8' }}
          thumbColor={isMiles ? '#fff' : '#f4f3f4'}
          value={isMiles}
          onValueChange={toggleMiles} // AsyncStorage Save  Function
        />
      </View>

      {/* 2. Dark Theme Setting */}
      <View style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#eee' }]}>
        <Text style={[styles.label, { color: isDarkMode ? '#ddd' : '#333' }]}>
          Enable Dark Theme
        </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#1a73e8' }}
          thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          value={isDarkMode}
          onValueChange={toggleDarkMode} // AsyncStorage Save  Function 
        />
      </View>

      {/* 3. Bus Arrival Alerts */}
      <View style={[styles.settingRow, { borderBottomColor: isDarkMode ? '#333' : '#eee' }]}>
        <View style={styles.textGroup}>
          <Text style={[styles.label, { color: isDarkMode ? '#ddd' : '#333' }]}>
            Bus Arrival Alerts
          </Text>
          <Text style={[styles.subLabel, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Get notified 5 mins before shuttle arrives
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#34a853' }}
          thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          value={notificationsEnabled}
          onValueChange={(value) => setNotificationsEnabled(value)}
        />
      </View>

      {/* Status Info */}
      <Text style={[styles.statusText, { color: isDarkMode ? '#aaa' : '#666' }]}>
        Current Display Unit:{' '}
        <Text style={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>
          {isMiles ? 'Miles (mi)' : 'Kilometers (km)'}
        </Text>
      </Text>

      <Text style={[styles.statusText, { color: isDarkMode ? '#aaa' : '#666', marginTop: 8 }]}>
        Active Theme:{' '}
        <Text style={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>
          {isDarkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
        </Text>
      </Text>

      <Text style={[styles.statusText, { color: isDarkMode ? '#aaa' : '#666', marginTop: 8 }]}>
        Alerts Status:{' '}
        <Text style={{ fontWeight: 'bold', color: isDarkMode ? '#fff' : '#000' }}>
          {notificationsEnabled ? 'Enabled 🔔' : 'Disabled 🔕'}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  textGroup: { flex: 1, paddingRight: 10 },
  label: { fontSize: 15 },
  subLabel: { fontSize: 12, marginTop: 2 },
  statusText: { marginTop: 16, fontSize: 14 },
});