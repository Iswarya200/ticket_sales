import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function SuggestionsScreen() {
  const mockData = {
    recommendations: [
      {
        id: 1,
        title: 'Increase Ticket Prices',
        description: 'Based on demand, consider increasing prices by 10% for premium events',
        impact: 'High',
        category: 'Pricing',
      },
      {
        id: 2,
        title: 'Add More Weekend Events',
        description: 'Weekend events show 30% higher attendance than weekday events',
        impact: 'Medium',
        category: 'Scheduling',
      },
      {
        id: 3,
        title: 'Expand Marketing Channels',
        description: 'Social media campaigns have shown 2x better conversion rates',
        impact: 'High',
        category: 'Marketing',
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Suggestions</Text>
      </View>

      {mockData.recommendations.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor(item.impact) }]}>
              <Text style={styles.impactText}>{item.impact}</Text>
            </View>
          </View>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'high':
      return '#FF3B30';
    case 'medium':
      return '#FF9500';
    case 'low':
      return '#34C759';
    default:
      return '#007AFF';
  }
};

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
  card: {
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
}); 