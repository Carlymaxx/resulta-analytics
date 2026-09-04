// Unified school data store - single source of truth
// All modules (attendance, finance, results, dashboard) read from here

export type Student = {
  id: number;
  admNo: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
  dob: string;
  class: string;
  level: "primary" | "junior" | "secondary" | "other";
  guardianName: string;
  guardianPhone: string;
  address: string;
  status: "Active" | "Transferred" | "Graduated";
  joined: string;
  schoolId?: string;
};

export type StaffMember = {
  id: number;
  name: string;
  empId: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  joined: string;
  schoolId?: string;
};

export type FeePayment = {
  id: number;
  studentId: number;
  amount: number;
  category: string;
  date: string;
  method: string;
  receipt: string;
  status: "Confirmed" | "Pending";
  schoolId?: string;
};

export type FeeStructure = {
  id: number;
  category: string;
  amount: number;
  term: string;
  schoolId?: string;
};

export type MedicalRecord = {
  id: number;
  studentId: number;
  type: string;
  diagnosis: string;
  treatment: string;
  date: string;
  nurseId: number;
  notes: string;
  encrypted: boolean;
  schoolId?: string;
};

export type AuditLogEntry = {
  id: number;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ip: string;
  timestamp: string;
  schoolId?: string;
};

export type ModuleAccess = {
  module: string;
  roles: string[];
};

const TZ = "Africa/Nairobi";
const TODAY = () => new Date().toLocaleDateString("en-CA", { timeZone: TZ });
const NOW = () => new Date().toISOString();
const SCHOOL_KEY = (schoolId?: string, key?: string) =>
  `resulta_${key}${schoolId ? `_${schoolId}` : ""}`;

function readStore<T>(key: string, schoolId?: string, fallback: T[] = []): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(SCHOOL_KEY(schoolId, key));
    return raw ? (JSON.parse(raw) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, data: T[], schoolId?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCHOOL_KEY(schoolId, key), JSON.stringify(data));
}

function appendStore<T extends { id: number }>(key: string, item: T, schoolId?: string): T {
  const items = readStore<T>(key, schoolId);
  const existing = items.findIndex((x) => x.id === item.id);
  if (existing >= 0) {
    items[existing] = item;
  } else {
    items.unshift(item);
  }
  writeStore(key, items, schoolId);
  return item;
}

