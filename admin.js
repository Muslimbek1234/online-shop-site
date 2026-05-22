/*
  admin.js - UzMarket Admin Panel Data & Analytics Manager
  Calculates dashboard statistics, provides CRUD triggers, and manages orders/users lists.
*/

import { getDB, saveDB, getProducts, getOrders } from './store.js';

// Calculate admin dashboard metrics
export function getAdminStats() {
  const db = getDB();
  const products = db.products;
  const orders = db.orders;
  const users = db.users;

  // 1. Total revenue (exclude canceled orders)
  const activeOrders = orders.filter(o => o.status !== 'Bekor qilingan');
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);

  // 2. Orders from today (UTC / local comparison)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.date.slice(0, 10) === todayStr);
  const todaySales = todayOrders.filter(o => o.status !== 'Bekor qilingan').reduce((sum, o) => sum + o.total, 0);

  // 3. Count order statuses
  const statusCounts = {
    yangi: orders.filter(o => o.status === 'Yangi').length,
    confirmed: orders.filter(o => o.status === 'Tasdiqlangan').length,
    shipped: orders.filter(o => o.status === 'Yo\'lda').length,
    delivered: orders.filter(o => o.status === 'Yetkazilgan').length,
    canceled: orders.filter(o => o.status === 'Bekor qilingan').length
  };

  // 4. Low stock products alert (stock < 5)
  const lowStockProducts = products.filter(p => p.stock < 5);

  // 5. Popular products sold count
  const productSales = {};
  activeOrders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    });
  });

  const popularProducts = Object.entries(productSales)
    .map(([id, qty]) => {
      const prod = products.find(p => p.id === id);
      return {
        productName: prod ? prod.name : 'Unknown Product',
        brand: prod ? prod.brand : '',
        category: prod ? prod.category : '',
        quantitySold: qty,
        revenue: qty * (prod ? (prod.price * (1 - prod.discount / 100)) : 0)
      };
    })
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);

  return {
    totalSales,
    todaySales,
    totalOrdersCount: orders.length,
    todayOrdersCount: todayOrders.length,
    statusCounts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    popularProducts,
    totalUsersCount: users.filter(u => u.role !== 'admin').length
  };
}

// User List helper
export function getRegisteredUsers() {
  const db = getDB();
  return db.users.filter(u => u.role !== 'admin');
}
