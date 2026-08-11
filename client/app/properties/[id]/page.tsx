import { getProperty } from '@/lib/api';
import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

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
        <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-[var(--color-ink)]/60 hover:text-[var(--color-forest)] transition-colors mb-6">
          ← Back to listings
          </Link>
      {/* Header block — mirrors the card's colored edge + image treatment */}
      <div className="flex border border-[var(--color-stone-line)] overflow-hidden">
        <div
          className={`w-2 shrink-0 ${isForRent ? 'bg-[var(--color-forest)]' : 'bg-[var(--color-brass)]'}`}
        />
        <div className="flex-1">
          <div className="relative h-64 bg-[var(--color-ink)] flex items-end p-6 overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(239,235,226,0.4) 12px, rgba(239,235,226,0.4) 13px)',
              }}
            />
            <span className="relative text-[var(--color-paper)] text-sm font-medium tracking-wide uppercase">
              {property.location}
            </span>

            {!property.available && (
              <span className="absolute top-4 right-4 bg-[var(--color-clay)] text-white text-xs font-medium px-2 py-1">
                Unavailable
              </span>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl leading-snug text-[var(--color-ink)]">
                {property.title}
              </h1>

              <span
                className="shrink-0 bg-[var(--color-brass)] text-white text-base font-semibold px-4 py-2"
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
        <InquiryForm propertyId={property.id} />
      </div>
    </div>
  );
}