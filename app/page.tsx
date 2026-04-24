'use client';

import {
  AnimatePresence,
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

type Stat = { value: number; suffix: string; label: string };
type Feature = { title: string; description: string; icon: string; featured?: boolean };
type Faq = { question: string; answer: string };

const sectionIds = ['hero', 'overview', 'features', 'screenshots', 'download', 'faq'] as const;
type SectionId = (typeof sectionIds)[number];

type ShotVariant = 'analytics' | 'cases' | 'form' | 'schedule';
type ShotItem = {
  title: string;
  caption: string;
  description: string;
  variant: ShotVariant;
  className?: string;
};

const easeOutExpo = [0.19, 1, 0.22, 1] as const;

const stats: Stat[] = [
  { value: 90, suffix: '%', label: 'Faster Reporting' },
  { value: 120, suffix: '+', label: 'Document Templates' },
  { value: 50, suffix: 'K', label: 'Cases Processed' },
];

const overviewCards = [
  {
    title: 'Centralized Case Hub',
    description:
      'Manage all active and archived cases from a unified, searchable workspace with role-based access control.',
  },
  {
    title: 'Offline-Ready Windows App',
    description:
      'Runs fully on your local network. No cloud dependency, no data leaving your station, and stronger operational privacy.',
  },
  {
    title: 'Audit-Ready Records',
    description:
      'Every action is timestamped and logged. Produce court-ready documents and audit trails in seconds.',
  },
];

const features: Feature[] = [
  {
    title: 'Case Management',
    description:
      'Track every case from first report to closure. Assign officers, set priorities, monitor status, and maintain a complete chain of evidence in one place.',
    icon: '⌘',
  },
  {
    title: 'OCR & Document Scanning',
    description:
      'Scan physical documents and extract text automatically. Import IDs, reports, and evidence into case files without manual data entry.',
    icon: '◫',
    featured: true,
  },
  {
    title: 'Smart Form Builder',
    description:
      'Create and fill standardized incident forms with validation rules and reusable workflow structure.',
    icon: '✦',
  },
  {
    title: 'Duty Schedule Manager',
    description:
      'Build and manage rotating duty rosters with clearer scheduling, assignment tracking, and quick overview panels.',
    icon: '◷',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Visualize case trends, closure rates, and workload distribution through focused operational dashboards.',
    icon: '▣',
  },
  {
    title: 'Document Generation',
    description:
      'Auto-generate reports, summons, warrants, and evidence receipts directly from case data.',
    icon: '↓',
  },
];

const faqs: Faq[] = [
  {
    question: 'Is CAT-ALYSIM a web app?',
    answer:
      'No. The product presented here is a Windows desktop application. This site is a showcase and download page.',
  },
  {
    question: 'Does this page store live case records?',
    answer:
      'No. It is not the operational case environment for real records. It is a presentation surface for the product.',
  },
  {
    question: 'Why is the site a single long page?',
    answer:
      'Because the goal is direct: explain the system, show the interface, answer common questions, and let visitors download fast.',
  },
];

const shotItems: ShotItem[] = [
  {
    title: 'Analytics Dashboard',
    caption: 'Case Overview',
    description: 'Operational trends, workload visibility, and high-level case movement in one focused dashboard.',
    variant: 'analytics',
    className: 'shot-wide',
  },
  {
    title: 'Case List',
    caption: 'Case Queue',
    description: 'Fast scanning of open cases, statuses, and priority markers for daily field coordination.',
    variant: 'cases',
  },
  {
    title: 'Incident Form',
    caption: 'Smart Form',
    description: 'Structured forms with validation and OCR-ready capture for cleaner reporting workflows.',
    variant: 'form',
  },
  {
    title: 'Duty Schedule',
    caption: 'Duty Schedule',
    description: 'Roster planning panels that keep assignments, coverage, and duty windows easy to read.',
    variant: 'schedule',
    className: 'shot-wide-bottom',
  },
];

const trustBadges = ['Secure local installation', 'Windows 10/11', 'Free support included'];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function createStaggerContainer(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

function createAssembleVariants({
  x = 0,
  y = 34,
  scale = 0.975,
  blur = 12,
  duration = 0.82,
}: {
  x?: number;
  y?: number;
  scale?: number;
  blur?: number;
  duration?: number;
} = {}): Variants {
  return {
    hidden: {
      opacity: 0,
      x,
      y,
      scale,
      filter: `blur(${blur}px)`,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: easeOutExpo,
      },
    },
  };
}

const heroLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.96,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: easeOutExpo,
    },
  },
};

