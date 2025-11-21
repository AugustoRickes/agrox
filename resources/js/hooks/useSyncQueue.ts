import { useState, useCallback } from 'react';
import { useOfflineStorage } from './useOfflineStorage';
import { useOnlineStatus } from './useOnlineStatus';
import { SyncResult } from '../types/offline';

const MAX_RETRIES = 3;

export const useSyncQueue = () => {
  const { getPendingSales, markAsSynced } = useOfflineStorage();
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncSales = useCallback(async (): Promise<SyncResult | null> => {
    if (!isOnline) {
      setError('Sem conexão com a internet');
      return null;
    }

    const pendingSales = getPendingSales();
    if (pendingSales.length === 0) {
      setError(null);
      return null;
    }

    setIsSyncing(true);
    setError(null);

    try {
      const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

      const response = await fetch('/sync/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({ sales: pendingSales }),
      });

      if (response.ok) {
        const result: SyncResult = await response.json();
        markAsSynced(result.synced_sales);
        setError(null);
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na sincronização');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, getPendingSales, markAsSynced]);

  const syncWithRetry = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      await syncSales();
    } catch (err) {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => syncWithRetry(retryCount + 1), delay);
      }
    }
  }, [syncSales]);

  return {
    syncSales,
    syncWithRetry,
    isSyncing,
    error,
    clearError: () => setError(null)
  };
};