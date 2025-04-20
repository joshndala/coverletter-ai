# Cover Letter AI

A powerful application that helps job seekers create personalized, AI-generated cover letters tailored to specific job descriptions and companies.

## Overview

Cover Letter AI is a full-stack application that leverages artificial intelligence to generate professional cover letters based on your work experience, skills, and the specific job you're applying for. The application uses advanced language models to create compelling narratives that highlight your relevant qualifications and connect them to job requirements.

## Features

### Current Features

- **AI-Powered Cover Letter Generation**: Create customized cover letters in seconds using AWS Bedrock's LLM technology
- **Experience Management**: Add, edit, and organize your work experiences with detailed descriptions and achievements
- **Skills Tracking**: Maintain a comprehensive list of your professional skills
- **Education & Certifications**: Document your educational background and professional certifications
- **Cover Letter Library**: Store and manage multiple cover letters for different job applications
- **User Authentication**: Secure login and account management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Coming Soon

- **Company Information Search**: A web tool that will search and provide detailed information about companies, including:
  - Company overview and mission
  - Culture and values
  - Recent news and developments
  - Key products and services
  - Leadership team
  - This information will be incorporated into your cover letters to demonstrate genuine interest and knowledge about the company

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **AWS Bedrock**: LLM service for AI-powered content generation
- **PostgreSQL**: Relational database
- **JWT Authentication**: Secure user authentication

### Frontend
- **Next.js**: React framework for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and state management

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL
- AWS account with Bedrock access
- Docker and Docker Compose (optional, for containerized setup)

### Installation

#### Option 1: Docker Setup (Recommended)

The quickest way to get started is using Docker:

1. Clone the repository
```bash
git clone https://github.com/yourusername/coverletter-ai.git
cd coverletter-ai
```

2. Create environment files
```bash
# Create .env files for both backend and frontend
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Start the application with Docker Compose
```bash
docker-compose up -d
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

#### Option 2: Manual Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/coverletter-ai.git
cd coverletter-ai
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend
```bash
cd frontend
npm install
```

4. Configure environment variables
Create `.env` files in both backend and frontend directories with the necessary configuration.

5. Start the development servers
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

## Project Structure

```
coverletter-ai/
├── backend/
│   ├── models/         # Database models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── routers/        # API endpoints
│   ├── tests/          # Test suite
│   └── main.py         # Application entry point
├── frontend/
│   ├── app/            # Next.js app directory
│   ├── components/     # Reusable UI components
│   ├── lib/            # Utility functions
│   └── public/         # Static assets
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
