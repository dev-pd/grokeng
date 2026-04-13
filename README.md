# 🚀 Grok SDR System

An AI-powered Sales Development Representative system that leverages Grok AI to automatically score leads, generate personalized outreach messages, and provide intelligent insights for sales teams.

## ✅ Updated setup notes (after cleanup)

The project now uses **env files** (no hardcoded secrets in code).

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

- **Root `.env`**: `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`
- **Backend `backend/.env`**: `GROK_API_KEY`, `MYSQL_PASSWORD` (required)
- **Frontend `frontend/.env`**: `VITE_API_URL` (required in production builds)

## ✨ Features

- **🤖 AI Lead Scoring**: Automatic lead qualification using Grok AI
- **📧 Message Generation**: Personalized email, LinkedIn, and call scripts
- **📊 Advanced Analytics**: Score distribution, lead insights, and performance metrics
- **🎯 Smart Filtering**: Search and filter leads by multiple criteria
- **🌍 Edge Case Handling**: Robust support for international leads, missing data, and suspicious entries
- **📱 Modern UI**: Responsive design with component-based architecture
- **🐳 Docker Ready**: Fully containerized for easy deployment

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend │    │   FastAPI Backend │    │   Grok AI API   │
│   (TypeScript)   │◄──►│    (Python)      │◄──►│   (X.AI)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         │              ┌─────────────────┐
         └─────────────►│   MySQL 8.0     │
                        │   (Database)    │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Grok API Key](https://console.x.ai/) from X.AI

### 1. Clone and Setup

```bash
# Clone the repository
git clone git@github.com:dev-pd/grokeng.git
cd grokeng

# Set up environment variables
cp .env.example .env
# Edit .env with your Grok API key
```

### 2. Start the Application

```bash
# Navigate to project directory
cd ~/Desktop/grokeng/grokeng

# Start all services (builds automatically)
docker compose up --build -d

# Wait for services to be ready (about 30 seconds)
docker compose ps

# Load sample data (21 leads with edge cases)
docker compose exec backend python create_tables.py

# Open your application
open http://localhost:5173
```

### 3. Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MySQL**: localhost:3307 (user: `root`, password: `xxxx`)

## 📊 Sample Data

The system includes 21 comprehensive test leads covering various scenarios:

### High-Quality Leads (Score 80-100)

- **Alexandra Rodriguez** - CTO at TechGiant Corp ($100K+ budget)
- **David Kim** - VP Sales at UnicornStartup (Series B, urgent need)

### Medium-Quality Leads (Score 50-79)

- **Jennifer Smith** - Sales Manager exploring CRM options
- **Robert Johnson** - Managing Partner at consulting firm

### Low-Quality Leads (Score 0-49)

- **Student Researcher** - Academic research project
- **Mark Thompson** - Freelancer with minimal budget

### Edge Cases & Testing Scenarios

- **International Leads**: Spanish and Chinese prospects
- **Missing Data**: Empty names, no company information
- **Suspicious Entries**: Potential fraud attempts
- **Competitor Intelligence**: Direct competitor employees
- **Industry-Specific**: Government, healthcare, non-profit
- **Timing Issues**: Future planning vs urgent needs

## 🔧 Development

### Local Development (without Docker)

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Docker Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f              # All services
docker compose logs backend         # Backend only
docker compose logs frontend        # Frontend only

# Rebuild after changes
docker compose up --build -d        # Rebuild all
docker compose build backend        # Rebuild backend only
docker compose build frontend       # Rebuild frontend only

# Stop services
docker compose down                  # Stop all
docker compose down -v              # Stop and remove data
```

### Database Operations

```bash
# Access MySQL
docker compose exec mysql mysql -u root -prootroot grok_sdr

# Backup database
docker compose exec mysql mysqldump -u root -prootroot grok_sdr > backup.sql

# Restore database
docker compose exec -i mysql mysql -u root -prootroot grok_sdr < backup.sql

# Reset database (reload sample data)
docker compose exec backend python create_tables.py
```

## 🤖 Grok AI Integration

### Available Endpoints

- `POST /api/v1/grok/analyze-lead/{lead_id}` - Comprehensive lead analysis
- `POST /api/v1/grok/generate-message/{lead_id}` - Personalized message generation
- `POST /api/v1/grok/qualify-lead/{lead_id}` - Auto-qualification
- `GET /api/v1/grok/test-connection` - API health check

### Configuration

Update your `.env` file with your Grok API credentials:

```bash
GROK_API_KEY=your-actual-api-key-here
GROK_API_URL=https://api.x.ai/v1
GROK_MODEL=grok-4-latest
```

## 📱 Frontend Components

### Component Structure

```
components/
├── Dashboard.tsx                 # Main dashboard
├── dashboard/
│   ├── DashboardHeader.tsx      # Welcome section
│   ├── StatsGrid.tsx            # Metrics cards
│   ├── RecentLeads.tsx          # Lead previews
│   ├── QuickActions.tsx         # Action buttons
│   └── SystemStatus.tsx         # Health indicators
├── leads/
│   ├── LeadsPage.tsx            # Main leads management
│   ├── LeadsTable.tsx           # Data table
│   ├── LeadRow.tsx              # Individual row
│   ├── LeadsFilters.tsx         # Search/filter controls
│   ├── AddLeadModal.tsx         # Lead creation
│   ├── AnalysisModal.tsx        # AI analysis display
│   └── MessageModal.tsx         # Generated messages
└── common/
    ├── ErrorAlert.tsx           # Error handling
    └── Pagination.tsx           # Table pagination
```

### Key Features

- **Responsive Design**: Works on mobile and desktop
- **Edge Case Handling**: Graceful handling of missing/invalid data
- **Real-time Updates**: Live feedback during AI processing
- **Modern UX**: Loading states, hover effects, smooth transitions

## 🛠️ Backend API

### Tech Stack

- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM with async support
- **MySQL**: Persistent data storage
- **Pydantic**: Data validation and serialization
- **Grok AI**: Advanced language model integration

### API Endpoints

#### Lead Management

- `GET /api/v1/leads/` - List leads with pagination
- `POST /api/v1/leads/` - Create new lead
- `GET /api/v1/leads/{id}` - Get lead details
- `PUT /api/v1/leads/{id}` - Update lead
- `DELETE /api/v1/leads/{id}` - Delete lead
- `GET /api/v1/leads/stats/summary` - Dashboard statistics

#### AI Integration

- `POST /api/v1/grok/analyze-lead/{id}` - AI analysis
- `POST /api/v1/grok/generate-message/{id}` - Message generation
- `POST /api/v1/grok/qualify-lead/{id}` - Auto-qualification
- `GET /api/v1/grok/test-connection` - Health check

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts

```bash
# If port 3306 is in use
Error: port 3306 already in use
# Solution: MySQL uses port 3307 externally, no action needed
```

#### Frontend Build Errors

```bash
# TypeScript errors during build
# Solution: Uses npx vite build to skip TS errors
```

#### API Connection Issues

```bash
# Test backend directly
curl http://localhost:8000/health

# Test through frontend proxy
curl http://localhost:5173/api/v1/leads/

# If different responses, rebuild frontend:
docker compose build frontend --no-cache
```

#### Database Connection

```bash
# Test database connection
docker compose exec backend python -c "
from app.core.database import engine
import asyncio

async def test():
    async with engine.connect() as conn:
        print('DB connected!')

asyncio.run(test())
"
```

### Logs and Debugging

```bash
# View all logs
docker compose logs -f

# Service-specific logs
docker compose logs backend -f
docker compose logs mysql -f
docker compose logs frontend -f

# Check service health
docker compose ps
docker compose exec backend curl http://localhost:8000/health
```

### Reset Everything

```bash
# Complete reset (removes all data)
docker compose down -v
docker system prune -f
docker compose up --build -d
docker compose exec backend python create_tables.py
```

## 🚦 Environment Variables

### Backend (.env)

```bash
# Database
MYSQL_HOST=127.0.0.1          # For local development
MYSQL_PORT=3306
MYSQL_DATABASE=grok_sdr
MYSQL_USER=root
MYSQL_PASSWORD=xxxx

# Grok AI
GROK_API_KEY=your-api-key-here
GROK_API_URL=https://api.x.ai/v1
GROK_MODEL=grok-4-latest

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Grok SDR System
DEBUG=True
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:8000    # For local development
VITE_APP_NAME=Grok SDR System
```

## 🧪 Testing the AI Features

### 1. Lead Scoring

- Click "Score" on any lead
- Watch the AI analyze and assign a 0-100 score
- High scores (80+): CTOs, VPs with budget
- Low scores (<50): Students, competitors

### 2. Lead Analysis

- Click "Analyze" for detailed insights
- View scoring breakdown by category
- See AI-generated recommendations
- Review risk factors and next steps

### 3. Message Generation

- Click "Message" to generate personalized outreach
- Choose between email, LinkedIn, call scripts
- Copy and customize the AI-generated content
- Generate different message types for the same lead

### 4. Auto-Qualification

- Click "Qualify" to let AI determine lead status
- Updates lead status automatically
- Provides qualification reasoning

## 📈 Performance & Scaling

### Production Considerations

- **Grok API Rate Limits**: Monitor usage and implement caching
- **Database Indexing**: Optimized for common queries
- **Frontend Caching**: Static assets cached with nginx
- **Health Checks**: All services include health monitoring

### Future Enhancements

- Redis caching for Grok API responses
- User authentication and role-based access
- Email integration for automated outreach
- Advanced analytics and reporting
- Webhook integrations with CRM systems

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [logs](#logs-and-debugging)
3. Open an issue with error details and logs

---

Built with ❤️ using Grok AI, FastAPI, React, and Docker