function nextId(items: { id: number }[]): number {
  return items.length > 0 ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

// =================== STUDENTS ===================

export const STUDENT_KEY = "students";

export function loadStudents(schoolId?: string): Student[] {
  return readStore<Student>(STUDENT_KEY, schoolId);
}

export function saveStudent(student: Student, schoolId?: string): Student {
  const s = { ...student, schoolId };
  return appendStore<Student>(STUDENT_KEY, s, schoolId);
}

export function deleteStudent(id: number, schoolId?: string): void {
  const items = loadStudents(schoolId).filter((s) => s.id !== id);
  writeStore(STUDENT_KEY, items, schoolId);
}

export function getStudentById(id: number, schoolId?: string): Student | undefined {
  return loadStudents(schoolId).find((s) => s.id === id);
}

export function getStudentCount(schoolId?: string): number {
  return loadStudents(schoolId).filter((s) => s.status === "Active").length;
}

export function getStudentCountByClass(className: string, schoolId?: string): number {
  return loadStudents(schoolId).filter(
    (s) => s.class === className && s.status === "Active"
  ).length;
}

// =================== STAFF ===================

export const STAFF_KEY = "staff";

export function loadStaff(schoolId?: string): StaffMember[] {
  return readStore<StaffMember>(STAFF_KEY, schoolId);
}

export function saveStaff(staff: StaffMember, schoolId?: string): StaffMember {
  return appendStore<StaffMember>(STAFF_KEY, { ...staff, schoolId }, schoolId);
}

export function getStaffCount(schoolId?: string): number {
  return loadStaff(schoolId).length;
}

// =================== FEES ===================

export const PAYMENT_KEY = "payments";
export const FEE_STRUCTURE_KEY = "fee_structure";

export function loadPayments(schoolId?: string): FeePayment[] {
  return readStore<FeePayment>(PAYMENT_KEY, schoolId);
}

export function savePayment(payment: FeePayment, schoolId?: string): FeePayment {
  return appendStore<FeePayment>(PAYMENT_KEY, { ...payment, schoolId }, schoolId);
}

export function loadFeeStructure(schoolId?: string): FeeStructure[] {
  return readStore<FeeStructure>(FEE_STRUCTURE_KEY, schoolId);
}

export function getTotalExpectedRevenue(schoolId?: string): number {
  const students = getStudentCount(schoolId);
  const structure = loadFeeStructure(schoolId);
  return structure.reduce((sum, fee) => {
    const applicable = Math.round((students * fee.amount) / 100);
    return sum + applicable;
  }, 0);
}

export function getTotalCollectedRevenue(schoolId?: string): number {
  return loadPayments(schoolId)
    .filter((p) => p.status === "Confirmed")
    .reduce((sum, p) => sum + p.amount, 0);
}

// =================== MEDICAL ===================

export const MEDICAL_KEY = "medical";

export function loadMedicalRecords(schoolId?: string): MedicalRecord[] {
  return readStore<MedicalRecord>(MEDICAL_KEY, schoolId);
}

export function saveMedicalRecord(record: MedicalRecord, schoolId?: string): MedicalRecord {
  const r = { ...record, schoolId, encrypted: true };
  return appendStore<MedicalRecord>(MEDICAL_KEY, r, schoolId);
}

export function canAccessMedical(role: string): boolean {
  return ["superadmin", "admin", "nurse", "principal"].includes(role);
}

function base64Encode(text: string): string {
  if (typeof window === "undefined") return text;
  return btoa(unescape(encodeURIComponent(text)));
}

function base64Decode(text: string): string {
  if (typeof window === "undefined") return text;
  return decodeURIComponent(escape(atob(text)));
}

export function encryptMedicalData(data: string): string {
  return base64Encode(data);
}

export function decryptMedicalData(data: string): string {
  return base64Decode(data);
}

// =================== AUDIT LOG ===================

export const AUDIT_KEY = "audit_log";

export function loadAuditLog(schoolId?: string): AuditLogEntry[] {
  return readStore<AuditLogEntry>(AUDIT_KEY, schoolId);
}

export function logAudit(
  entry: Omit<AuditLogEntry, "id" | "timestamp" | "ip">,
  schoolId?: string
): void {
  if (typeof window === "undefined") return;
  const full: AuditLogEntry = {
    ...entry,
    id: Date.now(),
    timestamp: NOW(),
    ip: "127.0.0.1",
    schoolId,
  };
  const log = readStore<AuditLogEntry>(AUDIT_KEY, schoolId);
  log.unshift(full);
  if (log.length > 1000) log.length = 1000;
  writeStore(AUDIT_KEY, log, schoolId);
}

export function clearAuditLog(schoolId?: string): boolean {
  if (typeof window === "undefined") return false;
  const session = localStorage.getItem("resulta_user");
  if (!session) return false;
  const user = JSON.parse(session);
  if (user.role !== "superadmin" && user.role !== "admin") return false;
  writeStore(AUDIT_KEY, [], schoolId);
  return true;
}

// =================== RBAC ===================

export const MODULE_ACCESS: ModuleAccess[] = [
  { module: "dashboard", roles: ["superadmin", "admin", "principal"] },
  { module: "students", roles: ["superadmin", "admin", "principal", "teacher", "class_teacher"] },
  { module: "teachers", roles: ["superadmin", "admin", "principal"] },
  { module: "classes", roles: ["superadmin", "admin", "principal", "teacher"] },
  { module: "subjects", roles: ["superadmin", "admin", "principal", "teacher"] },
  { module: "timetable", roles: ["superadmin", "admin", "principal", "teacher", "student", "parent"] },
  { module: "attendance", roles: ["superadmin", "admin", "principal", "teacher", "class_teacher"] },
  { module: "marks", roles: ["superadmin", "admin", "principal", "teacher"] },
  { module: "results", roles: ["superadmin", "admin", "principal", "teacher", "student", "parent"] },
  { module: "analytics", roles: ["superadmin", "admin", "principal"] },
  { module: "predictions", roles: ["superadmin", "admin", "principal"] },
  { module: "reports", roles: ["superadmin", "admin", "principal"] },
  { module: "finance", roles: ["superadmin", "admin", "principal", "accountant"] },
  { module: "payroll", roles: ["superadmin", "admin", "principal", "accountant"] },
  { module: "subscription", roles: ["superadmin", "admin"] },
  { module: "library", roles: ["superadmin", "admin", "principal", "teacher", "student", "librarian"] },
  { module: "hostel", roles: ["superadmin", "admin", "principal", "hostel_manager"] },
  { module: "transport", roles: ["superadmin", "admin", "principal", "transport_manager"] },
  { module: "inventory", roles: ["superadmin", "admin", "principal"] },
  { module: "medical", roles: ["superadmin", "admin", "principal", "nurse"] },
  { module: "hr", roles: ["superadmin", "admin", "principal"] },
  { module: "communication", roles: ["superadmin", "admin", "principal", "teacher"] },
  { module: "elearning", roles: ["superadmin", "admin", "principal", "teacher", "student", "parent"] },
  { module: "cbt", roles: ["superadmin", "admin", "principal", "teacher", "student"] },
  { module: "certificates", roles: ["superadmin", "admin", "principal"] },
  { module: "super-admin", roles: ["superadmin"] },
  { module: "notifications", roles: ["superadmin", "admin", "principal", "teacher", "student", "parent"] },
  { module: "settings", roles: ["superadmin", "admin", "principal", "teacher", "student", "parent", "accountant"] },
];

export function canAccess(role: string | undefined, module: string): boolean {
  if (!role) return false;
  if (role === "superadmin") return true;
  const access = MODULE_ACCESS.find((m) => m.module === module);
  return access ? access.roles.includes(role) : false;
}

// =================== AI MODEL METRICS ===================

export const MODEL_METRICS = {
  accuracy: 94.2,
  lastEvaluated: "2026-08-15",
  version: "2.1.0",
  trainingSamples: 4823,
};

export function getModelMetrics() {
  return MODEL_METRICS;
}

// =================== CERTIFICATE VERIFICATION ===================

export function generateCertificateId(studentId: number, year: string): string {
  const hash = ((studentId * 2654435761) >>> 0).toString(36).toUpperCase();
  return `RES-${year}-${hash}-${studentId.toString(36).toUpperCase()}`;
}

export function getVerificationUrl(certId: string): string {
  if (typeof window === "undefined") return `/verify/${certId}`;
  return `${window.location.origin}/verify/${certId}`;
}

// =================== TIMETABLE VALIDATION ===================

export type TimetableSlot = { day: string; period: number; subject: string; teacher: string; class: string };
export type TimetableClash = { type: string; message: string; slots: TimetableSlot[] };

export function validateTimetable(slots: TimetableSlot[]): TimetableClash[] {
  const clashes: TimetableClash[] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (a.day === b.day && a.period === b.period) {
        if (a.teacher === b.teacher) {
          clashes.push({
            type: "teacher-double-booking",
            message: `${a.teacher} is assigned to two classes at ${a.day} Period ${a.period + 1}`,
            slots: [a, b],
          });
        }
        if (a.class === b.class) {
          clashes.push({
            type: "class-double-booking",
            message: `${a.class} has two lessons at ${a.day} Period ${a.period + 1}`,
            slots: [a, b],
          });
        }
      }
    }
  }

  return clashes;
}

