import Link from 'next/link';

export default function SectionBanner({ banner }) {
  if (!banner || !banner.image) return null;
  const href = banner.product
    ? `/product/${banner.product.slug}`
    : '/shop';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link href={href} className="block relative w-full overflow-hidden rounded-xl group">
        <div className="relative aspect-[4/1] min-h-[160px] md:min-h-[200px]">
          <img
            src={banner.image}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </div>
  );
}
