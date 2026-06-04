import { useEffect, useMemo, useState } from 'react';
import { api, money } from './lib/api.js';

const emptyProduct = {
  category_id: '',
  sku: '',
  name: '',
  cost_price: '',
  selling_price: '',
  stock_quantity: 0,
  minimum_stock: 0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [sales, setSales] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', email: '', address: '', contact_person: '' });
  const [stockForm, setStockForm] = useState({ product_id: '', type: 'in', quantity: 1, notes: '' });
  const [productForm, setProductForm] = useState(emptyProduct);
  const [saleForm, setSaleForm] = useState({
    customer_id: '',
    payment_method: 'cash',
    paid_amount: '',
    discount_amount: 0,
    tax_amount: 0,
    items: [{ product_id: '', quantity: 1, discount_amount: 0 }],
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    setMessage('');
    try {
      const [dashboardData, categoryData, productData, customerData, supplierData, movementData, saleData] = await Promise.all([
        api('/dashboard'),
        api('/categories?per_page=100'),
        api('/products?per_page=100'),
        api('/customers?per_page=100'),
        api('/suppliers?per_page=100'),
        api('/stock-movements?per_page=20'),
        api('/sales?per_page=20'),
      ]);
      setDashboard(dashboardData);
      setCategories(categoryData.data || []);
      setProducts(productData.data || []);
      setCustomers(customerData.data || []);
      setSuppliers(supplierData.data || []);
      setMovements(movementData.data || []);
      setSales(saleData.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const saleTotal = useMemo(() => {
    const subtotal = saleForm.items.reduce((total, item) => {
      const product = products.find((record) => record.id === Number(item.product_id));
      return total + (Number(product?.selling_price || 0) * Number(item.quantity || 0) - Number(item.discount_amount || 0));
    }, 0);
    return subtotal - Number(saleForm.discount_amount || 0) + Number(saleForm.tax_amount || 0);
  }, [products, saleForm]);

  async function submitProduct(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api('/products', {
        method: 'POST',
        body: JSON.stringify({
          ...productForm,
          category_id: productForm.category_id || null,
          cost_price: Number(productForm.cost_price),
          selling_price: Number(productForm.selling_price),
          stock_quantity: Number(productForm.stock_quantity),
          minimum_stock: Number(productForm.minimum_stock),
          is_active: true,
        }),
      });
      setProductForm(emptyProduct);
      setMessage('Produk berhasil disimpan.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitCategory(event) {
    event.preventDefault();
    await submitSimple('/categories', categoryForm, () => setCategoryForm({ name: '', description: '' }), 'Kategori berhasil disimpan.');
  }

  async function submitCustomer(event) {
    event.preventDefault();
    await submitSimple('/customers', customerForm, () => setCustomerForm({ name: '', phone: '', email: '', address: '' }), 'Pelanggan berhasil disimpan.');
  }

  async function submitSupplier(event) {
    event.preventDefault();
    await submitSimple('/suppliers', supplierForm, () => setSupplierForm({ name: '', phone: '', email: '', address: '', contact_person: '' }), 'Supplier berhasil disimpan.');
  }

  async function submitSimple(path, payload, reset, successMessage) {
    setMessage('');
    try {
      await api(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      reset();
      setMessage(successMessage);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitStock(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api('/stock-movements', {
        method: 'POST',
        body: JSON.stringify({
          ...stockForm,
          product_id: Number(stockForm.product_id),
          quantity: Number(stockForm.quantity),
        }),
      });
      setStockForm({ product_id: '', type: 'in', quantity: 1, notes: '' });
      setMessage('Mutasi stok berhasil disimpan.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitSale(event) {
    event.preventDefault();
    setMessage('');
    try {
      await api('/sales', {
        method: 'POST',
        body: JSON.stringify({
          ...saleForm,
          customer_id: saleForm.customer_id || null,
          paid_amount: Number(saleForm.paid_amount),
          discount_amount: Number(saleForm.discount_amount),
          tax_amount: Number(saleForm.tax_amount),
          items: saleForm.items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
            discount_amount: Number(item.discount_amount || 0),
          })),
        }),
      });
      setSaleForm({
        customer_id: '',
        payment_method: 'cash',
        paid_amount: '',
        discount_amount: 0,
        tax_amount: 0,
        items: [{ product_id: '', quantity: 1, discount_amount: 0 }],
      });
      setMessage('Transaksi berhasil disimpan.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function updateSaleItem(index, field, value) {
    setSaleForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>POS Application</h1>
          <p>Laravel API, Supabase PostgreSQL, React frontend</p>
        </div>
        <button type="button" onClick={loadData}>Refresh</button>
      </header>

      <nav className="tabs">
        {['dashboard', 'produk', 'master', 'stok', 'transaksi', 'riwayat'].map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {message && <p className="message">{message}</p>}
      {loading && <p>Memuat data...</p>}

      {activeTab === 'dashboard' && (
        <section>
          <h2>Dashboard</h2>
          <div className="summary">
            <div><strong>{money(dashboard?.today_revenue)}</strong><span>Omzet Hari Ini</span></div>
            <div><strong>{dashboard?.today_sales_count || 0}</strong><span>Transaksi Hari Ini</span></div>
            <div><strong>{dashboard?.product_count || 0}</strong><span>Total Produk</span></div>
            <div><strong>{dashboard?.low_stock_count || 0}</strong><span>Stok Rendah</span></div>
          </div>

          <h3>Produk Stok Rendah</h3>
          <DataTable
            columns={['SKU', 'Nama', 'Stok', 'Minimum']}
            rows={(dashboard?.low_stock_products || []).map((product) => [
              product.sku,
              product.name,
              product.stock_quantity,
              product.minimum_stock,
            ])}
          />
        </section>
      )}

      {activeTab === 'produk' && (
        <section className="split">
          <form onSubmit={submitProduct}>
            <h2>Tambah Produk</h2>
            <label>SKU<input required value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} /></label>
            <label>Nama<input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} /></label>
            <label>Kategori<select value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}>
              <option value="">Tanpa kategori</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select></label>
            <label>Harga Modal<input required type="number" value={productForm.cost_price} onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })} /></label>
            <label>Harga Jual<input required type="number" value={productForm.selling_price} onChange={(e) => setProductForm({ ...productForm, selling_price: e.target.value })} /></label>
            <label>Stok<input required type="number" value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })} /></label>
            <label>Minimum Stok<input required type="number" value={productForm.minimum_stock} onChange={(e) => setProductForm({ ...productForm, minimum_stock: e.target.value })} /></label>
            <button type="submit">Simpan Produk</button>
          </form>

          <div>
            <h2>Daftar Produk</h2>
            <DataTable
              columns={['SKU', 'Nama', 'Kategori', 'Harga', 'Stok']}
              rows={products.map((product) => [
                product.sku,
                product.name,
                product.category?.name || '-',
                money(product.selling_price),
                product.stock_quantity,
              ])}
            />
          </div>
        </section>
      )}

      {activeTab === 'master' && (
        <section className="master-grid">
          <div>
            <form onSubmit={submitCategory}>
              <h2>Kategori</h2>
              <label>Nama<input required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} /></label>
              <label>Deskripsi<input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></label>
              <button type="submit">Simpan Kategori</button>
            </form>
            <DataTable columns={['Nama', 'Deskripsi']} rows={categories.map((category) => [category.name, category.description || '-'])} />
          </div>

          <div>
            <form onSubmit={submitCustomer}>
              <h2>Pelanggan</h2>
              <label>Nama<input required value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} /></label>
              <label>Telepon<input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} /></label>
              <label>Email<input type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} /></label>
              <label>Alamat<input value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })} /></label>
              <button type="submit">Simpan Pelanggan</button>
            </form>
            <DataTable columns={['Nama', 'Telepon', 'Email']} rows={customers.map((customer) => [customer.name, customer.phone || '-', customer.email || '-'])} />
          </div>

          <div>
            <form onSubmit={submitSupplier}>
              <h2>Supplier</h2>
              <label>Nama<input required value={supplierForm.name} onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })} /></label>
              <label>PIC<input value={supplierForm.contact_person} onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })} /></label>
              <label>Telepon<input value={supplierForm.phone} onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })} /></label>
              <label>Email<input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })} /></label>
              <label>Alamat<input value={supplierForm.address} onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })} /></label>
              <button type="submit">Simpan Supplier</button>
            </form>
            <DataTable columns={['Nama', 'PIC', 'Telepon']} rows={suppliers.map((supplier) => [supplier.name, supplier.contact_person || '-', supplier.phone || '-'])} />
          </div>
        </section>
      )}

      {activeTab === 'stok' && (
        <section className="split">
          <form onSubmit={submitStock}>
            <h2>Mutasi Stok</h2>
            <label>Produk<select required value={stockForm.product_id} onChange={(e) => setStockForm({ ...stockForm, product_id: e.target.value })}>
              <option value="">Pilih produk</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select></label>
            <label>Tipe<select value={stockForm.type} onChange={(e) => setStockForm({ ...stockForm, type: e.target.value })}>
              <option value="in">Stok Masuk</option>
              <option value="out">Stok Keluar</option>
              <option value="adjustment">Penyesuaian ke Jumlah Baru</option>
            </select></label>
            <label>Jumlah<input required type="number" min="1" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} /></label>
            <label>Catatan<input value={stockForm.notes} onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })} /></label>
            <button type="submit">Simpan Mutasi</button>
          </form>

          <div>
            <h2>Riwayat Mutasi</h2>
            <DataTable
              columns={['Tanggal', 'Produk', 'Tipe', 'Jumlah', 'Catatan']}
              rows={movements.map((movement) => [
                new Date(movement.created_at).toLocaleString('id-ID'),
                movement.product?.name || '-',
                movement.type,
                movement.quantity,
                movement.notes || '-',
              ])}
            />
          </div>
        </section>
      )}

      {activeTab === 'transaksi' && (
        <section>
          <h2>Transaksi Penjualan</h2>
          <form onSubmit={submitSale}>
            <label>Pelanggan<select value={saleForm.customer_id} onChange={(e) => setSaleForm({ ...saleForm, customer_id: e.target.value })}>
              <option value="">Walk-in</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select></label>

            {saleForm.items.map((item, index) => (
              <div className="line" key={index}>
                <select required value={item.product_id} onChange={(e) => updateSaleItem(index, 'product_id', e.target.value)}>
                  <option value="">Pilih produk</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name} - {money(product.selling_price)}</option>)}
                </select>
                <input required type="number" min="1" value={item.quantity} onChange={(e) => updateSaleItem(index, 'quantity', e.target.value)} />
                <input type="number" min="0" value={item.discount_amount} onChange={(e) => updateSaleItem(index, 'discount_amount', e.target.value)} />
              </div>
            ))}

            <button type="button" onClick={() => setSaleForm({ ...saleForm, items: [...saleForm.items, { product_id: '', quantity: 1, discount_amount: 0 }] })}>Tambah Item</button>
            <label>Diskon Transaksi<input type="number" value={saleForm.discount_amount} onChange={(e) => setSaleForm({ ...saleForm, discount_amount: e.target.value })} /></label>
            <label>Pajak<input type="number" value={saleForm.tax_amount} onChange={(e) => setSaleForm({ ...saleForm, tax_amount: e.target.value })} /></label>
            <label>Metode Bayar<select value={saleForm.payment_method} onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="qris">QRIS</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </select></label>
            <label>Dibayar<input required type="number" value={saleForm.paid_amount} onChange={(e) => setSaleForm({ ...saleForm, paid_amount: e.target.value })} /></label>
            <p><strong>Total: {money(saleTotal)}</strong></p>
            <button type="submit">Simpan Transaksi</button>
          </form>
        </section>
      )}

      {activeTab === 'riwayat' && (
        <section>
          <h2>Riwayat Transaksi</h2>
          <DataTable
            columns={['Invoice', 'Tanggal', 'Pelanggan', 'Total', 'Bayar']}
            rows={sales.map((sale) => [
              sale.invoice_number,
              new Date(sale.sale_date).toLocaleString('id-ID'),
              sale.customer?.name || 'Walk-in',
              money(sale.total_amount),
              sale.payment_method,
            ])}
          />
        </section>
      )}
    </main>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={columns.length}>Tidak ada data.</td></tr>}
          {rows.map((row, index) => (
            <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
