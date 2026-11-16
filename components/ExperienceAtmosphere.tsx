import Image from 'next/image';

/** Supplied bronze ribbon, shared by the pinned and reading layouts. */
export default function ExperienceAtmosphere({ local = false }: { local?: boolean }) {
  return <div className={`experience-atmosphere${local ? ' experience-local' : ''}`} aria-hidden="true">
    <div className="experience-ribbon-drift">
      <Image src="/images/experience-ribbon.png" alt="" fill
        sizes="(max-width: 767px) 175vw, 100vw" className="experience-ribbon-art" />
    </div>
    <div className="experience-shade" />
  </div>;
}
