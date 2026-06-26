import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* DARK GRADIENT OVERLAYS */}
      {/* Bottom fade so text is always legible */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      {/* Left vignette to anchor content */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
      {/* Subtle top fade for nav legibility */}
      <div className="absolute top-0 left-0 right-0 h-32 z-[1] bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* HERO CONTENT */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-14 md:pb-16 pt-32">

        {/* Eyebrow */}
        <p
          className="text-primary uppercase text-xs tracking-[0.25em] font-semibold mb-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          AI Productivity Agent
        </p>

        {/* Headline */}
        <h1
          className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-4 uppercase opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          YOUR TASKS,
          <br />
          <span className="text-primary">ALREADY DONE.</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.5rem)] font-light mb-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Momentum prepares your work before you even start.
        </p>

        {/* Description */}
        <p
          className="text-muted-foreground text-[clamp(0.875rem,1.5vw,1.125rem)] font-light mb-8 max-w-lg opacity-0 animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          Autonomously decompose goals, pre-flight tasks, surface risks, and
          replan on the fly — so you arrive at every session already in flow.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-3 opacity-0 animate-fade-up pointer-events-auto"
          style={{ animationDelay: "0.7s" }}
        >
          <Link
            to="/app"
            className="bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide inline-block"
          >
            Launch Momentum
          </Link>
          <Link
            to="/how-it-works"
            className="bg-white/10 text-foreground border border-white/20 px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm inline-block"
          >
            See How It Works
          </Link>
        </div>

        {/* Trust line */}
        <p
          className="text-muted-foreground/60 text-xs font-light mt-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.85s" }}
        >
          Powered by Gemini · Zero setup required
        </p>
      </div>
    </section>
  );
}
