# Active Context: Resulta Analytics School Management System

## Current State

**Status**: ✅ Updated for multi-school support

The application now supports multiple schools with dynamic school branding. Users select their school and education level (primary, junior, secondary, or other) during signup. All generated documents (report cards, certificates, reports) display the logged-in user's school name and badge.

## Recently Completed

- [x] Added school name and site/level selection to signup flow
- [x] Added "other" education level option alongside primary, junior, secondary
- [x] Added school badge URL field to signup and settings
- [x] Updated AuthContext to persist school name and badge in localStorage
- [x] Updated dashboard header to display user's school name dynamically
- [x] Updated report cards (marks/page.tsx) to use user's school name
- [x] Updated certificates (marks/page.tsx and certificates/page.tsx) to use user's school name
- [x] Updated reports (reports/page.tsx) to use user's school name
- [x] Updated settings page to persist school name and badge changes
- [x] Updated portal pages to support "other" education level
- [x] Verified typecheck and lint pass cleanly

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/context/AuthContext.tsx` | Auth state + school/level/badge persistence | ✅ Updated |
| `src/app/(auth)/signup/page.tsx` | Signup with school name, level, badge | ✅ Updated |
| `src/app/(dashboard)/settings/page.tsx` | Editable school name + badge with persistence | ✅ Updated |
| `src/app/(dashboard)/marks/page.tsx` | Report cards & certificates using user school | ✅ Updated |
| `src/app/(dashboard)/certificates/page.tsx` | Certificate preview using user school | ✅ Updated |
| `src/app/(dashboard)/reports/page.tsx` | Reports using user school | ✅ Updated |
| `src/app/(dashboard)/layout.tsx` | Dashboard header using user school | ✅ Updated |
| `src/app/(dashboard)/portal/page.tsx` | Portal with "other" level support | ✅ Updated |
| `src/app/(dashboard)/portal/[level]/page.tsx` | Level portal with "other" support | ✅ Updated |

## Current Focus

The multi-school branding system is complete. Next steps:
1. Add actual image upload handling for school badges (currently URL-based)
2. Add per-school data segregation if needed
3. Add school CRUD in super-admin panel

## Session History

| Date | Changes |
|------|---------|
| 2026-08-24 | Added multi-school support: school selection at signup, dynamic branding in documents, badge URL field, updated all generators to read user school info |
