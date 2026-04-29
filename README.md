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

```
.
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Node.js + Express backend
│   └── server/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/
│       ├── utils/
│       ├── index.js
│       └── package.json
│
├── package.json          # Root package.json for coordination
└── README.md
```

## Setup

### Install all dependencies

```bash
npm run install:all
```

This will install:
- Root dependencies (concurrently for running both servers)
- Frontend dependencies
- Backend dependencies

### Configure environment variables

1. Frontend (.env in frontend folder):

**Local Development:**
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

**Production:**
```bash
VITE_API_BASE_URL=https://nyay2kriya.onrender.com/api
```

2. Backend (backend/server/.env):
```bash
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,https://nyay2-kriya.vercel.app,https://nyay2kriya.onrender.com
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
OCR_SPACE_API_KEY=your_key_here
```

### Running the project

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Deployment

### Frontend - Vercel
- Deployed at: **https://nyay2-kriya.vercel.app**
- Root Directory: `frontend`
- Build command: `npm run build`
- Environment variables: `VITE_API_BASE_URL=https://nyay2kriya.onrender.com/api`

### Backend - Render
- Deployed at: **https://nyay2kriya.onrender.com**
- Root Directory: `backend`
- Build command: `cd server && npm ci`
- Start command: `cd server && npm start`
- Environment variables:
  - `PORT=5000`
  - `CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,https://nyay2-kriya.vercel.app,https://nyay2kriya.onrender.com`
  - `GROQ_API_KEY=your_key_here`
  - `GROQ_MODEL=llama-3.3-70b-versatile`
  - `OCR_SPACE_API_KEY=your_key_here`
  - `NODE_ENV=production`

**For detailed backend deployment instructions, see [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md)**

### CORS Configuration
Both development and production URLs are allowed:
- Local: `http://localhost:5173`, `http://127.0.0.1:5173`
- Production: `https://nyay2-kriya.vercel.app`, `https://nyay2kriya.onrender.com`

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
