# 💬 Chat App Realtime

**Chatio** is a modern, real-time chat application built for performance and scalability. It leverages the latest web technologies to provide a seamless messaging experience, featuring secure authentication, instant messaging, and media sharing.

## 🚀 Tech Stack

### **Backend (Server)**

Built with performance and type-safety in mind.

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js v5](https://expressjs.com/) (Next-gen routing)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Real-time Engine:** [Socket.IO](https://socket.io/)
- **Validation:** [Joi](https://joi.dev/)
- **Storage:** [ImageKit](https://imagekit.io/) & [Multer](https://github.com/expressjs/multer)
- **Security:** BCrypt, JWT, Helmet, CORS

### **Frontend (Client)**

A highly reactive and accessible user interface.

- **Core:** [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Global) & [TanStack Query](https://tanstack.com/query/latest) (Server state)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Forms:** React Hook Form & Zod

---

## ✨ Features

- **Real-time Messaging:** Instant bidirectional communication using Socket.IO.
- **Secure Authentication:** JWT-based auth with HTTP-only cookies.
- **Rich Media Support:** Image uploads handled via ImageKit.
- **Modern UI/UX:** Fully responsive design with Dark Mode support (`next-themes`).
- **Robust Forms:** Client-side validation with Zod and server-side with Joi.
- **Optimized Performance:** Vite build tooling and efficient state management.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A Database (PostgreSQL/MySQL/MongoDB) supported by Prisma

### 1\. Clone the Repository

```bash
git clone https://github.com/vanthom04/chatio.git
cd chatio
```

### 2\. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

**Environment Variables (.env)**
Create a `.env` file in the `backend` directory:

```env
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

**Database Setup:**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for prototyping)
npm run db:push
```

**Run the Server:**

```bash
npm run dev
```

### 3\. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

**Environment Variables (.env)**
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL="http://localhost:5000"
VITE_API_KEY="http://localhost:5000"
```

**Run the Client:**

```bash
npm run dev
```

---

## 📜 Scripts

### Backend

| Script              | Description                                        |
| :------------------ | :------------------------------------------------- |
| `npm run dev`       | Starts the server in development mode with Nodemon |
| `npm run build`     | Compiles TypeScript to JavaScript in `dist` folder |
| `npm start`         | Runs the production build                          |
| `npm run lint`      | Runs ESLint check                                  |
| `npm run db:studio` | Opens Prisma Studio GUI to view data               |

### Frontend

| Script            | Description                           |
| :---------------- | :------------------------------------ |
| `npm run dev`     | Starts the Vite development server    |
| `npm run build`   | Builds the app for production         |
| `npm run preview` | Previews the production build locally |
| `npm run lint`    | Runs ESLint check                     |

---

## 📂 Project Structure

```text
chatio/
├── backend/           # Node.js & Express Server
│   ├── src/
│   │   ├── controllers/
│   │   ├── exceptions/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/  # Logics
│   │   ├── socket/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validations/
│   │   └── server.ts  # Entry point
│   └── package.json
│
└── frontend/          # React & Vite Client
    ├── src/
    │   ├── components/# Shadcn UI components & Custom components
    │   ├── features/
    │   ├── hooks/     # Custom hooks
    │   ├── lib/       # Utils (axios, cn, etc.)
    │   ├── pages/     # Route pages
    │   ├── routes/    # Public and private routes
    │   ├── utils/
    │   └── main.tsx
    └── package.json
```

## 📄 License

This project is licensed under the **ISC License**.

## ✍️ Author

**vanthom04**

---

_Happy Coding\! 🚀_
