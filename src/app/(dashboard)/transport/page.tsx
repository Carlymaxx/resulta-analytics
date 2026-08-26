"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bus, Users, MapPin, UserCheck, Plus, X } from "lucide-react";

const vehicles = [
  { reg: "KBC 123A", type: "Bus", capacity: 45, driver: "John Mwangi", route: "Westlands", status: "Active", schoolId: "school-nairobi-high" },
  { reg: "KBD 456B", type: "Bus", capacity: 45, driver: "Peter Otieno", route: "Eastleigh", status: "Active", schoolId: "school-nairobi-high" },
  { reg: "KBE 789C", type: "Minibus", capacity: 25, driver: "Samuel Kamau", route: "Karen", status: "Active", schoolId: "school-nairobi-high" },
  { reg: "KBF 012D", type: "Minibus", capacity: 25, driver: "David Njoroge", route: "Githurai", status: "Maintenance", schoolId: "school-nairobi-high" },
  { reg: "KBG 345E", type: "Bus", capacity: 45, driver: "Joseph Waweru", route: "Kikuyu", status: "Active", schoolId: "school-nairobi-high" },
  { reg: "KBH 678F", type: "Van", capacity: 14, driver: "Charles Auma", route: "Westlands", status: "Active", schoolId: "school-nairobi-high" },
];

const routes = [
  { name: "Westlands Route", stops: "Westlands – Parklands – CBD", students: 52, distance: "18 km", time: "6:30 AM", vehicle: "KBC 123A", schoolId: "school-nairobi-high" },
  { name: "Eastleigh Route", stops: "Eastleigh – Pumwani – CBD", students: 38, distance: "12 km", time: "6:45 AM", vehicle: "KBD 456B", schoolId: "school-nairobi-high" },
  { name: "Karen Route", stops: "Karen – Langata – CBD", students: 24, distance: "22 km", time: "6:15 AM", vehicle: "KBE 789C", schoolId: "school-nairobi-high" },
  { name: "Githurai Route", stops: "Githurai 44 – Roysambu – Thika Rd", students: 35, distance: "28 km", time: "6:00 AM", vehicle: "KBF 012D", schoolId: "school-nairobi-high" },
  { name: "Kikuyu Route", stops: "Kikuyu – Uthiru – Kawangware", students: 31, distance: "30 km", time: "5:50 AM", vehicle: "KBG 345E", schoolId: "school-nairobi-high" },
];

const drivers = [
  { name: "John Mwangi", id: "DRV001", license: "PSV-12345", phone: "0712 111222", vehicle: "KBC 123A", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Peter Otieno", id: "DRV002", license: "PSV-23456", phone: "0723 222333", vehicle: "KBD 456B", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Samuel Kamau", id: "DRV003", license: "PSV-34567", phone: "0734 333444", vehicle: "KBE 789C", status: "Active", schoolId: "school-nairobi-high" },
  { name: "David Njoroge", id: "DRV004", license: "PSV-45678", phone: "0745 444555", vehicle: "KBF 012D", status: "On Leave", schoolId: "school-nairobi-high" },
  { name: "Joseph Waweru", id: "DRV005", license: "PSV-56789", phone: "0756 555666", vehicle: "KBG 345E", status: "Active", schoolId: "school-nairobi-high" },
  { name: "Charles Auma", id: "DRV006", license: "PSV-67890", phone: "0767 666777", vehicle: "KBH 678F", status: "Active", schoolId: "school-nairobi-high" },
];

const stats = [
  { label: "Total Vehicles", value: "6", icon: Bus, color: "bg-teal-100 text-teal-600" },
  { label: "Active Routes", value: "8", icon: MapPin, color: "bg-blue-100 text-blue-600" },
  { label: "Students on Transport", value: "180", icon: Users, color: "bg-green-100 text-green-600" },
  { label: "Drivers", value: "7", icon: UserCheck, color: "bg-purple-100 text-purple-600" },
];

export default function TransportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const filteredVehicles = vehicles.filter(v => !user?.schoolId || v.schoolId === user.schoolId);
  const filteredRoutes = routes.filter(r => !user?.schoolId || r.schoolId === user.schoolId);
  const filteredDrivers = drivers.filter(d => !user?.schoolId || d.schoolId === user.schoolId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Transport Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage school vehicles, routes, and drivers</p>
        </div>
        <button onClick={() => setShowVehicleModal(true)} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {["vehicles", "routes", "drivers"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? "border-teal-600 text-teal-600 dark:text-teal-400" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "vehicles" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <tr>
                  {["Reg Number", "Type", "Capacity", "Driver", "Route", "Status"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-mono font-medium text-slate-800">{v.reg}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{v.type}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{v.capacity} seats</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{v.driver}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{v.route}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === "Active" ? "bg-green-100 text-green-700" : v.status === "Maintenance" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{v.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "routes" && (
        <div className="grid gap-4">
          {filteredRoutes.map((r, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">{r.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.stops}</p>
                </div>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">{r.vehicle}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div><div className="text-xs text-slate-500">Students</div><div className="font-semibold text-slate-800">{r.students}</div></div>
                <div><div className="text-xs text-slate-500">Distance</div><div className="font-semibold text-slate-800">{r.distance}</div></div>
                <div><div className="text-xs text-slate-500">Pick-up Time</div><div className="font-semibold text-teal-700">{r.time}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "drivers" && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200">
                <tr>
                  {["Driver", "ID", "License", "Phone", "Vehicle", "Status"].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider uppercase tracking-wider uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDrivers.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{d.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{d.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{d.license}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{d.phone}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{d.vehicle}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Vehicle</h2>
              <button onClick="$1" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-5 h-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[["Registration Number", "text"], ["Vehicle Type", "select-type"], ["Seating Capacity", "number"], ["Assigned Driver", "text"], ["Route", "text"]].map(([label, type]) => (
                <div key={label as string}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label as string}</label>
                  {type === "select-type" ? (
                    <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option>Bus</option><option>Minibus</option><option>Van</option>
                    </select>
                  ) : (
                    <input type={type as string} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setShowVehicleModal(false)} className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm font-medium">Cancel</button>
              <button onClick={() => setShowVehicleModal(false)} className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Save Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
