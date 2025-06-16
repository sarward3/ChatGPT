// Placeholder payment integration
module.exports.processCardPayment = async function(order, amount) {
  // In production, integrate with Stripe/PayTabs/etc.
  // Here we simply resolve to success after a short delay.
  await new Promise(res => setTimeout(res, 10));
  return { id: 'mock_txn', status: 'success', amount };
};
