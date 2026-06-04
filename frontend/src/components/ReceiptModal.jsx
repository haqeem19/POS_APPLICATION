import React from 'react';

export function ReceiptModal({ printModalSale, printReceipt, printing, setPrintModalSale, text }) {
  if (!printModalSale) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="receipt-modal-title">
        <h2 id="receipt-modal-title">{text.receiptReadyTitle}</h2>
        <p>{text.receiptReadyText}</p>
        <p><strong>{printModalSale.invoice_number}</strong></p>
        <div className="modal-actions">
          <button type="button" onClick={() => printReceipt(printModalSale)} disabled={printing}>
            {printing ? text.printing : text.printReceipt}
          </button>
          <button type="button" onClick={() => setPrintModalSale(null)}>{text.close}</button>
        </div>
      </section>
    </div>
  );
}
