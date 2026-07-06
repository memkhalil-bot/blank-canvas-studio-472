import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Tag, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { SEOHead } from '@/components/seo/SEOHead';
import { cn } from '@/lib/utils';
import bookCallPhone from '@/assets/book-call-phone.png';
import bookCallPhoneWebp from '@/assets/book-call-phone.webp';

// ── Copy ─────────────────────────────────────────────────────────────────────

// Fixed session type for the simplified first-touch form — no longer chosen
// by the visitor, but still required by the booking_requests schema.
const SESSION_TYPE = 'founder_call';

const copy = {
  en: {
    metaTitle: 'Book a Session — Khabeer Al Fashal',
    metaDesc:  'Request a private session with Khabeer Al Fashal.',
    eyebrow:   'Private Session · جلسة مغلقة',
    heading:   'Request a Session.',
    sub:       'Tell us where you stand and what worries you most — we will reach back with the next step.',
    sessionInfo: 'Private session · Secure booking · Focused on your highest-risk failure patterns',
    pillars: [
      { k: 'Private', v: 'Nothing leaves the room. No notes shared.' },
      { k: 'Direct',  v: 'I will tell you what your team will not.' },
      { k: 'Honest',  v: 'No clichés. No theater. Just the truth on the table.' },
    ],
    formLabel:   'Intake · استمارة',
    formHeading: "Tell me what's actually happening.",
    privacy:   '100% confidential · No investor disclosure · No spam',
    stages: [
      { v: 'idea',         label: 'Idea / Pre-build' },
      { v: 'pre-seed',     label: 'Pre-seed' },
      { v: 'seed',         label: 'Seed' },
      { v: 'series-a',     label: 'Series A+' },
      { v: 'post-failure', label: 'Post-failure / Pivot' },
    ],
    fields: {
      fullName:      'Full Name',
      email:         'Email',
      stage:         'Startup Stage',
      painPoint:     'Biggest Pain Point',
      painPointHint: 'What worries you most right now? Be direct — the more honest the intake, the sharper the session.',
    },
    placeholders: {
      fullName:  'Mohamed K.',
      email:     'you@company.com',
      painPoint: 'The numbers say one thing. My gut says another…',
    },
    promoCode:        'Promo Code (optional)',
    promoPlaceholder: 'FAIL01',
    promoValidating:  'Validating…',
    promoApplied:     'Code applied',
    promoInvalid:     'Invalid or expired code',
    submit:           'Request the Session',
    submitting:       'Submitting…',
    submitDisclaimer: 'Submitting does not guarantee a session. I take a limited number of cases each month based on fit.',
    successHeading:   'Your session request has been received.',
    successBody:      'We will review your case and respond with the next step.',
    errorGeneric:     'Something went wrong. Please try again.',
    closingQuote:     '"Save it before it becomes another case study."',
  },
  ar: {
    metaTitle: 'احجز جلسة — خبير الفشل',
    metaDesc:  'اطلب جلسة خاصة مع خبير الفشل.',
    eyebrow:   'جلسة مغلقة',
    heading:   'اطلب جلسة.',
    sub:       'شاركنا وضعك الحالي وما يقلقك أكثر — وسنعود إليك بالخطوة التالية.',
    sessionInfo: 'جلسة مغلقة · حجز آمن · مُركَّزة على أخطر أنماط الفشل في شركتك',
    pillars: [
      { k: 'سرية مطلقة',     v: 'لا شيء يخرج من الغرفة، ولا ملاحظات تُشارَك مع أي جهة.' },
      { k: 'مواجهة مباشرة',  v: 'سأخبرك بما لا يستطيع فريقك قوله في وجهك.' },
      { k: 'الحقيقة العارية', v: 'بلا كليشيهات. بلا مسرحيات. فقط الحقائق على الطاولة.' },
    ],
    formLabel:   'بوابة الحجز الخاص',
    formHeading: 'أخبرني بما يقلقك فعلاً.',
    privacy:   'سرية كاملة · لا مشاركة مع المستثمرين · لا رسائل مزعجة',
    stages: [
      { v: 'idea',         label: 'فكرة / ما قبل البناء' },
      { v: 'pre-seed',     label: 'ما قبل التمويل الأولي' },
      { v: 'seed',         label: 'التمويل الأولي' },
      { v: 'series-a',     label: 'الجولة A وما بعدها' },
      { v: 'post-failure', label: 'ما بعد الانهيار / تحول محوري' },
    ],
    fields: {
      fullName:      'الاسم الكامل',
      email:         'البريد الإلكتروني',
      stage:         'مرحلة الشركة',
      painPoint:     'أكبر نقطة ألم',
      painPointHint: 'ما الذي يقلقك أكثر من أي شيء الآن؟ كن مباشراً، كلما كان الإدخال أصدق كانت الجلسة أحدّ.',
    },
    placeholders: {
      fullName:  'محمد خ.',
      email:     'you@company.com',
      painPoint: 'الأرقام تقول شيئاً. حدسي يقول شيئاً آخر...',
    },
    promoCode:        'كود الخصم (اختياري)',
    promoPlaceholder: 'FAIL01',
    promoValidating:  'جارٍ التحقق...',
    promoApplied:     'تم تطبيق الكود',
    promoInvalid:     'الكود غير صالح أو منتهي الصلاحية',
    submit:           'إرسال الطلب',
    submitting:       'جارٍ الإرسال...',
    submitDisclaimer: 'ملاحظة: إرسال الطلب لا يضمن قبول الجلسة. أقبل عدداً محدوداً من الحالات شهرياً.',
    successHeading:   'تم استلام طلب الجلسة.',
    successBody:      'سنراجع حالتك ونعود إليك بالخطوة التالية.',
    errorGeneric:     'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    closingQuote:     '"أنقذها الآن.. قبل أن تتحول إلى دراسة حالة فشل أخرى."',
  },
} as const;

