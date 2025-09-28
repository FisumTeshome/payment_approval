## Features

- User authentication (login with JWT)
- Role-based access control:
  - **SUPER_ADMIN**: Can confirm payments
  - **ADMIN**: Can approve/reject payments
  - **USER**: Can create payment requests
- Payment request management (create, list, approve, reject, confirm)
- Audit logs for payment actions

---

## Tech Stack

- **Node.js** & **Express**
- **TypeScript**
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcrypt** for password hashing
