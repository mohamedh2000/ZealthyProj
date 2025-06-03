# Zealthy - User Onboarding Application

Demo Link: https://zealthy-app-rxqwc.ondigitalocean.app/

A full-stack application for managing user onboarding with customizable steps and admin configuration.

## Features

- **User Onboarding Wizard**
  - Multi-step form with progress persistence
  - Email and password validation
  - Customizable form fields (About Me, Address, Birthdate)
  - Real-time validation and error messages
  - Progress saved in localStorage

- **Admin Configuration**
  - Configure which fields appear on each step
  - Move components between steps
  - Real-time validation of configuration
  - Accessible at `/admin`

- **Data Table**
  - View all user submissions
  - Accessible at `/data`

## Tech Stack

- **Frontend**
  - React
  - React Router
  - Tailwind CSS
  - Axios

- **Backend**
  - Express.js
  - PostgreSQL
  - Node.js

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# SSL Configuration (for managed databases)
NODE_TLS_REJECT_UNAUTHORIZED=0

# API Configuration
PORT=3001
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd zealthy
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up the database:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  about_me TEXT,
  birthdate DATE,
  street_address VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  zip VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_config (
  id SERIAL PRIMARY KEY,
  page2 TEXT[] DEFAULT ARRAY['aboutMe', 'birthdate'],
  page3 TEXT[] DEFAULT ARRAY['address'],
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin config
INSERT INTO admin_config (page2, page3) 
VALUES (ARRAY['aboutMe', 'birthdate'], ARRAY['address']);
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development

- Frontend code is in the `client/src` directory
- Backend code is in the `backend/src` directory
- API routes are in `backend/src/routes`
- React components are in `client/src/components`

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users

### Admin Config
- `GET /api/admin/config` - Get current configuration
- `POST /api/admin/config` - Update configuration

## Testing

Run the test suite:
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd backend
npm test
```

## Deployment

This is deployed on the DigitalOcean App Platform
Demo Link: https://zealthy-app-rxqwc.ondigitalocean.app/

## License

This project is licensed under the MIT License - see the LICENSE file for details. 