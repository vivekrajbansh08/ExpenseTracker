# Copilot instructions for Expense Tracker

This repository is a two-part app: a TypeScript/Express backend and an Angular frontend. The notes below capture the important patterns, commands, and files an AI coding agent should know to be immediately productive.

## Big picture
- Two projects at repo root: `backend/` (Express + TypeScript + Mongoose) and `frontend/` (Angular 21 app).
- Backend exposes REST APIs under `/api/*`. Key route groups:
  - `/api/auth` — registration, OTP verification, login
  - `/api/transactions` — transaction CRUD
  - `/api/budgets` — budget CRUD
- Frontend runs on `ng serve` (default `http://localhost:4200`) and calls backend at `http://localhost:3000/api/*`.

## How to run (local dev)
- Backend
  - Install: `cd backend && npm install`
  - Dev: `npm run dev` (uses `nodemon src/server.ts` — relies on `ts-node`/TypeScript runtime)
  - Build: `npm run build` → `node dist/server.js` to run production build
  - Required env vars: `MONGODB_URI`, `JWT_SECRET` (or fallback used), `JWT_EXPIRE` (optional), `SMTP_EMAIL`, `SMTP_PASSWORD`, `PORT` (optional), `NODE_ENV`.
- Frontend
  - Install: `cd frontend && npm install`
  - Dev server: `ng serve`
  - Tests: `ng test` (Vitest configured via Angular CLI)
  - Build: `ng build` → artifacts in `dist/`

Run both in separate terminals (frontend @4200, backend @3000). CORS is enabled on the backend.

## Important integration & auth patterns
- Backend uses JWT (`backend/src/utils/jwt.ts`) with `generateToken`/`verifyToken` helpers.
- Auth middleware (`backend/src/middleware/authMiddleware.ts`) expects `Authorization: Bearer <token>` header and sets `req.userId`.
- Frontend `AuthService` stores token in `localStorage` under `token` and the user under `user`; `auth.interceptor` attaches the header on outgoing requests.
- Registration flow (backend): two-step OTP flow using `TempUser`:
  1. `POST /api/auth/register` — stores a temp record (OTP), emails via `utils/sendEmail.ts` using `SMTP_EMAIL`/`SMTP_PASSWORD`.
  2. `POST /api/auth/verify-otp` — validates OTP, creates real `User`, returns JWT.

## Project-specific conventions and pitfalls to watch
- Folder layout (backend): `src/controllers`, `src/routes`, `src/models`, `src/middleware`, `src/utils`. Follow existing split of responsibilities when adding features.
- Models are Mongoose + TypeScript (`backend/src/models/*`). Password hashing is implemented via `pre('save')` on `User` and a `comparePassword` method.
- Error handling: use the centralized `errorHandler` middleware (added last in `server.ts`) — throw or forward errors with `statusCode` and `message` to keep responses consistent.
- Frontend uses Angular standalone-style injectables: `inject()` within interceptors/guards and `BehaviorSubject` for user state in `AuthService`.

Notable inconsistencies (verify before changing behavior):
- `backend/src/models/TempUser.ts` sets TTL via `createdAt` index and the controller also writes an `otpExpires` field — schema and controller disagree on stored fields. Verify before refactoring.
- Frontend `AuthService.verifyOtp` signature expects `{ userId: string; otp: string }` but backend `verifyOtp` expects `{ email, otp }`. Confirm which is intended before modifying either side.

## Files to read first (quick references)
- Backend entry: `backend/src/server.ts`
- Auth controller: `backend/src/controllers/authController.ts`
- JWT helpers: `backend/src/utils/jwt.ts`
- Temp model: `backend/src/models/TempUser.ts`
- User model: `backend/src/models/User.ts`
- Email: `backend/src/utils/sendEmail.ts`
- Frontend auth service: `frontend/src/app/core/services/auth.service.ts`
- Frontend interceptor: `frontend/src/app/core/interceptors/auth.interceptor.ts`
- Frontend guard: `frontend/src/app/core/guards/auth.guard.ts`

## When editing or adding code
- Preserve API contracts — changes to request/response shapes must be coordinated across backend and frontend files listed above.
- Follow existing async/await + try/catch error style in controllers.
- Use the centralized error handler — do not return inconsistent error JSON shapes.
- For backend changes, run `npm run dev` and exercise endpoints (Postman/curl). For frontend changes, run `ng serve` and verify requests are sent with the `Authorization` header when logged in.

## Tests & CI notes
- There are no CI configs discovered. Unit tests are run via `ng test` on the frontend. Backend currently has no tests; prefer small integration checks when changing auth or DB logic.

If anything in this summary is unclear or you want me to expand a section (for example, add endpoint examples or common PR checklists), tell me which part to iterate on.
