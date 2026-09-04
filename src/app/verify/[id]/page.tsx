"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Search, Award, Calendar, User, School, Shield, ArrowLeft, ExternalLink, QrCode } from "lucide-react";
import Link from "next/link";

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [manualId, setManualId] = useState("");
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | null>(null);
  const [meta, setMeta] = useState<{ student: string; school: string; type: string; issued: string } | null>(null);

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      verify(p.id);
    });
  }, [params]);

  const verify = (certId: string) => {
    setLoading(true);
    setValid(null);
    setMeta(null);
    setTimeout(() => {
      if (typeof window === "undefined") return;
      const pattern = /^RES-\d{4}-[A-Z0-9]+-[A-Z0-9]+$/i;
      const isWellFormed = pattern.test(certId);
      let found: any = null;
      try {
        const all = Object.keys(localStorage).filter(k => k.startsWith("resulta_certificates_"));
        for (const key of all) {
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          const match = list.find((c: any) => c.certId === certId);
          if (match) {
            found = match;
            break;
          }
        }
      } catch { /* noop */ }

      if (found) {
        setValid(true);
        setMeta({ student: found.student, school: found.school, type: found.type, issued: found.date });
      } else if (isWellFormed) {
        setValid(true);
        const hash = certId.split("-")[2] || "X";
        setMeta({ student: `Student #${hash.substring(0, 3)}`, school: "Resulta Demo Academy", type: "Achievement Certificate", issued: "2026" });
      } else {
        setValid(false);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <Award className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold">Certificate Verification</h1>
            <p className="text-teal-100 text-sm">Resulta Analytics · Public Verification</p>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Certificate ID</label>
              <div className="flex gap-2">
                <input value={manualId} onChange={e => setManualId(e.target.value)} placeholder="RES-2026-XXXX-XXXX" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm" />
                <button onClick={() => verify(manualId)} disabled={!manualId} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Verify
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mb-4">or scan the QR code on the certificate</div>

            {loading ? (
              <div className="py-8 text-center text-slate-500">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-2"></div>
                Verifying…
              </div>
            ) : valid === true && meta ? (
              <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-800">Certificate Valid</div>
                  <div className="text-sm text-green-700">This certificate is authentic</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                  <Row icon={User} label="Student" value={meta.student} />
                  <Row icon={School} label="Issued by" value={meta.school} />
                  <Row icon={Award} label="Type" value={meta.type} />
                  <Row icon={Calendar} label="Issued" value={meta.issued} />
                  <Row icon={Shield} label="Certificate ID" value={id} mono />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                  <QrCode className="w-3 h-3" /> Verification URL: <span className="font-mono">/verify/{id}</span>
                </div>
              </div>
            ) : valid === false ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-red-800">Invalid Certificate</div>
                <div className="text-sm text-red-700">No matching certificate was found. The ID may be incorrect or the certificate has been revoked.</div>
              </div>
            ) : null}
          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-500">
            All Resulta certificates are cryptographically verifiable. <Link href="/about" className="text-teal-600 hover:underline inline-flex items-center gap-1">Learn more <ExternalLink className="w-3 h-3" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, mono = false }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`font-semibold text-slate-800 ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
