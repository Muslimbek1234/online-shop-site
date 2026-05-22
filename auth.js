/*
  auth.js - UzMarket Authentication & Profile Manager
  Controls current session, logins, registrations, profile edits, and addresses.
*/

import { getDB, saveDB } from './store.js';

const SESSION_KEY = 'uzmarket_session';

// Get current active session
export function getCurrentUser() {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;
  
  // Refresh data from DB to get the latest profile changes/orders
  const userSession = JSON.parse(session);
  const db = getDB();
  const latestUser = db.users.find(u => u.id === userSession.id);
  if (latestUser) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(latestUser));
    return latestUser;
  }
  return userSession;
}

// Log in
export function login(email, password) {
  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (!user) {
    return { success: false, messageUz: 'Bunday email mavjud emas!', messageRu: 'Email не найден!', messageEn: 'Email not found!' };
  }
  
  if (user.password !== password) {
    return { success: false, messageUz: 'Parol noto\'g\'ri!', messageRu: 'Неверный пароль!', messageEn: 'Incorrect password!' };
  }
  
  // Save to session
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, user };
}

// Register a new user
export function register(name, email, phone, password) {
  const db = getDB();
  
  // Check if email already registered
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return { success: false, messageUz: 'Ushbu email bilan ro\'yxatdan o\'tilgan!', messageRu: 'Этот email уже зарегистрирован!', messageEn: 'Email already registered!' };
  }
  
  const newUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    email: email.trim(),
    password: password,
    role: 'user',
    name: name.trim(),
    phone: phone.trim(),
    addresses: [],
    defaultAddressIndex: -1,
    birthday: '',
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  saveDB(db);
  
  // Auto login
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return { success: true, user: newUser };
}

// Log out
export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  return true;
}

// Update profile details
export function updateProfile(data) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false };
  
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    db.users[userIndex].name = data.name.trim();
    db.users[userIndex].phone = data.phone.trim();
    db.users[userIndex].birthday = data.birthday;
    saveDB(db);
    
    // Update session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(db.users[userIndex]));
    return { success: true, user: db.users[userIndex] };
  }
  
  return { success: false };
}

// Add a delivery address
export function addAddress(addressString) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false };
  
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    const addresses = db.users[userIndex].addresses || [];
    addresses.push(addressString.trim());
    db.users[userIndex].addresses = addresses;
    
    // Set as default if it's the first address
    if (db.users[userIndex].defaultAddressIndex === -1) {
      db.users[userIndex].defaultAddressIndex = 0;
    }
    
    saveDB(db);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(db.users[userIndex]));
    return { success: true, user: db.users[userIndex] };
  }
  return { success: false };
}

// Remove an address
export function deleteAddress(index) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false };
  
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    const addresses = db.users[userIndex].addresses || [];
    if (index >= 0 && index < addresses.length) {
      addresses.splice(index, 1);
      db.users[userIndex].addresses = addresses;
      
      // Reset default index
      if (addresses.length === 0) {
        db.users[userIndex].defaultAddressIndex = -1;
      } else if (db.users[userIndex].defaultAddressIndex >= addresses.length) {
        db.users[userIndex].defaultAddressIndex = 0;
      }
      
      saveDB(db);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(db.users[userIndex]));
      return { success: true, user: db.users[userIndex] };
    }
  }
  return { success: false };
}

// Set default address
export function setDefaultAddress(index) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false };
  
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    const addresses = db.users[userIndex].addresses || [];
    if (index >= 0 && index < addresses.length) {
      db.users[userIndex].defaultAddressIndex = index;
      saveDB(db);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(db.users[userIndex]));
      return { success: true, user: db.users[userIndex] };
    }
  }
  return { success: false };
}

// Change user password
export function changePassword(oldPassword, newPassword) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, messageUz: 'Avtorizatsiyadan o\'tilmagan', messageRu: 'Не авторизован', messageEn: 'Unauthorized' };
  
  const db = getDB();
  const userIndex = db.users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex !== -1) {
    if (db.users[userIndex].password !== oldPassword) {
      return { success: false, messageUz: 'Eski parol noto\'g\'ri!', messageRu: 'Неверный старый пароль!', messageEn: 'Incorrect old password!' };
    }
    
    db.users[userIndex].password = newPassword;
    saveDB(db);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(db.users[userIndex]));
    return { success: true };
  }
  
  return { success: false };
}
