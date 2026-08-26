import Link from 'next/link';
import { getProperty } from '@/lib/api';
import InquiryForm from '@/components/InquiryForm';
import PropertyGallery from '@/components/PropertyGallery';

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const property = await getProperty(id);

  const backHref = from === 'admin' ? '/admin/properties' : '/properties';
  const backLabel = from === 'admin' ? '← Back to admin properties' : '← Back to listings';

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-3xl mb-2">Property not found</h1>
        <p className="text-[var(--color-ink)]/60">
          This property may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  const isForRent = property.type === 'rent';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-ink)]/60 hover:text-[var(--color-forest)] transition-colors mb-6"
      >
        {backLabel}
      </Link>
      {/* Header block — mirrors the card's colored edge + image treatment */}
      <div className="flex border border-[var(--color-stone-line)] overflow-hidden">
        <div
          className={`w-2 shrink-0 ${isForRent ? 'bg-[var(--color-forest)]' : 'bg-[var(--color-brass)]'}`}
        />
        <div className="flex-1">
        <div className="relative">
          <PropertyGallery images={property.images} title={property.title} />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 pointer-events-none">
            <span className="text-[var(--color-paper)] text-sm font-medium tracking-wide uppercase">
              {property.location}
            </span>
          </div>

          {!property.available && (
            <span className="absolute top-4 right-4 bg-[var(--color-clay)] text-white text-xs font-medium px-2 py-1">
              Unavailable
            </span>
          )}
        </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <h1 className="font-display text-2xl sm:text-3xl leading-snug text-[var(--color-ink)]">
                {property.title}
              </h1>

              <span
                className="self-start shrink-0 bg-[var(--color-brass)] text-white text-sm sm:text-base font-semibold px-3 sm:px-4 py-1.5 sm:py-2"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)' }}
              >
                GHS {property.price.toLocaleString()}{isForRent && '/mo'}
              </span>
            </div>

            <p className="text-sm text-[var(--color-ink)]/60 mt-2">
              {property.bedrooms} bed · {property.bathrooms} bath · {isForRent ? 'For Rent' : 'For Sale'}
            </p>

            <p className="text-[var(--color-ink)]/80 mt-6 leading-relaxed">
              {property.longDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Agent card */}
      <div className="mt-8 border border-[var(--color-stone-line)] bg-white p-6">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink)]/50 mb-2">
          Listed by
        </p>
        <h2 className="font-display text-xl text-[var(--color-ink)]">{property.agent.name}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-[var(--color-ink)]/70">
          <span>{property.agent.email}</span>
          {property.agent.phone && <span>{property.agent.phone}</span>}
          {property.agent.whatsapp && <span>WhatsApp: {property.agent.whatsapp}</span>}
        </div>
      </div>
      <div className="mt-8 border border-[var(--color-stone-line)] bg-white p-6">
        {/* <InquiryForm propertyId={property.id} /> */}
        <InquiryForm propertyId={property.id} available={property.available} />
      </div>
    </div>
  );
}