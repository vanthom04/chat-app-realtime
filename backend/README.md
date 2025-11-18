# 🛡️ Chat App Realtime Backend API

The robust backend server for the **Chatio** application, built to handle real-time communication, secure authentication, and media management.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** [Express.js v5](https://expressjs.com/) (Next-generation routing)
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Real-time:** [Socket.IO](https://socket.io/)
- **Validation:** Joi
- **Storage:** ImageKit & Multer
- **Security:** Helmet, CORS, BCrypt, JWT
- **Email:** Nodemailer

## 🛠️ Prerequisites

Before running this server, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm or yarn
- A Database (PostgreSQL, MySQL, or MongoDB) connection string

## ⚙️ Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following variables:

```env
# Server Configuration
PORT=5100
DATABASE_URL="mongodb://localhost:27017/chat_app_realtime_db"
API_KEY="your_api_key"
JWT_SECRET="your_super_secret_key"
CLIENT_URL="http://localhost:5000"

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="your_url_endpoint"

# Email (Nodemailer)
SMTP_SERVER_HOST="email_server_host"
SMTP_SERVER_USER="your_email@example.com"
SMTP_SERVER_PASS="your_email_password"
```

## 📦 Installation

1.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  **Database Setup:**
    Generate the Prisma client and push the schema to your database.

    ```bash
    npm run db:generate
    npm run db:push
    ```

## 🏃‍♂️ Running the Server

**Development Mode (with Nodemon):**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

**Open Prisma Studio (GUI Database Viewer):**

```bash
npm run db:studio
```

## 📂 Project Structure

```text
src/
├── controllers/  # Request handlers
├── exceptions/   # Exceptions
├── lib/          # Nodemailer, Prisma, Cors, ImageKit
├── middlewares/  # Auth, validation, error handling
├── routes/       # API route definitions
├── services/     # Business logic
├── socket/       # Socket.io
├── types/        # Types
├── utils/        # Helper functions and constants
└── server.ts     # Entry point
```

## 📝 API Endpoints Overview

- `/api/auth` - Login, Register, Refresh Token
- `/api/users` - User profile, Search, Friend requests
- `/api/friends` - Send and receive invitations to connect with friends
- `/api/conversations` - Create chat, Get conversations
- `/api/messages` - Send and retrieve messages

## 👤 Author

**vanthom04**
