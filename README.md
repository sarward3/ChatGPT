# Food Marketplace Backend

This repository contains a small Node.js backend built with Express and MongoDB. It now includes basic authentication, role-protected routes and an admin interface. While still simplified compared to systems like Foodpanda or Talabat, it demonstrates a more realistic foundation.

## Setup

1. Copy `.env.example` to `.env` and update your MongoDB connection string and `JWT_SECRET`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API Overview

These routes illustrate the basic structure of an e-commerce food app. Authentication uses JSON Web Tokens and passwords are hashed with bcrypt. Rate limiting and Helmet help secure requests.

- **POST /api/customers/register** – register new customer
- **POST /api/customers/login** – login and receive JWT
- **POST /api/customers/orders** – place order (authenticated)
- **POST /api/vendors/register** – register vendor
- **POST /api/vendors/login** – vendor login
- **POST /api/vendors/menu** – add menu item (authenticated)
- **GET /api/vendors/orders/:vendorId** – list vendor orders (authenticated)
- **GET /api/vendors/search?q=** – search vendors by name or cuisine
- **POST /api/riders/register** – register rider
- **POST /api/riders/login** – rider login
- **POST /api/riders/orders/:orderId/status** – update order status (authenticated)
- **POST /api/admin/register** – register admin
- **POST /api/admin/login** – admin login
- **GET /api/admin/orders** – list all orders (admin only)
- **GET /api/admin/analytics** – simple statistics (admin only)
- **POST /api/payments** – record payment for an order
- **POST /api/reviews** – submit rating/review for vendor (authenticated)

This codebase covers only a fraction of what a real marketplace like Foodpanda or Talabat requires. Building a full enterprise platform involves many more modules (search, payments, reviews, scheduling, operations dashboards, etc.). Treat this project as a foundation to build upon rather than a complete solution.
