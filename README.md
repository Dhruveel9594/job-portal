# TalentHub - Job Portal Application

A modern, full-stack job portal application with separate candidate and recruiter interfaces.

## 🏗️ Architecture

- **Backend**: Node.js + Express REST API
- **Frontend**: React SPA with modern UI
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)

## 🚀 Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

1. **Clone or navigate to the project directory**
   ```bash
   cd /path/to/project
   ```

2. **Build and start all services**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:4000
   - API Test: http://localhost:4000/api/test

4. **View logs**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

5. **Stop the application**
   ```bash
   docker-compose down
   ```

6. **Stop and remove volumes**
   ```bash
   docker-compose down -v
   ```

### Option 2: Using Docker directly

**Build Backend:**
```bash
cd backend
docker build -t talenthub-backend .
docker run -d -p 4000:4000 --name backend talenthub-backend
```

**Build Frontend:**
```bash
cd frontend
docker build -t talenthub-frontend .
docker run -d -p 80:80 --name frontend talenthub-frontend
```

## 🔧 Development Setup (Without Docker)

### Backend
```bash
cd backend
npm install
node index.js
```

### Frontend
Simply open `frontend.html` in your browser.

## 📊 Demo Credentials

### Candidate Account
- Email: `alice@example.com`
- Password: `password123`

### Recruiter Account
- Email: `recruiter@techcorp.com`
- Password: `password123`

## 🎯 Features

### For Candidates
- ✅ Browse job listings
- ✅ View job details
- ✅ Apply for jobs with one click
- ✅ Modern, responsive UI

### For Recruiters
- ✅ Post new jobs
- ✅ View applications
- ✅ Track statistics (jobs, applications, candidates)
- ✅ Dashboard with analytics

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job (recruiter only)

### Applications
- `POST /api/apply` - Apply for a job (candidate only)
- `GET /api/applications` - Get applications (recruiter only)

### Other
- `GET /api/me` - Get current user
- `GET /api/job-stats` - Get job statistics (recruiter only)
- `GET /api/test` - Health check

## 🐳 Docker Commands Cheat Sheet

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh

# Remove all containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

## 🔍 Troubleshooting

### Port already in use
If port 80 or 4000 is already in use:

**Option 1:** Stop the conflicting service
```bash
# On Linux/Mac
sudo lsof -i :80
sudo lsof -i :4000

# On Windows
netstat -ano | findstr :80
netstat -ano | findstr :4000
```

**Option 2:** Change ports in `docker-compose.yml`
```yaml
services:
  backend:
    ports:
      - "4001:4000"  # Change 4000 to 4001
  frontend:
    ports:
      - "8080:80"    # Change 80 to 8080
```

### CORS Issues
The backend already has CORS enabled. If you still face issues, make sure:
- Backend is running on port 4000
- Frontend is accessing http://localhost:4000/api

### Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up -d --build
```

## 📁 Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── index.js
│   ├── package.json
│   └── uploads/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── frontend.html
├── docker-compose.yml
└── README.md
```

## 🔐 Security Notes

⚠️ **For Production:**
- Change JWT_SECRET in docker-compose.yml
- Use environment variables for sensitive data
- Add proper authentication and validation
- Use HTTPS
- Implement rate limiting
- Add database for persistent storage

## 📝 Environment Variables

You can customize the backend by setting environment variables in `docker-compose.yml`:

```yaml
environment:
  - PORT=4000
  - JWT_SECRET=your-super-secret-jwt-key
  - NODE_ENV=production
```

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.