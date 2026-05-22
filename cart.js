/*
  cart.js - UzMarket Cart State Manager
  Maintains shopping carts for guests and registered users, calculating prices, discounts, and promo codes.
*/

import { getCurrentUser } from './auth.js';
import { getProductById } from './store.js';

// Get appropriate storage key for current user
function getCartKey() {
  const user = getCurrentUser();
  return user ? `uzmarket_cart_${user.id}` : 'uzmarket_guest_cart';
}

// Get cart items
export function getCart() {
  const key = getCartKey();
  const data = localStorage.getItem(key);
  if (!data) return [];
  
  // Validate that products in cart still exist in catalog
  let cart = JSON.parse(data);
  cart = cart.filter(item => {
    const product = getProductById(item.productId);
    return product !== undefined;
  });
  return cart;
}

// Save cart items
function saveCart(cart) {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(cart));
}

// Add item to cart
export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = getProductById(productId);
  if (!product) return false;
  
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    // Check stock limit
    const newQty = existingItem.quantity + quantity;
    if (newQty > product.stock) {
      existingItem.quantity = product.stock;
    } else {
      existingItem.quantity = newQty;
    }
  } else {
    // Check stock limit
    const qty = quantity > product.stock ? product.stock : quantity;
    if (qty > 0) {
      cart.push({ productId, quantity: qty });
    }
  }
  
  saveCart(cart);
  return true;
}

// Update item quantity
export function updateQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find(item => item.productId === productId);
  const product = getProductById(productId);
  
  if (item && product) {
    if (quantity <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else if (quantity > product.stock) {
      item.quantity = product.stock;
    } else {
      item.quantity = quantity;
    }
    saveCart(cart);
    return true;
  }
  return false;
}

// Remove item from cart
export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.productId !== productId);
  saveCart(cart);
}

// Clear cart
export function clearCart() {
  const key = getCartKey();
  localStorage.removeItem(key);
}

// Merge guest cart into user cart upon login
export function mergeGuestCart() {
  const guestCart = JSON.parse(localStorage.getItem('uzmarket_guest_cart') || '[]');
  if (guestCart.length === 0) return;
  
  const user = getCurrentUser();
  if (!user) return;
  
  const userCart = getCart();
  
  guestCart.forEach(gItem => {
    const uItem = userCart.find(uItem => uItem.productId === gItem.productId);
    if (uItem) {
      uItem.quantity += gItem.quantity;
      const prod = getProductById(gItem.productId);
      if (prod && uItem.quantity > prod.stock) {
        uItem.quantity = prod.stock;
      }
    } else {
      userCart.push(gItem);
    }
  });
  
  saveCart(userCart);
  localStorage.removeItem('uzmarket_guest_cart');
}

// Calculate cart totals
export function getCartTotals(appliedPromoObj = null) {
  const cart = getCart();
  let subtotal = 0;
  let itemsCount = 0;
  
  const items = cart.map(item => {
    const product = getProductById(item.productId);
    const originalPrice = product.price;
    const finalPrice = product.discount > 0 
      ? originalPrice * (1 - product.discount / 100) 
      : originalPrice;
      
    const itemTotal = finalPrice * item.quantity;
    subtotal += itemTotal;
    itemsCount += item.quantity;
    
    return {
      product,
      quantity: item.quantity,
      originalPrice,
      finalPrice,
      totalPrice: itemTotal
    };
  });
  
  let discountAmount = 0;
  if (appliedPromoObj) {
    discountAmount = Math.round(subtotal * (appliedPromoObj.discountPercent / 100));
  }
  
  // Delivery cost: free if subtotal (after discount) > 10,000,000 UZS, otherwise 30,000 UZS
  const cartAfterPromo = subtotal - discountAmount;
  const deliveryCost = cartAfterPromo > 10000000 || cartAfterPromo === 0 ? 0 : 30000;
  const grandTotal = cartAfterPromo + deliveryCost;
  
  return {
    items,
    itemsCount,
    subtotal,
    discountAmount,
    deliveryCost,
    grandTotal
  };
}
