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
  marks: SubjectMark[];
};

export type GradeInfo = { grade: string; points: number; remark: string };

// Available classes for Junior School (Grades 7–9 only)
export const CLASSES: string[] = ["Grade 7", "Grade 8", "Grade 9"];

// Subjects per education level.
// Junior School replaces standalone "Science" with "Integrated Science" and
// adds Agriculture, Creative Arts and Sports, Pre-Technical Studies, and
// Christian Religious Education.
export const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  primary: [
    "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  ],
  junior: [
    "Mathematics", "English", "Kiswahili", "Integrated Science", "Social Studies",
    "Agriculture", "Creative Arts and Sports", "Pre-Technical Studies",
    "Christian Religious Education",
  ],
  secondary: [
    "Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics",
    "History", "Geography", "CRE", "Computer Studies",
  ],
  other: [
    "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  ],
};

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

export function loadRecords(): StudentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StudentRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: StudentRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
