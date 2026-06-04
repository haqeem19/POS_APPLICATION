import React from 'react';
import { DataTable } from '../components/DataTable.jsx';

export function StockSection({
  formatNumericInput,
  locale,
  movements,
  parseFormattedNumber,
  products,
  setStockForm,
  stockForm,
  submitStock,
  text,
}) {
  return (
    <section className="split">
      <form onSubmit={submitStock}>
        <h2>{text.stockMovement}</h2>
        <label>{text.product}<select required value={stockForm.product_id} onChange={(event) => setStockForm({ ...stockForm, product_id: event.target.value })}>
          <option value="" disabled>{text.chooseProduct}</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select></label>
        <label>{text.type}<select value={stockForm.type} onChange={(event) => setStockForm({ ...stockForm, type: event.target.value })}>
          <option value="in">{text.stockIn}</option>
          <option value="out">{text.stockOut}</option>
          <option value="adjustment">{text.stockAdjustment}</option>
        </select></label>
        <label>{text.quantity}<input required inputMode="numeric" value={formatNumericInput(stockForm.quantity)} placeholder={text.quantityPlaceholder} onChange={(event) => setStockForm({ ...stockForm, quantity: parseFormattedNumber(event.target.value) })} /></label>
        <label>{text.notes}<input value={stockForm.notes} placeholder={text.notesPlaceholder} onChange={(event) => setStockForm({ ...stockForm, notes: event.target.value })} /></label>
        <button type="submit">{text.saveMovement}</button>
      </form>

      <div>
        <h2>{text.movementHistory}</h2>
        <DataTable
          columns={[text.date, text.product, text.type, text.quantity, text.notes]}
          noDataText={text.noData}
          rows={movements.map((movement) => [
            new Date(movement.created_at).toLocaleString(locale),
            movement.product?.name || '-',
            movement.type,
            movement.quantity,
            movement.notes || '-',
          ])}
        />
      </div>
    </section>
  );
}
