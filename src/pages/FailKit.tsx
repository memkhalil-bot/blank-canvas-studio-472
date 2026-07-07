import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Eye,
  TrendingDown,
  Scissors,
  Thermometer,
  ShieldOff,
  Zap,
  ArrowUpRight,
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SEOHead } from '@/components/seo/SEOHead'
import { cn } from '@/lib/utils'
import { failKitT } from '@/i18n/failKitTranslations'

// PRODUCT IMAGE: uncomment these two lines when src/assets/fail-kit-product.png is available,
// then replace the placeholder <div> in the PRODUCT VISUAL section below with:
//   <img src={failKitProduct} alt="Fail Kit™ — Emergency Use Only"
//        className="w-full h-full object-cover object-center
//                   group-hover:scale-[1.02] transition-transform duration-[2000ms]" />
// import failKitProduct from '@/assets/fail-kit-product.png'

// ── Types ─────────────────────────────────────────────────────────────────────
type Size      = 'solo' | 'nucleus' | 'scaling' | 'established'
type Condition = 'stable' | 'bleeding' | 'critical' | 'recovery'

interface Protocol { kit: string; phase: string; probability: number; window: string }

// ── Static module data (bilingual) ────────────────────────────────────────────
const MODULES = [
  {
    id: 'MOD_01',
    Icon: Activity,
    en: { title: 'Diagnostic Sheet',   sub: 'Gauze //',             body: 'Identifies where the startup is bleeding. Analyzes churn and burn rates in real-time with forensic precision.' },
    ar: { title: 'ورقة التشخيص',      sub: 'شاش //',               body: 'تحدد مواطن النزيف في الشركة. تحلل معدلات الاستنزاف في الوقت الفعلي بدقة جنائية.' },
  },
  {
    id: 'MOD_02',
    Icon: Eye,
    en: { title: 'Reality Check',      sub: 'Antiseptic //',        body: 'Cleans founder illusion and denial. High-concentration truth prepared for board-level transparency.' },
    ar: { title: 'اختبار الواقع',     sub: 'مطهِّر //',            body: 'يزيل وهم المؤسس وحالة الإنكار. حقائق عالية التركيز مُعدَّة للشفافية على مستوى مجلس الإدارة.' },
  },
  {
    id: 'MOD_03',
    Icon: TrendingDown,
    en: { title: 'Cash Burn Control',  sub: 'Bandage //',           body: 'Stops financial bleeding. Compression wraps for runway extensions and immediate protocols.' },
    ar: { title: 'التحكم في الحرق',   sub: 'ضمادة //',             body: 'يوقف النزيف المالي. ضغط شامل لتمديد مدة التشغيل وبروتوكولات فورية.' },
  },
  {
    id: 'MOD_04',
    Icon: Scissors,
    en: { title: 'Cut List',           sub: 'Surgical Scissors //', body: 'Precision trimming of non-core operations to save the host organism.' },
    ar: { title: 'قائمة التخفيضات',  sub: 'مقص جراحي //',        body: 'تشذيب دقيق للعمليات غير الأساسية لإنقاذ الكيان الأساسي.' },
  },
  {
    id: 'MOD_05',
    Icon: Thermometer,
    en: { title: 'Team Temperature',   sub: 'Thermometer //',       body: 'Measures team pressure and cultural stress levels before the terminal fever.' },
    ar: { title: 'حرارة الفريق',      sub: 'ميزان الحرارة //',     body: 'يقيس ضغط الفريق ومستويات الإجهاد الثقافي قبل الحمى المميتة.' },
  },
  {
    id: 'MOD_06',
    Icon: ShieldOff,
    en: { title: 'Founder Objectivity',sub: 'Black Gloves //',      body: 'Separates ego from evidence. Sterile handling of critical pivots.' },
    ar: { title: 'موضوعية المؤسس',   sub: 'قفازات سوداء //',      body: 'يفصل الأنا عن الأدلة. تعامل معقم مع التحولات الحاسمة.' },
  },
]

