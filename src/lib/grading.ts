// Shared grading + report utilities for Resulta Analytics

export type SubjectMark = {
  subject: string;
  score: number; // 0 - 100
};

export type StudentRecord = {
  id: number;
  name: string;
  admNo: string;
  className: string;
  term: string;
  year: string;
  level: string; // primary | junior | secondary
  schoolId?: string;
  marks: SubjectMark[];
};

export type GradeInfo = { grade: string; points: number; remark: string };
export type RatingInfo = { rating: string; description: string };

// Classes per education level
export const CLASSES_BY_LEVEL: Record<string, string[]> = {
  primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  junior: ["Grade 7", "Grade 8", "Grade 9"],
  secondary: ["Form 1", "Form 2", "Form 3", "Form 4"],
  other: ["Year 1", "Year 2", "Year 3"],
};

// Backwards-compatible: defaults to Junior School classes
export const CLASSES: string[] = CLASSES_BY_LEVEL.junior;

// Assessment name per level
export const ASSESSMENT_BY_LEVEL: Record<string, string> = {
  primary: "KPCEA",
  junior: "KJSEA",
  secondary: "KCSE",
  other: "OTHER",
};

// Level display labels
export const LEVEL_LABELS: Record<string, { label: string; description: string; short: string }> = {
  primary: { label: "Primary School", description: "Grade 1 - Grade 6 (CBC)", short: "CBC Primary" },
  junior: { label: "Junior School / KNEC Students", description: "Junior Secondary (CBC)", short: "Junior" },
  secondary: { label: "Secondary Schools (KCSE)", description: "Form 1 - Form 4", short: "KCSE" },
  other: { label: "Other Educational Institution", description: "Custom curriculum", short: "Other" },
};

// Learning Areas per education level.
// Junior School replaces standalone "Science" with "Integrated Science" and
// adds Agriculture, Creative Arts and Sports, Pre-Technical Studies, and
// Christian Religious Education.
export const LEARNING_AREAS_BY_LEVEL: Record<string, string[]> = {
  primary: [
    "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
    "Creative Arts", "Pre-Primary Activities", "Physical Education",
    "Religious Education", "Home Science",
  ],
  junior: [
    "Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies",
    "Agriculture", "Creative Arts and Sports", "Pre-Technical Studies",
    "Christian Religious Education",
  ],
  secondary: [
    "Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics",
    "History", "Geography", "CRE", "Computer Studies",
    "Commerce", "Literature",
  ],
  other: [
    "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  ],
};

// Backwards-compatible alias
export const SUBJECTS_BY_LEVEL = LEARNING_AREAS_BY_LEVEL;

// KCSE-style 12-point grading (works well for secondary; reasonable for all levels)
export function getGrade(score: number): GradeInfo {
  if (score >= 80) return { grade: "A", points: 12, remark: "Excellent" };
  if (score >= 75) return { grade: "A-", points: 11, remark: "Very Good" };
  if (score >= 70) return { grade: "B+", points: 10, remark: "Very Good" };
  if (score >= 65) return { grade: "B", points: 9, remark: "Good" };
  if (score >= 60) return { grade: "B-", points: 8, remark: "Good" };
  if (score >= 55) return { grade: "C+", points: 7, remark: "Fair" };
  if (score >= 50) return { grade: "C", points: 6, remark: "Fair" };
  if (score >= 45) return { grade: "C-", points: 5, remark: "Average" };
  if (score >= 40) return { grade: "D+", points: 4, remark: "Below Average" };
  if (score >= 35) return { grade: "D", points: 3, remark: "Weak" };
  if (score >= 30) return { grade: "D-", points: 2, remark: "Weak" };
  return { grade: "E", points: 1, remark: "Fail" };
}

export function getRating(score: number): RatingInfo {
  if (score >= 80) return { rating: "Exceeding Expectations", description: "Outstanding performance beyond grade-level standards" };
  if (score >= 50) return { rating: "Meeting Expectations", description: "Solid performance meeting grade-level standards" };
  if (score >= 30) return { rating: "Approaching Expectations", description: "Performance is close to meeting grade-level standards" };
  return { rating: "Below Expectations", description: "Performance is below grade-level standards; intervention needed" };
}

export function totalScore(marks: SubjectMark[]): number {
  return marks.reduce((sum, m) => sum + (Number(m.score) || 0), 0);
}

export function averageScore(marks: SubjectMark[]): number {
  if (marks.length === 0) return 0;
  return totalScore(marks) / marks.length;
}

export function meanGrade(marks: SubjectMark[]): GradeInfo {
  return getGrade(averageScore(marks));
}

export function meanRating(marks: SubjectMark[]): RatingInfo {
  return getRating(averageScore(marks));
}

// Position of each student within a class, ranked by total score (desc)
export function computePositions(students: StudentRecord[]): Record<number, number> {
  const sorted = [...students].sort((a, b) => totalScore(b.marks) - totalScore(a.marks));
  const positions: Record<number, number> = {};
  sorted.forEach((s, i) => {
    positions[s.id] = i + 1;
  });
  return positions;
}

const STORAGE_KEY = "resulta_marks";

export function loadRecords(schoolId?: string): StudentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: StudentRecord[] = raw ? (JSON.parse(raw) as StudentRecord[]) : [];
    if (!schoolId) return all;
    return all.filter(r => r.schoolId === schoolId);
  } catch {
    return [];
  }
}

export function saveRecords(records: StudentRecord[], schoolId?: string): void {
  if (typeof window === "undefined") return;
  if (!schoolId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  const all: StudentRecord[] = raw ? (JSON.parse(raw) as StudentRecord[]) : [];
  const others = all.filter(r => r.schoolId !== schoolId);
  const merged = [...others, ...records];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}