function useMagnetic(enabled: boolean, maxOffset = 12) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set((offsetX / rect.width) * maxOffset * 2);
    y.set((offsetY / rect.height) * maxOffset * 2);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    style: enabled
      ? {
          x: springX,
          y: springY,
          willChange: 'transform',
        }
      : undefined,
    handlePointerMove,
    handlePointerLeave,
  };
}

function Reveal({
  children,
  className,
  variants,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants ?? createAssembleVariants()}>
      {children}
    </motion.div>
  );
}

function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div className={className} variants={createStaggerContainer(stagger, delayChildren)}>
      {children}
    </motion.div>
  );
}

function CursorGlow({
  pointerX,
  pointerY,
  enabled,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  enabled: boolean;
}) {
  const size = useMotionValue(160);
  const opacity = useMotionValue(0);
  const smoothSize = useSpring(size, { stiffness: 140, damping: 24, mass: 0.45 });
  const smoothOpacity = useSpring(opacity, { stiffness: 110, damping: 20, mass: 0.5 });
  const left = useTransform([pointerX, smoothSize], (values) => Number(values[0]) - Number(values[1]) / 2);
  const top = useTransform([pointerY, smoothSize], (values) => Number(values[0]) - Number(values[1]) / 2);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = Boolean(target?.closest('[data-glow], a, button'));
      size.set(interactive ? 240 : 160);
      opacity.set(interactive ? 0.9 : 0.55);
    };

    const handlePointerLeave = () => opacity.set(0);
    const handlePointerEnter = () => opacity.set(0.55);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [enabled, opacity, size]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor-glow"
      style={{
        x: left,
        y: top,
        width: smoothSize,
        height: smoothSize,
        opacity: smoothOpacity,
      }}
      aria-hidden="true"
    />
  );
}

function MagneticButton({
  href,
  className,
  children,
  onClick,
  enabled,
  download,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  enabled: boolean;
  download?: boolean;
}) {
  const magnetic = useMagnetic(enabled, 12);

  return (
    <motion.a
      href={href}
      className={cx(className, 'magnetic-target')}
      style={magnetic.style}
      onPointerMove={magnetic.handlePointerMove}
      onPointerLeave={magnetic.handlePointerLeave}
      onClick={onClick}
      whileHover={enabled ? { scale: 1.012 } : undefined}
      whileTap={enabled ? { scale: 0.97 } : undefined}
      data-glow
      download={download}
    >
      <span className="button-label">{children}</span>
      <span className="button-shine" aria-hidden="true" />
    </motion.a>
  );
}

function NavItem({
  label,
  href,
  isActive,
  enabled,
  onClick,
}: {
  label: string;
  href: string;
  isActive: boolean;
  enabled: boolean;
  onClick: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  const magnetic = useMagnetic(enabled, 7);

  return (
    <motion.a
      href={href}
      className={cx('nav-item', isActive && 'active')}
      style={magnetic.style}
      onPointerMove={magnetic.handlePointerMove}
      onPointerLeave={magnetic.handlePointerLeave}
      onClick={onClick}
      whileHover={enabled ? { scale: 1.02 } : undefined}
      whileTap={enabled ? { scale: 0.98 } : undefined}
      data-glow
    >
      {label}
      <span className="nav-underline" aria-hidden="true" />
    </motion.a>
  );
}

function TiltCard({
  children,
  className,
  enabled,
  variants,
  tilt = 8,
}: {
  children: ReactNode;
  className?: string;
  enabled: boolean;
  variants?: Variants;
  tilt?: number;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shiftX = useMotionValue(0);
  const shiftY = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);

  const smoothRotateX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.45 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.45 });
  const smoothShiftX = useSpring(shiftX, { stiffness: 220, damping: 20, mass: 0.42 });
  const smoothShiftY = useSpring(shiftY, { stiffness: 220, damping: 20, mass: 0.42 });
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX}% ${shineY}%, rgba(18, 184, 255, 0.32), rgba(70, 125, 255, 0.16) 24%, transparent 62%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const centeredX = px - 0.5;
    const centeredY = py - 0.5;

    rotateX.set(-centeredY * tilt * 2);
    rotateY.set(centeredX * tilt * 2);
    shiftX.set(centeredX * 12);
    shiftY.set(centeredY * 12);
    shineX.set(px * 100);
    shineY.set(py * 100);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    shiftX.set(0);
    shiftY.set(0);
    shineX.set(50);
    shineY.set(50);
  };

  return (
    <motion.div
      className={cx('tilt-card glass-card neon-border', className)}
      variants={variants ?? createAssembleVariants()}
      style={
        enabled
          ? {
              rotateX: smoothRotateX,
              rotateY: smoothRotateY,
              x: smoothShiftX,
              y: smoothShiftY,
              transformPerspective: 1200,
              willChange: 'transform',
            }
          : undefined
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={enabled ? { y: -4 } : undefined}
      data-glow
    >
      <motion.span className="tilt-shine" style={enabled ? { backgroundImage: shine } : undefined} aria-hidden="true" />
      {children}
    </motion.div>
  );
}

