import React from 'react';

export function TransactionSection({
  customers,
  formatNumericInput,
  formatPriceInput,
  money,
  parseFormattedNumber,
  products,
  saleForm,
  saleTotal,
  sanitizePercentInput,
  setSaleForm,
  submitSale,
  text,
  updateSaleItem,
}) {
  return (
    <section>
      <h2>{text.salesTransaction}</h2>
      <form onSubmit={submitSale}>
        <label>{text.customer}<select value={saleForm.customer_id} onChange={(event) => setSaleForm({ ...saleForm, customer_id: event.target.value })}>
          <option value="">{text.walkIn}</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </select></label>

        {saleForm.items.map((item, index) => (
          <div className="line" key={index}>
            <select required value={item.product_id} onChange={(event) => updateSaleItem(index, 'product_id', event.target.value)}>
              <option value="" disabled>{text.chooseProduct}</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name} - {money(product.selling_price)}</option>)}
            </select>
            <input required inputMode="numeric" value={formatNumericInput(item.quantity)} placeholder={text.quantityPlaceholder} onChange={(event) => updateSaleItem(index, 'quantity', parseFormattedNumber(event.target.value))} />
            <div className="input-suffix">
              <input inputMode="decimal" value={item.discount_percent} placeholder={text.itemDiscountPlaceholder} onChange={(event) => updateSaleItem(index, 'discount_percent', sanitizePercentInput(event.target.value))} />
              <span>%</span>
            </div>
          </div>
        ))}

        <button type="button" onClick={() => setSaleForm({ ...saleForm, items: [...saleForm.items, { product_id: '', quantity: '1', discount_percent: '' }] })}>{text.addItem}</button>
        <div className="two-columns">
          <label>{text.transactionDiscount}<div className="input-suffix">
            <input inputMode="decimal" value={saleForm.discount_percent} placeholder={text.transactionDiscountPlaceholder} onChange={(event) => setSaleForm({ ...saleForm, discount_percent: sanitizePercentInput(event.target.value) })} />
            <span>%</span>
          </div></label>
          <label>{text.tax}<div className="input-suffix">
            <input inputMode="decimal" value={saleForm.tax_percent} placeholder={text.taxPlaceholder} onChange={(event) => setSaleForm({ ...saleForm, tax_percent: sanitizePercentInput(event.target.value) })} />
            <span>%</span>
          </div></label>
        </div>
        <label>{text.paymentMethod}<select required value={saleForm.payment_method} onChange={(event) => setSaleForm({ ...saleForm, payment_method: event.target.value })}>
          <option value="" disabled>{text.choosePaymentMethod}</option>
          <option value="cash">Cash</option>
          <option value="qris">QRIS</option>
          <option value="card">Card</option>
          <option value="transfer">Transfer</option>
        </select></label>
        <label>{text.paidAmount}<input required inputMode="numeric" value={formatPriceInput(saleForm.paid_amount)} placeholder={text.paidAmountPlaceholder} onChange={(event) => setSaleForm({ ...saleForm, paid_amount: parseFormattedNumber(event.target.value) })} /></label>
        <p><strong>{text.total}: {money(saleTotal)}</strong></p>
        <button type="submit">{text.saveTransaction}</button>
      </form>
    </section>
  );
}
