# Active Context: Resulta Analytics School Management System

## Current State

**Status**: ✅ Reconfigured for Grade 7-9 Junior School curriculum

The application has been reconfigured to use Grade 7, Grade 8, and Grade 9 as the only available classes. All Form 1-4 class references have been replaced. The marks and subjects systems now reflect the CBC Junior School curriculum with Integrated Science replacing standalone Science, and additional subjects (Agriculture, Creative Arts and Sports, Pre-Technical Studies, Christian Religious Education) added.

School information fields (P.O. Box, School Motto, School Address, School Phone, School Badge) are now configurable on both the signup/registration page and the settings profile page, and are used dynamically in report cards and certificates. Users can now switch between education areas using the dropdown in the portal header.

## Recently Completed

- [x] Added `CLASSES` and `SUBJECTS_BY_LEVEL` constants to `src/lib/grading.ts`
- [x] Updated `src/app/(dashboard)/marks/page.tsx`:
  - Replaced standalone "Science" with "Integrated Science" for Junior School subjects (no Science in junior level)
  - Added 5 new subjects: Integrated Science, Agriculture, Creative Arts and Sports, Pre-Technical Studies, Christian Religious Education
  - Replaced free-text class input with a Grade 7/8/9 dropdown (`CLASSES`)
  - Added per-class marks filtering (class filter dropdown separates records by class, not combined)
  - When a class is selected, only students/records in that class are shown
- [x] Added new subjects to `src/app/(dashboard)/subjects/page.tsx` (Integrated Science, Creative Arts and Sports, Pre-Technical Studies; renamed CRE to "Christian Religious Education")
- [x] Replaced all "Form 1A" / "Form 1B" / "Form 2A" etc. class references with Grade 7, Grade 8, Grade 9 across all pages
- [x] Updated subjects in analytics, dashboard, results, and reports pages to reflect junior curriculum (no standalone Science)
- [x] Added school information fields (P.O. Box, School Motto, School Address, School Phone) to registration/signup and settings pages
- [x] Updated `src/context/AuthContext.tsx`: Added `schoolAddress`, `schoolBox`, `schoolMotto`, `schoolPhone` to `User` and `MockUser` interfaces; updated `signup` function signature; added mock school data to default admin user
- [x] Updated `src/app/(auth)/signup/page.tsx`: Added form fields for School Address, P.O. Box, School Motto, School Phone; passes to signup function
- [x] Updated `src/app/(dashboard)/settings/page.tsx`: Added school info fields to profile tab; `handleSave` persists all new fields to localStorage
- [x] Updated `src/app/(dashboard)/marks/page.tsx`: `ReportCard` and `Certificate` components now use dynamic school info from user context (address, PO box, motto, phone, badge) instead of hardcoded values
- [x] Changed secondary level description from "Form 1 - Form 4" to "Grade 10 - Grade 12" for CBC consistency
- [x] Added "Switch Area" dropdown to portal header for quick navigation between education levels
- [x] Changed portal `canAccess` logic to allow all authenticated users to access all education levels (not just their registered level)
- [x] Improved classes page card UI: larger stat numbers, formatted average score
- [x] Verified typecheck, lint, and build pass cleanly

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/grading.ts` | Shared grading utilities + CLASSES & SUBJECTS_BY_LEVEL constants | ✅ Updated |
| `src/app/(dashboard)/marks/page.tsx` | Marks entry with per-class filtering, junior subjects | ✅ Updated |
| `src/app/(dashboard)/subjects/page.tsx` | Subjects list with new subjects added | ✅ Updated |
| `src/app/(dashboard)/students/page.tsx` | Student management with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/certificates/page.tsx` | Certificate generation with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/classes/page.tsx` | Class management with Grade 7-9 | ✅ Updated |
| `src/app/(dashboard)/portal/page.tsx` | Portal with area switcher dropdown | ✅ Updated |
| `src/app/(dashboard)/portal/[level]/page.tsx` | Portal level access page | ✅ Updated |
| `src/app/(dashboard)/timetable/page.tsx` | Timetable with Grade 7 classes | ✅ Updated |
| `src/app/(dashboard)/cbt/page.tsx` | CBT exams with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/teachers/page.tsx` | Teacher management with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/attendance/page.tsx` | Attendance with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/analytics/page.tsx` | Analytics with junior subjects | ✅ Updated |
| `src/app/(dashboard)/predictions/page.tsx` | Predictions with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/dashboard/page.tsx` | Dashboard with junior subjects | ✅ Updated |
| `src/app/(dashboard)/results/page.tsx` | Results with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/reports/page.tsx` | Reports with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/communication/page.tsx` | Communication with Grade 7-9 references | ✅ Updated |
| `src/app/(dashboard)/library/page.tsx` | Library with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/finance/page.tsx` | Finance with Grade 7-9 classes | ✅ Updated |
| `src/app/(dashboard)/elearning/page.tsx` | E-learning with Grade 8 references | ✅ Updated |
| `src/app/(auth)/signup/page.tsx` | Registration with school info fields | ✅ Updated |
| `src/app/(dashboard)/settings/page.tsx` | Settings with school info in profile tab | ✅ Updated |
| `src/context/AuthContext.tsx` | Auth context with school fields | ✅ Updated |

## Current Focus

The Grade 7-9 Junior School reconfiguration is complete. The marks system now:
- Shows level-appropriate subjects (junior subjects for junior level, no standalone Science)
- Filters marks by class so records are separated, not combined
- Uses a Grade 7/8/9 class dropdown

School information fields (address, PO box, motto, phone, badge) are now configurable on both the registration/signup page and the settings profile page, and are used dynamically in report cards and certificates instead of hardcoded values.

## Session History

| Date | Changes |
|------|---------|
| 2026-08-24 | Reconfigured for Grade 7-9: added CLASSES & SUBJECTS_BY_LEVEL constants, added 5 new subjects, removed Science from Junior School, added per-class marks filtering, replaced all Form 1A/1B/etc. with Grade 7-9 across all pages |
| 2026-08-24 | Added school information fields (P.O. Box, School Motto, School Address, School Phone) to signup and settings pages; updated AuthContext, ReportCard, and Certificate to use dynamic school info |
| 2026-08-24 | Added Switch Area dropdown to portal, allowed all authenticated users to access all education levels, updated secondary description from "Form 1 - Form 4" to "Grade 10 - Grade 12", improved class card UI |