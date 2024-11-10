# AgroConnect-KE - Farm to Table Marketplace 🌾

![AgroConnect-KE Landing Page](https://res.cloudinary.com/ddqdsuiwr/image/upload/v1731270601/agro-connect/Screenshot_from_2024-11-10_23-28-01_rp2yfa.png)

AgroConnect-KE is a digital marketplace connecting local farmers directly with buyers, ensuring fresh produce reaches consumers while supporting sustainable farming practices in Kenya.

## Table of Contents
- Features
- Tech Stack
- Prerequisites
- Installation
- Running the Application
- Project Structure
- License
- Contact

## Features

### User Roles & Permissions

#### Buyer (Default Role)
- Account creation and management
- Browse products by categories
- Filter products by farmer
- Place orders with secure payment
- Track order status
- Request farmer status upgrade

#### Farmer
- Product listing and management
- Order fulfillment
- Sales analytics
- Inventory management
- All buyer privileges included

#### Admin
- User role management
- Category management
- System configuration
- Farmer request approval/rejection
- Platform oversight

### Core Features
- **User Authentication & Authorization**
  - Secure signup and login
  - Role-based access control
  - JWT token authentication

- **Payment Integration**
  - M-Pesa STK Push
  - Real-time payment verification
  - Order status updates

- **Product Management**
  - Category-based organization
  - Stock management
  - Order tracking
  - Sales analytics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payment**: Intasend API

### Frontend
- **Framework**: Angular 18
- **Styling**: TailwindCSS
- **State Management**: Services & Observables

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI
- PostgreSQL

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Earl006/agro-connect.git
cd agro-connect
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run prisma:generate
npm run prisma:migrate
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

## Running the Application

1. **Start Backend**
```bash
cd backend
npm run dev
```

2. **Start Frontend**
```bash
cd frontend
ng serve
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## Project Structure
```
agro-connect/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── bg-services/
│   ├── prisma/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── admin/
    │   │   ├── farmers/
    │   │   ├── buyers/
    │   │   └── shared/
    │   └── assets/
    └── package.json
```

## License
MIT License

## Contact
- Developer: Earljoe Kadima
- Email: earljoe06@gmail.com
- GitHub: https://github.com/Earl006

Made by Earljoe Kadima

