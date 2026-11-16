/** Shared upright monogram for the header, portrait card, and footer. */
export default function BrandMark({ className = '' }: { className?: string }) {
  return <span className={`brand-mark ${className}`.trim()} aria-hidden="true">lp.</span>;
}
