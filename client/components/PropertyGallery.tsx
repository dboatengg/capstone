'use client';

import { useState, useEffect } from 'react';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  function openLightbox(index: number) {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  }

  function showNext() {
    setActiveIndex((i) => (i + 1) % images.length);
  }

  function showPrev() {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }

  // Keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div>
      {/* Hero image area */}
      <div className="relative h-64 sm:h-96 bg-[var(--color-ink)] overflow-hidden">
        {images.length > 0 ? (
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label="View full-size image"
          >
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </button>
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

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => openLightbox(index)}
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

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-ink)]/95 px-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[var(--color-paper)] hover:text-[var(--color-brass)] transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M7 7L21 21M21 7L7 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {images.length > 1 && (
            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 text-[var(--color-paper)]/60 text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </span>
          )}

          <div className="relative w-full max-w-4xl h-[70vh]">
            <Image
              src={images[activeIndex]}
              alt={title}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-[var(--color-paper)] hover:text-[var(--color-brass)] transition-colors p-2"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M20 8L12 16L20 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-[var(--color-paper)] hover:text-[var(--color-brass)] transition-colors p-2"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M12 8L20 16L12 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-1.5 mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                    className={`h-1.5 transition-all ${
                      index === activeIndex
                        ? 'w-6 bg-[var(--color-brass)]'
                        : 'w-1.5 bg-[var(--color-paper)]/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}