import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AssessmentResult — standalone, minimal, cinematic result screen.
 * Black / white / orange. No SaaS cards. No dashboard. No over-animation.
 * Six clean sections: shock, score, founder state, blind spots,
 * if ignored, recommended next action.
 */

type CTA = { title: string; desc: string; intent: string; urgent?: boolean };

interface Props {
  verdict: { level: string; title: string; tone: string; insight: string };
  scorePct: number;
  blindSpots: string[];
  founderName?: string | null;
  riskBucket: 'low' | 'medium' | 'high';
  consequence: string;
  recovery: string;
  ctas: CTA[];
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

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export function AssessmentResult({
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
}: Props) {
  const accent =
    riskBucket === 'high'
      ? 'text-red-400'
      : riskBucket === 'medium'
      ? 'text-ember'
      : 'text-emerald-400';

  const primaryCta = ctas[0];
  const secondaryCtas = ctas.slice(1);

  const eyebrow = (text: string, color = 'text-white/35') =>
    cn(
      'text-[10px] uppercase mb-6',
      color,
      isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.4em]'
    );

  return (
    <div className={cn('relative space-y-24 md:space-y-32', isRTL && 'text-right')}>
      {/* 1 · SHOCK SENTENCE */}
      <section className="min-h-[55vh] flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            'text-[10px] uppercase mb-10',
            accent,
            isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.5em]'
          )}
        >
          {labels.shockEyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-3xl text-white',
            isRTL ? 'font-arabic font-bold leading-[1.3]' : 'font-serif-display'
          )}
        >
          <span className={cn(!isRTL && 'italic')}>{verdict.title}</span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 2, ease: [0.16, 1, 0.3, 1] }}
          className={cn('mt-14 h-px w-24 bg-ember/60 origin-left', isRTL && 'origin-right ml-auto')}
        />
      </section>

      {/* 2 · RISK SCORE + 3 · FOUNDER STATE — paired, inline typography */}
      <motion.section {...fade} transition={{ duration: 1 }}>
        <p className={eyebrow(labels.diagnosisLabel + ' ' + (founderName ?? ''))}>
          {labels.diagnosisLabel} {founderName ?? ''}
        </p>
        <div className={cn('grid gap-12 md:grid-cols-2 items-end')}>
          <div>
            <p
              className={cn(
                'text-[10px] uppercase text-white/40 mb-4',
                isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.3em]'
              )}
            >
              {labels.riskScoreLabel}
            </p>
            <p
              className={cn(
                'leading-none tabular-nums',
                accent,
                isRTL ? 'font-arabic font-bold text-6xl md:text-8xl' : 'font-serif-display italic text-7xl md:text-9xl'
              )}
            >
              {scorePct}
              <span className="text-2xl md:text-3xl text-white/25">/100</span>
            </p>
          </div>
          <div>
            <p
              className={cn(
                'text-[10px] uppercase text-white/40 mb-4',
                isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.3em]'
              )}
            >
              {labels.riskLevelLabel}
            </p>
            <p
              className={cn(
                'leading-tight',
                accent,
                isRTL ? 'font-arabic font-bold text-2xl md:text-4xl' : 'font-serif-display text-3xl md:text-5xl'
              )}
            >
              {verdict.level}
            </p>
            <p
              className={cn(
                'mt-6 text-base md:text-lg text-white/65 leading-relaxed max-w-md',
                isRTL ? 'font-arabic leading-[2]' : 'font-light'
              )}
            >
              {verdict.insight}
            </p>
          </div>
        </div>
      </motion.section>

      {/* 4 · BLIND SPOTS */}
      {blindSpots.length > 0 && (
        <motion.section {...fade} transition={{ duration: 1 }} className="border-t border-white/10 pt-12">
          <p className={eyebrow(labels.blindSpotsSection, 'text-ember')}>
            {labels.blindSpotsSection}
          </p>
          <ul className="space-y-5 max-w-2xl">
            {blindSpots.map((b, i) => (
              <li
                key={b}
                className={cn(
                  'flex items-baseline gap-6 border-b border-white/[0.06] pb-5',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <span className="font-serif-display text-ember/70 tabular-nums text-lg md:text-xl flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'text-lg md:text-2xl text-white/85',
                    isRTL ? 'font-arabic leading-[1.7]' : 'font-serif-display leading-snug'
                  )}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* 5 · IF IGNORED */}
      <motion.section {...fade} transition={{ duration: 1 }} className="border-t border-white/10 pt-12">
        <p className={eyebrow(labels.consequencesSection, riskBucket === 'high' ? 'text-red-400' : 'text-ember')}>
          {labels.consequencesSection}
        </p>
        <p
          className={cn(
            'text-xl md:text-3xl leading-[1.4] text-white/80 max-w-3xl',
            isRTL ? 'font-arabic leading-[1.9]' : 'font-serif-display'
          )}
        >
          {consequence}
        </p>
      </motion.section>

      {/* 6 · RECOMMENDED NEXT ACTION */}
      <motion.section {...fade} transition={{ duration: 1 }} className="border-t border-white/10 pt-12">
        <p className={eyebrow(labels.nextMoveSection, riskBucket === 'high' ? 'text-red-400' : 'text-ember')}>
          {labels.nextMoveSection}
        </p>
        <p
          className={cn(
            'text-base md:text-lg text-white/60 max-w-2xl mb-10',
            isRTL ? 'font-arabic leading-[2]' : 'font-light leading-relaxed'
          )}
        >
          {recovery}
        </p>

        {primaryCta && (
          <Link
            to={`${contactPath}?intent=${primaryCta.intent}`}
            className={cn(
              'group inline-flex items-center gap-5 px-8 py-5 transition-all duration-500',
              primaryCta.urgent
                ? 'bg-red-500 text-black hover:bg-white'
                : 'bg-ember text-black hover:bg-white',
              isRTL && 'flex-row-reverse'
            )}
          >
            <span
              className={cn(
                'text-sm uppercase font-semibold',
                isRTL ? 'font-arabic tracking-normal' : 'tracking-[0.25em]'
              )}
            >
              {primaryCta.title}
            </span>
            <ArrowRight
              className={cn('size-4 group-hover:translate-x-1 transition-transform', isRTL && 'rotate-180')}
            />
          </Link>
        )}

        {secondaryCtas.length > 0 && (
          <div className={cn('mt-8 flex flex-wrap gap-x-8 gap-y-3', isRTL && 'justify-end')}>
            {secondaryCtas.map((c) => (
              <Link
                key={c.intent}
                to={`${contactPath}?intent=${c.intent}`}
                className={cn(
                  'group inline-flex items-center gap-3 text-sm text-white/55 hover:text-ember transition-colors border-b border-transparent hover:border-ember/50 pb-1',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <span className={isRTL ? 'font-arabic' : undefined}>{c.title}</span>
                <ArrowRight className={cn('size-3 opacity-60', isRTL && 'rotate-180')} />
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      {/* restart */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onReset}
          className={cn(
            'inline-flex items-center gap-3 text-[10px] uppercase text-white/35 hover:text-ember transition-colors',
            isRTL ? 'font-arabic tracking-normal text-sm flex-row-reverse' : 'tracking-[0.3em]'
          )}
        >
          <RotateCcw className="size-3" /> {labels.restartDiagnosticLabel}
        </button>
      </div>
    </div>
  );
}
