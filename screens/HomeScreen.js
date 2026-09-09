import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { SettingsContext } from '../context/SettingsContext';
import { deleteRoute, fetchRoutes } from '../src/services/api';

const ROUTES_CACHE_KEY = '@routes_cache';

export default function HomeScreen({ navigation }) {
  const { isDarkMode } = useContext(SettingsContext);

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, [])
  );

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get the latest routes from MockAPI
      const data = await fetchRoutes();

      setRoutes(data);

      // Save latest routes locally for offline use
      await AsyncStorage.setItem(
        ROUTES_CACHE_KEY,
        JSON.stringify(data)
      );

    } catch (err) {
      console.log('API request failed. Trying cached routes...');

      try {
        // Try to load previously saved routes
        const cachedRoutes = await AsyncStorage.getItem(
          ROUTES_CACHE_KEY
        );

        if (cachedRoutes !== null) {
          const parsedRoutes = JSON.parse(cachedRoutes);

          setRoutes(parsedRoutes);
          setError(null);

          console.log('Routes loaded from AsyncStorage cache.');
        } else {
          setRoutes([]);
          setError(
            'Failed to load routes. Please check your internet connection.'
          );
        }

      } catch (storageError) {
        console.error(
          'Failed to load cached routes:',
          storageError
        );

        setRoutes([]);
        setError(
          'Unable to load routes. Please try again.'
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = (id) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              await deleteRoute(id);

              // Update the displayed routes
              setRoutes((prevRoutes) => {
                const updatedRoutes = prevRoutes.filter(
                  (item) => item.id !== id
                );

                // Update local cache
                AsyncStorage.setItem(
                  ROUTES_CACHE_KEY,
                  JSON.stringify(updatedRoutes)
                ).catch((error) => {
                  console.error(
                    'Failed to update route cache:',
                    error
                  );
                });

                return updatedRoutes;
              });

              Alert.alert(
                'Success',
                'Route deleted successfully!'
              );

            } catch (err) {
              Alert.alert(
                'Error',
                'Failed to delete route.'
              );
            }
          },
        },
      ]
    );
  };

  const filteredRoutes = routes.filter((item) => {
    const routeNameMatch = item.routeName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const stopsMatch = Array.isArray(item.stops)
      ? item.stops.some((stop) =>
          stop
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : false;

    return routeNameMatch || stopsMatch;
  });

  const renderRouteItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDarkMode
            ? '#1e1e1e'
            : '#ffffff',

          borderColor: isDarkMode
            ? '#555555'
            : '#e0e0e0',
        },
      ]}
      onPress={() =>
        navigation.navigate('Detail', {
          routeDetail: item
        })
      }
    >
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            {
              color: isDarkMode
                ? '#64b5f6'
                : '#0d47a1'
            },
          ]}
        >
          {item.routeName}
        </Text>

        <TouchableOpacity
          onPress={() => handleDeleteRoute(item.id)}
        >
          <Text style={styles.deleteIcon}>
            🗑️
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.cardSub,
          {
            color: isDarkMode
              ? '#cccccc'
              : '#222222'
          },
        ]}
      >
        Departure: {item.departureTime}
      </Text>

      <Text
        style={[
          styles.cardFee,
          {
            color: isDarkMode
              ? '#81c784'
              : '#1b5e20'
          },
        ]}
      >
        Fee: {item.fee || item.monthlyFee}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? '#121212'
            : '#f5f5f5'
        },
      ]}
    >
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: isDarkMode
              ? '#1e1e1e'
              : '#ffffff',

            color: isDarkMode
              ? '#ffffff'
              : '#000000',

            borderColor: isDarkMode
              ? '#444444'
              : '#dddddd',
          },
        ]}
        placeholder="Search route or stop name..."
        placeholderTextColor={
          isDarkMode ? '#aaaaaa' : '#888888'
        }
        value={searchQuery}
        onChangeText={(text) =>
          setSearchQuery(text)
        }
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          navigation.navigate('AddRoute')
        }
      >
        <Text style={styles.btnText}>
          ➕ Add New Route
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            size="large"
            color="#1a73e8"
          />

          <Text
            style={{
              color: isDarkMode
                ? '#ffffff'
                : '#000000',

              marginTop: 10
            }}
          >
            Loading routes from MockAPI...
          </Text>
        </View>

      ) : error ? (
        <View style={styles.centerState}>
          <Text
            style={[
              styles.errorText,
              { color: '#d32f2f' }
            ]}
          >
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={loadRoutes}
          >
            <Text style={styles.btnText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>

      ) : (
        <FlatList
          data={filteredRoutes}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderRouteItem}
          onRefresh={loadRoutes}
          refreshing={loading}

          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                {
                  color: isDarkMode
                    ? '#aaaaaa'
                    : '#888888'
                },
              ]}
            >
              No routes found.
            </Text>
          }
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.btn,
            styles.profileBtn
          ]}
          onPress={() =>
            navigation.navigate('Profile')
          }
        >
          <Text style={styles.btnText}>
            👤 Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            styles.settingsBtn
          ]}
          onPress={() =>
            navigation.navigate('Settings')
          }
        >
          <Text style={styles.btnText}>
            ⚙️ Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  searchInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
  },

  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  deleteIcon: {
    fontSize: 18,
    paddingLeft: 8,
  },

  cardSub: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },

  cardFee: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },

  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },

  retryBtn: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },

  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  profileBtn: {
    backgroundColor: '#1a73e8',
  },

  settingsBtn: {
    backgroundColor: '#333333',
  },

  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});