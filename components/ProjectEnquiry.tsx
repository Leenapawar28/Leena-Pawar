'use client';

import { useState, type FormEvent } from 'react';
import { profile } from '@/lib/content';
import { freelanceServices } from '@/lib/freelance';
import styles from '@/app/contact/contact.module.css';

export default function ProjectEnquiry() {
  const [service, setService] = useState('Business website');
  const [prepared, setPrepared] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `Hi Leena,`, '', `I’d like to discuss a ${service.toLowerCase()} project.`, '',
      `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Company / website: ${data.get('company') || 'Not provided'}`,
      `Service: ${service}`, `Budget: ${data.get('budget') || 'To be discussed'}`, `Timeline: ${data.get('timeline')}`,
      '', 'Project brief:', String(data.get('brief')), '', 'Please let me know the next steps for a quote.',
    ].join('\n');
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry — ${service}`)}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  };
  return <>
    <section id="packages" className={styles.packages} aria-labelledby="packages-title">
      <div className={styles.sectionIntro}><div><p className={styles.eyebrow}>Services & pricing</p><h2 id="packages-title">A starting point<br />for your next idea.</h2></div><p>Every project is different. Share your requirements for a personalised quote with a clear scope, timeline, and cost.</p></div>
      <div className={styles.cards}>{freelanceServices.map(item => <article key={item.name} className={`${styles.card} ${service === item.name ? styles.selected : ''}`}>
        <span className={styles.index}>{item.number} /</span><h3>{item.name}</h3><p>{item.description}</p><div className={styles.price}>Request a quote<span>Pricing based on your scope</span></div><ul>{item.includes.map(feature => <li key={feature}>{feature}</li>)}</ul>
        <a href="#enquiry" onClick={() => { setService(item.name); setPrepared(false); }} className={styles.packageLink} aria-label={`Request a quote for ${item.name}`}>Discuss this project <span aria-hidden="true">↗</span></a>
      </article>)}</div>
      <p className={styles.pricingNote}>Final pricing depends on page count, design, content, integrations, and functionality. Hosting, domain names, paid tools, and ongoing support are discussed separately before work begins.</p>
    </section>
    <section id="enquiry" className={styles.enquiry} aria-labelledby="enquiry-title">
      <div className={styles.enquiryIntro}><p className={styles.eyebrow}>Tell me what you have in mind</p><h2 id="enquiry-title">Let’s make<br />a good start.</h2><p>A few details will help me understand your project and prepare a useful quote.</p><a href={`mailto:${profile.email}`}>{profile.email} ↗</a><p className={styles.small}>Prefer a direct conversation? Email your brief or connect with me on LinkedIn.</p></div>
      <form className={styles.form} onSubmit={submit} onChange={() => setPrepared(false)}>
        <div className={styles.formRow}><label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" /></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@company.com" /></label></div>
        <label>Company or existing website<input name="company" autoComplete="organization" maxLength={250} placeholder="Optional" /></label>
        <label>What do you need?<select name="service" value={service} onChange={event => setService(event.target.value)}>{freelanceServices.map(item => <option key={item.name}>{item.name}</option>)}<option>Something else</option></select></label>
        <div className={styles.formRow}><label>Budget range<input name="budget" maxLength={100} placeholder="Amount and currency, or not sure yet" /></label><label>Ideal timeline <span>*</span><select name="timeline" required defaultValue=""><option value="" disabled>Select a timeline</option><option>Within a month</option><option>1–3 months</option><option>3+ months</option><option>Flexible / exploring options</option></select></label></div>
        <label>About your project <span>*</span><textarea name="brief" required rows={5} maxLength={4000} placeholder="What are you building? Share your goals, pages, features, and any reference websites." /></label>
        <p className={styles.small}>This opens your email app with a prepared draft. Review and send it to submit your enquiry.</p>
        <button type="submit" className={styles.primary}>Prepare email enquiry <span aria-hidden="true">↗</span></button>
        {prepared && <p role="status" className={styles.status}>Your email draft is ready. Send it from your email app, or email {profile.email} directly if your app didn’t open.</p>}
      </form>
    </section>
  </>;
}
