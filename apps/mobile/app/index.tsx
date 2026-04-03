import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { getAthleteEarnings } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

// For now, we're showing athlete with ID 1
// In a real app, this would be from authentication
const ATHLETE_ID = 1;

export default function EarningsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: earningsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['earnings', ATHLETE_ID],
    queryFn: () => getAthleteEarnings(ATHLETE_ID),
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDealPress = (dealId: number) => {
    router.push(`/deal/${dealId}`);
  };

  if (isLoading && !earningsData) {
    return <LoadingSpinner />;
  }

  if (error && !earningsData) {
    return (
      <ErrorMessage
        message="Failed to load earnings. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (!earningsData) {
    return (
      <ErrorMessage message="No earnings data available." onRetry={refetch} />
    );
  }

  const { athlete, totalEarnings, totalPending, totalDeals } = earningsData;
  const deals = athlete.deals || [];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#0066cc']}
          tintColor="#0066cc"
        />
      }
    >
      {/* Athlete Header */}
      <Card style={styles.athleteHeader}>
        <Text style={styles.athleteName}>{athlete.name}</Text>
        <Text style={styles.athleteDetails}>
          {athlete.sport} • {athlete.school}
        </Text>
      </Card>

      {/* Earnings Summary */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Earned</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(totalEarnings)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(totalPending)}
            </Text>
          </View>
        </View>
      </Card>

      {/* Stats */}
      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Active Deals</Text>
        <Text style={styles.statsNumber}>{totalDeals}</Text>
      </Card>

      {/* Deals List */}
      <View style={styles.dealsSection}>
        <Text style={styles.sectionTitle}>Your Deals</Text>
        {deals.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={deals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: deal }) => (
              <TouchableOpacity
                onPress={() => handleDealPress(deal.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.dealCard}>
                  <View style={styles.dealHeader}>
                    <View style={styles.dealInfo}>
                      <Text style={styles.dealBrand}>{deal.brandName}</Text>
                      <Text style={styles.dealDescription}>
                        {deal.description || 'No description'}
                      </Text>
                    </View>
                    <StatusBadge status={deal.status} size="small" />
                  </View>
                  <View style={styles.dealValue}>
                    <Text style={styles.dealValueLabel}>Deal Value</Text>
                    <Text style={styles.dealValueAmount}>
                      {formatCurrency(deal.dealValue)}
                    </Text>
                  </View>
                  <Text style={styles.dealTapHint}>Tap to view details</Text>
                </Card>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Card>
            <Text style={styles.emptyMessage}>
              No deals yet. Check back soon!
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  athleteHeader: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  athleteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  athleteDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dealsSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  dealCard: {
    marginVertical: 4,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dealInfo: {
    flex: 1,
    marginRight: 12,
  },
  dealBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  dealDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  dealValue: {
    marginBottom: 8,
  },
  dealValueLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  dealValueAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  dealTapHint: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});
