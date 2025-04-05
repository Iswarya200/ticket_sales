import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter, usePathname } from 'expo-router';
import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <CustomHeader />,
        }}
        redirect={true}
      />
      <Stack.Screen
        name="login"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="audience"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="revenue"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="suggestions"
        options={{
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
}

function CustomHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (pathname === '/login' || pathname === '/register') {
      setIsLoggedIn(false);
    } else if (pathname !== '/') {
      setIsLoggedIn(true);
    }
  }, [pathname]);

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {isLoggedIn ? (
            <TouchableOpacity 
              onPress={() => navigateTo('/dashboard')} 
              style={styles.homeButton}
            >
              <Text style={styles.title}>Chillr</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.title}>Chillr</Text>
          )}
        </View>
        {isLoggedIn ? (
          <View style={styles.navButtons}>
            <TouchableOpacity 
              onPress={() => navigateTo('/dashboard')} 
              style={[styles.navButton, pathname === '/dashboard' && styles.navButtonActive]}
            >
              <MaterialIcons name="dashboard" size={20} color="#FFFFFF" />
              <Text style={styles.navButton}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigateTo('/audience')} 
              style={[styles.navButton, pathname === '/audience' && styles.navButtonActive]}
            >
              <MaterialIcons name="people" size={20} color="#FFFFFF" />
              <Text style={styles.navButton}>Audience</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigateTo('/revenue')} 
              style={[styles.navButton, pathname === '/revenue' && styles.navButtonActive]}
            >
              <MaterialIcons name="attach-money" size={20} color="#FFFFFF" />
              <Text style={styles.navButton}>Revenue</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigateTo('/suggestions')} 
              style={[styles.navButton, pathname === '/suggestions' && styles.navButtonActive]}
            >
              <MaterialIcons name="lightbulb" size={20} color="#FFFFFF" />
              <Text style={styles.navButton}>Suggestions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navButtons}>
            <TouchableOpacity 
              onPress={() => navigateTo('/login')} 
              style={[styles.navButton, pathname === '/login' && styles.navButtonActive]}
            >
              <MaterialIcons name="login" size={20} color="#FFFFFF" />
              <Text style={styles.navButton}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.content}>
        {/* Rest of the component content */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A90E2',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButton: {
    cursor: 'pointer',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  navButton: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButtonActive: {
    backgroundColor: '#357ABD',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
});
