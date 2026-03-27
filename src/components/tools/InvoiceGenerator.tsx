import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
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
    { id: '1', description: 'Product 1', quantity: 1, price: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="p-8 md:p-12 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-primary-blue tracking-tighter">INVOICE</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Number:</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date:</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 text-right md:text-left">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bill To:</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-blue outline-none transition-all text-sm"
              />
              <input
                type="email"
                placeholder="Customer Email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-blue outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="p-8 md:p-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-24">Qty</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-32">Price</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-32">Total</th>
                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-12 print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-4 pr-4">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 font-medium"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 font-medium"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 font-medium"
                    />
                  </td>
                  <td className="py-4 text-sm font-bold text-deep-dark dark:text-white">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="py-4 print:hidden">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mt-6 flex items-center gap-2 text-xs font-bold text-primary-blue hover:text-blue-600 transition-colors print:hidden"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Invoice Footer */}
        <div className="p-8 md:p-12 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="max-w-xs space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3 text-blue-700 dark:text-blue-400 text-[10px] leading-relaxed print:hidden">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <p>This is a professional invoice generator. You can print this directly or save as PDF using your browser's print feature.</p>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Tax (GST 18%)</span>
                <span className="font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-base font-bold text-deep-dark dark:text-white">Total</span>
                <span className="text-2xl font-black text-primary-blue">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-8 py-4 rounded-2xl bg-primary-blue text-white font-bold flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-primary-blue/20"
        >
          <Printer className="w-5 h-5" />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
