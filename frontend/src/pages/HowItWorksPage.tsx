import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HowItWorksPage() {
  return (
    <div className="bg-hero-bg min-h-screen font-sora relative">
      <Navbar />

      {/* SECTION 1: Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-hero-bg overflow-hidden pt-32">
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
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 z-[1] bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h1
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-6 uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            FROM GOAL<br/>TO DONE.<br/>
            <span className="text-primary">AUTOMATICALLY.</span>
          </h1>
          <p
            className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.5rem)] font-light max-w-2xl mx-auto opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Four AI agents working in parallel — so you never face 
            a blank page, a missed deadline, or a scheduling collapse.
          </p>
        </div>
      </section>

      {/* SECTION 2: The 4 Agent Steps */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-24">
        {/* Connecting Line */}
        <div className="hidden md:block absolute left-1/2 top-32 bottom-32 w-[1px] bg-primary/30 -translate-x-1/2 z-0" />

        <div className="space-y-24 md:space-y-48 relative z-10">
          {/* STEP 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex-1 md:text-right relative">
              <span className="absolute -top-16 -right-8 text-9xl font-black text-primary/5 select-none pointer-events-none">01</span>
              <p className="text-primary uppercase text-xs tracking-[0.25em] font-semibold mb-3">TASK INTAKE</p>
              <h3 className="text-3xl font-bold text-foreground mb-4">You dump. We decompose.</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                Drop your raw notes, half-formed ideas, or a simple title 
                and deadline. Momentum's decompose agent instantly breaks 
                it into 3–7 ordered substeps, estimates effort, assigns a 
                category, and generates your first working draft — before 
                you've even opened a doc.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                <div className="space-y-4">
                  <div className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-4 flex items-center">
                    <div className="w-3/4 h-2 bg-white/20 rounded blur-[1px]" />
                  </div>
                  <div className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4">
                    <div className="space-y-2">
                      <div className="w-full h-2 bg-white/20 rounded blur-[1px]" />
                      <div className="w-5/6 h-2 bg-white/20 rounded blur-[1px]" />
                      <div className="w-4/6 h-2 bg-white/20 rounded blur-[1px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex-1 relative">
              <span className="absolute -top-16 -left-8 text-9xl font-black text-primary/5 select-none pointer-events-none">02</span>
              <p className="text-primary uppercase text-xs tracking-[0.25em] font-semibold mb-3">RISK INTELLIGENCE</p>
              <h3 className="text-3xl font-bold text-foreground mb-4">It watches. So you don't have to.</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                The risk agent runs continuously. It doesn't just check 
                the clock — it reads your behavior. Haven't touched a 
                5-hour task in 3 days? It knows. Falling behind your 
                own pace? It flags it. Four states: Calm, Watch, At Risk, 
                Critical. You always know exactly where you stand.
              </p>
            </div>
            <div className="flex-1 w-full flex justify-end">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col gap-4 w-full md:w-3/4">
                <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-green-500/20 text-green-400 border border-green-500/30 self-start">Status: Calm</span>
                <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 self-start">Status: Watch</span>
                <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-orange-500/20 text-orange-400 border border-orange-500/30 self-start">Status: At Risk</span>
                <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-destructive/20 text-destructive border border-destructive/30 self-start">Status: Critical</span>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex-1 md:text-right relative">
              <span className="absolute -top-16 -right-8 text-9xl font-black text-primary/5 select-none pointer-events-none">03</span>
              <p className="text-primary uppercase text-xs tracking-[0.25em] font-semibold mb-3">CASCADE REPLANNING</p>
              <h3 className="text-3xl font-bold text-foreground mb-4">Life happens. Momentum adapts.</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                When a task goes critical, the replan agent evaluates 
                your entire active queue — not just the broken task. 
                It shifts dependencies, re-allocates sub-deadlines, 
                and shows you a before/after diff of your schedule. 
                One tap to approve. Zero mental overhead.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                <div className="space-y-4 font-mono text-xs text-muted-foreground">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span>Task Name</span>
                    <span>Old → New</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Draft Proposal</span>
                    <span className="flex items-center gap-2">
                      <span className="text-destructive/70 line-through">Oct 12</span>
                      <span>→</span>
                      <span className="text-green-400">Oct 14</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Review Metrics</span>
                    <span className="flex items-center gap-2">
                      <span className="text-destructive/70 line-through">Oct 14</span>
                      <span>→</span>
                      <span className="text-green-400">Oct 15</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.8s" }}>
            <div className="flex-1 relative">
              <span className="absolute -top-16 -left-8 text-9xl font-black text-primary/5 select-none pointer-events-none">04</span>
              <p className="text-primary uppercase text-xs tracking-[0.25em] font-semibold mb-3">ARTIFACT GENERATION</p>
              <h3 className="text-3xl font-bold text-foreground mb-4">Never start from a blank page again.</h3>
              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                Stuck on a substep? Click Draft. The artifact agent 
                generates a targeted outline, checklist, or template 
                for that exact step — using your own context and notes. 
                Not a generic template. A specific, actionable starting 
                point built for your task.
              </p>
            </div>
            <div className="flex-1 w-full flex justify-end">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-md w-full md:w-3/4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-foreground/70 bg-white/10 px-2 py-1 rounded inline-block mb-3">OUTLINE</span>
                <h5 className="text-sm font-bold text-foreground mb-3">Initial Draft Structure</h5>
                <div className="text-xs text-muted-foreground font-mono leading-relaxed space-y-2">
                  <p>## Introduction</p>
                  <p>- Hook: Core problem statement</p>
                  <p>- Context: Market shift logic</p>
                  <p>## Proposed Solution</p>
                  <p>- Architecture review</p>
                  <p>- Timeline estimate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: The Loop */}
      <section className="bg-black/40 border-y border-white/10 py-24 relative z-10 text-center px-6">
        <span className="text-primary uppercase text-xs tracking-[0.25em] font-semibold inline-block mb-4">THE AGENT LOOP</span>
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-6 uppercase tracking-[-0.02em]">Always on. Always ahead.</h2>
        <p className="text-foreground/80 font-light max-w-md mx-auto mb-16 text-[clamp(1rem,1.5vw,1.125rem)]">
          Decompose → Watch → Replan → Draft. 
          The loop runs automatically so your 
          momentum never breaks.
        </p>
        
        {/* Flow Diagram */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 font-mono text-sm uppercase tracking-widest text-primary font-bold">
          <div className="border border-primary/40 bg-primary/10 rounded-full px-6 py-3 shadow-[0_0_15px_rgba(252,100,68,0.1)]">Decompose</div>
          <span className="hidden md:inline-block">→</span>
          <span className="md:hidden">↓</span>
          <div className="border border-primary/40 bg-primary/10 rounded-full px-6 py-3 shadow-[0_0_15px_rgba(252,100,68,0.1)]">Risk Watch</div>
          <span className="hidden md:inline-block">→</span>
          <span className="md:hidden">↓</span>
          <div className="border border-primary/40 bg-primary/10 rounded-full px-6 py-3 shadow-[0_0_15px_rgba(252,100,68,0.1)]">Replan</div>
          <span className="hidden md:inline-block">→</span>
          <span className="md:hidden">↓</span>
          <div className="border border-primary/40 bg-primary/10 rounded-full px-6 py-3 shadow-[0_0_15px_rgba(252,100,68,0.1)]">Draft</div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="relative z-10 py-32 text-center px-6">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-4 uppercase tracking-[-0.02em]">Ready to never miss a deadline?</h2>
        <p className="text-foreground/80 font-light max-w-lg mx-auto mb-10 text-[clamp(1rem,1.5vw,1.125rem)]">
          Add your first task in under 10 seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide inline-block"
          >
            Launch Momentum
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto bg-white/10 text-foreground border border-white/20 px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm inline-block"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
