# Backend Deployment on Render

## Prerequisites
- Node.js installed locally
- Git repository pushed to GitHub
- Render account

## Deployment Steps

1. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configuration Settings**
   - **Name**: `nyay2kriya-backend`
   - **Runtime**: Node
   - **Root Directory**: `backend`
   - **Plan**: Free (or paid for better performance)
   - Render will automatically use `Procfile` for build/start commands

3. **Environment Variables**
   Set the following in Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173,https://nyay2-kriya.vercel.app,https://nyay2kriya.onrender.com
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   OCR_SPACE_API_KEY=your_ocr_space_api_key_here
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy when you push to GitHub

## Troubleshooting

- **Status 127 Error**: Usually means command not found. Ensure the build/start commands are correct.
- **Module not found**: Make sure dependencies are properly installed. The `postinstall` script in `backend/package.json` handles this.
- **CORS errors**: Check that frontend URL is in `CORS_ORIGIN` environment variable.
- **Connection timeout**: Backend might still be starting. Render free tier services sleep after 15 minutes of inactivity.

## Testing the Deployment

```bash
# Test health endpoint
curl https://nyay2kriya.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "data": { "status": "ok" },
  "error": null
}
```
