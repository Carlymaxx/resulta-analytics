"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  saveSettings, loadSettings, logAudit, getCurrentYear, getCurrentTerm,
  SchoolSettings, CLASSES_BY_LEVEL_DEFAULT, LEARNING_AREAS_DEFAULT, saveStudent, Student,
} from "@/lib/schoolStore";
import { School, Calendar, BookOpen, Users, GraduationCap, DollarSign, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const STEPS = [
  { id: 1, title: "School Profile", icon: School, desc: "Tell us about your school" },
  { id: 2, title: "Academic Setup", icon: Calendar, desc: "Year, term & curriculum" },
  { id: 3, title: "Classes", icon: GraduationCap, desc: "Add grade levels" },
  { id: 4, title: "Learning Areas", icon: BookOpen, desc: "Subjects taught" },
  { id: 5, title: "Teachers", icon: Users, desc: "Add or import staff" },
  { id: 6, title: "Students", icon: GraduationCap, desc: "Add or import learners" },
  { id: 7, title: "Fee Structure", icon: DollarSign, desc: "Set fees per term" },
  { id: 8, title: "All Set!", icon: Sparkles, desc: "Welcome to Resulta" },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedLearningAreas, setSelectedLearningAreas] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.schoolId) return;
    const s = loadSettings(user.schoolId);
    if (s) {
      setSettings(s);
      setStep((Math.max(1, s.onboardingStep + 1) as Step) || 1);
    } else {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || !settings) return null;

  const progress = ((step - 1) / 7) * 100;

  const updateSettings = (updates: Partial<SchoolSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    saveSettings(next);
  };

  const completeStep = (nextStep: Step) => {
    updateSettings({ onboardingStep: nextStep === 8 ? 7 : (nextStep - 1) });
    if (nextStep === 8) {
      logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "ONBOARDING_COMPLETE", module: "system", details: "School setup wizard completed" }, user.schoolId);
    }
    setStep(nextStep);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Resulta · School Setup</div>
              <div className="font-semibold text-slate-800">{settings.name}</div>
            </div>
          </div>
          <button onClick={() => { updateSettings({ onboarded: true, onboardingStep: 7 }); router.push("/dashboard"); }} className="text-sm text-slate-500 hover:text-slate-700">
            Skip for now →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">Step {step} of 8 · {STEPS[step - 1].title}</div>
              <div className="text-sm font-bold text-teal-600">{Math.round(progress)}%</div>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-4 overflow-x-auto">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const done = s.id < step;
                const current = s.id === step;
                return (
                  <div key={s.id} className="flex flex-col items-center min-w-[80px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      done ? "bg-teal-600 text-white" : current ? "bg-teal-100 text-teal-700 ring-2 ring-teal-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className={`text-[10px] font-medium ${current ? "text-teal-700" : done ? "text-slate-700" : "text-slate-400"} hidden sm:block`}>{s.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && <Step1 settings={settings} update={updateSettings} onNext={() => completeStep(2)} />}
            {step === 2 && <Step2 settings={settings} update={updateSettings} onBack={() => setStep(1)} onNext={() => completeStep(3)} />}
            {step === 3 && <Step3 settings={settings} selected={selectedClasses} setSelected={setSelectedClasses} onBack={() => setStep(2)} onNext={() => completeStep(4)} />}
            {step === 4 && <Step4 settings={settings} selected={selectedLearningAreas} setSelected={setSelectedLearningAreas} onBack={() => setStep(3)} onNext={() => completeStep(5)} />}
            {step === 5 && <Step5 user={user} selectedClasses={selectedClasses} onBack={() => setStep(4)} onNext={() => completeStep(6)} />}
            {step === 6 && <Step6 user={user} settings={settings} selectedClasses={selectedClasses} onBack={() => setStep(5)} onNext={() => completeStep(7)} />}
            {step === 7 && <Step7 user={user} settings={settings} onBack={() => setStep(6)} onNext={() => completeStep(8)} />}
            {step === 8 && <Step8 settings={settings} user={user} onDone={() => { updateSettings({ onboarded: true, onboardingStep: 7 }); router.push("/dashboard"); }} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel = "Continue", nextDisabled = false }: { onBack?: () => void; onNext: () => void; nextLabel?: string; nextDisabled?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
      <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <button onClick={onNext} disabled={nextDisabled} className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {nextLabel} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Field({ label, children, hint, required = false }: { label: string; children: React.ReactNode; hint?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.className || ""}`} />;
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.className || ""}`} />;
}

function Step1({ settings, update, onNext }: { settings: SchoolSettings; update: (p: Partial<SchoolSettings>) => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Tell us about your school</h2>
      <p className="text-slate-500 mb-6">This information appears on report cards, certificates, and your public profile.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="School Name" required>
          <Input value={settings.name} onChange={e => update({ name: e.target.value })} placeholder="e.g. Nairobi High School" />
        </Field>
        <Field label="Motto" hint="A short inspirational line">
          <Input value={settings.motto} onChange={e => update({ motto: e.target.value })} placeholder="e.g. Education for Excellence" />
        </Field>
        <Field label="Phone" required>
          <Input value={settings.phone} onChange={e => update({ phone: e.target.value })} placeholder="+254 700 000 000" />
        </Field>
        <Field label="Email" required>
          <Input type="email" value={settings.email} onChange={e => update({ email: e.target.value })} placeholder="info@school.ac.ke" />
        </Field>
        <Field label="Address">
          <Input value={settings.address} onChange={e => update({ address: e.target.value })} placeholder="Street, city" />
        </Field>
        <Field label="City">
          <Input value={settings.city} onChange={e => update({ city: e.target.value })} placeholder="Nairobi" />
        </Field>
        <Field label="County">
          <Input value={settings.county} onChange={e => update({ county: e.target.value })} placeholder="Nairobi" />
        </Field>
        <Field label="Sub-County">
          <Input value={settings.subCounty} onChange={e => update({ subCounty: e.target.value })} placeholder="Westlands" />
        </Field>
        <Field label="Principal / Headteacher">
          <Input value={settings.principalName} onChange={e => update({ principalName: e.target.value })} placeholder="Dr. Mary Wanjiku" />
        </Field>
        <Field label="Year Established">
          <Input type="date" value={settings.established} onChange={e => update({ established: e.target.value })} />
        </Field>
      </div>
      <Nav onNext={onNext} nextDisabled={!settings.name || !settings.email} />
    </div>
  );
}

function Step2({ settings, update, onBack, onNext }: { settings: SchoolSettings; update: (p: Partial<SchoolSettings>) => void; onBack: () => void; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Academic setup</h2>
      <p className="text-slate-500 mb-6">Configure the year, term, and curriculum your school follows.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Current Term" required>
          <Select value={settings.term} onChange={e => update({ term: e.target.value })}>
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </Select>
        </Field>
        <Field label="Academic Year" required>
          <Input value={settings.academicYear} onChange={e => update({ academicYear: e.target.value })} placeholder="2025-2026" />
        </Field>
        <Field label="Curriculum" required>
          <Select value={settings.curriculum} onChange={e => update({ curriculum: e.target.value as SchoolSettings["curriculum"] })}>
            <option value="CBC">CBC (Competency-Based Curriculum)</option>
            <option value="KCSE">KCSE (8-4-4)</option>
            <option value="IGCSE">IGCSE / International</option>
            <option value="TVET">TVET</option>
            <option value="Other">Other</option>
          </Select>
        </Field>
        <Field label="Grading System">
          <Select value={settings.gradingSystem} onChange={e => update({ gradingSystem: e.target.value as SchoolSettings["gradingSystem"] })}>
            <option value="CBC">CBC (4 Levels)</option>
            <option value="KCSE">KCSE (A-E)</option>
            <option value="Custom">Custom</option>
          </Select>
        </Field>
        <Field label="Currency" required>
          <Select value={settings.currency} onChange={e => update({ currency: e.target.value as SchoolSettings["currency"] })}>
            <option value="KES">KES — Kenyan Shilling</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
          </Select>
        </Field>
        <Field label="Timezone">
          <Input value={settings.timezone} onChange={e => update({ timezone: e.target.value })} />
        </Field>
      </div>
      <Nav onBack={onBack} onNext={onNext} />
    </div>
  );
}

function Step3({ settings, selected, setSelected, onBack, onNext }: { settings: SchoolSettings; selected: string[]; setSelected: (s: string[]) => void; onBack: () => void; onNext: () => void }) {
  const classesByLevel: Record<string, string[]> = {
    primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    junior: ["Grade 7", "Grade 8", "Grade 9"],
    secondary: ["Grade 10", "Grade 11", "Grade 12"],
    tvet: ["Year 1", "Year 2", "Year 3"],
    college: ["Year 1", "Year 2", "Year 3", "Year 4"],
    custom: ["Class A", "Class B", "Class C"],
  };
  const options = classesByLevel[settings.schoolType] || classesByLevel.primary;
  const toggle = (c: string) => {
    setSelected(selected.includes(c) ? selected.filter(x => x !== c) : [...selected, c]);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Which classes does your school have?</h2>
      <p className="text-slate-500 mb-6">Selected: {selected.length} · You can add or remove classes later.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {options.map(c => (
          <button key={c} onClick={() => toggle(c)} className={`p-4 rounded-xl border-2 text-left transition-all ${
            selected.includes(c) ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-slate-300"
          }`}>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-800">{c}</div>
              {selected.includes(c) && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
            </div>
          </button>
        ))}
      </div>
      <Nav onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </div>
  );
}

function Step4({ settings, selected, setSelected, onBack, onNext }: { settings: SchoolSettings; selected: string[]; setSelected: (s: string[]) => void; onBack: () => void; onNext: () => void }) {
  const areasByLevel: Record<string, string[]> = {
    CBC: ["Mathematics", "English", "Kiswahili", "Science & Technology", "Social Studies", "Religious Education", "Creative Arts", "Physical Education"],
    KCSE: ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics", "History", "Geography", "CRE/IRE/HRE", "Business Studies"],
    IGCSE: ["Mathematics", "English", "Sciences", "Humanities", "Languages"],
    TVET: ["Trade Theory", "Trade Practice", "Mathematics", "English", "Entrepreneurship"],
    Other: ["Mathematics", "English", "Science", "Humanities"],
  };
  const options = areasByLevel[settings.curriculum] || areasByLevel.CBC;
  const toggle = (s: string) => setSelected(selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s]);
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Which learning areas do you offer?</h2>
      <p className="text-slate-500 mb-6">These will be available when entering marks and building timetables.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map(s => (
          <button key={s} onClick={() => toggle(s)} className={`p-3 rounded-xl border-2 text-left transition-all ${
            selected.includes(s) ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-slate-300"
          }`}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-800">{s}</div>
              {selected.includes(s) && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
            </div>
          </button>
        ))}
      </div>
      <Nav onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
    </div>
  );
}

