# API Endpoints

## 🔐 Authentication

| Method | Route             | Access       | Description                     |
|--------|-----------------|-------------|---------------------------------|
| POST   | /api/auth/register | Public      | Create new user account         |
| POST   | /api/auth/login    | Public      | Login user → Returns JWT token  |
| GET    | /api/auth/me       | 🔐 JWT      | Get logged-in user profile      |
| PATCH  | /api/auth/me       | 🔐 JWT      | Update name/password            |
| GET    | /api/applications/my | 🔐 Jobseeker | Get logged-in user's applications |

## 💼 Jobs

| Method | Route                           | Access            | Description                                    |
|--------|---------------------------------|-----------------|-----------------------------------------------|
| GET    | /api/jobs                       | Public           | List all active jobs (pagination, filter, search) |
| GET    | /api/jobs/:id                   | Public           | Get single job by ID                           |
| POST   | /api/jobs                       | 🔒 Admin (API Key) | Create new job                                 |
| DELETE | /api/jobs/:id                   | 🔒 Admin (API Key) | Delete job + related applications             |
| GET    | /api/jobs/:jobId/applications   | 🔒 Admin (API Key) | Get all applications for specific job         |

## 📝 Applications

| Method | Route                       | Access            | Description                                   |
|--------|----------------------------|-----------------|-----------------------------------------------|
| POST   | /api/applications           | Public           | Submit job application                        |
| GET    | /api/applications           | 🔒 Admin (API Key) | List all applications (pagination, filter)   |
| GET    | /api/applications/:id       | 🔒 Admin (API Key) | Get single application                        |
| PATCH  | /api/applications/:id/status | 🔒 Admin (API Key) | Update application status (pending, reviewed, accepted, rejected) |

## 🔐 Authentication Types Explained

| Protection Type | Header Required                            |
|-----------------|--------------------------------------------|
| Admin API Key    | x-admin-api-key: your-secret-admin-key-here |
| JWT Auth         | Authorization: Bearer <your_token>         |
