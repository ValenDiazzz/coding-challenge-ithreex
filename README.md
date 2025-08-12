# Employees Management App

## Overview
This project is a full-stack application for managing employees, consisting of a **backend API** built with Node.js, Express, and PostgreSQL, and a **frontend** built with React and Vite. The backend exposes endpoints to retrieve and manage employee data, while the frontend provides a user interface to visualize and interact with the data.

## Project Structure
```
empleados-app/
│
├── backend/           # Backend API
│   ├── server.js      # Main application entry point
│   ├── routes/        # API route definitions
│   ├── db/            # Database connection and queries
│   ├── .env           # Environment variables for database connection
│   ├── package.json   # Backend dependencies and scripts
│
├── frontend/          # Frontend application
│   ├── src/           # React components and logic
│   ├── public/        # Static assets
│   ├── vite.config.js # Vite configuration
│   ├── package.json   # Frontend dependencies and scripts
│
├── sql/               # SQL scripts for database initialization
│   └── db.sql         # Creates the database schema and inserts sample data
│
└── .gitignore         # Files to be ignored by Git
```

## Backend
### Tech Stack
- **Node.js** with **Express** for building the REST API.
- **PostgreSQL** for persistent data storage.
- **pg** library for database interaction.
- **dotenv** for environment variable management.
- **cors** for Cross-Origin Resource Sharing configuration.

### Setup Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   PGHOST=localhost
   PGUSER=your_username
   PGPASSWORD=your_password
   PGDATABASE=your_database
   PGPORT=5432
   PORT=5000
   ```
4. Initialize the database:
   ```bash
   psql -U postgres -f ../sql/db.sql
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
6. The API will be available at `http://127.0.0.1:5000`.

### API Endpoints
- `GET /` – Health check.
- `GET /health` – Health check including DB connectivity.
- `GET /employees` – Retrieve the list of employees.
- `GET /employees/:id` – Retrieve details for a specific employee.

### Backend Testing
The backend uses **Jest** and **Supertest** for testing API endpoints.
Run tests from the backend directory:
```bash
npm test
```

## Frontend
### Tech Stack
- **React** for UI components.
- **Vite** for fast build and development.
- **Axios** for API calls.
- **@testing-library/react** and **Vitest** for frontend testing.

### Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file to define the backend API URL:
   ```
   VITE_API_URL=http://127.0.0.1:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the browser at the URL provided by Vite (e.g., `http://localhost:5173`).

### Frontend Testing
Run tests from the frontend directory:
```bash
npm test
```

## Database
The `sql/db.sql` script:
- Creates the `employees` table.
- Inserts sample employee data.
- Can be run with:
  ```bash
  psql -U postgres -f sql/db.sql
  ```

## Running the Full Application
1. Start the backend server (`npm run dev` inside `/backend`).
2. Start the frontend development server (`npm run dev` inside `/frontend`).
3. Ensure PostgreSQL is running and accessible.
4. Access the frontend in the browser.

## Notes
- The backend is bound to `127.0.0.1` for local development.
- Tests are available for both backend and frontend.