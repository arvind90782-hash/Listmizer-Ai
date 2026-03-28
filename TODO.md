# Listmizer AI Full Audit & Redesign - Master TODO

## Phase 1: Security & Config Fixes [COMPLETE]
- [x] Anonymize Footer/Navbar (remove personal names/emails/phones/images)
- [x] Create .env.example with SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, RAZORPAY_KEY_ID
- [x] Sanitize firebase error logging
- [x] Test env vars injection (Vite)

## Phase 2: Fix Broken Tools [PROGRESS]
- [x] Create src/lib/shiprocket.ts (shared auth/rates)
- [ ] ImageShippingOptimizer: Import lib, fix logic, Gemini vision
- [ ] ShippingPredictorTool: Complete TODO items, lib import
- [ ] Test/audit all 13 tools: validation, loading, errors

## Phase 2: Fix Broken Tools [PENDING]
- [ ] ImageShippingOptimizer: Implement getToken, Gemini vision dims, canvas thumbs
- [ ] ShippingPredictorTool: Complete TODO items, image dim estimation
- [ ] Test/audit all 13 tools: validation, loading, errors

## Phase 3: UI/UX Redesign [PENDING]
- [ ] Home: Simplify hero/tool cards/buttons
- [ ] Consistent tool layouts (forms/results)
- [ ] Navbar/Footers: Clean/responsive
- [ ] Global: Toasts, loading, mobile

## Phase 4: Reliability/Perf [PENDING]
- [ ] Input validation/rate limits
- [ ] Firebase quotas
- [ ] Lazy loading/images

## Phase 5: Deploy [PENDING]
- [ ] Build/test
- [ ] Vercel config

**Next: Phase 1 → Mark [x] as done. User approved full fix; credentials TBD (use placeholders, ask later)."

