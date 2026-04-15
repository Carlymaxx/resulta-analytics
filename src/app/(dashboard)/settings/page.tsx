"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Globe, 
  Database,
  Shield,
  Save,
  Upload,
  Camera,
  Mail,
  Phone,
  Building,
  Key
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Globe },
  { id: "data", label: "Data & Privacy", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          <Save className="w-5 h-5" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Profile Settings</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold">
                    TL
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-700 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">Teacher Lenn</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Administrator</p>
                  <button className="text-sm text-teal-600 hover:underline mt-1">Change photo</button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                  <input type="text" defaultValue="Teacher" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                  <input type="text" defaultValue="Lenn" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input type="email" defaultValue="teacher@school.edu" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">School Name</label>
                  <input type="text" defaultValue="Lincoln High School" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Administrator</option>
                    <option>Teacher</option>
                    <option>Principal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { title: "Email Notifications", desc: "Receive email updates about student alerts", enabled: true },
                  { title: "At-Risk Student Alerts", desc: "Get notified when students are flagged as at-risk", enabled: true },
                  { title: "Weekly Reports", desc: "Receive weekly performance summaries", enabled: false },
                  { title: "New Student Enrollments", desc: "Get notified when new students are added", enabled: true },
                  { title: "System Updates", desc: "Stay informed about system updates and maintenance", enabled: true },
                  { title: "Marketing Emails", desc: "Receive tips, tricks, and product updates", enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white">{item.title}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-slate-800 dark:text-white">Change Password</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="password" placeholder="Current password" className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white" />
                    <input type="password" placeholder="New password" className="px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white" />
                  </div>
                  <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Update Password</button>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 dark:hover:bg-teal-900">Enable 2FA</button>
                </div>

                <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                  <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Permanently delete your account and all data</p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Appearance Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", label: "Light", preview: "bg-white" },
                      { id: "dark", label: "Dark", preview: "bg-slate-800" },
                      { id: "system", label: "System", preview: "bg-gradient-to-r from-white to-slate-800" },
                    ].map((theme) => (
                      <label key={theme.id} className="cursor-pointer">
                        <input type="radio" name="theme" defaultChecked={theme.id === "light"} className="sr-only peer" />
                        <div className={`p-4 rounded-lg border-2 peer-checked:border-teal-500 ${theme.preview}`}>
                          <span className={`text-sm font-medium ${theme.id === 'dark' ? 'text-white' : 'text-slate-800'}`}>{theme.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {["#0D9488", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"].map((color) => (
                      <button key={color} className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Sidebar</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option>Expanded by default</option>
                    <option>Collapsed by default</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Integrations</h2>
              
              <div className="space-y-4">
                {[
                  { name: "Google Workspace", desc: "Import students from Google Classroom", connected: true },
                  { name: "Microsoft 365", desc: "Sync with Azure AD and Microsoft Schools", connected: false },
                  { name: "Canvas LMS", desc: "Import grades from Canvas", connected: false },
                  { name: "Clever", desc: "Single sign-on for students", connected: true },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-2xl">
                        {i === 0 ? '📚' : i === 1 ? '📊' : i === 2 ? '📝' : '🔐'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">{integration.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{integration.desc}</div>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg font-medium ${integration.connected ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'}`}>
                      {integration.connected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Data & Privacy</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Export Your Data</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Download all your data in a portable format</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Upload className="w-4 h-4" />
                    Export as CSV
                  </button>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Data Retention</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Configure how long student data is stored</p>
                  <select className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white">
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>5 years</option>
                    <option>Forever</option>
                  </select>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Privacy Policy</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">We take your privacy seriously. Read our full policy.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}