function AssembleSection({
  id,
  className,
  pulseToken,
  active,
  children,
}: {
  id: SectionId;
  className?: string;
  pulseToken: number;
  active: boolean;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={id} className={cx('section-shell assemble-section', className, active && 'section-active')}>
      <AnimatePresence>
        {pulseToken > 0 ? (
          <motion.span
            key={`${id}-pulse-${pulseToken}`}
            className="section-pulse"
            initial={{ opacity: 0, x: '-120%' }}
            animate={{ opacity: [0, 1, 0], x: ['-120%', '120%'] }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 1.05, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        key={pulseToken > 0 ? `${id}-assembled-${pulseToken}` : `${id}-base`}
        className="assemble-section-inner"
        initial={reduceMotion ? false : 'hidden'}
        animate={pulseToken > 0 ? 'visible' : undefined}
        whileInView={pulseToken > 0 ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.2 }}
        variants={createStaggerContainer(reduceMotion ? 0 : 0.08, 0.04)}
      >
        {children}
      </motion.div>
    </section>
  );
}

function Counter({ value, suffix, active }: Stat & { active: boolean }) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    if (reduceMotion) {
      setCount(value);
      return;
    }

    const start = performance.now();
    const duration = 1400;
    let frame = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, reduceMotion, value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

function SectionHeader({
  kicker,
  lines,
  copy,
  align = 'left',
}: {
  kicker: string;
  lines: ReactNode[];
  copy?: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className={cx('section-head', align === 'center' && 'center')}>
      <Reveal>
        <div className="section-kicker">{kicker}</div>
      </Reveal>

      <motion.h2 className={cx('section-title', align)} variants={createStaggerContainer(0.09, 0.04)}>
        {lines.map((line, index) => (
          <motion.span key={`${kicker}-${index}`} className="assemble-line" variants={heroLineVariants}>
            {line}
          </motion.span>
        ))}
      </motion.h2>

      {copy ? (
        <Reveal>
          <p className={cx('section-copy', align)}>{copy}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

function OverviewVisual({ enabled }: { enabled: boolean }) {
  return (
    <Reveal className="overview-visual" variants={createAssembleVariants({ y: 42, scale: 0.94, blur: 18 })}>
      <TiltCard className="overview-window overview-window-main scan-sweep" enabled={enabled} tilt={7}>
        <div className="window-bar">
          <span />
          <span />
          <span />
        </div>

        <StaggerGroup className="window-body" stagger={0.07} delayChildren={0.08}>
          <motion.aside className="window-sidebar" variants={createStaggerContainer(0.06, 0.06)}>
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.i key={`sidebar-${index}`} className={index === 0 ? 'active' : ''} variants={createAssembleVariants({ x: -18, y: 0, blur: 8, duration: 0.55 })} />
            ))}
          </motion.aside>

          <motion.div className="window-main" variants={createStaggerContainer(0.08, 0.1)}>
            <motion.div className="window-top-row" variants={createStaggerContainer(0.07, 0.1)}>
              {Array.from({ length: 3 }).map((_, index) => (
                <motion.div key={`overview-top-${index}`} variants={createAssembleVariants({ y: 18, blur: 10, duration: 0.58 })} />
              ))}
            </motion.div>

            <motion.div className="window-chart" variants={createAssembleVariants({ y: 28, scale: 0.97, blur: 10, duration: 0.72 })}>
              <motion.span
                className="window-chart-scan"
                animate={{ x: ['-30%', '110%'] }}
                transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
                aria-hidden="true"
              />
            </motion.div>

            <motion.div className="window-table" variants={createStaggerContainer(0.05, 0.08)}>
              {Array.from({ length: 9 }).map((_, index) => (
                <motion.span
                  key={`row-${index}`}
                  className={cx((index === 0 || index === 3 || index === 7) && 'cyan', index === 3 && 'short')}
                  variants={createAssembleVariants({ x: 0, y: 12, blur: 8, duration: 0.5 })}
                />
              ))}
            </motion.div>
          </motion.div>
        </StaggerGroup>
      </TiltCard>

      <Reveal className="overview-float-wrap" variants={createAssembleVariants({ x: 24, y: 26, scale: 0.96, blur: 16, duration: 0.9 })}>
        <TiltCard className="overview-window overview-window-float scan-sweep" enabled={enabled} tilt={8}>
          <div className="window-bar">
            <span />
            <span />
            <span />
          </div>
          <StaggerGroup className="float-card-body" stagger={0.08} delayChildren={0.08}>
            <Reveal variants={createAssembleVariants({ y: 12, blur: 8, duration: 0.45 })}>
              <div className="float-line cyan" />
            </Reveal>
            <Reveal variants={createAssembleVariants({ y: 12, blur: 8, duration: 0.45 })}>
              <div className="float-line" />
            </Reveal>
            <Reveal variants={createAssembleVariants({ y: 12, blur: 8, duration: 0.45 })}>
              <div className="float-line short" />
            </Reveal>
            <Reveal variants={createAssembleVariants({ y: 12, blur: 8, duration: 0.52 })}>
              <div className="float-panel" />
            </Reveal>
          </StaggerGroup>
        </TiltCard>
      </Reveal>
    </Reveal>
  );
}

function ShotMock({ variant }: { variant: ShotVariant }) {
  return (
    <>
      <div className="shot-bar" />

      {variant === 'analytics' ? <div className="shot-chart scan-sweep" /> : null}
      {variant === 'cases' ? <div className="shot-lines compact scan-sweep" /> : null}
      {variant === 'form' ? <div className="shot-form scan-sweep" /> : null}
      {variant === 'schedule' ? <div className="shot-calendar scan-sweep" /> : null}
    </>
  );
}

function ShotModal({
  shot,
  onClose,
}: {
  shot: ShotItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!shot) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, shot]);

  return (
    <AnimatePresence>
      {shot ? (
        <motion.div
          className="shot-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="shot-modal glass-card neon-border"
            initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.42, ease: easeOutExpo }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="shot-modal-close" onClick={onClose}>
              Close
            </button>
            <div className="shot-modal-copy">
              <div className="section-kicker">SCREENSHOT PREVIEW</div>
              <h3>{shot.title}</h3>
              <p>{shot.description}</p>
            </div>
            <div className="shot-modal-frame glass-card">
              <ShotMock variant={shot.variant} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FAQItem({
  item,
  index,
  open,
  onToggle,
  enabled,
}: {
  item: Faq;
  index: number;
  open: boolean;
  onToggle: () => void;
  enabled: boolean;
}) {
  return (
    <TiltCard
      className={cx('faq-item', open && 'open')}
      enabled={enabled}
      tilt={4.5}
      variants={createAssembleVariants({ y: 24, blur: 10, duration: 0.7 + index * 0.03 })}
    >
      <button type="button" className="faq-trigger" onClick={onToggle}>
        <span>{item.question}</span>
        <motion.span
          className="faq-plus"
          animate={{ rotate: open ? 45 : 0, scale: open ? 1.06 : 1 }}
          transition={{ duration: 0.28, ease: easeOutExpo }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: easeOutExpo }}
          >
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.24, ease: easeOutExpo }}
            >
              {item.answer}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </TiltCard>
  );
}

function ParticleField({
  pointerX,
  pointerY,
  animate,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!animate) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    type Particle = {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      pulse: number;
      layer: 'bg' | 'mid' | 'streak';
      length: number;
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let particles: Particle[] = [];
    const pointer = { x: 0, y: 0 };

    const makeParticles = () => {
      const backgroundCount = width < 768 ? 18 : 32;
      const midCount = width < 768 ? 12 : 22;
      const streakCount = width < 768 ? 2 : 5;

      const next: Particle[] = [];

      for (let index = 0; index < backgroundCount; index += 1) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.08,
          vy: -(Math.random() * 0.18 + 0.02),
          alpha: Math.random() * 0.18 + 0.04,
          pulse: Math.random() * Math.PI * 2,
          layer: 'bg',
          length: 0,
        });
      }

      for (let index = 0; index < midCount; index += 1) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.28 + 0.04),
          alpha: Math.random() * 0.22 + 0.08,
          pulse: Math.random() * Math.PI * 2,
          layer: 'mid',
          length: 0,
        });
      }

      for (let index = 0; index < streakCount; index += 1) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.9 + 0.5,
          vx: Math.random() * 2 + 1,
          vy: -(Math.random() * 1.3 + 0.8),
          alpha: Math.random() * 0.24 + 0.1,
          pulse: Math.random() * Math.PI * 2,
          layer: 'streak',
          length: Math.random() * 28 + 16,
        });
      }

      particles = next;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    const unsubX = pointerX.on('change', (value) => {
      pointer.x = value;
    });
    const unsubY = pointerY.on('change', (value) => {
      pointer.y = value;
    });

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += particle.layer === 'streak' ? 0.08 : 0.025;

        if (particle.y < -40) {
          particle.y = height + 30;
          particle.x = Math.random() * width;
        }
        if (particle.x < -50) particle.x = width + 20;
        if (particle.x > width + 50) particle.x = -20;

        const depth = particle.layer === 'bg' ? 0.01 : particle.layer === 'mid' ? 0.022 : 0.04;
        const drawX = particle.x + (pointer.x - width / 2) * depth;
        const drawY = particle.y + (pointer.y - height / 2) * depth;
        const alpha = particle.alpha * (0.7 + Math.sin(particle.pulse) * 0.3);

        if (particle.layer === 'streak') {
          context.beginPath();
          context.moveTo(drawX, drawY);
          context.lineTo(drawX - particle.length, drawY + particle.length * 0.36);
          context.strokeStyle = `rgba(88, 170, 255, ${alpha})`;
          context.lineWidth = particle.radius;
          context.stroke();
          continue;
        }

        context.beginPath();
        context.arc(drawX, drawY, particle.radius, 0, Math.PI * 2);
        context.fillStyle =
          particle.layer === 'mid'
            ? `rgba(18, 184, 255, ${alpha})`
            : `rgba(70, 125, 255, ${alpha})`;
        context.fill();
      }

      context.globalCompositeOperation = 'source-over';
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);

    return () => {
      unsubX();
      unsubY();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [animate, pointerX, pointerY]);

  return <canvas ref={canvasRef} className="particles-layer" aria-hidden="true" />;
}

