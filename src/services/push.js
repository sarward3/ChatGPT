// Placeholder push notification service
module.exports.sendPush = async function(deviceToken, message) {
  // Integrate with FCM/APNs in production
  console.log(`Push to ${deviceToken}: ${message}`);
  return { success: true };
};
