/**
 * Shared Design Tokens & Typography Constants
 * Single source of truth for all static and dynamic pages:
 * - About Us (/about)
 * - Services (/services)
 * - Projects (/projects)
 * - Home (/)
 * - Contact (/contact)
 * - Catalog & Categories (/products, /categories)
 *
 * Tailwind CSS utility class strings for synchronized typography,
 * media sizing, pills, cards, containers, and action buttons across the site.
 */

// ==========================================
// 1. CONTAINER & LAYOUT TOKENS
// ==========================================

/** Standard Enterprise Page Container: Max 1536px (2XL) with responsive adaptive padding */
export const siteContainer = 'mx-auto w-full max-w-[1536px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16'

/** Ultra-wide / Hero Layout Container */
export const siteContainerWide = 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16'

/** Focused Form / Reading Column Container */
export const siteContainerFocused = 'mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8'

// ==========================================
// 2. TYPOGRAPHY TOKENS
// ==========================================

/** Small tracking-wide uppercase eyebrow / badge label */
export const eyebrowText = 'text-xs sm:text-sm font-black uppercase tracking-[.25em] text-[#1877F2]'

/** Main Page Title (H1) */
export const h1Text = 'font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] tracking-tight text-[#0F172A]'

/** Section Heading (H2) */
export const h2Text = 'font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight'

/** Section Heading Dark (H2) */
export const h2TextDark = 'font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight'

/** Card / Component Main Title (H3) */
export const h3CardTitle = 'font-heading text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0F172A] leading-snug'

/** Secondary Card / Feature Title (H3 / H4) */
export const h3SubTitle = 'font-heading text-lg sm:text-xl lg:text-2xl font-black text-[#0F172A] tracking-tight leading-snug'

/** Lead Paragraph / Body Text */
export const bodyLead = 'text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 font-normal'

/** Standard Body Paragraph */
export const bodyText = 'text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600'

/** Bullet Highlights / List Items */
export const bulletHighlight = 'text-sm sm:text-base font-semibold text-slate-800'

/** Scope / Dimension / Pill Metadata */
export const scopePillText = 'text-xs sm:text-sm font-bold text-slate-700'

/** Engineering Spec / Label Heading */
export const specLabel = 'text-[11px] sm:text-xs uppercase font-bold text-slate-400 tracking-wider'

/** Engineering Spec Value */
export const specValue = 'text-xs sm:text-sm md:text-base font-bold text-slate-800 leading-snug'

// ==========================================
// 3. CTA & BUTTON TOKENS
// ==========================================

/** Primary WhatsApp Green Action Button */
export const ctaButtonWhatsApp = 'inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 text-xs sm:text-sm md:text-base font-bold text-[#0F172A] transition hover:brightness-105 active:scale-95 shadow-xs'

/** Large WhatsApp Green Action Button */
export const ctaButtonWhatsAppLarge = 'inline-flex items-center justify-center gap-2.5 rounded-sm bg-[#25D366] px-7 py-4 text-sm sm:text-base md:text-lg font-bold text-[#0F172A] shadow-xs transition hover:brightness-105 active:scale-95'

/** Primary Blue Action Button */
export const ctaButtonPrimary = 'inline-flex items-center justify-center gap-2 rounded-sm bg-[#1877F2] px-7 py-3.5 text-sm sm:text-base md:text-lg font-bold text-white transition hover:bg-blue-600 active:scale-95 shadow-xs'

/** Secondary / Ghost Action Button */
export const ctaButtonSecondary = 'inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-bold text-slate-700 hover:text-[#1877F2] transition'

// ==========================================
// 4. MEDIA & CONTAINER TOKENS
// ==========================================

/** Hero Manufacturing / Featured Video Container Height */
export const heroVideoHeight = 'h-[440px] sm:h-[500px] lg:h-[560px] w-full'

/** 3-4 Item Media Grids (Services & Projects 2x2 cards) */
export const mediaGridCardHeight = 'grid-cols-2 grid-rows-2 h-80 sm:h-92 lg:h-[420px] w-full'

/** 1-2 Item Media Layouts (Aspect-ratio bounded) */
export const mediaSingleDoubleHeight = 'aspect-[16/11] min-h-[290px] sm:min-h-[360px] max-h-[440px]'

/** Facility & Real Stock 6-Card Media Gallery Height (About Us) */
export const mediaGalleryCardHeight = 'h-72 sm:h-84 lg:h-96 w-full'

/** B2B Procurement Sidebar Video Height */
export const mediaB2BSidebarHeight = 'h-96 sm:h-[440px] lg:h-[500px] w-full'

/** Standard Card Outer Padding */
export const cardPadding = 'p-6 sm:p-7 lg:p-8'

/** Standard Full-Width Section Styling */
export const sectionFullWidthLight = 'bg-[#F8FAFC] px-5 py-24 md:px-10 border-t border-slate-200'

