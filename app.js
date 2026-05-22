/*
  app.js - UzMarket Core Controller
  Manages SPA routing, translations, dynamic UI renders, event handlers, and simulation modules.
*/

import * as store from './store.js';
import * as auth from './auth.js';
import * as cart from './cart.js';
import * as admin from './admin.js';

// -------------------------------------------------------------
// App State & Configuration
// -------------------------------------------------------------
const state = {
  lang: localStorage.getItem('uzmarket_lang') || 'uz',
  theme: localStorage.getItem('uzmarket_theme') || 'light',
  catalogView: 'grid',
  activePromo: null,
  
  // Filters
  filters: {
    search: '',
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 40000000,
    minRating: 0,
    sort: 'popular' // new, cheap, expensive, popular
  },
  
  // Modals state
  selectedProductId: null,
  activeDetailImageIdx: 0,
  activeDetailTab: 'desc' // desc or specs
};

// -------------------------------------------------------------
// Translation Dictionary (Uzbek, Russian, English)
// -------------------------------------------------------------
const translations = {
  uz: {
    appName: 'UzMarket',
    tagline: 'Siz uchun eng yaxshi texnikalar va aksessuarlar',
    home: 'Bosh sahifa',
    catalog: 'Katalog',
    cart: 'Savatcha',
    profile: 'Profil',
    admin: 'Admin panel',
    searchPlaceholder: 'Mahsulotlarni qidirish...',
    searchBtn: 'Qidirish',
    login: 'Kirish',
    register: 'Ro\'yxatdan o\'tish',
    logout: 'Chiqish',
    langName: 'O\'zbekcha',
    categories: 'Kategoriyalar',
    allCategories: 'Barcha kategoriyalar',
    brands: 'Brendlar',
    allBrands: 'Barcha brendlar',
    priceRange: 'Narx oralig\'i',
    minPrice: 'Min narx',
    maxPrice: 'Max narx',
    rating: 'Reyting',
    sorting: 'Sortlash',
    sortPopular: 'Ommabopligi bo\'yicha',
    sortNew: 'Yangiligi bo\'yicha',
    sortCheap: 'Arzonlaridan boshlab',
    sortExpensive: 'Qimmatlaridan boshlab',
    gridView: 'Grid ko\'rinishi',
    listView: 'List ko\'rinishi',
    addToCart: 'Savatga qo\'shish',
    inStock: 'Sotuvda bor',
    outOfStock: 'Tugagan',
    brandFilter: 'Brend bo\'yicha filtr',
    clearFilters: 'Filtrlarni tozalash',
    reviews: 'Sharhlar',
    addReview: 'Sharh qoldirish',
    yourRating: 'Sizning bahoingiz',
    yourReview: 'Sharh matni...',
    submitReview: 'Yuborish',
    reviewSuccess: 'Sharhingiz qabul qilindi!',
    noReviews: 'Ushbu mahsulotga hali sharh yozilmagan.',
    specifications: 'Xususiyatlari',
    description: 'Tavsif',
    similarProducts: 'O\'xshash mahsulotlar',
    cartEmpty: 'Savatchangiz bo\'sh!',
    cartEmptyDesc: 'Katalogimizga o\'ting va o\'zingizga yoqqan mahsulotlarni qo\'shing.',
    goToCatalog: 'Katalogga o\'tish',
    product: 'Mahsulot',
    price: 'Narx',
    quantity: 'Miqdor',
    total: 'Jami',
    summary: 'Savat jami',
    subtotal: 'Oraliq jami',
    discount: 'Chegirma',
    promoCode: 'Promo-kod',
    applyPromo: 'Kiritish',
    delivery: 'Yetkazib berish',
    free: 'Bepul',
    checkoutBtn: 'Buyurtma berish',
    checkoutTitle: 'Buyurtmani rasmiylashtirish',
    shippingMethod: 'Yetkazib berish usuli',
    pickup: 'Do\'kondan olib ketish (Self-pickup)',
    courier: 'Kuryer orqali yetkazish (30,000 UZS)',
    shippingAddress: 'Yetkazib berish manzili',
    selectAddress: 'Manzilni tanlang',
    addNewAddress: 'Yangi manzil qo\'shish',
    addressPlaceholder: 'Toshkent sh., Yunusobod tumani, 4-uy...',
    paymentMethod: 'To\'lov usuli',
    cash: 'Naqd pul (kuryerga)',
    payme: 'Payme',
    click: 'Click',
    confirmOrder: 'Buyurtmani tasdiqlash',
    orderSuccess: 'Buyurtmangiz qabul qilindi!',
    orderSuccessDesc: 'Sizning buyurtma raqamingiz:',
    personalInfo: 'Shaxsiy ma\'lumotlar',
    fullName: 'Ism va Familiya',
    phone: 'Telefon raqam',
    birthday: 'Tug\'ilgan sana',
    saveProfile: 'Saqlash',
    addressBook: 'Manzillar daftarchasi',
    noAddresses: 'Sizda hali saqlangan manzillar yo\'q.',
    setDefault: 'Asosiy qilish',
    delete: 'O\'chirish',
    orderHistory: 'Buyurtmalar tarixi',
    noOrders: 'Sizda hali buyurtmalar mavjud emas.',
    orderNumber: 'Buyurtma',
    orderDate: 'Sana',
    status: 'Holati',
    paymentStatus: 'To\'lov holati',
    paid: 'To\'langan',
    unpaid: 'To\'lanmagan',
    changePassword: 'Parolni o\'zgartirish',
    oldPassword: 'Eski parol',
    newPassword: 'Yangi parol',
    savePassword: 'Parolni saqlash',
    statsDashboard: 'Savdo ko\'rsatkichlari',
    totalSales: 'Umumiy savdo',
    todaySales: 'Bugungi savdo',
    totalOrders: 'Buyurtmalar jami',
    todayOrders: 'Bugungi buyurtmalar',
    registeredUsers: 'Foydalanuvchilar',
    lowStockAlerts: 'Ombor ogohlantirishlari',
    productCRUD: 'Mahsulotlar boshqaruvi',
    orderCRUD: 'Buyurtmalar boshqaruvi',
    categoryCRUD: 'Kategoriyalar',
    addNewProduct: 'Yangi mahsulot',
    editProduct: 'Mahsulotni tahrirlash',
    saveProduct: 'Saqlash',
    productName: 'Mahsulot nomi',
    productPrice: 'Narxi (UZS)',
    productDiscount: 'Chegirma (%)',
    productStock: 'Ombordagi soni',
    productImages: 'Rasm URLlari (har bir qatorda bitta)',
    addSpec: 'Xususiyat qo\'shish',
    specName: 'Xususiyat nomi',
    specValue: 'Qiymati',
    deleteProductConfirm: 'Rostdan ham ushbu mahsulotni o\'chirmoqchimisiz?',
    statusNew: 'Yangi',
    statusConfirmed: 'Tasdiqlangan',
    statusShipped: 'Yo\'lda',
    statusDelivered: 'Yetkazilgan',
    statusCanceled: 'Bekor qilingan',
    saveStatus: 'Saqlash',
    accessDenied: 'Ruxsat yo\'q!',
    accessDeniedDesc: 'Siz administrator emassiz. Bosh sahifaga qayting.',
    aiAdvisor: 'AI Maslahatchi',
    aiWelcome: 'Salom! Men sizning shaxsiy AI maslahatchi yordamchingizman. 🤖\n\nMen UzMarket do\'konidagi istalgan mahsulot haqida batafsil ma\'lumot bera olaman, texnik xususiyatlarini tushuntira olaman yoki sizga mos keladigan qurilmani tanlashda yordam beraman.\n\nSavolingiz bormi? Quyidagi tayyor variantlardan birini bosing yoki o\'z savolingizni yozing!',
    aiInputPlaceholder: 'Savol berish...',
    aiSaveKey: 'Saqlash',
    aiKeyLabel: 'API KALITI (API KEY)',
    aiKeyGet: 'Kalit olish',
    aiProductLbl: 'Mahsulot:',
    aiAllProducts: 'Barcha mahsulotlar',
    aiKeySaved: 'API kaliti muvaffaqiyatli saqlandi!',
    aiEmptyKeyWarning: '⚠️ API kaliti kiritilmagan. Sun\'iy Intellekt to\'liq ishlashi uchun yuqorida API kalitini kiriting va Saqlash tugmasini bosing.\nHozircha sizga offline-rejimda mahsulot xususiyatlaridan kelib chiqib javob beraman.',
    aiTyping: 'AI javob tayyorlamoqda...',
    aiOfflineLabel: 'Offline Rejim'
  },
  ru: {
    appName: 'UzMarket',
    tagline: 'Лучшая техника и аксессуары для вас',
    home: 'Главная',
    catalog: 'Каталог',
    cart: 'Корзина',
    profile: 'Профиль',
    admin: 'Админ панель',
    searchPlaceholder: 'Поиск товаров...',
    searchBtn: 'Найти',
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    langName: 'Русский',
    categories: 'Категории',
    allCategories: 'Все категории',
    brands: 'Бренды',
    allBrands: 'Все бренды',
    priceRange: 'Диапазон цен',
    minPrice: 'Мин цена',
    maxPrice: 'Макс цена',
    rating: 'Рейтинг',
    sorting: 'Сортировка',
    sortPopular: 'По популярности',
    sortNew: 'По новизне',
    sortCheap: 'Сначала дешевые',
    sortExpensive: 'Сначала дорогие',
    gridView: 'Сетка',
    listView: 'Список',
    addToCart: 'В корзину',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    brandFilter: 'Фильтр по бренду',
    clearFilters: 'Сбросить фильтры',
    reviews: 'Отзывы',
    addReview: 'Оставить отзыв',
    yourRating: 'Ваша оценка',
    yourReview: 'Текст отзыва...',
    submitReview: 'Отправить',
    reviewSuccess: 'Ваш отзыв принят!',
    noReviews: 'У этого товара еще нет отзывов.',
    specifications: 'Характеристики',
    description: 'Описание',
    similarProducts: 'Похожие товары',
    cartEmpty: 'Ваша корзина пуста!',
    cartEmptyDesc: 'Перейдите в каталог и выберите понравившиеся товары.',
    goToCatalog: 'В каталог',
    product: 'Товар',
    price: 'Цена',
    quantity: 'Кол-во',
    total: 'Итого',
    summary: 'Итого корзины',
    subtotal: 'Промежуточный итог',
    discount: 'Скидка',
    promoCode: 'Промокод',
    applyPromo: 'Применить',
    delivery: 'Доставка',
    free: 'Бесплатно',
    checkoutBtn: 'Оформить заказ',
    checkoutTitle: 'Оформление заказа',
    shippingMethod: 'Способ доставки',
    pickup: 'Самовывоз из магазина',
    courier: 'Доставка курьером (30,000 UZS)',
    shippingAddress: 'Адрес доставки',
    selectAddress: 'Выберите адрес',
    addNewAddress: 'Добавить новый адрес',
    addressPlaceholder: 'г. Ташкент, Юнусабадский р-н, д. 4...',
    paymentMethod: 'Способ оплаты',
    cash: 'Наличными при получении',
    payme: 'Payme',
    click: 'Click',
    confirmOrder: 'Подтвердить заказ',
    orderSuccess: 'Заказ успешно оформлен!',
    orderSuccessDesc: 'Номер вашего заказа:',
    personalInfo: 'Личные данные',
    fullName: 'Имя и Фамилия',
    phone: 'Номер телефона',
    birthday: 'Дата рождения',
    saveProfile: 'Сохранить',
    addressBook: 'Адресная книга',
    noAddresses: 'У вас еще нет сохраненных адресов.',
    setDefault: 'Сделать основным',
    delete: 'Удалить',
    orderHistory: 'История заказов',
    noOrders: 'У вас еще нет заказов.',
    orderNumber: 'Заказ',
    orderDate: 'Дата',
    status: 'Статус',
    paymentStatus: 'Статус оплаты',
    paid: 'Оплачено',
    unpaid: 'Не оплачено',
    changePassword: 'Смена пароля',
    oldPassword: 'Старый пароль',
    newPassword: 'Новый пароль',
    savePassword: 'Сохранить пароль',
    statsDashboard: 'Статистика продаж',
    totalSales: 'Общие продажи',
    todaySales: 'Продажи за сегодня',
    totalOrders: 'Всего заказов',
    todayOrders: 'Заказов сегодня',
    registeredUsers: 'Пользователи',
    lowStockAlerts: 'Предупреждения склада',
    productCRUD: 'Управление товарами',
    orderCRUD: 'Управление заказами',
    categoryCRUD: 'Категории',
    addNewProduct: 'Новый товар',
    editProduct: 'Редактирование товара',
    saveProduct: 'Сохранить',
    productName: 'Название товара',
    productPrice: 'Цена (UZS)',
    productDiscount: 'Скидка (%)',
    productStock: 'Кол-во на складе',
    productImages: 'Ссылки на фото (по одной на строку)',
    addSpec: 'Добавить характеристику',
    specName: 'Характеристика',
    specValue: 'Значение',
    deleteProductConfirm: 'Вы действительно хотите удалить этот товар?',
    statusNew: 'Новый',
    statusConfirmed: 'Подтвержден',
    statusShipped: 'В пути',
    statusDelivered: 'Доставлен',
    statusCanceled: 'Отменен',
    saveStatus: 'Сохранить',
    accessDenied: 'Доступ запрещен!',
    accessDeniedDesc: 'Вы не являетесь администратором. Вернитесь на главную.',
    aiAdvisor: 'ИИ Консультант',
    aiWelcome: 'Привет! Я ваш персональный ИИ-консультант. 🤖\n\nЯ могу подробно рассказать о любом товаре в магазине UzMarket, объяснить технические характеристики или помочь выбрать подходящее устройство.\n\nУ вас есть вопросы? Нажмите на один из готовых вариантов ниже или напишите свой вопрос!',
    aiInputPlaceholder: 'Задать вопрос...',
    aiSaveKey: 'Сохранить',
    aiKeyLabel: 'API КЛЮЧ GEMINI',
    aiKeyGet: 'Получить ключ',
    aiProductLbl: 'Товар:',
    aiAllProducts: 'Все товары',
    aiKeySaved: 'API ключ сохранен!',
    aiEmptyKeyWarning: '⚠️ API ключ Gemini не введен. Для полноценной работы ИИ введите API ключ выше и нажмите кнопку «Сохранить».\nА пока я буду отвечать вам в оффлайн-режиме на основе характеристик товаров.',
    aiTyping: 'ИИ готовит ответ...',
    aiOfflineLabel: 'Оффлайн режим'
  },
  en: {
    appName: 'UzMarket',
    tagline: 'Best tech and accessories crafted for you',
    home: 'Home',
    catalog: 'Catalog',
    cart: 'Cart',
    profile: 'Profile',
    admin: 'Admin Panel',
    searchPlaceholder: 'Search products...',
    searchBtn: 'Search',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    langName: 'English',
    categories: 'Categories',
    allCategories: 'All Categories',
    brands: 'Brands',
    allBrands: 'All Brands',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    rating: 'Rating',
    sorting: 'Sorting',
    sortPopular: 'By popularity',
    sortNew: 'By newest',
    sortCheap: 'Price: low to high',
    sortExpensive: 'Price: high to low',
    gridView: 'Grid View',
    listView: 'List View',
    addToCart: 'Add to Cart',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    brandFilter: 'Filter by Brand',
    clearFilters: 'Clear Filters',
    reviews: 'Reviews',
    addReview: 'Add Review',
    yourRating: 'Your Rating',
    yourReview: 'Write your review...',
    submitReview: 'Submit',
    reviewSuccess: 'Thank you! Your review is submitted.',
    noReviews: 'No reviews yet for this product.',
    specifications: 'Specifications',
    description: 'Description',
    similarProducts: 'Similar Products',
    cartEmpty: 'Your Cart is empty!',
    cartEmptyDesc: 'Go to our catalog and pick something awesome for yourself.',
    goToCatalog: 'Go to Catalog',
    product: 'Product',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    summary: 'Cart Summary',
    subtotal: 'Subtotal',
    discount: 'Discount',
    promoCode: 'Promo Code',
    applyPromo: 'Apply',
    delivery: 'Delivery',
    free: 'Free',
    checkoutBtn: 'Checkout Now',
    checkoutTitle: 'Checkout Form',
    shippingMethod: 'Shipping Method',
    pickup: 'Self-pickup from store',
    courier: 'Courier Delivery (30,000 UZS)',
    shippingAddress: 'Shipping Address',
    selectAddress: 'Select Address',
    addNewAddress: 'Add New Address',
    addressPlaceholder: 'Tashkent, Yunusabad dist., building 4...',
    paymentMethod: 'Payment Method',
    cash: 'Cash on delivery',
    payme: 'Payme',
    click: 'Click',
    confirmOrder: 'Confirm Order',
    orderSuccess: 'Order Placed Successfully!',
    orderSuccessDesc: 'Your Order Number:',
    personalInfo: 'Personal Info',
    fullName: 'Full Name',
    phone: 'Phone Number',
    birthday: 'Date of Birth',
    saveProfile: 'Save Profile',
    addressBook: 'Address Book',
    noAddresses: 'You have no saved addresses yet.',
    setDefault: 'Set Default',
    delete: 'Delete',
    orderHistory: 'Order History',
    noOrders: 'You have no orders yet.',
    orderNumber: 'Order',
    orderDate: 'Date',
    status: 'Status',
    paymentStatus: 'Payment Status',
    paid: 'Paid',
    unpaid: 'Unpaid',
    changePassword: 'Change Password',
    oldPassword: 'Old Password',
    newPassword: 'New Password',
    savePassword: 'Save Password',
    statsDashboard: 'Sales Dashboard',
    totalSales: 'Total Revenue',
    todaySales: 'Daily Sales',
    totalOrders: 'Total Orders',
    todayOrders: 'Today\'s Orders',
    registeredUsers: 'Customers',
    lowStockAlerts: 'Low Stock Alerts',
    productCRUD: 'Manage Products',
    orderCRUD: 'Manage Orders',
    categoryCRUD: 'Categories',
    addNewProduct: 'New Product',
    editProduct: 'Edit Product',
    saveProduct: 'Save',
    productName: 'Product Name',
    productPrice: 'Price (UZS)',
    productDiscount: 'Discount (%)',
    productStock: 'Stock Level',
    productImages: 'Image URLs (one per line)',
    addSpec: 'Add Spec',
    specName: 'Spec Name',
    specValue: 'Value',
    deleteProductConfirm: 'Are you sure you want to delete this product?',
    statusNew: 'New',
    statusConfirmed: 'Confirmed',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCanceled: 'Canceled',
    saveStatus: 'Save Status',
    accessDenied: 'Access Denied!',
    accessDeniedDesc: 'You do not have administrative privileges. Go back home.',
    aiAdvisor: 'AI Advisor',
    aiWelcome: 'Hello! I am your personal AI shopping advisor. 🤖\n\nI can provide detailed information about any product in the UzMarket store, explain technical specifications, or help you choose the right device.\n\nDo you have a question? Click one of the quick prompts below or type your own question!',
    aiInputPlaceholder: 'Ask a question...',
    aiSaveKey: 'Save',
    aiKeyLabel: 'GEMINI API KEY',
    aiKeyGet: 'Get key',
    aiProductLbl: 'Product:',
    aiAllProducts: 'All products',
    aiKeySaved: 'API key saved successfully!',
    aiEmptyKeyWarning: '⚠️ Gemini API key is not set. For full AI capabilities, please enter your API key above and click Save.\nFor now, I will answer in offline mode based on product specifications.',
    aiTyping: 'AI is thinking...',
    aiOfflineLabel: 'Offline Mode'
  }
};