function Step5({ user, selectedClasses, onBack, onNext }: { user: any; selectedClasses: string[]; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Add your first teacher</h2>
      <p className="text-slate-500 mb-6">You can add more teachers and assign them to classes in the Teachers page later.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-800 mb-2">Two ways to add teachers</h3>
        <p className="text-sm text-slate-600 mb-4">You can add teachers individually or import a spreadsheet. We'll cover both in the next step.</p>
        <div className="text-sm text-slate-500">
          Classes ready: <span className="font-semibold text-slate-800">{selectedClasses.join(", ")}</span>
        </div>
      </div>
      <Nav onBack={onBack} onNext={onNext} nextLabel="Continue" />
    </div>
  );
}

function Step6({ user, settings, selectedClasses, onBack, onNext }: { user: any; settings: SchoolSettings; selectedClasses: string[]; onBack: () => void; onNext: () => void }) {
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const addSample = async () => {
    if (!user?.schoolId) return;
    setBusy(true);
    const sampleNames: { first: string; last: string; gender: "Male" | "Female" }[] = [
      { first: "Alex", last: "Mwangi", gender: "Male" }, { first: "Mary", last: "Achieng", gender: "Female" },
      { first: "James", last: "Kamau", gender: "Male" }, { first: "Sarah", last: "Wanjiku", gender: "Female" },
      { first: "David", last: "Otieno", gender: "Male" }, { first: "Joyce", last: "Njeri", gender: "Female" },
      { first: "Peter", last: "Mutua", gender: "Male" }, { first: "Faith", last: "Chebet", gender: "Female" },
      { first: "John", last: "Kariuki", gender: "Male" }, { first: "Esther", last: "Wambui", gender: "Female" },
    ];
    for (let i = 0; i < count; i++) {
      const name = sampleNames[i % sampleNames.length];
      const student: Student = {
        id: Date.now() + i,
        admNo: `${settings.schoolId.slice(-4).toUpperCase()}${String(i + 1).padStart(4, "0")}`,
        firstName: name.first,
        lastName: name.last,
        gender: name.gender,
        dob: "2015-01-01",
        class: selectedClasses[i % selectedClasses.length] || selectedClasses[0],
        level: settings.schoolType === "primary" ? "primary" : settings.schoolType === "secondary" ? "secondary" : "junior",
        guardianName: "Guardian",
        guardianPhone: "+254700000000",
        address: "Nairobi",
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
      };
      saveStudent(student, user.schoolId);
    }
    logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "BULK_IMPORT", module: "students", details: `Imported ${count} students during onboarding` }, user.schoolId);
    setBusy(false);
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Add students</h2>
      <p className="text-slate-500 mb-6">Quickly add a few sample students to get started. You can add more or import a full list later.</p>
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
        <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-slate-800 mb-2">{count}</div>
        <div className="text-sm text-slate-500 mb-4">students will be added</div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <button onClick={() => setCount(Math.max(0, count - 5))} className="px-3 py-1 bg-slate-100 rounded">-5</button>
          <button onClick={() => setCount(Math.max(0, count - 1))} className="px-3 py-1 bg-slate-100 rounded">-1</button>
          <input type="number" value={count} onChange={e => setCount(Math.max(0, Number(e.target.value) || 0))} className="w-20 px-2 py-1 border border-slate-200 rounded text-center" />
          <button onClick={() => setCount(count + 1)} className="px-3 py-1 bg-slate-100 rounded">+1</button>
          <button onClick={() => setCount(count + 5)} className="px-3 py-1 bg-slate-100 rounded">+5</button>
        </div>
        <p className="text-xs text-slate-500">Or import a CSV/Excel file in the Students page later.</p>
      </div>
      <Nav onBack={onBack} onNext={addSample} nextLabel={count > 0 ? `Add ${count} students & Continue` : "Skip — Continue"} nextDisabled={busy} />
    </div>
  );
}

