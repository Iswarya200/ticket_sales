require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'eventtracker',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

async function getStats() {
  const result = await pool.query('SELECT * FROM orders');

  let totalRevenue = 0;
  let refundCount = 0;
  let refundAmount = 0;
  let paymentMethods = {};

  result.rows.forEach(order => {
    if (order.status === 'SUCCESS') {
      totalRevenue += order.amount;
    }
    if (order.refund) {
      refundCount++;
      refundAmount += order.amount;
    }
    if (paymentMethods[order.method]) {
      paymentMethods[order.method]++;
    } else {
      paymentMethods[order.method] = 1;
    }
  });

  return { totalRevenue, refundCount, refundAmount, paymentMethods };
}

// ✅ Export both pool and getStats
module.exports = {
  pool,
  getStats
};
