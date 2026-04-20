import { CartItem } from './cartStore';

export interface ProcurementOrder {
  id: string;
  userEmail: string;
  userName: string;
  date: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
  estimateId?: string;
}

const STORAGE_KEY = 'sezapro_orders';

export function getAllOrders(): ProcurementOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getOrdersForUser(email: string): ProcurementOrder[] {
  return getAllOrders().filter(o => o.userEmail === email);
}

export function saveOrder(order: Omit<ProcurementOrder, 'status' | 'timestamp' | 'date'>): ProcurementOrder {
  const all = getAllOrders();
  const newOrder: ProcurementOrder = {
    ...order,
    status: 'Pending',
    timestamp: Date.now(),
    date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newOrder, ...all]));
  return newOrder;
}

export function deleteOrder(id: string): void {
  const all = getAllOrders().filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
