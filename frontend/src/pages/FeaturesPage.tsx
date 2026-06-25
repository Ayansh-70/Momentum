import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Zap, Eye, GitBranch, FileText, Shield, RefreshCw } from 'lucide-react';

export default function FeaturesPage() {
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
          <span
            className="text-primary uppercase text-xs tracking-[0.25em] font-semibold inline-block mb-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            WHAT MOMENTUM DOES
          </span>
          <h1
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-6 uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            BUILT DIFFERENT.<br />
            WORKS<br />
            <span className="text-primary">DIFFERENTLY.</span>
          </h1>
          <p
            className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.5rem)] font-light max-w-2xl mx-auto opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Most productivity tools track your tasks. 
            Momentum thinks ahead of them.
          </p>
        </div>
      </section>

      {/* SECTION 2: Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.2s" }}>
            <Zap className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">INSTANT DECOMPOSITION</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">From brain-dump to battle plan.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              Paste your raw notes or just a title. Momentum breaks any goal into 3–7 ordered substeps, estimates your effort, and assigns a category — in under 3 seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.3s" }}>
            <Eye className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">BEHAVIORAL RISK WATCH</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">It reads your patterns, not just the clock.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              Four risk states — Calm, Watch, At Risk, Critical. The agent factors in time left, completion rate, and how long since you last touched the task. No false alarms. No missed warnings.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.4s" }}>
            <GitBranch className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">CASCADE REPLANNING</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">One missed deadline, zero scheduling chaos.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              When a task goes critical, the replan agent reshuffles your entire active queue — respecting priorities, preserving dependencies, and showing you a one-tap before/after diff.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.5s" }}>
            <FileText className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">ARTIFACT GENERATION</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">Never face a blank page again.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              Click Draft on any substep. The artifact agent generates a targeted outline, checklist, or template built specifically for that step — using your own context and notes.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.6s" }}>
            <Shield className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">ZERO SETUP</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">Add a task. That's it.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              No integrations, no onboarding flows, no configuration. Drop a title, add a deadline, write your raw notes. The Agent Core handles everything else automatically.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md opacity-0 animate-fade-up flex flex-col" style={{ animationDelay: "0.7s" }}>
            <RefreshCw className="w-10 h-10 text-primary mb-6 shrink-0" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">ALWAYS RUNNING</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">The loop never stops.</h3>
            <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
              Decompose → Watch → Replan → Draft. The four agents run continuously so your momentum never breaks — even when life does.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3: Comparison Table */}
      <section className="bg-black/40 border-y border-white/10 py-24 relative z-10 px-6">
        <div className="text-center mb-16">
          <span className="text-primary uppercase text-xs tracking-[0.25em] font-semibold inline-block mb-4">
            WHY MOMENTUM
          </span>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground uppercase tracking-[-0.02em]">
            Not just another to-do app.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto overflow-x-auto custom-scrollbar bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-sm uppercase tracking-widest">
                <th className="p-6 font-bold text-foreground/70">Feature</th>
                <th className="p-6 font-bold text-primary border-l border-white/10">Momentum</th>
                <th className="p-6 font-bold text-foreground/40 border-l border-white/10">Standard To-Do Apps</th>
              </tr>
            </thead>
            <tbody className="text-sm md:text-base font-light">
              <tr className="border-b border-white/10 bg-white/5">
                <td className="p-6 text-foreground/70">Task Decomposition</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ Automatic</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ Manual</td>
              </tr>
              <tr className="border-b border-white/10 bg-transparent">
                <td className="p-6 text-foreground/70">Risk Intelligence</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ Behavioral</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ None</td>
              </tr>
              <tr className="border-b border-white/10 bg-white/5">
                <td className="p-6 text-foreground/70">Schedule Replanning</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ AI-driven</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ None</td>
              </tr>
              <tr className="border-b border-white/10 bg-transparent">
                <td className="p-6 text-foreground/70">Artifact Generation</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ Contextual</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ None</td>
              </tr>
              <tr className="border-b border-white/10 bg-white/5">
                <td className="p-6 text-foreground/70">Setup Required</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ Zero</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ Yes</td>
              </tr>
              <tr className="bg-transparent">
                <td className="p-6 text-foreground/70">Deadline Recovery</td>
                <td className="p-6 text-primary font-semibold border-l border-white/10">✦ Autonomous</td>
                <td className="p-6 text-foreground/30 border-l border-white/10">✗ Manual</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="relative z-10 py-32 text-center px-6">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-4 uppercase tracking-[-0.02em]">
          Stop tracking. Start doing.
        </h2>
        <p className="text-foreground/80 font-light max-w-lg mx-auto mb-10 text-[clamp(1rem,1.5vw,1.125rem)]">
          Your Agent Core is ready.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide inline-block"
          >
            Launch Momentum
          </Link>
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto bg-white/10 text-foreground border border-white/20 px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm inline-block"
          >
            See How It Works
          </Link>
        </div>
      </section>
    </div>
  );
}
