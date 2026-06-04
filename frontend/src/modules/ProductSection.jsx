import React from 'react';
import { DataTable } from '../components/DataTable.jsx';

export function ProductSection({
  categories,
  formatNumericInput,
  formatPriceInput,
  money,
  parseFormattedNumber,
  productForm,
  products,
  setProductForm,
  submitProduct,
  text,
}) {
  return (
    <section className="split">
      <form onSubmit={submitProduct}>
        <h2>{text.addProduct}</h2>
        <label>{text.sku}<input required value={productForm.sku} placeholder={text.skuPlaceholder} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} /></label>
        <label>{text.name}<input required value={productForm.name} placeholder={text.productNamePlaceholder} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} /></label>
        <label>{text.category}<select value={productForm.category_id} onChange={(event) => setProductForm({ ...productForm, category_id: event.target.value })}>
          <option value="">{text.noCategory}</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select></label>
        <label>{text.costPrice}<input required inputMode="numeric" value={formatPriceInput(productForm.cost_price)} placeholder={text.costPricePlaceholder} onChange={(event) => setProductForm({ ...productForm, cost_price: parseFormattedNumber(event.target.value) })} /></label>
        <label>{text.sellingPrice}<input required inputMode="numeric" value={formatPriceInput(productForm.selling_price)} placeholder={text.sellingPricePlaceholder} onChange={(event) => setProductForm({ ...productForm, selling_price: parseFormattedNumber(event.target.value) })} /></label>
        <label>{text.stock}<input required inputMode="numeric" value={formatNumericInput(productForm.stock_quantity)} placeholder={text.stockPlaceholder} onChange={(event) => setProductForm({ ...productForm, stock_quantity: parseFormattedNumber(event.target.value) })} /></label>
        <label>{text.minimumStock}<input required inputMode="numeric" value={formatNumericInput(productForm.minimum_stock)} placeholder={text.minimumStockPlaceholder} onChange={(event) => setProductForm({ ...productForm, minimum_stock: parseFormattedNumber(event.target.value) })} /></label>
        <button type="submit">{text.saveProduct}</button>
      </form>

      <div>
        <h2>{text.productList}</h2>
        <DataTable
          columns={[text.sku, text.name, text.category, text.price, text.stock]}
          noDataText={text.noData}
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
  );
}
