# Xelon Issue Tracker

Xelon Issue Tracker is a full-stack internal issue tracking system built with React, Node.js, Express, and MongoDB. Users report technical issues, admins review and assign them, and developers update progress through comments and status changes.

## Problem Statement

Internal technical issues need a structured workflow so they are not lost across emails or informal messages. This application gives Xelon a central system for reporting, assignment, developer updates, and dashboard tracking.

## Features

- User registration, login, logout, and JWT-based sessions.
- Secure password reset flow using expiring reset tokens and SMTP email configuration.
- Role-based dashboards for users, admins, and developers.
- Issue creation with category, priority, generated issue ID, and initial `OPEN` status.
- Admin issue assignment to active developers only.
- Status workflow: `OPEN` -> `IN_PROGRESS` -> `CLOSED`.
- Comments on issue details for permitted users.
- Search and filters for status, category, priority, and developer.
- Category management by admins.
- Backend-enforced authorization and centralized error handling.
- Responsive React dashboard UI with Tailwind CSS.

## User Roles

`user`

Regular users can register, log in, create issues, view their own issues, comment, and track progress.

`admin`

Admins are created by the seed script. They can view all issues, assign developers, manage categories, view users/developers, and monitor organization-wide statistics.

`developer`

Developers are created by the seed script. They can view assigned issues, comment, move work to `IN_PROGRESS`, and close issues.

## Workflow

```text
Issue Created -> Admin Review -> Developer Assignment -> In Progress -> Closed
```

## Architecture

```text
frontend/ React + Vite + Tailwind + Axios
backend/  Express REST API + JWT + Mongoose
MongoDB   Users, issues, comments, categories
```

Backend requests follow this structure:

```text
Routes -> Middleware -> Controller -> Service -> Model -> MongoDB
```

## Tech Stack

- React.js, Vite, React Router, Axios, Tailwind CSS
- Node.js, Express.js, Mongoose
- MongoDB or MongoDB Atlas
- JWT, bcryptjs, Helmet, CORS, express-rate-limit
- Nodemailer for password reset email

## Folder Structure

```text
frontend/              React application
backend/               Express API
backend/src/models     Mongoose schemas
backend/src/services   Business logic and authorization checks
backend/src/controllers HTTP request handlers
backend/src/routes     API route definitions
backend/src/seed       Admin/developer/category seeding
```

## Database Structure

- `User`: first name, last name, email, Indian phone number, password hash, role, active flag.
- `Issue`: issue ID, title, description, category, priority, status, reporter, assigned developer.
- `Comment`: issue, user, text, timestamps.
- `Category`: category name, creator, active flag.

## API Documentation

All protected routes require:

```http
Authorization: Bearer <jwt>
```

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a regular user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Protected | Load current profile |
| POST | `/api/auth/forgot-password` | Public | Request reset email |
| POST | `/api/auth/reset-password` | Public | Reset password with token |

Register body:

```json
{
  "firstName": "Manish",
  "lastName": "Kunthoor",
  "email": "manish@example.com",
  "phone": "+919876543210",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

### Issues

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/api/issues` | user/admin/developer | List permitted issues |
| GET | `/api/issues/:id` | user/admin/developer | View permitted issue |
| POST | `/api/issues` | user | Create issue |
| PUT | `/api/issues/:id` | user/admin/developer | Update fields permitted by role |
| PUT | `/api/issues/:id/assign` | admin | Assign active developer |
| DELETE | `/api/issues/:id` | admin/user where permitted | Delete issue |

Create issue body:

```json
{
  "title": "Payment failed",
  "category": "CATEGORY_OBJECT_ID",
  "priority": "HIGH",
  "description": "Payment gateway fails after OTP."
}
```

