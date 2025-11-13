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
import { useTransactions } from '../../context/TransactionContext'; // ✅ Import Context

// Komponen ContactItem (tidak berubah)
interface ContactItemProps {
  name: string;
  status: string;
  statusColor: string;
}
const ContactItem: React.FC<ContactItemProps> = ({ name, status, statusColor }) => (
  <View style={styles.contactItem}>
    <View style={styles.contactIconContainer}>
      <FontAwesome name="user" size={24} color="#4f46e5" />
    </View>
    <View style={styles.contactTextContainer}>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={[styles.contactStatus, { color: statusColor }]}>{status}</Text>
    </View>
  </View>
);

export default function DashboardScreen(): JSX.Element {
  const { transactions, totalOwe, totalReceive } = useTransactions(); // ✅ Ambil data dari context

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Manajer Utang</Text>
        <Text style={styles.headerSubtitle}>Lacak utang dan piutang Anda</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Ringkasan Total */}
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

        {/* Daftar Transaksi Terbaru */}
        <View style={styles.recentContactsSection}>
          <Text style={styles.recentContactsTitle}>Transaksi Terbaru</Text>
          <View style={styles.contactList}>
            {transactions.map((tx) => (
              <ContactItem
                key={tx.id}
                name={tx.contactName}
                status={
                  tx.type === 'owe'
                    ? `Anda berutang Rp ${tx.amount.toLocaleString('id-ID')}`
                    : `Berutang pada Anda Rp ${tx.amount.toLocaleString('id-ID')}`
                }
                statusColor={tx.type === 'owe' ? '#ef4444' : '#22c55e'}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Tombol Tambah */}
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
    backgroundColor: '#f9fafb', // abu muda lembut
  },

  // HEADER
  headerContainer: {
    backgroundColor: '#2563eb', // biru terang seperti di gambar
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

  // SCROLL AREA
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // SUMMARY CARDS
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
    backgroundColor: '#ef4444', // merah
  },
  receiveCard: {
    backgroundColor: '#22c55e', // hijau
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

  // RECENT CONTACTS
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
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIconContainer: {
    backgroundColor: '#e0e7ff', // ungu muda
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

  // FLOATING BUTTON
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
