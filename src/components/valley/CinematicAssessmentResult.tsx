/**
 * CinematicAssessmentResult
 *
 * Standalone next-generation result screen for the Founder Diagnostic.
 * Design: case-file document · forensic · investigative · psychologically heavy.
 * Palette: black / white / ember. Zero dashboard energy.
 *
 * --- How to preview (temporary) ---
 * In App.tsx add one route:
 *   const ResultPreview = lazy(() => import('./components/valley/CinematicAssessmentResult').then(m => ({ default: m.CinematicAssessmentResultPreview })));
 *   <Route path="/result-preview" element={<ResultPreview />} />
 * Remove when done approving.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CinematicResultProps {
  verdict: {
    level: string;
    title: string;
    insight: string;
    tone: string;
  };
  scorePct: number;
  blindSpots: string[];
  founderName?: string | null;
  riskBucket: 'low' | 'medium' | 'high';
  consequence: string;
  recovery: string;
  ctas: Array<{
    title: string;
    desc: string;
    intent: string;
    urgent?: boolean;
  }>;
  isRTL: boolean;
  contactPath: string;
  labels: {
    diagnosisLabel: string;
    shockEyebrow: string;
    riskScoreLabel: string;
    riskLevelLabel: string;
    blindSpotsSection: string;
    consequencesSection: string;
    recoverySection: string;
    nextMoveSection: string;
    restartDiagnosticLabel: string;
  };
  onReset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const RISK_PALETTE = {
  low: {
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bar: 'bg-emerald-500',
    glow: 'hsl(142 76% 50% / 0.08)',
    ctaBg: 'bg-emerald-500 hover:bg-white',
    urgentRing: '',
  },
  medium: {
    accent: 'text-ember',
    border: 'border-ember/35',
    bar: 'bg-ember',
    glow: 'hsl(18 92% 55% / 0.10)',
    ctaBg: 'bg-ember hover:bg-white',
    urgentRing: '',
  },
  high: {
    accent: 'text-red-500',
    border: 'border-red-500/50',
    bar: 'bg-red-500',
    glow: 'hsl(0 84% 55% / 0.12)',
    ctaBg: 'bg-red-500 hover:bg-white',
    urgentRing: 'ring-1 ring-red-500/40',
  },
} as const;

// A cryptographic-looking case number derived from the score and timestamp
function deriveCase(scorePct: number): string {
  const hex = ((scorePct * 0x4f3a) & 0xffff).toString(16).padStart(4, '0').toUpperCase();
  return `0x${hex}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionSeparator() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-px bg-white/8 origin-left my-0"
    />
  );
}

function Eyebrow({
  children,
  color = 'text-white/30',
  isRTL,
}: {
  children: React.ReactNode;
  color?: string;
  isRTL: boolean;
}) {
  return (
    <p
      className={cn(
        'text-[10px] uppercase mb-7',
        color,
        isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.42em]',
      )}
    >
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function CinematicAssessmentResult({
  verdict,
  scorePct,
  blindSpots,
  founderName,
  riskBucket,
  consequence,
  recovery,
  ctas,
  isRTL,
  contactPath,
  labels,
  onReset,
}: CinematicResultProps) {
  const palette = RISK_PALETTE[riskBucket];
  const caseId = deriveCase(scorePct);
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const primaryCta = ctas[0];
  const secondaryCtas = ctas.slice(1);

  // ── Score bar fill delayed until section is in view ──────────────────────
  const barRef = useRef<HTMLDivElement>(null);
  const [barFilled, setBarFilled] = useState(false);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setBarFilled(true); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(
        'relative w-full bg-black text-white selection:bg-ember/30',
        isRTL ? 'font-arabic' : 'font-sans-ui',
      )}
    >
      {/* ── Ambient atmosphere ─────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${palette.glow}, transparent 60%)`,
        }}
      />
      {/* Grain texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* CASE FILE HEADER                                               */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className={cn(
            'pt-16 pb-10 flex items-center justify-between gap-4',
            isRTL && 'flex-row-reverse',
          )}
        >
          <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
            <span className="h-px w-6 bg-white/20" />
            <span
              className={cn(
                'text-[9px] text-white/25',
                isRTL ? 'font-arabic tracking-normal text-xs' : 'uppercase tracking-[0.45em]',
              )}
            >
              {isRTL ? 'خبير الفشل · ملف القضية' : 'خبير الفشل · Case File'}
            </span>
          </div>
          <div className={cn('flex items-center gap-5 text-[9px] text-white/20', isRTL ? 'flex-row-reverse tracking-normal font-arabic text-xs' : 'uppercase tracking-[0.3em]')}>
            <span>{caseId}</span>
            <span className="h-3 w-px bg-white/10" />
            <span>{today}</span>
            <span className="h-3 w-px bg-white/10" />
            <span className={cn(palette.accent, 'opacity-70')}>
              {isRTL ? 'سري' : 'Confidential'}
            </span>
          </div>
        </motion.div>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* I · SHOCK MOMENT                                               */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section
          className={cn(
            'min-h-[80vh] flex flex-col justify-center py-20',
            isRTL && 'text-right',
          )}
        >
          {/* Eyebrow — appears first */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className={cn(
              'text-[10px] uppercase mb-12',
              palette.accent,
              isRTL ? 'tracking-normal text-sm' : 'tracking-[0.5em]',
            )}
          >
            {labels.shockEyebrow}
          </motion.p>

          {/* Verdict — blur-in from void, heavy delay */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'text-white max-w-2xl',
              isRTL
                ? 'font-arabic font-bold text-4xl md:text-6xl leading-[1.35]'
                : 'font-serif-display text-5xl md:text-7xl lg:text-8xl leading-[1.0] tracking-tight',
            )}
          >
            {isRTL ? (
              verdict.title
            ) : (
              <span className="italic">{verdict.title}</span>
            )}
          </motion.h1>

          {/* Signature rule — draws across after verdict */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'mt-16 h-px w-16 bg-ember/50',
              isRTL ? 'origin-right ml-auto' : 'origin-left',
            )}
          />

          {/* Founder name, if given — appears last */}
          {founderName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 3.4 }}
              className={cn(
                'mt-5 text-[10px] text-white/25',
                isRTL
                  ? 'font-arabic tracking-normal text-sm text-right'
                  : 'uppercase tracking-[0.4em]',
              )}
            >
              {isRTL ? `التشخيص · ${founderName}` : `Diagnosis · ${founderName}`}
            </motion.p>
          )}
        </section>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* II · FOUNDER STATE + PSYCHOLOGICAL INSIGHT                     */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('py-20 md:py-28', isRTL && 'text-right')}
        >
          <Eyebrow isRTL={isRTL}>{labels.riskLevelLabel}</Eyebrow>

          {/* Classification stamp */}
          <div
            className={cn(
              'inline-flex items-center gap-4 mb-10',
              isRTL && 'flex-row-reverse',
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full flex-shrink-0',
                riskBucket === 'high'
                  ? 'bg-red-500 shadow-[0_0_10px_hsl(0_84%_55%/0.6)]'
                  : riskBucket === 'medium'
                  ? 'bg-ember shadow-[0_0_10px_hsl(18_92%_55%/0.5)]'
                  : 'bg-emerald-500 shadow-[0_0_10px_hsl(142_76%_50%/0.5)]',
              )}
            />
            <p
              className={cn(
                'leading-none',
                palette.accent,
                isRTL
                  ? 'font-arabic font-bold text-2xl md:text-4xl'
                  : 'font-serif-display italic text-3xl md:text-5xl tracking-tight',
              )}
            >
              {verdict.level}
            </p>
          </div>

          {/* Insight paragraph — analytical, calm, devastating */}
          <div
            className={cn(
              'border-l-2 border-white/10 pl-8 max-w-2xl',
              isRTL && 'border-l-0 border-r-2 pl-0 pr-8',
            )}
          >
            <p
              className={cn(
                'text-lg md:text-xl text-white/65 leading-relaxed',
                isRTL ? 'font-arabic leading-[2.1]' : 'font-light leading-[1.75]',
              )}
            >
              {verdict.insight}
            </p>
          </div>
        </motion.section>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* III · RISK SCORE                                               */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('py-20 md:py-28', isRTL && 'text-right')}
          ref={barRef}
        >
          <Eyebrow isRTL={isRTL}>{labels.riskScoreLabel}</Eyebrow>

          {/* Score number — enormous, owns its space */}
          <div
            className={cn(
              'flex items-end gap-4',
              isRTL && 'flex-row-reverse justify-end',
            )}
          >
            <span
              className={cn(
                'leading-none tabular-nums',
                palette.accent,
                isRTL
                  ? 'font-arabic font-bold text-[7rem] md:text-[10rem]'
                  : 'font-serif-display italic text-[8rem] md:text-[11rem] tracking-tighter',
              )}
            >
              {scorePct}
            </span>
            <span
              className={cn(
                'text-white/20 mb-4 md:mb-6',
                isRTL ? 'font-arabic font-bold text-3xl' : 'font-serif-display text-2xl md:text-4xl',
              )}
            >
              /100
            </span>
          </div>

          {/* Minimal score bar */}
          <div className="mt-8 max-w-sm">
            <div className="h-px bg-white/8 w-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-[2000ms] ease-out', palette.bar)}
                style={{ width: barFilled ? `${scorePct}%` : '0%' }}
              />
            </div>
            <div
              className={cn(
                'mt-3 flex justify-between text-[9px] text-white/25',
                isRTL
                  ? 'flex-row-reverse font-arabic tracking-normal text-xs'
                  : 'uppercase tracking-[0.3em]',
              )}
            >
              <span>{isRTL ? 'صفر مخاطر' : 'No risk'}</span>
              <span>{isRTL ? 'خطر قصوى' : 'Maximum risk'}</span>
            </div>
          </div>
        </motion.section>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* IV · BLIND SPOT EVIDENCE                                       */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {blindSpots.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn('py-20 md:py-28', isRTL && 'text-right')}
          >
            <Eyebrow color="text-ember" isRTL={isRTL}>
              {labels.blindSpotsSection}
            </Eyebrow>

            <ul className="space-y-0">
              {blindSpots.map((spot, i) => (
                <motion.li
                  key={spot}
                  initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'group flex items-baseline gap-6 border-b border-white/[0.05] py-7',
                    isRTL && 'flex-row-reverse',
                  )}
                >
                  {/* Evidence number */}
                  <span
                    className={cn(
                      'flex-shrink-0 text-ember/40 group-hover:text-ember/70 transition-colors duration-300 tabular-nums',
                      isRTL
                        ? 'font-arabic text-lg'
                        : 'font-serif-display italic text-xl md:text-2xl',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Connecting rule */}
                  <span className="flex-1 h-px bg-white/[0.06] group-hover:bg-white/10 transition-colors duration-300 self-center" />

                  {/* Finding */}
                  <span
                    className={cn(
                      'text-xl md:text-2xl text-white/80 group-hover:text-white/95 transition-colors duration-300',
                      isRTL
                        ? 'font-arabic leading-[1.6] text-lg md:text-xl'
                        : 'font-serif-display leading-snug',
                    )}
                  >
                    {spot}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        )}

        {blindSpots.length > 0 && <SectionSeparator />}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* V · IF IGNORED                                                 */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('py-20 md:py-28', isRTL && 'text-right')}
        >
          <Eyebrow
            color={riskBucket === 'high' ? 'text-red-500/70' : 'text-ember/70'}
            isRTL={isRTL}
          >
            {labels.consequencesSection}
          </Eyebrow>

          <p
            className={cn(
              'max-w-2xl',
              riskBucket === 'high' ? 'text-white/75' : 'text-white/70',
              isRTL
                ? 'font-arabic text-xl md:text-2xl leading-[2]'
                : 'font-serif-display text-2xl md:text-4xl leading-[1.3] tracking-tight',
            )}
          >
            {consequence}
          </p>

          {/* High-risk warning band */}
          {riskBucket === 'high' && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn('mt-10 flex items-center gap-4', isRTL && 'flex-row-reverse')}
            >
              <div className="h-px flex-1 bg-red-500/20 origin-left" />
              <span
                className={cn(
                  'text-[9px] text-red-500/60 flex-shrink-0',
                  isRTL ? 'font-arabic tracking-normal text-xs' : 'uppercase tracking-[0.45em]',
                )}
              >
                {isRTL ? 'الوقت ينفد' : 'Time is depleting'}
              </span>
              <div className="h-px flex-1 bg-red-500/20 origin-right" />
            </motion.div>
          )}
        </motion.section>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* VI · RECOVERY PATH                                             */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('py-20 md:py-28', isRTL && 'text-right')}
        >
          <Eyebrow isRTL={isRTL}>{labels.recoverySection}</Eyebrow>

          <p
            className={cn(
              'text-white/55 max-w-xl',
              isRTL
                ? 'font-arabic text-lg leading-[2.2]'
                : 'text-lg md:text-xl font-light leading-relaxed',
            )}
          >
            {recovery}
          </p>
        </motion.section>

        <SectionSeparator />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* VII · DYNAMIC CTA                                              */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('py-20 md:py-28', isRTL && 'text-right')}
        >
          <Eyebrow
            color={riskBucket === 'high' ? 'text-red-500/70' : 'text-ember/70'}
            isRTL={isRTL}
          >
            {labels.nextMoveSection}
          </Eyebrow>

          {primaryCta && (
            <div className="space-y-6">
              {/* Primary CTA — full-width, heavy */}
              <Link
                to={`${contactPath}?intent=${primaryCta.intent}`}
                className={cn(
                  'group relative w-full flex items-center justify-between gap-6 px-8 py-7',
                  'border transition-all duration-500 overflow-hidden',
                  primaryCta.urgent
                    ? [
                        'border-red-500/60 bg-red-950/20',
                        'hover:bg-red-500 hover:border-red-500',
                        palette.urgentRing,
                      ]
                    : [
                        'border-ember/40 bg-ember/[0.05]',
                        'hover:bg-ember hover:border-ember',
                      ],
                  isRTL && 'flex-row-reverse',
                )}
              >
                {/* Urgent pulse underlay */}
                {primaryCta.urgent && (
                  <span
                    aria-hidden
                    className="absolute inset-0 pointer-events-none animate-pulse"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, hsl(0 84% 45% / 0.15), transparent 70%)',
                    }}
                  />
                )}

                <div className={cn('relative space-y-1', isRTL && 'text-right')}>
                  <p
                    className={cn(
                      'text-xl md:text-2xl',
                      primaryCta.urgent
                        ? 'text-red-300 group-hover:text-black'
                        : 'text-ember group-hover:text-black',
                      isRTL
                        ? 'font-arabic font-bold leading-[1.4]'
                        : 'font-serif-display italic leading-snug',
                    )}
                  >
                    {primaryCta.title}
                  </p>
                  <p
                    className={cn(
                      'text-sm text-white/50 group-hover:text-black/60 transition-colors',
                      isRTL ? 'font-arabic leading-[1.9]' : 'font-light',
                    )}
                  >
                    {primaryCta.desc}
                  </p>
                </div>

                <ArrowRight
                  className={cn(
                    'relative flex-shrink-0 size-5',
                    primaryCta.urgent
                      ? 'text-red-400 group-hover:text-black group-hover:translate-x-1'
                      : 'text-ember group-hover:text-black group-hover:translate-x-1',
                    'transition-all duration-300',
                    isRTL && 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0',
                  )}
                />
              </Link>

              {/* Secondary CTAs — minimal text links */}
              {secondaryCtas.length > 0 && (
                <div
                  className={cn(
                    'flex flex-col sm:flex-row gap-x-8 gap-y-4 pt-2',
                    isRTL ? 'sm:flex-row-reverse items-end' : 'items-start',
                  )}
                >
                  {secondaryCtas.map((c) => (
                    <Link
                      key={c.intent}
                      to={`${contactPath}?intent=${c.intent}`}
                      className={cn(
                        'group inline-flex items-center gap-3 pb-px',
                        'border-b border-transparent hover:border-white/25',
                        'text-sm text-white/40 hover:text-white/75 transition-all duration-300',
                        isRTL && 'flex-row-reverse',
                      )}
                    >
                      <span className={isRTL ? 'font-arabic' : undefined}>{c.title}</span>
                      <ArrowRight
                        className={cn(
                          'size-3 opacity-50 group-hover:opacity-100 transition-opacity',
                          isRTL && 'rotate-180',
                        )}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* CASE FOOTER                                                    */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className={cn(
            'border-t border-white/[0.05] py-10 flex items-center justify-between gap-6',
            isRTL && 'flex-row-reverse',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-4 text-[9px] text-white/15',
              isRTL
                ? 'flex-row-reverse font-arabic tracking-normal text-xs'
                : 'uppercase tracking-[0.35em]',
            )}
          >
            <span>{caseId}</span>
            <span className="h-2.5 w-px bg-white/10" />
            <span>{isRTL ? 'مغلق' : 'Case closed'}</span>
          </div>

          <button
            onClick={onReset}
            className={cn(
              'group inline-flex items-center gap-2.5 text-[9px] text-white/25',
              'hover:text-white/60 transition-colors duration-300',
              isRTL
                ? 'flex-row-reverse font-arabic tracking-normal text-xs'
                : 'uppercase tracking-[0.35em]',
            )}
          >
            <RotateCcw className="size-2.5 group-hover:rotate-[-90deg] transition-transform duration-500" />
            {labels.restartDiagnosticLabel}
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — for standalone preview
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_PROPS: CinematicResultProps = {
  verdict: {
    level: 'INSIDE THE VALLEY',
    title: 'You are inside the Valley of Death.',
    insight:
      "You already know. The signals have been there for weeks. What you don't need is more motivation — you need someone to sit across from you and refuse to look away.",
    tone: 'text-ember',
  },
  scorePct: 67,
  blindSpots: [
    'Financial denial',
    'Leadership isolation',
    'Decision paralysis',
  ],
  founderName: 'Mohamed K.',
  riskBucket: 'medium',
  consequence:
    "Without intervention, you have weeks — not months. The next \"small\" decision you defer is the one that takes the company.",
  recovery:
    'Triage runway, team, and the postponed decision — in that order. Choose what you will protect and what you will let go before the choice is taken from you.',
  ctas: [
    {
      title: 'Request a Startup Autopsy',
      desc: "A forensic review of where the company is quietly bleeding — and why.",
      intent: 'autopsy',
    },
    {
      title: 'Build a recovery plan',
      desc: "A 30-day plan to cut, protect, and rebuild on honest numbers.",
      intent: 'recovery',
    },
    {
      title: 'Founder diagnosis session',
      desc: "Private 1:1 with Mohamed Khalil to name what your team won't.",
      intent: 'founder-call',
    },
  ],
  isRTL: false,
  contactPath: '/en/contact',
  labels: {
    diagnosisLabel: 'Diagnosis ·',
    shockEyebrow: 'The truth, said plainly',
    riskScoreLabel: 'Valley Risk Score',
    riskLevelLabel: 'Founder Risk Level',
    blindSpotsSection: 'Blind Spot Indicators',
    consequencesSection: 'If you ignore this',
    recoverySection: 'Recovery path',
    nextMoveSection: 'Your next move',
    restartDiagnosticLabel: 'Restart diagnostic',
  },
  onReset: () => {},
};

const MOCK_PROPS_HIGH: CinematicResultProps = {
  ...MOCK_PROPS,
  verdict: {
    level: 'COLLAPSE PROXIMITY',
    title: "You are closer to collapse than you're admitting.",
    insight:
      "This is not a coaching moment. It's a triage moment. The runway, the team, and your nervous system are all running on credit. Stop performing. Start cutting.",
    tone: 'text-red-500',
  },
  scorePct: 88,
  blindSpots: ['Financial denial', 'No exit plan', 'Identity fusion', 'Decision paralysis'],
  riskBucket: 'high',
  consequence:
    "The runway, the team, and your nervous system are all running on credit. Without triage now, this becomes a post-mortem someone else writes.",
  recovery:
    "Stop performing. Stop hiring. Stop launching. Sit with one person who has seen this before and rebuild the next 30 days from honest math.",
  ctas: [
    {
      title: 'Emergency Founder Session',
      desc: 'This week. We triage runway, team, and the decision you\'ve been postponing. Limited intake.',
      intent: 'emergency',
      urgent: true,
    },
  ],
};

const MOCK_PROPS_AR: CinematicResultProps = {
  ...MOCK_PROPS,
  verdict: {
    level: 'داخل وادي الموت',
    title: 'أنتَ داخل وادي الموت.',
    insight:
      'أنتَ تعرف بالفعل. الإشارات كانت موجودة منذ أسابيع. ما تحتاجه ليس مزيداً من التحفيز، بل شخصاً يجلس في مواجهتك ويرفض إغماض عينيه.',
    tone: 'text-ember',
  },
  blindSpots: ['إنكار مالي', 'عزل قيادي', 'شلل القرار'],
  founderName: 'محمد خ.',
  isRTL: true,
  contactPath: '/ar/contact',
  labels: {
    diagnosisLabel: 'التشخيص ·',
    shockEyebrow: 'الحقيقة، دون تجميل',
    riskScoreLabel: 'درجة مخاطر الوادي',
    riskLevelLabel: 'مستوى مخاطر المؤسس',
    blindSpotsSection: 'مؤشرات نقاط العمى',
    consequencesSection: 'إن تجاهلتَ هذا',
    recoverySection: 'مسار التعافي',
    nextMoveSection: 'خطوتك التالية',
    restartDiagnosticLabel: 'إعادة التشخيص',
  },
  consequence:
    'دون تدخّل، أمامك أسابيع لا أشهر. القرار "الصغير" التالي الذي تؤجّله هو الذي سيأخذ الشركة.',
  recovery:
    'حدّد الأولويات: التدفق، الفريق، القرار المؤجَّل — بهذا الترتيب. اختر ما ستحميه وما ستتركه قبل أن يُفرض الاختيار عليك.',
  ctas: [
    {
      title: 'اطلب تشريح شركتك',
      desc: 'مراجعة جنائية لمكان النزف الصامت — ولماذا يحدث الآن.',
      intent: 'autopsy',
    },
    {
      title: 'ابنِ خطة تعافٍ',
      desc: 'خطة ٣٠ يوماً لقطع، وحماية، وإعادة البناء على أرقام صادقة.',
      intent: 'recovery',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Preview wrappers — temporary routes during visual review
// ─────────────────────────────────────────────────────────────────────────────

export function CinematicAssessmentResultPreview() {
  const [variant, setVariant] = useState<'medium' | 'high' | 'ar'>('medium');
  const props =
    variant === 'high' ? MOCK_PROPS_HIGH : variant === 'ar' ? MOCK_PROPS_AR : MOCK_PROPS;

  return (
    <div className="dark bg-black min-h-screen">
      {/* Variant switcher — remove before production */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 font-mono text-[10px]">
        {(['medium', 'high', 'ar'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={cn(
              'px-3 py-1.5 border transition-colors',
              variant === v
                ? 'border-ember text-ember bg-ember/10'
                : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white/60',
            )}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>

      <CinematicAssessmentResult key={variant} {...props} />
    </div>
  );
}
