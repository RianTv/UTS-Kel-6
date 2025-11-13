import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

// 1. Mendefinisikan Tipe Data
export interface Transaction {
  id: string;
  contactName: string;
  type: 'owe' | 'receive'; // 'owe' = saya utang, 'receive' = saya diutangi
  amount: number;
  description?: string;
  date: Date;
}

// Tipe data untuk input transaksi baru (tanpa id dan date)
export type NewTransactionInput = Omit<Transaction, 'id' | 'date'>;

// 2. Mendefinisikan Tipe Konteks
interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (tx: NewTransactionInput) => void;
  totalOwe: number;
  totalReceive: number;
}

// 3. Membuat Konteks
const TransactionContext = createContext<TransactionContextType | null>(null);

// 4. Membuat Provider (Pembungkus)
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  // [STATE] Menyimpan semua transaksi di sini
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Data awal untuk contoh
    { id: '1', contactName: 'Rizal (Contoh)', type: 'owe', amount: 50000, date: new Date(), description: 'Makan siang' },
    { id: '2', contactName: 'Sarah (Contoh)', type: 'receive', amount: 75000, date: new Date(), description: 'Tiket bioskop' },
    { id: '3', contactName: 'Ahmad (Contoh)', type: 'owe', amount: 30000, date: new Date(), description: 'Bensin' },
  ]);

  // [FUNGSI] Logika untuk menambah transaksi baru
  const addTransaction = (tx: NewTransactionInput) => {
    const newTransaction: Transaction = {
      ...tx,
      id: Math.random().toString(36).substring(2, 9), // ID acak
      date: new Date(),
    };
    
    // Menambah transaksi baru ke daftar state
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  // [MEMO] Menghitung total utang (owe) dan piutang (receive)
  const { totalOwe, totalReceive } = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      if (tx.type === 'owe') {
        acc.totalOwe += tx.amount;
      } else {
        acc.totalReceive += tx.amount;
      }
      return acc;
    }, { totalOwe: 0, totalReceive: 0 });
  }, [transactions]);

  // Nilai yang akan dibagikan ke semua komponen di dalamnya
  const value = {
    transactions,
    addTransaction,
    totalOwe,
    totalReceive,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// 5. Membuat Hook (useTransactions)
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions harus digunakan di dalam TransactionProvider');
  }
  return context;
};