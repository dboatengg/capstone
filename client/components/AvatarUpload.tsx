'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AvatarUpload({
  currentImage,
  name,
  onUpload,
}: {
  currentImage: string | null;
  name: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await onUpload(file);
    setIsUploading(false);
    e.target.value = '';
  }

  const initials = name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <label
      htmlFor="avatar-upload"
      className={`relative block w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--color-stone-line)] group ${
        isUploading ? 'cursor-wait' : 'cursor-pointer'
      }`}
    >
      {currentImage ? (
        <Image src={currentImage} alt={name} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-[var(--color-forest)] flex items-center justify-center">
          <span className="text-white font-display text-2xl">{initials}</span>
        </div>
      )}

      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
          isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {isUploading ? (
          <svg className="animate-spin text-white" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <span className="text-white text-xs font-medium">Change</span>
        )}
      </div>

      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileSelect}
        className="hidden"
      />
    </label>
  );
}