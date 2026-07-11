import { NextResponse } from 'next/server';
import Category from '../../../../models/Category';

const DEFAULT_MAIN_CATEGORIES = [
  { name: 'Phones', icon: '📱', order: 1 },
  { name: 'Mac', icon: '💻', order: 2 },
  { name: 'Phone Accessories', icon: '🔌', order: 3 },
  { name: 'Tablets', icon: '📟', order: 4 },
  { name: 'Cases & Protectors', icon: '🛡️', order: 5 },
  { name: 'Watches', icon: '⌚', order: 6 },
  { name: 'Headphone & Speaker', icon: '🎧', order: 7 },
  { name: 'PC Accessories', icon: '🖥️', order: 8 },
  { name: 'Camera', icon: '📷', order: 9 },
  { name: 'Gadget', icon: '🔧', order: 10 },
  { name: 'Networking', icon: '🌐', order: 11 },
  { name: 'Gaming', icon: '🎮', order: 12 },
  { name: 'Drone', icon: '🚁', order: 13 },
];

export async function POST() {
  try {
    const CategoryModel = await Category();
    const results = { created: [], skipped: [] };

    for (const cat of DEFAULT_MAIN_CATEGORIES) {
      const slug = cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existing = await CategoryModel.findOne({ slug, parent: null });
      if (existing) {
        results.skipped.push(cat.name);
        continue;
      }

      await CategoryModel.create({
        name: cat.name,
        slug,
        icon: cat.icon,
        order: cat.order,
        parent: null,
        showOnHome: true,
      });
      results.created.push(cat.name);
    }

    return NextResponse.json({
      success: true,
      message: `Created: ${results.created.length}, Skipped (already exist): ${results.skipped.length}`,
      created: results.created,
      skipped: results.skipped,
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
}
