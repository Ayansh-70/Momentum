import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RoadmapPage() {
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
            WHAT'S COMING
          </span>
          <h1
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-6 uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            THE AGENT<br />
            GETS<br />
            <span className="text-primary">SMARTER.</span>
          </h1>
          <p
            className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.5rem)] font-light max-w-2xl mx-auto opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Momentum is built in public. Here is exactly 
            what the Agent Core is learning to do next.
          </p>
        </div>
      </section>

      {/* SECTION 2: Timeline */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-24">
        {/* Center Spine Line (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-primary/20 -translate-x-1/2 z-0" />

        {/* Phase 1 */}
        <div className="relative z-10 mb-24">
          {/* Phase Header */}
          <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold text-primary z-10 relative mx-auto w-fit mb-16 shadow-[0_0_15px_rgba(252,100,68,0.1)]">
            PHASE 01 — FOUNDATION
          </div>
          
          <div className="space-y-12 md:space-y-0 relative">
            {/* Milestone 1 (LEFT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-green-500/20 text-green-400 border border-green-500/40">
                  SHIPPED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">AGENT CORE</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">The 4 AI Agents</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Decompose, Risk Watch, Cascade Replan, and Artifact Generation — all four agents are live and running on every task.
                </p>
              </div>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
            </div>

            {/* Milestone 2 (RIGHT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-end w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-green-500/20 text-green-400 border border-green-500/40">
                  SHIPPED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">DASHBOARD</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Live Risk Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Real-time risk badges, inline editing, one-tap delete, and per-substep artifact drafting — all visible in a single view.
                </p>
              </div>
            </div>

            {/* Milestone 3 (LEFT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-full relative opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-green-500/20 text-green-400 border border-green-500/40">
                  SHIPPED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">REPLANNING</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Cascade Replan UI</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Before/after schedule diff with one-tap approve. The agent reshuffles your entire queue when a deadline is at risk.
                </p>
              </div>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="relative z-10 mb-24">
          {/* Phase Header */}
          <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold text-primary z-10 relative mx-auto w-fit mb-16 shadow-[0_0_15px_rgba(252,100,68,0.1)]">
            PHASE 02 — INTELLIGENCE
          </div>
          
          <div className="space-y-12 md:space-y-0 relative">
            {/* Milestone 4 (RIGHT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-end w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-primary/20 text-primary border border-primary/40 animate-pulse">
                  IN PROGRESS
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">MEMORY</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-24">Velocity Profile Learning</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  The risk agent learns whether you are a fast starter, steady worker, or deadline sprinter — and calibrates its warnings to your actual behavior over time.
                </p>
              </div>
            </div>

            {/* Milestone 5 (LEFT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-primary/20 text-primary border border-primary/40 animate-pulse">
                  IN PROGRESS
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">INTEGRATIONS</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-24">Google Calendar Sync</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Approved replan schedules push directly to your Google Calendar. Your agent and your calendar stay in perfect sync.
                </p>
              </div>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
            </div>

            {/* Milestone 6 (RIGHT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-end w-full relative opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-white/5 text-foreground/40 border border-white/10">
                  PLANNED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">NOTIFICATIONS</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Proactive Alerts</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Push and email alerts when a task hits At Risk or Critical — so the agent can reach you even when the dashboard is closed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="relative z-10">
          {/* Phase Header */}
          <div className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold text-primary z-10 relative mx-auto w-fit mb-16 shadow-[0_0_15px_rgba(252,100,68,0.1)]">
            PHASE 03 — AUTONOMY
          </div>
          
          <div className="space-y-12 md:space-y-0 relative">
            {/* Milestone 7 (LEFT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-white/5 text-foreground/40 border border-white/10">
                  PLANNED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">MULTI-AGENT</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Agent Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Decompose and Replan agents share context directly. A replanned task automatically triggers fresh artifact generation for any shifted substeps.
                </p>
              </div>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
            </div>

            {/* Milestone 8 (RIGHT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-end w-full relative mb-12 md:mb-24 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-white/5 text-foreground/40 border border-white/10">
                  PLANNED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">TEAMS</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Shared Workspaces</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  Invite teammates into a shared task queue. The risk agent monitors the entire team's velocity and surfaces blockers before they cascade.
                </p>
              </div>
            </div>

            {/* Milestone 9 (LEFT) */}
            <div className="flex flex-col md:flex-row items-center md:items-start justify-start w-full relative opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full md:w-[45%] relative">
                <span className="absolute top-6 right-6 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm bg-white/5 text-foreground/40 border border-white/10">
                  PLANNED
                </span>
                <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-3">AUTONOMY</p>
                <h3 className="text-xl font-bold text-foreground mb-3 pr-20">Auto-Approve Mode</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-sm">
                  For users who trust the agent completely — enable auto-approve and let Momentum replan your schedule without asking. Full autonomous mode.
                </p>
              </div>
              {/* Connector Dot */}
              <div className="hidden md:block w-3 h-3 rounded-full bg-primary border-2 border-black absolute left-1/2 -translate-x-1/2 top-8 z-10 shadow-[0_0_10px_rgba(252,100,68,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Philosophy Band */}
      <section className="bg-black/40 border-y border-white/10 py-24 relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary uppercase text-xs tracking-[0.25em] font-semibold inline-block mb-4">
            OUR BELIEF
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light text-foreground mb-6 leading-snug tracking-tight">
            "Productivity tools should think, <br className="hidden sm:block" />not just track."
          </h2>
          <p className="text-foreground/80 font-light text-[clamp(1rem,1.5vw,1.125rem)]">
            Every item on this roadmap moves Momentum closer to a single goal: 
            an agent that handles the overhead of work so you can focus on the work itself.
          </p>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="relative z-10 py-32 text-center px-6">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-4 uppercase tracking-[-0.02em]">
          Shape what comes next.
        </h2>
        <p className="text-foreground/80 font-light max-w-lg mx-auto mb-10 text-[clamp(1rem,1.5vw,1.125rem)]">
          Momentum is built in public. Your feedback drives the roadmap.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide inline-block"
          >
            Launch Momentum
          </Link>
          <Link
            to="/features"
            className="w-full sm:w-auto bg-white/10 text-foreground border border-white/20 px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm inline-block"
          >
            See Features
          </Link>
        </div>
      </section>
    </div>
  );
}
