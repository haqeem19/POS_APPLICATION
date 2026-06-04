import React from 'react';
import { DataTable } from '../components/DataTable.jsx';

export function DashboardSection({ dashboard, money, text }) {
  return (
    <section>
      <h2>{text.dashboardTitle}</h2>
      <div className="summary">
        <div><strong>{money(dashboard?.today_revenue)}</strong><span>{text.todayRevenue}</span></div>
        <div><strong>{dashboard?.today_sales_count || 0}</strong><span>{text.todaySales}</span></div>
        <div><strong>{dashboard?.product_count || 0}</strong><span>{text.totalProducts}</span></div>
        <div><strong>{dashboard?.low_stock_count || 0}</strong><span>{text.lowStock}</span></div>
      </div>

      <h3>{text.lowStockProducts}</h3>
      <DataTable
        columns={[text.sku, text.name, text.stock, text.minimum]}
        noDataText={text.noData}
        rows={(dashboard?.low_stock_products || []).map((product) => [
          product.sku,
          product.name,
          product.stock_quantity,
          product.minimum_stock,
        ])}
      />
    </section>
  );
}
