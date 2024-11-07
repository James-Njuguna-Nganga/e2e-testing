# Agro-Connect KE Backend API

A robust backend API for connecting farmers and buyers in Kenya's agricultural sector. This platform facilitates direct farmer-to-buyer connections, secure payments via MPesa, and efficient agricultural product management.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Core Features](#core-features)
- [API Documentation](#api-documentation)

## Overview

Agro-Connect KE provides RESTful APIs for:
- User authentication and role management (Buyer/Farmer/Admin)
- Agricultural product listing and management 
- Order processing with MPesa integration
- Farmer verification workflow
- Cloud-based image management
- Automated email notifications

## Tech Stack

**Core:**
- Node.js & Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- JWT Authentication

**Key Libraries & Their Uses:**
- `@prisma/client`: Database ORM for PostgreSQL
- `express`: Web framework for handling HTTP requests
- `intasend-node`: MPesa payment gateway integration
- `cloudinary`: Cloud storage for product images
- `nodemailer`: Email notification system
- `jsonwebtoken`: User authentication
- `bcryptjs`: Password encryption
- `multer`: File upload handling

## Project Structure
```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middleware/     # Auth & validation
├── mails/          # Email templates
├── utils/          # Helper functions
└── app.ts          # App entry point

prisma/
├── schema.prisma   # Database schema
└── migrations/     # Database migrations
```
## Installation

```bash
# Clone repository
git clone https://github.com/Earl006/Agro_connect-KE.git
cd Agro_connect-KE

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```
## Environment Variables
Create a .env file with:

```markdown
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agro-connect"

# Authentication
JWT_SECRET="your-secret-key"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465
EMAIL_NAME="your-email@gmail.com"
EMAIL_PASSWORD="app-specific-password"

# Cloudinary
CLOUD_NAME="your-cloud-name"
CLOUD_API_KEY="your-api-key"
CLOUD_SECRET_KEY="your-secret-key"

# IntaSend (MPesa)
INTASEND_SECRET_KEY="your-secret-key"
INTASEND_PUBLISHABLE_KEY="your-public-key"
```
## Core Features

1. **User Management**
   - Role-based authentication (Buyer/Farmer/Admin)
   - JWT token authentication
   - Password reset functionality
   - Farmer verification system

2. **Product Management**
   - CRUD operations for agricultural products
   - Image upload to Cloudinary
   - Category management
   - Search and filter capabilities

3. **Order Processing**
   - Cart management
   - MPesa payment integration
   - Order status tracking
   - Email notifications

4. **Security Features**
   - Password hashing
   - JWT authentication
   - Input validation
   - CORS protection

## API Documentation

### Authentication Routes
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password
```

### Product Routes
```http
GET /api/product
POST /api/product
GET /api/product/:id
PUT /api/product/:id
DELETE /api/product/:id
```

### Order Routes
```http
POST /api/order
GET /api/order/my-orders
GET /api/order/farmer-orders
```

### User Routes
```http
GET /api/user/profile
PUT /api/user/profile
POST /api/user/farmer-request
```

Detailed API documentation available in the `docs` folder.

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Create Pull Request
