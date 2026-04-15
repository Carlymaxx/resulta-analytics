"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Globe,
  ExternalLink
} from "lucide-react";

const faqs = [
  { q: "How do I get started with Resulta Analytics?", a: "Simply sign up for a free trial and import your student data. Our support team will guide you through the setup process." },
  { q: "Is my data secure?", a: "Yes! We use enterprise-grade encryption and follow strict data protection protocols. Your data is stored securely on our servers." },
  { q: "Can I import data from spreadsheets?", a: "Absolutely! You can import data from Excel, CSV, or Google Sheets. We also support integration with other school systems." },
  { q: "Is there a mobile app?", a: "Yes, our mobile app is available on both iOS and Android. Access your analytics on the go!" },
  { q: "What kind of support do you offer?", a: "We offer email, chat, and phone support. Plus, we have extensive documentation and video tutorials." },
  { q: "Can I customize reports?", a: "Yes! You can create custom report templates with your school's branding and specific metrics." },
];

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@resultaanalytics.com", desc: "We'll reply within 24 hours" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", desc: "Mon-Fri, 9am-6pm EST" },
  { icon: MapPin, label: "Address", value: "123 Education Lane, Suite 100", desc: "New York, NY 10001" },
  { icon: Clock, label: "Hours", value: "Monday - Friday", desc: "9:00 AM - 6:00 PM EST" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Contact Us</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Send us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-slate-600 dark:text-slate-400">Thank you for reaching out. We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a topic</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="demo">Request Demo</option>
                  <option value="pricing">Pricing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Get in Touch</h2>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 dark:text-white">{item.label}</div>
                    <div className="text-slate-600 dark:text-slate-400">{item.value}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="font-medium text-slate-800 dark:text-white mb-4">Follow us on</div>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Live Chat CTA */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg">Live Chat</div>
                <div className="text-teal-200 text-sm">Chat with our team</div>
              </div>
            </div>
            <p className="text-teal-100 mb-4">Get instant answers to your questions during business hours.</p>
            <button className="w-full py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{faq.q}</h3>
              <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}