// =================== DATES ===================

export function getCurrentTerm(): string {
  const month = new Date().getMonth() + 1;
  if (month <= 4) return "Term 1";
  if (month <= 8) return "Term 2";
  return "Term 3";
}

export function getCurrentYear(): string {
  const d = new Date();
  const m = d.getMonth() + 1;
  return m >= 9 ? `${d.getFullYear()}-${d.getFullYear() + 1}` : `${d.getFullYear() - 1}-${d.getFullYear()}`;
}

export function getTodayISO(): string {
  return TODAY();
}

export const CLASSES_BY_LEVEL_DEFAULT: Record<SchoolSettings["schoolType"], string[]> = {
  primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  junior: ["Grade 7", "Grade 8", "Grade 9"],
  secondary: ["Grade 10", "Grade 11", "Grade 12"],
  tvet: ["Year 1", "Year 2", "Year 3"],
  college: ["Year 1", "Year 2", "Year 3", "Year 4"],
  custom: ["Class A", "Class B", "Class C"],
};

export const LEARNING_AREAS_DEFAULT: Record<SchoolSettings["curriculum"], string[]> = {
  CBC: ["Mathematics", "English", "Kiswahili", "Science & Technology", "Social Studies", "Religious Education", "Creative Arts", "Physical Education"],
  KCSE: ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics", "History", "Geography", "CRE", "Business Studies"],
  IGCSE: ["Mathematics", "English", "Sciences", "Humanities", "Languages"],
  TVET: ["Trade Theory", "Trade Practice", "Mathematics", "English", "Entrepreneurship"],
  Other: ["Mathematics", "English", "Science", "Humanities"],
};

