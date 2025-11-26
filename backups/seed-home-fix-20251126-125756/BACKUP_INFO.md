# Backup Information
**Timestamp:** 2025-11-26 12:57:56
**Description:** Backup before fixing Payload 3.x compatibility issues in seed-home.ts
**Affected Files:**
- scripts/seed-home.ts
**Reason for Change:**
- Fix TypeScript compilation errors
- Update from Payload 2.x to Payload 3.x API
- Replace CommonJS patterns with ESM
- Fix incorrect getPayload config usage
- Change update() to updateByID()
**Issues Fixed:**
1. Removed deprecated `payload` default import
2. Added `configPromise` import from `@payload-config`
3. Replaced `__dirname` with ESM equivalent
4. Changed `update()` to `updateByID()`
5. Removed Payload 2.x standalone function
6. Replaced `require.main === module` with ESM check
7. Fixed all TypeScript type errors
**How to Restore:**
```bash
cp backups/seed-home-fix-20251126-125756/scripts/seed-home.ts scripts/
```
