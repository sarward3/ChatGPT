# Food Marketplace Backend

This repository contains a Node.js backend built with Express and MongoDB. Along with authentication and role protected routes, it now covers more advanced features such as coupons, wallet payments, scheduled orders and geolocation search. While still a demonstration, the code illustrates pieces of an enterprise grade platform.

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

These routes illustrate the basic structure of an e-commerce food app. Authentication uses JSON Web Tokens and passwords are hashed with bcrypt. Rate limiting and Helmet help secure requests. Socket.IO provides real-time order updates.

- **POST /api/customers/register** – register new customer
- **POST /api/customers/login** – login and receive JWT
- **POST /api/customers/orders** – place order (authenticated)
- **POST /api/customers/wallet** – top up wallet balance
- **GET /api/customers/wallet** – view wallet balance
- **POST /api/vendors/register** – register vendor
- **POST /api/vendors/login** – vendor login
- **POST /api/vendors/menu** – add menu item (authenticated)
- **GET /api/vendors/menu/:vendorId** – list menu for vendor
- **PATCH /api/vendors/menu/:itemId** – update menu item (authenticated)
- **GET /api/vendors/orders/:vendorId** – list vendor orders (authenticated)
- **POST /api/vendors/orders/:orderId/status** – update order status (authenticated)
- **GET /api/vendors/search?q=&lng=&lat=&distance=** – search vendors with optional text and location filter
- **POST /api/vendors/coupons** – vendor issue coupon (authenticated)
- **PATCH /api/vendors/profile** – update vendor profile (authenticated)
- **GET /api/vendors/analytics** – vendor revenue stats (authenticated)
- **POST /api/riders/register** – register rider
- **POST /api/riders/login** – rider login
- **POST /api/riders/orders/:orderId/status** – update order status (authenticated)
- **GET /api/riders/earnings** – view rider earnings
- **GET /api/riders/orders/:orderId/route** – get routing info for delivery
- **POST /api/admin/register** – register admin
- **POST /api/admin/login** – admin login
- **GET /api/admin/orders** – list all orders (admin only)
- **POST /api/admin/orders/:orderId/assign/:riderId** – assign rider to order (admin only)
- **GET /api/admin/analytics** – simple statistics (admin only)
- **GET /api/admin/analytics/dashboard** – revenue and order breakdowns (admin only)
- **GET /api/admin/vendors/:id/analytics** – vendor revenue stats (admin only)
- **GET /api/admin/users** – list all users
- **POST /api/admin/coupons** – create system-wide coupon
- **POST /api/payments** – record payment for an order
- **POST /api/reviews** – submit rating/review for vendor (authenticated)
- **POST /api/support** – create support ticket
- **PATCH /api/support/:id/resolve** – mark ticket resolved (admin)
- **GET /api/customers/orders** – order history (authenticated)
- **GET /api/customers/orders/:id** – fetch single order (authenticated)

This codebase remains a demonstration. While additional pieces like coupons, wallet support and support tickets are present, a production system would require much deeper integrations and extensive testing. Push notifications are implemented using a placeholder service and real-time updates use Socket.IO.
