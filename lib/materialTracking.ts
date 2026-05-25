import { ProcurementOrder } from './orderStorage';

export type MaterialStatus = 'Ordered' | 'Delivered' | 'Installed';

export interface TrackedMaterial {
  id: string;
  orderId: string;
  itemId: number;
  name: string;
  quantity: number;
  price: string;
  image: string;
  orderDate: string;
  status: MaterialStatus;
}

const KEY = 'sezapro_material_tracking';

export function getMaterialTracking(): TrackedMaterial[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function updateMaterialStatus(id: string, status: MaterialStatus): void {
  const items = getMaterialTracking().map(m => m.id === id ? { ...m, status } : m);
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function syncMaterialsFromOrders(orders: ProcurementOrder[]): TrackedMaterial[] {
  const existing = getMaterialTracking();
  const existingIds = new Set(existing.map(m => m.id));
  const newItems: TrackedMaterial[] = [];

  orders.forEach(order => {
    order.items.forEach(item => {
      const id = `${order.id}-${item.id}`;
      if (!existingIds.has(id)) {
        newItems.push({
          id,
          orderId: order.id,
          itemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price || '0',
          image: item.image || '',
          orderDate: order.date,
          status: 'Ordered',
        });
      }
    });
  });

  const merged = [...existing, ...newItems];
  if (newItems.length > 0) {
    localStorage.setItem(KEY, JSON.stringify(merged));
  }
  return merged;
}