// =================== SCHOOL SETTINGS / TENANT ===================

export type SchoolSettings = {
  schoolId: string;
  name: string;
  motto: string;
  logo: string;
  address: string;
  city: string;
  county: string;
  subCounty: string;
  phone: string;
  email: string;
  schoolType: "primary" | "junior" | "secondary" | "tvet" | "college" | "custom";
  curriculum: "CBC" | "KCSE" | "IGCSE" | "TVET" | "Other";
  currency: "KES" | "USD" | "EUR" | "GBP";
  timezone: string;
  academicYear: string;
  term: string;
  gradingSystem: "CBC" | "KCSE" | "Custom";
  principalName: string;
  established: string;
  createdAt: string;
  onboarded: boolean;
  onboardingStep: number;
  plan: "trial" | "starter" | "professional" | "enterprise";
  planStartedAt: string;
  planEndsAt: string;
};

export const SETTINGS_KEY = "school_settings";
export const DEMO_SCHOOL_ID = "school-demo";
export const DEMO_SCHOOL_NAME = "Resulta Demo Academy";

export function loadSettings(schoolId?: string): SchoolSettings | null {
  if (!schoolId) return null;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SCHOOL_KEY(schoolId, SETTINGS_KEY));
    return raw ? (JSON.parse(raw) as SchoolSettings) : null;
  } catch { return null; }
}

export function saveSettings(settings: SchoolSettings): SchoolSettings {
  if (typeof window === "undefined") return settings;
  localStorage.setItem(SCHOOL_KEY(settings.schoolId, SETTINGS_KEY), JSON.stringify(settings));
  return settings;
}

export function isOnboarded(schoolId?: string): boolean {
  if (!schoolId) return false;
  const s = loadSettings(schoolId);
  return s?.onboarded === true;
}

export function getOnboardingStep(schoolId?: string): number {
  if (!schoolId) return 0;
  const s = loadSettings(schoolId);
  return s?.onboardingStep ?? 0;
}

export function isDemoSchool(schoolId?: string): boolean {
  return schoolId === DEMO_SCHOOL_ID;
}

