
const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const { pool, getStats } = require('./data');

//const { getStats } = require('./data');
const app = express();
app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: 'rzp_test_yI4AK1F1zVrJEn',
  key_secret: 'T5W6UFwUUyCtHSuBDDExGMxo',
});

app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save to DB
    await pool.query(
      `INSERT INTO orders (order_id, amount, currency, receipt, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, order.amount, order.currency, order.receipt, order.status]
    );

    res.json({ message: 'Order created and saved!', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Razorpay backend is working!');
});
app.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();

    const table = `
      <h2>📊 Payment Statistics</h2>
      <table border="1" cellspacing="0" cellpadding="8">
        <tr><th>Total Revenue</th><td>₹${stats.totalRevenue}</td></tr>
        <tr><th>Refund Count</th><td>${stats.refundCount}</td></tr>
        <tr><th>Total Refunded Amount</th><td>₹${stats.refundAmount}</td></tr>
        <tr>
          <th>Payment Methods</th>
          <td>
            <ul>
              ${Object.entries(stats.paymentMethods).map(([method, count]) => `<li>${method}: ${count}</li>`).join('')}
            </ul>
          </td>
        </tr>
      </table>
    `;

    res.send(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/create-order', async (req, res) => {
  try {
    const amount = 500; // default ₹500 for testing
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    // 👇 Send response as a basic HTML table
    res.send(`
      <h2>✅ Razorpay Order Created</h2>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Order ID</td><td>${order.id}</td></tr>
        <tr><td>Amount</td><td>₹${order.amount / 100}</td></tr>
        <tr><td>Currency</td><td>${order.currency}</td></tr>
        <tr><td>Receipt</td><td>${order.receipt}</td></tr>
        <tr><td>Status</td><td>${order.status}</td></tr>
      </table>
    `);
  } catch (err) {
    res.status(500).send(`<h3>Error: ${err.message}</h3>`);
  }
});

app.get('/stats', async (req, res) => {
  try {
    const totalRevenueResult = await pool.query(`SELECT SUM(amount) as total_revenue FROM orders WHERE status = 'created'`);
    const totalOrdersResult = await pool.query(`SELECT COUNT(*) as total_orders FROM orders`);
    
    res.json({
      total_revenue: totalRevenueResult.rows[0].total_revenue / 100,
      total_orders: totalOrdersResult.rows[0].total_orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Razorpay backend running on port 3000"));
