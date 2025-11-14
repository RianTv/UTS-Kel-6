import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

// Komponen ContactItem
interface ContactItemProps {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  onDelete: (id: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ id, name, status, statusColor, onDelete }) => (
  <View style={styles.contactItem}>
    <View style={styles.contactIconContainer}>
      <FontAwesome name="user" size={24} color="#4f46e5" />
    </View>
    <View style={styles.contactTextContainer}>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={[styles.contactStatus, { color: statusColor }]}>{status}</Text>
    </View>

    {/* Tombol Delete */}
    <TouchableOpacity onPress={() => onDelete(id)} style={styles.deleteButton}>
      <FontAwesome name="trash" size={20} color="#ef4444" />
    </TouchableOpacity>
  </View>
);

export default function DashboardScreen(): JSX.Element {
  const { transactions, totalOwe, totalReceive, deleteTransaction } = useTransactions();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Manajer Utang</Text>
        <Text style={styles.headerSubtitle}>Lacak utang dan piutang Anda</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCardContainer}>
          <View style={[styles.summaryCard, styles.payCard]}>
            <Text style={styles.summaryCardTitle}>Anda Bayar</Text>
            <Text style={styles.summaryCardAmount}>Rp {totalOwe.toLocaleString('id-ID')}</Text>
          </View>
          <View style={[styles.summaryCard, styles.receiveCard]}>
            <Text style={styles.summaryCardTitle}>Anda Terima</Text>
            <Text style={styles.summaryCardAmount}>Rp {totalReceive.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        <View style={styles.recentContactsSection}>
          <Text style={styles.recentContactsTitle}>Transaksi Terbaru</Text>
          <View style={styles.contactList}>
            {transactions.map((tx) => (
              <ContactItem
                key={tx.id}
                id={tx.id}
                name={tx.contactName}
                status={
                  tx.type === 'owe'
                    ? `Anda berutang Rp ${tx.amount.toLocaleString('id-ID')}`
                    : `Berutang pada Anda Rp ${tx.amount.toLocaleString('id-ID')}`
                }
                statusColor={tx.type === 'owe' ? '#ef4444' : '#22c55e'}
                onDelete={deleteTransaction}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <Link href="/addTransaction" asChild>
        <TouchableOpacity style={styles.fab} activeOpacity={0.7}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCardContainer: {
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  payCard: {
    backgroundColor: '#ef4444',
  },
  receiveCard: {
    backgroundColor: '#22c55e',
  },
  summaryCardTitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  summaryCardAmount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  recentContactsSection: {
    marginTop: 4,
  },
  recentContactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIconContainer: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 999,
    marginRight: 14,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  contactStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
