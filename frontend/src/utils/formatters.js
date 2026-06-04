import { HISTORY_PER_PAGE } from '../config.js';

export function buildSalesPath(page, search) {
  const params = new URLSearchParams({
    per_page: String(HISTORY_PER_PAGE),
    page: String(page || 1),
  });

  if (search.trim()) {
    params.set('search', search.trim());
  }

  return `/sales?${params.toString()}`;
}

export function itemSummary(sale, text) {
  const items = sale.items || [];

  if (items.length === 0) {
    return `0 ${text.items}`;
  }

  const quantity = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const names = items.slice(0, 2).map((item) => item.product?.name || text.product).join(', ');
  const remaining = items.length > 2 ? ` +${items.length - 2}` : '';

  return `${quantity} ${text.items}: ${names}${remaining}`;
}

export function parseFormattedNumber(value) {
  const digits = String(value ?? '').replace(/[^\d]/g, '');
  return digits === '' ? '' : Number(digits);
}

export function formatPriceInput(value) {
  return formatSeparatedInput(value, ',');
}

export function formatNumericInput(value) {
  return formatSeparatedInput(value, '.');
}

function formatSeparatedInput(value, separator) {
  const digits = String(value ?? '').replace(/[^\d]/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function sanitizePercentInput(value) {
  const normalized = String(value ?? '').replace(',', '.').replace(/[^\d.]/g, '');
  const [whole, ...fractions] = normalized.split('.');
  const fraction = fractions.join('').slice(0, 2);
  return fraction ? `${whole}.${fraction}` : whole;
}

export function percentAmount(baseAmount, percent) {
  return (Number(baseAmount || 0) * Number(percent || 0)) / 100;
}

export function getItemDiscountAmount(item, products) {
  const product = products.find((record) => record.id === Number(item.product_id));
  const itemSubtotal = Number(product?.selling_price || 0) * parseFormattedNumber(item.quantity);
  return percentAmount(itemSubtotal, item.discount_percent);
}

export function roundCurrency(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}
