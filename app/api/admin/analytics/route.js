import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { requireAdmin } from '../../../../lib/auth';

function getDateGroupFormat(period) {
  switch (period) {
    case 'weekly':
      return { format: '%Y-%U', group: { $isoWeek: '$createdAt' } };
    case 'monthly':
      return { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    case 'daily':
    default:
      return { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  }
}

async function getHandler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily';

    const OrderModel = await Order();
    const UserModel = await User();
    const ProductModel = await Product();

    const dateFormat = getDateGroupFormat(period);

    const dateGroup = { $dateToString: { format: period === 'monthly' ? '%Y-%m' : '%Y-%m-%d', date: '$createdAt' } };

    const [salesOverview, orderStatus, userRegistrations, categoryDistribution, topSelling, revenueExpense] =
      await Promise.all([
        OrderModel.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $group: { _id: dateGroup, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $limit: 365 },
        ]),

        OrderModel.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        UserModel.aggregate([
          { $group: { _id: dateGroup, count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $limit: 365 },
        ]),

        ProductModel.aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryInfo',
            },
          },
          { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: '$categoryInfo.name',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),

        OrderModel.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.name',
              quantity: { $sum: '$items.quantity' },
              revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            },
          },
          { $sort: { quantity: -1 } },
          { $limit: 10 },
        ]),

        OrderModel.aggregate([
          {
            $group: {
              _id: dateGroup,
              revenue: { $sum: '$total' },
              expense: { $sum: { $add: ['$shipping', '$couponDiscount'] } },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 365 },
        ]),
      ]);

    const totalProducts = categoryDistribution.reduce((sum, c) => sum + c.count, 0);
    const categoryDistWithPercent = categoryDistribution.map((c) => ({
      category: c._id || 'Uncategorized',
      count: c.count,
      percentage: totalProducts > 0 ? Math.round((c.count / totalProducts) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        salesOverview: salesOverview.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })),
        orderStatus: orderStatus.map((d) => ({ status: d._id, count: d.count })),
        userRegistrations: userRegistrations.map((d) => ({ date: d._id, count: d.count })),
        categoryDistribution: categoryDistWithPercent,
        topSelling: topSelling.map((d) => ({ product: d._id, quantity: d.quantity, revenue: d.revenue })),
        revenueExpense: revenueExpense.map((d) => ({ date: d._id, revenue: d.revenue, expense: d.expense })),
      },
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const GET = requireAdmin(getHandler);
