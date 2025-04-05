import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AudienceScreen() {
  const mockData = {
    totalAudience: 5000,
    activeUsers: 3200,
    newUsers: 150,
    returningUsers: 2800,
    demographics: {
      age: {
        '18-24': 30,
        '25-34': 45,
        '35-44': 15,
        '45+': 10,
      },
      gender: {
        male: 55,
        female: 45,
      },
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Audience Insights</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.totalAudience}</Text>
          <Text style={styles.statLabel}>Total Audience</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.activeUsers}</Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.newUsers}</Text>
          <Text style={styles.statLabel}>New Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mockData.returningUsers}</Text>
          <Text style={styles.statLabel}>Returning Users</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age Distribution</Text>
        {Object.entries(mockData.demographics.age).map(([range, percentage]) => (
          <View key={range} style={styles.distributionItem}>
            <Text style={styles.distributionLabel}>{range}</Text>
            <View style={styles.percentageBar}>
              <View style={[styles.percentageFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender Distribution</Text>
        {Object.entries(mockData.demographics.gender).map(([gender, percentage]) => (
          <View key={gender} style={styles.distributionItem}>
            <Text style={styles.distributionLabel}>{gender}</Text>
            <View style={styles.percentageBar}>
              <View style={[styles.percentageFill, { width: `${percentage}%` }]} />
            </View>
            <Text style={styles.percentageText}>{percentage}%</Text>
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
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  distributionLabel: {
    width: 60,
    fontSize: 14,
    color: '#333',
  },
  percentageBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  percentageFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  percentageText: {
    width: 40,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
}); 