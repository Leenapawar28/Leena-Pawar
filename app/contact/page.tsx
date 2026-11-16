import type { Metadata } from 'next';
import Link from 'next/link';
import BrandMark from '@/components/BrandMark';
import ProjectEnquiry from '@/components/ProjectEnquiry';
import { socials } from '@/lib/content';
import styles from './contact.module.css';

export const metadata: Metadata = { title: 'Freelance Websites & Project Enquiries — Leena Pawar', description: 'Explore freelance website services and request a personalised quote from Leena Pawar. Share your project scope, budget, and timeline.' };

export default function ContactPage() {
  return <div className={styles.page}>
    <a className="skip-link" href="#contact-main">Skip to content</a>
    <header className={styles.header}><Link className="wordmark" href="/" aria-label="Leena Pawar home"><BrandMark /></Link><nav aria-label="Contact page navigation"><Link href="/#work">View my work</Link><a href="#enquiry">Start a project <span aria-hidden="true">↗</span></a></nav></header>
    <main id="contact-main" className={styles.main}>
      <section className={styles.hero}><p className={styles.eyebrow}><span /> Freelance design & development / Mumbai, India</p><h1 className={styles.title}>Your next idea.<br /><em>Thoughtfully built.</em></h1><div className={styles.heroBottom}><p>Websites that feel right and work beautifully.<br />From a first conversation to the final detail.</p><a className={styles.primary} href="#packages">Explore services & pricing <span aria-hidden="true">↓</span></a></div><span className={styles.heroMark} aria-hidden="true">↗</span></section>
      <ProjectEnquiry />
      <section className={styles.process} aria-labelledby="process-title"><p className={styles.eyebrow}>How we’ll work together</p><h2 id="process-title">Clear steps. Shared direction.</h2><div>{[['01', 'Share your brief', 'Tell me about your business, goals, and what you need.'], ['02', 'Agree the plan', 'We discuss the scope, quote, deliverables, and timeline before starting.'], ['03', 'Build & launch', 'Design and development move forward with feedback, followed by testing and launch.']].map(([number, title, text]) => <article key={number}><span className={styles.index}>{number} /</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    </main>
    <footer className={styles.footer}><Link href="/">← Back to portfolio</Link><div>{socials.map(social => social.href && <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label} ↗</a>)}</div><span>© {new Date().getFullYear()} Leena Pawar</span></footer>
  </div>;
}
