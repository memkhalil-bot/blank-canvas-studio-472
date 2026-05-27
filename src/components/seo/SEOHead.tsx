import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ── Brand constants ────────────────────────────────────────────────────────
// Keep in sync with index.html so the first HTML paint matches JS hydration.

const BRAND = {
  siteName:    'خبير الفشل | Khabir Al Fashal',
  defaultTitle:'خبير الفشل | Startup Failure Intelligence Platform',
  description: 'A cinematic startup failure intelligence platform focused on founder psychology, startup autopsy, blind spots, and Valley of Death analysis.',
  keywords:    'startup failure, founder psychology, Valley of Death, startup autopsy, blind spots, Khabir Al Fashal, خبير الفشل, failure intelligence, startup post-mortem',
  /** Stable path served from /public — no Vite hash */
  ogImage:     '/og-image.png',
} as const;

// ── Types ──────────────────────────────────────────────────────────────────

interface SEOHeadProps {
  /** Per-page title. When provided the final title becomes "<title> | خبير الفشل".
   *  When omitted the default brand title is used. */
  title?: string;
  /** Per-page description override. Falls back to BRAND.description. */
  description?: string;
  /** Per-page OG image override. Falls back to the brand portrait. */
  image?: string;
  /** OG type. Defaults to "website". */
  type?: 'website' | 'article';
}

// ── Helper ─────────────────────────────────────────────────────────────────

function upsertMeta(nameOrProp: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${nameOrProp}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// ── Component ──────────────────────────────────────────────────────────────

/**
 * SEOHead — manages document title + meta tags on a per-page basis.
 *
 * The static metadata in index.html provides the initial values seen by
 * crawlers and bots that don't execute JavaScript.  This component layers
 * on top with per-route overrides, so the browser tab and social previews
 * stay accurate as the user navigates.
 *
 * Usage:
 *   <SEOHead title="Valley of Death — The Founder Test" />
 *   <SEOHead />   ← uses brand defaults
 */
export function SEOHead({
  title,
  description = BRAND.description,
  image = BRAND.ogImage,
  type = 'website',
}: SEOHeadProps) {
  const location = useLocation();

  const fullTitle = title
    ? `${title} | خبير الفشل`
    : BRAND.defaultTitle;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${baseUrl}${location.pathname}`;

  // Resolve a relative image path to an absolute URL for OG / Twitter tags
  // (some crawlers reject relative paths)
  const absoluteImage =
    image.startsWith('http') ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // ── Document title ────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Standard meta ─────────────────────────────────────────────────────
    upsertMeta('description', description);
    upsertMeta('keywords',    BRAND.keywords);
    upsertMeta('author',      BRAND.siteName);

    // ── Open Graph ────────────────────────────────────────────────────────
    upsertMeta('og:site_name',   BRAND.siteName,  true);
    upsertMeta('og:type',        type,            true);
    upsertMeta('og:url',         fullUrl,         true);
    upsertMeta('og:title',       fullTitle,       true);
    upsertMeta('og:description', description,     true);
    upsertMeta('og:image',       absoluteImage,   true);
    upsertMeta('og:image:alt',   'خبير الفشل — Startup Failure Intelligence', true);

    // ── Twitter / X Card ──────────────────────────────────────────────────
    upsertMeta('twitter:card',        'summary_large_image');
    upsertMeta('twitter:title',       fullTitle);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image',       absoluteImage);
    upsertMeta('twitter:image:alt',   'خبير الفشل — Startup Failure Intelligence');
  }, [fullTitle, description, fullUrl, absoluteImage, type]);

  return null;
}
