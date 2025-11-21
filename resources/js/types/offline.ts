export interface OfflineSale {
  id: string;
  product_id: number;
  quantity: number;
  payment_type: 'pix' | 'cash';
  received_amount_cash?: number;
  total_amount: number;
  change_cash: number;
  created_at: string;
  is_synced: boolean;
}

export interface SyncStatus {
  user_id: number;
  pending_syncs: number;
  last_sync: string | null;
  online: boolean;
}

export interface SyncResult {
  batch_id: string;
  synced_sales: Array<{
    offline_id: string;
    server_id: number;
    synced_at: string;
  }>;
  message: string;
}
