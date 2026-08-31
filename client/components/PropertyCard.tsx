import Link from 'next/link';
import Image from 'next/image';
import { Property } from '../lib/types';

export default function PropertyCard({ property }: { property: Property }) {
  const isForRent = property.type === 'rent';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block bg-white border border-[var(--color-stone-line)] overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Colored edge indicates rent vs sale at a glance */}
      <div className="flex">
        <div
          className={`w-1.5 shrink-0 ${isForRent ? 'bg-[var(--color-forest)]' : 'bg-[var(--color-brass)]'}`}
        />
        <div className="flex-1">
          {/* Placeholder image block — patterned, keyed to location, until real photos exist */}
          <div className="relative h-44 bg-[var(--color-ink)] flex items-end p-4 overflow-hidden">
            {property.images.length > 0 ? (
              <Image
                fill
                src={property.images[0]}
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(239,235,226,0.4) 12px, rgba(239,235,226,0.4) 13px)',
                }}
              />
            )}

            {!property.available && (
              <span className="absolute top-3 right-3 bg-[var(--color-clay)] text-white text-xs font-medium px-2 py-1 z-10">
                Unavailable
              </span>
            )}
          </div>

          <div className="p-5">
            <h2 className="font-display text-xl leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-forest)] transition-colors">
              {property.title}
            </h2>
            <p className="text-sm text-[var(--color-ink)]/70 mt-1 line-clamp-2">
              {property.shortDescription}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-[var(--color-ink)]/60">
                {property.bedrooms} bed · {property.bathrooms} bath
              </span>

              {/* Signature price badge — angular clipped corner, brass tone */}
              <span
                className="bg-[var(--color-brass)] text-white text-sm font-semibold px-3 py-1"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)' }}
              >
                GHS {property.price.toLocaleString()}{isForRent && '/mo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}