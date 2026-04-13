# 🔐 Auth MERN — Full-Stack Authentication System

A production-ready, full-stack authentication system built with the **MERN** stack (MongoDB, Express, React, Node.js). Features complete user authentication with JWT tokens stored in HTTP-only cookies, OTP-based email verification, and a secure password reset flow — all wrapped in a polished React + Tailwind CSS UI.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Register** | Sign up with name, email & password. Welcome email sent instantly. |
| 🔑 **Login / Logout** | Secure login with JWT stored in HTTP-only cookie |
| 📧 **Email Verification** | 6-digit OTP sent via email (valid 24 hours) |
| 🔒 **Password Reset** | OTP-based reset flow (valid 15 minutes) |
| 🛡️ **Protected Routes** | Middleware-guarded API endpoints |
| 🍪 **Cookie Auth** | HTTP-only, Secure, SameSite cookies — no localStorage token exposure |
| 🌐 **CORS Configured** | Proper CORS setup for local development |

---

## 🗂️ Project Structure

```
Auth/
├── client/                     # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, SVG icons
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Header.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx  # Global state (auth, user data)
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx       # Sign up / Login toggle
│   │   │   ├── emailVerify.jsx # OTP email verification
│   │   │   └── resetPassword.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example            # ← Copy to .env and fill values
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   ├── mongoose.js         # MongoDB connection
│   │   ├── nodemailer.js       # Brevo SMTP transporter
│   │   └── emailTemplates.js   # HTML email templates
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Logout, OTP flows
│   │   └── UserController.js   # Get user data
│   ├── middleware/
│   │   └── userauth.js         # JWT verification middleware
│   ├── models/
│   │   └── usermodel.js        # Mongoose User schema
│   ├── routes/
│   │   ├── authroutes.js       # /api/auth/*
│   │   └── UserRoutes.js       # /api/user/*
│   ├── server.js               # Express app entry point
│   ├── .env.example            # ← Copy to .env and fill values
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Brevo (Sendinblue)](https://www.brevo.com/) account for SMTP email

---

### 1. Clone the Repository

```bash
git clone https://github.com/MONJIT07/Auth-mern.git
cd Auth-mern
```

---

### 2. Set Up the Backend (Server)

```bash
cd server
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Then open `server/.env` and fill in your real values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# Brevo (Sendinblue) SMTP
SMTP_USER=your_brevo_smtp_user@smtp-brevo.com
SMTP_PASS=your_brevo_smtp_password
SENDER_EMAIL=your_email@example.com
```

Start the server:

```bash
# Development (with auto-reload via nodemon)
npm run server

# Production
npm start
```

> Server runs on **http://localhost:4000**

---

### 3. Set Up the Frontend (Client)

```bash
cd ../client
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Then open `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

> Client runs on **http://localhost:5173**

---

## 🔌 API Reference

Base URL: `http://localhost:4000`

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT cookie |
| `POST` | `/api/auth/logout` | ❌ | Clear the auth cookie |
| `POST` | `/api/auth/send-verify-otp` | ✅ | Send email verification OTP |
| `POST` | `/api/auth/verify-account` | ✅ | Verify email with OTP |
| `GET`  | `/api/auth/is-auth` | ✅ | Check if user is authenticated |
| `POST` | `/api/auth/send-reset-otp` | ❌ | Send password reset OTP |
| `POST` | `/api/auth/reset-password` | ❌ | Reset password using OTP |

### User Routes — `/api/user`

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/user/data` | ✅ | Get logged-in user's profile data |

> ✅ = Requires valid JWT cookie (`Authorization` via HTTP-only cookie)

---

### Request & Response Examples

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPass123"
}
```
```json
{ "success": true, "message": "User registered successfully" }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "StrongPass123"
}
```
```json
{ "success": true, "message": "Login successful" }
```
> A `token` HTTP-only cookie is set on success.

#### Reset Password
```http
POST /api/auth/send-reset-otp
Content-Type: application/json

{ "email": "john@example.com" }
```
```json
{ "success": true, "message": "OTP sent to email" }
```

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "482910",
  "newPassword": "NewStrongPass456"
}
```
```json
{ "success": true, "message": "Password reset successful" }
```

---

## 🧠 Tech Stack

### Backend
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT creation & verification |
| `nodemailer` | Sending OTP/welcome emails |
| `cookie-parser` | Parse HTTP-only cookies |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loading |
| `nodemon` | Dev auto-reload |

### Frontend
| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests with cookie support |
| `react-toastify` | Toast notifications |
| `tailwindcss` | Utility-first CSS styling |
| `vite` | Fast dev server & bundler |

---

## 🔐 Security Practices

- **Passwords** are hashed with `bcryptjs` (salt rounds: 10) — never stored in plain text
- **JWTs** are stored in **HTTP-only cookies** — inaccessible to JavaScript (prevents XSS)
- **SameSite cookie** policy: `strict` in dev, `none` in production (for cross-origin)
- **OTPs** are time-limited: 24 hours for email verify, 15 minutes for password reset
- **`.env` files** are git-ignored — secrets never committed to version control

---

## 🛠️ Available Scripts

### Server (`/server`)

| Command | Description |
|---|---|
| `npm start` | Start server with `node` |
| `npm run server` | Start server with `nodemon` (auto-reload) |

### Client (`/client`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📦 Environment Variables Reference

### `server/.env`

| Variable | Required | Description |
|---|:---:|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs (use a long random string) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `SMTP_USER` | ✅ | Brevo SMTP username |
| `SMTP_PASS` | ✅ | Brevo SMTP password |
| `SENDER_EMAIL` | ✅ | From address for outgoing emails |

### `client/.env`

| Variable | Required | Description |
|---|:---:|---|
| `VITE_BACKEND_URL` | ✅ | URL of the backend API (e.g. `http://localhost:4000`) |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

> Built with ❤️ by [MONJIT07](https://github.com/MONJIT07)
