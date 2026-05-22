/*
  store.js - UzMarket Mock Database Layer
  Handles localStorage database seeding, data persistence, and CRUD helpers.
*/

const DB_KEY = 'uzmarket_db';

// Helper to load db
export function getDB() {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    return initDB();
  }
  return JSON.parse(data);
}

// Helper to save db
export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Database Seeder
function initDB() {
  const defaultDB = {
    categories: [
      { id: 'smartfonlar', nameUz: 'Smartfonlar', nameRu: 'Смартфоны', nameEn: 'Smartphones', icon: 'fa-mobile-screen-button' },
      { id: 'noutbuklar', nameUz: 'Noutbuklar', nameRu: 'Ноутбуки', nameEn: 'Laptops', icon: 'fa-laptop' },
      { id: 'aksessuarlar', nameUz: 'Aksessuarlar', nameRu: 'Аксессуары', nameEn: 'Accessories', icon: 'fa-headphones' },
      { id: 'planshetlar', nameUz: 'Planshetlar', nameRu: 'Планшеты', nameEn: 'Tablets', icon: 'fa-tablet-screen-button' }
    ],
    promoCodes: [
      { code: 'UZMARKET10', discountPercent: 10, description: '10% chegirma barcha tovarlarga' },
      { code: 'SPRING20', discountPercent: 20, description: 'Bahorgi maxsus 20% chegirma' }
    ],
    users: [
      {
        id: 'user_admin',
        email: 'admin@uzmarket.uz',
        password: 'admin123', // In a real app we hash this (bcrypt)
        role: 'admin',
        name: 'Admin-Jan',
        phone: '+998 90 123 45 67',
        addresses: ['Toshkent sh., Yunusobod tumani, Amir Temur ko\'chasi, 45-uy'],
        defaultAddressIndex: 0,
        birthday: '1990-01-01',
        createdAt: '2026-01-10T12:00:00Z'
      },
      {
        id: 'user_regular',
        email: 'user@uzmarket.uz',
        password: 'user123',
        role: 'user',
        name: 'Farhod Alimov',
        phone: '+998 93 555 22 11',
        addresses: [
          'Toshkent sh., Chilonzor tumani, 9-daha, 12-uy, 45-xonadon',
          'Farg\'ona sh., Mustaqillik shoh ko\'chasi, 4-uy, 2-xonadon'
        ],
        defaultAddressIndex: 0,
        birthday: '1998-05-15',
        createdAt: '2026-02-20T15:30:00Z'
      }
    ],
    products: [
      {
        id: 'prod_iphone15pm',
        name: 'iPhone 15 Pro Max 256GB Titanium',
        category: 'smartfonlar',
        brand: 'Apple',
        price: 18500000,
        discount: 8, // 8% off
        stock: 12,
        rating: 4.9,
        reviewsCount: 3,
        descriptionUz: 'Eng so\'nggi Apple smartfoni - mustahkam titan korpus, eng kuchli A17 Pro chip va professional darajadagi 5x optik zoomli 48 MP kamera tizimi bilan jihozlangan. O\'yinlar va professional suratlar uchun eng ideal tanlov.',
        descriptionRu: 'Последний флагман Apple с прочным титановым корпусом, мощнейшим чипом A17 Pro и профессиональной системой камер 48 МП с 5-кратным оптическим зумом. Идеальный выбор для мобильного гейминга и фото.',
        descriptionEn: 'The latest Apple flagship featuring a durable titanium chassis, ultra-powerful A17 Pro chip, and a professional-grade 48 MP camera system with 5x optical zoom. Ideal for gaming and photography.',
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1565849211560-5448772a83e9?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1695048132924-a74070a9ff33?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: '6.7 dyum, Super Retina XDR OLED, 120Hz', valueRu: '6.7 дюймов, Super Retina XDR OLED, 120Гц', valueEn: '6.7", Super Retina XDR OLED, 120Hz' },
          { nameUz: 'Protsessor', nameRu: 'Процессор', nameEn: 'Processor', valueUz: 'Apple A17 Pro (3 nm)', valueRu: 'Apple A17 Pro (3 нм)', valueEn: 'Apple A17 Pro (3 nm)' },
          { nameUz: 'Xotira', nameRu: 'Память', nameEn: 'Storage', valueUz: '256 GB ROM / 8 GB RAM', valueRu: '256 ГБ ПЗУ / 8 ГБ ОЗУ', valueEn: '256 GB ROM / 8 GB RAM' },
          { nameUz: 'Kamera', nameRu: 'Камера', nameEn: 'Camera', valueUz: '48MP + 12MP + 12MP (Orqa) / 12MP (Oldi)', valueRu: '48МП + 12МП + 12МП (Основная) / 12МП (Фронт)', valueEn: '48MP + 12MP + 12MP (Rear) / 12MP (Front)' },
          { nameUz: 'Akkumulyator', nameRu: 'Аккумулятор', nameEn: 'Battery', valueUz: '4441 mAh, 25W tezkor quvvatlash', valueRu: '4441 мАч, 25Вт быстрая зарядка', valueEn: '4441 mAh, 25W fast charging' }
        ]
      },
      {
        id: 'prod_macbookpro16',
        name: 'MacBook Pro 16" Apple M3 Pro 512GB Space Black',
        category: 'noutbuklar',
        brand: 'Apple',
        price: 32000000,
        discount: 5,
        stock: 5,
        rating: 5.0,
        reviewsCount: 2,
        descriptionUz: 'Dasturchilar, dizaynerlar va barcha ijodkor professionallar uchun yaratilgan noutbuk. Apple M3 Pro chipi beqiyos tezlik va o\'ta uzoq muddatli quvvatni (22 soatgacha) kafolatlaydi. Dynamic Caching va nurlarni kuzatish (Ray tracing) texnologiyasiga ega Liquid Retina XDR ekranga ega.',
        descriptionRu: 'Создан для разработчиков, дизайнеров и профессионалов. Чип M3 Pro обеспечивает феноменальную автономность (до 22 часов) и выдающуюся производительность. Liquid Retina XDR экран с поддержкой трассировки лучей.',
        descriptionEn: 'Engineered for developers, designers, and creators. The Apple M3 Pro chip guarantees outstanding battery life (up to 22 hours) and exceptional power. Dynamic Caching and Ray-tracing on Liquid Retina XDR display.',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: '16.2 dyum, Liquid Retina XDR, 3456x2234, 120Hz', valueRu: '16.2 дюймов, Liquid Retina XDR, 3456x2234, 120Гц', valueEn: '16.2", Liquid Retina XDR, 3456x2234, 120Hz' },
          { nameUz: 'Protsessor', nameRu: 'Процессор', nameEn: 'Processor', valueUz: 'Apple M3 Pro (12-yadro CPU / 18-yadro GPU)', valueRu: 'Apple M3 Pro (12 ядер CPU / 18 ядер GPU)', valueEn: 'Apple M3 Pro (12-core CPU / 18-core GPU)' },
          { nameUz: 'Xotira', nameRu: 'Память', nameEn: 'Storage', valueUz: '18 GB RAM / 512 GB SSD', valueRu: '18 ГБ ОЗУ / 512 ГБ SSD', valueEn: '18 GB Unified / 512 GB SSD' },
          { nameUz: 'OS', nameRu: 'ОС', nameEn: 'OS', valueUz: 'macOS Sonoma', valueRu: 'macOS Sonoma', valueEn: 'macOS Sonoma' }
        ]
      },
      {
        id: 'prod_s24ultra',
        name: 'Samsung Galaxy S24 Ultra 12/512GB Titanium Gray',
        category: 'smartfonlar',
        brand: 'Samsung',
        price: 16200000,
        discount: 10,
        stock: 18,
        rating: 4.8,
        reviewsCount: 2,
        descriptionUz: 'Galaxy AI sun\'iy intellekti bilan jihozlangan eng ilg\'or smartfon. Integratsiyalashgan S Pen ruchkasi, 200 MP ajoyib kamera va aks ettirishga qarshi Gorilla Armor oynasi bilan qoplangan yorqin Dynamic AMOLED ekranga ega.',
        descriptionRu: 'Ультимативный флагман со встроенным Galaxy AI. Включает стилус S Pen, потрясающую камеру на 200 МП и яркий Dynamic AMOLED экран с защитой Gorilla Armor и антибликовым покрытием.',
        descriptionEn: 'The ultimate flagship loaded with Galaxy AI. Features integrated S Pen, mind-blowing 200 MP camera, and incredibly bright Dynamic AMOLED display covered with anti-reflective Gorilla Armor.',
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: '6.8 dyum, Dynamic LTPO AMOLED 2X, 120Hz', valueRu: '6.8 дюймов, Dynamic LTPO AMOLED 2X, 120Гц', valueEn: '6.8", Dynamic LTPO AMOLED 2X, 120Hz' },
          { nameUz: 'Protsessor', nameRu: 'Процессор', nameEn: 'Processor', valueUz: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)', valueRu: 'Snapdragon 8 Gen 3 for Galaxy (4 нм)', valueEn: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)' },
          { nameUz: 'Kamera', nameRu: 'Камера', nameEn: 'Camera', valueUz: '200MP + 50MP + 12MP + 10MP / Oldi: 12MP', valueRu: '200МП + 50МП + 12МП + 10МП / Фронт: 12МП', valueEn: '200MP + 50MP + 12MP + 10MP / Front: 12MP' },
          { nameUz: 'Xotira', nameRu: 'Память', nameEn: 'Storage', valueUz: '512 GB ROM / 12 GB RAM', valueRu: '512 ГБ ПЗУ / 12 ГБ ОЗУ', valueEn: '512 GB ROM / 12 GB RAM' }
        ]
      },
      {
        id: 'prod_sonywh1000',
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        category: 'aksessuarlar',
        brand: 'Sony',
        price: 4900000,
        discount: 0,
        stock: 15,
        rating: 4.7,
        reviewsCount: 3,
        descriptionUz: 'Shovqinni bostirish bo\'yicha jahon yetakchisi. 30 soatgacha batareya quvvati, o\'ta yumshoq charmdan ishlangan ergonomik dizayn va LDAC yuqori aniqlikdagi audio kodeklarni qo\'llab-quvvatlaydigan ajoyib simsiz quloqchin.',
        descriptionRu: 'Мировой лидер в области шумоподавления. До 30 часов автономной работы, роскошные эргономичные амбушюры, поддержка кодека LDAC для высочайшего качества аудио без проводов.',
        descriptionEn: 'Industry-leading noise cancelling wireless headphones. Boasting up to 30 hours of battery life, ultra-comfortable lightweight leather, and high-fidelity LDAC audio support.',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Turi', nameRu: 'Тип', nameEn: 'Type', valueUz: 'Simsiz, Quloqni to\'liq qoplovchi', valueRu: 'Беспроводные, Полноразмерные', valueEn: 'Wireless, Over-Ear' },
          { nameUz: 'Ulanish', nameRu: 'Соединение', nameEn: 'Connectivity', valueUz: 'Bluetooth 5.2 / NFC / AUX 3.5mm', valueRu: 'Bluetooth 5.2 / NFC / AUX 3.5мм', valueEn: 'Bluetooth 5.2 / NFC / AUX 3.5mm' },
          { nameUz: 'Batareya', nameRu: 'Батарея', nameEn: 'Battery', valueUz: 'Faol shovqin bostirgich bilan 30 soat / ANC\'siz 40 soat', valueRu: '30 часов с ANC / 40 часов без ANC', valueEn: '30 hours with ANC / 40 hours without ANC' },
          { nameUz: 'Og\'irligi', nameRu: 'Вес', nameEn: 'Weight', valueUz: '250 gramm', valueRu: '250 грамм', valueEn: '250 grams' }
        ]
      },
      {
        id: 'prod_rogzephyrus',
        name: 'ASUS ROG Zephyrus G16 RTX 4070 Gaming Laptop',
        category: 'noutbuklar',
        brand: 'ASUS',
        price: 27500000,
        discount: 12,
        stock: 4,
        rating: 4.6,
        reviewsCount: 1,
        descriptionUz: 'Eng so\'nggi o\'yinlar va 3D modellashtirish uchun mo\'ljallangan yupqa, ammo o\'ta quvvatli o\'yin noutbuki. NVIDIA GeForce RTX 4070 grafik kartasi, Intel Core Ultra 9 protsessori va 240Hz tezlikdagi ajoyib OLED ekran bilan jihozlangan.',
        descriptionRu: 'Тонкий, но невероятно мощный игровой ноутбук для требовательных игр и 3D-графики. Оснащен видеокартой NVIDIA RTX 4070, чипом Intel Core Ultra 9 и шикарным OLED дисплеем 240Гц.',
        descriptionEn: 'Sleek yet monstrously powerful gaming laptop for heavy games and 3D modeling. Powered by NVIDIA GeForce RTX 4070, Intel Core Ultra 9, and an incredible 240Hz OLED display.',
        images: [
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: '16 dyum, 2.5K OLED, 240Hz, 100% DCI-P3', valueRu: '16 дюймов, 2.5K OLED, 240Гц, 100% DCI-P3', valueEn: '16", 2.5K OLED, 240Hz, 100% G-Sync' },
          { nameUz: 'Protsessor', nameRu: 'Процессор', nameEn: 'Processor', valueUz: 'Intel Core Ultra 9 185H', valueRu: 'Intel Core Ultra 9 185H', valueEn: 'Intel Core Ultra 9 185H' },
          { nameUz: 'Videokarta', nameRu: 'Видеокарта', nameEn: 'Graphics', valueUz: 'NVIDIA GeForce RTX 4070 8GB GDDR6', valueRu: 'NVIDIA GeForce RTX 4070 8ГБ GDDR6', valueEn: 'NVIDIA GeForce RTX 4070 8GB GDDR6' },
          { nameUz: 'Xotira', nameRu: 'Память', nameEn: 'Storage', valueUz: '32 GB LPDDR5X / 1 TB SSD NVMe', valueRu: '32 ГБ LPDDR5X / 1 ТБ SSD NVMe', valueEn: '32 GB RAM / 1 TB SSD NVMe' }
        ]
      },
      {
        id: 'prod_ipadprom4',
        name: 'iPad Pro 11" Apple M4 256GB Wi-Fi Space Gray',
        category: 'planshetlar',
        brand: 'Apple',
        price: 14200000,
        discount: 0,
        stock: 8,
        rating: 4.8,
        reviewsCount: 1,
        descriptionUz: 'Tarixdagi eng yupqa va eng kuchli Apple plansheti. Inqilobiy tandem OLED Ultra Retina XDR ekranga va barcha topshiriqlarni chaqmoqdek tez bajaruvchi Apple M4 super chipiga ega. Illyustratorlar uchun bebaho vosita.',
        descriptionRu: 'Самый тонкий и мощный iPad в истории. Получил невероятный тандемный OLED Ultra Retina XDR дисплей и супер-чип Apple M4, выполняющий задачи молниеносно. Незаменим для иллюстраторов.',
        descriptionEn: 'The thinnest and most powerful Apple iPad ever. Equipped with a revolutionary Tandem OLED Ultra Retina XDR screen and the blistering M4 processor. Unmatched tool for artists and designers.',
        images: [
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1527690710607-e57cd53b3804?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: '11 dyum, Tandem OLED, 2420x1668, 120Hz', valueRu: '11 дюймов, Tandem OLED, 2420x1668, 120Гц', valueEn: '11" Tandem OLED, 2420x1668, 120Hz' },
          { nameUz: 'Protsessor', nameRu: 'Процессор', nameEn: 'Processor', valueUz: 'Apple M4 (9-yadro CPU / 10-yadro GPU)', valueRu: 'Apple M4 (9 ядер CPU / 10 ядер GPU)', valueEn: 'Apple M4 (9-core CPU / 10-core GPU)' },
          { nameUz: 'Qalinligi', nameRu: 'Толщина', nameEn: 'Thickness', valueUz: '5.3 mm, o\'ta yengil korpus', valueRu: '5.3 мм, ультралегкий корпус', valueEn: '5.3 mm, ultra-light chassis' },
          { nameUz: 'Xotira', nameRu: 'Память', nameEn: 'Storage', valueUz: '256 GB ROM / 8 GB RAM', valueRu: '256 ГБ ПЗУ / 8 ГБ ОЗУ', valueEn: '256 GB ROM / 8 GB RAM' }
        ]
      },
      {
        id: 'prod_keychronk2',
        name: 'Keychron K2 V2 Hot-Swappable Mechanical Keyboard',
        category: 'aksessuarlar',
        brand: 'Keychron',
        price: 1550000,
        discount: 15,
        stock: 25,
        rating: 4.9,
        reviewsCount: 2,
        descriptionUz: 'Ajoyib mexanik klaviatura - 75% o\'lchamli, Bluetooth orqali 3 ta qurilmagacha ulanish imkoni, RGB yoritgich va kalitlarni payvandlashsiz almashtirish (Hot-swappable) imkoni bor. Gateron G Pro Brown kalitlari bilan jihozlangan bo\'lib, yozish va dasturlash uchun o\'ta yumshoq va yoqimli tovush beradi.',
        descriptionRu: 'Легендарная механическая клавиатура в формате 75%. Возможность подключения до 3-х устройств по Bluetooth, настраиваемая RGB подсветка и функция Hot-swap для быстрой смены переключателей.',
        descriptionEn: 'The iconic 75% mechanical keyboard with Bluetooth connection for up to 3 devices, dynamic RGB backlighting, and hot-swappable switches. Comes with pre-lubed Gateron G Pro switches.',
        images: [
          'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Format', nameRu: 'Формат', nameEn: 'Layout', valueUz: '75% ixcham, 84 ta tugmacha', valueRu: '75% компактный, 84 клавиши', valueEn: '75% compact, 84 keys' },
          { nameUz: 'Kalitlar', nameRu: 'Переключатели', nameEn: 'Switches', valueUz: 'Gateron G Pro Brown (Hot-swappable)', valueRu: 'Gateron G Pro Brown (Hot-swap)', valueEn: 'Gateron G Pro Brown (Hot-swappable)' },
          { nameUz: 'Ulanish', nameRu: 'Соединение', nameEn: 'Connectivity', valueUz: 'Bluetooth 5.1 / Simli Type-C', valueRu: 'Bluetooth 5.1 / Проводной Type-C', valueEn: 'Bluetooth 5.1 / Wired Type-C' },
          { nameUz: 'Batareya', nameRu: 'Батарея', nameEn: 'Battery', valueUz: '4000 mAh (240 soatgacha yorug\'liksiz)', valueRu: '4000 мАч (до 240 часов без подсветки)', valueEn: '4000 mAh (up to 240h without backlighting)' }
        ]
      },
      {
        id: 'prod_watchultra2',
        name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
        category: 'aksessuarlar',
        brand: 'Apple',
        price: 11900000,
        discount: 0,
        stock: 7,
        rating: 4.8,
        reviewsCount: 2,
        descriptionUz: 'Eng og\'ir va murakkab sharoitlar uchun yaratilgan mustahkam soat. Titan korpus, yorqin ekran, dual-chastotali GPS va 36 soatgacha batareya quvvati. Sho\'ng\'ish va ekstremal sport turlari uchun maxsus datchiklar.',
        descriptionRu: 'Экстремальные смарт-часы в прочном титановом корпусе 49 мм. Сверхяркий экран, двухчастотный GPS, водонепроницаемость до 100 метров и глубинномер для дайвинга.',
        descriptionEn: 'The most rugged Apple Watch designed for outdoor and extreme conditions. Features 49mm aerospace titanium case, dual-frequency GPS, and up to 36 hours of ordinary battery life.',
        images: [
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80'
        ],
        specs: [
          { nameUz: 'Korpus', nameRu: 'Корпус', nameEn: 'Chassis', valueUz: '49mm Aerokosmik Titan, IP6X chang va 100m suv chidamlilik', valueRu: '49мм Авиационный Титан, защита IP6X и 100м водонепроницаемость', valueEn: '49mm Aerospace Titanium, IP6X dust & 100m water resistant' },
          { nameUz: 'Ekran', nameRu: 'Экран', nameEn: 'Display', valueUz: 'Always-On Retina OLED, 3000 nits yorqinlik', valueRu: 'Always-On Retina OLED, яркость 3000 нит', valueEn: 'Always-On Retina OLED, 3000 nits brightness' },
          { nameUz: 'Datchiklar', nameRu: 'Датчики', nameEn: 'Sensors', valueUz: 'EKG, Kislorod miqdori, Gidro-datchik, Sho\'ng\'ish kompyuteri', valueRu: 'ЭКГ, Пульсоксиметр, Глубиномер, Дайв-компьютер', valueEn: 'ECG, Blood Oxygen, Depth gauge, Dive computer' }
        ]
      }
    ],
    reviews: [
      { id: 'rev_1', productId: 'prod_iphone15pm', userId: 'user_regular', userName: 'Farhod Alimov', userAvatar: 'FA', rating: 5, comment: 'Telefon shunchaki daho! Titan rangi juda hashamatli ko\'rinadi. Batareyasi ham 1.5 kunga yetmoqda. Click orqali tezda sotib oldim, yetkazib berish 2 soatda bo\'ldi.', date: '2026-05-18T10:30:00Z' },
      { id: 'rev_2', productId: 'prod_iphone15pm', userId: 'anon_1', userName: 'Jasur K.', userAvatar: 'JK', rating: 5, comment: 'Ajoyib displey va o\'ta sifatli kamerasi bor ekan. Ayniqsa 5x yaqinlashtirish juda tiniq chiqmoqda. Narxi qimmatroq bo\'lsa ham arziydi.', date: '2026-05-19T14:22:00Z' },
      { id: 'rev_3', productId: 'prod_iphone15pm', userId: 'anon_2', userName: 'Elena Petrova', userAvatar: 'EP', rating: 4, comment: 'Отличный телефон, но в комплекте нет зарядного блока, только кабель. К самому аппарату претензий нет.', date: '2026-05-20T08:15:00Z' },
      { id: 'rev_4', productId: 'prod_macbookpro16', userId: 'user_regular', userName: 'Farhod Alimov', userAvatar: 'FA', rating: 5, comment: 'Dasturlash uchun eng mukammal noutbuk. Xcode va Docker bilan ishlaganda ham qizimaydi va shovqin qilmaydi. Tavsiya qilaman.', date: '2026-05-15T11:45:00Z' },
      { id: 'rev_5', productId: 'prod_macbookpro16', userId: 'anon_3', userName: 'Dmitry M.', userAvatar: 'DM', rating: 5, comment: 'Экран поражает качеством, черный цвет действительно глубокий. Звук из встроенных колонок как на домашней аудиосистеме.', date: '2026-05-17T09:00:00Z' },
      { id: 'rev_6', productId: 'prod_s24ultra', userId: 'anon_4', userName: 'Shoxrux T.', userAvatar: 'ST', rating: 5, comment: 'AI tarjimon funksiyasi va rasmdagi narsalarni doira chizib izlash (Circle to Search) juda qulay! Samsung bu yil zo\'r qilibdi.', date: '2026-05-19T18:40:00Z' },
      { id: 'rev_7', productId: 'prod_s24ultra', userId: 'anon_5', userName: 'Alisher B.', userAvatar: 'AB', rating: 4, comment: 'Kamerasi zo\'r, lekin korpusi biroz kattalik qiladi, bir qo\'lda ushlash noqulayroq. Qolgan jihatlari top darajada.', date: '2026-05-20T12:00:00Z' },
      { id: 'rev_8', productId: 'prod_sonywh1000', userId: 'user_regular', userName: 'Farhod Alimov', userAvatar: 'FA', rating: 5, comment: 'Samolyotda yoki ofisda shovqinni butunlay o\'chirib beradi. Ovoz sifati ham juda yumshoq va boy. Batareyasi rosa uzoq bormoqda.', date: '2026-05-10T16:20:00Z' },
      { id: 'rev_9', productId: 'prod_sonywh1000', userId: 'anon_6', userName: 'Sevara A.', userAvatar: 'SA', rating: 4, comment: 'Juda yengil, soatlab taqib yursam ham qulog\'imni og\'ritmadi. Faqat mikrofoni shovqinli joyda biroz sustroq ishlaydi.', date: '2026-05-14T10:10:00Z' },
      { id: 'rev_10', productId: 'prod_sonywh1000', userId: 'anon_7', userName: 'Bobur', userAvatar: 'B', rating: 5, comment: 'Perfect sound quality and amazing design. Best ANC on the market right now.', date: '2026-05-18T22:30:00Z' },
      { id: 'rev_11', productId: 'prod_keychronk2', userId: 'anon_8', userName: 'Olim', userAvatar: 'O', rating: 5, comment: 'Brown switchlar yozishga juda maroqli, ovozi ham yoqimli. Mac va Windows uchun knopkalari borligi ajoyib.', date: '2026-05-15T09:40:00Z' },
      { id: 'rev_12', productId: 'prod_keychronk2', userId: 'anon_9', userName: 'Kseniya', userAvatar: 'K', rating: 5, comment: 'Подсветка очень красивая, множество режимов. Заряжаю раз в две недели. Отличная покупка!', date: '2026-05-19T20:10:00Z' },
      { id: 'rev_13', productId: 'prod_watchultra2', userId: 'anon_10', userName: 'Mansur', userAvatar: 'M', rating: 5, comment: 'Ekstremal sayohatlar uchun zo\'r soat. Zaryadi 3 kunga yetmoqda. Titan korpusi tirnalishlarga juda chidamli.', date: '2026-05-16T15:30:00Z' },
      { id: 'rev_14', productId: 'prod_watchultra2', userId: 'anon_11', userName: 'Irina', userAvatar: 'I', rating: 4, comment: 'Экран шикарный, очень яркий даже на солнце. Но на женской руке смотрятся массивно.', date: '2026-05-18T11:00:00Z' },
      { id: 'rev_15', productId: 'prod_ipadprom4', userId: 'anon_12', userName: 'Diyorbek', userAvatar: 'D', rating: 5, comment: 'Yangi M4 planshet shunchaki super yupqa! Rasm chizishda Apple Pencil Pro bilan ishlash ajoyib darajada maroqli.', date: '2026-05-19T13:45:00Z' },
      { id: 'rev_16', productId: 'prod_rogzephyrus', userId: 'anon_13', userName: 'GameMaster', userAvatar: 'GM', rating: 5, comment: 'Cyberpunk 2077 ultra settingsda nurlarni kuzatish bilan 80+ fps beryapti. OLED ekran ranglari shunchaki hayratlanarli!', date: '2026-05-20T17:50:00Z' }
    ],
    orders: [
      {
        id: 'ord_1',
        orderNumber: 'UM-20260515-01',
        userId: 'user_regular',
        customerName: 'Farhod Alimov',
        customerPhone: '+998 93 555 22 11',
        items: [
          { productId: 'prod_macbookpro16', quantity: 1, price: 30400000, name: 'MacBook Pro 16" Apple M3 Pro 512GB Space Black' },
          { productId: 'prod_sonywh1000', quantity: 1, price: 4900000, name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones' }
        ],
        subtotal: 35300000,
        discountAmount: 3530000,
        total: 31770000,
        deliveryMethod: 'courier',
        deliveryAddress: 'Toshkent sh., Chilonzor tumani, 9-daha, 12-uy, 45-xonadon',
        paymentMethod: 'click',
        paymentStatus: 'paid',
        status: 'delivered', // Yangi -> Tasdiqlangan -> Yo'lda -> Yetkazilgan -> Bekor qilingan
        date: '2026-05-15T12:00:00Z'
      },
      {
        id: 'ord_2',
        orderNumber: 'UM-20260519-02',
        userId: 'user_regular',
        customerName: 'Farhod Alimov',
        customerPhone: '+998 93 555 22 11',
        items: [
          { productId: 'prod_iphone15pm', quantity: 1, price: 17020000, name: 'iPhone 15 Pro Max 256GB Titanium' }
        ],
        subtotal: 17020000,
        discountAmount: 0,
        total: 17020000,
        deliveryMethod: 'courier',
        deliveryAddress: 'Toshkent sh., Chilonzor tumani, 9-daha, 12-uy, 45-xonadon',
        paymentMethod: 'payme',
        paymentStatus: 'paid',
        status: 'shipped', // Yo'lda
        date: '2026-05-19T14:40:00Z'
      }
    ]
  };

  localStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
  return defaultDB;
}

