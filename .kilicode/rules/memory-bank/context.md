# Active Context: Resulta Analytics School Management System

## Current State

**Status**: ✅ Fully level-aware portal system

The application now supports switching between all education levels (Primary, Junior, Secondary, Other) via a portal area switcher. When a user enters an area, ALL pages dynamically show the appropriate classes, subjects, and assessments for that level:

- **Primary Schools**: Std 1-6, CBC primary subjects (Science, Creative Arts, etc.)
- **Junior School**: Grade 7-9, CBC subjects (Integrated Science instead of Science, CAS, PTS, etc.)
- **Secondary Schools (KCSE)**: Form 1-4, KCSE subjects (Biology, Chemistry, Physics, etc.)
- **Other**: Year 1-3, custom subjects

## Recently Completed

- [x] Added `CLASSES_BY_LEVEL`, `LEVEL_LABELS`, `ASSESSMENT_BY_LEVEL` to `src/lib/grading.ts` covering all 4 education levels
- [x] Added `currentLevel` state and `setCurrentLevel` to `AuthContext` with localStorage persistence
- [x] Added "Switch Area" dropdown in portal header for level navigation
- [x] Changed portal `canAccess` to allow all authenticated users to enter any area
- [x] Updated portal cards to use `LEVEL_LABELS` for display (Primary/Junior/Secondary/Other)
- [x] Updated `classes/page.tsx`: dynamically generates class cards based on `currentLevel`, level switcher dropdown, level-aware header
- [x] Updated `marks/page.tsx`: class dropdown and subjects use `CLASSES_BY_LEVEL[currentLevel]` / `SUBJECTS_BY_LEVEL[currentLevel]`
- [x] Updated `students/page.tsx`: class filter dropdown and header use level-specific classes
- [x] Updated `teachers/page.tsx`: class assignment dropdown uses level-specific classes
- [x] Updated `timetable/page.tsx`: class selector uses level-specific classes
- [x] Updated `cbt/page.tsx`: class dropdown in exam creation uses level-specific classes
- [x] Updated `certificates/page.tsx`: class dropdown uses level-specific classes, dynamic school info in preview
- [x] Updated `portal/[level]/page.tsx`: uses `LEVEL_LABELS` for display
- [x] Made subjects page fully level-aware: shows only level-specific subjects (Biology/Chemistry/Physics for secondary, Integrated Science/CAS/PTS for junior, etc.)
- [x] Added `SUBJECT_META` lookup in subjects page for subject codes and types per level
- [x] Added school information fields (P.O. Box, School Motto, School Address, School Phone) to signup and settings pages
- [x] Updated `ReportCard` and `Certificate` to use dynamic school info from user context
- [x] Verified typecheck, lint, and build pass cleanly

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/grading.ts` | CLASSES_BY_LEVEL, LEVEL_LABELS, ASSESSMENT_BY_LEVEL, SUBJECTS_BY_LEVEL for all levels | ✅ Updated |
| `src/context/AuthContext.tsx` | Auth context with currentLevel state | ✅ Updated |
| `src/app/(dashboard)/portal/page.tsx` | Portal with area switcher dropdown | ✅ Updated |
| `src/app/(dashboard)/portal/[level]/page.tsx` | Portal level page, level-aware | ✅ Updated |
| `src/app/(dashboard)/classes/page.tsx` | Class management with level switching | ✅ Updated |
| `src/app/(dashboard)/marks/page.tsx` | Marks entry with per-class filtering, level-specific subjects | ✅ Updated |
| `src/app/(dashboard)/subjects/page.tsx` | Level-aware subjects (only shows current level's subjects) | ✅ Updated |
| `src/app/(dashboard)/students/page.tsx` | Student management with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/teachers/page.tsx` | Teacher management with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/timetable/page.tsx` | Timetable with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/cbt/page.tsx` | CBT exams with level-specific classes | ✅ Updated |
| `src/app/(dashboard)/certificates/page.tsx` | Certificate generation with level-specific classes | ✅ Updated |
| `src/app/(auth)/signup/page.tsx` | Registration with school info fields | ✅ Updated |
| `src/app/(dashboard)/settings/page.tsx` | Settings with school info in profile tab | ✅ Updated |

## Current Focus

The level-aware portal system is complete. When you switch areas or click an area card:

1. **Classes change**: Primary shows Std 1-6, Junior shows Grade 7-9, Secondary shows Form 1-4
2. **Subjects change**: Each level shows only its own subjects (e.g., Primary has "Science", Junior has "Integrated Science", Secondary has "Biology/Chemistry/Physics")
3. **Assessments change**: KPSEA (Primary), KJSEA (Junior), KCSE (Secondary)
4. **Marks entry** shows the correct subjects and class dropdown for the current level
5. **Subject management** page only lists subjects relevant to the current education level
6. **Level switcher dropdown** is available on all pages for quick navigation

## Session History

| Date | Changes |
|------|---------|
| 2026-08-24 | Reconfigured for Grade 7-9: added CLASSES & SUBJECTS_BY_LEVEL constants, added 5 new subjects, removed Science from Junior School, added per-class marks filtering, replaced all Form 1A/1B/etc. with Grade 7-9 across all pages |
| 2026-08-24 | Added school information fields (P.O. Box, School Motto, School Address, School Phone) to signup and settings pages; updated AuthContext, ReportCard, and Certificate to use dynamic school info |
| 2026-08-24 | Added Switch Area dropdown to portal, allowed all authenticated users to access all education levels, updated secondary description, improved class card UI |
| 2026-08-24 | Made portal fully level-aware: added CLASSES_BY_LEVEL/LEVEL_LABELS/ASSESSMENT_BY_LEVEL for all 4 levels, added currentLevel state to AuthContext, updated all pages (classes, marks, students, teachers, timetable, CBT, certificates, portal) to use level-specific data |
| 2026-08-24 | Made subjects page fully level-aware: SUBJECT_META lookup, dynamic subject list per level, level switcher dropdown, dynamic stats counts |
