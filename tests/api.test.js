const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Customer = require('../src/models/Customer');
const Vendor = require('../src/models/Vendor');
const Rider = require('../src/models/Rider');
const Admin = require('../src/models/Admin');
const Order = require('../src/models/Order');

let mongoServer;
let customerToken;
let vendorToken;
let riderToken;
let riderId;
let adminToken;
let vendorId;
let orderId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('register customer and login', async () => {
  const res = await request(app)
    .post('/api/customers/register')
    .send({ name: 'Alice', email: 'alice@example.com', password: 'pass123' })
    .expect(201);
  customerToken = res.body.token;
  expect(customerToken).toBeDefined();
});

test('register vendor and login', async () => {
  const res = await request(app)
    .post('/api/vendors/register')
    .send({ name: 'Pizza Place', email: 'pizza@example.com', password: 'secret' })
    .expect(201);
  vendorToken = res.body.token;
  const vendor = await Vendor.findOne({ email: 'pizza@example.com' });
  vendorId = vendor._id.toString();
  expect(vendorToken).toBeDefined();
});

let menuItemId;

test('vendor adds menu item', async () => {
  const res = await request(app)
    .post('/api/vendors/menu')
    .set('Authorization', `Bearer ${vendorToken}`)
    .send({ name: 'Fries', price: 5 })
    .expect(201);
  menuItemId = res.body._id;
  expect(res.body.name).toBe('Fries');
});

test('register rider and login', async () => {
  const res = await request(app)
    .post('/api/riders/register')
    .send({ name: 'Bob', phone: '123456', password: 'bike' })
    .expect(201);
  riderToken = res.body.token;
  const rider = await Rider.findOne({ phone: '123456' });
  riderId = rider._id.toString();
  expect(riderToken).toBeDefined();
});

test('register admin and login', async () => {
  const res = await request(app)
    .post('/api/admin/register')
    .send({ email: 'admin@example.com', password: 'admin' })
    .expect(201);
  adminToken = res.body.token;
  expect(adminToken).toBeDefined();
});

test('customer places order', async () => {
  const res = await request(app)
    .post('/api/customers/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ vendor: vendorId, items: [{ name: 'Pizza', quantity: 1, price: 10 }], total: 10 })
    .expect(201);
  orderId = res.body._id;
  expect(res.body.vendor).toBe(vendorId);
});

test('vendor views orders', async () => {
  const res = await request(app)
    .get(`/api/vendors/orders/${vendorId}`)
    .set('Authorization', `Bearer ${vendorToken}`)
    .expect(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('rider updates order status', async () => {
  const res = await request(app)
    .post(`/api/riders/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${riderToken}`)
    .send({ status: 'on_the_way' })
    .expect(200);
  expect(res.body.status).toBe('on_the_way');
});

test('admin lists all orders', async () => {
  const res = await request(app)
    .get('/api/admin/orders')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('search vendors', async () => {
  const res = await request(app)
    .get('/api/vendors/search?q=Pizza')
    .expect(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('search vendors by location', async () => {
  await Vendor.findByIdAndUpdate(vendorId, { location: { coordinates: [55, 25] } });
  const res = await request(app)
    .get('/api/vendors/search?lng=55&lat=25&distance=1000')
    .expect(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('record payment', async () => {
  const res = await request(app)
    .post('/api/payments')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ order: orderId, method: 'card', amount: 10 })
    .expect(201);
  expect(res.body.status).toBe('paid');
});

test('submit review', async () => {
  const res = await request(app)
    .post('/api/reviews')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ vendor: vendorId, order: orderId, rating: 5, comment: 'Great!' })
    .expect(201);
  expect(res.body.rating).toBe(5);
});

test('admin analytics', async () => {
  const res = await request(app)
    .get('/api/admin/analytics')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.orders).toBeGreaterThan(0);
  expect(res.body.revenue).toBeGreaterThan(0);
});

test('admin creates coupon', async () => {
  const res = await request(app)
    .post('/api/admin/coupons')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ code: 'DISCOUNT10', discountPct: 10 })
    .expect(201);
  expect(res.body.code).toBe('DISCOUNT10');
});

test('customer tops up wallet', async () => {
  const res = await request(app)
    .post('/api/customers/wallet')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ amount: 20 })
    .expect(200);
  expect(res.body.walletBalance).toBe(20);
});

test('customer places order with coupon', async () => {
  const res = await request(app)
    .post('/api/customers/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ vendor: vendorId, items: [{ name: 'Burger', quantity: 1, price: 20 }], total: 20, couponCode: 'DISCOUNT10' })
    .expect(201);
  expect(res.body.finalTotal).toBe(18);
});

test('customer creates support ticket', async () => {
  const res = await request(app)
    .post('/api/support')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ message: 'Help!' })
    .expect(201);
  expect(res.body.message).toBe('Help!');
});

test('customer views order history', async () => {
  const res = await request(app)
    .get('/api/customers/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(200);
  expect(res.body.length).toBeGreaterThan(0);
});

test('admin assigns rider', async () => {
  const res = await request(app)
    .post(`/api/admin/orders/${orderId}/assign/${riderId}`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.rider).toBeDefined();
});

test('vendor updates order status', async () => {
  const res = await request(app)
    .post(`/api/vendors/orders/${orderId}/status`)
    .set('Authorization', `Bearer ${vendorToken}`)
    .send({ status: 'ready' })
    .expect(200);
  expect(res.body.status).toBe('ready');
});

test('vendor updates menu item', async () => {
  const res = await request(app)
    .patch(`/api/vendors/menu/${menuItemId}`)
    .set('Authorization', `Bearer ${vendorToken}`)
    .send({ available: false })
    .expect(200);
  expect(res.body.available).toBe(false);
});

test('vendor updates profile', async () => {
  const res = await request(app)
    .patch('/api/vendors/profile')
    .set('Authorization', `Bearer ${vendorToken}`)
    .send({ openHours: '9-5' })
    .expect(200);
  expect(res.body.openHours).toBe('9-5');
});

test('rider earnings endpoint', async () => {
  const res = await request(app)
    .get('/api/riders/earnings')
    .set('Authorization', `Bearer ${riderToken}`)
    .expect(200);
  expect(res.body.earnings).toBeDefined();
});

test('admin lists users', async () => {
  const res = await request(app)
    .get('/api/admin/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.customers.length).toBeGreaterThan(0);
});

test('get single order', async () => {
  const res = await request(app)
    .get(`/api/customers/orders/${orderId}`)
    .set('Authorization', `Bearer ${customerToken}`)
    .expect(200);
  expect(res.body._id).toBe(orderId);
});

test('vendor analytics endpoint', async () => {
  const res = await request(app)
    .get('/api/vendors/analytics')
    .set('Authorization', `Bearer ${vendorToken}`)
    .expect(200);
  expect(res.body.orders).toBeDefined();
});

test('admin vendor analytics', async () => {
  const res = await request(app)
    .get(`/api/admin/vendors/${vendorId}/analytics`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.orders).toBeDefined();
});

test('resolve support ticket', async () => {
  const tickets = await request(app)
    .get('/api/support')
    .set('Authorization', `Bearer ${adminToken}`);
  const ticketId = tickets.body[0]._id;
  const res = await request(app)
    .patch(`/api/support/${ticketId}/resolve`)
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);
  expect(res.body.resolved).toBe(true);
});