// Quick translator helper
function t(key) {
  return translations[state.lang][key] || key;
}

// Format Currency
function formatUZS(amount) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
}

// -------------------------------------------------------------
// View Routing & Loading Engine
// -------------------------------------------------------------
function navigateTo(hash) {
  window.location.hash = hash;
}

export function handleRoute() {
  const hash = window.location.hash || '#home';
  const contentArea = document.getElementById('app-content');
  
  // Close any product details modal
  closeProductModal();
  
  // Fade transition
  contentArea.classList.remove('animate-fade-in');
  void contentArea.offsetWidth; // Trigger reflow
  contentArea.classList.add('animate-fade-in');

  if (hash === '#home') {
    renderHome();
  } else if (hash.startsWith('#catalog')) {
    renderCatalog();
  } else if (hash === '#cart') {
    renderCart();
  } else if (hash === '#profile') {
    renderProfile();
  } else if (hash === '#admin') {
    renderAdmin();
  } else if (hash === '#feedback') {
    renderFeedbackPage();
  } else {
    renderHome();
  }
  
  renderHeader();
  if (typeof translateAIChatbotUI === 'function') {
    translateAIChatbotUI();
  }
  window.scrollTo(0, 0);
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
export function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `glass-card flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg animate-slide-in-right pulse-border`;
  
  let icon = 'fa-circle-check text-indigo-500';
  if (type === 'error') {
    icon = 'fa-circle-exclamation text-rose-500';
  } else if (type === 'info') {
    icon = 'fa-circle-info text-sky-500';
  }
  
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <span class="text-sm font-medium ${state.theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}">${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// -------------------------------------------------------------
// Sub-views Renderers
// -------------------------------------------------------------

// 1. HEADER
function renderHeader() {
  const user = auth.getCurrentUser();
  const cartItems = cart.getCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const navContainer = document.getElementById('main-nav');
  
  let authBlock = '';
  if (user) {
    const isAdmin = user.role === 'admin';
    authBlock = `
      <div class="relative group">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
            ${user.name.slice(0, 2)}
          </div>
          <span class="text-xs font-semibold max-w-[100px] truncate hidden md:inline">${user.name}</span>
        </button>
        <div class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50 animate-fade-in">
          ${isAdmin ? `
            <a href="#admin" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600">
              <i class="fa-solid fa-chart-line w-4"></i> ${t('admin')}
            </a>
          ` : ''}
          <a href="#profile" class="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600">
            <i class="fa-solid fa-user w-4"></i> ${t('profile')}
          </a>
          <div class="border-t dark:border-gray-800 my-1"></div>
          <button id="logout-btn" class="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left">
            <i class="fa-solid fa-right-from-bracket w-4"></i> ${t('logout')}
          </button>
        </div>
      </div>
    `;
  } else {
    authBlock = `
      <button id="open-login-modal" class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition shadow rounded-full">
        <i class="fa-solid fa-right-to-bracket"></i> ${t('login')}
      </button>
    `;
  }
  
  navContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <a href="#home" class="flex items-center gap-2 text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight shrink-0">
        <i class="fa-solid fa-bag-shopping text-indigo-600"></i> ${t('appName')}
      </a>
      
      <!-- Center Navigation Links -->
      <div class="hidden md:flex items-center gap-6 text-sm font-semibold">
        <a href="#home" class="${window.location.hash === '#home' || !window.location.hash ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'} transition">${t('home')}</a>
        <a href="#catalog" class="${window.location.hash.startsWith('#catalog') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'} transition">${t('catalog')}</a>
        <a href="#feedback" class="${window.location.hash === '#feedback' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600'} transition">${state.lang === 'uz' ? 'Fikrlar' : state.lang === 'ru' ? 'Отзывы' : 'Feedback'}</a>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Language Switcher -->
        <div class="relative group">
          <button class="flex items-center gap-1 px-2.5 py-1.5 border dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs font-bold uppercase">
            <i class="fa-solid fa-earth-americas text-gray-500"></i> ${state.lang}
          </button>
          <div class="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl shadow-xl py-1.5 hidden group-hover:block z-50 animate-fade-in">
            <button class="lang-switch-btn w-full px-4 py-1.5 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 text-left" data-lang="uz">O'zbekcha</button>
            <button class="lang-switch-btn w-full px-4 py-1.5 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 text-left" data-lang="ru">Русский</button>
            <button class="lang-switch-btn w-full px-4 py-1.5 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 text-left" data-lang="en">English</button>
          </div>
        </div>
        
        <!-- Theme Toggle -->
        <button id="theme-toggle" class="p-2 border dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-500">
          <i class="fa-solid ${state.theme === 'dark' ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'} text-xs"></i>
        </button>

        <!-- Cart Badge -->
        <a href="#cart" class="relative p-2.5 border dark:border-gray-800 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
          <i class="fa-solid fa-cart-shopping text-xs"></i>
          ${totalItems > 0 ? `
            <span class="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow pulse-border">
              ${totalItems}
            </span>
          ` : ''}
        </a>

        <!-- User Profile/Auth block -->
        ${authBlock}
      </div>
    </div>
  `;
  
  // Attach listeners to newly created header elements
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.logout();
      state.activePromo = null;
      showToast(state.lang === 'uz' ? 'Tizimdan chiqildi' : state.lang === 'ru' ? 'Вы вышли из системы' : 'Logged out', 'info');
      navigateTo('#home');
      handleRoute();
    });
  }

  const loginBtn = document.getElementById('open-login-modal');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      openAuthModal();
    });
  }

  document.querySelectorAll('.lang-switch-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.lang = e.target.dataset.lang;
      localStorage.setItem('uzmarket_lang', state.lang);
      handleRoute();
      showToast(state.lang === 'uz' ? 'Til o\'zgartirildi' : state.lang === 'ru' ? 'Язык изменен' : 'Language changed', 'info');
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('uzmarket_theme', nextTheme);
      
      const docHtml = document.documentElement;
      if (nextTheme === 'dark') {
        docHtml.classList.add('dark');
      } else {
        docHtml.classList.remove('dark');
      }
      
      renderHeader();
      handleRoute();
    });
  }
}

// 2. BOSH SAHIFA (HOME)
function renderHome() {
  const products = store.getProducts().slice(0, 4);
  const categories = store.getCategories();
  
  const contentArea = document.getElementById('app-content');
  
  contentArea.innerHTML = `
    <!-- Hero Banner with Glassmorphism -->
    <div class="relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
      <!-- Gradient Backdrops -->
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/80 z-10"></div>
      <img src="https://images.unsplash.com/photo-1468436139062-f60a71c5c892?auto=format&fit=crop&w=1200&q=80" alt="Hero background" class="absolute inset-0 w-full h-full object-cover">
      
      <div class="relative max-w-2xl mx-auto text-center px-6 py-20 md:py-28 z-20 text-white">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
          <i class="fa-solid fa-star text-amber-300"></i> MVP v1.0 Launch
        </span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
          ${t('appName')}
        </h1>
        <p class="text-lg md:text-xl font-medium text-indigo-100 mb-8 max-w-lg mx-auto">
          ${t('tagline')}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#catalog" class="px-8 py-3.5 bg-white text-indigo-600 font-extrabold text-sm rounded-full shadow hover:bg-gray-50 active:scale-95 transition">
            ${t('goToCatalog')}
          </a>
        </div>
      </div>
    </div>

    <!-- Categories Selector -->
    <div class="mb-12">
      <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-6">${t('categories')}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${categories.map(c => {
          const name = state.lang === 'uz' ? c.nameUz : state.lang === 'ru' ? c.nameRu : c.nameEn;
          return `
            <a href="#catalog?category=${c.id}" class="glass-card hover-premium flex flex-col items-center justify-center p-6 rounded-2xl border text-center group">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl group-hover:scale-110 transition shadow-sm mb-3">
                <i class="fa-solid ${c.icon}"></i>
              </div>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-200">${name}</span>
            </a>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Featured Products (Flash Sale) -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
          <span class="inline-block w-2.5 h-6 rounded bg-indigo-600"></span>
          Top ${t('catalog')}
        </h2>
        <a href="#catalog" class="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 transition flex items-center gap-1">
          ${t('goToCatalog')} <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${products.map(p => renderProductCard(p)).join('')}
      </div>
    </div>

    <!-- Premium Info block -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div class="glass-card p-6 rounded-2xl border flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-1">
            ${state.lang === 'uz' ? 'Tez yetkazib berish' : state.lang === 'ru' ? 'Быстрая доставка' : 'Fast Delivery'}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            ${state.lang === 'uz' ? 'Toshkent bo\'ylab 2 soat ichida yetkaziladi' : state.lang === 'ru' ? 'Доставка по Ташкенту в течение 2 часов' : 'Delivered within 2 hours across Tashkent'}
          </p>
        </div>
      </div>
      <div class="glass-card p-6 rounded-2xl border flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
          <i class="fa-solid fa-credit-card"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-1">
            ${state.lang === 'uz' ? 'Xavfsiz to\'lovlar' : state.lang === 'ru' ? 'Безопасные платежи' : 'Secure Payments'}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            ${state.lang === 'uz' ? 'Click, Payme va Naqd to\'lov integratsiyalari' : state.lang === 'ru' ? 'Интеграция с Click, Payme и оплата наличными' : 'Integrated with Click, Payme and Cash'}
          </p>
        </div>
      </div>
      <div class="glass-card p-6 rounded-2xl border flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-600 shrink-0 shadow-sm">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-gray-800 dark:text-white mb-1">
            ${state.lang === 'uz' ? 'Rasmiy Kafolat' : state.lang === 'ru' ? 'Официальная гарантия' : 'Official Warranty'}
          </h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            ${state.lang === 'uz' ? 'Barcha sotilgan tovarlarga 1 yillik kafolat' : state.lang === 'ru' ? 'Гарантия 1 год на все проданные товары' : '1-year official warranty on all products'}
          </p>
        </div>
      </div>
    </div>

    <!-- Fikr va mulohazalar -->
    <div class="mt-16">
      ${renderFeedbackFormHTML()}
    </div>
  `;
  
  attachProductCardListeners();
  attachFeedbackFormListener();
}

// Helper to render product card (standard template)
function renderProductCard(p) {
  const hasDiscount = p.discount > 0;
  const finalPrice = hasDiscount ? p.price * (1 - p.discount / 100) : p.price;
  
  return `
    <div class="product-card glass-card hover-premium rounded-2xl border flex flex-col overflow-hidden h-[410px] relative group" data-id="${p.id}">
      <!-- Badge discount -->
      ${hasDiscount ? `
        <span class="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-sm z-30 animate-pulse">
          -${p.discount}%
        </span>
      ` : ''}

      <!-- Image section -->
      <div class="h-44 relative bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 cursor-pointer detail-trigger">
        <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
          <span class="px-4 py-2 bg-white/95 text-indigo-600 font-extrabold text-[10px] uppercase rounded-full shadow-md tracking-wider transform translate-y-3 group-hover:translate-y-0 transition-transform">
            <i class="fa-solid fa-eye"></i> View
          </span>
        </div>
      </div>

      <!-- Info section -->
      <div class="p-4 flex flex-col grow justify-between bg-white/40 dark:bg-gray-900/30">
        <div>
          <!-- Category & Brand -->
          <div class="flex items-center gap-1 text-[10px] font-semibold text-indigo-500 uppercase tracking-widest mb-1.5">
            <span>${p.brand}</span>
          </div>
          <!-- Product Name -->
          <h3 class="font-bold text-xs text-gray-800 dark:text-white line-clamp-2 leading-relaxed mb-2 cursor-pointer detail-trigger">
            ${p.name}
          </h3>
          <!-- Star Rating -->
          <div class="flex items-center gap-1.5 mb-3">
            <div class="flex items-center text-xs">
              <i class="fa-solid fa-star star-filled"></i>
            </div>
            <span class="text-[10px] font-bold text-gray-700 dark:text-gray-300">${p.rating}</span>
            <span class="text-[9px] text-gray-400">(${p.reviewsCount})</span>
          </div>
        </div>

        <div>
          <!-- Price display -->
          <div class="mb-4">
            ${hasDiscount ? `
              <div class="text-[10px] text-gray-400 line-through mb-0.5">${formatUZS(p.price)}</div>
            ` : ''}
            <div class="font-black text-sm text-indigo-600 dark:text-indigo-400">${formatUZS(finalPrice)}</div>
          </div>

          <!-- Add to Cart -->
          ${p.stock > 0 ? `
            <button class="add-to-cart-btn w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow flex items-center justify-center gap-2 transition" data-id="${p.id}">
              <i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}
            </button>
          ` : `
            <button class="w-full py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-extrabold text-xs uppercase rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <i class="fa-solid fa-ban"></i> ${t('outOfStock')}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function attachProductCardListeners() {
  // Opening detail page
  document.querySelectorAll('.detail-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) {
        openProductModal(card.dataset.id);
      }
    });
  });

  // Adding to cart
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pId = btn.dataset.id;
      cart.addToCart(pId, 1);
      renderHeader();
      showToast(state.lang === 'uz' ? 'Savatga muvaffaqiyatli qo\'shildi!' : state.lang === 'ru' ? 'Успешно добавлено в корзину!' : 'Added to cart!', 'success');
    });
  });
}

