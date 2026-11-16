import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import 'lenis/dist/lenis.css';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
const cabinet = localFont({ src: './fonts/cabinet-grotesk-variable.woff2', variable: '--font-portfolio', display: 'swap', weight: '100 900' });

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#060504' };
export const metadata: Metadata = { title: 'Leena Pawar — Full Stack Developer', description: 'Mumbai-based developer building considered digital experiences. Frontend development, full-stack solutions, performance and deployment.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={cabinet.variable}><SmoothScroll />{children}</body></html>; }
