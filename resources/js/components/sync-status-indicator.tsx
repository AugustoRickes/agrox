import React from 'react';
import { useSyncService } from '../services/syncService';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Icon } from './icon';
import { CloudOff, AlertCircle, UploadCloud, CheckCircle, RefreshCw } from 'lucide-react';

export const SyncStatusIndicator: React.FC = () => {
  const { isSyncing, error, syncManual } = useSyncService();
  const { pendingCount } = useOfflineStorage();
  const isOnline = useOnlineStatus();

  const getStatus = () => {
    if (!isOnline) return { color: 'text-gray-500', iconNode: CloudOff, text: 'Offline' };
    if (isSyncing) return { color: 'text-yellow-500', iconNode: RefreshCw, text: 'Sincronizando...' };
    if (error) return { color: 'text-red-500', iconNode: AlertCircle, text: 'Erro na Sincronização' };
    if (pendingCount > 0) return { color: 'text-blue-500', iconNode: UploadCloud, text: `${pendingCount} pendente(s)` };
    return { color: 'text-green-500', iconNode: CheckCircle, text: 'Sincronizado' };
  };

  const { color, iconNode, text } = getStatus();

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      <span className={color}>
        <Icon iconNode={iconNode} className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
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