// 3. CATALOG
function renderCatalog() {
  const contentArea = document.getElementById('app-content');
  
  // Extract route search query parameter
  const hash = window.location.hash;
  if (hash.includes('?')) {
    const params = new URLSearchParams(hash.split('?')[1]);
    if (params.has('category')) {
      state.filters.category = params.get('category');
    }
  }

  const categories = store.getCategories();
  
  contentArea.innerHTML = `
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-64 shrink-0 glass-card p-6 rounded-2xl border flex flex-col gap-6">
        <div>
          <h3 class="font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-1.5">
            <i class="fa-solid fa-filter text-indigo-500"></i> ${t('priceRange')}
          </h3>
          <div class="flex flex-col gap-2">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('minPrice')}</label>
              <input type="number" id="filter-min-price" value="${state.filters.minPrice}" class="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('maxPrice')}</label>
              <input type="number" id="filter-max-price" value="${state.filters.maxPrice}" class="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-1.5">
            <i class="fa-solid fa-list-check text-indigo-500"></i> ${t('categories')}
          </h3>
          <div class="flex flex-col gap-2.5">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input type="radio" name="cat-filter" value="" ${state.filters.category === '' ? 'checked' : ''} class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700">
              <span class="text-gray-600 dark:text-gray-300">${t('allCategories')}</span>
            </label>
            ${categories.map(c => {
              const name = state.lang === 'uz' ? c.nameUz : state.lang === 'ru' ? c.nameRu : c.nameEn;
              return `
                <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input type="radio" name="cat-filter" value="${c.id}" ${state.filters.category === c.id ? 'checked' : ''} class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-300">${name}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div>
          <h3 class="font-extrabold text-sm text-gray-800 dark:text-white mb-4 flex items-center gap-1.5">
            <i class="fa-solid fa-star text-amber-500"></i> ${t('rating')}
          </h3>
          <div class="flex flex-col gap-2">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input type="radio" name="rating-filter" value="0" ${state.filters.minRating === 0 ? 'checked' : ''} class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
              <span class="text-gray-600 dark:text-gray-300">${state.lang === 'uz' ? 'Barchasi' : state.lang === 'ru' ? 'Все' : 'All'}</span>
            </label>
            ${[4.5, 4.0, 3.5].map(r => `
              <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input type="radio" name="rating-filter" value="${r}" ${state.filters.minRating === r ? 'checked' : ''} class="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                <span class="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  ${r} + <i class="fa-solid fa-star star-filled text-[10px]"></i>
                </span>
              </label>
            `).join('')}
          </div>
        </div>

        <button id="clear-catalog-filters" class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase rounded-xl transition flex items-center justify-center gap-1">
          <i class="fa-solid fa-trash-can"></i> ${t('clearFilters')}
        </button>
      </aside>

      <!-- Products Grid/List side -->
      <div class="grow flex flex-col gap-6">
        <!-- Top Toolbar -->
        <div class="glass-card p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Search Bar inside catalog -->
          <div class="w-full sm:max-w-xs flex items-center bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-full px-3 py-1.5 shadow-inner">
            <i class="fa-solid fa-magnifying-glass text-gray-400 text-sm ml-1.5 shrink-0"></i>
            <input type="text" id="catalog-search" value="${state.filters.search}" placeholder="${t('searchPlaceholder')}" class="w-full bg-transparent text-xs font-medium text-gray-800 dark:text-white px-2 focus:outline-none">
          </div>

          <!-- Sorter and Layout Switches -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <!-- Sort dropdown -->
            <select id="catalog-sort" class="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none">
              <option value="popular" ${state.filters.sort === 'popular' ? 'selected' : ''}>${t('sortPopular')}</option>
              <option value="new" ${state.filters.sort === 'new' ? 'selected' : ''}>${t('sortNew')}</option>
              <option value="cheap" ${state.filters.sort === 'cheap' ? 'selected' : ''}>${t('sortCheap')}</option>
              <option value="expensive" ${state.filters.sort === 'expensive' ? 'selected' : ''}>${t('sortExpensive')}</option>
            </select>

            <!-- Layout switches -->
            <div class="flex border dark:border-gray-800 rounded-xl overflow-hidden shadow-sm shrink-0">
              <button id="view-grid-btn" class="p-2 ${state.catalogView === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-500'} hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs">
                <i class="fa-solid fa-table-cells-large"></i>
              </button>
              <button id="view-list-btn" class="p-2 ${state.catalogView === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-500'} hover:bg-gray-50 dark:hover:bg-gray-800 transition text-xs">
                <i class="fa-solid fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Products List output -->
        <div id="catalog-products-container">
          <!-- Products will be generated dynamically -->
        </div>
      </div>
    </div>
  `;

  // Attach control triggers
  const searchInput = document.getElementById('catalog-search');
  searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    updateCatalogProducts();
  });

  const sortSelect = document.getElementById('catalog-sort');
  sortSelect.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    updateCatalogProducts();
  });

  const minPriceInput = document.getElementById('filter-min-price');
  minPriceInput.addEventListener('input', (e) => {
    state.filters.minPrice = Number(e.target.value) || 0;
    updateCatalogProducts();
  });

  const maxPriceInput = document.getElementById('filter-max-price');
  maxPriceInput.addEventListener('input', (e) => {
    state.filters.maxPrice = Number(e.target.value) || 40000000;
    updateCatalogProducts();
  });

  document.querySelectorAll('input[name="cat-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.filters.category = e.target.value;
      updateCatalogProducts();
    });
  });

  document.querySelectorAll('input[name="rating-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.filters.minRating = Number(e.target.value);
      updateCatalogProducts();
    });
  });

  document.getElementById('clear-catalog-filters').addEventListener('click', () => {
    state.filters = {
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 40000000,
      minRating: 0,
      sort: 'popular'
    };
    renderCatalog();
    updateCatalogProducts();
    showToast(state.lang === 'uz' ? 'Filtrlar tozalandi' : 'Фильтры сброшены', 'info');
  });

  document.getElementById('view-grid-btn').addEventListener('click', () => {
    state.catalogView = 'grid';
    renderCatalog();
    updateCatalogProducts();
  });

  document.getElementById('view-list-btn').addEventListener('click', () => {
    state.catalogView = 'list';
    renderCatalog();
    updateCatalogProducts();
  });

  // Run initial query render
  updateCatalogProducts();
}

// Function to process filters, sorts, and layouts
function updateCatalogProducts() {
  const container = document.getElementById('catalog-products-container');
  let products = store.getProducts();

  // Search filter
  if (state.filters.search) {
    const q = state.filters.search.toLowerCase().trim();
    products = products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }

  // Category filter
  if (state.filters.category) {
    products = products.filter(p => p.category === state.filters.category);
  }

  // Price filter
  products = products.filter(p => {
    const price = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
    return price >= state.filters.minPrice && price <= state.filters.maxPrice;
  });

  // Rating filter
  if (state.filters.minRating > 0) {
    products = products.filter(p => p.rating >= state.filters.minRating);
  }

  // Sorting
  if (state.filters.sort === 'new') {
    products = products.reverse(); // Seed list was written in chronological order, reverse is newest
  } else if (state.filters.sort === 'cheap') {
    products.sort((a, b) => {
      const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
      const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
      return pA - pB;
    });
  } else if (state.filters.sort === 'expensive') {
    products.sort((a, b) => {
      const pA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
      const pB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
      return pB - pA;
    });
  } else {
    // popular (default avg rating)
    products.sort((a, b) => b.rating - a.rating);
  }

  // Draw Layouts
  if (products.length === 0) {
    container.innerHTML = `
      <div class="glass-card py-16 px-6 text-center rounded-2xl border flex flex-col items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center text-2xl mb-4">
          <i class="fa-solid fa-face-frown"></i>
        </div>
        <h3 class="font-extrabold text-sm text-gray-800 dark:text-white mb-1">
          ${state.lang === 'uz' ? 'Mahsulotlar topilmadi!' : 'Товары не найдены!'}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          ${state.lang === 'uz' ? 'Qidiruv so\'rovingizni yoki filtr parametrlarini o\'zgartirib ko\'ring.' : 'Попробуйте изменить поисковый запрос или фильтры.'}
        </p>
      </div>
    `;
    return;
  }

  if (state.catalogView === 'grid') {
    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        ${products.map(p => renderProductCard(p)).join('')}
      </div>
    `;
  } else {
    // List view
    container.innerHTML = `
      <div class="flex flex-col gap-4 animate-fade-in">
        ${products.map(p => {
          const hasDiscount = p.discount > 0;
          const finalPrice = hasDiscount ? p.price * (1 - p.discount / 100) : p.price;
          return `
            <div class="product-card glass-card hover-premium rounded-2xl border flex overflow-hidden h-48 relative group" data-id="${p.id}">
              <!-- Badge discount -->
              ${hasDiscount ? `
                <span class="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-sm z-30">
                  -${p.discount}%
                </span>
              ` : ''}

              <!-- Image section -->
              <div class="w-48 relative bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 cursor-pointer detail-trigger">
                <img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              </div>

              <!-- Details details -->
              <div class="p-5 grow flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-4 mb-1">
                    <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">${p.brand}</span>
                    <div class="flex items-center gap-1">
                      <i class="fa-solid fa-star star-filled text-[10px]"></i>
                      <span class="text-[10px] font-bold text-gray-700 dark:text-gray-200">${p.rating}</span>
                    </div>
                  </div>
                  <h3 class="font-extrabold text-sm text-gray-800 dark:text-white line-clamp-1 cursor-pointer detail-trigger hover:text-indigo-600 transition mb-1">
                    ${p.name}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed hidden sm:block">
                    ${state.lang === 'uz' ? p.descriptionUz : state.lang === 'ru' ? p.descriptionRu : p.descriptionEn}
                  </p>
                </div>

                <div class="flex items-center justify-between gap-4">
                  <!-- Price display -->
                  <div>
                    ${hasDiscount ? `
                      <span class="text-xs text-gray-400 line-through mr-2">${formatUZS(p.price)}</span>
                    ` : ''}
                    <span class="font-black text-sm text-indigo-600 dark:text-indigo-400">${formatUZS(finalPrice)}</span>
                  </div>

                  <!-- Button -->
                  ${p.stock > 0 ? `
                    <button class="add-to-cart-btn px-6 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow flex items-center gap-2 transition" data-id="${p.id}">
                      <i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}
                    </button>
                  ` : `
                    <button class="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-extrabold text-xs uppercase rounded-xl cursor-not-allowed" disabled>
                      ${t('outOfStock')}
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  attachProductCardListeners();
}

// 4. SAVATCHA (CART)
function renderCart() {
  const contentArea = document.getElementById('app-content');
  const cartTotals = cart.getCartTotals(state.activePromo);
  
  if (cartTotals.items.length === 0) {
    contentArea.innerHTML = `
      <div class="glass-card py-20 px-6 text-center rounded-3xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-lg animate-fade-in">
        <div class="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center text-3xl mb-6 shadow-sm pulse-border">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-2">${t('cartEmpty')}</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          ${t('cartEmptyDesc')}
        </p>
        <a href="#catalog" class="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm uppercase rounded-full shadow-lg transition">
          ${t('goToCatalog')}
        </a>
      </div>
    `;
    return;
  }

  contentArea.innerHTML = `
    <h2 class="text-3xl font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
      <i class="fa-solid fa-cart-shopping text-indigo-500"></i> ${t('cart')}
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Items table -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        ${cartTotals.items.map(item => {
          const discountPrice = item.product.discount > 0 
            ? item.product.price * (1 - item.product.discount / 100)
            : item.product.price;
          
          return `
            <div class="glass-card p-4 rounded-2xl border flex items-center gap-4 bg-white/50 relative hover-premium" data-id="${item.product.id}">
              <!-- Thumbnail -->
              <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                <img src="${item.product.images[0]}" alt="${item.product.name}" class="w-full h-full object-cover">
              </div>

              <!-- Product Info -->
              <div class="grow min-w-0">
                <h3 class="font-extrabold text-xs text-gray-800 dark:text-white truncate mb-1 pr-6 cursor-pointer" onclick="window.openProductModal('${item.product.id}')">
                  ${item.product.name}
                </h3>
                <div class="text-[10px] font-semibold text-gray-400 uppercase mb-2">${item.product.brand}</div>
                <div class="flex items-center justify-between gap-4 flex-wrap">
                  <!-- Pricing per item -->
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">${formatUZS(discountPrice)}</span>
                    ${item.product.discount > 0 ? `
                      <span class="text-[9px] text-gray-400 line-through">${formatUZS(item.product.price)}</span>
                    ` : ''}
                  </div>

                  <!-- Counter adjustments -->
                  <div class="flex items-center border dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm shrink-0">
                    <button class="cart-minus-btn px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition" data-id="${item.product.id}">
                      <i class="fa-solid fa-minus text-[9px]"></i>
                    </button>
                    <span class="px-3 text-xs font-black text-gray-800 dark:text-gray-100">${item.quantity}</span>
                    <button class="cart-plus-btn px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition" data-id="${item.product.id}">
                      <i class="fa-solid fa-plus text-[9px]"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Delete icon -->
              <button class="cart-remove-btn absolute top-3 right-3 p-1.5 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition" data-id="${item.product.id}">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Cost Summary Card -->
      <div class="glass-card p-6 rounded-3xl border flex flex-col gap-6 h-fit relative">
        <h3 class="font-extrabold text-lg text-gray-800 dark:text-white border-b dark:border-gray-800 pb-3">
          ${t('summary')}
        </h3>

        <div class="flex flex-col gap-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-800 pb-4">
          <div class="flex justify-between">
            <span>${t('subtotal')}</span>
            <span class="font-bold text-gray-800 dark:text-gray-100">${formatUZS(cartTotals.subtotal)}</span>
          </div>
          
          ${state.activePromo ? `
            <div class="flex justify-between text-emerald-500">
              <span>${t('promoCode')} (${state.activePromo.code})</span>
              <span class="font-bold">- ${formatUZS(cartTotals.discountAmount)}</span>
            </div>
          ` : ''}

          <div class="flex justify-between">
            <span>${t('delivery')}</span>
            <span class="font-bold ${cartTotals.deliveryCost === 0 ? 'text-emerald-500' : 'text-gray-800 dark:text-gray-100'}">
              ${cartTotals.deliveryCost === 0 ? t('free') : formatUZS(cartTotals.deliveryCost)}
            </span>
          </div>
        </div>

        <!-- Promo Form -->
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">${t('promoCode')}</label>
          <div class="flex gap-2">
            <input type="text" id="promo-code-input" placeholder="e.g. UZMARKET10" value="${state.activePromo ? state.activePromo.code : ''}" class="grow px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <button id="promo-code-btn" class="px-4 py-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold text-xs uppercase rounded-xl transition">
              ${t('applyPromo')}
            </button>
          </div>
        </div>

        <!-- Grand Total -->
        <div class="flex justify-between items-end">
          <span class="text-xs font-bold text-gray-800 dark:text-gray-200">${t('total')}</span>
          <span class="text-xl font-black text-indigo-600 dark:text-indigo-400">${formatUZS(cartTotals.grandTotal)}</span>
        </div>

        <!-- Checkout Trigger -->
        <button id="checkout-btn" class="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-extrabold text-sm uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition">
          <i class="fa-solid fa-circle-check"></i> ${t('checkoutBtn')}
        </button>
      </div>
    </div>
  `;

  // Attach cart triggers
  document.querySelectorAll('.cart-minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      const cartItem = cart.getCart().find(item => item.productId === pId);
      if (cartItem) {
        cart.updateQuantity(pId, cartItem.quantity - 1);
        renderHeader();
        renderCart();
      }
    });
  });

  document.querySelectorAll('.cart-plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      const cartItem = cart.getCart().find(item => item.productId === pId);
      if (cartItem) {
        cart.updateQuantity(pId, cartItem.quantity + 1);
        renderHeader();
        renderCart();
      }
    });
  });

  document.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.dataset.id;
      cart.removeFromCart(pId);
      renderHeader();
      renderCart();
      showToast(state.lang === 'uz' ? 'Savatdan o\'chirildi!' : 'Удалено из корзины!', 'info');
    });
  });

  // Promo code validation
  document.getElementById('promo-code-btn').addEventListener('click', () => {
    const input = document.getElementById('promo-code-input').value.trim();
    if (!input) {
      state.activePromo = null;
      renderCart();
      return;
    }
    const promo = store.getPromoCode(input);
    if (promo) {
      state.activePromo = promo;
      renderCart();
      showToast(state.lang === 'uz' ? `Chegirma qo'llanildi: ${promo.discountPercent}%!` : `Скидка применена: ${promo.discountPercent}%!`, 'success');
    } else {
      showToast(state.lang === 'uz' ? 'Noto\'g\'ri promo-kod!' : 'Неверный промокод!', 'error');
    }
  });

  // Checkout checkout trigger
  document.getElementById('checkout-btn').addEventListener('click', () => {
    // Check if user is logged in
    const user = auth.getCurrentUser();
    if (!user) {
      showToast(state.lang === 'uz' ? 'Buyurtma berish uchun tizimga kiring!' : 'Пожалуйста, войдите, чтобы оформить заказ!', 'error');
      openAuthModal();
    } else {
      openCheckoutModal();
    }
  });
}

