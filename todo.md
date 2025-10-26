# PistaconsultingV99 - TODO

## New Features to Implement
- [x] Remove database dependency (no DATABASE_URL needed)
- [x] Remove tRPC API (simplify architecture)
- [x] Remove OAuth/JWT authentication
- [x] Store onboarding data in browser localStorage during the process
- [x] At the end of onboarding, send all data via FormSubmit to fl@leibinger-am.de
- [ ] Test the complete flow without database
- [ ] Update environment variables (remove DATABASE_URL, OAUTH_SERVER_URL, JWT_SECRET)
- [x] Build and push to GitHub
- [x] Convert to pure static website (remove Node.js server)
- [x] Update build configuration for static deployment on IONOS Deploy Now
- [x] Test static build locally
- [x] Push static version to GitHub

## Bugs to Fix
- [x] Fix JavaScript error: "Cannot read properties of undefined (reading 'map')" on deployed version
- [x] Remove all remaining tRPC references from the codebase
- [x] Ensure all components work without backend API calls

## Completed Features
- [x] Basic onboarding flow with multiple steps
- [x] API routing fixes for production deployment



## New Bugs
- [x] Fix "Cannot read properties of undefined (reading 'map')" error on IONOS deployment

