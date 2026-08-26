'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PropertyGallery({
  images,
  title,
  location,
  isAvailable,
}: {
  images: string[];
  title: string;
  location: string;
  isAvailable: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Hero image area — location label and availability badge live ONLY here */}
      <div className="relative h-64 sm:h-96 bg-[var(--color-ink)] overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[activeIndex]}
            alt={title}
            fill
            priority
            className="object-cover"
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

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 pointer-events-none">
          <span className="text-[var(--color-paper)] text-sm font-medium tracking-wide uppercase">
            {location}
          </span>
        </div>

        {!isAvailable && (
          <span className="absolute top-4 right-4 bg-[var(--color-clay)] text-white text-xs font-medium px-2 py-1">
            Unavailable
          </span>
        )}
      </div>

      {/* Thumbnail strip — sits BELOW the hero, fully separate, nothing overlapping it */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative shrink-0 w-20 h-16 overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? 'border-[var(--color-forest)]'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}