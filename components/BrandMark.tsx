import { useId } from 'react';

/** Original calligraphic artwork, with its white paper removed at render time. */
export default function BrandMark({ className = '' }: { className?: string }) {
  const filterId = `logo-gold-${useId().replace(/:/g, '')}`;
  return <svg className={`brand-mark ${className}`.trim()} viewBox="100 75 1720 650" aria-hidden="true" focusable="false">
    <defs>
      <filter id={filterId} colorInterpolationFilters="sRGB">
        <feColorMatrix result="gold" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -2 0 2" />
        <feComposite in="gold" in2="SourceAlpha" operator="in" />
      </filter>
    </defs>
    <image href="/images/leena-gold-logo.png" width="1920" height="819" filter={`url(#${filterId})`} />
  </svg>;
}
