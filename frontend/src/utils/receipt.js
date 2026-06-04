import { PRINTER_CHARACTERISTICS, PRINTER_SERVICES } from '../config.js';

export async function findPrinterCharacteristic(server) {
  for (const serviceId of PRINTER_SERVICES) {
    try {
      const service = await server.getPrimaryService(serviceId);
      for (const characteristicId of PRINTER_CHARACTERISTICS) {
        try {
          return await service.getCharacteristic(characteristicId);
        } catch {
          // Try the next common printer characteristic.
        }
      }
    } catch {
      // Try the next common printer service.
    }
  }

  throw new Error('Printer service tidak ditemukan.');
}

export function buildReceiptPayload(sale, text, locale) {
  const encoder = new TextEncoder();
  const receiptText = buildReceiptText(sale, text, locale);
  const initialize = Uint8Array.from([0x1b, 0x40]);
  const cut = Uint8Array.from([0x0a, 0x0a, 0x0a, 0x1d, 0x56, 0x42, 0x00]);
  const body = encoder.encode(receiptText);
  const payload = new Uint8Array(initialize.length + body.length + cut.length);

  payload.set(initialize, 0);
  payload.set(body, initialize.length);
  payload.set(cut, initialize.length + body.length);

  return payload;
}

function buildReceiptText(sale, text, locale) {
  const lines = [
    centerLine('POS Application'),
    centerLine('Receipt'),
    '-'.repeat(32),
    padLine(text.invoice, sale.invoice_number),
    padLine(text.date, new Date(sale.sale_date || sale.created_at).toLocaleString(locale)),
    padLine(text.customer, sale.customer?.name || text.walkIn),
    padLine(text.paymentMethod, String(sale.payment_method || '-').toUpperCase()),
    '-'.repeat(32),
  ];

  (sale.items || []).forEach((item) => {
    const productName = item.product?.name || text.product;
    lines.push(truncate(productName, 32));
    lines.push(padLine(`${item.quantity} x ${receiptMoney(item.unit_price, locale)}`, receiptMoney(item.line_total, locale)));
    if (Number(item.discount_amount || 0) > 0) {
      lines.push(padLine(text.transactionDiscount, receiptMoney(item.discount_amount, locale)));
    }
  });

  lines.push('-'.repeat(32));
  lines.push(padLine('Subtotal', receiptMoney(sale.subtotal, locale)));
  lines.push(padLine(text.transactionDiscount, receiptMoney(sale.discount_amount, locale)));
  lines.push(padLine(text.tax, receiptMoney(sale.tax_amount, locale)));
  lines.push(padLine(text.total, receiptMoney(sale.total_amount, locale)));
  lines.push(padLine(text.paidAmount, receiptMoney(sale.paid_amount, locale)));
  lines.push(padLine(locale === 'id-ID' ? 'Kembalian' : 'Change', receiptMoney(sale.change_amount, locale)));
  lines.push('-'.repeat(32));
  lines.push(centerLine(locale === 'id-ID' ? 'Terima kasih' : 'Thank you'));

  return `${lines.join('\n')}\n`;
}

function centerLine(value) {
  const textValue = truncate(value, 32);
  const leftPadding = Math.max(0, Math.floor((32 - textValue.length) / 2));
  return `${' '.repeat(leftPadding)}${textValue}`;
}

function padLine(left, right) {
  const leftValue = truncate(String(left || ''), 16);
  const rightValue = truncate(String(right || ''), 32 - leftValue.length - 1);
  const spacing = Math.max(1, 32 - leftValue.length - rightValue.length);
  return `${leftValue}${' '.repeat(spacing)}${rightValue}`;
}

function truncate(value, maxLength) {
  const textValue = String(value || '');
  return textValue.length > maxLength ? textValue.slice(0, maxLength) : textValue;
}

function receiptMoney(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0)).replace(/\s/g, '');
}
