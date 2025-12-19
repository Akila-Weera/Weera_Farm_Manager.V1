
import React from 'react';
import { ExpenseCategory, Order, VegetableType, OrderStatus, PaymentStatus } from './types';

export const CORRECT_PIN = '999000';
export const DEFAULT_SYNC_URL = 'https://script.google.com/macros/s/AKfycbxkZS-XpGxt6ibS9mVXv_h461nPRZw8r6j-0jDJaaYW7X1LkHkUTUFAt7S17fM7nBCw/exec';
export const GREENHOUSES = [1, 2, 3, 4];
export const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

export const TASKS = ['Water', 'Fertilizer', 'Pesticide', 'Pruning', 'Planting', 'Maintenance', 'Other'];

export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export const COLORS = {
  primary: '#16a34a',
  secondary: '#2563eb',
  accent: '#ea580c',
  background: '#f9fafb',
  error: '#ef4444'
};

export const INITIAL_ORDERS: Order[] = [
  { id: '3', date: '2025-07-30', vegetableType: VegetableType.CUCUMBER, weight: 38.9, price: 230, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '4', date: '2025-07-27', vegetableType: VegetableType.CUCUMBER, weight: 35.3, price: 250, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '5', date: '2025-07-25', vegetableType: VegetableType.CUCUMBER, weight: 56.0, price: 160, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '6', date: '2025-07-24', vegetableType: VegetableType.CUCUMBER, weight: 59.7, price: 170, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '7', date: '2025-07-22', vegetableType: VegetableType.CUCUMBER, weight: 44.3, price: 165, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '8', date: '2025-07-20', vegetableType: VegetableType.CUCUMBER, weight: 42.0, price: 140, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '9', date: '2025-07-06', vegetableType: VegetableType.CUCUMBER, weight: 25.0, price: 170, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '10', date: '2025-07-05', vegetableType: VegetableType.CUCUMBER, weight: 50.0, price: 170, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '11', date: '2025-07-01', vegetableType: VegetableType.CUCUMBER, weight: 51.0, price: 120, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '12', date: '2025-08-03', vegetableType: VegetableType.CUCUMBER, weight: 32.5, price: 170, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '13', date: '2025-08-05', vegetableType: VegetableType.CUCUMBER, weight: 42.0, price: 180, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '14', date: '2025-08-07', vegetableType: VegetableType.CUCUMBER, weight: 23.0, price: 210, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '15', date: '2025-08-10', vegetableType: VegetableType.CUCUMBER, weight: 23.0, price: 200, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '16', date: '2025-08-09', vegetableType: VegetableType.CUCUMBER, weight: 64.25, price: 200, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '17', date: '2025-08-11', vegetableType: VegetableType.CUCUMBER, weight: 54.50, price: 200, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '19', date: '2025-08-19', vegetableType: VegetableType.CUCUMBER, weight: 54.00, price: 165, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '20', date: '2025-08-16', vegetableType: VegetableType.CUCUMBER, weight: 30.00, price: 190, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '21', date: '2025-08-14', vegetableType: VegetableType.CUCUMBER, weight: 23.00, price: 200, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '22', date: '2025-08-20', vegetableType: VegetableType.CUCUMBER, weight: 23.00, price: 105, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '23', date: '2025-08-23', vegetableType: VegetableType.CUCUMBER, weight: 67.00, price: 105, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '24', date: '2025-08-22', vegetableType: VegetableType.CUCUMBER, weight: 85.50, price: 120, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '25', date: '2025-08-25', vegetableType: VegetableType.CUCUMBER, weight: 108.00, price: 100, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '26', date: '2025-08-26', vegetableType: VegetableType.CUCUMBER, weight: 51.20, price: 100, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '28', date: '2025-08-28', vegetableType: VegetableType.CUCUMBER, weight: 52.30, price: 150, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '29', date: '2025-09-04', vegetableType: VegetableType.CUCUMBER, weight: 109.00, price: 180, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '30', date: '2025-09-01', vegetableType: VegetableType.CUCUMBER, weight: 30.80, price: 130, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '31', date: '2025-09-05', vegetableType: VegetableType.CUCUMBER, weight: 32.60, price: 180, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '32', date: '2025-09-07', vegetableType: VegetableType.CUCUMBER, weight: 71.90, price: 140, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '33', date: '2025-09-09', vegetableType: VegetableType.CUCUMBER, weight: 31.80, price: 160, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '34', date: '2025-09-13', vegetableType: VegetableType.CUCUMBER, weight: 22.00, price: 135, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '36', date: '2025-09-16', vegetableType: VegetableType.CUCUMBER, weight: 29.60, price: 160, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '37', date: '2025-09-26', vegetableType: VegetableType.CUCUMBER, weight: 40.20, price: 200, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '38', date: '2025-09-22', vegetableType: VegetableType.CUCUMBER, weight: 55.90, price: 250, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '39', date: '2025-10-02', vegetableType: VegetableType.CUCUMBER, weight: 39.50, price: 120, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '40', date: '2025-10-08', vegetableType: VegetableType.CUCUMBER, weight: 190.00, price: 49.90, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '41', date: '2025-10-13', vegetableType: VegetableType.CUCUMBER, weight: 34.00, price: 190, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID },
  { id: '42', date: '2025-10-11', vegetableType: VegetableType.CUCUMBER, weight: 30.00, price: 190, orderStatus: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID }
];
