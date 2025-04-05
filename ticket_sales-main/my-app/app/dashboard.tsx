import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const mockData = {
    totalTickets: 150,
    soldTickets: 120,
    revenue: 2400,
    upcomingEvents: 3,
    recentSales: [
      { id: 1, event: 'Concert', tickets: 2, amount: 40 },
      { id: 2, event: 'Theater', tickets: 1, amount: 25 },
      { id: 3, event: 'Sports', tickets: 4, amount: 80 },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.totalTickets}</Text>
          <Text style={styles.statLabel}>Total Tickets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.soldTickets}</Text>
          <Text style={styles.statLabel}>Sold Tickets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${mockData.revenue}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.upcomingEvents}</Text>
          <Text style={styles.statLabel}>Upcoming Events</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sales</Text>
        {mockData.recentSales.map((sale) => (
          <View key={sale.id} style={styles.saleItem}>
            <View>
              <Text style={styles.saleEvent}>{sale.event}</Text>
              <Text style={styles.saleDetails}>
                {sale.tickets} tickets - ${sale.amount}
              </Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    width: '50%',
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  saleEvent: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  saleDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
}); 