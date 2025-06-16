# Food Marketplace Backend

This is a simplified Node.js backend for a food ecommerce marketplace. It uses Express and MongoDB via Mongoose.

## Setup

1. Copy `.env.example` to `.env` and adjust the MongoDB connection string if necessary.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```

## API Endpoints

- **POST /api/customers/register** – create customer
- **POST /api/customers/login** – login customer
- **POST /api/customers/orders** – create order
- **POST /api/vendors/register** – create vendor
- **POST /api/vendors/login** – login vendor
- **POST /api/vendors/menu** – add menu item
- **GET /api/vendors/orders/:vendorId** – list vendor orders
- **POST /api/riders/register** – create rider
- **POST /api/riders/login** – login rider
- **POST /api/riders/orders/:orderId/status** – update order status

This repository only contains a minimal implementation as a starting point for further development.
