# Food Marketplace Backend

This repository contains a Node.js backend built with Express and MongoDB. Along with authentication and role protected routes, it now covers more advanced features such as coupons, wallet payments and support tickets. While still a demonstration, the code illustrates pieces of an enterprise grade platform.

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
- **POST /api/customers/wallet** – top up wallet balance
- **GET /api/customers/wallet** – view wallet balance
- **POST /api/vendors/register** – register vendor
- **POST /api/vendors/login** – vendor login
- **POST /api/vendors/menu** – add menu item (authenticated)
- **GET /api/vendors/orders/:vendorId** – list vendor orders (authenticated)
- **GET /api/vendors/search?q=** – search vendors by name or cuisine
- **POST /api/vendors/coupons** – vendor issue coupon (authenticated)
- **POST /api/riders/register** – register rider
- **POST /api/riders/login** – rider login
- **POST /api/riders/orders/:orderId/status** – update order status (authenticated)
- **POST /api/admin/register** – register admin
- **POST /api/admin/login** – admin login
- **GET /api/admin/orders** – list all orders (admin only)
- **GET /api/admin/analytics** – simple statistics (admin only)
- **POST /api/admin/coupons** – create system-wide coupon
- **POST /api/payments** – record payment for an order
- **POST /api/reviews** – submit rating/review for vendor (authenticated)
- **POST /api/support** – create support ticket

This codebase remains a demonstration. While additional pieces like coupons, wallet support and support tickets are present, a production system would require much deeper integrations and extensive testing.
