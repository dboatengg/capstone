'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative h-64 sm:h-96 bg-[var(--color-ink)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(239,235,226,0.4) 12px, rgba(239,235,226,0.4) 13px)',
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Main featured image */}
      <div className="relative h-64 sm:h-96 bg-[var(--color-ink)] overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Thumbnail strip — only shown when there's more than one image */}
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