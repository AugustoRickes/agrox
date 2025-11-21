import React from 'react';
import { useSyncService } from '../services/syncService';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Icon } from './icon'; // Assuming an Icon component exists

export const SyncStatusIndicator: React.FC = () => {
  const { isSyncing, error, syncManual } = useSyncService();
  const { pendingCount } = useOfflineStorage();
  const isOnline = useOnlineStatus();

  const getStatus = () => {
    if (!isOnline) return { color: 'text-red-500', icon: 'offline', text: 'Offline' };
    if (isSyncing) return { color: 'text-yellow-500', icon: 'sync', text: 'Sincronizando...' };
    if (error) return { color: 'text-orange-500', icon: 'error', text: 'Erro' };
    if (pendingCount > 0) return { color: 'text-blue-500', icon: 'upload', text: `${pendingCount} pendente(s)` };
    return { color: 'text-green-500', icon: 'check-circle', text: 'Sincronizado' };
  };

  const { color, icon, text } = getStatus();

  return (
    <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
      <span className={color}>
        <Icon name={icon} className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
      </span>
      <span>{text}</span>
      
      {(pendingCount > 0 && isOnline && !isSyncing) || error ? (
        <button
          onClick={() => syncManual()}
          className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          disabled={isSyncing}
        >
          {error ? 'Tentar Novamente' : 'Sincronizar Agora'}
        </button>
      ) : null}
    </div>
  );
};