type Lang = 'en' | 'ar';

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  full_name:  string;
  email:      string;
  stage:      string;
  pain_point: string;
}

const EMPTY: FormState = {
  full_name: '', email: '', stage: '', pain_point: '',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputBase =
  'w-full bg-transparent border-b border-white/20 focus:border-ember outline-none py-3 text-base font-light transition-colors duration-200 placeholder:text-white/25 min-h-[48px]';

function Field({
  label, hint, error, isRTL, children,
}: {
  label: string; hint?: string; error?: string; isRTL: boolean; children: React.ReactNode;
}) {
  return (
    <div className={isRTL ? 'text-right' : undefined}>
      <label className={cn(
        'block text-[11px] uppercase text-white/40 mb-2',
        isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.25em]'
      )}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className={cn('mt-2 text-xs text-white/30 font-light', isRTL && 'font-arabic leading-[2]')}>{hint}</p>
      )}
      {error && (
        <p className={cn('mt-2 text-xs text-ember', isRTL && 'font-arabic')}>{error}</p>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BookSession() {
  const { lang } = useLanguage();
  const c = copy[lang as Lang] ?? copy.en;
  const isRTL = lang === 'ar';

  // Live service prices (used to compute original/discount/final price on submit)
  const { data: servicePrices } = useQuery({
    queryKey: ['public', 'services', 'session-prices'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('service_key, price')
        .eq('category', 'session')
        .eq('active', true);
      if (error) throw error;
      return (data ?? []) as { service_key: string; price: number | string }[];
    },
    staleTime: 5 * 60_000,
  });

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoResult, setPromoResult] = useState<{
    valid: boolean;
    promoCodeId: string | null;
    discountType: string | null;
    discountValue: number | null;
    title: string | null;
  } | null>(null);
  const promoDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validatePromo = (code: string) => {
    if (!code.trim()) { setPromoResult(null); return; }
    if (promoDebounce.current) clearTimeout(promoDebounce.current);
    promoDebounce.current = setTimeout(async () => {
      setPromoValidating(true);
      try {
        const { data } = await (supabase as any).rpc('validate_promo_code', {
          input_code:        code.trim().toUpperCase(),
          input_service_key: SESSION_TYPE,
          input_email:       form.email.trim() || null,
        });
        if (data && data.valid) {
          setPromoResult({
            valid: true,
            promoCodeId:   data.promo_code_id,
            discountType:  data.discount_type,
            discountValue: data.discount_value,
            title:         data.title,
          });
        } else {
          setPromoResult({ valid: false, promoCodeId: null, discountType: null, discountValue: null, title: null });
        }
      } catch {
        setPromoResult({ valid: false, promoCodeId: null, discountType: null, discountValue: null, title: null });
      } finally {
        setPromoValidating(false);
      }
    }, 600);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.full_name.trim())   e.full_name  = isRTL ? 'الاسم مطلوب'        : 'Name is required';
    if (!form.email.trim())       e.email      = isRTL ? 'البريد مطلوب'       : 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                   e.email      = isRTL ? 'بريد غير صالح'      : 'Invalid email';
    if (!form.stage)               e.stage      = isRTL ? 'اختر مرحلة الشركة'  : 'Select your startup stage';
    if (!form.pain_point.trim())  e.pain_point = isRTL ? 'هذا الحقل مطلوب'    : 'This field is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);

    try {
      // Price the session from live `services` data, then apply the validated promo (if any)
      const servicePrice = servicePrices?.find((s) => s.service_key === SESSION_TYPE)?.price;
      const originalPrice = servicePrice != null ? Number(servicePrice) : null;
      let discountValue = 0;
      if (originalPrice != null && promoResult?.valid) {
        if (promoResult.discountType === 'percentage') {
          discountValue = +(originalPrice * ((promoResult.discountValue ?? 0) / 100)).toFixed(2);
        } else if (promoResult.discountType === 'fixed_amount') {
          discountValue = Math.min(promoResult.discountValue ?? 0, originalPrice);
        } else if (promoResult.discountType === 'free') {
          discountValue = originalPrice;
        }
      }
      const finalPrice = originalPrice != null ? +(originalPrice - discountValue).toFixed(2) : null;

      // The simplified form no longer collects phone/country/session_type —
      // booking_requests still requires them, so they're sent with safe
      // hidden defaults. Stage + pain point are folded into `description`
      // since the table has no dedicated column for either (no schema change).
      const stageLabel = c.stages.find((s) => s.v === form.stage)?.label ?? form.stage;
      const payload = {
        full_name:      form.full_name.trim(),
        email:          form.email.trim(),
        phone:          'Not provided',
        company:        null,
        country:        'Not provided',
        session_type:   SESSION_TYPE,
        preferred_date: null,
        preferred_time: null,
        description:    `Startup Stage: ${stageLabel}\n\n${form.pain_point.trim()}`,
        status:         'pending',
        promo_code:     promoResult?.valid ? promoInput.trim().toUpperCase() : null,
        promo_code_id:  promoResult?.valid ? promoResult.promoCodeId : null,
        original_price: originalPrice,
        discount_value: discountValue,
        final_price:    finalPrice,
      };

      const { data: inserted, error } = await (supabase as any)
        .from('booking_requests')
        .insert(payload)
        .select('id')
        .single();

      if (error) throw error;

      // Attempt to create admin notification (graceful — table may not exist)
      if (inserted?.id) {
        await (supabase as any)
          .from('admin_notifications')
          .insert({
            type:          'booking_request',
            title:         'New Session Request',
            related_table: 'booking_requests',
            related_id:    inserted.id,
            priority:      'high',
            status:        'unread',
          })
          .then(() => {})
          .catch(() => {});
      }

      // Record promo redemption + bump used_count (graceful — never blocks the booking itself)
      if (inserted?.id && promoResult?.valid && promoResult.promoCodeId) {
        (async () => {
          try {
            await (supabase as any).from('promo_code_redemptions').insert({
              promo_code_id: promoResult.promoCodeId,
              code:          promoInput.trim().toUpperCase(),
              email:         form.email.trim(),
              service_key:   SESSION_TYPE,
              related_type:  'booking_request',
              related_id:    inserted.id,
              discount_type: promoResult.discountType,
              discount_value: promoResult.discountValue,
            });
            const { data: promoRow } = await (supabase as any)
              .from('promo_codes')
              .select('used_count')
              .eq('id', promoResult.promoCodeId)
              .single();
            if (promoRow) {
              await (supabase as any)
                .from('promo_codes')
                .update({ used_count: (promoRow.used_count ?? 0) + 1 })
                .eq('id', promoResult.promoCodeId);
            }
          } catch { /* redemption bookkeeping is non-critical */ }
        })();
      }

      setSuccess(true);
      setForm(EMPTY);
    } catch (err: any) {
      setServerError(err?.message ?? c.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = cn(inputBase, isRTL && 'font-arabic text-right');

  return (
    <div className={cn('dark bg-black text-white min-h-screen', isRTL ? 'font-arabic' : 'font-sans-ui')}>
      <SEOHead title={c.metaTitle} description={c.metaDesc} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-20 px-6 lg:px-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(18_92%_55%/0.12),transparent_65%)]" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={cn('order-2 lg:order-1', isRTL && 'text-right')}
          >
            <div className={cn('flex items-center gap-3 mb-8', isRTL && 'flex-row-reverse')}>
              <span className="h-px w-12 bg-ember" />
              <span className={cn(
                'uppercase text-ember font-medium',
                isRTL ? 'font-arabic tracking-normal text-sm' : 'text-xs tracking-[0.3em]'
              )}>
                {c.eyebrow}
              </span>
            </div>
            <h1 className={cn(
              'tracking-tight',
              isRTL
                ? 'font-arabic font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.3]'
                : 'font-serif-display text-5xl md:text-7xl lg:text-8xl'
            )}>
              {c.heading}
            </h1>
            <p className={cn(
              'mt-8 text-lg md:text-xl text-white/55 max-w-xl font-light',
              isRTL ? 'leading-[2.2]' : 'leading-relaxed'
            )}>
              {c.sub}
            </p>
            <p className={cn(
              'mt-8 text-white/35 border-t border-white/[0.06] pt-6',
              isRTL ? 'font-arabic text-sm leading-[2]' : 'text-[10px] uppercase tracking-[0.28em]'
            )}>
              {c.sessionInfo}
            </p>
          </motion.div>

          {/* Phone column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className={cn('relative', isRTL ? 'order-2 lg:order-1' : 'order-1 lg:order-2')}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(18_92%_55%/0.22),transparent_65%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,hsl(18_92%_55%/0.10),transparent_60%)] blur-xl" />
            <div className="relative w-full max-w-lg mx-auto">
              <div className="pointer-events-none absolute left-[42%] top-[14%] -translate-x-1/2 -translate-y-1/2 z-0">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 block rounded-full border border-ember/40 animate-ripple"
                    style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20, animationDelay: `${i * 1.2}s` }}
                  />
                ))}
              </div>
              <svg
                className="pointer-events-none absolute left-[30%] top-[6%] w-24 h-24 z-0 text-ember/60"
                viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
              >
                <path d="M20 70 Q50 30 80 70" className="animate-arc" style={{ animationDelay: '0s' }} />
                <path d="M30 75 Q50 45 70 75" className="animate-arc" style={{ animationDelay: '0.6s' }} />
                <path d="M40 80 Q50 60 60 80" className="animate-arc" style={{ animationDelay: '1.2s' }} />
              </svg>
              <picture>
                <source srcSet={bookCallPhoneWebp} type="image/webp" />
                <img
                  src={bookCallPhone}
                  alt="Orange phone receiver — book a private session"
                  className="relative z-10 w-full h-auto select-none pointer-events-none animate-float"
                  draggable={false}
                  loading="lazy"
                />
              </picture>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {c.pillars.map((b) => (
            <div key={b.k} className={cn('bg-black p-8', isRTL && 'text-right')}>
              <div className={cn(
                'text-3xl text-ember mb-3',
                isRTL ? 'font-arabic font-bold' : 'font-serif-display'
              )}>
                {b.k}
              </div>
              <p className={cn('text-sm text-white/50 font-light', isRTL ? 'leading-[2]' : 'leading-relaxed')}>
                {b.v}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">

          {/* Intake header */}
          <div className={cn('mb-12', isRTL && 'text-right')}>
            <p className={cn(
              'uppercase text-ember mb-4',
              isRTL ? 'font-arabic tracking-normal text-sm' : 'text-xs tracking-[0.3em]'
            )}>
              {c.formLabel}
            </p>
            <h2 className={cn(
              'text-3xl md:text-4xl tracking-tight',
              isRTL ? 'font-arabic font-bold leading-[1.5]' : 'font-serif-display'
            )}>
              {c.formHeading}
            </h2>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'mb-10 p-8 border border-ember/20 bg-ember/5',
                  isRTL && 'text-right'
                )}
              >
                <div className={cn('flex items-center gap-4 mb-4', isRTL && 'flex-row-reverse')}>
                  <div className="size-10 bg-ember/15 border border-ember/25 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-5 text-ember" />
                  </div>
                  <h2 className={cn(
                    'text-lg text-white font-medium',
                    isRTL ? 'font-arabic' : 'font-serif-display'
                  )}>
                    {c.successHeading}
                  </h2>
                </div>
                <p className={cn('text-white/55 font-light', isRTL && 'leading-[2]')}>
                  {c.successBody}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-10"
            noValidate
          >

            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-8">
              <Field label={c.fields.fullName} error={errors.full_name} isRTL={isRTL}>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => set('full_name', e.target.value)}
                  placeholder={c.placeholders.fullName}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={inputClass}
                />
              </Field>
              <Field label={c.fields.email} error={errors.email} isRTL={isRTL}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder={c.placeholders.email}
                  dir="ltr"
                  className={inputClass}
                />
              </Field>
            </div>

            {/* Startup stage */}
            <Field label={c.fields.stage} error={errors.stage} isRTL={isRTL}>
              <div className={cn('flex flex-wrap gap-2 mt-3', isRTL && 'justify-end')}>
                {c.stages.map((s) => {
                  const active = form.stage === s.v;
                  return (
                    <button
                      key={s.v}
                      type="button"
                      onClick={() => set('stage', s.v)}
                      className={cn(
                        'px-4 py-2 border text-xs transition-all duration-200',
                        isRTL && 'font-arabic text-sm',
                        active
                          ? 'border-ember bg-ember/10 text-ember'
                          : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white/80'
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Biggest pain point */}
            <Field
              label={c.fields.painPoint}
              hint={c.fields.painPointHint}
              error={errors.pain_point}
              isRTL={isRTL}
            >
              <textarea
                rows={5}
                value={form.pain_point}
                onChange={(e) => set('pain_point', e.target.value)}
                placeholder={c.placeholders.painPoint}
                dir={isRTL ? 'rtl' : 'ltr'}
                className={cn(inputClass, 'resize-none pt-3')}
              />
            </Field>

            {/* Promo code */}
            <Field label={c.promoCode} isRTL={isRTL}>
              <div className="relative">
                <Tag className="absolute start-0 top-1/2 -translate-y-1/2 size-3.5 text-white/20 pointer-events-none" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase();
                    setPromoInput(v);
                    setPromoResult(null);
                    validatePromo(v);
                  }}
                  placeholder={c.promoPlaceholder}
                  dir="ltr"
                  className={cn(inputBase, 'ps-6 font-mono tracking-widest text-sm')}
                />
              </div>
              {promoValidating && (
                <p className={cn('mt-2 text-xs text-white/35', isRTL && 'font-arabic text-right')}>
                  {c.promoValidating}
                </p>
              )}
              {!promoValidating && promoResult?.valid && (
                <p className={cn('mt-2 text-xs text-ember flex items-center gap-1.5', isRTL && 'font-arabic flex-row-reverse text-right')}>
                  <CheckCircle2 className="size-3 shrink-0" />
                  {c.promoApplied}
                  {promoResult.title && ` — ${promoResult.title}`}
                  {promoResult.discountType === 'percentage' && ` (${promoResult.discountValue}%)`}
                  {promoResult.discountType === 'fixed_amount' && ` ($${promoResult.discountValue})`}
                  {promoResult.discountType === 'free' && ' (مجاني)'}
                </p>
              )}
              {!promoValidating && promoInput && promoResult && !promoResult.valid && (
                <p className={cn('mt-2 text-xs text-ember', isRTL && 'font-arabic text-right')}>
                  {c.promoInvalid}
                </p>
              )}
            </Field>

            {/* Privacy notice */}
            <p className={cn(
              'text-[11px] text-white/30 border-t border-white/[0.06] pt-6',
              isRTL ? 'font-arabic text-right text-sm leading-[2]' : 'tracking-wide'
            )}>
              {c.privacy}
            </p>

            {/* Server error */}
            {serverError && (
              <div className={cn(
                'flex items-start gap-3 p-4 bg-red-950/30 border border-red-800/30',
                isRTL && 'flex-row-reverse text-right'
              )}>
                <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                <p className={cn('text-sm text-red-300', isRTL && 'font-arabic')}>{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <div className={cn('pt-4', isRTL && 'text-right')}>
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full md:w-auto inline-flex items-center justify-between gap-12 px-10 py-6 bg-ember text-black hover:bg-white transition-all duration-500 disabled:opacity-50"
              >
                <span className={cn(
                  'text-sm uppercase font-semibold',
                  isRTL ? 'font-arabic tracking-normal' : 'tracking-[0.25em]'
                )}>
                  {submitting ? c.submitting : c.submit}
                </span>
                {submitting ? (
                  <span className="size-4 border-2 border-black/70 border-t-transparent animate-spin" />
                ) : (
                  <ArrowUpRight className={cn('size-5 transition-transform group-hover:rotate-45', isRTL && 'rotate-180')} />
                )}
              </button>
              <p className={cn(
                'mt-6 text-xs text-white/30 font-light max-w-md',
                isRTL ? 'font-arabic text-right leading-[2]' : 'tracking-wide'
              )}>
                {c.submitDisclaimer}
              </p>
            </div>

          </motion.form>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className={cn(
            'text-2xl md:text-4xl italic text-white/40 leading-snug',
            isRTL ? 'font-arabic font-bold leading-[1.8]' : 'font-serif-display'
          )}>
            {c.closingQuote}
          </p>
        </div>
      </section>
    </div>
  );
}
