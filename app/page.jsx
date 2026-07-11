import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Banner from '@/models/Banner';
import Advertisement from '@/models/Advertisement';
import HomeContent from '@/components/HomeContent';

async function getHomeData() {
  try {
    await connectDB();

    const CategoryModel = await Category();
    const ProductModel = await Product();
    const BannerModel = await Banner();
    const AdvertisementModel = await Advertisement();

    const [categoriesTree, featuredProducts, topSellingProducts, newArrivalProducts, banners, ads] = await Promise.all([
      (async () => {
        const mainCategories = await CategoryModel.find({ parent: null }).sort({ order: 1, name: 1 }).lean();
        const subcategories = await CategoryModel.find({ parent: { $ne: null } }).sort({ order: 1, name: 1 }).lean();
        return mainCategories.map((cat) => ({
          ...cat,
          _id: cat._id.toString(),
          parent: cat.parent?.toString() || null,
          subcategories: subcategories
            .filter((sub) => sub.parent?.toString() === cat._id.toString())
            .map((sub) => ({
              ...sub,
              _id: sub._id.toString(),
              parent: sub.parent?.toString() || null,
            })),
        }));
      })(),

      ProductModel.find({ isFeatured: true, isActive: true })
        .populate('category', 'name slug icon')
        .populate('subCategory', 'name slug icon')
        .sort({ createdAt: -1 })
        .limit(8)
        .lean()
        .then((products) =>
          products.map((p) => ({
            ...p,
            _id: p._id.toString(),
            category: p.category ? { ...p.category, _id: p.category._id.toString() } : null,
            subCategory: p.subCategory ? { ...p.subCategory, _id: p.subCategory._id.toString() } : null,
          }))
        ),

      ProductModel.find({ isTopSelling: true, isActive: true })
        .populate('category', 'name slug icon')
        .populate('subCategory', 'name slug icon')
        .sort({ createdAt: -1 })
        .limit(4)
        .lean()
        .then((products) =>
          products.map((p) => ({
            ...p,
            _id: p._id.toString(),
            category: p.category ? { ...p.category, _id: p.category._id.toString() } : null,
            subCategory: p.subCategory ? { ...p.subCategory, _id: p.subCategory._id.toString() } : null,
          }))
        ),

      ProductModel.find({ isNewArrival: true, isActive: true })
        .populate('category', 'name slug icon')
        .populate('subCategory', 'name slug icon')
        .sort({ createdAt: -1 })
        .limit(4)
        .lean()
        .then((products) =>
          products.map((p) => ({
            ...p,
            _id: p._id.toString(),
            category: p.category ? { ...p.category, _id: p.category._id.toString() } : null,
            subCategory: p.subCategory ? { ...p.subCategory, _id: p.subCategory._id.toString() } : null,
          }))
        ),

      BannerModel.find({ isActive: true })
        .populate('product', 'name slug images price')
        .lean()
        .then((banners) =>
          banners.map((b) => ({
            ...b,
            _id: b._id.toString(),
            product: b.product ? { ...b.product, _id: b.product._id.toString() } : null,
          }))
        ),

      AdvertisementModel.find({
        placement: 'hero',
        isActive: true,
      })
        .lean()
        .then((ads) =>
          ads.map((a) => ({
            ...a,
            _id: a._id.toString(),
          }))
        ),
    ]);

    return {
      categories: categoriesTree,
      featuredProducts,
      topSellingProducts,
      newArrivalProducts,
      banners,
      ads,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      categories: [],
      featuredProducts: [],
      topSellingProducts: [],
      newArrivalProducts: [],
      banners: [],
      ads: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <HomeContent
      categories={data.categories}
      featuredProducts={data.featuredProducts}
      topSellingProducts={data.topSellingProducts}
      newArrivalProducts={data.newArrivalProducts}
      banners={data.banners}
      ads={data.ads}
    />
  );
}
