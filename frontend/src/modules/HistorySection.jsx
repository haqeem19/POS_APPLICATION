import React from 'react';
import { DataTable } from '../components/DataTable.jsx';

export function HistorySection({
  historySearch,
  itemSummary,
  loadSales,
  locale,
  money,
  printReceipt,
  printing,
  resetHistorySearch,
  sales,
  salesMeta,
  setHistorySearch,
  submitHistorySearch,
  text,
}) {
  return (
    <section className="history-section">
      <h2>{text.transactionHistory}</h2>
      <form className="history-toolbar" onSubmit={submitHistorySearch}>
        <input
          value={historySearch}
          placeholder={text.historySearchPlaceholder}
          onChange={(event) => setHistorySearch(event.target.value)}
        />
        <button type="submit">{text.search}</button>
        <button type="button" onClick={resetHistorySearch}>{text.reset}</button>
      </form>
      <DataTable
        columns={[
          text.invoice,
          text.date,
          text.customer,
          text.items,
          text.subtotal,
          text.discount,
          text.tax,
          text.total,
          text.paidAmount,
          text.change,
          text.payment,
          text.status,
          text.action,
        ]}
        noDataText={text.noData}
        rows={sales.map((sale) => [
          sale.invoice_number,
          new Date(sale.sale_date).toLocaleString(locale),
          sale.customer?.name || text.walkIn,
          itemSummary(sale, text),
          money(sale.subtotal),
          money(sale.discount_amount),
          money(sale.tax_amount),
          money(sale.total_amount),
          money(sale.paid_amount),
          money(sale.change_amount),
          sale.payment_method,
          sale.status,
          <button type="button" onClick={() => printReceipt(sale)} disabled={printing}>{text.printReceipt}</button>,
        ])}
      />
      <div className="pagination">
        <span>
          {text.pageInfo} {salesMeta.current_page} {text.of} {salesMeta.last_page} - {salesMeta.total} {text.totalRecords}
        </span>
        <div>
          <button
            type="button"
            disabled={salesMeta.current_page <= 1}
            onClick={() => loadSales(salesMeta.current_page - 1)}
          >
            {text.previous}
          </button>
          <button
            type="button"
            disabled={salesMeta.current_page >= salesMeta.last_page}
            onClick={() => loadSales(salesMeta.current_page + 1)}
          >
            {text.next}
          </button>
        </div>
      </div>
    </section>
  );
}
