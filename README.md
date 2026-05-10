<h3 align="center">DataFi</h3>

<p align="center">
  <img src="./docs/images/logo.png" alt="_picture" height="50">
</p>

<div align="center">

![React](https://img.shields.io/badge/React-19-blue) ![Next](https://img.shields.io/badge/Next-16-red) ![Node](https://img.shields.io/badge/Node-18%2B-green)

*A comprehensive financial management platform with real-time analytics, bill tracking, goal setting, and intelligent expense categorization.*

</div>

## Overview

<p align="center">
  <img src="./docs/images/image.png" alt="_picture" height="500">
</p>

### Key Highlights
- **Real-time Analytics** - Dashboard with charts and insights
- **Persistent Data** - PostgreSQL with Prisma ORM
- **Goal Tracking** - Set and monitor financial targets
- **Bill Management** - Smart bill reminders and tracking
- **Recurring Transactions** - Automated income/expense tracking
- **Modern UI** - Dark mode, responsive design
- **API-Driven** - RESTful backend with Swagger docs


## Features

### User Features
- ✅ **Dashboard Overview** - Summary of balance, income, and expenses
- ✅ **Transaction Management** - Create, edit, delete transactions
- ✅ **Expense Categorization** - Organize by 12+ categories
- ✅ **Bill Reminders** - Track upcoming bills with frequency options
- ✅ **Financial Goals** - Set targets and monitor progress
- ✅ **Recurring Transactions** - Automate regular income/expenses
- ✅ **Spending Insights** - Visual breakdowns and trends
- ✅ **Export Data** - Download financial reports
- ✅ **Dark/Light Theme** - Customizable interface
- ✅ **Multi-Currency Support** - Real-time exchange rates
- ✅ **Authentication** - Secure login/signup with JWT tokens

### Admin Features
- ✅ **User Management** - Create and manage users
- ✅ **Role-Based Access** - Admin, Analyst, Viewer roles
- ✅ **Data Analytics** - View all user data
- ✅ **System Overview** - API documentation and monitoring


## Tech stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with SSR |
| **React 19** | UI components and state |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **Axios** | HTTP client with interceptors |
| **Recharts** | Data visualization |
| **Lucide Icons** | Beautiful icons |
| **Framer Motion** | Smooth animations |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express.js 5** | Web framework |
| **Node.js 18+** | Runtime environment |
| **TypeScript** | Type-safe backend |
| **Prisma ORM** | Database abstraction |
| **PostgreSQL** | Relational database |
| **JWT** | Token-based auth |
| **Bcrypt** | Password hashing |
| **Swagger** | API documentation |
| **Express Rate Limiter** | DDoS protection |

## Database Schema

```mermaid
erDiagram

    USER {
        INT id PK
        STRING name
        STRING email
        STRING password
        ENUM role
        ENUM status
        DATETIME createdAt
    }

    TRANSACTION {
        INT id PK
        INT userId FK
        STRING category
        FLOAT amount
        ENUM type
        STRING note
        DATETIME date
        DATETIME createdAt
    }

    BILL {
        STRING id PK
        INT userId FK
        STRING title
        FLOAT amount
        STRING category
        DATETIME dueDate
        BOOLEAN isPaid
        BOOLEAN recurring
        ENUM frequency
        DATETIME createdAt
    }

    GOAL {
        STRING id PK
        INT userId FK
        STRING title
        FLOAT targetAmount
        FLOAT savedAmount
        DATETIME deadline
        DATETIME createdAt
    }

    RECURRING_TRANSACTION {
        STRING id PK
        INT userId FK
        STRING category
        FLOAT amount
        ENUM type
        ENUM frequency
        DATETIME nextDate
        BOOLEAN active
        DATETIME createdAt
    }

    USER ||--o{ TRANSACTION : "creates"
    USER ||--o{ BILL : "manages"
    USER ||--o{ GOAL : "sets"
    USER ||--o{ RECURRING_TRANSACTION : "owns"

    TRANSACTION }o--|| USER : "belongs to"
    BILL }o--|| USER : "belongs to"
    GOAL }o--|| USER : "belongs to"
    RECURRING_TRANSACTION }o--|| USER : "belongs to"
```

## Project Structure

```
DataFi/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── docs/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── package.json
```

## API Reference

### Base URL
```
http://localhost:7000/api
```

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <accessToken>
```

### Auth Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "role": "VIEWER"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": {
    "msg": "Logout successful"
  }
}
```

### Dashboard Endpoints

#### Get Balance Summary
```http
GET /dashboard/balance
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": {
    "totalIncome": 250000,
    "totalExpense": 95000,
    "netBalance": 155000
  }
}
```

#### Get Transactions by Type
```http
GET /dashboard/type
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": [
    { "type": "INCOME", "amount": 250000 },
    { "type": "EXPENSE", "amount": 95000 }
  ]
}
```

#### Get Recent Transactions
```http
GET /dashboard/recent
Authorization: Bearer <accessToken>

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 5000,
      "type": "EXPENSE",
      "categoryName": "food",
      "date": "2026-05-10T10:30:00Z",
      "notes": "Lunch"
    }
  ]
}
```

### Transaction Management

#### Create Transaction
```http
POST /admin/transactions
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "categoryName": "food",
  "amount": 500,
  "type": "EXPENSE",
  "date": "2026-05-10",
  "notes": "Dinner"
}
```

#### Update Transaction
```http
PUT /admin/transactions/:id
Authorization: Bearer <accessToken>
```

#### Delete Transaction
```http
DELETE /admin/transactions/:id
Authorization: Bearer <accessToken>
```

### Bills Management

#### Create Bill
```http
POST /admin/bills
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Electricity Bill",
  "amount": 1500,
  "dueDate": "2026-05-15",
  "category": "utilities",
  "frequency": "monthly"
}
```

#### Get Upcoming Bills
```http
GET /admin/bills/upcoming
Authorization: Bearer <accessToken>
```

#### Mark Bill as Paid
```http
PATCH /admin/bills/:id/paid
Authorization: Bearer <accessToken>
```

### Goals Management

#### Create Goal
```http
POST /admin/goals
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Emergency Fund",
  "targetAmount": 100000,
  "deadline": "2026-12-31",
  "category": "savings"
}
```

#### Add Contribution
```http
PATCH /admin/goals/:id/contribute
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "amount": 5000
}
```

### Recurring Transactions

#### Create Recurring Transaction
```http
POST /admin/recurring
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "categoryName": "salary",
  "amount": 50000,
  "type": "INCOME",
  "frequency": "MONTHLY",
  "startDate": "2026-01-01"
}
```

See [API Docs](http://localhost:7000/api-docs) for complete endpoint reference.


### API Endpoints Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | ✗ | User login |
| `/auth/refresh` | POST | ✗ | Refresh token |
| `/auth/logout` | POST | ✓ | User logout |
| `/dashboard/balance` | GET | ✓ | Get balance |
| `/dashboard/type` | GET | ✓ | Transactions by type |
| `/dashboard/recent` | GET | ✓ | Recent transactions |
| `/admin/transactions` | POST | ✓ | Create transaction |
| `/admin/transactions/:id` | PUT | ✓ | Update transaction |
| `/admin/transactions/:id` | DELETE | ✓ | Delete transaction |
| `/admin/bills` | POST | ✓ | Create bill |
| `/admin/bills/:id` | PUT | ✓ | Update bill |
| `/admin/bills/:id` | DELETE | ✓ | Delete bill |
| `/admin/bills/upcoming` | GET | ✓ | Get upcoming bills |
| `/admin/bills/:id/paid` | PATCH | ✓ | Mark bill paid |
| `/admin/goals` | POST | ✓ | Create goal |
| `/admin/goals/:id/contribute` | PATCH | ✓ | Add contribution |
| `/admin/recurring` | POST | ✓ | Create recurring |
| `/admin/users` | GET | ✓ | Get all users (admin) |

## Stores & API Integration

### useAuthStore
Manages authentication state and user session.

```typescript
import { useAuthStore } from '@/store/useAuthStore';

const { login, logout, isAuthenticated, user } = useAuthStore();

// Login
await login('user@example.com', 'password');

// Logout
logout();
```

### useTransactionStore
Manages transactions with automatic API sync.

```typescript
import { useTransactionStore } from '@/store/useTransactionStore';

const store = useTransactionStore();

// Add transaction
await store.addTransaction({
  category: 'food',
  amount: 500,
  type: 'expense',
  date: '2026-05-10',
  description: 'Lunch'
});

// Delete transaction
await store.deleteTransaction('tx_123');
```

### useBillStore
Manages bills with automatic API sync.

```typescript
import { useBillStore } from '@/store/useBillStore';

const { addBill, markPaid, fetchUpcomingBills } = useBillStore();

// Add bill
await addBill({
  name: 'Electricity',
  amount: 1500,
  dueDate: '2026-05-15',
  category: 'utilities'
});

// Mark as paid
await markPaid('bill_id');
```

### useGoalStore
Manages financial goals.

```typescript
import { useGoalStore } from '@/store/useGoalStore';

const { addGoal, addSavings } = useGoalStore();

// Create goal
await addGoal({
  name: 'Emergency Fund',
  targetAmount: 100000,
  deadline: '2026-12-31',
  category: 'other'
});

// Add savings
await addSavings('goal_id', 5000);
```

### useRecurringStore
Manages recurring transactions.

```typescript
import { useRecurringStore } from '@/store/useRecurringStore';

const { addItem, toggleActive } = useRecurringStore();

// Add recurring transaction
await addItem({
  description: 'Salary',
  amount: 50000,
  type: 'income',
  category: 'salary',
  frequency: 'monthly',
  startDate: '2026-01-01'
});
```

### 🔄 Data Conversion

The frontend and backend may use different field names. The stores handle automatic conversion:

| Backend | Frontend | Conversion |
|---------|----------|-----------|
| `categoryName` | `category` / `description` | Lowercased and mapped |
| `currentAmount` | `savedAmount` | Direct mapping |
| `INCOME`/`EXPENSE` | `income`/`expense` | Lowercased |
| `WEEKLY`/`MONTHLY`/`YEARLY` | `weekly`/`monthly`/`yearly` | Lowercased |
| `ACTIVE` | `true` | Boolean conversion |



## Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **PostgreSQL** 12 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/datafi.git
cd DataFi
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your settings
# DATABASE_URL="postgresql://user:password@localhost:5432/datafi?schema=public"
# ACCESS_SECRET=your_secret_key
# REFRESH_SECRET=your_refresh_key
```

**Setup Database:**
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed

# Verify schema
npx prisma studio
```

**Start Backend Server:**
```bash
npm run dev
```

Backend runs on: `http://localhost:7000`
API Docs: `http://localhost:7000/api-docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:7000/api
```

**Start Frontend Server:**
```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 4. Access Application

Open browser and navigate to: **http://localhost:3000**

#### Demo Credentials
```
Email:    admin@example.com
Password: password123
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=7000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/datafi?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/datafi?schema=public"

# JWT
ACCESS_SECRET=your_super_secret_access_key_32_chars_minimum
REFRESH_SECRET=your_super_secret_refresh_key_32_chars_minimum

# CORS
FRONTEND_URL="http://localhost:3000"

# Documentation
SWAGGER_ENABLED=true
```

### Frontend (.env.local)

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:7000/api

# App
NEXT_PUBLIC_APP_NAME=DataFi
NEXT_PUBLIC_DEBUG=false
```

For detailed information, see [ENV_REFERENCE.md](./ENV_REFERENCE.md)


## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm run test                # Run all tests
npm run test:watch         # Watch mode
```

### Run Frontend Tests (if available)
```bash
cd frontend
npm run test
```

## Available Scripts

### Backend
```bash
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run test suite
npm run test:watch       # Run tests in watch mode
npm run lint             # Lint code
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Lint code
```

## 🐛 Troubleshooting

### CORS Errors
**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that CORS is enabled in backend `src/index.ts`
```bash
origin: process.env.FRONTEND_URL || "http://localhost:3000"
```

### Database Connection Failed
**Problem:** `getaddrinfo ENOTFOUND localhost`

**Solution:**
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database exists: `psql -U postgres -l | grep datafi`
- Create database: `createdb datafi`

### JWT Token Expired
**Problem:** `Invalid refresh token` error

**Solution:**
- Clear localStorage and login again
- Verify `REFRESH_SECRET` matches between requests
- Check token expiration time in `backend/src/config/jwt.ts`

### Port Already in Use
**Problem:** `Error: listen EADDRINUSE: address already in use :::7000`

**Solution:**
```bash
# Kill process on port 7000
# Windows
netstat -ano | findstr :7000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :7000
kill -9 <PID>
```

### Cannot Find Module Error
**Problem:** `Cannot find module '@/lib/api'`

**Solution:**
- Run `npm install` in the respective directory
- Check `tsconfig.json` path aliases are correct
- Restart development server


## Additional Documentation
- [ENV_REFERENCE.md](./ENV_REFERENCE.md) - Complete environment variables reference
- [API Docs](http://localhost:7000/api-docs) - Interactive Swagger documentation

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Submit a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Update documentation for new features

