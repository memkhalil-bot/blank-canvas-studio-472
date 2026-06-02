import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { BookingContainer } from '@/components/booking/BookingContainer';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const STEPS = {
  en: [
    { n: '01', title: 'Review', body: 'Your case file and submitted context are reviewed before the session.' },
    { n: '02', title: 'Diagnosis', body: 'A forensic read of your specific failure patterns and blind spots.' },
    { n: '03', title: 'Strategic Discussion', body: 'An honest conversation about what is actually happening.' },
    { n: '04', title: 'Action Plan', body: 'Specific interventions calibrated to your risk level.' },
  ],
  ar: [
    { n: '٠١', title: 'المراجعة', body: 'تُراجَع ملفات حالتك والسياق المُقدَّم قبل الجلسة.' },
    { n: '٠٢', title: 'التشخيص', body: 'قراءة جنائية لأنماط الفشل الخاصة بك ونقاط عمائك.' },
    { n: '٠٣', title: 'النقاش الاستراتيجي', body: 'محادثة صادقة حول ما يحدث فعلاً.' },
    { n: '٠٤', title: 'خطة العمل', body: 'تدخلات محددة معايَرة وفق مستوى مخاطرك.' },
  ],
};

const TRUST = {
  en: ['Confidential', 'Founder-only', 'No spam', 'No investor disclosure'],
  ar: ['سري', 'للمؤسسين فقط', 'لا بريد مزعج', 'لا مشاركة مع المستثمرين'],
};

export default function ThankYou() {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  const location = useLocation();
  const name = (location.state as { name?: string } | null)?.name;
  const steps = STEPS[lang];
  const trust = TRUST[lang];

  return (
    <div className={cn('dark bg-black text-white min-h-screen', isRTL ? 'font-arabic' : 'font-sans-ui')}>
      <SEOHead
        title={isRTL ? 'تم الاستلام — خبير الفشل' : 'Request Received — Khabeer Al Fashal'}
        description={isRTL ? 'طلبك في أيدي أمينة.' : 'Your request is in safe hands.'}
      />

      {/* SECTION 1 — CONFIRMATION */}
      <section className="relative pt-40 pb-24 px-6 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(18_92%_55%/0.10),transparent_60%)]" />
        <div className={cn('relative max-w-3xl mx-auto', isRTL && 'text-right')}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn('h-px w-16 bg-ember mb-12', isRTL && 'mr-auto')}
            style={{ transformOrigin: isRTL ? 'right' : 'left' }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={cn('text-[10px] uppercase text-ember mb-8', isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.45em]')}
          >
            {isRTL ? 'تم الاستلام' : 'Request received'}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn('tracking-tight mb-8', isRTL ? 'font-arabic font-bold text-4xl md:text-6xl leading-[1.3]' : 'font-serif-display text-5xl md:text-7xl leading-[1.0]')}
          >
            {name
              ? (isRTL ? `${name}، طلبك آمن.` : `${name}, your request is secured.`)
              : (isRTL ? 'طلبك آمن.' : 'Your request is secured.')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className={cn('text-lg md:text-xl text-white/50 max-w-xl font-light leading-relaxed', isRTL && 'leading-[2.2]')}
          >
            {isRTL
              ? 'سنراجع ملف حالتك ونعود بالخطوة التالية. قد يستغرق ذلك ٢٤–٤٨ ساعة.'
              : 'We will review your case file and return with the next step. This typically takes 24–48 hours.'}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 — GUIDANCE */}
      <section className="border-t border-white/5 px-6 lg:px-12 py-20">
        <div className={cn('max-w-3xl mx-auto', isRTL && 'text-right')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className={cn('text-[10px] uppercase text-white/28 mb-8', isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.4em]')}>
              {isRTL ? 'ريثما ننتظر' : 'While you wait'}
            </p>
            <p className={cn('text-xl md:text-2xl text-white/65 font-light leading-relaxed', isRTL ? 'font-arabic leading-[2]' : undefined)}>
              {isRTL
                ? 'استخدم هذا الوقت لتوثيق الأمور التي تجنّبت التفكير فيها. كلما جئت بأكثر صدقاً، زادت دقة التشخيص.'
                : 'Use this time to document the things you have been avoiding thinking about. The more honest you arrive, the more accurate the diagnosis.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — ROADMAP */}
      <section className="border-t border-white/5 px-6 lg:px-12 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={cn('text-[10px] uppercase text-white/28 mb-14', isRTL ? 'font-arabic tracking-normal text-sm text-right' : 'tracking-[0.4em]')}
          >
            {isRTL ? 'ما يحدث بعد ذلك' : 'What happens next'}
          </motion.p>
          <div className="grid md:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={cn('bg-black p-8 relative', isRTL && 'text-right')}
              >
                <div className={cn('flex items-center gap-3 mb-5', isRTL && 'flex-row-reverse')}>
                  {i < steps.length - 1 && (
                    <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-white/10" />
                  )}
                  <span className={cn('text-[10px] text-ember', isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.35em] uppercase font-medium')}>
                    {step.n}
                  </span>
                </div>
                <h3 className={cn('text-lg mb-3', isRTL ? 'font-arabic font-bold' : 'font-serif-display')}>
                  {step.title}
                </h3>
                <p className={cn('text-sm text-white/45 font-light leading-relaxed', isRTL && 'font-arabic leading-[2]')}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — BOOKING */}
      <section className="border-t border-white/5 px-6 lg:px-12 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className={cn('text-[10px] uppercase text-white/28 mb-8', isRTL ? 'font-arabic tracking-normal text-sm text-right' : 'tracking-[0.4em]')}>
              {isRTL ? 'تحديد موعد الجلسة' : 'Schedule your session'}
            </p>
            <BookingContainer isRTL={isRTL} />
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — TRUST */}
      <section className="border-t border-white/5 px-6 lg:px-12 py-16">
        <div className={cn('max-w-3xl mx-auto', isRTL && 'text-right')}>
          <div className={cn('flex flex-wrap gap-6 items-center justify-center md:justify-start', isRTL && 'md:justify-end')}>
            {trust.map(item => (
              <div key={item} className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <span className="text-ember/50 text-xs">◆</span>
                <span className={cn('text-[10px] text-white/30', isRTL ? 'font-arabic tracking-normal text-sm' : 'uppercase tracking-[0.25em]')}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
