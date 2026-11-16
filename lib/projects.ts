/** Completed portfolio case studies. */
export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  year: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  galleryImages: string[];
  technologies: string[];
  role: string;
  responsibilities: string[];
  projectUrl: string | null;
  objective?: string;
  designApproach?: string;
  keyFeatures?: string[];
  galleryCaptions?: string[];
  imageAspectRatio?: string;
  industry?: string;
  specialisation?: string;
  projectType?: string;
  status?: string;
}
export const projects: PortfolioProject[] = [{
  id: 'project-01',
  title: 'Swisscotec',
  category: 'Corporate Website / Furniture & Interiors',
  year: '',
  shortDescription: 'Premium Corporate Website — a clean, image-led digital experience for furniture and workspace solutions.',
  fullDescription: 'Designed and developed a modern corporate website for Swisscotec, a furniture and workspace solutions company. The website showcases its product brands, completed projects, company profile, and values through a clean, image-led digital experience.',
  objective: "To create a premium online presence that reflects Swisscotec’s design-focused identity while making its brands, services, and projects easy to explore.",
  designApproach: 'The website combines generous white space, bold typography, large architectural photographs, and subtle visual accents. Each section is designed to let the products and completed spaces take centre stage.',
  keyFeatures: [
    'Minimalist, responsive website layout',
    'Full-width hero banners with high-quality imagery',
    'Dedicated brand showcase pages',
    'Interactive project portfolio',
    'Company profile and values sections',
    'Image-led storytelling and intuitive navigation',
    'Consistent typography and visual hierarchy',
  ],
  coverImage: '/images/projects/swisscotec/banner-clean.png',
  imageAspectRatio: '1672 / 941',
  galleryImages: [],
  galleryCaptions: [],
  technologies: [],
  role: 'Website design and development',
  responsibilities: ['Page layouts', 'Visual styling', 'Content presentation', 'Navigation experience'],
  projectUrl: 'https://www.swisscotec.com/',
}, {
  id: 'project-02',
  title: 'Achievers Computers FZCO',
  category: 'Corporate Website / IT Distribution',
  year: '',
  shortDescription: 'Corporate Website Design & Development | IT Distribution',
  fullDescription: "Designed and developed a modern corporate website for Achievers Computers FZCO, an established IT products distributor serving markets across the UAE, GCC, Africa, and Asia. The website presents the company’s global presence, extensive product portfolio, business expertise, and industry experience through a professional, structured digital experience.",
  objective: "To build a clean, user-friendly corporate website that strengthens the company’s online identity, simplifies product discovery, and creates an accessible platform for business enquiries.",
  keyFeatures: [
    'Modern Homepage: A globe-inspired hero section highlighting the company’s presence in the Middle East.',
    'Product Categories: Dedicated pages for computers, printers and scanners, storage, and components.',
    'Company Profile: Detailed presentation of the company’s background, business values, and regional reach.',
    'Business Statistics: Prominent presentation of company milestones and distribution capabilities.',
    'Responsive Design: Layouts designed for different screen sizes.',
    'Business Enquiries: Convenient contact options, including WhatsApp and enquiry navigation.',
    'Consistent Branding: Navy-blue typography, orange highlights, subtle abstract shapes, and clean layouts.',
  ],
  designApproach: 'A minimalist corporate design using generous white space, bold typography, product-led imagery, and subtle geometric backgrounds. The visual identity combines deep blue and warm orange accents to create a professional and recognizable experience.',
  role: 'Website design and development',
  responsibilities: ['Page layouts', 'Content organization', 'Visual styling', 'Responsive interface implementation'],
  industry: 'Information Technology / Wholesale Distribution',
  projectType: 'Corporate Website',
  status: 'Live',
  coverImage: '/images/projects/achievers/banner-clean.png',
  imageAspectRatio: '1672 / 941',
  galleryImages: [],
  technologies: [],
  projectUrl: 'https://acl.ae/',
}, {
  id: 'project-03',
  title: 'EMCO International DMCC',
  category: 'Corporate Website / Global Agro-Commodity Trading',
  year: '',
  shortDescription: 'Corporate Website Design & Development | Global Agro-Commodity Trading',
  fullDescription: "Designed and developed a corporate website for EMCO International, an agro-commodity brokerage and trading company connecting suppliers and buyers across international markets. The website communicates the company’s expertise in agricultural commodities, trade consulting, execution, and logistics through an elegant, visually engaging digital experience.",
  objective: "To establish a professional digital presence that highlights EMCO’s trading expertise, diverse commodity portfolio, and commitment to building trusted business relationships.",
  keyFeatures: [
    'Visual Homepage: Large agricultural hero imagery with prominent messaging.',
    'Commodity Showcase: Eight product categories presented through circular product imagery.',
    'Company Profile: Dedicated content highlighting the company’s history, values, and expertise.',
    'Service Presentation: Distinct visual sections for trade consulting, trade execution, and trade logistics.',
    'Brand-Focused Design: Deep burgundy, gold accents, clean typography, and agricultural photography.',
    'Business Communication: Accessible contact navigation and WhatsApp integration.',
    'Structured Navigation: Clear access to company information, products, and services.',
  ],
  designApproach: 'The visual direction combines rich burgundy tones, warm gold details, and authentic agricultural imagery to create a premium corporate identity. Large photographic sections, balanced white space, and clear content hierarchy make complex trading information accessible and visually appealing.',
  role: 'Website design and development',
  responsibilities: ['Visual layouts', 'Content organization', 'Brand styling', 'User interface implementation'],
  industry: 'Agriculture / International Commodity Trading',
  projectType: 'Corporate Website',
  status: 'Live',
  coverImage: '/images/projects/emco/banner-clean.png',
  imageAspectRatio: '1672 / 941',
  galleryImages: [],
  technologies: [],
  projectUrl: 'https://emco.ae/',
}, {
  id: 'project-04',
  title: 'Dr. Sushree Patra',
  category: 'Healthcare Website / Obstetrician & Gynaecologist',
  year: '',
  shortDescription: 'Healthcare Website Design & Development | Obstetrician & Gynaecologist',
  fullDescription: 'Designed and developed a serene, elegant, and patient-focused healthcare website for Dr. Sushree Patra, an Obstetrician and Gynaecologist. The website presents her medical expertise across women’s health, obstetrics, gynaecology, infertility, and preventive care through a calm and visually distinctive digital experience.',
  objective: 'To build a modern and trustworthy online presence that communicates compassionate women’s healthcare, makes medical services easy to explore, and encourages consultation enquiries through a clear and approachable user journey.',
  keyFeatures: [
    'Strong Hero Section: A visually unique homepage introducing personalised care for women at every stage.',
    'Speciality Sections: Dedicated service navigation for Obstetrics, Gynaecology, Infertility, FAQ, and Blogs.',
    'Women’s Care Journey: Informative website structure covering different stages of women’s health and treatment.',
    'Healthcare Storytelling: Use of soft visual metaphors and editorial layouts to simplify medical communication.',
    'Consultation CTA: Prominent consultation-focused buttons to drive patient enquiries.',
    'Responsive Design: Clean and elegant experience across screen sizes.',
    'Soft Brand Identity: Sage green palette, pearl-inspired visuals, and minimal layouts that create a premium healthcare feel.',
  ],
  designApproach: 'The website follows a soft, refined, and calming design language suited to women’s healthcare. Gentle sage-green tones, shell and pearl-inspired visuals, and minimal white space create a premium and comforting digital experience. The layouts are designed to feel informative, reassuring, and visually graceful while keeping the focus on care and expertise.',
  role: 'Website design and development',
  responsibilities: ['Layout planning', 'Content structuring', 'Visual styling', 'Responsive implementation'],
  industry: 'Healthcare',
  specialisation: 'Obstetrics, Gynaecology & Infertility',
  projectType: 'Doctor / Healthcare Website',
  status: 'Live',
  coverImage: '/images/projects/dr-sushree-patra/banner-clean.png',
  imageAspectRatio: '1672 / 941',
  galleryImages: [],
  technologies: [],
  projectUrl: 'https://drsushreepatra.com/',
}, {
  id: 'project-05',
  title: 'Dr. Sanjay Sonar',
  category: 'Healthcare Website / Surgical Portfolio',
  year: '',
  shortDescription: 'Healthcare Website Design & Development | Surgical Portfolio',
  fullDescription: 'Designed and developed a visually distinctive professional website for Dr. Sanjay Sonar, a general surgeon with over 35 years of surgical experience. The website showcases his surgical expertise, professional journey, teaching contributions, achievements, and selected complex surgical cases through an immersive, modern digital experience.',
  objective: 'To create a premium professional website that communicates surgical experience and expertise while presenting complex medical cases through engaging visual storytelling and structured content.',
  keyFeatures: [
    'Immersive Homepage: Full-screen surgical illustrations with striking green and gold visuals.',
    'Selected Surgical Work: Dedicated case studies highlighting complex surgical procedures, clinical challenges, and outcomes.',
    'Interactive Case Gallery: Image-led case presentations with easy navigation.',
    'Professional Gallery: Photographs of conferences, recognitions, professional activities, and achievements.',
    'Expertise & Teaching: Dedicated navigation for surgical specialisations and educational contributions.',
    'Consultation Integration: Prominent consultation button for patient enquiries.',
    'Responsive Interface: Layouts designed to adapt across desktop, tablet, and mobile screens.',
    'Visual Storytelling: Detailed medical-inspired imagery supporting the website’s surgical content.',
  ],
  designApproach: 'The website combines deep forest-green tones, olive gradients, gold accents, and detailed surgical illustrations to create a distinctive medical identity. Large immersive visuals, floating navigation, carefully structured case studies, and minimal typography help communicate the surgeon’s expertise while maintaining an engaging browsing experience.',
  role: 'Website design and development',
  responsibilities: ['UI layouts', 'Content structuring', 'Visual styling', 'Case-study presentation', 'Responsive implementation'],
  industry: 'Healthcare / Surgery',
  projectType: 'Doctor Portfolio Website',
  status: 'Live',
  coverImage: '/images/projects/dr-sanjay-sonar/banner.png',
  imageAspectRatio: '1672 / 941',
  galleryImages: [],
  technologies: [],
  projectUrl: 'https://sanjaysonar.com/',
}];