const SIZES: { id: Size; en: string; enSub: string; ar: string; arSub: string }[] = [
  { id: 'solo',        en: 'SOLO',        enSub: 'FOUNDER ONLY',    ar: 'منفرد',    arSub: 'مؤسس وحيد' },
  { id: 'nucleus',     en: 'NUCLEUS',     enSub: '2–10 EMPLOYEES',  ar: 'نواة',     arSub: '٢–١٠ موظفين' },
  { id: 'scaling',     en: 'SCALING',     enSub: '11–30 EMPLOYEES', ar: 'في النمو', arSub: '١١–٣٠ موظفاً' },
  { id: 'established', en: 'ESTABLISHED', enSub: '31+ EMPLOYEES',   ar: 'قائمة',   arSub: '٣١+ موظف' },
]

const CONDITIONS: { id: Condition; en: string; ar: string; risk: string; riskAr: string; isExtreme?: boolean }[] = [
  { id: 'stable',   en: 'Stable but Blind',            ar: 'مستقرة لكن عمياء',   risk: 'LOW RISK',      riskAr: 'خطر منخفض'  },
  { id: 'bleeding', en: 'Visible Bleeding',            ar: 'نزيف ظاهر',           risk: 'MODERATE RISK', riskAr: 'خطر متوسط'  },
  { id: 'critical', en: 'Critical (Autopsy Imminent)', ar: 'حرجة (وفاة وشيكة)',  risk: 'EXTREME RISK',  riskAr: 'خطر قصوى', isExtreme: true },
  { id: 'recovery', en: 'In Recovery',                 ar: 'في مرحلة التعافي',   risk: 'WATCH',         riskAr: 'تحت المراقبة' },
]

const PROTOCOLS: Record<Size, Record<Condition, Protocol>> = {
  solo:        {
    stable:   { kit: 'FOUNDER CLARITY KIT',   phase: 'SELF-DIAGNOSTIC',   probability: 78, window: '30D'  },
    bleeding: { kit: 'BLEED CONTROL LITE',    phase: 'CASH BURN WRAP',    probability: 65, window: '72H'  },
    critical: { kit: 'EMERGENCY SOLO',        phase: 'TRIAGE PROTOCOL',   probability: 44, window: '48H'  },
    recovery: { kit: 'RECOVERY TRACK A',      phase: 'STABILIZATION',     probability: 82, window: '45D'  },
  },
  nucleus:     {
    stable:   { kit: 'NUCLEUS DIAGNOSTIC',    phase: 'TEAM CALIBRATION',  probability: 80, window: '21D'  },
    bleeding: { kit: 'BLEED CONTROL PRO',     phase: 'CASH BURN WRAP',    probability: 62, window: '72H'  },
    critical: { kit: 'EMERGENCY RESPONSE',    phase: 'TRIAGE PROTOCOL',   probability: 41, window: '48H'  },
    recovery: { kit: 'NUCLEUS RECOVERY',      phase: 'STABILIZATION',     probability: 85, window: '60D'  },
  },
  scaling:     {
    stable:   { kit: 'SCALING AUDIT',         phase: 'GROWTH DIAGNOSTIC', probability: 76, window: '14D'  },
    bleeding: { kit: 'SCALE BLEED CONTROL',   phase: 'UNIT ECONOMICS',    probability: 58, window: '96H'  },
    critical: { kit: 'SCALING EMERGENCY',     phase: 'CRITICAL PIVOT',    probability: 38, window: '48H'  },
    recovery: { kit: 'SCALE RECOVERY',        phase: 'CONSOLIDATION',     probability: 79, window: '90D'  },
  },
  established: {
    stable:   { kit: 'ENTERPRISE DIAGNOSTIC', phase: 'SYSTEMIC REVIEW',   probability: 82, window: '30D'  },
    bleeding: { kit: 'CORPORATE TRIAGE',      phase: 'CASH COMPRESSION',  probability: 55, window: '120H' },
    critical: { kit: 'ENTERPRISE EMERGENCY',  phase: 'SURVIVAL PROTOCOL', probability: 35, window: '72H'  },
    recovery: { kit: 'ENTERPRISE RECOVERY',   phase: 'RESTRUCTURING',     probability: 75, window: '120D' },
  },
}

// ── Shared animation preset ───────────────────────────────────────────────────
const inView = {
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
} as const

// ── Shared class fragments ────────────────────────────────────────────────────
const glassCard = 'bg-[rgba(20,20,20,0.7)] backdrop-blur-[24px] border border-white/[0.08]'
const tacticalBorder = 'border border-white/10'
const activeGlow = 'border-ember/60 bg-ember/10 [box-shadow:inset_0_0_12px_rgba(208,125,30,0.2)]'

