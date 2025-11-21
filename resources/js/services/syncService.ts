import { useSyncQueue } from '../hooks/useSyncQueue';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useEffect } from 'react';

export const useSyncService = () => {
  const { syncWithRetry, isSyncing, error } = useSyncQueue();
  const isOnline = useOnlineStatus();

  // Sincronização automática quando conexão retorna
  useEffect(() => {
    if (isOnline && !isSyncing) {
      syncWithRetry();
    }
  }, [isOnline, isSyncing, syncWithRetry]);

  // Sincronização periódica (a cada 30 segundos quando online)
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      if (!isSyncing) {
        syncWithRetry();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline, isSyncing, syncWithRetry]);

  return {
    syncManual: () => syncWithRetry(0), // Provide a way to manually trigger with max retries
    isSyncing,
    error
  };
};
