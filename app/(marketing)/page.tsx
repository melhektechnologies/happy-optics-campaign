"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Glasses,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  MapPin,
  Phone,
  Clock,
  Shield,
  Award,
  Users,
  Calendar,
  ChevronRight,
  Zap,
  Activity,
  TrendingUp,
} from "lucide-react";

// ─── Scroll Animation Hook ───────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const { ref, inView } = useInView();
  const transforms: Record<string, string> = {
    up: "translateY(32px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1400;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      start = Math.round(ease * target);
      setVal(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { label: "Patients Served", value: 28000, suffix: "+", icon: Users },
  { label: "Years of Excellence", value: 20, suffix: "+", icon: Award },
  { label: "Branches Citywide", value: 4, suffix: "", icon: MapPin },
  { label: "Satisfaction Rate", value: 98, suffix: "%", icon: TrendingUp },
];

const services = [
  {
    icon: Eye,
    title: "Comprehensive Eye Exams",
    desc: "Advanced diagnostic equipment delivering thorough assessments of your complete ocular health.",
    badge: "Most Popular",
  },
  {
    icon: Glasses,
    title: "Premium Eyewear",
    desc: "Curated international frames and precision lenses — from designer to sport and progressive.",
    badge: "500+ Styles",
  },
  {
    icon: Heart,
    title: "Contact Lens Fitting",
    desc: "Expert consultation and fitting for daily, monthly, and specialty contact lenses.",
    badge: "",
  },
  {
    icon: Shield,
    title: "Blue Light Protection",
    desc: "Specialized digital eye strain lenses engineered for screen-heavy modern lifestyles.",
    badge: "New",
  },
  {
    icon: Sparkles,
    title: "Progressive Lenses",
    desc: "Seamless multifocal solutions for crystal-clear vision at every distance.",
    badge: "",
  },
  {
    icon: CheckCircle2,
    title: "Children's Vision",
    desc: "Gentle pediatric eye care with fun frame options — building lifelong visual health.",
    badge: "",
  },
];

const branches = [
  { name: "Head Office", area: "Yeha City Center (Stadium)", phone: "+251 115 584 293", hours: "Mon–Sat: 9AM–6PM" },
  { name: "Bole Branch", area: "Bole, Addis Ababa", phone: "+251 914 394 69", hours: "Mon–Sat: 9AM–6PM" },
  { name: "Kera Branch", area: "Kera, Addis Ababa", phone: "+251 912 509 666", hours: "Mon–Sat: 9AM–6PM" },
  { name: "Betezatha Branch", area: "Betezatha, Addis Ababa", phone: "+251 115 584 293", hours: "Mon–Sat: 9AM–6PM" },
];

const testimonials = [
  {
    quote: "The staff at Happy Optics are incredibly professional and caring. My new glasses are perfect — the experience was exceptional.",
    author: "Alem T.",
    role: "Patient",
    rating: 5,
  },
  {
    quote: "I've been coming to Happy Optics for years. The quality of care and eyewear selection is unmatched in Addis Ababa.",
    author: "Mekonnen K.",
    role: "Long-term Patient",
    rating: 5,
  },

  {
    quote: "World-class service right here in Addis! The progressive lenses have completely changed how I work.",
    author: "Dawit H.",
    role: "Software Engineer",
    rating: 5,
  },
];

const partnersList = [
  { name: "Nib International Bank", initial: "N", color: "linear-gradient(135deg, #fbbf24, #f59e0b)" },
  { name: "Awash Insurance", initial: "A", color: "linear-gradient(135deg, #3b82f6, #2563eb)" },
  { name: "MIDROC Investment Group", initial: "M", color: "linear-gradient(135deg, #10b981, #059665)" },
  { name: "Ethiopian Insurance Corp.", initial: "E", color: "linear-gradient(135deg, #0f172a, #334155)" },
  { name: "Queen's", initial: "Q", color: "linear-gradient(135deg, #ef4444, #dc2626)" },
  { name: "Wanza Furnishings Industry", initial: "W", color: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
  { name: "Daylight Applied Technologies", initial: "D", color: "linear-gradient(135deg, #f97316, #ea580c)" },
  { name: "Addis Ababa Women's Assc.", initial: "A", color: "linear-gradient(135deg, #14b8a6, #0d9488)" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    const interval = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO — Cinematic Full-Viewport                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Layered Background */}
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary) 1px,transparent 1px),linear-gradient(90deg,var(--primary) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-[-10%] right-[-5%] h-[700px] w-[700px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" style={{ animation: "float 8s ease-in-out infinite" }} />
        <div className="absolute bottom-[-15%] left-[-5%] h-[600px] w-[600px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" style={{ animation: "float 12s ease-in-out infinite reverse" }} />
        <div className="absolute top-1/3 left-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 lg:px-12 py-24 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div className="space-y-8">
              {/* Pre-title badge */}
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(16px)",
                  transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-[11px] font-black uppercase tracking-[0.18em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
                  Established 2003 E.C. · Addis Ababa
                </span>
              </div>

              {/* Headline */}
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(24px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
                }}
              >
                <h1 className="text-5xl lg:text-[72px] font-black tracking-[-0.04em] leading-[1.0] text-foreground">
                  Brightens your<br />
                  vision{" "}
                  <span className="gradient-text">one smile</span>
                  <br />
                  at a time.
                </h1>
              </div>

              {/* Sub */}
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s",
                }}
              >
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Experience exceptional eye care and premium eyewear at Happy Optics Optometry Clinic — four branches across Addis Ababa, delivering precision and personalized care since 2003 E.C.
                </p>
              </div>

              {/* CTA Row */}
              <div
                className="flex flex-col sm:flex-row gap-4"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(20px)",
                  transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s",
                }}
              >
                <Link
                  href="/book"
                  className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-2xl bg-primary text-white font-bold text-sm tracking-wide shadow-lg glow-primary hover:bg-primary-hover transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Calendar className="h-4 w-4" />
                  Book Appointment
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-2xl border border-border bg-card/80 text-foreground font-bold text-sm tracking-wide hover:border-primary/30 hover:bg-primary-light/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Services
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-muted-foreground" />
                </Link>
              </div>

              {/* Trust row */}
              <div
                className="flex items-center gap-6 pt-2"
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.65s",
                }}
              >
                <div className="flex -space-x-2.5">
                  {["A","M","S","D"].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center text-white text-[10px] font-black">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">Trusted by 28,000+ patients</p>
                </div>
              </div>
            </div>

            {/* Right — Hero Visual */}
            <div
              className="relative hidden lg:block"
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateX(32px)",
                transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s",
              }}
            >
              <div className="relative h-[560px]">
                {/* Main image card */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-border/60 shadow-2xl" style={{ boxShadow: "0 40px 100px -20px rgba(11,110,114,0.25)" }}>
                  <Image
                    src="/brand/clinic.jpeg"
                    alt="Happy Optics Clinic Interior"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating stat card #1 */}
                <div className="absolute -left-8 top-10 glass-panel p-4 shadow-xl border border-border/40 rounded-2xl" style={{ animation: "float 6s ease-in-out infinite" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Today&apos;s Appointments</p>
                      <p className="text-xl font-black gradient-text">24 Patients</p>
                    </div>
                  </div>
                </div>

                {/* Floating stat card #2 */}
                <div className="absolute -right-8 bottom-16 glass-panel p-4 shadow-xl border border-border/40 rounded-2xl" style={{ animation: "float 8s ease-in-out infinite 2s" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-success-light/60 text-success flex items-center justify-center">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Patient Rating</p>
                      <p className="text-xl font-black text-foreground">4.98 / 5.0</p>
                    </div>
                  </div>
                </div>

                {/* Badge bottom-left */}
                <div className="absolute left-6 bottom-6 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">All 4 Branches Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STATS BAR                                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 80} direction="up">
                <div className={`flex items-center gap-4 py-8 px-6 ${i < stats.length - 1 ? "border-b lg:border-b-0 lg:border-r border-border/40" : ""} ${i % 2 === 0 ? "border-r lg:border-r-0 border-border/40 lg:border-r border-border/40" : ""}`}>
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter gradient-text">
                      <Counter target={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{s.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SERVICES GRID                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <Reveal direction="up">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">What We Offer</span>
                <h2 className="text-4xl lg:text-5xl font-black tracking-[-0.03em] text-foreground leading-[1.1]">
                  World-class eye care,<br />
                  <span className="gradient-text">right here in Addis.</span>
                </h2>
              </div>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors shrink-0"
              >
                View all services
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={i} delay={i * 70} direction="up">
                <div className="premium-card gradient-border group p-7 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <s.icon className="h-5.5 w-5.5" />
                    </div>
                    {s.badge && (
                      <span className="badge-primary">{s.badge}</span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-foreground mb-2.5 tracking-tight">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PARTNERS & CLIENTS — Infinite Marquee                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-card overflow-hidden border-y border-border/40">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12 mb-12 text-center">
          <Reveal direction="up" delay={0}>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Clients
            </h2>
            <p className="text-muted-foreground mt-4 font-semibold text-lg max-w-2xl mx-auto">
              Introducing Our Potential Customers and Valued Collaboration Partners
            </p>
          </Reveal>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative flex overflow-hidden w-full group py-4">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee-infinite flex gap-12 sm:gap-20 items-center">
            {/* Map twice for seamless infinite loop */}
            {[...partnersList, ...partnersList].map((p, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-default shrink-0"
              >
                <div 
                  className="h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-md border border-white/20 shrink-0" 
                  style={{ background: p.color }}
                >
                  {p.initial}
                </div>
                <span className="text-xl font-black text-foreground whitespace-nowrap tracking-tight">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* WHY CHOOSE US — 3-column feature matrix                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-muted/30">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">Our Difference</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground mb-4">
                Why 28,000 patients<br />choose Happy Optics
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Precision, innovation, and personalized care — delivered consistently across all four branches.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: "20+ Years of Trust",
                desc: "Established in 2003 E.C., we've built a legacy of excellence in Ethiopian optometry. Two decades of continuous, compassionate care.",
                stat: "2003 E.C.",
                statLabel: "Founded",
              },
              {
                icon: Sparkles,
                title: "State-of-the-Art Equipment",
                desc: "We invest in the latest diagnostic technology — ensuring the most accurate prescriptions and comprehensive ocular health assessments.",
                stat: "100%",
                statLabel: "Digital Diagnostics",
              },
              {
                icon: Heart,
                title: "Personalized Every Time",
                desc: "No two patients are the same. Our optometrists craft individualized treatment plans, spending real time understanding your vision goals.",
                stat: "4.98★",
                statLabel: "Average Rating",
              },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 100} direction="up">
                <div className="premium-card p-8 h-full group stat-card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <f.icon className="h-5.5 w-5.5" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black gradient-text">{f.stat}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{f.statLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS — Premium carousel                                   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <Reveal direction="up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
              </div>
            </div>
            <div className="text-center mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">Patient Stories</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">
                Hear from our community
              </h2>
              <p className="text-muted-foreground mt-3">Trusted by thousands of satisfied patients across Addis Ababa</p>
            </div>
          </Reveal>

          {/* Testimonial display */}
          <Reveal direction="up" delay={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="premium-card p-6 cursor-pointer transition-all duration-500"
                  style={{
                    borderColor: activeTestimonial === i ? "color-mix(in srgb, var(--primary) 30%, var(--border))" : undefined,
                    boxShadow: activeTestimonial === i ? "var(--shadow-lg), 0 0 0 1px color-mix(in srgb, var(--primary) 10%, transparent)" : undefined,
                    transform: activeTestimonial === i ? "translateY(-4px)" : undefined,
                  }}
                  onClick={() => setActiveTestimonial(i)}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px] font-black shrink-0">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-foreground">{t.author}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="transition-all duration-300"
                style={{
                  height: "6px",
                  width: activeTestimonial === i ? "24px" : "6px",
                  borderRadius: "9999px",
                  background: activeTestimonial === i ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BRANCHES — Map-style location cards                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-muted/30">
        <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
          <Reveal direction="up">
            <div className="text-center mb-16">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">Our Network</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground mb-4">
                Four branches,<br />
                <span className="gradient-text">one standard of excellence</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {branches.map((b, i) => (
              <Reveal key={i} delay={i * 80} direction="up">
                <Link 
                  href={`/book?branch=${encodeURIComponent(b.name)}`}
                  className="premium-card gradient-border group p-6 h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary block"
                >
                  <div className="flex items-center gap-3 mb-5 relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-foreground leading-tight group-hover:text-primary transition-colors">{b.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-success" />
                        <span className="text-[9px] font-bold text-success uppercase tracking-wider">Open</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 flex-1 relative z-10">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{b.area}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground font-mono">{b.phone}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{b.hours}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-[11px] font-bold text-primary pt-4 border-t border-border/40 group-hover:gap-2 transition-all relative z-10">
                    Book at this branch
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CTA — Final full-bleed conversion section                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-6 lg:px-12 pb-20">
        <div className="max-w-[1380px] mx-auto">
          <Reveal direction="up">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-primary/90 to-accent text-white p-12 lg:p-16 text-center">
              {/* Background texture */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="absolute top-[-80px] right-[-80px] h-[300px] w-[300px] rounded-full bg-white/10 blur-[80px]" />
              <div className="absolute bottom-[-60px] left-[-60px] h-[250px] w-[250px] rounded-full bg-white/10 blur-[80px]" />

              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-[11px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  Start Your Journey Today
                </span>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1]">
                  Ready to see the world<br />more clearly?
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Book your comprehensive eye examination today. All four branches are open and ready to serve you with world-class care.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link
                    href="/book"
                    className="group inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-2xl bg-white text-primary font-black text-sm shadow-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Appointment Now
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
                  >
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Link>
                </div>
                <p className="text-white/50 text-[11px] font-semibold tracking-wide">
                  No wait times · Same-day appointments available · All branches city-wide
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
