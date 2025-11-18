# 🎨 Chat App Realtime Client

The modern, responsive frontend for **Chatio**, offering a seamless chat experience with a focus on performance and accessibility.

## 🚀 Tech Stack

- **Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **State Management:**
  - Global: [Zustand](https://github.com/pmndrs/zustand)
  - Server State: [TanStack Query v5](https://tanstack.com/query/latest)
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod
- **Real-time:** Socket.io-client

## 🛠️ Prerequisites

- Node.js
- The **Chatio Backend** server must be running.

## ⚙️ Environment Variables

Create a `.env` file in the root of the `frontend` directory:

```env
# API Configuration
VITE_API_URL="http://localhost:5000"
VITE_API_KEY="your_api_key"
```

## 📦 Installation

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Client

**Development Server:**

```bash
npm run dev
```

> The app will run at `http://localhost:5000` by default.

**Production Build:**

```bash
npm run build
```

**Preview Production Build:**

```bash
npm run preview
```

## ✨ Key Features

- **Authentication:** Secure login/signup with form validation.
- **Real-time Chat:** Instant messaging with typing indicators.
- **Friend System:** Send/Receive friend requests and view online status.
- **Dark Mode:** Fully supported via `next-themes`.
- **Responsive Design:** Optimized for desktop and mobile.
- **Toasts:** Beautiful notifications using `sonner`.

## 📂 Project Structure

```text
src/
├── components/
│   ├── providers/
│   ├── layouts/      # Layouts app
│   ├── ui/           # Shadcn UI reusable components
│   └── ...
├── features/
├── hooks/            # Custom React hooks (useAuth, useSocket)
├── lib/              # Utilities (axios setup, cn helper)
├── pages/            # Application pages (Login, Chat)
├── routes/           # Public and private routes
├── utils/
├── App.tsx           # Main application component
├── main.css          # CSS globals
└── main.tsx          # Entry point
```

## 👤 Author

**vanthom04**
