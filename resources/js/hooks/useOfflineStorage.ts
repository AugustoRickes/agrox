import { useState, useEffect, useCallback } from 'react';
import { OfflineSale } from '../types/offline';

const STORAGE_KEY = 'offline_sales';

export const useOfflineStorage = () => {
  const [sales, setSales] = useState<OfflineSale[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const loadSales = useCallback((): OfflineSale[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const sales = stored ? JSON.parse(stored) : [];
      setPendingCount(sales.filter((s: OfflineSale) => !s.is_synced).length);
      return sales;
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    setSales(loadSales());
  }, [loadSales]);

  const saveSales = (newSales: OfflineSale[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSales));
    setSales(newSales);
    setPendingCount(newSales.filter(s => !s.is_synced).length);
  };

  const addSale = (sale: Omit<OfflineSale, 'id' | 'is_synced' | 'created_at'>) => {
    const currentSales = loadSales();
    const newSale: OfflineSale = {
      ...sale,
      id: crypto.randomUUID(),
      is_synced: false,
      created_at: new Date().toISOString()
    };

    const updatedSales = [...currentSales, newSale];
    saveSales(updatedSales);
    return newSale;
  };

  const markAsSynced = (syncedResults: { offline_id: string }[]) => {
    const offlineIds = syncedResults.map(r => r.offline_id);
    const updatedSales = loadSales().map(sale =>
      offlineIds.includes(sale.id)
        ? { ...sale, is_synced: true }
        : sale
    );
    saveSales(updatedSales);
  };

  const getPendingSales = (): OfflineSale[] => {
    return loadSales().filter(sale => !sale.is_synced);
  };

  const clearSyncedSales = () => {
    const pendingOnly = loadSales().filter(sale => !sale.is_synced);
    saveSales(pendingOnly);
  };

  return {
    sales,
    addSale,
    markAsSynced,
    getPendingSales,
    clearSyncedSales,
    pendingCount
  };
};
