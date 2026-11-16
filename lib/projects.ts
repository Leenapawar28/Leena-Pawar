/** Replace these clearly labelled concept placeholders with your case studies. */
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
}
const covers = ['/images/projects/editorial.svg', '/images/projects/studio.svg', '/images/projects/objects.svg'];
export const projects: PortfolioProject[] = Array.from({ length: 15 }, (_, i) => ({
  id: `project-${String(i + 1).padStart(2, '0')}`,
  title: `Project ${String(i + 1).padStart(2, '0')}`,
  category: ['Website concept', 'Interface study', 'Digital experience'][i % 3],
  year: 'Concept / placeholder',
  shortDescription: 'A placeholder for a future case study, exploring considered interfaces and thoughtful development.',
  fullDescription: 'This is a demonstration project for the gallery. Replace this overview with the actual brief, approach, design decisions and implementation details when your case study is ready. The imagery is original concept artwork, not a real client project.',
  coverImage: covers[i % covers.length],
  galleryImages: [covers[(i + 1) % covers.length], covers[(i + 2) % covers.length]],
  technologies: ['Next.js', 'React', 'TypeScript', 'GSAP'],
  role: 'Role details to be added',
  responsibilities: ['Add your actual contribution to this project.', 'Describe implementation decisions and the work you owned.'],
  projectUrl: null,
}));
