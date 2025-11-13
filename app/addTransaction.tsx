import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// [INTEGRASI] 1. Impor hook useTransactions dan tipe NewTransactionInput
import { NewTransactionInput, useTransactions } from '../context/TransactionContext';

/**
 * Halaman untuk menambah transaksi baru.
 */
export default function AddTransactionScreen(): JSX.Element {
  // [INTEGRASI] 2. Dapatkan fungsi addTransaction dari context
  const { addTransaction } = useTransactions();
  // [INTEGRASI] 3. Dapatkan router untuk kembali ke halaman sebelumnya
  const router = useRouter();

  // State untuk form
  const [contactName, setContactName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  // 'owe' = Saya utang, 'receive' = Saya diutangi
  const [transactionType, setTransactionType] = useState<'owe' | 'receive'>('owe');

  // Fungsi untuk menangani input jumlah (hanya angka)
  const handleAmountChange = (text: string) => {
    if (/^\d*$/.test(text)) { // Hanya izinkan angka (tanpa desimal)
      setAmount(text);
    }
  };

  // [INTEGRASI] 4. Fungsi untuk menyimpan transaksi
  const handleAddTransaction = () => {
    const numericAmount = parseInt(amount, 10);

    // Validasi input
    if (!contactName.trim()) {
      Alert.alert('Error', 'Nama kontak tidak boleh kosong.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Jumlah (amount) harus angka lebih besar dari 0.');
      return;
    }

    // Membuat objek transaksi baru
    const newTransaction: NewTransactionInput = {
      contactName: contactName.trim(),
      type: transactionType,
      amount: numericAmount,
      description: description.trim() || undefined, // Set undefined jika kosong
    };

    // Memanggil fungsi dari context
    addTransaction(newTransaction);

    // Kembali ke halaman dasbor
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      
      {/* Header Kustom */}
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: '#fff',
          headerTitle: 'Add Transaction',
          headerBackTitleVisible: false,
        }} 
      />
      
      {/* Menggunakan KeyboardAvoidingView agar form tidak tertutup keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
      >
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Agar bisa klik tombol saat keyboard terbuka
        >

          {/* Grup Form: Nama Kontak */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              placeholderTextColor="#9ca3af"
              value={contactName}
              onChangeText={setContactName}
              returnKeyType="next"
            />
          </View>

          {/* Grup Form: Tipe Transaksi */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.buttonGroup}>
              {/* Tombol: I Owe Them */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'owe' ? styles.typeButtonActiveOwe : styles.typeButtonInactive
                ]}
                onPress={() => setTransactionType('owe')}
              >
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'owe' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                ]}>
                  I Owe Them
                </Text>
              </TouchableOpacity>
              
              {/* Tombol: They Owe Me */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  transactionType === 'receive' ? styles.typeButtonActiveReceive : styles.typeButtonInactive
                ]}
                onPress={() => setTransactionType('receive')}
              >
                <Text style={[
                  styles.typeButtonText,
                  transactionType === 'receive' ? styles.typeButtonTextActive : styles.typeButtonTextInactive
                ]}>
                  They Owe Me
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Grup Form: Jumlah (Rp) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount (Rp)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="number-pad" // Keyboard angka
              returnKeyType="next"
            />
          </View>

          {/* Grup Form: Deskripsi */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Lunch, Movie ticket"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              returnKeyType="done"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Tombol Submit di Bawah */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.submitButton} 
          activeOpacity={0.7}
          // [INTEGRASI] 5. Panggil fungsi handleAddTransaction
          onPress={handleAddTransaction}
        >
          <Text style={styles.submitButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb', // Latar belakang abu-abu muda
  },
  flexContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Ruang di bawah
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
    color: '#111827',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeButtonActiveOwe: {
    backgroundColor: '#ef4444', // Merah
    borderColor: '#ef4444',
  },
  typeButtonActiveReceive: {
    backgroundColor: '#22c55e', // Hijau
    borderColor: '#22c55e',
  },
  typeButtonInactive: {
    backgroundColor: 'white',
    borderColor: '#d1d5db',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  typeButtonTextInactive: {
    color: '#374151',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#3b82f6', // Biru
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});