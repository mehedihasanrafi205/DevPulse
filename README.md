# DevPulse

**Internal Tech Issue & Feature Tracker**
*A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.*

## Live URL
- **Production API**: `[https://dev-pulse-alpha-smoky.vercel.app]`

## Features
- **User Authentication**: Secure signup and login functionality using JWT and bcrypt.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `contributor` and `maintainer` roles.
- **Issue Tracking**: Create, view, update, and delete bug reports and feature requests.
- **Advanced Filtering**: Sort and filter issues by type (`bug`, `feature_request`) and status (`open`, `in_progress`, `resolved`).
- **Raw SQL Implementation**: High-performance database operations utilizing raw SQL queries without ORMs.

## Tech Stack
- **Runtime**: Node.js (LTS runtime)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Security**: bcrypt, jsonwebtoken

## Database Schema Summary
The application uses two primary tables:

### `users`
Stores user credentials and roles.
- Fields: `id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`.

### `issues`
Stores bug reports and feature requests, linked to the reporter.
- Fields: `id`, `title`, `description`, `type`, `status`, `reporter_id`, `created_at`, `updated_at`.

## Setup Steps

### Prerequisites
- Node.js (v24.x LTS or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd DevPulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## API Endpoint List

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT
- `POST /api/auth/refresh` - Refresh access token

### Issues
- `POST /api/issues` - Create a new issue (Requires Auth)
- `GET /api/issues` - Retrieve all issues with optional filtering (Public)
- `GET /api/issues/:id` - Retrieve a single issue by ID (Public)
- `PATCH /api/issues/:id` - Update an issue (Requires Auth & Permissions)
- `DELETE /api/issues/:id` - Delete an issue (Requires Maintainer Auth)

---
*Developed for B7A2 Mission 2: Be a Node Express Expert*
