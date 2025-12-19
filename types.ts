
export enum VegetableType {
  CUCUMBER = 'Cucumber',
  TOMATO = 'Tomato',
  CAPSICUM = 'Capsicum',
  OTHER = 'Other'
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
  PAID = 'Paid'
}

export enum ExpenseCategory {
  SEEDS = 'Seeds',
  FERTILIZER = 'Fertilizer',
  PESTICIDE = 'Pesticide',
  LABOR = 'Labor',
  UTILITIES = 'Utilities',
  EQUIPMENT = 'Equipment',
  OTHER = 'Other'
}

export interface HarvestRecord {
  id: string;
  date: string;
  greenhouseNumber: number;
  vegetableType: VegetableType;
  otherVegetable?: string;
  weight: number;
}

export interface WorkRecord {
  id: string;
  date: string;
  greenhouseNumber: number;
  task: string;
  otherTask?: string;
  hoursWorked: number;
}

export interface Order {
  id: string;
  date: string;
  vegetableType: VegetableType;
  otherVegetable?: string;
  weight: number;
  price: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: ExpenseCategory;
  otherCategory?: string;
  description: string;
  amount: number;
}

export type ViewState = 'HOME' | 'SALES_MANAGER' | 'HARVEST' | 'WORK' | 'ORDERS' | 'REPORTS' | 'EXPENSES' | 'SETTINGS';

export interface SyncConfig {
  googleSheetUrl: string;
  lastSync: string | null;
}

export interface FarmContext {
  harvests: HarvestRecord[];
  workRecords: WorkRecord[];
  orders: Order[];
  expenses: ExpenseRecord[];
}
