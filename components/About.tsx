import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  return <section id="about" className={`about section light ${styles.section}`} aria-labelledby="about-title">
    <div className="section-label"><span>01 / About me</span><span>A little about the person behind the work</span></div>
    <div className={styles.layout}>
      <figure className={styles.portrait}>
        <span className={styles.photoIndex}>LP / 01</span>
        <Image src="/images/leena-pawar-portrait.png" alt="Leena Pawar in a navy blue blazer" fill sizes="(max-width: 767px) 86vw, 35vw" className={styles.photo} />
        <figcaption><span>Leena Pawar</span><span>Mumbai, India ↗</span></figcaption>
      </figure>
      <div className={styles.content}>
        <p className={styles.kicker}><span /> Developer. Thinker. Problem solver.</p>
        <h2 id="about-title">A thoughtful eye.<br />A builder’s <em>mind.</em></h2>
        <p className={styles.intro}>Hi, I’m Leena — a full stack developer who cares as much about how a website feels as how it works.</p>
        <p className={styles.description}>I turn ideas into responsive, intuitive web experiences. With a frontend focus and experience across the full stack, I bring the interface, APIs, performance and deployment together — right down to the final detail.</p>
        <dl className={styles.stats}>
          <div><dt>4<span>+</span></dt><dd>Years of experience</dd></div>
          <div><dt>15<span>+</span></dt><dd>Projects delivered</dd></div>
          <div><dt>End to end</dt><dd>From idea to launch</dd></div>
        </dl>
        <div className={styles.actions}>
          <a href="/leena-pawar-cv.pdf" download className={styles.primary}>Download my CV <span aria-hidden="true">↓</span></a>
          <a href="#contact" className={styles.secondary}>Let’s work together <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
  </section>;
}
