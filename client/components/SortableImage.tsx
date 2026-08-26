'use client';

import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableImage({
  url,
  isFirst,
  onDelete,
}: {
  url: string;
  isFirst: boolean;
  onDelete: (url: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative w-full h-24 cursor-grab active:cursor-grabbing touch-none"
    >
      <Image src={url} fill alt="" className="object-cover pointer-events-none" />

      {isFirst && (
        <span className="absolute bottom-1 left-1 bg-[var(--color-forest)] text-white text-[10px] font-medium px-1.5 py-0.5 uppercase tracking-wide">
          Main
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(url);
        }}
        className="absolute top-1 right-1 bg-[var(--color-clay)] text-white text-xs px-2 py-1 z-10"
      >
        ✕
      </button>
    </div>
  );
}