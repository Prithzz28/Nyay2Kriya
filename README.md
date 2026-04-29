# Nyay2Kriya - Judgment Intelligence System

Production-ready web application for judgment intake, legal data structuring, human review, operational action planning, and approved-case monitoring.

## Architecture

- Frontend: React + Vite
- Backend: Node.js + Express
- AI Provider: Groq, called only from backend API routes
- State: Zustand (cases, extraction, review, action plans, UI state)

Security model:
- Groq API key is read only from backend environment variables.
- Frontend never calls Groq directly.
- Frontend never stores secrets in browser storage or app state.

## Project Structure

Frontend:
- src/components/layout
- src/components/ui
- src/components/upload
- src/components/review
- src/components/actionplan
- src/components/dashboard
- src/pages
- src/hooks
- src/services
- src/store
- src/utils
- src/styles

Backend:
- server/routes
- server/controllers
- server/services
- server/middleware
- server/utils
- server/index.js

## Setup

1. Install root dependencies

```bash
npm install
```

2. Install backend dependencies

```bash
cd server
npm install
cd ..
```

3. Configure environment variables

```bash
copy .env.example .env
copy server\.env.example server\.env
```

Update server env file:
- GROQ_API_KEY=your_key_here
- GROQ_MODEL=llama-3.3-70b-versatile

4. Start backend

```bash
npm run dev:server
```

5. Start frontend in a second terminal

```bash
npm run dev:client
```

Frontend: http://localhost:5173
Backend: http://localhost:4000

## API Endpoints

- GET /api/health
- POST /api/extract
	- body: { judgmentText: string, demoMode?: boolean }
- POST /api/action-plan
	- body: { reviewedCase: object, demoMode?: boolean }

All endpoints return consistent response envelope:

```json
{
	"success": true,
	"data": {},
	"error": null
}
```

Error envelope:

```json
{
	"success": false,
	"data": null,
	"error": {
		"message": "...",
		"details": "..."
	}
}
```

## Feature Flow

1. Upload page:
- Drag-drop PDF using react-dropzone
- PDF text extraction using pdfjs-dist
- Demo mode with realistic Indian High Court land acquisition sample

2. AI extraction:
- Frontend sends extracted text to backend /api/extract
- Backend prompts Groq for strict JSON
- JSON parse safety with fallback extraction of object payload

3. Review page:
- Editable fields for human validation
- Add/remove directions
- Reviewer notes
- Save draft / reject / approve

4. Action plan page:
- Generate plan via backend /api/action-plan
- Immediate actions, compliance steps, appeal recommendation, risk summary
- Checklist progress tracking

5. Dashboard:
- Approved cases only
- Search, urgency, date filters
- Expandable rows
- CSV export

## Demo Mode

Demo mode runs end-to-end without uploading a PDF by using a realistic sample judgment text.

If GROQ_API_KEY is not configured, backend supports deterministic fallback only when demoMode is true, so UI and workflows remain testable in local development.

## Production Notes

- Configure strict CORS origin in server env.
- Add persistent database and authentication for multi-user deployment.
- Add audit logging and role-based access for government operations.
