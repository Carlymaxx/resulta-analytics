# Active Context: Resulta Analytics School Management System

## Current State

**Status**: ✅ Fully level-aware portal system

The application now supports switching between all education levels (Primary, Junior, Secondary, Other) via a portal area switcher. When a user enters an area, all pages dynamically show the appropriate classes, subjects, and assessments for that level:

- **Primary Schools**: Std 1-6, CBC subjects (Science, etc.)
- **Junior School**: Grade 7-9, CBC subjects (Integrated Science instead of Science)
- **Secondary Schools (KCSE)**: Form 1-4, KCSE subjects (Biology, Chemistry, Physics, etc.)
- **Other**: Year 1-3, custom subjects

## Recently Completed

- [x] Added `CLASSES_BY_LEVEL`, `LEVEL_LABELS`, `ASSESSMENT_BY_LEVEL` to `src/lib/grading.ts` covering all 4 education levels
- [x] Added `currentLevel` state and `setCurrentLevel` to `AuthContext` with localStorage persistence
- [x] Added "Switch Area" dropdown in portal header — navigate between all education levels
- [x] Changed portal `canAccess` to allow all authenticated users to enter any area (marks their "Current area" instead of "Your area")
- [x] Updated portal cards to use `LEVEL_LABELS` for display (Primary/Junior/Secondary/Other with correct descriptions)
- [x] Updated `src/app/(dashboard)/classes/page.tsx`: dynamically generates class cards based on `currentLevel`, level switcher dropdown, level-aware header
- [x] Updated `src/app/(dashboard)/marks/page.tsx`: class dropdown and subjects use `CLASSES_BY_LEVEL[currentLevel]`
- [x] Updated `src/app/(dashboard)/students/page.tsx`: class filter dropdown uses level-specific classes, header shows level description
- [x] Updated `src/app/(dashboard)/teachers/page.tsx`: class assignment dropdown uses level-specific classes
- [x] Updated `src/app/(dashboard)/timetable/page.tsx`: class selector uses level-specific classes
- [x] Updated `src/app/(dashboard)/cbt/page.tsx`: class dropdown in create exam form uses level-specific classes
- [x] Updated `src/app/(dashboard)/certificates/page.tsx`: class dropdown uses level-specific classes, dynamic school info in preview
- [x] Updated `src/app/(dashboard)/portal/[level]/page.tsx`: uses `LEVEL_LABELS` for display
- [x] Added school information fields (P.O. Box, School Motto, School Address, School Phone) to signup and settings pages
- [x] Updated `ReportCard` and `Certificate` to use dynamic school info from user context
- [x] Verified typecheck, lint, and build pass cleanly

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/grading.ts` | CLASSES_BY_LEVEL, LEVEL_LABELS, SUBJECTS_BY_LEVEL for all levels | ✅ Updated |
| `src/context/AuthContext.tsx` | Auth context with currentLevel state | ✅ Updated |
| `src/app/(dashboard)/portal/page.tsx` | Portal with area switcher dropdown | ✅ Updated |
| `src/app/(dashboard)/portal/[level]/page.tsx` | Portal level page, level-aware | ✅ Updated |
| `src/app/(dashboard)/classes/page.tsx` | Class management with level switching | ✅ Updated |
| `src/app/(dashboard)/marks/page.tsx` | Marks entry with per-class filtering, level-specific subjects | ✅ Updated |
| `src/app/(dashboard)/subjects/page.tsx` | Subjects list with new subjects added | ✅ Updated |
| `src/app/(dashboard)/students/page.tsx` | Student management with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/teachers/page.tsx` | Teacher management with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/timetable/page.tsx` | Timetable with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/cbt/page.tsx` | CBT exams with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/certificates/page.tsx` | Certificate generation with level-specific classes | ✅ Updated |
| `src/app/(auth)/signup/page.tsx` | Registration with school info fields | ✅ Updated |
| `src/app/(dashboard)/settings/page.tsx` | Settings with school info in profile tab | ✅ Updated |

## Current Focus

The level-aware portal system is complete. Users can now:
- Click "Switch Area" in the portal header to navigate between Primary, Junior, Secondary, and Other
- Click on any area card to enter that level's portal
- All pages (classes, marks, students, teachers, CBT, certificates, timetable) now show level-appropriate data
- Classes change per level (Std 1-6, Grade 7-9, Form 1-4, Year 1-3)
- Subjects change per level (primary Science, junior Integrated Science, secondary Biology/Chemistry/Physics, etc.)
- Assessments change per level (KPSEA, KJSEA, KCSE)

## Session History

| Date | Changes |
|------|---------|
| 2026-08-24 | Reconfigured for Grade 7-9: added CLASSES & SUBJECTS_BY_LEVEL constants, added 5 new subjects, removed Science from Junior School, added per-class marks filtering, replaced all Form 1A/1B/etc. with Grade 7-9 across all pages |
| 2026-08-24 | Added school information fields (P.O. Box, School Motto, School Address, School Phone) to signup and settings pages; updated AuthContext, ReportCard, and Certificate to use dynamic school info |
| 2026-08-24 | Added Switch Area dropdown to portal, allowed all authenticated users to access all education levels, updated secondary description from "Form 1 - Form 4" to "Grade 10 - Grade 12", improved class card UI |
| 2026-08-24 | Made portal fully level-aware: added CLASSES_BY_LEVEL/LEVEL_LABELS/ASSESSMENT_BY_LEVEL for all 4 levels, added currentLevel state to AuthContext, updated all pages (classes, marks, students, teachers, timetable, CBT, certificates, portal) to use level-specific data. Secondary now correctly shows Form 1-4 classes. |