// ── Component ─────────────────────────────────────────────────────────────────
export default function FailKit() {
  const { lang, getPath } = useLanguage()
  const isRTL = lang === 'ar'
  const t = failKitT[lang].landingPage

  const [selectedSize,      setSelectedSize]      = useState<Size>('nucleus')
  const [selectedCondition, setSelectedCondition] = useState<Condition>('bleeding')
  const protocol = PROTOCOLS[selectedSize][selectedCondition]

  return (
    <div
      className={cn(
        'dark bg-[#0e0e0e] text-white min-h-screen overflow-x-hidden',
        isRTL ? 'font-arabic' : 'font-mono-data'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEOHead title={t.metaTitle} description={t.metaDesc} />

      {/* Atmospheric scanline overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.06]"
        style={{
          background: 'linear-gradient(to bottom, transparent 50%, rgba(208,125,30,0.04) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="min-h-screen pt-28 md:pt-32 flex flex-col items-center bg-[#0e0e0e]">
        <div className="max-w-[1440px] w-full px-6 md:px-10 lg:px-16 flex flex-col items-center gap-12 md:gap-16 pb-20 md:pb-24">

          {/* Text block */}
          <div className="w-full text-center space-y-6 md:space-y-8 z-10 mt-8 md:mt-12">
            <motion.p
              {...inView}
              className="font-mono-data text-ember tracking-[0.4em] uppercase text-[11px] md:text-xs"
            >
              {t.eyebrow}
            </motion.p>

            {/* Arabic headline — Arabic-first priority, always dir=rtl */}
            <motion.h1
              {...inView}
              transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-arabic font-bold text-5xl md:text-7xl lg:text-[84px] leading-[1.15] max-w-5xl mx-auto"
              dir="rtl"
            >
              {t.heroAr1}
              <br />
              <span className="bg-gradient-to-br from-[#ffb876] to-ember bg-clip-text text-transparent">
                {t.heroAr2}
              </span>
            </motion.h1>

            {/* English subtitle */}
            <motion.h2
              {...inView}
              transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-display text-xl md:text-3xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              {t.heroEnLine1}{' '}
              <em className="text-ember">{t.heroEnAccent}</em>
            </motion.h2>

            {/* Hero CTA */}
            <motion.div
              {...inView}
              transition={{ duration: 0.95, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-2 md:pt-4"
            >
              <Link
                to={getPath('/fail-kit-request')}
                className={cn(
                  'inline-flex items-center gap-4',
                  'bg-[#d07d1e] text-black',
                  'px-10 md:px-14 py-5 md:py-7',
                  'font-mono-data uppercase tracking-[0.2em] text-[11px] md:text-xs',
                  'hover:bg-ember transition-colors duration-300',
                  isRTL && 'flex-row-reverse'
                )}
              >
                {t.heroCta}
                <span className="opacity-60 text-base" dir="rtl">
                  {t.heroCtaAr}
                </span>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </motion.div>
          </div>

          {/* ── PRODUCT VISUAL ────────────────────────────────────────────────── */}
          {/*                                                                      */}
          {/* TO ACTIVATE REAL IMAGE:                                              */}
          {/*   1. Copy fail-kit-product.png → src/assets/fail-kit-product.png    */}
          {/*   2. Uncomment the import at the top of this file                   */}
          {/*   3. Replace the <div className="...placeholder..."> block below     */}
          {/*      with: <img src={failKitProduct} alt="Fail Kit™ — Emergency Use Only" */}
          {/*                 className="w-full h-full object-cover object-center  */}
          {/*                            group-hover:scale-[1.02]                  */}
          {/*                            transition-transform duration-[2000ms]" /> */}
          {/*                                                                      */}
          <motion.div
            {...inView}
            transition={{ duration: 1.2, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(208,125,30,0.15)] group">

              {/* ── PLACEHOLDER: remove this div when image asset is added ──── */}
              <div className="w-full h-full bg-gradient-to-br from-[#0e0e0e] via-[#160d00] to-[#0e0e0e] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="font-mono-data text-ember/35 text-[10px] tracking-[0.45em] uppercase">
                    FK-001 // ASSET_PENDING
                  </div>
                  <div className="font-serif-display text-ember/20 text-5xl md:text-7xl italic">
                    Fail Kit™
                  </div>
                  <div className="font-mono-data text-ember/20 text-[10px] tracking-[0.35em] uppercase">
                    EMERGENCY USE ONLY
                  </div>
                </div>
              </div>
              {/* ── END PLACEHOLDER ─────────────────────────────────────────── */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 md:bottom-8 end-4 md:end-8 font-mono-data text-ember/50 uppercase tracking-[0.25em] text-[9px] md:text-[10px] bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/5">
                MODEL: FK-OBSIDIAN-001 // SECURE_STORAGE_MODULE
              </div>
            </div>

            {/* Atmosphere glow */}
            <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-ember/10 blur-[120px] pointer-events-none rounded-full" />
          </motion.div>

        </div>
      </section>

      {/* ── INSIDE THE KIT ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-40 lg:py-48 max-w-[1440px] mx-auto">

        <motion.div
          {...inView}
          className={cn(
            'flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-6 md:gap-8',
            isRTL && 'md:flex-row-reverse'
          )}
        >
          <div className={cn('border-s-4 border-ember ps-6 md:ps-8 max-w-3xl', isRTL && 'text-right')}>
            <h3 className={cn(
              'text-4xl md:text-[56px] leading-tight mb-4',
              isRTL ? 'font-arabic font-bold' : 'font-serif-display'
            )}>
              {t.kitTitle}
            </h3>
            <p className="font-mono-data text-white/70 text-base md:text-xl leading-relaxed">
              {t.kitDesc}
            </p>
          </div>
          <div className={cn(
            'font-mono-data text-ember/40 text-[10px] tracking-[0.28em] uppercase whitespace-nowrap',
            isRTL && 'text-right'
          )}>
            {t.kitRef}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {MODULES.map((mod, i) => {
            const copy = isRTL ? mod.ar : mod.en
            return (
              <motion.div
                key={mod.id}
                {...inView}
                transition={{ duration: 0.85, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  glassCard,
                  'p-8 md:p-12 space-y-6 group',
                  'hover:[border-color:rgba(208,125,30,0.35)]',
                  'hover:[box-shadow:inset_0_0_16px_rgba(208,125,30,0.1)]',
                  'transition-all duration-500',
                  isRTL && 'text-right'
                )}
              >
                <div className={cn('flex justify-between items-start', isRTL && 'flex-row-reverse')}>
                  <span className="font-mono-data text-ember text-[10px] tracking-widest">{mod.id}</span>
                  <mod.Icon className="w-7 h-7 text-white/25 group-hover:text-ember/60 transition-colors duration-500" />
                </div>
                <div className="space-y-3">
                  <h4 className={cn(
                    'text-xl md:text-2xl uppercase tracking-wider',
                    isRTL ? 'font-arabic font-bold' : 'font-mono-data'
                  )}>
                    {copy.title}
                  </h4>
                  <p className="font-mono-data text-white/65 text-sm md:text-base leading-relaxed">
                    <span className="text-ember font-bold">{copy.sub}</span>{' '}
                    {copy.body}
                  </p>
                </div>
              </motion.div>
            )
          })}

          {/* MOD_07 — Emergency Session (full width) */}
          <motion.div
            {...inView}
            transition={{ duration: 0.85, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              glassCard,
              'p-10 md:p-14 lg:p-16 md:col-span-2 lg:col-span-3',
              'border-ember/20',
              'flex flex-col lg:flex-row gap-10 md:gap-14 lg:gap-16 items-center',
              'hover:[border-color:rgba(208,125,30,0.4)]',
              'hover:[box-shadow:inset_0_0_16px_rgba(208,125,30,0.1)]',
              'transition-all duration-500',
              isRTL && 'lg:flex-row-reverse text-right'
            )}
          >
            <div className="flex-1 space-y-5 md:space-y-6">
              <div className={cn('flex items-center gap-5', isRTL && 'flex-row-reverse')}>
                <span className="font-mono-data text-ember text-[10px] tracking-widest">MOD_07</span>
                <span className="bg-ember/10 text-ember text-[10px] px-3 py-1 tracking-[0.2em] border border-ember/20 uppercase font-mono-data">
                  {t.emergencyModBadge}
                </span>
              </div>
              <h4 className={cn(
                'text-3xl md:text-4xl uppercase tracking-wider',
                isRTL ? 'font-arabic font-bold' : 'font-mono-data'
              )}>
                {t.emergencyModTitle}
              </h4>
              <p className="font-mono-data text-white/65 text-base md:text-xl lg:text-2xl max-w-4xl leading-relaxed">
                <span className="text-ember font-bold">{t.emergencyModSub}</span>{' '}
                {t.emergencyModBody}
              </p>
            </div>
            <div className={cn('w-full lg:w-auto flex-shrink-0', isRTL && 'flex justify-start lg:justify-end')}>
              <Link
                to={getPath('/book-session')}
                className={cn(
                  'block w-full lg:w-80 px-8 md:px-10 py-6 md:py-7 text-center',
                  'bg-white/5 border border-white/10 text-white',
                  'font-mono-data text-[10px] tracking-[0.2em] uppercase',
                  'hover:bg-ember hover:text-black hover:border-ember',
                  'transition-all duration-500'
                )}
              >
                {t.bookSessionCta}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MATCH YOUR KIT ────────────────────────────────────────────────────── */}
      <section className="bg-[#1c1b1b]/30 px-6 md:px-10 lg:px-16 py-24 md:py-40 lg:py-48 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-16 md:space-y-28 lg:space-y-32">

          {/* Section header */}
          <motion.div {...inView} className="text-center space-y-5 md:space-y-6 max-w-4xl mx-auto">
            <h3 className={cn(
              'text-4xl md:text-[48px] lg:text-[56px] leading-tight',
              isRTL ? 'font-arabic font-bold' : 'font-serif-display'
            )}>
              {t.matchTitle}
            </h3>
            <p className="font-mono-data text-ember tracking-[0.38em] text-[10px] md:text-[11px] uppercase">
              {t.matchEyebrow}
            </p>
            <p className="font-mono-data text-white/65 text-base md:text-xl leading-relaxed">
              {t.matchDesc}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 md:gap-14 lg:gap-20 items-start">

            {/* Left — configurator inputs */}
            <div className="lg:col-span-7 space-y-14 md:space-y-20">

              {/* Size selection */}
              <div className="space-y-8 md:space-y-10">
                <label className={cn(
                  'font-mono-data uppercase tracking-[0.4em] text-ember text-[11px] flex items-center gap-5',
                  isRTL && 'flex-row-reverse'
                )}>
                  <span className="w-10 h-px bg-ember flex-shrink-0" />
                  {t.sizeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {SIZES.map(s => {
                    const active = selectedSize === s.id
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.id)}
                        className={cn(
                          'p-7 md:p-10 text-left relative transition-all duration-300',
                          isRTL && 'text-right',
                          active ? activeGlow : `${tacticalBorder} hover:bg-white/5`
                        )}
                      >
                        <span className={cn(
                          'font-mono-data text-2xl md:text-3xl block mb-1.5',
                          active ? 'text-ember' : 'text-white/90'
                        )}>
                          {isRTL ? s.ar : s.en}
                        </span>
                        <span className={cn(
                          'font-mono-data text-[10px] uppercase tracking-widest',
                          active ? 'text-ember/60' : 'text-white/35'
                        )}>
                          {isRTL ? s.arSub : s.enSub}
                        </span>
                        {active && (
                          <div className="absolute top-3 end-3 w-2 h-2 bg-ember rounded-full shadow-[0_0_8px_rgba(208,125,30,0.9)]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Condition selection */}
              <div className="space-y-8 md:space-y-10">
                <label className={cn(
                  'font-mono-data uppercase tracking-[0.4em] text-ember text-[11px] flex items-center gap-5',
                  isRTL && 'flex-row-reverse'
                )}>
                  <span className="w-10 h-px bg-ember flex-shrink-0" />
                  {t.conditionLabel}
                </label>
                <div className="space-y-3 md:space-y-4">
                  {CONDITIONS.map(c => {
                    const active = selectedCondition === c.id
                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedCondition(c.id)}
                        onKeyDown={e => e.key === 'Enter' && setSelectedCondition(c.id)}
                        className={cn(
                          'flex items-center justify-between p-7 md:p-10 cursor-pointer',
                          'transition-all duration-300',
                          isRTL && 'flex-row-reverse',
                          active ? activeGlow : `${tacticalBorder} hover:bg-white/5`
                        )}
                      >
                        <div className={cn('flex items-center gap-6 md:gap-8', isRTL && 'flex-row-reverse')}>
                          <div className={cn(
                            'w-4 h-4 rounded-full flex-shrink-0 transition-all duration-300',
                            active
                              ? 'bg-ember shadow-[0_0_14px_rgba(208,125,30,0.7)]'
                              : 'border-2 border-white/25'
                          )} />
                          <span className={cn(
                            'font-mono-data text-lg md:text-2xl uppercase tracking-wide',
                            active && 'text-ember',
                            !active && c.id !== 'critical' && 'text-white/85',
                            !active && c.id === 'critical' && 'text-white/50'
                          )}>
                            {isRTL ? c.ar : c.en}
                          </span>
                        </div>
                        <span className={cn(
                          'font-mono-data text-[10px] uppercase tracking-widest flex-shrink-0 ms-4',
                          active && c.isExtreme && 'text-red-400',
                          active && !c.isExtreme && 'text-ember animate-pulse',
                          !active && 'text-white/25'
                        )}>
                          {isRTL ? c.riskAr : c.risk}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right — result panel (sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-36">
              <div className={cn(glassCard, 'border-ember/35 p-10 md:p-14 lg:p-16 space-y-8 md:space-y-10 relative overflow-hidden')}>

                {/* Panel header */}
                <div className={cn(
                  'flex justify-between items-center border-b border-white/10 pb-6 md:pb-8',
                  isRTL && 'flex-row-reverse'
                )}>
                  <span className="font-mono-data text-ember text-base md:text-xl tracking-[0.1em]">
                    {t.proposedProtocol}
                  </span>
                  <Activity className="w-5 h-5 text-ember animate-pulse flex-shrink-0" />
                </div>

                {/* Animated protocol readout */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedSize}-${selectedCondition}-readout`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32 }}
                    className="space-y-4 md:space-y-5"
                  >
                    <div className={cn(
                      'bg-white/5 p-5 md:p-7 border border-white/10 flex justify-between items-center gap-4',
                      isRTL && 'flex-row-reverse'
                    )}>
                      <span className="font-mono-data uppercase tracking-widest text-white/45 text-[9px] flex-shrink-0">
                        {t.recommendedKit}
                      </span>
                      <span className="font-mono-data text-ember text-xs md:text-sm text-right">
                        {protocol.kit}
                      </span>
                    </div>
                    <div className={cn(
                      'bg-white/5 p-5 md:p-7 border border-white/10 flex justify-between items-center gap-4',
                      isRTL && 'flex-row-reverse'
                    )}>
                      <span className="font-mono-data uppercase tracking-widest text-white/45 text-[9px] flex-shrink-0">
                        {t.initialPhase}
                      </span>
                      <span className="font-mono-data text-ember text-xs md:text-sm text-right">
                        {protocol.phase}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Probability bar */}
                <div className="space-y-4 md:space-y-5">
                  <div className={cn(
                    'flex justify-between font-mono-data text-white/45 text-[10px] tracking-[0.18em] uppercase',
                    isRTL && 'flex-row-reverse'
                  )}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${selectedSize}-${selectedCondition}-prob`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {t.survivalProb} {protocol.probability}%
                      </motion.span>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${selectedSize}-${selectedCondition}-win`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-ember"
                      >
                        {t.windowLabel} {protocol.window}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="h-1.5 bg-white/10 w-full relative overflow-hidden">
                    <motion.div
                      key={`${selectedSize}-${selectedCondition}-bar`}
                      className="absolute inset-0 bg-ember shadow-[0_0_18px_rgba(208,125,30,0.55)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${protocol.probability}%` }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {/* Build CTA */}
                <Link
                  to={getPath('/fail-kit-request')}
                  className={cn(
                    'w-full flex items-center justify-center gap-4',
                    'py-6 md:py-7 bg-ember text-black',
                    'font-mono-data text-[10px] uppercase tracking-[0.38em]',
                    'hover:brightness-110 transition-all duration-300'
                  )}
                >
                  {t.buildKit}
                  <Zap className="w-4 h-4 flex-shrink-0" />
                </Link>

                {/* Corner calibration marks */}
                <div aria-hidden="true" className="absolute top-0 start-0 p-3 text-white/10 font-thin text-xl select-none">⎡</div>
                <div aria-hidden="true" className="absolute top-0 end-0 p-3 text-white/10 font-thin text-xl select-none">⎤</div>
                <div aria-hidden="true" className="absolute bottom-0 start-0 p-3 text-white/10 font-thin text-xl select-none">⎣</div>
                <div aria-hidden="true" className="absolute bottom-0 end-0 p-3 text-white/10 font-thin text-xl select-none">⎦</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── WHY THIS EXISTS ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-40 lg:py-48 max-w-6xl mx-auto text-center">
        <motion.div {...inView} className="space-y-10 md:space-y-14">
          <div className="w-28 md:w-40 h-px bg-ember mx-auto" />
          <p className={cn(
            'text-3xl md:text-[48px] lg:text-[56px] leading-tight text-white/80 max-w-5xl mx-auto',
            isRTL ? 'font-arabic font-bold' : 'font-serif-display italic'
          )}>
            {t.whyQuote}
          </p>
        </motion.div>

        <motion.div
          {...inView}
          transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 md:space-y-8 mt-10 md:mt-14"
        >
          <p className="font-mono-data text-ember tracking-[0.48em] uppercase text-[10px] md:text-[11px]">
            {t.whyEyebrow}
          </p>
          <p className="font-mono-data text-white/45 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t.whyBody}
          </p>
        </motion.div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-10 lg:px-16 pb-24 md:pb-40 lg:pb-48">
        <motion.div
          {...inView}
          className={cn(
            glassCard,
            'p-12 md:p-20 lg:p-32 text-center space-y-12 md:space-y-16 relative overflow-hidden'
          )}
          style={{
            background: 'linear-gradient(135deg, rgba(208,125,30,0.06) 0%, transparent 55%), rgba(20,20,20,0.7)',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,125,30,0.08)_0%,transparent_75%)] pointer-events-none"
          />

          <div className="space-y-6 md:space-y-8 relative z-10">
            {/* Arabic heading — always appears first, always dir=rtl */}
            <h2
              className="font-arabic font-bold text-3xl md:text-5xl lg:text-[52px] leading-tight text-white/75"
              dir="rtl"
            >
              {t.finalCtaArHeading}
            </h2>

            {/* English heading — dominant */}
            <h3 className={cn(
              'text-4xl md:text-6xl lg:text-[76px] leading-[0.97] tracking-tight',
              isRTL ? 'font-arabic font-bold' : 'font-serif-display'
            )}>
              {t.finalCtaEnLine1}
              <br className="hidden md:block" />
              {' '}{t.finalCtaEnLine2}
            </h3>
          </div>

          {/* Three CTA buttons */}
          <div className={cn(
            'flex flex-col lg:flex-row justify-center items-stretch gap-4 md:gap-6 lg:gap-8',
            'relative z-10 max-w-5xl mx-auto',
            isRTL && 'lg:flex-row-reverse'
          )}>
            <Link
              to={getPath('/valley-of-death')}
              className={cn(
                'flex-1 px-8 md:px-12 py-6 md:py-7 text-center',
                'bg-[#d07d1e] text-black',
                'font-mono-data text-[10px] uppercase tracking-[0.28em]',
                'hover:bg-ember transition-all duration-300'
              )}
            >
              {t.ctaDiagnosis}
            </Link>
            <Link
              to={getPath('/fail-kit-request')}
              className={cn(
                'flex-1 px-8 md:px-12 py-6 md:py-7 text-center',
                tacticalBorder, 'text-white',
                'font-mono-data text-[10px] uppercase tracking-[0.28em]',
                'hover:bg-white/10 transition-all duration-300'
              )}
            >
              {t.ctaRequestKit}
            </Link>
            <Link
              to={getPath('/book-session')}
              className={cn(
                'flex-1 px-8 md:px-12 py-6 md:py-7 text-center',
                'border-b-2 border-ember text-ember',
                'font-mono-data text-[10px] uppercase tracking-[0.28em]',
                'hover:bg-ember/10 transition-all duration-300'
              )}
            >
              {t.ctaSession}
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
