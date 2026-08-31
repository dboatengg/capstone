'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getProperty,
  updateProperty,
  getAgents,
  uploadPropertyImages,
  deletePropertyImage,
  reorderPropertyImages,
} from '@/lib/api';
import { AdminAgent } from '@/lib/types';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableImage from '@/components/SortableImage';

export default function AdminEditPropertyPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [agents, setAgents] = useState<AdminAgent[]>([]);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'sale' | 'rent'>('sale');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [available, setAvailable] = useState(true);
  const [agentId, setAgentId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_IMAGES = 12;
  const remainingSlots = MAX_IMAGES - images.length;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    if (!token) return;

    Promise.all([getProperty(params.id), getAgents(token)]).then(([property, agentList]) => {
      if (!property) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setTitle(property.title);
      setShortDescription(property.shortDescription);
      setLongDescription(property.longDescription);
      setPrice(String(property.price));
      setType(property.type as 'sale' | 'rent');
      setBedrooms(String(property.bedrooms));
      setBathrooms(String(property.bathrooms));
      setLocation(property.location);
      setAvailable(property.available);
      setAgentId(property.agent.id);
      setImages(property.images);
      setAgents(agentList ?? []);
      setIsLoading(false);
    });
  }, [params.id, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await updateProperty(
      params.id,
      {
        title,
        shortDescription,
        longDescription,
        price: parseFloat(price),
        type,
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        location,
        available,
        agentId,
      },
      token!
    );

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/properties/${params.id}?from=admin`);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (files.length > remainingSlots) {
      setError(
        remainingSlots <= 0
          ? `This property already has the maximum of ${MAX_IMAGES} images.`
          : `You can only add ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} (${MAX_IMAGES} max).`
      );
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setError('');

    const result = await uploadPropertyImages(params.id, files, token!);

    if (result.success) {
      setImages(result.property.images);
    } else {
      setError(result.error);
    }

    setIsUploading(false);
    e.target.value = '';
  }

  async function handleDeleteImage(imageUrl: string) {
    const result = await deletePropertyImage(params.id, imageUrl, token!);
    if (result.success) {
      setImages(result.property.images);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.indexOf(active.id as string);
    const newIndex = images.indexOf(over.id as string);
    const newOrder = arrayMove(images, oldIndex, newIndex);

    setImages(newOrder);

    const result = await reorderPropertyImages(params.id, newOrder, token!);
    if (!result.success) {
      setError(result.error);
      setImages(images);
    }
  }

  if (isLoading) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Loading...</p>;
  }

  if (notFound) {
    return <p className="text-[var(--color-ink)]/60 text-sm">Property not found.</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-[var(--color-ink)] mb-6">Edit property (admin)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="agentId" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Assigned agent
          </label>
          <select
            id="agentId"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)] bg-white"
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Short description
          </label>
          <input
            id="shortDescription"
            type="text"
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div>
          <label htmlFor="longDescription" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Full description
          </label>
          <textarea
            id="longDescription"
            required
            rows={4}
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Price (GHS)
            </label>
            <input
              id="price"
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Listing type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'sale' | 'rent')}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)] bg-white"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              type="number"
              required
              min="0"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
              Bathrooms
            </label>
            <input
              id="bathrooms"
              type="number"
              required
              min="0"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[var(--color-ink)]/70 mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-[var(--color-stone-line)] px-3 py-2 focus:outline-none focus:border-[var(--color-forest)]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]/70">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Available now
        </label>

        {error && <p className="text-sm text-[var(--color-clay)]">{error}</p>}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[var(--color-ink)]/70">
              Photos
            </label>
            <span className="text-xs text-[var(--color-ink)]/50">
              {images.length} of {MAX_IMAGES} uploaded
              {remainingSlots > 0 && ` · ${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} left`}
            </span>
          </div>

          {images.length > 0 && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={images} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-1">
                  {images.map((url, index) => (
                    <SortableImage key={url} url={url} isFirst={index === 0} onDelete={handleDeleteImage} />
                  ))}
                  {Array.from({ length: remainingSlots }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="w-full aspect-square border border-dashed border-[var(--color-stone-line)]"
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {images.length > 1 && (
            <p className="text-xs text-[var(--color-ink)]/40 mb-3">
              Drag to reorder — the first photo is used as the listing&apos;s main image
            </p>
          )}

          {remainingSlots > 0 ? (
            <label
              htmlFor="photo-upload"
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors px-4 py-8 text-center ${
                isUploading
                  ? 'border-[var(--color-brass)] bg-[var(--color-brass)]/5 cursor-wait'
                  : 'border-[var(--color-stone-line)] hover:border-[var(--color-forest)] cursor-pointer'
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin text-[var(--color-brass)]" width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--color-brass)]">Uploading photos...</span>
                  <span className="text-xs text-[var(--color-ink)]/40">This may take a moment</span>
                </>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[var(--color-ink)]/40">
                    <path d="M14 18V6M14 6L9 11M14 6L19 11M6 21H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--color-ink)]/70">Click to select photos</span>
                  <span className="text-xs text-[var(--color-ink)]/40">You can select multiple images at once</span>
                </>
              )}

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <p className="text-sm text-[var(--color-ink)]/50 text-center py-4 border border-dashed border-[var(--color-stone-line)]">
              Maximum of {MAX_IMAGES} images reached. Delete a photo to add a new one.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--color-forest)] text-white text-sm font-medium py-3 hover:bg-[var(--color-ink)] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}