### Comments

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/api/issues/:issueId/comments` | permitted issue users | List comments |
| POST | `/api/issues/:issueId/comments` | permitted issue users | Add comment |
| DELETE | `/api/comments/:id` | admin/comment author | Delete comment |

### Users, Categories, Dashboard

| Method | Endpoint | Roles | Description |
| --- | --- | --- | --- |
| GET | `/api/users` | admin | List regular users |
| GET | `/api/users/developers` | admin | List active developers |
| GET | `/api/categories` | protected | List active categories |
| POST | `/api/categories` | admin | Create category |
| PUT | `/api/categories/:id` | admin | Update category |
| DELETE | `/api/categories/:id` | admin | Deactivate category |
| GET | `/api/dashboard/user` | user | User dashboard |
| GET | `/api/dashboard/developer` | developer | Developer dashboard |
| GET | `/api/dashboard/admin` | admin | Admin dashboard |

Responses use:

```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Issue not found"
}
```

## Environment Variables

### Backend

Copy `backend/.env.example` to `backend/.env`.

| Variable | Description |
| --- | --- |
| `PORT` | API port, default `5000` |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB or MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, default `7d` |
| `CLIENT_URL` | Frontend URL for CORS and reset links |
| `SMTP_HOST` | SMTP host for reset emails |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `SMTP_FROM` | Email sender |
| `SEED_ADMIN_EMAIL` | Admin email created by seed |
| `SEED_ADMIN_PASSWORD` | Admin password used by seed |
| `SEED_DEVELOPER_PASSWORD` | Password used by seeded developers |

### Frontend

Copy `frontend/.env.example` to `frontend/.env`.

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL, for example `http://localhost:5000/api` |

## Local Setup

```bash
git clone <repository-url>
cd xelon-issue-tracker
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill `backend/.env` with `MONGO_URI`, `JWT_SECRET`, seed passwords, and optional SMTP settings.

## Running Locally

Seed the required admin, developer accounts, and initial categories:

```bash
npm run seed
```

Start both apps:

```bash
npm run dev
```

Or start separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Seed Accounts

The seed script creates the following demo accounts:

- Admin:
  - Email: `admin@xelon.local`
  - Password: `admin123`
- Developers:
  - `developer1@xelon.local`
  - `developer2@xelon.local`
  - `developer3@xelon.local`
  - `developer4@xelon.local`
  - Password for all developers: `developer123`
- Initial categories: Web Development, App Development, Payment.

These are demo credentials for evaluation. Passwords are hashed before storage. Do not use them for production, and do not commit real `.env` files.

## Testing

Suggested manual test flow:

1. Run MongoDB or configure MongoDB Atlas.
2. Start backend and frontend.
3. Seed admin/developer accounts.
4. Register a regular user using `+91XXXXXXXXXX` phone format.
5. Login as user and create an issue.
6. Login as admin and assign a developer.
7. Login as the assigned developer and update status to `IN_PROGRESS`, then `CLOSED`.
8. Add comments from user, admin, and developer.
9. Verify dashboards update from database counts.
10. Test unauthorized access by trying admin routes as user/developer.

Production frontend build:

```bash
npm run build
```

## Deployment

Target architecture:

```text
React Frontend -> Frontend Hosting -> Express REST API -> Backend Hosting -> MongoDB Atlas
```

Frontend hosting options:

- Vercel, Netlify, or any static hosting provider.
- Build command: `npm run build --workspace frontend`
- Output directory: `frontend/dist`
- Set `VITE_API_URL` to the deployed backend API URL.

Backend hosting options:

- Render, Railway, Fly.io, or a Node-capable server.
- Start command: `npm run start --workspace backend`
- Set all backend environment variables in the hosting dashboard.
- Configure `CLIENT_URL` to the deployed frontend URL for CORS and reset links.

MongoDB Atlas:

- Create a cluster.
- Add a database user.
- Allow the backend host IP or a controlled network range.
- Set `MONGO_URI` in backend hosting environment variables.

Password reset email:

- Configure SMTP variables in production.
- Without SMTP, reset links are logged in development only and email delivery is skipped.

Deployment has not been completed until the deployed frontend, backend, MongoDB connection, CORS, and password reset email flow are tested.

## Live Demo

https://xelon-issue-tracker-frontend.vercel.app/login

## GitHub Repository

Placeholder: `<github-repository-url>`

## Future Improvements

- Issue activity history for assignment and status changes.
- Admin controls for deactivating users.
- Email notifications for assignment and closure.
- File attachments for issue evidence.
- API automated test suite.
