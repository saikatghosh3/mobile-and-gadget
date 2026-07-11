import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/mongodb';

/**
 * POST /api/categories/fix-indexes
 * Drops ALL legacy single-field unique indexes on name & slug,
 * then ensures the correct compound (slug + parent) unique index exists.
 * Safe to run multiple times.
 */
export async function POST() {
  try {
    await connectDB();
    const db         = mongoose.connection.db;
    const collection = db.collection('categories');

    const indexes  = await collection.indexes();
    const dropped  = [];
    const skipped  = [];

    for (const idx of indexes) {
      if (idx.name === '_id_') continue; // never touch _id

      const keys = Object.keys(idx.key || {});

      // Drop any OLD single-field unique indexes on name or slug
      const isOldNameUnique = idx.unique && keys.length === 1 && keys[0] === 'name';
      const isOldSlugUnique = idx.unique && keys.length === 1 && keys[0] === 'slug';

      if (isOldNameUnique || isOldSlugUnique) {
        await collection.dropIndex(idx.name);
        dropped.push(idx.name);
        continue;
      }

      // Drop OLD compound (slug + parent) if it exists under a different name so we can recreate clean
      const isOldCompound =
        idx.unique &&
        keys.length === 2 &&
        idx.key.slug === 1 &&
        idx.key.parent !== undefined &&
        idx.name !== 'slug_1_parent_1';
      if (isOldCompound) {
        await collection.dropIndex(idx.name);
        dropped.push(idx.name);
        continue;
      }

      skipped.push(idx.name);
    }

    // Ensure correct compound unique index exists
    await collection.createIndex(
      { slug: 1, parent: 1 },
      { unique: true, name: 'slug_1_parent_1', background: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Index migration complete',
      dropped,
      skipped,
      created: ['slug_1_parent_1 (compound unique)'],
    });
  } catch (error) {
    console.error('Index fix error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
