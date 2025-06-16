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

test('register rider and login', async () => {
  const res = await request(app)
    .post('/api/riders/register')
    .send({ name: 'Bob', phone: '123456', password: 'bike' })
    .expect(201);
  riderToken = res.body.token;
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
});
