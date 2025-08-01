# EnergyExe Client Integration Guide

This guide helps you integrate the EnergyExe React client into your existing GitHub repository.

## Repository Structure

Your repository should be organized like this:

```
your-energyexe-repo/
├── backend/                    # Your FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── client/                     # This React frontend (this folder)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── docker-compose.yml          # Optional: Docker setup
├── README.md                   # Main repository README
└── .gitignore                  # Root gitignore
```

## Integration Steps

### 1. Copy Client Code

Copy the entire contents of this `client/` folder to your repository's `client/` directory:

```bash
# In your main repository
git clone <your-repo-url>
cd your-energyexe-repo

# Copy the client folder (replace with actual path)
cp -r /path/to/this/client ./client
```

### 2. Update Root .gitignore

Add these entries to your root `.gitignore`:

```gitignore
# Client dependencies and build
client/node_modules/
client/dist/
client/.env.local
client/.env.production

# IDE and OS files
.vscode/
.DS_Store
*.log
```

### 3. Update Root README.md

Add client information to your main README:

```markdown
# EnergyExe Project

Full-stack project management application with FastAPI backend and React frontend.

## Project Structure

- `backend/` - FastAPI backend with PostgreSQL
- `client/` - React TypeScript frontend with Vite

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Development

- Backend runs on: http://localhost:8000
- Frontend runs on: http://localhost:5173
- API Documentation: http://localhost:8000/docs
```

### 4. Environment Configuration

Create environment files:

**client/.env** (for development):
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**client/.env.production** (for production):
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

### 5. Update Backend CORS

Make sure your FastAPI backend allows the frontend origin:

```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative dev port
        "https://your-frontend-domain.com",  # Production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. Docker Setup (Optional)

Create `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/energyexe
    depends_on:
      - db

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api/v1

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=energyexe
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Create `client/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### 7. Package.json Scripts

Add these scripts to your root `package.json`:

```json
{
  "name": "energyexe-fullstack",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && uvicorn app.main:app --reload",
    "dev:frontend": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "install:all": "cd backend && pip install -r requirements.txt && cd ../client && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

### 8. GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd backend
          pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd client
          npm ci
      - name: Build
        run: |
          cd client
          npm run build
      - name: Run tests
        run: |
          cd client
          npm run test
```

## Development Workflow

1. **Start Development**:
   ```bash
   # Terminal 1: Backend
   cd backend
   uvicorn app.main:app --reload

   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

2. **Make Changes**:
   - Backend changes in `backend/`
   - Frontend changes in `client/src/`

3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature-branch
   ```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/dist`
4. Add environment variable: `VITE_API_BASE_URL`

### Backend (Railway/Heroku)
1. Connect your repository
2. Set root directory: `backend`
3. Add environment variables for database, etc.

## Troubleshooting

### Common Issues

1. **CORS Error**: Update backend CORS settings
2. **API Connection**: Check `VITE_API_BASE_URL` in `.env`
3. **Build Errors**: Run `npm install` in client directory
4. **Route Issues**: Run `npm run routes:generate` in client

### Development Tips

- Use the browser dev tools for debugging
- Check the Network tab for API calls
- Use React DevTools for component debugging
- Check the console for any errors

## Support

For issues specific to:
- **Frontend**: Check `client/README.md`
- **Integration**: Review this guide
- **Backend**: Check your backend documentation