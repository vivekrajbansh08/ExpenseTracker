# MoneyTrack - Full-Stack Expense Tracker Application

## 📝 Project Overview

**MoneyTrack** is a comprehensive expense tracking web application built with Angular, Node.js, and MongoDB. It goes beyond basic expense management to provide advanced features like multi-wallet support, Splitwise-style expense sharing, subscription tracking, savings goals, and gamification.

## 🚀 Tech Stack

### Frontend
- **Framework**: Angular 21
- **Language**: TypeScript
- **UI**: Bootstrap 5 with custom glassmorphism design
- **Charts**: Chart.js with ng2-charts
- **Icons**: Font Awesome
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **CSV Export**: json2csv
- **Email**: SendGrid

### Database
- **Database**: MongoDB
- **ODM**: Mongoose

## ✨ Features

### Core Features
- ✅ **User Authentication**: Secure JWT-based login/registration with password hashing
- ✅ **Transaction Management**: Full CRUD for expenses and income
- ✅ **Budget Tracking**: Category-based budgets with overspending alerts
- ✅ **Dashboard Analytics**: Real-time charts and statistics

### Advanced Features
- ✅ **Multi-Wallet Support**: Manage multiple accounts (cash, bank, credit cards)
- ✅ **Expense Sharing**: Splitwise-style bill splitting with shareable links
- ✅ **Subscriptions**: Track recurring payments (Netflix, Spotify, etc.)
- ✅ **Savings Goals**: Set and monitor financial goals with progress tracking
- ✅ **Time-Frame Analytics**: Weekly, monthly, yearly spending insights
- ✅ **Data Export**: Export transactions as PDF or CSV
- ✅ **Receipt Upload**: OCR-ready image storage for receipts
- ✅ **Notifications**: Budget alerts and important reminders
- ✅ **Dark Mode**: Complete theme support
- ✅ **Gamification**: Achievement badges for financial milestones
- ✅ **Onboarding**: Interactive first-time user setup

## 📁 Project Structure

```
expense-tracker/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Services, guards, interceptors
│   │   │   ├── features/    # Feature modules (dashboard, transactions, etc.)
│   │   │   ├── shared/      # Reusable components
│   │   │   └── auth/        # Authentication module
│   │   ├── environments/    # Environment configs
│   │   └── styles.css       # Global styles with glassmorphism
│   └── package.json
│
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── models/          # Mongoose schemas (11 models)
│   │   ├── controllers/     # Business logic (12 controllers)
│   │   ├── routes/          # API endpoints (12 route files)
│   │   ├── middleware/      # Auth & error handling
│   │   ├── config/          # Database configuration
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Express app setup
│   └── package.json
│
└── Documentation/
    ├── VIDEO_DEMONSTRATION_SCRIPT.md
    ├── INTERVIEW_GUIDE.md
    ├── INTERVIEW_QA_FRONTEND.md
    ├── INTERVIEW_QA_BACKEND.md
    └── INTERVIEW_QA_ARCHITECTURE.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB installed and running

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

4. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update environment file if needed:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

4. Start the frontend development server:
```bash
npm start
```

Frontend will run on `http://localhost:4200`

### MongoDB Setup

1. **Install MongoDB**: 
   - macOS: `brew install mongodb-community`
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Linux: Follow [official docs](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**:
```bash
# macOS/Linux
mongod --dbpath /path/to/data/directory

# Or using brew (macOS)
brew services start mongodb-community
```

3. **Verify Connection**:
```bash
mongosh
# Should connect to mongodb://localhost:27017
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (in a separate terminal):
```bash
mongod
```

2. **Start Backend** (in a separate terminal):
```bash
cd backend
npm run dev
```

3. **Start Frontend** (in a separate terminal):
```bash
cd frontend
npm start
```

4. **Access the application**:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000/api
   - API Health Check: http://localhost:3000/api/health

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder using a static server
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Budgets
- `GET /api/budgets` - Get all budgets (protected)
- `POST /api/budgets` - Create budget (protected)
- `PUT /api/budgets/:id` - Update budget (protected)
- `DELETE /api/budgets/:id` - Delete budget (protected)

### Wallets
- `GET /api/wallets` - Get all wallets (protected)
- `POST /api/wallets` - Create wallet (protected)
- `POST /api/wallets/transfer` - Transfer between wallets (protected)

### Expense Shares
- `GET /api/expense-shares` - Get shared expenses (protected)
- `POST /api/expense-shares` - Create shared expense (protected)
- `POST /api/expense-shares/:id/settle` - Settle payment (protected)

### Subscriptions
- `GET /api/subscriptions` - Get subscriptions (protected)
- `POST /api/subscriptions` - Create subscription (protected)

### Savings Goals
- `GET /api/savings-goals` - Get goals (protected)
- `POST /api/savings-goals` - Create goal (protected)
- `POST /api/savings-goals/:id/contribute` - Add contribution (protected)

### Analytics
- `GET /api/analytics/overview` - Get spending overview (protected)
- `GET /api/analytics/timeframe` - Get time-based analytics (protected)

### Export
- `GET /api/export/pdf` - Export as PDF (protected)
- `GET /api/export/csv` - Export as CSV (protected)

## 🎨 Design Features

- **Glassmorphism UI**: Modern frosted-glass effect on cards
- **Neon Accents**: Vibrant gradient color scheme
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Complete theme toggle support
- **Professional Typography**: Inter font family
- **Custom Scrollbars**: Styled for better UX

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests (if implemented)
```bash
cd backend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🔒 Security Features

- JWT authentication with token expiration
- Password hashing using bcrypt
- Protected API routes with middleware
- Input validation on both client and server
- CORS configuration
- Environment-based sensitive data management

## 🚧 Troubleshooting

### MongoDB Connection Error
```
Error: MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution**: Ensure MongoDB is running (`mongod` command)

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Kill the process using the port or change PORT in .env

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: Verify FRONTEND_URL in backend .env matches your frontend URL

## 👨‍💻 Author

Built by Vivek Rajbansh for technical assignment submission.

## 📄 License

This project is built for educational and assignment purposes.

---


