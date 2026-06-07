import { AdminLayout } from '@/components/admin/AdminLayout';
import { adminT } from '@/i18n/adminTranslations';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Package,
  Inbox,
  Search,
  CheckCircle2,
  CalendarClock,
  PackageCheck,
  Info,
} from 'lucide-react';

// ── Pipeline definition ───────────────────────────────────────────────────────

type FailKitStatus = 'requested' | 'under_review' | 'approved' | 'scheduled' | 'delivered';

interface StageDef {
  key:    FailKitStatus;
  icon:   React.ElementType;
  accent: string;
}

const STAGES: StageDef[] = [
  { key: 'requested',    icon: Inbox,        accent: 'text-amber-400 bg-amber-950/25 border-amber-800/30' },
  { key: 'under_review', icon: Search,       accent: 'text-sky-400 bg-sky-950/25 border-sky-800/30' },
  { key: 'approved',     icon: CheckCircle2, accent: 'text-violet-400 bg-violet-950/25 border-violet-800/30' },
  { key: 'scheduled',    icon: CalendarClock,accent: 'text-recovery bg-recovery/10 border-recovery/25' },
  { key: 'delivered',    icon: PackageCheck, accent: 'text-white/50 bg-white/6 border-white/10' },
];

// ── Stage column ──────────────────────────────────────────────────────────────

function StageColumn({ stage, index }: { stage: StageDef; index: number }) {
  const Icon = stage.icon;
  const label = adminT.failKit.statuses[stage.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className={cn('size-8 flex items-center justify-center rounded-lg border', stage.accent)}>
          <Icon className="size-4" />
        </div>
        <h2 className="text-[12px] font-medium text-white/75 font-arabic flex-1">{label}</h2>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/30 tracking-wide tabular-nums">
          0
        </span>
      </div>

      {/* Empty state */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className={cn('size-9 flex items-center justify-center rounded-xl mb-3 border opacity-30', stage.accent)}>
          <Icon className="size-4" />
        </div>
        <p className="text-white/25 text-[11px] font-arabic">{adminT.failKit.empty}</p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminFailKit() {
  return (
    <AdminLayout title={adminT.failKit.title} subtitle={adminT.failKit.subtitle}>

      {/* Notice */}
      <div className="flex items-center gap-3 mb-8 p-4 bg-[#0d0d0d] border border-white/6 rounded-xl">
        <Info className="size-4 text-sky-400 shrink-0" />
        <p className="text-[11px] text-white/40 font-arabic">{adminT.failKit.notice}</p>
        <span className="ms-auto flex items-center gap-2 text-[10px] text-white/25 font-arabic shrink-0">
          <Package className="size-3.5" />
          5 مراحل
        </span>
      </div>

      {/* Pipeline board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {STAGES.map((stage, i) => (
          <StageColumn key={stage.key} stage={stage} index={i} />
        ))}
      </div>
    </AdminLayout>
  );
}
