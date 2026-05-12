# 🍒 Cherrywood Admin Portal

A premium, high-performance administrative management platform for real estate and content management. Built with the latest Next.js 16 and Tailwind CSS 4 ecosystem.

## 🚀 Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (CSS-first configuration)
- **Database**: [Prisma](https://www.prisma.io/) with MariaDB/MySQL
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Auth**: JWT-based secure session management

## ✨ Key Features

- **Premium Dashboard**: Forced light-mode aesthetic with real-time statistics and activity tracking.
- **User Management**: Complete CRUD system with role-based access control (Admin, Editor, Author, Buyer).
- **Content Engine**: Full-featured blog management system with markdown support and status tracking.
- **Real Estate Tools**: Specialized modules for managing Projects and Units.
- **Security**: Client-side auth guards and backend API middleware protection.
- **Self-Service**: User profile management and global system settings.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm
- MariaDB or MySQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cherrywood
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your database connection:
   ```env
   DATABASE_HOST="[IP_ADDRESS]"
   DATABASE_NAME="dbname"
   DATABASE_USER="dbuser"
   DATABASE_PASSWORD="dbpassword"
   DATABASE_URL="mysql://dbuser:dbpassword@[IP_ADDRESS]/dbname"
   JWT_SECRET="your-super-secret-key"
   ```

4. **Database Initialization**
   ```bash
   npx prisma generate
   npx prisma db push
   pnpm prisma db seed
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application. The admin portal is located at `/admin`.

## 📁 Project Structure

- `app/`: Next.js App Router (Pages, Layouts, API routes)
- `components/`: Reusable React components
  - `ui/`: Base Shadcn UI components
  - `admin/`: Dashboard-specific components
- `lib/`: Utility functions, database client, and auth helpers
- `prisma/`: Database schema and seed scripts
- `public/`: Static assets and uploads

## 🛡️ Security

The admin portal is protected by multiple layers:
- **Client-side**: `AdminLayoutWrapper` checks for `auth_token` in localStorage.
- **API-side**: Middleware (`proxy.ts`) and `requirePermission` guards in backend routes.

## 📄 License

This project is private and proprietary.
