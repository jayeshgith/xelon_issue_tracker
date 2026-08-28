# Business Requirements Document - Xelon Issue Tracker

## Business Objective

Build a professional internal issue tracking application for Xelon so technical problems can be reported, assigned, discussed, tracked, and closed through a controlled workflow.

## Problem Statement

Issue handling becomes unreliable when reports are spread across messages, calls, and informal notes. Xelon needs one system where users can report issues, admins can assign ownership, and developers can keep status and comments updated.

## Scope

Included:

- User registration and login.
- Admin and developer seed accounts.
- JWT authentication.
- Role-based authorization.
- Issue creation, viewing, editing, assignment, status updates, deletion where permitted.
- Comments.
- Categories.
- Dashboard counts from MongoDB.
- Password reset with secure expiring tokens.
- Responsive React UI.
- Local setup and deployment documentation.

Excluded:

- Real-time chat.
- Payments.
- AI features.
- Microservices.
- Complex notification workflows.

## User Roles

`user`

Can register, login, create issues, view own issues, comment, and track status.

`admin`

Can view all issues, assign developers, manage categories, view users and developers, and monitor dashboards.

`developer`

Can view assigned issues, add comments, and update assigned issue status.

## Functional Requirements

- The system shall allow public users to register with first name, last name, email, phone, password, and confirm password.
- The system shall validate Indian phone numbers in `+91XXXXXXXXXX` format.
- The system shall hash all passwords before storage.
- The system shall authenticate users with JWT.
- The system shall prevent public registration as admin or developer.
- The system shall allow users to create issues with title, category, priority, and description.
- The system shall generate human-readable issue IDs like `XEL-1001`.
- The system shall set new issues to `OPEN`.
- The system shall allow admins to assign issues to active developers only.
- The system shall support `OPEN`, `IN_PROGRESS`, and `CLOSED` statuses.
- The system shall allow comments from permitted participants.
- The system shall calculate dashboard statistics from MongoDB.
- The system shall allow admins to manage categories.
- The system shall allow secure password reset with an expiring token.

## Non-Functional Requirements

- The UI shall be responsive across desktop, tablet, and mobile widths.
- The API shall return consistent JSON responses.
- The API shall enforce authorization on the backend.
- The application shall use environment variables for secrets and deployment-specific settings.
- The codebase shall keep frontend and backend concerns separated.
- The implementation shall remain understandable for developer assessment review.

## Issue Workflow

```text
User reports issue
OPEN
Admin reviews issue
Admin assigns developer
IN_PROGRESS
Developer works and comments
CLOSED
User and admin track final status
```

## Authentication Requirements

- Passwords must never be stored or returned as plain text.
- JWT tokens must be required for protected API routes.
- Password reset tokens must be random, hashed in storage, and time-limited.
- SMTP credentials must be configured through environment variables.

## Authorization Requirements

- Users can access only their own issues.
- Developers can access only assigned issues.
- Admins can access organization-wide issue, user, developer, category, and dashboard data.
- Developers cannot assign issues or manage users/categories.
- Users cannot access admin or developer APIs.

## Dashboard Requirements

User dashboard:

- My total issues.
- Open.
- In progress.
- Closed.
- Recent issues.

Developer dashboard:

- Assigned issues.
- Open.
- In progress.
- Closed.
- High priority assigned issues.
- Recent assigned issues.

Admin dashboard:

- Total issues.
- Open.
- In progress.
- Closed.
- High priority issues.
- Total users.
- Total developers.
- Recent issues.

Dashboard visualization requirements:

- User dashboards shall show status and priority charts for the user's own issues.
- Developer dashboards shall show status and priority charts for assigned issues.
- Admin dashboards shall show status, priority, category, and developer workload charts using organization-wide data.
- Charts shall use real database aggregation results, responsive layouts, readable tooltips, and empty states when no data exists.

## Database Requirements

Collections:

- `users`: account identity, password hash, role, active flag.
- `issues`: issue details, category, priority, status, reporter, assigned developer.
- `comments`: issue discussion entries.
- `categories`: admin-controlled global categories.

Relationships:

- Issue `createdBy` references User.
- Issue `assignedTo` references User with developer role.
- Issue `category` references Category.
- Comment `issue` references Issue.
- Comment `user` references User.

## Deployment Requirements

The application is designed for:

```text
React frontend hosting
Express backend hosting
MongoDB Atlas database
SMTP provider for password reset email
```

Deployment steps:

1. Deploy the backend to a Node.js hosting provider.
2. Configure backend environment variables including `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and SMTP values.
3. Deploy the frontend to static hosting.
4. Configure `VITE_API_URL` to the backend `/api` URL.
5. Configure MongoDB Atlas network access for the backend.
6. Run the seed script once for admin/developer accounts and initial categories.
7. Test login, issue creation, assignment, status update, comments, dashboard counts, CORS, and password reset email.

Another developer can update deployment by pulling the latest code, reinstalling dependencies if needed, rebuilding the frontend, and restarting/redeploying the backend with unchanged environment variables.

## Future Enhancements

- Issue activity timeline.
- Email notifications for assignment and closure.
- User deactivation UI.
- Attachment support.
- Automated backend integration tests.