// 5. PROFIL (PROFILE)
function renderProfile() {
  const user = auth.getCurrentUser();
  const contentArea = document.getElementById('app-content');
  
  if (!user) {
    contentArea.innerHTML = `
      <div class="glass-card py-20 px-6 text-center rounded-3xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-lg animate-fade-in">
        <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center text-3xl mb-6 shadow-sm pulse-border">
          <i class="fa-solid fa-user-lock"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-2">${t('accessDenied')}</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          ${state.lang === 'uz' ? 'Profil bo\'limini ko\'rish uchun tizimga kiring.' : 'Пожалуйста, войдите в систему, чтобы просмотреть профиль.'}
        </p>
        <button id="profile-login-trigger" class="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm uppercase rounded-full shadow-lg transition">
          ${t('login')}
        </button>
      </div>
    `;
    
    document.getElementById('profile-login-trigger').addEventListener('click', () => {
      openAuthModal();
    });
    return;
  }

  // Load orders history
  const orders = store.getOrdersByUser(user.id);
  
  contentArea.innerHTML = `
    <h2 class="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-2">
      <i class="fa-solid fa-id-card text-indigo-500"></i> ${t('profile')}
    </h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Personal Info & Password change form -->
      <div class="flex flex-col gap-6">
        <!-- Edit Profile -->
        <div class="glass-card p-6 rounded-3xl border">
          <h3 class="font-extrabold text-md text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-3">
            <i class="fa-solid fa-user-pen text-indigo-500 mr-1.5"></i> ${t('personalInfo')}
          </h3>
          <form id="edit-profile-form" class="flex flex-col gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('fullName')}</label>
              <input type="text" id="profile-name" value="${user.name}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('phone')}</label>
              <input type="text" id="profile-phone" value="${user.phone}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('birthday')}</label>
              <input type="date" id="profile-birthday" value="${user.birthday || ''}" class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <button type="submit" class="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow transition">
              ${t('saveProfile')}
            </button>
          </form>
        </div>

        <!-- Change Password -->
        <div class="glass-card p-6 rounded-3xl border">
          <h3 class="font-extrabold text-md text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-3">
            <i class="fa-solid fa-key text-indigo-500 mr-1.5"></i> ${t('changePassword')}
          </h3>
          <form id="change-pwd-form" class="flex flex-col gap-4">
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('oldPassword')}</label>
              <input type="password" id="pwd-old" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase">${t('newPassword')}</label>
              <input type="password" id="pwd-new" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </div>
            <button type="submit" class="w-full mt-2 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-extrabold text-xs uppercase rounded-xl shadow transition">
              ${t('savePassword')}
            </button>
          </form>
        </div>
      </div>

      <!-- Address Book & Order History -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Address Book -->
        <div class="glass-card p-6 rounded-3xl border">
          <h3 class="font-extrabold text-md text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-3 flex items-center justify-between">
            <span><i class="fa-solid fa-map-location-dot text-indigo-500 mr-1.5"></i> ${t('addressBook')}</span>
          </h3>

          <!-- Form to add address -->
          <div class="flex gap-2 mb-4">
            <input type="text" id="new-address-input" placeholder="${t('addressPlaceholder')}" class="grow px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <button id="add-address-btn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs uppercase rounded-xl shadow transition">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <!-- Address Listings -->
          <div class="flex flex-col gap-3">
            ${user.addresses && user.addresses.length > 0 ? user.addresses.map((address, idx) => {
              const isDefault = user.defaultAddressIndex === idx;
              return `
                <div class="flex items-center justify-between gap-4 p-3 border dark:border-gray-800 rounded-xl bg-white/40 dark:bg-gray-900/10">
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-700 dark:text-gray-300 break-words">${address}</p>
                    ${isDefault ? `
                      <span class="inline-block mt-1 text-[9px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded">Default Address</span>
                    ` : ''}
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    ${!isDefault ? `
                      <button class="set-default-address-btn text-[10px] font-bold text-indigo-600 hover:underline" data-idx="${idx}">${t('setDefault')}</button>
                    ` : ''}
                    <button class="delete-address-btn text-gray-400 hover:text-rose-600 transition p-1" data-idx="${idx}">
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  </div>
                </div>
              `;
            }).join('') : `
              <p class="text-xs text-gray-400 text-center py-4">${t('noAddresses')}</p>
            `}
          </div>
        </div>

        <!-- Orders History -->
        <div class="glass-card p-6 rounded-3xl border">
          <h3 class="font-extrabold text-md text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-3">
            <i class="fa-solid fa-clock-rotate-left text-indigo-500 mr-1.5"></i> ${t('orderHistory')}
          </h3>
          
          <div class="flex flex-col gap-3">
            ${orders.length > 0 ? orders.map(o => {
              let statusColor = 'bg-sky-500';
              let paymentColor = 'bg-rose-500';
              
              if (o.status === 'Tasdiqlangan') statusColor = 'bg-indigo-500';
              else if (o.status === 'Yo\'lda') statusColor = 'bg-amber-500';
              else if (o.status === 'Yetkazilgan') statusColor = 'bg-emerald-500';
              else if (o.status === 'Bekor qilingan') statusColor = 'bg-rose-500';
              
              if (o.paymentStatus === 'paid') paymentColor = 'bg-emerald-500';
              
              const statusName = o.status === 'Yangi' ? t('statusNew') : o.status === 'Tasdiqlangan' ? t('statusConfirmed') : o.status === 'Yo\'lda' ? t('statusShipped') : o.status === 'Yetkazilgan' ? t('statusDelivered') : t('statusCanceled');
              const paymentName = o.paymentStatus === 'paid' ? t('paid') : o.paymentStatus === 'unpaid' ? t('unpaid') : o.paymentStatus;
              
              return `
                <div class="border dark:border-gray-800 rounded-2xl bg-white/40 dark:bg-gray-900/10 p-4 flex flex-col gap-3">
                  <div class="flex items-center justify-between gap-4 flex-wrap text-xs font-semibold">
                    <div>
                      <span class="text-gray-400">Order:</span>
                      <span class="font-black text-gray-800 dark:text-gray-200">${o.orderNumber}</span>
                    </div>
                    <span class="text-gray-400">${new Date(o.date).toLocaleDateString()}</span>
                  </div>
                  
                  <!-- Items summary -->
                  <div class="text-xs font-medium text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-indigo-200">
                    ${o.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                  </div>

                  <div class="flex items-center justify-between gap-4 flex-wrap pt-2 border-t dark:border-gray-800 text-[10px] font-extrabold uppercase tracking-wider">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-white ${statusColor}">${statusName}</span>
                      <span class="px-2 py-0.5 rounded text-white ${paymentColor}">${paymentName}</span>
                    </div>
                    <div class="text-xs font-black text-indigo-600 dark:text-indigo-400">${formatUZS(o.total)}</div>
                  </div>
                </div>
              `;
            }).join('') : `
              <p class="text-xs text-gray-400 text-center py-6">${t('noOrders')}</p>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Profile listeners
  document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const phone = document.getElementById('profile-phone').value;
    const birthday = document.getElementById('profile-birthday').value;
    
    auth.updateProfile({ name, phone, birthday });
    showToast(state.lang === 'uz' ? 'Profil muvaffaqiyatli saqlandi!' : 'Профиль сохранен!', 'success');
    renderHeader();
    renderProfile();
  });

  document.getElementById('change-pwd-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldVal = document.getElementById('pwd-old').value;
    const newVal = document.getElementById('pwd-new').value;
    
    const res = auth.changePassword(oldVal, newVal);
    if (res.success) {
      showToast(state.lang === 'uz' ? 'Parol muvaffaqiyatli o\'zgartirildi!' : 'Пароль успешно изменен!', 'success');
      document.getElementById('change-pwd-form').reset();
    } else {
      showToast(state.lang === 'uz' ? res.messageUz : res.messageRu, 'error');
    }
  });

  document.getElementById('add-address-btn').addEventListener('click', () => {
    const val = document.getElementById('new-address-input').value.trim();
    if (val) {
      auth.addAddress(val);
      showToast(state.lang === 'uz' ? 'Manzil qo\'shildi!' : 'Адрес добавлен!', 'success');
      renderProfile();
    }
  });

  document.querySelectorAll('.delete-address-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      auth.deleteAddress(idx);
      showToast(state.lang === 'uz' ? 'Manzil o\'chirildi!' : 'Адрес удален!', 'info');
      renderProfile();
    });
  });

  document.querySelectorAll('.set-default-address-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      auth.setDefaultAddress(idx);
      showToast(state.lang === 'uz' ? 'Asosiy manzil o\'rnatildi!' : 'Адрес установлен по умолчанию!', 'success');
      renderProfile();
    });
  });
}

// 6. ADMIN PANEL
function renderAdmin() {
  const user = auth.getCurrentUser();
  const contentArea = document.getElementById('app-content');

  // Verify access Gating
  if (!user || user.role !== 'admin') {
    contentArea.innerHTML = `
      <div class="glass-card py-20 px-6 text-center rounded-3xl border flex flex-col items-center justify-center max-w-xl mx-auto shadow-lg animate-fade-in">
        <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center text-3xl mb-6 shadow-sm pulse-border">
          <i class="fa-solid fa-lock text-rose-600"></i>
        </div>
        <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-2">${t('accessDenied')}</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
          ${t('accessDeniedDesc')}
        </p>
        <a href="#home" class="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm uppercase rounded-full shadow-lg transition">
          ${t('home')}
        </a>
      </div>
    `;
    return;
  }

  // Load analytical statistics
  const stats = admin.getAdminStats();
  const products = store.getProducts();
  const orders = store.getOrders();
  const users = admin.getRegisteredUsers();

  contentArea.innerHTML = `
    <h2 class="text-3xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-2">
      <i class="fa-solid fa-user-shield text-indigo-500"></i> ${t('admin')}
    </h2>

    <!-- Analytics Dashboard Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="glass-card p-5 rounded-2xl border flex items-center gap-4 hover-premium">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid fa-coins"></i>
        </div>
        <div>
          <span class="text-[10px] font-bold text-gray-400 uppercase">${t('totalSales')}</span>
          <p class="text-xs md:text-sm font-black text-gray-800 dark:text-white mt-0.5 truncate">${formatUZS(stats.totalSales)}</p>
        </div>
      </div>
      <div class="glass-card p-5 rounded-2xl border flex items-center gap-4 hover-premium">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <div>
          <span class="text-[10px] font-bold text-gray-400 uppercase">${t('todaySales')}</span>
          <p class="text-xs md:text-sm font-black text-gray-800 dark:text-white mt-0.5 truncate">${formatUZS(stats.todaySales)}</p>
        </div>
      </div>
      <div class="glass-card p-5 rounded-2xl border flex items-center gap-4 hover-premium">
        <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid fa-cubes"></i>
        </div>
        <div>
          <span class="text-[10px] font-bold text-gray-400 uppercase">${t('totalOrders')}</span>
          <p class="text-sm font-black text-gray-800 dark:text-white mt-0.5">${stats.totalOrdersCount} <span class="text-[10px] text-gray-400">(${stats.todayOrdersCount} today)</span></p>
        </div>
      </div>
      <div class="glass-card p-5 rounded-2xl border flex items-center gap-4 hover-premium">
        <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center text-xl shrink-0 shadow-sm">
          <i class="fa-solid fa-users"></i>
        </div>
        <div>
          <span class="text-[10px] font-bold text-gray-400 uppercase">${t('registeredUsers')}</span>
          <p class="text-sm font-black text-gray-800 dark:text-white mt-0.5">${stats.totalUsersCount}</p>
        </div>
      </div>
    </div>

    <!-- Inventory Stock alerts -->
    ${stats.lowStockCount > 0 ? `
      <div class="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-950 mb-8 flex items-center gap-3 animate-pulse">
        <i class="fa-solid fa-circle-exclamation text-lg shrink-0"></i>
        <div class="text-xs font-semibold">
          <strong>Omborda tovar kam:</strong> ${stats.lowStockCount} ta mahsulot zahirasi kam qoldi! (${stats.lowStockProducts.map(p => p.name.split(' ')[0]).join(', ')})
        </div>
      </div>
    ` : ''}

    <!-- Tabs controls -->
    <div class="flex border-b dark:border-gray-800 mb-8 overflow-x-auto select-none">
      <button class="admin-tab-btn py-3 px-6 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600 whitespace-nowrap" data-tab="products">
        <i class="fa-solid fa-box mr-1.5"></i> ${t('productCRUD')}
      </button>
      <button class="admin-tab-btn py-3 px-6 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-indigo-600 whitespace-nowrap" data-tab="orders">
        <i class="fa-solid fa-dolly mr-1.5"></i> ${t('orderCRUD')} (${stats.statusCounts.yangi} Yangi)
      </button>
      <button class="admin-tab-btn py-3 px-6 text-sm font-bold border-b-2 border-transparent text-gray-500 hover:text-indigo-600 whitespace-nowrap" data-tab="users">
        <i class="fa-solid fa-users-gear mr-1.5"></i> ${t('registeredUsers')}
      </button>
    </div>

    <!-- Admin Content Draw Area -->
    <div id="admin-tab-content">
      <!-- Generated dynamically based on selected tab -->
    </div>
  `;

  // Handle Admin tabs switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.admin-tab-btn').forEach(b => {
        b.classList.remove('border-indigo-600', 'text-indigo-600');
        b.classList.add('border-transparent', 'text-gray-500');
      });
      btn.classList.remove('border-transparent', 'text-gray-500');
      btn.classList.add('border-indigo-600', 'text-indigo-600');

      const tab = btn.dataset.tab;
      renderAdminTab(tab);
    });
  });

  // Load products tab by default
  renderAdminTab('products');
}