// -------------------------------------------------------------
// Database CRUD Helpers
// -------------------------------------------------------------

// Products CRUD
export function getProducts() {
  return getDB().products;
}

export function getProductById(id) {
  return getProducts().find(p => p.id === id);
}

export function addProduct(product) {
  const db = getDB();
  const newProduct = {
    id: 'prod_' + Math.random().toString(36).substr(2, 9),
    rating: 5.0,
    reviewsCount: 0,
    specs: product.specs || [],
    discount: Number(product.discount) || 0,
    stock: Number(product.stock) || 0,
    price: Number(product.price) || 0,
    ...product
  };
  db.products.push(newProduct);
  saveDB(db);
  return newProduct;
}

export function updateProduct(id, updatedFields) {
  const db = getDB();
  const index = db.products.findIndex(p => p.id === id);
  if (index !== -1) {
    db.products[index] = {
      ...db.products[index],
      ...updatedFields,
      price: Number(updatedFields.price) || db.products[index].price,
      discount: Number(updatedFields.discount) !== undefined ? Number(updatedFields.discount) : db.products[index].discount,
      stock: Number(updatedFields.stock) !== undefined ? Number(updatedFields.stock) : db.products[index].stock
    };
    saveDB(db);
    return db.products[index];
  }
  return null;
}