function Step7({ user, settings, onBack, onNext }: { user: any; settings: SchoolSettings; onBack: () => void; onNext: () => void }) {
  const [tuition, setTuition] = useState(15000);
  const [boarding, setBoarding] = useState(8000);
  const [activity, setActivity] = useState(1500);
  const saveFees = () => {
    if (typeof window === "undefined" || !user?.schoolId) return;
    localStorage.setItem(`resulta_fee_structure_${user.schoolId}`, JSON.stringify([
      { id: 1, category: "Tuition", amount: tuition, term: "Per Term", schoolId: user.schoolId },
      { id: 2, category: "Boarding", amount: boarding, term: "Per Term", schoolId: user.schoolId },
      { id: 3, category: "Activity", amount: activity, term: "Per Term", schoolId: user.schoolId },
    ]));
    logAudit({ userId: user.id, userName: user.name, userRole: user.role, action: "CREATE", module: "finance", details: "Fee structure created during onboarding" }, user.schoolId);
    onNext();
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Set fee structure</h2>
      <p className="text-slate-500 mb-6">Set per-term fees in {settings.currency}. You can change these anytime.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label={`Tuition (${settings.currency})`}>
          <Input type="number" value={tuition} onChange={e => setTuition(Number(e.target.value) || 0)} />
        </Field>
        <Field label={`Boarding (${settings.currency})`}>
          <Input type="number" value={boarding} onChange={e => setBoarding(Number(e.target.value) || 0)} />
        </Field>
        <Field label={`Activity (${settings.currency})`}>
          <Input type="number" value={activity} onChange={e => setActivity(Number(e.target.value) || 0)} />
        </Field>
      </div>
      <Nav onBack={onBack} onNext={saveFees} nextLabel="Save & Continue" />
    </div>
  );
}

function Step8({ settings, user, onDone }: { settings: SchoolSettings; user: any; onDone: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Resulta, {settings.name}!</h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Your school workspace is ready. Every module will use your data as you add students, teachers, marks, and payments.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-teal-600">0</div>
          <div className="text-xs text-slate-500">Students</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">{settings.term}</div>
          <div className="text-xs text-slate-500">Active Term</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600">{settings.academicYear}</div>
          <div className="text-xs text-slate-500">Academic Year</div>
        </div>
      </div>
      <button onClick={onDone} className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 text-lg">
        Go to Dashboard <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