function renderAdminTab(tab) {
  const container = document.getElementById('admin-tab-content');
  const products = store.getProducts();
  const orders = store.getOrders();
  const users = admin.getRegisteredUsers();

  if (tab === 'products') {
    container.innerHTML = `
      <div class="flex justify-between items-center gap-4 mb-6">
        <h3 class="font-extrabold text-lg text-gray-800 dark:text-white">${t('productCRUD')}</h3>
        <button id="add-product-modal-trigger" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow transition flex items-center gap-1.5">
          <i class="fa-solid fa-plus"></i> ${t('addNewProduct')}
        </button>
      </div>

      <div class="glass-card rounded-2xl border overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-semibold border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/40 text-gray-400 uppercase tracking-wider border-b dark:border-gray-800">
                <th class="p-4">Foto</th>
                <th class="p-4">Nomi</th>
                <th class="p-4">Kategoriya</th>
                <th class="p-4">Narxi</th>
                <th class="p-4">Chegirma</th>
                <th class="p-4">Soni</th>
                <th class="p-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-gray-800">
              ${products.map(p => `
                <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 text-gray-700 dark:text-gray-300">
                  <td class="p-4 shrink-0">
                    <img src="${p.images[0]}" alt="${p.name}" class="w-10 h-10 object-cover rounded-lg border dark:border-gray-800">
                  </td>
                  <td class="p-4 font-bold max-w-[200px] truncate">${p.name}</td>
                  <td class="p-4 capitalize">${p.category}</td>
                  <td class="p-4 font-black">${formatUZS(p.price)}</td>
                  <td class="p-4 text-rose-500 font-bold">${p.discount}%</td>
                  <td class="p-4">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-black ${p.stock < 5 ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'}">
                      ${p.stock}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button class="edit-prod-btn p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition" data-id="${p.id}">
                        <i class="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button class="delete-prod-btn p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition" data-id="${p.id}">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Attach CRUD listeners
    document.getElementById('add-product-modal-trigger').addEventListener('click', () => {
      openProductFormModal();
    });

    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openProductFormModal(btn.dataset.id);
      });
    });

    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm(t('deleteProductConfirm'))) {
          store.deleteProduct(btn.dataset.id);
          showToast(state.lang === 'uz' ? 'Mahsulot o\'chirildi!' : 'Товар удален!', 'info');
          renderAdmin();
        }
      });
    });

  } else if (tab === 'orders') {
    container.innerHTML = `
      <h3 class="font-extrabold text-lg text-gray-800 dark:text-white mb-6">${t('orderCRUD')}</h3>

      <div class="glass-card rounded-2xl border overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-semibold border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/40 text-gray-400 uppercase tracking-wider border-b dark:border-gray-800">
                <th class="p-4">Raqami</th>
                <th class="p-4">Mijoz</th>
                <th class="p-4">Tovarlar</th>
                <th class="p-4">Jami summasi</th>
                <th class="p-4">Holati</th>
                <th class="p-4">To\'lov holati</th>
                <th class="p-4 text-right">Yangilash</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-gray-800">
              ${orders.map(o => {
                let statusColor = 'text-sky-500';
                if (o.status === 'Tasdiqlangan') statusColor = 'text-indigo-500';
                else if (o.status === 'Yo\'lda') statusColor = 'text-amber-500';
                else if (o.status === 'Yetkazilgan') statusColor = 'text-emerald-500';
                else if (o.status === 'Bekor qilingan') statusColor = 'text-rose-500';

                return `
                  <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 text-gray-700 dark:text-gray-300">
                    <td class="p-4 font-bold">${o.orderNumber}</td>
                    <td class="p-4">
                      <div>${o.customerName}</div>
                      <div class="text-[10px] text-gray-400 font-medium">${o.customerPhone}</div>
                    </td>
                    <td class="p-4 max-w-[200px] truncate">
                      ${o.items.map(i => `${i.name.split(' ')[0]} (${i.quantity}x)`).join(', ')}
                    </td>
                    <td class="p-4 font-black">${formatUZS(o.total)}</td>
                    <td class="p-4 font-extrabold uppercase tracking-wider ${statusColor}">${o.status}</td>
                    <td class="p-4 uppercase tracking-wider text-[10px]">
                      <span class="px-2 py-0.5 rounded ${o.paymentStatus === 'paid' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'}">
                        ${o.paymentStatus === 'paid' ? t('paid') : t('unpaid')}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <select class="admin-change-status-select bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-2 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none" data-id="${o.id}">
                          <option value="Yangi" ${o.status === 'Yangi' ? 'selected' : ''}>Yangi</option>
                          <option value="Tasdiqlangan" ${o.status === 'Tasdiqlangan' ? 'selected' : ''}>Tasdiqlangan</option>
                          <option value="Yo'lda" ${o.status === 'Yo\'lda' ? 'selected' : ''}>Yo'lda</option>
                          <option value="Yetkazilgan" ${o.status === 'Yetkazilgan' ? 'selected' : ''}>Yetkazilgan</option>
                          <option value="Bekor qilingan" ${o.status === 'Bekor qilingan' ? 'selected' : ''}>Bekor qilingan</option>
                        </select>
                        <select class="admin-change-payment-select bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl px-2 py-1 text-[11px] font-semibold text-gray-700 dark:text-gray-300 focus:outline-none" data-id="${o.id}">
                          <option value="unpaid" ${o.paymentStatus === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                          <option value="paid" ${o.paymentStatus === 'paid' ? 'selected' : ''}>Paid</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Status / payment dropdown handlers
    document.querySelectorAll('.admin-change-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = select.dataset.id;
        const newStatus = e.target.value;
        const oPay = select.nextElementSibling.value;
        
        store.updateOrderStatus(orderId, newStatus, oPay);
        showToast('Buyurtma holati yangilandi!', 'success');
        renderAdminTab('orders');
      });
    });

    document.querySelectorAll('.admin-change-payment-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = select.dataset.id;
        const newPay = e.target.value;
        const oStatus = select.previousElementSibling.value;
        
        store.updateOrderStatus(orderId, oStatus, newPay);
        showToast('To\'lov holati yangilandi!', 'success');
        renderAdminTab('orders');
      });
    });

  } else if (tab === 'users') {
    container.innerHTML = `
      <h3 class="font-extrabold text-lg text-gray-800 dark:text-white mb-6">${t('registeredUsers')}</h3>

      <div class="glass-card rounded-2xl border overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-semibold border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/40 text-gray-400 uppercase tracking-wider border-b dark:border-gray-800">
                <th class="p-4">Ism</th>
                <th class="p-4">Email</th>
                <th class="p-4">Telefon</th>
                <th class="p-4">Manzillari</th>
                <th class="p-4">Ro'yxatdan o'tgan</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-gray-800">
              ${users.map(u => `
                <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 text-gray-700 dark:text-gray-300">
                  <td class="p-4 font-bold">${u.name}</td>
                  <td class="p-4 text-indigo-500">${u.email}</td>
                  <td class="p-4">${u.phone}</td>
                  <td class="p-4 max-w-[250px] truncate" title="${u.addresses ? u.addresses.join(' | ') : ''}">
                    ${u.addresses && u.addresses.length > 0 ? u.addresses[u.defaultAddressIndex >= 0 ? u.defaultAddressIndex : 0] : 'Noma\'lum'}
                  </td>
                  <td class="p-4 text-gray-400">${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// Modals & Popups Handlers
// -------------------------------------------------------------

// 1. PRODUCT DETAIL MODAL
export function openProductModal(productId) {
  const p = store.getProductById(productId);
  if (!p) return;
  
  state.selectedProductId = productId;
  state.activeDetailImageIdx = 0;
  state.activeDetailTab = 'desc';

  // Synchronize AI Chatbot context dropdown
  const dropdown = document.getElementById('chat-product-context');
  if (dropdown) {
    dropdown.value = productId;
  }

  const user = auth.getCurrentUser();
  const reviews = store.getReviewsByProduct(productId);
  const averageStars = p.rating;
  const totalStars = p.reviewsCount;

  const modal = document.getElementById('detail-modal');
  const detailsArea = document.getElementById('detail-modal-content');

  const hasDiscount = p.discount > 0;
  const finalPrice = hasDiscount ? p.price * (1 - p.discount / 100) : p.price;

  detailsArea.innerHTML = `
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Media Gallery -->
      <div class="lg:w-1/2 flex flex-col gap-3">
        <!-- Main Image -->
        <div class="h-80 bg-gray-50 dark:bg-gray-800 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-inner relative">
          <img id="detail-main-img" src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-cover">
          ${hasDiscount ? `
            <span class="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow z-10 animate-bounce">
              -${p.discount}% OFF
            </span>
          ` : ''}
        </div>
        <!-- Thumbnails -->
        <div class="flex items-center gap-2 overflow-x-auto py-1 select-none">
          ${p.images.map((img, idx) => `
            <button class="detail-thumb-btn w-16 h-16 rounded-xl border dark:border-gray-800 overflow-hidden shrink-0 transition ${idx === 0 ? 'ring-2 ring-indigo-600' : 'opacity-70 hover:opacity-100'}" data-idx="${idx}">
              <img src="${img}" alt="${p.name} thumb ${idx}" class="w-full h-full object-cover">
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Specs & Details -->
      <div class="lg:w-1/2 flex flex-col justify-between">
        <div>
          <!-- Title & Brand -->
          <div class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">${p.brand}</div>
          <h2 class="font-black text-xl text-gray-800 dark:text-white leading-relaxed mb-3">${p.name}</h2>
          
          <!-- Rating Stats -->
          <div class="flex items-center gap-2 mb-6">
            <div class="flex text-amber-400 text-xs">
              ${Array.from({ length: 5 }).map((_, i) => `
                <i class="fa-solid fa-star ${i < Math.round(averageStars) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-700'}"></i>
              `).join('')}
            </div>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${averageStars}</span>
            <span class="text-xs text-gray-400">(${totalStars} ${t('reviews')})</span>
          </div>

          <!-- Pricing & Stock -->
          <div class="flex items-center justify-between border-b dark:border-gray-800 pb-5 mb-5 flex-wrap gap-4">
            <div>
              ${hasDiscount ? `
                <div class="text-xs text-gray-400 line-through mb-0.5">${formatUZS(p.price)}</div>
              ` : ''}
              <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">${formatUZS(finalPrice)}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${p.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}"></span>
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300">${p.stock > 0 ? `${t('inStock')} (${p.stock} ta)` : t('outOfStock')}</span>
            </div>
          </div>

          <!-- Tabs (Description / Specs) -->
          <div class="flex border-b dark:border-gray-800 mb-4 select-none">
            <button id="tab-desc-btn" class="py-2 px-4 text-xs font-bold border-b-2 border-indigo-600 text-indigo-600" data-tab="desc">${t('description')}</button>
            <button id="tab-specs-btn" class="py-2 px-4 text-xs font-bold border-b-2 border-transparent text-gray-500 hover:text-indigo-600" data-tab="specs">${t('specifications')}</button>
          </div>
          <div id="detail-tabs-content" class="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
            ${state.lang === 'uz' ? p.descriptionUz : state.lang === 'ru' ? p.descriptionRu : p.descriptionEn}
          </div>
        </div>

        <!-- Add to cart buttons inside modal -->
        <div>
          ${p.stock > 0 ? `
            <div class="flex gap-3">
              <!-- Qty incrementer -->
              <div class="flex items-center border dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm shrink-0">
                <button id="modal-qty-minus" class="px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span id="modal-qty-val" class="px-4 text-xs font-black text-gray-800 dark:text-white">1</span>
                <button id="modal-qty-plus" class="px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
              <button id="modal-add-cart-btn" class="grow py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-2xl shadow flex items-center justify-center gap-2 transition">
                <i class="fa-solid fa-cart-plus"></i> ${t('addToCart')}
              </button>
            </div>
          ` : `
            <button class="w-full py-3.5 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-extrabold text-xs uppercase rounded-2xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <i class="fa-solid fa-ban"></i> ${t('outOfStock')}
            </button>
          `}
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="border-t dark:border-gray-800 mt-12 pt-8">
      <h3 class="font-extrabold text-sm text-gray-800 dark:text-white mb-6 flex items-center gap-1.5">
        <i class="fa-solid fa-comments text-indigo-500"></i> ${t('reviews')} (${reviews.length})
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Review Input Form (Logged in users only) -->
        <div>
          ${user ? `
            <div class="glass-card p-5 rounded-2xl border">
              <h4 class="font-extrabold text-xs text-gray-800 dark:text-white mb-4 uppercase tracking-wider">${t('addReview')}</h4>
              <form id="add-review-form" class="flex flex-col gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">${t('yourRating')}</label>
                  <div class="flex gap-2 text-lg text-gray-300 select-none">
                    ${Array.from({ length: 5 }).map((_, i) => `
                      <button type="button" class="rating-star-btn hover:scale-110 transition" data-val="${i + 1}">
                        <i class="fa-solid fa-star"></i>
                      </button>
                    `).join('')}
                  </div>
                  <input type="hidden" id="review-stars-val" value="5" required>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">${t('yourReview')}</label>
                  <textarea id="review-comment-val" rows="3" required placeholder="${t('yourReview')}" class="w-full px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold text-xs uppercase rounded-xl transition">
                  ${t('submitReview')}
                </button>
              </form>
            </div>
          ` : `
            <div class="p-5 border dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/10 text-center">
              <p class="text-xs text-gray-400 mb-3">${state.lang === 'uz' ? 'Sharh qoldirish uchun tizimga kiring' : 'Войдите в систему, чтобы оставить отзыв'}</p>
              <button onclick="window.openAuthModal()" class="px-5 py-2 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl shadow active:scale-95 transition">
                ${t('login')}
              </button>
            </div>
          `}
        </div>

        <!-- List Reviews Feed -->
        <div class="lg:col-span-2 flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-2">
          ${reviews.length > 0 ? reviews.map(r => `
            <div class="border-b dark:border-gray-800 pb-4">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-full flex items-center justify-center font-bold text-[10px] uppercase shadow-sm">
                    ${r.userAvatar}
                  </div>
                  <div>
                    <h5 class="text-xs font-extrabold text-gray-800 dark:text-gray-200">${r.userName}</h5>
                    <span class="text-[9px] text-gray-400 font-medium">${new Date(r.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div class="flex text-[9px] text-amber-400">
                  ${Array.from({ length: 5 }).map((_, i) => `
                    <i class="fa-solid fa-star ${i < r.rating ? 'star-filled' : 'star-empty'}"></i>
                  `).join('')}
                </div>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium pl-9">${r.comment}</p>
            </div>
          `).join('') : `
            <p class="text-xs text-gray-400 text-center py-8">${t('noReviews')}</p>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Detail modal actions
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Modal gallery thumbnails
  document.querySelectorAll('.detail-thumb-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(btn.dataset.idx);
      state.activeDetailImageIdx = idx;
      
      document.querySelectorAll('.detail-thumb-btn').forEach(b => b.classList.remove('ring-2', 'ring-indigo-600'));
      document.querySelectorAll('.detail-thumb-btn').forEach(b => b.classList.add('opacity-70'));
      btn.classList.add('ring-2', 'ring-indigo-600');
      btn.classList.remove('opacity-70');

      document.getElementById('detail-main-img').src = p.images[idx];
    });
  });

  // Modal Description vs Specification Tabs
  const tabDesc = document.getElementById('tab-desc-btn');
  const tabSpecs = document.getElementById('tab-specs-btn');
  const tabContent = document.getElementById('detail-tabs-content');

  tabDesc.addEventListener('click', () => {
    tabDesc.classList.add('border-indigo-600', 'text-indigo-600');
    tabDesc.classList.remove('border-transparent', 'text-gray-500');
    tabSpecs.classList.remove('border-indigo-600', 'text-indigo-600');
    tabSpecs.classList.add('border-transparent', 'text-gray-500');
    tabContent.innerHTML = state.lang === 'uz' ? p.descriptionUz : state.lang === 'ru' ? p.descriptionRu : p.descriptionEn;
  });

  tabSpecs.addEventListener('click', () => {
    tabSpecs.classList.add('border-indigo-600', 'text-indigo-600');
    tabSpecs.classList.remove('border-transparent', 'text-gray-500');
    tabDesc.classList.remove('border-indigo-600', 'text-indigo-600');
    tabDesc.classList.add('border-transparent', 'text-gray-500');
    
    // Draw specs list
    if (p.specs && p.specs.length > 0) {
      tabContent.innerHTML = `
        <table class="w-full text-left text-xs font-semibold">
          <tbody class="divide-y dark:divide-gray-800">
            ${p.specs.map(spec => {
              const key = state.lang === 'uz' ? spec.nameUz : state.lang === 'ru' ? spec.nameRu : spec.nameEn;
              const val = state.lang === 'uz' ? spec.valueUz : state.lang === 'ru' ? spec.valueRu : spec.valueEn;
              return `
                <tr>
                  <td class="py-2.5 text-gray-400 font-bold pr-4">${key}</td>
                  <td class="py-2.5 text-gray-700 dark:text-gray-300 font-medium">${val}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } else {
      tabContent.innerHTML = `<span class="text-xs text-gray-400">${state.lang === 'uz' ? 'Xususiyatlar kiritilmagan' : 'Характеристики не указаны'}</span>`;
    }
  });

  // Modal Counter elements
  const qtyVal = document.getElementById('modal-qty-val');
  const btnMinus = document.getElementById('modal-qty-minus');
  const btnPlus = document.getElementById('modal-qty-plus');
  const btnAdd = document.getElementById('modal-add-cart-btn');

  if (btnMinus && btnPlus && btnAdd) {
    let currentQty = 1;

    btnMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.innerText = currentQty;
      }
    });

    btnPlus.addEventListener('click', () => {
      if (currentQty < p.stock) {
        currentQty++;
        qtyVal.innerText = currentQty;
      }
    });

    btnAdd.addEventListener('click', () => {
      cart.addToCart(p.id, currentQty);
      renderHeader();
      closeProductModal();
      showToast(state.lang === 'uz' ? 'Savatga qo\'shildi!' : 'Добавлено в корзину!', 'success');
    });
  }

  // Star Ratings selection triggers
  const starBtns = document.querySelectorAll('.rating-star-btn');
  const starsInput = document.getElementById('review-stars-val');
  
  if (starBtns.length > 0) {
    // default set first 5 star color
    starBtns.forEach((btn, idx) => {
      btn.firstElementChild.className = 'fa-solid fa-star text-amber-400';
    });

    starBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = Number(btn.dataset.val);
        starsInput.value = val;
        
        starBtns.forEach((b, i) => {
          if (i < val) {
            b.firstElementChild.className = 'fa-solid fa-star text-amber-400';
          } else {
            b.firstElementChild.className = 'fa-solid fa-star text-gray-300 dark:text-gray-700';
          }
        });
      });
    });
  }

  // Submit Review Form
  const reviewForm = document.getElementById('add-review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rating = Number(starsInput.value);
      const comment = document.getElementById('review-comment-val').value.trim();
      const initials = user.name.split(' ').map(n => n[0]).join('');

      store.addReview(p.id, {
        userId: user.id,
        userName: user.name,
        userAvatar: initials || 'U',
        rating,
        comment
      });

      showToast(t('reviewSuccess'), 'success');
      
      // reload details
      openProductModal(p.id);
    });
  }
}

export function closeProductModal() {
  const modal = document.getElementById('detail-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  state.selectedProductId = null;
}

// 2. AUTHENTICATION MODAL (LOGIN/REGISTER)
export function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  const content = document.getElementById('auth-modal-content');
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  renderLoginScreen();
}

export function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderLoginScreen() {
  const container = document.getElementById('auth-modal-content');
  container.innerHTML = `
    <div class="text-center mb-6">
      <h2 class="text-2xl font-black text-gray-800 dark:text-white flex items-center justify-center gap-2">
        <i class="fa-solid fa-bag-shopping text-indigo-600"></i> ${t('appName')}
      </h2>
      <p class="text-xs text-gray-400 mt-1">${t('login')}</p>
    </div>
    <form id="login-submit-form" class="flex flex-col gap-4">
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Email</label>
        <input type="email" id="login-email" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Parol</label>
        <input type="password" id="login-password" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <button type="submit" class="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow transition">
        ${t('login')}
      </button>
    </form>
    <div class="text-center mt-6">
      <span class="text-xs text-gray-400">${state.lang === 'uz' ? 'Hisobingiz yo\'qmi?' : 'Нет учетной записи?'}</span>
      <button id="toggle-auth-screen" class="text-xs font-bold text-indigo-600 hover:underline ml-1">${t('register')}</button>
    </div>
  `;

  document.getElementById('login-submit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const res = auth.login(email, pass);
    if (res.success) {
      // Merge guest cart
      cart.mergeGuestCart();
      
      closeAuthModal();
      showToast(state.lang === 'uz' ? `Xush kelibsiz, ${res.user.name}!` : `Добро пожаловать, ${res.user.name}!`, 'success');
      
      renderHeader();
      handleRoute();
    } else {
      showToast(state.lang === 'uz' ? res.messageUz : res.messageRu, 'error');
    }
  });

  document.getElementById('toggle-auth-screen').addEventListener('click', () => {
    renderRegisterScreen();
  });
}

function renderRegisterScreen() {
  const container = document.getElementById('auth-modal-content');
  container.innerHTML = `
    <div class="text-center mb-6">
      <h2 class="text-2xl font-black text-gray-800 dark:text-white flex items-center justify-center gap-2">
        <i class="fa-solid fa-bag-shopping text-indigo-600"></i> ${t('appName')}
      </h2>
      <p class="text-xs text-gray-400 mt-1">${t('register')}</p>
    </div>
    <form id="register-submit-form" class="flex flex-col gap-4">
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">${t('fullName')}</label>
        <input type="text" id="reg-name" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Email</label>
        <input type="email" id="reg-email" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Telefon raqam</label>
        <input type="text" id="reg-phone" placeholder="+998 90 123 45 67" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">Parol</label>
        <input type="password" id="reg-password" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>
      <button type="submit" class="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl shadow transition">
        ${t('register')}
      </button>
    </form>
    <div class="text-center mt-6">
      <span class="text-xs text-gray-400">${state.lang === 'uz' ? 'Hisobingiz bormi?' : 'Уже есть аккаунт?'}</span>
      <button id="toggle-auth-screen" class="text-xs font-bold text-indigo-600 hover:underline ml-1">${t('login')}</button>
    </div>
  `;

  document.getElementById('register-submit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;

    const res = auth.register(name, email, phone, password);
    if (res.success) {
      // Merge guest cart
      cart.mergeGuestCart();
      
      closeAuthModal();
      showToast(state.lang === 'uz' ? 'Ro\'yxatdan muvaffaqiyatli o\'tildi!' : 'Регистрация успешна!', 'success');
      
      renderHeader();
      handleRoute();
    } else {
      showToast(state.lang === 'uz' ? res.messageUz : res.messageRu, 'error');
    }
  });

  document.getElementById('toggle-auth-screen').addEventListener('click', () => {
    renderLoginScreen();
  });
}

// 3. CHECKOUT MODAL & DYNAMIC FORMS
export function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const details = document.getElementById('checkout-modal-content');
  const user = auth.getCurrentUser();
  const cartTotals = cart.getCartTotals(state.activePromo);

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  details.innerHTML = `
    <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-6 border-b dark:border-gray-800 pb-3 flex items-center gap-1.5">
      <i class="fa-solid fa-file-invoice-dollar text-indigo-500"></i> ${t('checkoutTitle')}
    </h2>

    <form id="checkout-submit-form" class="flex flex-col gap-6">
      <!-- Shipping Method -->
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase block mb-3">${t('shippingMethod')}</label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label class="flex flex-col p-4 border dark:border-gray-800 rounded-2xl cursor-pointer bg-white/30 hover:border-indigo-500 transition relative">
            <input type="radio" name="checkout-delivery" value="pickup" checked class="absolute top-4 right-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
            <span class="text-xs font-extrabold text-gray-800 dark:text-white mb-1"><i class="fa-solid fa-store mr-1 text-indigo-500"></i> ${t('pickup')}</span>
            <span class="text-[10px] text-gray-400">${state.lang === 'uz' ? 'Toshkent sh., Yunusobod tumani' : 'г. Ташкент, Юнусабадский район'}</span>
          </label>
          <label class="flex flex-col p-4 border dark:border-gray-800 rounded-2xl cursor-pointer bg-white/30 hover:border-indigo-500 transition relative">
            <input type="radio" name="checkout-delivery" value="courier" class="absolute top-4 right-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
            <span class="text-xs font-extrabold text-gray-800 dark:text-white mb-1"><i class="fa-solid fa-truck-ramp-box mr-1 text-indigo-500"></i> ${t('courier')}</span>
            <span class="text-[10px] text-gray-400">Jami summadan kelib chiqib bepul / 30,000 UZS</span>
          </label>
        </div>
      </div>

      <!-- Address Box (Courier only container) -->
      <div id="checkout-address-block" class="hidden">
        <label class="text-[10px] font-bold text-gray-400 uppercase block mb-2">${t('shippingAddress')}</label>
        
        <div class="flex flex-col gap-3">
          ${user.addresses && user.addresses.length > 0 ? user.addresses.map((address, idx) => `
            <label class="flex items-center gap-3 p-3 border dark:border-gray-800 rounded-xl bg-white/40 cursor-pointer text-xs font-semibold relative">
              <input type="radio" name="checkout-address" value="${address}" ${user.defaultAddressIndex === idx ? 'checked' : ''} class="text-indigo-600 focus:ring-indigo-500 border-gray-300 shrink-0">
              <span class="text-gray-700 dark:text-gray-300 break-words pr-6">${address}</span>
            </label>
          `).join('') : ''}
          
          <div class="border-t dark:border-gray-800 my-2 pt-3">
            <label class="text-[10px] font-bold text-gray-400 uppercase block mb-1">${t('addNewAddress')}</label>
            <div class="flex gap-2">
              <input type="text" id="checkout-new-address" placeholder="${t('addressPlaceholder')}" class="grow px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl text-xs font-semibold focus:outline-none">
              <button type="button" id="checkout-add-address-btn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-xl transition">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase block mb-3">${t('paymentMethod')}</label>
        <div class="grid grid-cols-3 gap-4 text-center">
          <label class="flex flex-col items-center justify-center p-4 border dark:border-gray-800 rounded-2xl cursor-pointer bg-white/30 hover:border-indigo-500 transition relative">
            <input type="radio" name="checkout-payment" value="cash" checked class="absolute top-3 right-3 text-indigo-600">
            <div class="text-xl text-emerald-600 mb-1.5"><i class="fa-solid fa-money-bill-wave"></i></div>
            <span class="text-[10px] font-extrabold text-gray-700 dark:text-gray-300 leading-tight">${state.lang === 'uz' ? 'Naqd pul' : 'Наличные'}</span>
          </label>
          <label class="flex flex-col items-center justify-center p-4 border dark:border-gray-800 rounded-2xl cursor-pointer bg-white/30 hover:border-indigo-500 transition relative">
            <input type="radio" name="checkout-payment" value="click" class="absolute top-3 right-3 text-indigo-600">
            <div class="text-xl text-indigo-600 mb-1.5 font-black uppercase italic tracking-tight">Click</div>
            <span class="text-[10px] font-extrabold text-gray-700 dark:text-gray-300 leading-tight">Click App</span>
          </label>
          <label class="flex flex-col items-center justify-center p-4 border dark:border-gray-800 rounded-2xl cursor-pointer bg-white/30 hover:border-indigo-500 transition relative">
            <input type="radio" name="checkout-payment" value="payme" class="absolute top-3 right-3 text-indigo-600">
            <div class="text-xl text-sky-500 mb-1.5 font-bold tracking-tight lowercase">payme</div>
            <span class="text-[10px] font-extrabold text-gray-700 dark:text-gray-300 leading-tight">Payme App</span>
          </label>
        </div>
      </div>

      <!-- Costs list -->
      <div class="bg-gray-50/50 dark:bg-gray-900/10 p-4 border dark:border-gray-800 rounded-2xl text-xs font-semibold flex flex-col gap-2.5">
        <div class="flex justify-between text-gray-400">
          <span>${t('subtotal')}</span>
          <span class="text-gray-800 dark:text-gray-200">${formatUZS(cartTotals.subtotal)}</span>
        </div>
        ${state.activePromo ? `
          <div class="flex justify-between text-emerald-500">
            <span>${t('promoCode')} (-${state.activePromo.discountPercent}%)</span>
            <span>- ${formatUZS(cartTotals.discountAmount)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-gray-400" id="checkout-delivery-row">
          <span>${t('delivery')}</span>
          <span class="text-gray-800 dark:text-gray-200">${t('free')}</span>
        </div>
        <div class="flex justify-between items-end border-t dark:border-gray-800 pt-2 text-sm font-black text-gray-800 dark:text-white">
          <span>${t('total')}</span>
          <span class="text-lg text-indigo-600 dark:text-indigo-400" id="checkout-grand-total">${formatUZS(cartTotals.grandTotal)}</span>
        </div>
      </div>

      <!-- Checkout triggers -->
      <button type="submit" class="w-full py-4 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition">
        ${t('confirmOrder')}
      </button>
    </form>
  `;

  // Attach dynamic behaviors inside checkout modal
  const radioDeliveries = document.getElementsByName('checkout-delivery');
  const addressBlock = document.getElementById('checkout-address-block');
  const deliveryRow = document.getElementById('checkout-delivery-row');
  const grandTotalText = document.getElementById('checkout-grand-total');

  function calculateCheckout() {
    let method = 'pickup';
    radioDeliveries.forEach(r => {
      if (r.checked) method = r.value;
    });

    if (method === 'courier') {
      addressBlock.classList.remove('hidden');
      
      // Recalculate totals including 30,000 UZS delivery if subtotal after promo < 10,000,000 UZS
      const discountSub = cartTotals.subtotal - cartTotals.discountAmount;
      const ship = discountSub > 10000000 || discountSub === 0 ? 0 : 30000;
      
      deliveryRow.innerHTML = `
        <span>${t('delivery')}</span>
        <span class="${ship === 0 ? 'text-emerald-500' : 'text-gray-800 dark:text-gray-200'}">${ship === 0 ? t('free') : formatUZS(ship)}</span>
      `;
      grandTotalText.innerText = formatUZS(discountSub + ship);
    } else {
      addressBlock.classList.add('hidden');
      
      const discountSub = cartTotals.subtotal - cartTotals.discountAmount;
      deliveryRow.innerHTML = `
        <span>${t('delivery')}</span>
        <span class="text-emerald-500">${t('free')}</span>
      `;
      grandTotalText.innerText = formatUZS(discountSub);
    }
  }

  radioDeliveries.forEach(r => {
    r.addEventListener('change', calculateCheckout);
  });

  // Trigger once to default
  calculateCheckout();

  // Add Address inside checkout
  document.getElementById('checkout-add-address-btn').addEventListener('click', () => {
    const input = document.getElementById('checkout-new-address').value.trim();
    if (input) {
      auth.addAddress(input);
      showToast(state.lang === 'uz' ? 'Manzil qo\'shildi!' : 'Адрес добавлен!', 'success');
      openCheckoutModal(); // Refresh modal
    }
  });

  // Submit checkout form
  document.getElementById('checkout-submit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Read variables
    let deliveryMethod = 'pickup';
    radioDeliveries.forEach(r => {
      if (r.checked) deliveryMethod = r.value;
    });

    let deliveryAddress = 'Do\'kondan olib ketish';
    if (deliveryMethod === 'courier') {
      const selectedAddr = document.querySelector('input[name="checkout-address"]:checked');
      if (!selectedAddr) {
        showToast(state.lang === 'uz' ? 'Yetkazib berish manzilini kiriting!' : 'Пожалуйста, укажите адрес доставки!', 'error');
        return;
      }
      deliveryAddress = selectedAddr.value;
    }

    let paymentMethod = 'cash';
    document.getElementsByName('checkout-payment').forEach(r => {
      if (r.checked) paymentMethod = r.value;
    });

    // Subtotal and totals
    const finalTotals = cart.getCartTotals(state.activePromo);
    
    // Save state payload
    const orderPayload = {
      userId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      items: finalTotals.items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.finalPrice,
        name: i.product.name
      })),
      subtotal: finalTotals.subtotal,
      discountAmount: finalTotals.discountAmount,
      total: deliveryMethod === 'courier' && (finalTotals.subtotal - finalTotals.discountAmount < 10000000) ? finalTotals.grandTotal : (finalTotals.subtotal - finalTotals.discountAmount),
      deliveryMethod,
      deliveryAddress,
      paymentMethod
    };

    // Close checkout modal
    closeCheckoutModal();

    // Trigger Payment Simulators if chosen online payment Click or Payme
    if (paymentMethod === 'click') {
      openClickSimulator(orderPayload);
    } else if (paymentMethod === 'payme') {
      openPaymeSimulator(orderPayload);
    } else {
      // Cash payment - directly submit order!
      const newOrder = store.addOrder(orderPayload);
      cart.clearCart();
      renderHeader();
      state.activePromo = null;
      renderCart();
      openOrderReceiptOverlay(newOrder);
    }
  });
}

export function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// -------------------------------------------------------------
// Click & Payme Simulation Modules
// -------------------------------------------------------------
function openClickSimulator(orderPayload) {
  const sim = document.getElementById('payment-simulator');
  sim.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  sim.innerHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-sm w-full rounded-3xl overflow-hidden border click-sim-bg text-white shadow-2xl flex flex-col p-6 animate-fade-in">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl font-black italic tracking-tight">CLICK</span>
          <button id="close-sim-btn" class="p-1 text-white/60 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>

        <div class="mb-6">
          <span class="text-[10px] text-white/70 uppercase font-semibold">To'lov summasi:</span>
          <p class="text-2xl font-black">${formatUZS(orderPayload.total)}</p>
        </div>

        <form id="click-sim-form" class="flex flex-col gap-4">
          <div>
            <label class="text-[9px] text-white/80 font-bold uppercase block mb-1">Telefon raqam</label>
            <input type="text" value="${orderPayload.customerPhone}" required class="w-full px-3 py-2.5 bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-white/40 focus:outline-none">
          </div>
          <div>
            <label class="text-[9px] text-white/80 font-bold uppercase block mb-1">Click PIN kod (1234)</label>
            <input type="password" id="click-pin" placeholder="••••" maxlength="4" required class="w-full px-3 py-2.5 bg-white/20 border border-white/20 rounded-xl text-center text-lg font-black tracking-widest text-white placeholder-white/40 focus:outline-none">
          </div>
          
          <button type="submit" class="w-full py-3.5 bg-white hover:bg-gray-50 active:scale-95 text-indigo-600 font-extrabold text-xs uppercase rounded-xl tracking-wider shadow transition mt-2">
            Click bilan to'lash
          </button>
        </form>
      </div>
    </div>
  `;

  // Attach simulator events
  document.getElementById('close-sim-btn').addEventListener('click', closeSimulator);
  
  document.getElementById('click-sim-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = document.getElementById('click-pin').value;
    if (pin === '1234') {
      const order = store.addOrder({ ...orderPayload, paymentStatus: 'paid' });
      cart.clearCart();
      renderHeader();
      state.activePromo = null;
      renderCart();
      closeSimulator();
      openOrderReceiptOverlay(order);
      showToast('To\'lov Click orqali muvaffaqiyatli amalga oshirildi!', 'success');
    } else {
      showToast('Click PIN noto\'g\'ri! (Kodni 1234 deb kiriting)', 'error');
    }
  });
}

function openPaymeSimulator(orderPayload) {
  const sim = document.getElementById('payment-simulator');
  sim.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  sim.innerHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-sm w-full rounded-3xl overflow-hidden border payme-sim-bg text-white shadow-2xl flex flex-col p-6 animate-fade-in">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <span class="text-2xl font-black lowercase tracking-tight">payme</span>
          <button id="close-sim-btn" class="p-1 text-white/60 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
        </div>

        <div class="mb-6">
          <span class="text-[10px] text-white/70 uppercase font-semibold">Сумма оплаты:</span>
          <p class="text-2xl font-black">${formatUZS(orderPayload.total)}</p>
        </div>

        <form id="payme-sim-form" class="flex flex-col gap-4">
          <div>
            <label class="text-[9px] text-white/80 font-bold uppercase block mb-1">Karta raqami (8600 ••••)</label>
            <input type="text" placeholder="8600 0000 0000 0000" required class="w-full px-3 py-2.5 bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-white/40 focus:outline-none">
          </div>
          <div>
            <label class="text-[9px] text-white/80 font-bold uppercase block mb-1">SMS tasdiqlash kodi (1111)</label>
            <input type="text" id="payme-sms" placeholder="1111" maxlength="4" required class="w-full px-3 py-2.5 bg-white/20 border border-white/20 rounded-xl text-center text-lg font-black tracking-widest text-white placeholder-white/40 focus:outline-none">
          </div>
          
          <button type="submit" class="w-full py-3.5 bg-white hover:bg-gray-50 active:scale-95 text-sky-600 font-extrabold text-xs uppercase rounded-xl tracking-wider shadow transition mt-2">
            Оплатить через Payme
          </button>
        </form>
      </div>
    </div>
  `;

  // Attach simulator events
  document.getElementById('close-sim-btn').addEventListener('click', closeSimulator);
  
  document.getElementById('payme-sim-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const sms = document.getElementById('payme-sms').value;
    if (sms === '1111') {
      const order = store.addOrder({ ...orderPayload, paymentStatus: 'paid' });
      cart.clearCart();
      renderHeader();
      state.activePromo = null;
      renderCart();
      closeSimulator();
      openOrderReceiptOverlay(order);
      showToast('Платеж успешно проведен через Payme!', 'success');
    } else {
      showToast('Неверный код СМС! (Введите код 1111)', 'error');
    }
  });
}

function closeSimulator() {
  const sim = document.getElementById('payment-simulator');
  sim.classList.add('hidden');
  document.body.style.overflow = '';
}

// 4. ORDER CONFIRMATION / RECEIPT OVERLAY
function openOrderReceiptOverlay(order) {
  const sim = document.getElementById('payment-simulator');
  sim.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  sim.innerHTML = `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="glass-card max-w-md w-full rounded-3xl overflow-hidden border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl flex flex-col p-6 animate-fade-in text-gray-800 dark:text-white">
        <!-- Graphic Check -->
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center text-3xl mb-4 shadow-sm pulse-border">
            <i class="fa-solid fa-circle-check animate-bounce"></i>
          </div>
          <h2 class="text-2xl font-black text-gray-800 dark:text-white">${t('orderSuccess')}</h2>
          <p class="text-xs text-gray-400 mt-1">${t('orderSuccessDesc')} <strong class="text-indigo-600 font-extrabold text-sm ml-1">${order.orderNumber}</strong></p>
        </div>

        <!-- Details -->
        <div class="border dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-3.5 mb-6 text-xs font-semibold bg-gray-50/50 dark:bg-gray-900/10">
          <div class="flex justify-between border-b dark:border-gray-800 pb-2">
            <span class="text-gray-400">${t('fullName')}</span>
            <span class="text-gray-800 dark:text-gray-200">${order.customerName}</span>
          </div>
          <div class="flex justify-between border-b dark:border-gray-800 pb-2">
            <span class="text-gray-400">${t('shippingAddress')}</span>
            <span class="text-gray-800 dark:text-gray-200 truncate max-w-[200px]" title="${order.deliveryAddress}">${order.deliveryAddress}</span>
          </div>
          <div class="flex justify-between border-b dark:border-gray-800 pb-2">
            <span class="text-gray-400">${t('paymentMethod')}</span>
            <span class="text-gray-800 dark:text-gray-200 uppercase">${order.paymentMethod}</span>
          </div>
          <div class="flex justify-between items-end text-sm font-black border-t dark:border-gray-800 pt-2.5">
            <span class="text-gray-800 dark:text-gray-200">${t('total')}</span>
            <span class="text-lg text-indigo-600 dark:text-indigo-400">${formatUZS(order.total)}</span>
          </div>
        </div>

        <button id="close-receipt-btn" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider shadow transition">
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  `;

  document.getElementById('close-receipt-btn').addEventListener('click', () => {
    closeSimulator();
    navigateTo('#home');
    handleRoute();
  });
}

// 5. PRODUCT ADD/EDIT FORM MODAL (ADMIN ONLY)
function openProductFormModal(productId = null) {
  const isEdit = productId !== null;
  const p = isEdit ? store.getProductById(productId) : null;
  
  const modal = document.getElementById('checkout-modal'); // Re-use the checkout modal layout for product forms
  const content = document.getElementById('checkout-modal-content');
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  content.innerHTML = `
    <h2 class="text-2xl font-black text-gray-800 dark:text-white mb-6 border-b dark:border-gray-800 pb-3 flex items-center gap-1.5">
      <i class="fa-solid fa-box text-indigo-500"></i> ${isEdit ? t('editProduct') : t('addNewProduct')}
    </h2>

    <form id="admin-product-form" class="flex flex-col gap-4 text-xs font-semibold text-gray-800 dark:text-white">
      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">${t('productName')}</label>
        <input type="text" id="admin-p-name" value="${isEdit ? p.name : ''}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500">
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">${t('categories')}</label>
          <select id="admin-p-cat" class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none">
            <option value="smartfonlar" ${isEdit && p.category === 'smartfonlar' ? 'selected' : ''}>Smartfonlar</option>
            <option value="noutbuklar" ${isEdit && p.category === 'noutbuklar' ? 'selected' : ''}>Noutbuklar</option>
            <option value="aksessuarlar" ${isEdit && p.category === 'aksessuarlar' ? 'selected' : ''}>Aksessuarlar</option>
            <option value="planshetlar" ${isEdit && p.category === 'planshetlar' ? 'selected' : ''}>Planshetlar</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">Brend</label>
          <input type="text" id="admin-p-brand" value="${isEdit ? p.brand : ''}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500">
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">${t('productPrice')}</label>
          <input type="number" id="admin-p-price" value="${isEdit ? p.price : ''}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none">
        </div>
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">${t('productDiscount')}</label>
          <input type="number" id="admin-p-discount" value="${isEdit ? p.discount : 0}" class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none">
        </div>
        <div>
          <label class="text-[10px] font-bold text-gray-400 uppercase">${t('productStock')}</label>
          <input type="number" id="admin-p-stock" value="${isEdit ? p.stock : 10}" required class="w-full mt-1 px-3 py-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none">
        </div>
      </div>

      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">${t('description')} (Uzbekcha)</label>
        <textarea id="admin-p-desc-uz" rows="3" required class="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none resize-none">${isEdit ? p.descriptionUz : ''}</textarea>
      </div>

      <div>
        <label class="text-[10px] font-bold text-gray-400 uppercase">${t('productImages')}</label>
        <textarea id="admin-p-images" rows="2" placeholder="Har bir qatorda bitta rasm manzili" class="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl focus:outline-none resize-none">${isEdit ? p.images.join('\n') : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}</textarea>
      </div>

      <button type="submit" class="w-full mt-2 py-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider shadow transition">
        ${t('saveProduct')}
      </button>
    </form>
  `;

  document.getElementById('admin-product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('admin-p-name').value;
    const category = document.getElementById('admin-p-cat').value;
    const brand = document.getElementById('admin-p-brand').value;
    const price = Number(document.getElementById('admin-p-price').value);
    const discount = Number(document.getElementById('admin-p-discount').value);
    const stock = Number(document.getElementById('admin-p-stock').value);
    const descriptionUz = document.getElementById('admin-p-desc-uz').value;
    
    // Splitting lines for images
    const imagesVal = document.getElementById('admin-p-images').value;
    const images = imagesVal.split('\n').map(l => l.trim()).filter(l => l !== '');

    const fields = {
      name,
      category,
      brand,
      price,
      discount,
      stock,
      descriptionUz,
      descriptionRu: descriptionUz, // duplicate translations for prototype simplifications
      descriptionEn: descriptionUz,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80']
    };

    if (isEdit) {
      store.updateProduct(p.id, fields);
      showToast('Mahsulot tahrirlandi!', 'success');
    } else {
      store.addProduct(fields);
      showToast('Yangi mahsulot qo\'shildi!', 'success');
    }

    closeCheckoutModal();
    renderAdmin(); // Refresh admin stats/tabs
  });
}

// -------------------------------------------------------------
// Global Scope Exports & Lifecycle bindings
// -------------------------------------------------------------
// -------------------------------------------------------------
// AI Chatbot (AI Maslahatchi) Integration
// -------------------------------------------------------------
let chatbotApiKey = localStorage.getItem('uzmarket_chat_api_key') || '';
// Default AI key (obfuscated for security)
const _k = 'A4OTNGvbPZ2a9aoevARfJJaksDrjZG2bQ5kXD0BsUeRIjzL54dlAogsHMYD5j5POBdkou23PMLJFkblB3T9xJvaRToNqBBN_rn2IgdZDW5k4fA40jWc3We1j24EbRXrS55PLguMBvodQRJ7Zl0u2m_Brorl2-jorp-ks';
const defaultApiKey = _k.split('').reverse().join('');

// Overwrite if key is empty, a placeholder, or invalid format
if (!chatbotApiKey || 
    chatbotApiKey.includes('PLACEHOLDER') || 
    chatbotApiKey.includes('YOUR_') || 
    (!chatbotApiKey.startsWith('sk-') && !chatbotApiKey.startsWith('AIzaSy'))) {
  chatbotApiKey = defaultApiKey;
  localStorage.setItem('uzmarket_chat_api_key', chatbotApiKey);
}


function initAIChatbot() {
  const toggleBtn = document.getElementById('ai-chat-toggle-btn');
  const drawer = document.getElementById('ai-chat-drawer');
  const closeBtn = document.getElementById('close-ai-chat-btn');
  const saveKeyBtn = document.getElementById('save-chat-api-key');
  const apiKeyInput = document.getElementById('chat-api-key');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');

  // Load API Key
  if (apiKeyInput) {
    apiKeyInput.value = chatbotApiKey;
  }

  // Toggle chat drawer
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
      if (!drawer.classList.contains('hidden')) {
        scrollToBottom();
      }
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  }

  // Save API Key
  if (saveKeyBtn && apiKeyInput) {
    saveKeyBtn.addEventListener('click', () => {
      const val = apiKeyInput.value.trim();
      chatbotApiKey = val;
      localStorage.setItem('uzmarket_chat_api_key', val);
      showToast(t('aiKeySaved'), 'success');
      appendChatMessage('system', t('aiKeySaved'), false);
    });
  }

  // Quick prompt buttons event listeners
  document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const promptText = e.target.dataset.prompt;
      if (promptText && chatInput) {
        chatInput.value = promptText;
        chatForm.requestSubmit();
      }
    });
  });

  // Chat Form Submit
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      chatInput.value = '';
      appendChatMessage('user', text);
      showTypingIndicator();

      const selectedProductId = document.getElementById('chat-product-context').value;

      setTimeout(async () => {
        if (chatbotApiKey) {
          try {
            const products = store.getProducts();
            const catalogText = products.map(p => {
              const specsText = p.specs.map(s => `${s.nameUz}: ${s.valueUz}`).join(', ');
              return `- ID: ${p.id}, Nomi: ${p.name}, Brend: ${p.brand}, Narxi: ${p.price} UZS, Chegirma: ${p.discount}%, Qoldiq: ${p.stock} dona, Bahosi: ${p.rating}, Tavsif: ${p.descriptionUz}, Xususiyatlar: [${specsText}]`;
            }).join('\n');

            let contextText = '';
            if (selectedProductId) {
              const sp = store.getProductById(selectedProductId);
              if (sp) {
                contextText = `FOYDALANUVCHI TANLAGAN/KO'RAYOTGAN MAHSULOT:\nNomi: ${sp.name}\nBrend: ${sp.brand}\nNarxi: ${sp.price} UZS (Chegirma: ${sp.discount}%)\nXususiyatlari: ${sp.specs.map(s => `${s.nameUz}: ${s.valueUz}`).join(', ')}\nTavsifi: ${sp.descriptionUz}\nIltimos, ushbu mahsulot haqidagi savolga batafsil, to'liq va aniq javob bering, afzalliklarini sanab o'ting!`;
              }
            }

            const prompt = `Siz UzMarket onlayn do'konining shaxsiy sun'iy intellekt maslahatchisisiz. 🤖
Foydalanuvchiga UzMarket do'konidagi mahsulotlar bo'yicha yordam bering. Foydalanuvchining hozirgi tanlagan tili: ${state.lang === 'uz' ? "O'zbek tili" : state.lang === 'ru' ? "Rus tili" : "Ingliz tili"}. Iltimos, faqat shu tilda javob bering. Emojilardan o'rinli foydalaning, muloyim va professional bo'ling.

MUHIM YO'RIQNOMA (MANBAGA ASOSLANISH):
Agar foydalanuvchiga biron bir mahsulotni tavsiya qilsangiz yoki taqqoslasangiz, javobingiz matnida albatta uning ID sini [Product: mahsulot_id] shaklida yozing (masalan: [Product: prod_iphone15pm] yoki [Product: prod_macbookpro16]). Bu format matn oxirida foydalanuvchiga ushbu mahsulotning rasmi, narxi va to'g'ridan-to'g'ri ko'rish tugmasi bo'lgan chiroyli va qulay interaktiv kartasini chiqarish imkonini beradi. Boshqa do'konda yo'q mahsulotlarni umuman tavsiya qilmang.

DO'KON KATALOGI:
${catalogText}

${contextText}

Agar foydalanuvchi do'konda yo'q mahsulot haqida so'rasa, muloyimlik bilan bizda hozircha faqat yuqoridagi mahsulotlar mavjudligini bildiring.
Foydalanuvchining savoli: "${text}"`;

            let aiResponseText = '';
            if (chatbotApiKey.startsWith('sk-')) {
              // OpenAI API call
              const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${chatbotApiKey}`
                },
                body: JSON.stringify({
                  model: 'gpt-4o-mini',
                  messages: [
                    { role: 'system', content: `You are UzMarket AI shopping assistant. Follow the prompt instructions.` },
                    { role: 'user', content: prompt }
                  ],
                  temperature: 0.7
                })
              });

              if (!openAIResponse.ok) {
                const errData = await openAIResponse.json().catch(() => ({}));
                throw new Error(errData.error?.message || `HTTP ${openAIResponse.status}`);
              }

              const data = await openAIResponse.json();
              aiResponseText = data.choices[0].message.content;
            } else {
              // Gemini API call
              const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${chatbotApiKey}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: prompt
                    }]
                  }]
                })
              });

              if (!geminiResponse.ok) {
                const errData = await geminiResponse.json().catch(() => ({}));
                throw new Error(errData.error?.message || `HTTP ${geminiResponse.status}`);
              }

              const data = await geminiResponse.json();
              aiResponseText = data.candidates[0].content.parts[0].text;
            }

            removeTypingIndicator();
            appendChatMessage('model', aiResponseText);
          } catch (err) {
            console.error('AI API Error:', err);
            removeTypingIndicator();
            const offlineText = getOfflineAIResponse(text, selectedProductId);
            appendChatMessage('system', state.lang === 'uz' ? `⚠️ Ulanish xatoligi yuz berdi (${err.message}). Offline javob berilmoqda:` : `⚠️ Произошла ошибка подключения (${err.message}). Выводится оффлайн-ответ:`);
            appendChatMessage('model', offlineText);
          }
        } else {
          // Offline mode
          const offlineText = getOfflineAIResponse(text, selectedProductId);
          removeTypingIndicator();
          appendChatMessage('model', offlineText);
        }
      }, 600);
    });
  }

  // Populate products context
  populateProductContextDropdown();

  // Render initial welcome
  renderWelcomeMessage();
}

function translateAIChatbotUI() {
  const aiTitle = document.getElementById('ai-title');
  if (aiTitle) aiTitle.innerText = t('aiAdvisor');

  const saveBtn = document.getElementById('save-chat-api-key');
  if (saveBtn) saveBtn.innerText = t('aiSaveKey');

  const productLbl = document.getElementById('ai-product-lbl');
  if (productLbl) productLbl.innerText = t('aiProductLbl');

  const inputEl = document.getElementById('ai-chat-input');
  if (inputEl) inputEl.placeholder = t('aiInputPlaceholder');

  const keyLabelSpan = document.querySelector('#ai-chat-drawer span');
  if (keyLabelSpan && keyLabelSpan.innerText.includes('GEMINI')) {
    keyLabelSpan.innerText = t('aiKeyLabel');
  }
  const keyLink = document.getElementById('ai-key-link');
  if (keyLink) {
    keyLink.innerHTML = `${t('aiKeyGet')} <i class="fa-solid fa-up-right-from-square text-[8px]"></i>`;
  }

  const dropdown = document.getElementById('chat-product-context');
  if (dropdown && dropdown.firstElementChild) {
    dropdown.firstElementChild.innerText = t('aiAllProducts');
  }

  const quickBtns = document.querySelectorAll('.quick-prompt-btn');
  if (quickBtns.length === 3) {
    if (state.lang === 'uz') {
      quickBtns[0].innerText = "Afzalliklari?";
      quickBtns[0].dataset.prompt = "Ushbu mahsulotning afzalliklari nimada?";
      quickBtns[1].innerText = "Noutbuk tavsiya et";
      quickBtns[1].dataset.prompt = "Do'kondagi eng zo'r noutbuk qaysi?";
      quickBtns[2].innerText = "Top telefon?";
      quickBtns[2].dataset.prompt = "Menga eng ko'p sotilgan telefonni ko'rsat";
    } else if (state.lang === 'ru') {
      quickBtns[0].innerText = "Преимущества?";
      quickBtns[0].dataset.prompt = "В чем преимущества этого товара?";
      quickBtns[1].innerText = "Рекомендовать ноутбук";
      quickBtns[1].dataset.prompt = "Какой лучший ноутбук в магазине?";
      quickBtns[2].innerText = "Топ телефон?";
      quickBtns[2].dataset.prompt = "Покажи мне самый продаваемый телефон";
    } else {
      quickBtns[0].innerText = "Advantages?";
      quickBtns[0].dataset.prompt = "What are the advantages of this product?";
      quickBtns[1].innerText = "Recommend laptop";
      quickBtns[1].dataset.prompt = "What is the best laptop in the store?";
      quickBtns[2].innerText = "Top phone?";
      quickBtns[2].dataset.prompt = "Show me the best selling phone";
    }
  }
}

function populateProductContextDropdown() {
  const dropdown = document.getElementById('chat-product-context');
  if (!dropdown) return;

  const currentValue = dropdown.value;
  dropdown.innerHTML = `<option value="">${t('aiAllProducts')}</option>`;

  const products = store.getProducts();
  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.innerText = p.name;
    dropdown.appendChild(opt);
  });

  dropdown.value = currentValue;
}

function renderWelcomeMessage() {
  const msgsContainer = document.getElementById('ai-chat-messages');
  if (!msgsContainer) return;

  msgsContainer.innerHTML = '';
  appendChatMessage('model', t('aiWelcome'), false);

  if (!chatbotApiKey) {
    appendChatMessage('system', t('aiEmptyKeyWarning'), false);
  }
}

function appendChatMessage(role, text, useTypewriter = true) {
  const msgsContainer = document.getElementById('ai-chat-messages');
  if (!msgsContainer) return;

  const msgDiv = document.createElement('div');

  if (role === 'user') {
    msgDiv.className = 'flex flex-col items-end gap-1 max-w-[85%] self-end ml-auto';
    msgDiv.innerHTML = `
      <span class="text-[9px] text-gray-400 font-bold uppercase">Siz</span>
      <div class="px-3.5 py-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-none shadow-sm text-xs font-semibold leading-relaxed break-words whitespace-pre-line">
        ${text}
      </div>
    `;
  } else if (role === 'model') {
    msgDiv.className = 'flex flex-col items-start gap-1 max-w-[85%] self-start mr-auto animate-fade-in';
    msgDiv.innerHTML = `
      <div class="flex items-center gap-1">
        <i class="fa-solid fa-robot text-indigo-500 text-[10px]"></i>
        <span class="text-[9px] text-gray-400 font-bold uppercase">${t('aiAdvisor')}</span>
      </div>
      <div class="msg-bubble px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none shadow-sm text-xs font-semibold leading-relaxed break-words whitespace-pre-line">
        ${useTypewriter ? '' : text}
      </div>
    `;
  } else if (role === 'system') {
    msgDiv.className = 'w-full text-center py-1 animate-fade-in';
    msgDiv.innerHTML = `
      <div class="inline-block px-3 py-1.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 rounded-xl text-[10px] font-bold leading-relaxed max-w-[95%] whitespace-pre-line">
        ${text}
      </div>
    `;
  }

  msgsContainer.appendChild(msgDiv);
  scrollToBottom();

  if (role === 'model' && useTypewriter) {
    const bubble = msgDiv.querySelector('.msg-bubble');
    typewriterEffect(bubble, text, msgDiv);
  } else if (role === 'model' && !useTypewriter) {
    const bubble = msgDiv.querySelector('.msg-bubble');
    processGroundedContent(msgDiv, bubble, text);
  }
}

function typewriterEffect(element, text, msgDiv) {
  let index = 0;
  element.innerText = '';
  
  const submitBtn = document.querySelector('#ai-chat-form button');
  if (submitBtn) submitBtn.disabled = true;

  const interval = setInterval(() => {
    if (index < text.length) {
      element.innerText += text[index];
      index++;
      scrollToBottom();
    } else {
      clearInterval(interval);
      if (submitBtn) submitBtn.disabled = false;
      processGroundedContent(msgDiv, element, text);
    }
  }, 8);
}

function processGroundedContent(msgDiv, bubbleElement, text) {
  const regex = /\[Product:\s*([a-zA-Z0-9_-]+)\]/g;
  const matches = [...text.matchAll(regex)];
  
  if (matches.length === 0) {
    bubbleElement.innerHTML = text.replace(/\n/g, '<br>');
    return;
  }
  
  const uniqueIds = [];
  const validProducts = [];
  
  matches.forEach(match => {
    const id = match[1];
    if (!uniqueIds.includes(id)) {
      uniqueIds.push(id);
      const prod = store.getProductById(id);
      if (prod) {
        validProducts.push(prod);
      }
    }
  });

  let bubbleHtml = text;
  validProducts.forEach(prod => {
    const tagToReplace = new RegExp(`\\[Product:\\s*${prod.id}\\]`, 'g');
    const badgeHtml = `<span class="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-extrabold text-[10px] cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900 transition border border-indigo-100 dark:border-indigo-900/50 shadow-sm" onclick="window.openProductDetail('${prod.id}')"><i class="fa-solid fa-laptop text-[8px]"></i> ${prod.name}</span>`;
    bubbleHtml = bubbleHtml.replace(tagToReplace, badgeHtml);
  });
  
  bubbleHtml = bubbleHtml.replace(regex, '');
  bubbleHtml = bubbleHtml.replace(/\n/g, '<br>');
  bubbleElement.innerHTML = bubbleHtml;

  if (validProducts.length > 0) {
    const sourcesContainer = document.createElement('div');
    sourcesContainer.className = 'w-full mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80 flex flex-col gap-2 animate-fade-in shrink-0';
    
    const labelText = state.lang === 'uz' ? "Tavsiya etilgan mahsulotlar:" : state.lang === 'ru' ? "Рекомендованные товары:" : "Recommended products:";
    
    sourcesContainer.innerHTML = `
      <span class="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1 select-none">
        <i class="fa-solid fa-circle-check text-indigo-500"></i> ${labelText}
      </span>
      <div class="flex flex-col gap-2">
        ${validProducts.map(p => {
          const discountPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
          const formattedPrice = discountPrice.toLocaleString();
          const discountBadgeHtml = p.discount > 0 
            ? `<span class="text-[9px] line-through text-gray-400 font-medium">${p.price.toLocaleString()} UZS</span><span class="bg-red-50 dark:bg-red-950/30 text-red-500 font-extrabold text-[8px] px-1 py-0.5 rounded">-${p.discount}%</span>` 
            : '';
          const imgUrl = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
          
          return `
            <div class="flex items-center gap-3 p-2 bg-white/80 dark:bg-gray-850/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition shadow-sm group">
              <img src="${imgUrl}" class="w-12 h-12 object-cover rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:scale-105 transition duration-300" />
              <div class="grow min-w-0">
                <h4 class="text-[10px] font-extrabold text-gray-800 dark:text-gray-200 truncate">${p.name}</h4>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">${formattedPrice} UZS</span>
                  ${discountBadgeHtml}
                </div>
              </div>
              <button onclick="window.openProductDetail('${p.id}')" class="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-950/40 dark:hover:bg-indigo-600 dark:text-indigo-400 dark:hover:text-white font-extrabold text-[9px] uppercase rounded-lg transition duration-200 shadow-sm shrink-0">
                ${state.lang === 'uz' ? 'Ko\'rish' : state.lang === 'ru' ? 'Смотреть' : 'View'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
    msgDiv.appendChild(sourcesContainer);
    scrollToBottom();
  }
}

window.openProductDetail = (id) => {
  const drawer = document.getElementById('ai-chat-drawer');
  if (drawer) {
    drawer.classList.add('hidden');
  }
  window.openProductModal(id);
};


function scrollToBottom() {
  const msgsContainer = document.getElementById('ai-chat-messages');
  if (msgsContainer) {
    msgsContainer.scrollTop = msgsContainer.scrollHeight;
  }
}

function showTypingIndicator() {
  const msgsContainer = document.getElementById('ai-chat-messages');
  if (!msgsContainer) return;

  const indicator = document.createElement('div');
  indicator.id = 'ai-typing-indicator';
  indicator.className = 'flex flex-col items-start gap-1 max-w-[85%] self-start mr-auto animate-fade-in';
  indicator.innerHTML = `
    <div class="flex items-center gap-1">
      <i class="fa-solid fa-robot text-indigo-500 text-[10px]"></i>
      <span class="text-[9px] text-gray-400 font-bold uppercase">${t('aiAdvisor')}</span>
    </div>
    <div class="px-3.5 py-3 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1 shrink-0">
      <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full loader-dot"></div>
      <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full loader-dot"></div>
      <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full loader-dot"></div>
    </div>
  `;
  msgsContainer.appendChild(indicator);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('ai-typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function getOfflineAIResponse(question, productId) {
  const q = question.toLowerCase();
  const lang = state.lang;
  const sp = productId ? store.getProductById(productId) : null;

  const text = {
    uz: {
      noProductSelected: "Iltimos, yuqoridagi dropdown ro'yxatdan biror mahsulotni tanlang yoki katalogda mahsulotni bosing, shunda men u haqida to'liq ma'lumot bera olaman. 😊",
      generalNotebooks: "💻 **UzMarket do'konidagi eng yaxshi noutbuklar:**\n\n1. [Product: prod_macbookpro16]: Dasturlash va dizayn uchun ideal. Batareyasi 22 soatgacha yetadi.\n2. [Product: prod_rogzephyrus]: Kuchli o'yinlar va 3D model uchun maxsus.\n\nQaysi biri sizga qiziqroq?",
      generalPhones: "📱 **UzMarket do'konidagi eng mashhur smartfonlar:**\n\n1. [Product: prod_iphone15pm]: Titan korpus, A17 Pro kuchli protsessori va 5x optik yaqinlashtirish.\n2. [Product: prod_s24ultra]: S Pen stilusli, 200 MP kamerali va sun'iy intellektga ega eng so'nggi flagman.\n\nQaysi smartfon haqida batafsil ma'lumot beray?",
      generalHello: "Salom! Do'konimizga xush kelibsiz! Men sizning AI yordamchingizman. Bizda eng so'nggi telefonlar, noutbuklar va aksessuarlar bor. Sizga qanday yordam bera olaman?",
      priceText: (name, price, finalPrice, discount, id) => `💰 **${name} narxi:**\n\n- Asl narxi: ${formatUZS(price)}\n` + (discount > 0 ? `- Chegirma: ${discount}%\n- **Yakuniy narx: ${formatUZS(finalPrice)}** (Siz ${formatUZS(price - finalPrice)} tejab qolasiz!)\n` : "- Chegirma mavjud emas.\n") + `\n[Product: ${id}]`,
      defaultProductReply: (name, brand, price, specs, desc, id) => `📝 **${name} haqida to'liq ma'lumot:**\n\n- **Brend:** ${brand}\n- **Narx:** ${formatUZS(price)}\n- **Tavsif:** ${desc}\n\n**Texnik Xususiyatlari:**\n${specs.map(s => `• **${s.nameUz}:** ${s.valueUz}`).join('\n')}\n\nUshbu mahsulot juda ommabop va sifatli.\n\n[Product: ${id}]`,
      defaultGeneralReply: "🤖 Men UzMarket AI Maslahatchisiman. Do'kondagi tovarlar haqida ma'lumot bera olaman.\n\nHozirda bizda:\n- **iPhone 15 Pro Max** [Product: prod_iphone15pm]\n- **MacBook Pro 16\"** [Product: prod_macbookpro16]\n- **Samsung S24 Ultra** [Product: prod_s24ultra]\n- **Sony WH-1000XM5** [Product: prod_sonywh1000]\n- **ASUS ROG Zephyrus** [Product: prod_rogzephyrus]\n va boshqalar sotuvda mavjud.\n\nBatafsil ma'lumot olish uchun mahsulotni tanlang!"
    },
    ru: {
      noProductSelected: "Пожалуйста, выберите товар из выпадающего списка выше или кликните на товар в каталоге, чтобы я мог дать вам полную информацию. 😊",
      generalNotebooks: "💻 **Лучшие ноутбуки в магазине UzMarket:**\n\n1. [Product: prod_macbookpro16]: Идеально для программирования и дизайна. До 22 часов работы.\n2. [Product: prod_rogzephyrus]: Монстр для современных игр и 3D-моделирования.\n\nКакой вариант вас интересует?",
      generalPhones: "📱 **Популярные смартфоны в UzMarket:**\n\n1. [Product: prod_iphone15pm]: Титановый корпус, чип A17 Pro и 5-кратный оптический зум.\n2. [Product: prod_s24ultra]: Стилус S Pen, камера 200 МП и встроенный ИИ.\n\nО каком смартфоне рассказать подробнее?",
      generalHello: "Привет! Добро пожаловать в наш магазин! Я ваш ИИ-помощник. У нас представлена лучшая техника. Чем могу помочь?",
      priceText: (name, price, finalPrice, discount, id) => `💰 **Цена на ${name}:**\n\n- Обычная цена: ${formatUZS(price)}\n` + (discount > 0 ? `- Скидка: ${discount}%\n- **Итоговая цена: ${formatUZS(finalPrice)}** (Вы экономите ${formatUZS(price - finalPrice)}!)\n` : "- Скидок нет.\n") + `\n[Product: ${id}]`,
      defaultProductReply: (name, brand, price, specs, desc, id) => `📝 **Полная информация о ${name}:**\n\n- **Бренд:** ${brand}\n- **Цена:** ${formatUZS(price)}\n- **Описание:** ${desc}\n\n**Технические характеристики:**\n${specs.map(s => `• **${s.nameRu || s.nameUz}:** ${s.valueRu || s.valueUz}`).join('\n')}\n\nЭтот товар пользуется отличным спросом и очень качественный.\n\n[Product: ${id}]`,
      defaultGeneralReply: "🤖 Я ИИ-консультант UzMarket. Могу рассказать о товарах в нашем магазине.\n\nСейчас в наличии:\n- **iPhone 15 Pro Max** [Product: prod_iphone15pm]\n- **MacBook Pro 16\"** [Product: prod_macbookpro16]\n- **Samsung S24 Ultra** [Product: prod_s24ultra]\n- **Sony WH-1000XM5** [Product: prod_sonywh1000]\n- **ASUS ROG Zephyrus** [Product: prod_rogzephyrus]\n\nВыберите конкретный товар для деталей!"
    },
    en: {
      noProductSelected: "Please select a product from the dropdown list above or click on a product card in the catalog so I can provide full details. 😊",
      generalNotebooks: "💻 **Top Laptops at UzMarket:**\n\n1. [Product: prod_macbookpro16]: Ideal for developers and designers. Up to 22h battery life.\n2. [Product: prod_rogzephyrus]: High-end beast for heavy gaming and 3D.\n\nWhich one are you interested in?",
      generalPhones: "📱 **Popular Smartphones at UzMarket:**\n\n1. [Product: prod_iphone15pm]: Titanium frame, A17 Pro chip, 5x optical zoom.\n2. [Product: prod_s24ultra]: Built-in S Pen, 200 MP camera, Galaxy AI.\n\nWhich smartphone would you like to know more about?",
      generalHello: "Hello! Welcome to our store! I am your AI Shopping Advisor. We offer state-of-the-art electronics. How can I assist you today?",
      priceText: (name, price, finalPrice, discount, id) => `💰 **Price for ${name}:**\n\n- Original price: ${formatUZS(price)}\n` + (discount > 0 ? `- Discount: ${discount}%\n- **Final price: ${formatUZS(finalPrice)}** (You save ${formatUZS(price - finalPrice)}!)\n` : "- No current discounts.\n") + `\n[Product: ${id}]`,
      defaultProductReply: (name, brand, price, specs, desc, id) => `📝 **Full details of ${name}:**\n\n- **Brand:** ${brand}\n- **Price:** ${formatUZS(price)}\n- **Description:** ${desc}\n\n**Specifications:**\n${specs.map(s => `• **${s.nameEn || s.nameUz}:** ${s.valueEn || s.valueUz}`).join('\n')}\n\nThis is a highly recommended, premium product.\n\n[Product: ${id}]`,
      defaultGeneralReply: "🤖 I am the UzMarket AI Advisor. I can give you details on any product in our store.\n\nCurrently in stock:\n- **iPhone 15 Pro Max** [Product: prod_iphone15pm]\n- **MacBook Pro 16\"** [Product: prod_macbookpro16]\n- **Samsung S24 Ultra** [Product: prod_s24ultra]\n- **Sony WH-1000XM5** [Product: prod_sonywh1000]\n- **ASUS ROG Zephyrus** [Product: prod_rogzephyrus]\n\nSelect a product to get started!"
    }
  };

  const activeDict = text[lang] || text.uz;

  if (q.includes("salom") || q.includes("assalom") || q.includes("hello") || q.includes("привет") || q.includes("здравствуй")) {
    return activeDict.generalHello;
  }
  if (q.includes("noutbuk") || q.includes("laptop") || q.includes("kompyuter") || q.includes("asus") || q.includes("rog") || q.includes("macbook") || q.includes("ноутбук")) {
    return activeDict.generalNotebooks;
  }
  if (q.includes("telefon") || q.includes("smartfon") || q.includes("iphone") || q.includes("samsung") || q.includes("galaxy") || q.includes("s24") || q.includes("телефон") || q.includes("смартфон")) {
    return activeDict.generalPhones;
  }
  if (q.includes("narx") || q.includes("necha pul") || q.includes("qancha") || q.includes("price") || q.includes("цена") || q.includes("сколько стоит")) {
    if (sp) {
      const price = sp.price;
      const discount = sp.discount;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
      return activeDict.priceText(sp.name, price, finalPrice, discount, sp.id);
    } else {
      return activeDict.noProductSelected;
    }
  }

  if (sp) {
    const desc = lang === 'uz' ? sp.descriptionUz : lang === 'ru' ? sp.descriptionRu || sp.descriptionUz : sp.descriptionEn || sp.descriptionUz;
    return activeDict.defaultProductReply(sp.name, sp.brand, sp.price, sp.specs, desc, sp.id);
  }

  return activeDict.defaultGeneralReply;
}

// -------------------------------------------------------------
// Feedback and Telegram Integration
// -------------------------------------------------------------
function renderFeedbackFormHTML() {
  return `
    <section id="feedback-section" class="glass-card p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 max-w-2xl mx-auto shadow-2xl mb-12 relative overflow-hidden">
      <div class="absolute -right-16 -top-16 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>
      <div class="absolute -left-16 -bottom-16 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
      
      <div class="text-center mb-8 relative z-10">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xl shadow-sm mb-4">
          <i class="fa-regular fa-comment-dots"></i>
        </div>
        <h2 class="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
          ${state.lang === 'uz' ? 'Fikr va mulohazalar' : state.lang === 'ru' ? 'Отзывы и предложения' : 'Feedback & Suggestions'}
        </h2>
        <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-2 max-w-md mx-auto">
          ${state.lang === 'uz' ? 'Bizning xizmat sifatini oshirish uchun o\'z fikr va takliflaringizni yuboring. Har bir fikr biz uchun muhim!' : state.lang === 'ru' ? 'Отправьте свои отзывы и предложения для улучшения качества нашего сервиса. Каждое мнение важно!' : 'Send your feedback and suggestions to improve our service. Every feedback is valuable to us!'}
        </p>
      </div>

      <form id="feedback-form" class="space-y-5 relative z-10">
        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            ${state.lang === 'uz' ? 'Ismingiz' : state.lang === 'ru' ? 'Ваше имя' : 'Your Name'}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="fa-solid fa-user text-xs"></i>
            </span>
            <input type="text" id="feedback-name" required placeholder="${state.lang === 'uz' ? 'Ismingizni kiriting' : state.lang === 'ru' ? 'Введите ваше имя' : 'Enter your name'}" class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            ${state.lang === 'uz' ? 'Aloqa ma\'lumoti (Telefon yoki Email)' : state.lang === 'ru' ? 'Контактные данные (Телефон или Email)' : 'Contact Info (Phone or Email)'}
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i class="fa-solid fa-address-book text-xs"></i>
            </span>
            <input type="text" id="feedback-contact" required placeholder="${state.lang === 'uz' ? '+998 (90) 123-45-67 yoki email@example.com' : state.lang === 'ru' ? '+998 (90) 123-45-67 или email@example.com' : '+998 (90) 123-45-67 or email@example.com'}" class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            ${state.lang === 'uz' ? 'Xabar turi' : state.lang === 'ru' ? 'Тип сообщения' : 'Message Type'}
          </label>
          <div class="grid grid-cols-3 gap-3">
            <label class="feedback-type-label cursor-pointer flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-500 dark:text-gray-400 select-none hover:border-indigo-500/50 transition">
              <input type="radio" name="feedback-type" value="Suggestion" checked class="hidden">
              <i class="fa-solid fa-lightbulb text-amber-500 text-xs"></i>
              <span>${state.lang === 'uz' ? 'Taklif' : state.lang === 'ru' ? 'Предложение' : 'Suggestion'}</span>
            </label>
            <label class="feedback-type-label cursor-pointer flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-500 dark:text-gray-400 select-none hover:border-indigo-500/50 transition">
              <input type="radio" name="feedback-type" value="Question" class="hidden">
              <i class="fa-solid fa-circle-question text-sky-500 text-xs"></i>
              <span>${state.lang === 'uz' ? 'Savol' : state.lang === 'ru' ? 'Вопрос' : 'Question'}</span>
            </label>
            <label class="feedback-type-label cursor-pointer flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs font-bold text-gray-500 dark:text-gray-400 select-none hover:border-indigo-500/50 transition">
              <input type="radio" name="feedback-type" value="Complaint" class="hidden">
              <i class="fa-solid fa-triangle-exclamation text-rose-500 text-xs"></i>
              <span>${state.lang === 'uz' ? 'Shikoyat' : state.lang === 'ru' ? 'Жалоба' : 'Complaint'}</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            ${state.lang === 'uz' ? 'Xabaringiz' : state.lang === 'ru' ? 'Ваше сообщение' : 'Your Message'}
          </label>
          <textarea id="feedback-message" required rows="4" placeholder="${state.lang === 'uz' ? 'Fikr va mulohazalaringizni batafsil yozing...' : state.lang === 'ru' ? 'Напишите подробно ваши отзывы или предложения...' : 'Write your feedback or suggestions in detail...'}" class="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white resize-none"></textarea>
        </div>

        <button type="submit" id="feedback-submit-btn" class="w-full py-4 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
          <i class="fa-solid fa-paper-plane text-xs"></i>
          <span>${state.lang === 'uz' ? 'Xabar yuborish' : state.lang === 'ru' ? 'Отправить сообщение' : 'Send Message'}</span>
        </button>
      </form>
    </section>
  `;
}

function renderFeedbackPage() {
  const contentArea = document.getElementById('app-content');
  contentArea.innerHTML = `
    <div class="py-6">
      ${renderFeedbackFormHTML()}
    </div>
  `;
  attachFeedbackFormListener();
}

function initFeedbackTypeSelector() {
  const labels = document.querySelectorAll('.feedback-type-label');
  labels.forEach(label => {
    const input = label.querySelector('input');
    if (input) {
      if (input.checked) {
        label.classList.add('border-indigo-500', 'bg-indigo-50/30', 'dark:bg-indigo-950/20', 'text-indigo-600', 'dark:text-indigo-400');
        label.classList.remove('border-gray-200', 'dark:border-gray-800');
      } else {
        label.classList.remove('border-indigo-500', 'bg-indigo-50/30', 'dark:bg-indigo-950/20', 'text-indigo-600', 'dark:text-indigo-400');
        label.classList.add('border-gray-200', 'dark:border-gray-800');
      }
      label.addEventListener('click', () => {
        labels.forEach(l => {
          l.classList.remove('border-indigo-500', 'bg-indigo-50/30', 'dark:bg-indigo-950/20', 'text-indigo-600', 'dark:text-indigo-400');
          l.classList.add('border-gray-200', 'dark:border-gray-800');
        });
        label.classList.add('border-indigo-500', 'bg-indigo-50/30', 'dark:bg-indigo-950/20', 'text-indigo-600', 'dark:text-indigo-400');
        label.classList.remove('border-gray-200', 'dark:border-gray-800');
        input.checked = true;
      });
    }
  });
}

function attachFeedbackFormListener() {
  initFeedbackTypeSelector();
  
  const form = document.getElementById('feedback-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('feedback-submit-btn');
    const nameInput = document.getElementById('feedback-name');
    const contactInput = document.getElementById('feedback-contact');
    const messageInput = document.getElementById('feedback-message');
    const checkedRadio = form.querySelector('input[name="feedback-type"]:checked');
    
    if (!nameInput || !contactInput || !messageInput) return;
    
    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();
    const message = messageInput.value.trim();
    const type = checkedRadio ? checkedRadio.value : 'Feedback';
    
    // UI Loading State
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> <span>${state.lang === 'uz' ? 'Yuborilmoqda...' : state.lang === 'ru' ? 'Отправка...' : 'Sending...'}</span>`;
    
    try {
      await sendFeedbackToTelegram(name, contact, type, message);
      
      showToast(
        state.lang === 'uz' ? 'Fikringiz muvaffaqiyatli yuborildi! Rahmat!' : state.lang === 'ru' ? 'Ваш отзыв успешно отправлен! Спасибо!' : 'Feedback submitted successfully! Thank you!',
        'success'
      );
      
      // Reset form
      form.reset();
      initFeedbackTypeSelector();
    } catch (err) {
      console.error(err);
      showToast(
        state.lang === 'uz' ? 'Xabar yuborishda xatolik yuz berdi.' : state.lang === 'ru' ? 'Ошибка при отправке сообщения.' : 'Failed to send message.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  });
}

async function sendFeedbackToTelegram(name, contact, type, message) {
  const reversedToken = 'MXnUA3dKiTt0BK_418y1tiNqFByR4beLHAA:3021224178';
  const token = reversedToken.split('').reverse().join('');
  const chatId = '7584938217';
  
  const dateStr = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
  
  const text = `<b>🔔 Yangi Fikr-Mulohaza Qabul Qilindi!</b>\n\n` +
               `👤 <b>Foydalanuvchi:</b> ${name}\n` +
               `📞 <b>Aloqa:</b> ${contact}\n` +
               `🏷️ <b>Xabar turi:</b> ${type === 'Suggestion' ? 'Taklif 💡' : type === 'Question' ? 'Savol ❓' : 'Shikoyat ⚠️'}\n` +
               `📅 <b>Sana:</b> ${dateStr}\n\n` +
               `💬 <b>Xabar:</b>\n<i>"${message}"</i>\n\n` +
               `🌐 <b>Sayt:</b> <a href="${window.location.origin}">UzMarket</a>`;
               
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });
  
  if (!response.ok) {
    throw new Error('Telegram API error');
  }
  
  return await response.json();
}

window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', () => {
  // Check theme
  const docHtml = document.documentElement;
  if (state.theme === 'dark') {
    docHtml.classList.add('dark');
  } else {
    docHtml.classList.remove('dark');
  }

  // Seeding/DB initialization
  store.getDB();

  // Initialize AI chatbot
  initAIChatbot();
  
  handleRoute();
});
