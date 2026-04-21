# 🔐 Auth MERN — Full-Stack Authentication System

A production-ready, full-stack authentication system built with the **MERN** stack (MongoDB, Express, React, Node.js). Features complete user authentication with JWT tokens stored in HTTP-only cookies, OTP-based email verification, and a secure password reset flow — all wrapped in a polished React + Tailwind CSS UI.
---
🚀 Live Demo:https://auth-mern-client-eosin.vercel.app/
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


---

> Built with ❤️ by [MONJIT07](https://github.com/MONJIT07)