function ParallaxBackground({
  pointerX,
  pointerY,
  viewport,
  enabled,
}: {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  viewport: { width: number; height: number };
  enabled: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const centerX = Math.max(viewport.width / 2, 1);
  const centerY = Math.max(viewport.height / 2, 1);

  const gridX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * -14);
  const gridY = useTransform([pointerY, scrollYProgress], (values) => ((Number(values[0]) - centerY) / centerY) * -10 + Number(values[1]) * 42);
  const auroraLeftX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * -28);
  const auroraLeftY = useTransform(pointerY, (value) => ((value - centerY) / centerY) * 18);
  const auroraRightX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * 22);
  const auroraRightY = useTransform(pointerY, (value) => ((value - centerY) / centerY) * -14);
  const beamLeftX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * -16);
  const beamRightX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * 14);
  const orbOneX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * 16);
  const orbTwoX = useTransform(pointerX, (value) => ((value - centerX) / centerX) * -20);

  return (
    <>
      <ParticleField pointerX={pointerX} pointerY={pointerY} animate={enabled} />

      <motion.div
        className="page-noise"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.14 }}
        transition={{ duration: 0.8, delay: 0.02 }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-grid holographic-grid"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.5, scale: 1.06 }}
        transition={{ duration: 0.9, delay: 0.12, ease: easeOutExpo }}
        style={enabled ? { x: gridX, y: gridY } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="hero-glow hero-glow-left"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: easeOutExpo }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-glow hero-glow-right"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.28, ease: easeOutExpo }}
        aria-hidden="true"
      />
      <motion.div
        className="aurora aurora-left"
        initial={{ opacity: 0, scale: 0.78 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.16, ease: easeOutExpo }}
        style={enabled ? { x: auroraLeftX, y: auroraLeftY } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="aurora aurora-right"
        initial={{ opacity: 0, scale: 0.78 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.24, ease: easeOutExpo }}
        style={enabled ? { x: auroraRightX, y: auroraRightY } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="aurora aurora-center"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: easeOutExpo }}
        aria-hidden="true"
      />
      <motion.div
        className="beam beam-left"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 0.34, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: easeOutExpo }}
        style={enabled ? { x: beamLeftX } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="beam beam-right"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 0.34, x: 0 }}
        transition={{ duration: 1, delay: 0.36, ease: easeOutExpo }}
        style={enabled ? { x: beamRightX } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="hero-orb hero-orb-left"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.34, ease: easeOutExpo }}
        style={enabled ? { x: orbOneX } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="hero-orb hero-orb-right"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.42, ease: easeOutExpo }}
        style={enabled ? { x: orbTwoX } : undefined}
        aria-hidden="true"
      />
      <motion.div
        className="hero-scanline"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.48, ease: easeOutExpo }}
        aria-hidden="true"
      />
    </>
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [canHover, setCanHover] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeStats, setActiveStats] = useState(false);
  const [activeShot, setActiveShot] = useState<ShotItem | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [sectionPulseTokens, setSectionPulseTokens] = useState<Record<SectionId, number>>({
    hero: 0,
    overview: 0,
    features: 0,
    screenshots: 0,
    download: 0,
    faq: 0,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.5 });
  const smoothPointerY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.5 });
  const { scrollY } = useScroll();

  const interactiveMotion = canHover && !reduceMotion;
  const heroPulseToken = sectionPulseTokens.hero;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateInteraction = () => setCanHover(media.matches);
    const updateViewport = () => {
      const nextViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setViewport(nextViewport);
      pointerX.set(nextViewport.width / 2);
      pointerY.set(nextViewport.height / 2);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    updateInteraction();
    updateViewport();

    media.addEventListener('change', updateInteraction);
    window.addEventListener('resize', updateViewport);
    if (!reduceMotion) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      media.removeEventListener('change', updateInteraction);
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [pointerX, pointerY, reduceMotion]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (value) => {
      setScrolled(value > 24);
    });

    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        threshold: [0.18, 0.35, 0.56],
        rootMargin: '-16% 0px -46% 0px',
      }
    );

    sectionIds.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveStats(false);

    const timer = window.setTimeout(() => {
      setActiveStats(true);
    }, reduceMotion ? 0 : 1240);

    return () => window.clearTimeout(timer);
  }, [heroPulseToken, reduceMotion]);

  const handleSectionNavigation = (event: ReactMouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault();

    const element = document.getElementById(id);
    if (!element) return;

    const offset = window.innerWidth < 768 ? 112 : 92;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });

    setActiveSection(id);
    setSectionPulseTokens((current) => ({
      ...current,
      [id]: Date.now(),
    }));
  };

  return (
    <main className="site-wrap">
      <CursorGlow pointerX={smoothPointerX} pointerY={smoothPointerY} enabled={interactiveMotion} />
      <ParallaxBackground
        pointerX={smoothPointerX}
        pointerY={smoothPointerY}
        viewport={viewport}
        enabled={!reduceMotion}
      />

      <header className={cx('topbar', scrolled && 'scrolled')}>
        <motion.div
          className="topbar-shell"
          initial={reduceMotion ? false : { opacity: 0, y: -30, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.82, delay: reduceMotion ? 0 : 0.38, ease: easeOutExpo }}
        >
          <a href="#hero" className="brand" onClick={(event) => handleSectionNavigation(event, 'hero')} data-glow>
            CAT-ALYSIM
          </a>

          <nav className="navlinks" aria-label="Primary Navigation">
            <NavItem
              label="OVERVIEW"
              href="#overview"
              isActive={activeSection === 'overview'}
              enabled={interactiveMotion}
              onClick={(event) => handleSectionNavigation(event, 'overview')}
            />
            <NavItem
              label="FEATURES"
              href="#features"
              isActive={activeSection === 'features'}
              enabled={interactiveMotion}
              onClick={(event) => handleSectionNavigation(event, 'features')}
            />
            <NavItem
              label="SCREENSHOTS"
              href="#screenshots"
              isActive={activeSection === 'screenshots'}
              enabled={interactiveMotion}
              onClick={(event) => handleSectionNavigation(event, 'screenshots')}
            />
            <NavItem
              label="FAQ"
              href="#faq"
              isActive={activeSection === 'faq'}
              enabled={interactiveMotion}
              onClick={(event) => handleSectionNavigation(event, 'faq')}
            />
          </nav>

          <MagneticButton
            href="#download"
            className="nav-download"
            onClick={(event) => handleSectionNavigation(event, 'download')}
            enabled={interactiveMotion}
          >
            DOWNLOAD
          </MagneticButton>
        </motion.div>
      </header>

      <section className="hero" id="hero">
        <motion.div
          key={heroPulseToken > 0 ? `hero-assembly-${heroPulseToken}` : 'hero-base'}
          className="hero-inner"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={createStaggerContainer(reduceMotion ? 0 : 0.1, reduceMotion ? 0 : 0.48)}
        >
          <Reveal>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              V2.4 — WINDOWS DESKTOP APPLICATION
            </div>
          </Reveal>

          <motion.h1 className="hero-title" variants={createStaggerContainer(reduceMotion ? 0 : 0.12, 0.08)}>
            <motion.span className="hero-line hero-line-main assemble-line" variants={heroLineVariants}>
              Next-Gen
            </motion.span>
            <motion.span className="hero-line hero-line-outline assemble-line" variants={heroLineVariants}>
              Intelligence
            </motion.span>
            <motion.span className="hero-line hero-line-mixed assemble-line" variants={heroLineVariants}>
              <span className="white-text">for</span> <span className="gradient-text">Police</span>
            </motion.span>
            <motion.span className="hero-line hero-line-gradient assemble-line" variants={heroLineVariants}>
              Work
            </motion.span>
            {!reduceMotion ? (
              <motion.span
                key={`hero-pulse-${heroPulseToken}`}
                className="hero-title-energy energy-pulse"
                initial={{ x: '-120%', opacity: 0 }}
                animate={{ x: ['-120%', '118%', '118%'], opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 2.2,
                  delay: 1.15,
                  repeat: Infinity,
                  repeatDelay: 5.2,
                  ease: 'easeInOut',
                  times: [0, 0.32, 1],
                }}
                aria-hidden="true"
              />
            ) : null}
          </motion.h1>

          <Reveal>
            <p className="hero-description">
              CAT-ALYSIM transforms case management and workflow documentation into one focused desktop
              environment for OCR, smart forms, and instant reporting.
            </p>
          </Reveal>

          <StaggerGroup className="hero-actions" stagger={0.1} delayChildren={0.18}>
            <Reveal variants={createAssembleVariants({ y: 28, blur: 12, duration: 0.66 })}>
              <MagneticButton
                href="#download"
                className="primary-btn"
                onClick={(event) => handleSectionNavigation(event, 'download')}
                enabled={interactiveMotion}
              >
                ↓ DOWNLOAD FOR WINDOWS
              </MagneticButton>
            </Reveal>

            <Reveal variants={createAssembleVariants({ y: 24, blur: 12, duration: 0.6 })}>
              <MagneticButton
                href="#features"
                className="hero-link"
                onClick={(event) => handleSectionNavigation(event, 'features')}
                enabled={interactiveMotion}
              >
                Explore Features →
              </MagneticButton>
            </Reveal>
          </StaggerGroup>

          <StaggerGroup className="hero-stats" stagger={0.1} delayChildren={0.22}>
            {stats.map((item, index) => (
              <Reveal key={`${item.label}-${heroPulseToken}`} variants={createAssembleVariants({ y: 24, blur: 10, duration: 0.62 + index * 0.04 })}>
                <div className="hero-stat">
                  <strong>
                    <Counter {...item} active={activeStats} />
                  </strong>
                  <span>{item.label}</span>
                  {index < stats.length - 1 ? <i className="hero-stat-divider" aria-hidden="true" /> : null}
                </div>
              </Reveal>
            ))}
          </StaggerGroup>
        </motion.div>
      </section>

      <AssembleSection
        id="overview"
        className="overview-section"
        pulseToken={sectionPulseTokens.overview}
        active={activeSection === 'overview'}
      >
        <div className="overview-grid">
          <OverviewVisual enabled={interactiveMotion} />

          <div className="overview-copy">
            <SectionHeader
              kicker="PLATFORM OVERVIEW"
              align="left"
              lines={['Built for the', <span key="law" className="gradient-text">Demands of Law</span>]}
              copy="CAT-ALYSIM is a comprehensive desktop platform that centralizes every aspect of police case management from intake to archiving."
            />

            <StaggerGroup className="overview-card-list" stagger={0.08} delayChildren={0.14}>
              {overviewCards.map((card) => (
                <TiltCard key={card.title} className="overview-card" enabled={interactiveMotion} tilt={6.5}>
                  <article>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </article>
                </TiltCard>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </AssembleSection>

      <AssembleSection
        id="features"
        className="features-section"
        pulseToken={sectionPulseTokens.features}
        active={activeSection === 'features'}
      >
        <SectionHeader
          kicker="CORE CAPABILITIES"
          align="center"
          lines={[
            'Everything Your Team',
            <>
              <span className="gradient-text">Needs.</span> Nothing It <span className="gradient-text">Doesn&apos;t.</span>
            </>,
          ]}
        />

        <StaggerGroup className="feature-grid" stagger={0.08} delayChildren={0.1}>
          {features.map((feature, index) => (
            <TiltCard
              key={feature.title}
              className={cx('feature-card', feature.featured && 'featured')}
              enabled={interactiveMotion}
              tilt={7}
              variants={createAssembleVariants({ y: 28, blur: 12, duration: 0.7 + index * 0.02 })}
            >
              <article>
                <div className="feature-corners" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            </TiltCard>
          ))}
        </StaggerGroup>
      </AssembleSection>

      <AssembleSection
        id="screenshots"
        className="screens-section"
        pulseToken={sectionPulseTokens.screenshots}
        active={activeSection === 'screenshots'}
      >
        <SectionHeader
          kicker="SCREENSHOTS"
          align="center"
          lines={['See It In', <span key="action" className="gradient-text">Action</span>]}
          copy="Click any screenshot to view in full screen."
        />

        <div className="shots-grid">
          {shotItems.map((shot, index) => (
            <TiltCard
              key={shot.title}
              className={cx('shot', shot.className)}
              enabled={interactiveMotion}
              tilt={7.5}
              variants={
                index === 0
                  ? createAssembleVariants({ x: -42, y: 18, blur: 14, duration: 0.84 })
                  : index === 1
                    ? createAssembleVariants({ x: 36, y: 12, blur: 12, duration: 0.74 })
                    : index === 2
                      ? createAssembleVariants({ x: 36, y: 28, blur: 12, duration: 0.78 })
                      : createAssembleVariants({ x: 20, y: 36, blur: 12, duration: 0.84 })
              }
            >
              <button type="button" className="shot-trigger" onClick={() => setActiveShot(shot)}>
                <ShotMock variant={shot.variant} />
                <div className="shot-caption">
                  {shot.title} — {shot.caption}
                </div>
              </button>
            </TiltCard>
          ))}
        </div>
      </AssembleSection>

      <AssembleSection
        id="download"
        className="download-section"
        pulseToken={sectionPulseTokens.download}
        active={activeSection === 'download'}
      >
        <TiltCard className="download-card" enabled={interactiveMotion} tilt={5.5} variants={createAssembleVariants({ y: 32, scale: 0.96, blur: 14, duration: 0.88 })}>
          <div className="download-core-glow" aria-hidden="true" />
          <div className="download-icon-wrap">
            <motion.span
              className="download-energy-ring"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <motion.span
              className="download-energy-ring ring-delayed"
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            <div className="download-icon">↓</div>
          </div>

          <SectionHeader
            kicker="DOWNLOAD"
            align="center"
            lines={['Download', <span key="brand" className="gradient-text">CAT-ALYSIM</span>]}
            copy="Free to deploy on your station's local network. No internet required. No license fees. Just install and go."
          />

          <Reveal className="download-action-wrap" variants={createAssembleVariants({ y: 26, blur: 10, duration: 0.66 })}>
            <MagneticButton
              href="/downloads/CAT-ALYSIM-Setup.exe"
              className="primary-btn large"
              enabled={interactiveMotion}
              download
            >
              DOWNLOAD FOR WINDOWS
            </MagneticButton>
          </Reveal>

          <StaggerGroup className="download-meta" stagger={0.08} delayChildren={0.14}>
            {trustBadges.map((badge) => (
              <Reveal key={badge} variants={createAssembleVariants({ y: 16, blur: 8, duration: 0.52 })}>
                <span>{badge}</span>
              </Reveal>
            ))}
          </StaggerGroup>
        </TiltCard>
      </AssembleSection>

      <AssembleSection
        id="faq"
        className="faq-section"
        pulseToken={sectionPulseTokens.faq}
        active={activeSection === 'faq'}
      >
        <SectionHeader
          kicker="FAQ"
          align="left"
          lines={['Direct answers before the', <span key="download" className="gradient-text">download</span>]}
        />

        <StaggerGroup className="faq-list" stagger={0.08} delayChildren={0.1}>
          {faqs.map((item, index) => (
            <FAQItem
              key={item.question}
              item={item}
              index={index}
              open={openFaq === index}
              onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              enabled={interactiveMotion}
            />
          ))}
        </StaggerGroup>
      </AssembleSection>

      <ShotModal shot={activeShot} onClose={() => setActiveShot(null)} />
    </main>
  );
}
