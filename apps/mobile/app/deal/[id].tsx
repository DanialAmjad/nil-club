import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { getDealPayments } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const dealId = parseInt(id || '0', 10);

  const {
    data: payments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['deal-payments', dealId],
    queryFn: () => getDealPayments(dealId),
    enabled: dealId > 0,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (!id) {
    return (
      <ErrorMessage message="Invalid deal ID." onRetry={() => {}} />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load payment details. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (!payments) {
    return (
      <ErrorMessage message="No payment data available." onRetry={refetch} />
    );
  }

  // Calculate totals
  const totalAmount = payments.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );
  const completedAmount = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

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
      {/* Payment Summary */}
      <Card style={styles.summaryCard}>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Total Deal Value</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalAmount)}
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryGridItem}>
            <Text style={styles.gridLabel}>Received</Text>
            <Text style={styles.gridValue}>{formatCurrency(completedAmount)}</Text>
          </View>
          <View style={styles.summaryGridDivider} />
          <View style={styles.summaryGridItem}>
            <Text style={styles.gridLabel}>Pending</Text>
            <Text style={styles.gridValue}>{formatCurrency(pendingAmount)}</Text>
          </View>
        </View>
      </Card>

      {/* Payment Progress */}
      <Card style={styles.progressCard}>
        <Text style={styles.progressLabel}>Payment Progress</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFilled,
              {
                width: `${totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {totalAmount > 0 ? Math.round((completedAmount / totalAmount) * 100) : 0}% complete
        </Text>
      </Card>

      {/* Payments List */}
      <View style={styles.paymentsSection}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        {payments.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={payments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: payment }) => (
              <Card style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentAmount}>
                      {formatCurrency(payment.amount)}
                    </Text>
                    <View style={styles.paymentDates}>
                      <Text style={styles.dateLabel}>Due:</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(payment.dueDate)}
                      </Text>
                    </View>
                  </View>
                  <StatusBadge status={payment.status} size="small" />
                </View>

                {payment.paidDate && (
                  <View style={styles.paymentPaidDate}>
                    <Text style={styles.dateLabel}>Paid:</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(payment.paidDate)}
                    </Text>
                  </View>
                )}
              </Card>
            )}
          />
        ) : (
          <Card>
            <Text style={styles.emptyMessage}>
              No payments recorded for this deal yet.
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
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  summarySection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryGridDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  gridLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066cc',
  },
  progressCard: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFilled: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  paymentsSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  paymentCard: {
    marginVertical: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  paymentInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentDates: {
    flexDirection: 'row',
    marginTop: 8,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  dateValue: {
    fontSize: 12,
    color: '#1f2937',
    fontWeight: '500',
  },
  paymentPaidDate: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
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