export function deleteProduct(id) {
  const db = getDB();
  db.products = db.products.filter(p => p.id !== id);
  // clean up reviews
  db.reviews = db.reviews.filter(r => r.productId !== id);
  saveDB(db);
}

// Categories
export function getCategories() {
  return getDB().categories;
}

export function addCategory(category) {
  const db = getDB();
  const newCat = {
    id: category.nameEn.toLowerCase().replace(/\s+/g, '-'),
    ...category
  };
  db.categories.push(newCat);
  saveDB(db);
  return newCat;
}

export function deleteCategory(id) {
  const db = getDB();
  db.categories = db.categories.filter(c => c.id !== id);
  saveDB(db);
}

// Reviews
export function getReviewsByProduct(productId) {
  return getDB().reviews.filter(r => r.productId === productId);
}

export function addReview(productId, review) {
  const db = getDB();
  const newReview = {
    id: 'rev_' + Math.random().toString(36).substr(2, 9),
    productId,
    date: new Date().toISOString(),
    ...review
  };
  db.reviews.unshift(newReview);

  // Recalculate average rating
  const pReviews = db.reviews.filter(r => r.productId === productId);
  const totalStars = pReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Number((totalStars / pReviews.length).toFixed(1));

  const pIndex = db.products.findIndex(p => p.id === productId);
  if (pIndex !== -1) {
    db.products[pIndex].rating = avgRating;
    db.products[pIndex].reviewsCount = pReviews.length;
  }

  saveDB(db);
  return newReview;
}

// Orders
export function getOrders() {
  return getDB().orders;
}

export function getOrdersByUser(userId) {
  return getOrders().filter(o => o.userId === userId);
}

export function addOrder(orderData) {
  const db = getDB();
  
  // Decrement stock levels
  orderData.items.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  });

  const orderNum = 'UM-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);
  const newOrder = {
    id: 'ord_' + Math.random().toString(36).substr(2, 9),
    orderNumber: orderNum,
    status: 'Yangi',
    paymentStatus: orderData.paymentMethod === 'cash' ? 'unpaid' : 'paid',
    date: new Date().toISOString(),
    ...orderData
  };

  db.orders.unshift(newOrder);
  saveDB(db);
  return newOrder;
}

export function updateOrderStatus(orderId, status, paymentStatus) {
  const db = getDB();
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    saveDB(db);
    return order;
  }
  return null;
}

// Promo codes
export function getPromoCode(code) {
  return getDB().promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
}
