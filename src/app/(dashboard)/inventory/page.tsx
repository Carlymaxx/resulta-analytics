"use client";

import { useState } from "react";
import { Package, Plus, X, AlertTriangle } from "lucide-react";

const assets = [
  { id: 1, name: "Student Desks", category: "Furniture", qty: 480, condition: "Good", location: "Classrooms" },
  { id: 2, name: "Teacher Chairs", category: "Furniture", qty: 52, condition: "Good", location: "Staffroom" },
  { id: 3, name: "Desktop Computers", category: "ICT", qty: 40, condition: "Good", location: "Computer Lab" },
  { id: 4, name: "Projectors", category: "ICT", qty: 12, condition: "Fair", location: "Various Classrooms" },
  { id: 5, name: "Laboratory Equipment Sets", category: "Science", qty: 30, condition: "Good", location: "Science Labs" },
  { id: 6, name: "Library Shelves", category: "Furniture", qty: 24, condition: "Good", location: "Library" },
  { id: 7, name: "Sports Equipment Set", category: "Sports", qty: 8, condition: "Fair", location: "Sports Store" },
  { id: 8, name: "Musical Instruments", category: "Arts", qty: 15, condition: "Good", location: "Music Room" },
];

const stationery = [
  { id: 1, item: "A4 Printing Paper (Reams)", inStock: 45, minStock: 50, unit: "Reams" },
  { id: 2, item: "Whiteboard Markers (Box)", inStock: 8, minStock: 20, unit: "Boxes" },
  { id: 3, item: "Chalk Boxes", inStock: 60, minStock: 30, unit: "Boxes" },
  { id: 4, item: "Pens (Box of 50)", inStock: 5, minStock: 15, unit: "Boxes" },
  { id: 5, item: "Exam Answer Booklets", inStock: 0, minStock: 200, unit: "Pieces" },
  { id: 6, item: "Staples (Box)", inStock: 24, minStock: 10, unit: "Boxes" },
  { id: 7, item: "Printer Toner Cartridges", inStock: 2, minStock: 6, unit: "Units" },
  { id: 8, item: "Correction Fluid", inStock: 18, minStock: 20, unit: "Pieces" },
];

const purchases = [
  { id: 1, item: "A4 Paper", supplier: "Office World Ltd", qty: 100, amount: 15000, date: "2025-01-10", status: "Delivered" },
  { id: 2, item: "Whiteboard Markers", supplier: "StatMart Kenya", qty: 20, amount: 4000, date: "2025-01-08", status: "Delivered" },
  { id: 3, item: "Printer Toner", supplier: "TechSupply Co.", qty: 4, amount: 28000, date: "2025-01-12", status: "Pending" },
];

const suppliers = [
  { id: 1, name: "Office World Ltd", contact: "James Mwangi", phone: "0722-001-001", email: "info@officeworld.co.ke", category: "Stationery" },
  { id: 2, name: "TechSupply Co.", contact: "Sarah Ndungu", phone: "0722-002-002", email: "sales@techsupply.co.ke", category: "ICT" },
  { id: 3, name: "StatMart Kenya", contact: "Peter Ochieng", phone: "0722-003-003", email: "orders@statmart.co.ke", category: "Stationery" },
  { id: 4, name: "Furniture Masters", contact: "Grace Waweru", phone: "0722-004-004", email: "info@furnmasters.co.ke", category: "Furniture" },
];

const tabs = ["Assets", "Stationery", "Purchases", "Suppliers"];

const getStockStatus = (inStock: number, minStock: number) => {
  if (inStock === 0) return { label: "Out of Stock", cls: "bg-red-100 text-red-700" };
  if (inStock < minStock) return { label: "Low Stock", cls: "bg-amber-100 text-amber-700" };
  return { label: "In Stock", cls: "bg-green-100 text-green-700" };
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("Assets");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [itemForm, setItemForm] = useState({ name: "", category: "Furniture", qty: "", condition: "Good", location: "" });
  const [purForm, setPurForm] = useState({ item: "", supplier: "", qty: "", amount: "" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Assets, stationery, and procurement</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddItem(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button onClick={() => setShowPurchase(true)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Record Purchase
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assets", value: "234", color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Stationery Items", value: "45", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Low Stock", value: "8", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Suppliers", value: "12", color: "text-purple-600", bg: "bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Package className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 px-6">
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-teal-600 text-teal-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === "Assets" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Item Name", "Category", "Quantity", "Condition", "Location"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{a.name}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">{a.category}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-700">{a.qty}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.condition === "Good" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{a.condition}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{a.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Stationery" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Item", "In Stock", "Min Stock", "Unit", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stationery.map(s => {
                    const status = getStockStatus(s.inStock, s.minStock);
                    const isLow = s.inStock < s.minStock;
                    return (
                      <tr key={s.id} className={`${isLow ? "bg-amber-50" : "hover:bg-slate-50"}`}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            {isLow && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                            {s.item}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800">{s.inStock}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{s.minStock}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{s.unit}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Purchases" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Item", "Supplier", "Qty", "Amount (KES)", "Date", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.item}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.supplier}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.qty}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800">{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "Suppliers" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {["Company", "Contact Person", "Phone", "Email", "Category"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{s.contact}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{s.phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{s.email}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">{s.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add Item</h2>
              <button onClick={() => setShowAddItem(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowAddItem(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                <input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Item name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={itemForm.category} onChange={e => setItemForm({ ...itemForm, category: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option>Furniture</option><option>ICT</option><option>Science</option><option>Sports</option><option>Arts</option><option>Stationery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input type="number" value={itemForm.qty} onChange={e => setItemForm({ ...itemForm, qty: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                  <select value={itemForm.condition} onChange={e => setItemForm({ ...itemForm, condition: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                    <option>Good</option><option>Fair</option><option>Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input value={itemForm.location} onChange={e => setItemForm({ ...itemForm, location: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Location" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Add Item</button>
                <button type="button" onClick={() => setShowAddItem(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Purchase Modal */}
      {showPurchase && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Record Purchase</h2>
              <button onClick={() => setShowPurchase(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowPurchase(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Item</label>
                <input value={purForm.item} onChange={e => setPurForm({ ...purForm, item: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="Item name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <select value={purForm.supplier} onChange={e => setPurForm({ ...purForm, supplier: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500">
                  {suppliers.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input type="number" value={purForm.qty} onChange={e => setPurForm({ ...purForm, qty: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount (KES)</label>
                  <input type="number" value={purForm.amount} onChange={e => setPurForm({ ...purForm, amount: e.target.value })} required className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex-1">Record Purchase</button>
                <button type="button" onClick={() => setShowPurchase(false)} className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
