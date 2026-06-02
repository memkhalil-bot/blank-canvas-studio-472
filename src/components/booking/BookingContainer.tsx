import { cn } from '@/lib/utils';

interface BookingContainerProps {
  provider?: 'calendly' | 'cal' | 'native' | null;
  url?: string;
  className?: string;
  isRTL?: boolean;
}

export function BookingContainer({ provider = null, url, className, isRTL = false }: BookingContainerProps) {
  if (provider === 'calendly' && url) {
    return (
      <div className={cn('w-full min-h-[600px] border border-white/[0.08]', className)}>
        <iframe src={url} width="100%" height="600" frameBorder="0" title="Schedule a session" />
      </div>
    );
  }
  if (provider === 'cal' && url) {
    return (
      <div className={cn('w-full min-h-[600px] border border-white/[0.08]', className)}>
        <iframe src={url} width="100%" height="600" frameBorder="0" title="Schedule a session" />
      </div>
    );
  }
  // Placeholder state — ready for integration
  return (
    <div
      className={cn(
        'w-full border border-white/[0.08] bg-white/[0.015] p-12 text-center',
        className
      )}
      data-booking-container="true"
      data-integration-ready="calendly,cal,native"
    >
      <p className={cn('text-[10px] uppercase text-white/18 mb-4', isRTL ? 'font-arabic tracking-normal text-sm' : 'tracking-[0.4em]')}>
        {isRTL ? 'حجز الجلسة' : 'Session Booking'}
      </p>
      <p className={cn('text-white/35 text-sm font-light', isRTL ? 'font-arabic leading-[2]' : 'leading-relaxed')}>
        {isRTL
          ? 'ستُعلَم بموعد جلستك خلال ٢٤–٤٨ ساعة عبر البريد الإلكتروني.'
          : 'You will be notified of your session time within 24–48 hours via email.'}
      </p>
      <div className="mt-8 flex justify-center gap-3 opacity-25">
        {['Cal.com', 'Calendly', 'Native'].map(p => (
          <span key={p} className="text-[9px] uppercase tracking-[0.3em] text-white border border-white/20 px-3 py-1">{p}</span>
        ))}
      </div>
    </div>
  );
}
