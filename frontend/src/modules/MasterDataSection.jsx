import React from 'react';
import { DataTable } from '../components/DataTable.jsx';

export function MasterDataSection({
  categories,
  categoryForm,
  customerForm,
  customers,
  setCategoryForm,
  setCustomerForm,
  setSupplierForm,
  submitCategory,
  submitCustomer,
  submitSupplier,
  supplierForm,
  suppliers,
  text,
}) {
  return (
    <section className="master-grid">
      <div>
        <form onSubmit={submitCategory}>
          <h2>{text.category}</h2>
          <label>{text.name}<input required value={categoryForm.name} placeholder={text.categoryNamePlaceholder} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label>
          <label>{text.description}<input value={categoryForm.description} placeholder={text.descriptionPlaceholder} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></label>
          <button type="submit">{text.saveCategory}</button>
        </form>
        <DataTable columns={[text.name, text.description]} noDataText={text.noData} rows={categories.map((category) => [category.name, category.description || '-'])} />
      </div>

      <div>
        <form onSubmit={submitCustomer}>
          <h2>{text.customer}</h2>
          <label>{text.name}<input required value={customerForm.name} placeholder={text.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} /></label>
          <label>{text.phone}<input value={customerForm.phone} placeholder={text.phonePlaceholder} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} /></label>
          <label>{text.email}<input type="email" value={customerForm.email} placeholder={text.emailPlaceholder} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} /></label>
          <label>{text.address}<input value={customerForm.address} placeholder={text.addressPlaceholder} onChange={(event) => setCustomerForm({ ...customerForm, address: event.target.value })} /></label>
          <button type="submit">{text.saveCustomer}</button>
        </form>
        <DataTable columns={[text.name, text.phone, text.email]} noDataText={text.noData} rows={customers.map((customer) => [customer.name, customer.phone || '-', customer.email || '-'])} />
      </div>

      <div>
        <form onSubmit={submitSupplier}>
          <h2>{text.supplier}</h2>
          <label>{text.name}<input required value={supplierForm.name} placeholder={text.supplier} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} /></label>
          <label>{text.pic}<input value={supplierForm.contact_person} placeholder={text.picPlaceholder} onChange={(event) => setSupplierForm({ ...supplierForm, contact_person: event.target.value })} /></label>
          <label>{text.phone}<input value={supplierForm.phone} placeholder={text.phonePlaceholder} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} /></label>
          <label>{text.email}<input type="email" value={supplierForm.email} placeholder={text.emailPlaceholder} onChange={(event) => setSupplierForm({ ...supplierForm, email: event.target.value })} /></label>
          <label>{text.address}<input value={supplierForm.address} placeholder={text.addressPlaceholder} onChange={(event) => setSupplierForm({ ...supplierForm, address: event.target.value })} /></label>
          <button type="submit">{text.saveSupplier}</button>
        </form>
        <DataTable columns={[text.name, text.pic, text.phone]} noDataText={text.noData} rows={suppliers.map((supplier) => [supplier.name, supplier.contact_person || '-', supplier.phone || '-'])} />
      </div>
    </section>
  );
}
