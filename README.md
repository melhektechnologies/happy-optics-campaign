# SuperNova - Smart Supermarket Management System

An elite, production-ready, enterprise-grade SaaS platform built for modern hypermarkets, wholesale distributors, and multi-branch retail chains.

## 🚀 Overview

SuperNova is designed to operate as the intelligent operating system for retail. It seamlessly connects point-of-sale systems, multi-branch inventory, employee management, and an e-commerce storefront into a single, beautiful, and highly scalable cloud architecture.

### ✨ Key Features Built
- **Executive Dashboard (`/dashboard`)**: Real-time KPI metrics, Recharts integration, and AI-driven predictive insights.
- **Ultra-Fast POS (`/dashboard/pos`)**: High-performance cashier terminal with real-time cart states, barcode scanning readiness, and optimized checkout flow.
- **Intelligent Inventory (`/dashboard/inventory`)**: Cross-branch tracking, low-stock alerts, and advanced data-table filtering.
- **Product Information Management (`/dashboard/products`)**: Centralized SKU tracking, supplier linkage, and profit margin calculators.
- **RBAC & Staffing (`/dashboard/users`)**: Deep role-based access control (Super Admin, Manager, Cashier, etc.) and branch assignment.
- **Multi-Branch Operations (`/dashboard/branches`)**: Centralized view of all store performance, revenues, and employee counts.
- **Enterprise Reporting (`/dashboard/reports`)**: Complex financial charting, correlation graphs, and automated tax reporting.
- **B2C Storefront (`/store`)**: Public-facing e-commerce UI optimized for customer grocery shopping and delivery.
- **Secure Authentication (`/login`)**: High-end enterprise login interface.

## 🛠️ Technology Stack
- **Frontend**: React 19, Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4, Framer Motion, Shadcn UI
- **Data Visualization**: Recharts
- **Database Architecture**: PostgreSQL mapped with Prisma ORM
- **State Management**: React `useState` / `Zustand`
- **Iconography**: Lucide React

## 📦 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   Configure your `.env` file with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/supernova?schema=public"
   ```
   Run the Prisma migration:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design System
The UI/UX reflects a "billion-dollar SaaS" aesthetic:
- **Glassmorphism** and subtle background blurs.
- **Typography**: Inter / Geist font family.
- **Color Palette**: Deep Corporate Blue (`#010133`), Dark Cyan (`#012a2d`), and Luxury Gold (`#C89A32`).

## 🛡️ Production Readiness Checklist
- [x] Responsive Mobile-First Design
- [x] Complex Relational DB Schema (`schema.prisma`)
- [x] Component Library Intialized (Shadcn)
- [x] Database Connection Singleton (`lib/prisma.ts`)
- [ ] Implement NextAuth.js for JWT validation
- [ ] Connect Stripe Webhooks
- [ ] Setup Docker Containerization

---
*Built by Melhek Technologies | Enterprise Software Division*
