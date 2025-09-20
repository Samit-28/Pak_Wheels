# 🚗 PakWheels Backend

[![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-lightblue?logo=cloudinary)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A **backend service** for a PakWheels clone, built with **Next.js API Routes** and **Prisma ORM**.  
It provides secure authentication, user management, car listings, image uploads (via Cloudinary), and wishlist functionality.

---

## 🌐 Live API

**Base URL:**  
👉 [https://pakwheels-backend.vercel.app/api](https://pakwheels-backend.vercel.app/api)

---

## 🏗️ Tech Stack

- ⚡ **Next.js API Routes** – Serverless backend  
- 🗄️ **Prisma ORM** – Database ORM  
- 🔐 **JWT** – Authentication & authorization  
- 🔑 **Bcrypt** – Password hashing  
- 🖼️ **Cloudinary** – Image storage  
- 📝 **TypeScript** – Type safety  
- ▲ **Vercel** – Hosting  

---

## 📂 Project Structure

```bash
/api
  ├── auth.ts          # Login
  ├── users.ts         # Create & list users
  ├── users/[id].ts    # Get / Update / Delete user
  ├── cars.ts          # List / Create cars
  ├── cars/[id].ts     # Get / Update / Delete car
  ├── cars/upload.ts   # Image upload (Cloudinary)
  └── wishlist.ts      # Add / Remove wishlist

/lib
  ├── auth.ts          # JWT helpers
  ├── cloudinary.ts    # Cloudinary integration
  ├── cors.ts          # CORS middleware
  ├── errors.ts        # Error formatting
  ├── prisma.ts        # Prisma client
  └── validation.ts    # Input validation

/document
  └── PakWheels.postman_collection.json  # Postman collection

/prisma
  └── migrations/      # Prisma migrations
```

---

## 📖 API Overview

### 🔑 Authentication
- `POST /auth` → Login user (❌ no auth required)

### 👤 Users
- `POST /users` → Register new user (❌)  
- `GET /users` → List all users (✅ admin only)  
- `GET /users/:id` → Get user by ID (✅ auth required)  
- `PUT /users/:id` → Update user profile (✅ self/admin)  
- `DELETE /users/:id` → Delete user account (✅ self/admin)  

### 🚘 Cars
- `GET /cars` → List all cars (❌)  
- `POST /cars` → Create new listing (✅ seller)  
- `GET /cars/:id` → Get car details (❌)  
- `PUT /cars/:id` → Update car details (✅ owner)  
- `DELETE /cars/:id` → Delete car listing (✅ owner)  

### 🖼️ Image Upload
- `POST /cars/upload` → Upload car image to Cloudinary (✅ seller)  

### ❤️ Wishlist
- `POST /wishlist` → Add car to wishlist (✅ auth required)  
- `DELETE /wishlist` → Remove from wishlist (✅ auth required)  

---

## 🚀 Local Development

1. **Clone the repo**
```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pakwheels
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Run migrations**
```bash
npx prisma migrate dev
```

5. **Start the dev server with Vercel**
```bash
vercel login
vercel dev
```

Server runs locally at → `http://localhost:3000/api`

---

## 🧪 Testing with Postman

📂 Use the provided Postman collection:  
`/document/PakWheels.postman_collection.json`

### Example Flow
1. Register a user → `POST /api/users`  
2. Login → `POST /api/auth` → copy token  
3. Create a car → `POST /api/cars` (with Bearer token)  
4. Upload an image → `POST /api/cars/upload` (form-data)  
5. Add to wishlist → `POST /api/wishlist`  

---

## 📦 Deployment

Deployed on **Vercel** →  
👉 [https://pakwheels-backend.vercel.app/api](https://pakwheels-backend.vercel.app/api)

To redeploy:  
- Configure env variables in Vercel dashboard  
- Routes are auto-deployed  

---

## 🔒 Notes

- Use a **strong JWT_SECRET** in production  
- Restrict **CORS origins** (default is `*`)  
- For large images, prefer direct **frontend → Cloudinary** uploads  

