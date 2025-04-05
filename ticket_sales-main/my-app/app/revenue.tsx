import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function RevenueScreen() {
  const mockData = {
    totalRevenue: 50000,
    monthlyRevenue: 12000,
    averageTicketPrice: 25,
    topEvents: [
      { name: 'Summer Festival', revenue: 15000 },
      { name: 'Concert Series', revenue: 12000 },
      { name: 'Sports Event', revenue: 8000 },
      { name: 'Theater Show', revenue: 5000 },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Revenue Analytics</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${mockData.totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${mockData.monthlyRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${mockData.averageTicketPrice}</Text>
          <Text style={styles.statLabel}>Avg. Ticket Price</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performing Events</Text>
        {mockData.topEvents.map((event) => (
          <View key={event.name} style={styles.eventItem}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventRevenue}>${event.revenue.toLocaleString()}</Text>
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
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  eventRevenue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
}); 