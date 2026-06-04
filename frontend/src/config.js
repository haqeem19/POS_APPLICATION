export const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'devpos2026';
export const AUTH_KEY = 'pos-app-authenticated';
export const LANGUAGE_KEY = 'pos-app-language';
export const HISTORY_PER_PAGE = 10;

export const PRINTER_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
];

export const PRINTER_CHARACTERISTICS = [
  '00002af1-0000-1000-8000-00805f9b34fb',
  '0000ffe1-0000-1000-8000-00805f9b34fb',
  '0000ff01-0000-1000-8000-00805f9b34fb',
];

export const emptyProduct = {
  category_id: '',
  sku: '',
  name: '',
  cost_price: '',
  selling_price: '',
  stock_quantity: '',
  minimum_stock: '',
};

export const tabs = [
  { id: 'dashboard', group: null, labelKey: 'tabDashboard' },
  { id: 'transaksi', group: null, labelKey: 'tabTransaction' },
  { id: 'riwayat', group: null, labelKey: 'tabHistory' },
  { id: 'produk', group: 'masterData', labelKey: 'tabProduct' },
  { id: 'master', group: 'masterData', labelKey: 'tabMaster' },
  { id: 'stok', group: 'masterData', labelKey: 'tabStock' },
];
