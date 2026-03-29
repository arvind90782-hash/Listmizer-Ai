import React, { useState } from 'react';
import { FileText, Download, Printer, Plus, Trash2, Info } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Product 1', quantity: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePrint = () => window.print();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-8 border-b border-gray-100 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10 dark:border-slate-800">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-blue/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">
              <FileText className="h-3.5 w-3.5" />
              Invoice Builder
            </div>
            <h2 className="text-3xl font-black tracking-tight text-deep-dark dark:text-white">Create a clean invoice card, not a plain form.</h2>
            <p className="max-w-xl text-sm leading-relaxed text-gray-500 dark:text-slate-400">
              Edit values on the left and keep a polished, print-ready invoice summary on the right. The layout is responsive on mobile and desktop.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-primary-blue/10 bg-primary-blue/5 p-5 dark:border-primary-blue/20 dark:bg-primary-blue/10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Invoice No.</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary-blue dark:bg-slate-900"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border-0 bg-white px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary-blue dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1.15fr_0.85fr] md:p-10">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">Bill To</label>
                <input
                  type="text"
                  placeholder="Customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-primary-blue dark:border-slate-800 dark:bg-slate-800/50"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
                <input
                  type="email"
                  placeholder="Customer email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-primary-blue dark:border-slate-800 dark:bg-slate-800/50"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="border-b border-gray-100 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:border-slate-800">
                Invoice Items
              </div>

              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {items.map((item) => (
                  <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_90px_110px_90px] sm:items-center">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-800 dark:bg-slate-800/50"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-800 dark:bg-slate-800/50"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-blue dark:border-slate-800 dark:bg-slate-800/50"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-deep-dark dark:text-white">₹{(item.quantity * item.price).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-2 text-gray-300 transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 pb-4 text-xs font-bold text-primary-blue transition hover:text-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-gray-100 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Summary</p>
                  <h3 className="text-2xl font-black text-deep-dark dark:text-white">Invoice Preview</h3>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-primary-blue shadow-sm dark:bg-slate-900">
                  {invoiceNumber}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</p>
                  <p className="mt-1 text-sm font-bold text-deep-dark dark:text-white">{customerName || 'Customer Name'}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{customerEmail || 'customer@example.com'}</p>
                </div>

                <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-deep-dark dark:text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST (18%)</span>
                    <span className="font-bold text-deep-dark dark:text-white">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-base font-bold text-deep-dark dark:text-white">Total</span>
                      <span className="text-2xl font-black text-primary-blue">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-300">
                  <div className="mb-2 flex items-start gap-2 font-bold">
                    <Info className="mt-0.5 h-4 w-4" />
                    Print-ready output
                  </div>
                  The top layout is designed to print cleanly as a card instead of a long unstyled form.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row print:hidden">
        <button
          onClick={handlePrint}
          className="btn-primary px-8 py-4"
        >
          <Printer className="h-5 w-5" />
          Print / Save PDF
        </button>
        <button className="btn-secondary px-8 py-4">
          <Download className="h-5 w-5" />
          Download Copy
        </button>
      </div>
    </div>
  );
}
