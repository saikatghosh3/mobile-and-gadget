import { NextResponse } from 'next/server';
import Product from '../../../models/Product';
import Category from '../../../models/Category';
import { requireAdmin } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const sort = searchParams.get('sort');
    const isFeatured = searchParams.get('isFeatured');
    const isTopSelling = searchParams.get('isTopSelling');
    const isNewArrival = searchParams.get('isNewArrival');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const ProductModel = await Product();
    const CategoryModel = await Category();

    const admin = searchParams.get('admin') === 'true';
    const conditions = [];

    if (!admin) {
      conditions.push({ isActive: true });
    }

    if (isFeatured === 'true') {
      conditions.push({ isFeatured: true });
    }
    if (isTopSelling === 'true') {
      conditions.push({ isTopSelling: true });
    }
    if (isNewArrival === 'true') {
      conditions.push({ isNewArrival: true });
    }

    if (slug) {
      conditions.push({ slug });
    }

    if (category) {
      const categoryDocs = await CategoryModel.find({ slug: category });
      if (categoryDocs.length > 0) {
        const categoryIds = categoryDocs.map((c) => c._id);
        
        // Find subcategories belonging to these categories
        const subCats = await CategoryModel.find({ parent: { $in: categoryIds } });
        const subCatSlugs = subCats.map((c) => c.slug);
        
        // Get all matching category IDs (main, sub, and legacy flat versions matching same slugs)
        const allSlugs = [category, ...subCatSlugs];
        const allMatchingCats = await CategoryModel.find({ slug: { $in: allSlugs } });
        const allTargetCategoryIds = allMatchingCats.map((c) => c._id);
        
        conditions.push({
          $or: [
            { category: { $in: allTargetCategoryIds } },
            { subCategory: { $in: allTargetCategoryIds } }
          ]
        });
      }
    }

    if (brand) {
      conditions.push({ brand: new RegExp(brand, 'i') });
    }

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = parseFloat(minPrice);
      if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
      conditions.push({ price: priceQuery });
    }

    if (search) {
      conditions.push({ $text: { $search: search } });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    let sortOption = {};
    const isTextSearch = !!search;
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = isTextSearch
          ? { score: { $meta: 'textScore' }, createdAt: -1 }
          : { createdAt: -1 };
    }

    const all = searchParams.get('all') === 'true' || admin;
    const skip = (page - 1) * limit;

    let queryBuilder = ProductModel.find(query, isTextSearch ? { score: { $meta: 'textScore' } } : {})
      .populate('category', 'name slug icon')
      .populate('subCategory', 'name slug icon')
      .sort(sortOption);

    if (!all) {
      queryBuilder = queryBuilder.skip(skip).limit(limit);
    }

    let products;
    let usedFallback = false;
    try {
      products = await queryBuilder;
    } catch (textErr) {
      if (search && textErr.message && textErr.message.includes('text index')) {
        usedFallback = true;
        const fallbackConditions = conditions.filter((c) => !c.$text);
        const re = new RegExp(search, 'i');
        const matchingCategories = await CategoryModel.find({ name: re });
        const matchingCategoryIds = matchingCategories.map((c) => c._id);
        fallbackConditions.push({
          $or: [
            { name: re },
            { description: re },
            { brand: re },
            { category: { $in: matchingCategoryIds } },
            { subCategory: { $in: matchingCategoryIds } },
          ],
        });
        const fallbackQuery = { $and: fallbackConditions };
        let fbBuilder = ProductModel.find(fallbackQuery)
          .populate('category', 'name slug icon')
          .populate('subCategory', 'name slug icon')
          .sort(sortOption);
        if (!all) {
          fbBuilder = fbBuilder.skip(skip).limit(limit);
        }
        products = await fbBuilder;
      } else {
        throw textErr;
      }
    }

    let total;
    if (usedFallback) {
      const re = new RegExp(search, 'i');
      const matchingCategories = await CategoryModel.find({ name: re });
      const matchingCategoryIds = matchingCategories.map((c) => c._id);
      const countQuery = { $and: conditions.filter((c) => !c.$text).concat([{
        $or: [
          { name: re },
          { description: re },
          { brand: re },
          { category: { $in: matchingCategoryIds } },
          { subCategory: { $in: matchingCategoryIds } },
        ],
      }]) };
      total = await ProductModel.countDocuments(countQuery);
    } else {
      total = await ProductModel.countDocuments(query);
    }

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

async function postHandler(request) {
  try {
    const body = await request.json();
    const ProductModel = await Product();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingProduct = await ProductModel.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product with this name already exists' },
        { status: 400 }
      );
    }

    const product = await ProductModel.create({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export const POST = requireAdmin(postHandler);
