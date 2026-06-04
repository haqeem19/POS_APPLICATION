import React, { useEffect, useMemo, useState } from 'react';
import { AppHeader } from './components/AppHeader.jsx';
import { AuthGate } from './components/AuthGate.jsx';
import { LoadingOverlay } from './components/LoadingOverlay.jsx';
import { ReceiptModal } from './components/ReceiptModal.jsx';
import { TabNav } from './components/TabNav.jsx';
import { APP_PASSWORD, AUTH_KEY, emptyProduct, HISTORY_PER_PAGE, LANGUAGE_KEY, PRINTER_SERVICES } from './config.js';
import { api, formatMoney } from './lib/api.js';
import { dictionary } from './i18n.js';
import {
  DashboardSection,
  HistorySection,
  MasterDataSection,
  ProductSection,
  StockSection,
  TransactionSection,
} from './modules/index.js';
import {
  buildSalesPath,
  formatNumericInput,
  formatPriceInput,
  getItemDiscountAmount,
  itemSummary,
  parseFormattedNumber,
  percentAmount,
  roundCurrency,
  sanitizePercentInput,
} from './utils/formatters.js';
import { buildReceiptPayload, findPrinterCharacteristic } from './utils/receipt.js';



export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) || 'id');
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesMeta, setSalesMeta] = useState({ current_page: 1, last_page: 1, per_page: HISTORY_PER_PAGE, total: 0 });
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', email: '', address: '', contact_person: '' });
  const [stockForm, setStockForm] = useState({ product_id: '', type: 'in', quantity: '1', notes: '' });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [saleForm, setSaleForm] = useState({
    customer_id: '',
    payment_method: '',
    paid_amount: '',
    discount_percent: '',
    tax_percent: '',
    items: [{ product_id: '', quantity: '1', discount_percent: '' }],
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [busyText, setBusyText] = useState('');
  const [printModalSale, setPrintModalSale] = useState(null);
  const [printing, setPrinting] = useState(false);

  const text = dictionary[language];
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  const money = (value) => formatMoney(value, locale);

  async function runWithBusy(label, action) {
    if (loading) {
      return;
    }

    setLoading(true);
    setBusyText(label);
    try {
      await action();
    } finally {
      setLoading(false);
      setBusyText('');
    }
  }

  async function loadData(options = {}) {
    const { showOverlay = true } = options;

    if (showOverlay) {
      await runWithBusy(text.loading, () => loadData({ showOverlay: false }));
      return;
    }

    setMessage('');
    try {
      const [dashboardData, categoryData, productData, customerData, supplierData, movementData, saleData] = await Promise.all([
        api('/dashboard', { errorMessage: text.apiError }),
        api('/categories?per_page=100', { errorMessage: text.apiError }),
        api('/products?per_page=100', { errorMessage: text.apiError }),
        api('/customers?per_page=100', { errorMessage: text.apiError }),
        api('/suppliers?per_page=100', { errorMessage: text.apiError }),
        api('/stock-movements?per_page=20', { errorMessage: text.apiError }),
        api(buildSalesPath(historyPage, historySearch), { errorMessage: text.apiError }),
      ]);
      setDashboard(dashboardData);
      setCategories(categoryData.data || []);
      setProducts(productData.data || []);
      setCustomers(customerData.data || []);
      setSuppliers(supplierData.data || []);
      setMovements(movementData.data || []);
      applySalesResponse(saleData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function applySalesResponse(saleData) {
    setSales(saleData.data || []);
    setSalesMeta({
      current_page: saleData.current_page || 1,
      last_page: saleData.last_page || 1,
      per_page: Number(saleData.per_page || HISTORY_PER_PAGE),
      total: Number(saleData.total || 0),
    });
    setHistoryPage(saleData.current_page || 1);
  }

  async function loadSales(page = historyPage, search = historySearch, options = {}) {
    const { showOverlay = true } = options;

    if (showOverlay) {
      await runWithBusy(text.loading, () => loadSales(page, search, { showOverlay: false }));
      return;
    }

    setMessage('');
    try {
      const saleData = await api(buildSalesPath(page, search), { errorMessage: text.apiError });
      applySalesResponse(saleData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, language]);

  const saleTotal = useMemo(() => {
    const subtotal = saleForm.items.reduce((total, item) => {
      const product = products.find((record) => record.id === Number(item.product_id));
      const itemSubtotal = Number(product?.selling_price || 0) * parseFormattedNumber(item.quantity);
      const itemDiscount = percentAmount(itemSubtotal, item.discount_percent);
      return total + itemSubtotal - itemDiscount;
    }, 0);
    const transactionDiscount = percentAmount(subtotal, saleForm.discount_percent);
    const taxableAmount = Math.max(0, subtotal - transactionDiscount);
    return taxableAmount + percentAmount(taxableAmount, saleForm.tax_percent);
  }, [products, saleForm]);

  function submitPassword(event) {
    event.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      return;
    }
    setAuthError(text.passwordError);
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setDashboard(null);
    setMessage('');
  }

  async function submitProduct(event) {
    event.preventDefault();
    await runWithBusy(text.saving, async () => {
      setMessage('');
      try {
        await api('/products', {
          method: 'POST',
          errorMessage: text.apiError,
          body: JSON.stringify({
            ...productForm,
            category_id: productForm.category_id || null,
            cost_price: parseFormattedNumber(productForm.cost_price),
            selling_price: parseFormattedNumber(productForm.selling_price),
            stock_quantity: parseFormattedNumber(productForm.stock_quantity),
            minimum_stock: parseFormattedNumber(productForm.minimum_stock),
            is_active: true,
          }),
        });
        setProductForm(emptyProduct);
        setMessage(text.saveProductSuccess);
        await loadData({ showOverlay: false });
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  async function submitCategory(event) {
    event.preventDefault();
    await submitSimple('/categories', categoryForm, () => setCategoryForm({ name: '', description: '' }), text.saveCategorySuccess);
  }

  async function submitCustomer(event) {
    event.preventDefault();
    await submitSimple('/customers', customerForm, () => setCustomerForm({ name: '', phone: '', email: '', address: '' }), text.saveCustomerSuccess);
  }

  async function submitSupplier(event) {
    event.preventDefault();
    await submitSimple('/suppliers', supplierForm, () => setSupplierForm({ name: '', phone: '', email: '', address: '', contact_person: '' }), text.saveSupplierSuccess);
  }

  async function submitSimple(path, payload, reset, successMessage) {
    await runWithBusy(text.saving, async () => {
      setMessage('');
      try {
        await api(path, {
          method: 'POST',
          errorMessage: text.apiError,
          body: JSON.stringify(payload),
        });
        reset();
        setMessage(successMessage);
        await loadData({ showOverlay: false });
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  async function submitStock(event) {
    event.preventDefault();
    await runWithBusy(text.saving, async () => {
      setMessage('');
      try {
        await api('/stock-movements', {
          method: 'POST',
          errorMessage: text.apiError,
          body: JSON.stringify({
            ...stockForm,
            product_id: Number(stockForm.product_id),
            quantity: parseFormattedNumber(stockForm.quantity),
          }),
        });
        setStockForm({ product_id: '', type: 'in', quantity: '1', notes: '' });
        setMessage(text.saveStockSuccess);
        await loadData({ showOverlay: false });
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  async function submitSale(event) {
    event.preventDefault();
    await runWithBusy(text.saving, async () => {
      setMessage('');
      try {
        const subtotal = saleForm.items.reduce((total, item) => {
          const product = products.find((record) => record.id === Number(item.product_id));
          const itemSubtotal = Number(product?.selling_price || 0) * parseFormattedNumber(item.quantity);
          return total + itemSubtotal - percentAmount(itemSubtotal, item.discount_percent);
        }, 0);
        const transactionDiscountAmount = percentAmount(subtotal, saleForm.discount_percent);
        const taxableAmount = Math.max(0, subtotal - transactionDiscountAmount);
        const taxAmount = percentAmount(taxableAmount, saleForm.tax_percent);

        const savedSale = await api('/sales', {
          method: 'POST',
          errorMessage: text.apiError,
          body: JSON.stringify({
            customer_id: saleForm.customer_id || null,
            payment_method: saleForm.payment_method,
            paid_amount: parseFormattedNumber(saleForm.paid_amount),
            discount_amount: roundCurrency(transactionDiscountAmount),
            tax_amount: roundCurrency(taxAmount),
            items: saleForm.items.map((item) => ({
              product_id: Number(item.product_id),
              quantity: parseFormattedNumber(item.quantity),
              discount_amount: roundCurrency(getItemDiscountAmount(item, products)),
            })),
          }),
        });
        setSaleForm({
          customer_id: '',
          payment_method: '',
          paid_amount: '',
          discount_percent: '',
          tax_percent: '',
          items: [{ product_id: '', quantity: '1', discount_percent: '' }],
        });
        setMessage(text.saveSaleSuccess);
        setPrintModalSale(savedSale);
        await loadData({ showOverlay: false });
      } catch (error) {
        setMessage(error.message);
      }
    });
  }

  async function printReceipt(sale) {
    setMessage('');

    if (!navigator.bluetooth) {
      setMessage(text.printUnsupported);
      return;
    }

    await runWithBusy(text.printing, async () => {
      setPrinting(true);
      try {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: PRINTER_SERVICES,
        });
        const server = await device.gatt.connect();
        const characteristic = await findPrinterCharacteristic(server);
        const payload = buildReceiptPayload(sale, text, locale);

        for (let index = 0; index < payload.length; index += 120) {
          await characteristic.writeValue(payload.slice(index, index + 120));
        }

        setMessage(text.printSuccess);
      } catch (error) {
        setMessage(`${text.printFailed} ${error.message || ''}`.trim());
      } finally {
        setPrinting(false);
      }
    });
  }

  function updateSaleItem(index, field, value) {
    setSaleForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  async function submitHistorySearch(event) {
    event.preventDefault();
    await loadSales(1, historySearch);
  }

  async function resetHistorySearch() {
    setHistorySearch('');
    await loadSales(1, '');
  }

  if (!isAuthenticated) {
    return (
      <AuthGate
        authError={authError}
        language={language}
        passwordInput={passwordInput}
        setLanguage={setLanguage}
        setPasswordInput={setPasswordInput}
        submitPassword={submitPassword}
        text={text}
      />
    );
  }

  return (
    <main className="app">
      <AppHeader language={language} loadData={loadData} logout={logout} setLanguage={setLanguage} text={text} />

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} text={text} />

      {message && <p className="message">{message}</p>}

      {activeTab === 'dashboard' && (
        <DashboardSection dashboard={dashboard} money={money} text={text} />
      )}

      {activeTab === 'produk' && (
        <ProductSection
          categories={categories}
          formatNumericInput={formatNumericInput}
          formatPriceInput={formatPriceInput}
          money={money}
          parseFormattedNumber={parseFormattedNumber}
          productForm={productForm}
          products={products}
          setProductForm={setProductForm}
          submitProduct={submitProduct}
          text={text}
        />
      )}

      {activeTab === 'master' && (
        <MasterDataSection
          categories={categories}
          categoryForm={categoryForm}
          customerForm={customerForm}
          customers={customers}
          setCategoryForm={setCategoryForm}
          setCustomerForm={setCustomerForm}
          setSupplierForm={setSupplierForm}
          submitCategory={submitCategory}
          submitCustomer={submitCustomer}
          submitSupplier={submitSupplier}
          supplierForm={supplierForm}
          suppliers={suppliers}
          text={text}
        />
      )}

      {activeTab === 'stok' && (
        <StockSection
          formatNumericInput={formatNumericInput}
          locale={locale}
          movements={movements}
          parseFormattedNumber={parseFormattedNumber}
          products={products}
          setStockForm={setStockForm}
          stockForm={stockForm}
          submitStock={submitStock}
          text={text}
        />
      )}

      {activeTab === 'transaksi' && (
        <TransactionSection
          customers={customers}
          formatNumericInput={formatNumericInput}
          formatPriceInput={formatPriceInput}
          money={money}
          parseFormattedNumber={parseFormattedNumber}
          products={products}
          saleForm={saleForm}
          saleTotal={saleTotal}
          sanitizePercentInput={sanitizePercentInput}
          setSaleForm={setSaleForm}
          submitSale={submitSale}
          text={text}
          updateSaleItem={updateSaleItem}
        />
      )}

      {activeTab === 'riwayat' && (
        <HistorySection
          historySearch={historySearch}
          itemSummary={itemSummary}
          loadSales={loadSales}
          locale={locale}
          money={money}
          printReceipt={printReceipt}
          printing={printing}
          resetHistorySearch={resetHistorySearch}
          sales={sales}
          salesMeta={salesMeta}
          setHistorySearch={setHistorySearch}
          submitHistorySearch={submitHistorySearch}
          text={text}
        />
      )}

      <ReceiptModal
        printModalSale={printModalSale}
        printReceipt={printReceipt}
        printing={printing}
        setPrintModalSale={setPrintModalSale}
        text={text}
      />

      {loading && <LoadingOverlay text={busyText || text.processing} />}
    </main>
  );
}
