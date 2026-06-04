const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export async function api(path, options = {}) {
  const { errorMessage = 'Request gagal diproses.', ...fetchOptions } = options;
  const headers = {
    Accept: 'application/json',
    ...fetchOptions.headers,
  };

  if (fetchOptions.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || errorMessage;
    throw new Error(message);
  }

  return data;
}

export const formatMoney = (value, locale = 'id-ID') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
