import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = readFileSync(join(__dirname, '.env'), 'utf8');
const mongoUri = envContent.split('MONGODB_URI=')[1]?.split('\n')[0]?.split('\r')[0]?.trim();

try {
  await mongoose.connect(mongoUri);
  console.log('Database connected successfully.');

  const couponCollection = mongoose.connection.db.collection('coupons');
  const code = 'SAVE5GTMY8';
  const coupon = await couponCollection.findOne({ code });
  if (!coupon) {
    throw new Error('Coupon not found');
  }

  // Helper to get date parts in Bangladesh time (GMT+6)
  const getBstDateParts = (dateVal) => {
    const date = new Date(dateVal);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find(p => p.type === 'year').value, 10);
    const month = parseInt(parts.find(p => p.type === 'month').value, 10);
    const day = parseInt(parts.find(p => p.type === 'day').value, 10);
    return new Date(Date.UTC(year, month - 1, day));
  };

  const currentDateBst = getBstDateParts(new Date());

  // Check expiry date
  if (coupon.expiryDate) {
    const couponExpiryDate = getBstDateParts(coupon.expiryDate);
    console.log('Expiry comparison:', couponExpiryDate.toISOString(), 'vs now:', currentDateBst.toISOString());
    if (couponExpiryDate < currentDateBst) {
      console.log('FAIL: expired');
    } else {
      console.log('PASS: expiry check');
    }
  }

  // Check start date
  if (coupon.startDate) {
    const couponStartDate = getBstDateParts(coupon.startDate);
    console.log('Start comparison:', couponStartDate.toISOString(), 'vs now:', currentDateBst.toISOString());
    if (couponStartDate > currentDateBst) {
      console.log('FAIL: not yet valid');
    } else {
      console.log('PASS: start date check');
    }
  }

  console.log('Simulation complete!');
} catch (err) {
  console.error('Error occurred:', err);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}