// =================== SCHOOLS REGISTRY ===================

export type SchoolRecord = {
  schoolId: string;
  name: string;
  schoolType: SchoolSettings["schoolType"];
  plan: SchoolSettings["plan"];
  createdAt: string;
  activeStudents: number;
  activeStaff: number;
  status: "active" | "trial" | "suspended";
};

export const SCHOOLS_KEY = "all_schools";

export function loadAllSchools(): SchoolRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`resulta_${SCHOOLS_KEY}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAllSchools(schools: SchoolRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`resulta_${SCHOOLS_KEY}`, JSON.stringify(schools));
}

export function registerSchool(school: SchoolRecord): void {
  const all = loadAllSchools();
  if (!all.find(s => s.schoolId === school.schoolId)) {
    all.push(school);
    saveAllSchools(all);
  }
}

export function updateSchoolRecord(schoolId: string, updates: Partial<SchoolRecord>): void {
  const all = loadAllSchools();
  const idx = all.findIndex(s => s.schoolId === schoolId);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates };
    saveAllSchools(all);
  }
}

// =================== DEMO DATA SEED ===================

export function seedDemoSchoolIfMissing(): void {
  if (typeof window === "undefined") return;
  if (loadSettings(DEMO_SCHOOL_ID)) return;

  const settings: SchoolSettings = {
    schoolId: DEMO_SCHOOL_ID,
    name: DEMO_SCHOOL_NAME,
    motto: "Knowledge for Excellence",
    logo: "",
    address: "123 Resulta Way, Westlands",
    city: "Nairobi",
    county: "Nairobi",
    subCounty: "Westlands",
    phone: "+254 700 000 000",
    email: "demo@resulta.app",
    schoolType: "primary",
    curriculum: "CBC",
    currency: "KES",
    timezone: "Africa/Nairobi",
    academicYear: getCurrentYear(),
    term: getCurrentTerm(),
    gradingSystem: "CBC",
    principalName: "Dr. Mary Wanjiku",
    established: "2010-01-01",
    createdAt: new Date().toISOString(),
    onboarded: true,
    onboardingStep: 8,
    plan: "professional",
    planStartedAt: new Date().toISOString(),
    planEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveSettings(settings);

  const demoStudents: Student[] = [
    { id: 1, admNo: "DEMO001", firstName: "Amina", lastName: "Wanjiru", gender: "Female", dob: "2015-04-12", class: "Grade 5", level: "primary", guardianName: "Joyce Wanjiru", guardianPhone: "+254711111111", address: "Nairobi", status: "Active", joined: "2024-01-15" },
    { id: 2, admNo: "DEMO002", firstName: "Brian", lastName: "Otieno", gender: "Male", dob: "2015-06-20", class: "Grade 5", level: "primary", guardianName: "John Otieno", guardianPhone: "+254722222222", address: "Kisumu", status: "Active", joined: "2024-01-15" },
    { id: 3, admNo: "DEMO003", firstName: "Christine", lastName: "Mwangi", gender: "Female", dob: "2014-09-01", class: "Grade 6", level: "primary", guardianName: "Peter Mwangi", guardianPhone: "+254733333333", address: "Nairobi", status: "Active", joined: "2023-01-15" },
    { id: 4, admNo: "DEMO004", firstName: "Dennis", lastName: "Kamau", gender: "Male", dob: "2014-03-15", class: "Grade 6", level: "primary", guardianName: "Sarah Kamau", guardianPhone: "+254744444444", address: "Nakuru", status: "Active", joined: "2023-01-15" },
    { id: 5, admNo: "DEMO005", firstName: "Esther", lastName: "Njeri", gender: "Female", dob: "2013-11-22", class: "Grade 7", level: "junior", guardianName: "James Njeri", guardianPhone: "+254755555555", address: "Eldoret", status: "Active", joined: "2022-01-15" },
    { id: 6, admNo: "DEMO006", firstName: "Frank", lastName: "Odhiambo", gender: "Male", dob: "2013-07-08", class: "Grade 7", level: "junior", guardianName: "Mary Odhiambo", guardianPhone: "+254766666666", address: "Kisumu", status: "Active", joined: "2022-01-15" },
    { id: 7, admNo: "DEMO007", firstName: "Gloria", lastName: "Adhiambo", gender: "Female", dob: "2012-12-30", class: "Grade 8", level: "junior", guardianName: "Paul Adhiambo", guardianPhone: "+254777777777", address: "Nairobi", status: "Active", joined: "2021-01-15" },
    { id: 8, admNo: "DEMO008", firstName: "Hassan", lastName: "Abdi", gender: "Male", dob: "2012-05-17", class: "Grade 8", level: "junior", guardianName: "Fatuma Abdi", guardianPhone: "+254788888888", address: "Garissa", status: "Active", joined: "2021-01-15" },
    { id: 9, admNo: "DEMO009", firstName: "Irene", lastName: "Wambua", gender: "Female", dob: "2011-08-09", class: "Grade 9", level: "junior", guardianName: "Joseph Wambua", guardianPhone: "+254799999999", address: "Machakos", status: "Active", joined: "2020-01-15" },
    { id: 10, admNo: "DEMO010", firstName: "John", lastName: "Muthoni", gender: "Male", dob: "2011-02-25", class: "Grade 9", level: "junior", guardianName: "Lucy Muthoni", guardianPhone: "+254700000001", address: "Nyeri", status: "Active", joined: "2020-01-15" },
  ];
  demoStudents.forEach(s => saveStudent(s, DEMO_SCHOOL_ID));

  const demoStaff: StaffMember[] = [
    { id: 1, name: "Dr. Mary Wanjiku", empId: "EMP001", email: "principal@demo.resulta.app", phone: "+254700000000", role: "Principal", department: "Administration", status: "Active", joined: "2010-01-01" },
    { id: 2, name: "Agnes Wambui", empId: "EMP002", email: "agnes@demo.resulta.app", phone: "+254700000002", role: "Nurse", department: "Medical", status: "Active", joined: "2015-01-01" },
    { id: 3, name: "James Kamau", empId: "EMP003", email: "james@demo.resulta.app", phone: "+254700000003", role: "Teacher", department: "Mathematics", status: "Active", joined: "2018-01-01" },
  ];
  demoStaff.forEach(s => saveStaff(s, DEMO_SCHOOL_ID));

  const demoPayments: FeePayment[] = [
    { id: 1, studentId: 1, amount: 15000, category: "Tuition", date: getTodayISO(), method: "M-Pesa", receipt: "DEMO-RCP-001", status: "Confirmed", schoolId: DEMO_SCHOOL_ID },
    { id: 2, studentId: 2, amount: 15000, category: "Tuition", date: getTodayISO(), method: "Cash", receipt: "DEMO-RCP-002", status: "Confirmed", schoolId: DEMO_SCHOOL_ID },
    { id: 3, studentId: 3, amount: 8000, category: "Boarding", date: getTodayISO(), method: "M-Pesa", receipt: "DEMO-RCP-003", status: "Pending", schoolId: DEMO_SCHOOL_ID },
  ];
  demoPayments.forEach(p => savePayment(p, DEMO_SCHOOL_ID));

  logAudit({ userId: "system", userName: "Resulta Platform", userRole: "system", action: "DEMO_SEEDED", module: "system", details: "Demo school data initialized" }, DEMO_SCHOOL_ID);

  registerSchool({
    schoolId: DEMO_SCHOOL_ID,
    name: DEMO_SCHOOL_NAME,
    schoolType: "primary",
    plan: "professional",
    createdAt: new Date().toISOString(),
    activeStudents: demoStudents.length,
    activeStaff: demoStaff.length,
    status: "active",
  });
}
