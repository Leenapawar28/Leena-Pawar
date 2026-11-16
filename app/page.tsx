import HeroParticleGlobe from '@/components/HeroParticleGlobe';
import PortraitParticles from '@/components/PortraitParticles';
import Image from 'next/image';
import Motion from '@/components/Motion';
import Journey from '@/components/Journey';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import SiteHeader from '@/components/SiteHeader';
import About from '@/components/About';
import BrandMark from '@/components/BrandMark';
import { profile, experience, socials } from '@/lib/content';
const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => <span aria-hidden="true">{diagonal ? '↗' : '↓'}</span>;
export default function Home() {
return <><Motion /><a className="skip-link" href="#about">Skip to content</a>
<SiteHeader />
<main>
<section id="home" className="hero-journey" aria-labelledby="hero-title"><div className="hero-stage">
<div className="hero-index mono">Independent thinking.<br />Considered development.</div>
<div className="portal" aria-hidden="true"><div className="portal-entrance"><div className="portal-blob" /><Image className="portal-image" src="/images/black-hole.jpg" alt="" width={1024} height={1024} preload sizes="(max-width: 767px) 100vw, 64vw" /><HeroParticleGlobe /></div></div><div className="portal-blackout" aria-hidden="true" />
<div className="hero-copy"><p className="eyebrow">Mumbai, India <span className="small-line" /> Full Stack Developer</p><h1 id="hero-title" aria-label="LEENA PAWAR."><span className="name-mask"><span className="name-line">LEENA</span></span><span className="name-mask"><span className="name-line">PAWAR<span className="name-period">.</span></span></span></h1><p className="hero-intro">Thoughtful interfaces.<br />Dependable development.<br /><span>From first idea to the final detail.</span></p></div>
<div className="hero-bottom"><a href="#about" className="scroll-link"><span className="circle-arrow"><Arrow /></span><span className="mono">Scroll to explore</span></a><p className="mono">A little curiosity.<br />A different perspective.</p><span className="mono hero-number">01 — 05</span></div>
</div></section>
<Journey>
<About />
<section id="experience" className="section light experience"><div className="section-label"><span>02 / Experience</span><span>Learning through making</span></div><div className="section-heading"><h2>A practice.<br /><span className="muted">Always evolving.</span></h2><p>From responsive interfaces to<br />end-to-end web experiences.</p></div><div className="timeline">{experience.map((job, i) => <article className="job" key={job.company}><div className="job-identity"><div className="job-date mono">{job.date}</div><div className="job-card"><PortraitParticles sceneId="experience" /><span className="job-emblem" aria-hidden="true">{i === 0 ? 'WH' : 'E'}</span><div><h3>{job.company}</h3><p className="job-role">{job.role}</p></div><span className="job-index mono">0{i + 1}</span></div></div><div className="job-description">{job.description.map(text => <p key={text}>{text}</p>)}</div></article>)}</div></section>
<Skills />
<Projects />

<section id="contact" className="section contact"><div className="section-label"><span>05 / Get in touch</span><span>Good things begin with a conversation</span></div><div><p className="mono contact-kicker">Have something in mind?</p><a className="freelance-contact-link" href="/contact">Explore services & request a quote ↗</a><h2>Let’s build<br />something <em>good.</em></h2><a className="email" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal /></a></div><footer><a className="wordmark" href="#home" aria-label="Leena Pawar home"><BrandMark /></a><div className="socials"><a href="/contact">Freelance enquiries ↗</a>{socials.map(link => link.href ? <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a> : <span key={link.label} title="Add your profile URL in lib/content.ts">{link.label} <span className="social-pending">/ add link</span></span>)}<a href="/leena-pawar-cv.pdf" download>Download CV ↗</a></div><span className="mono">© {new Date().getFullYear()} Leena Pawar</span><a className="back-top mono" href="#home">Back to top ↑</a></footer></section>
</Journey>
</main></>;
}
