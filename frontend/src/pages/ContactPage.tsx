import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail } from 'lucide-react';

export default function ContactPage() {
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
            GET IN TOUCH
          </span>
          <h1
            className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-6 uppercase opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            BUILT BY ONE.<br />
            OPEN TO<br />
            <span className="text-primary">ALL.</span>
          </h1>
          <p
            className="text-foreground/80 text-[clamp(1.125rem,2.5vw,1.5rem)] font-light max-w-2xl mx-auto opacity-0 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Momentum was designed and built solo for a hackathon. 
            Reach out for feedback, collaboration, or just to say hi.
          </p>
        </div>
      </section>

      {/* SECTION 2: Contact Cards */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          
          {/* Card 1 - Email */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-row items-center gap-5">
              <Mail className="w-10 h-10 text-primary shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">EMAIL</span>
                <h3 className="text-lg font-bold text-foreground">ayanshsharma140011@gmail.com</h3>
              </div>
            </div>
            <a
              href="mailto:ayanshsharma140011@gmail.com"
              className="bg-white/10 text-foreground border border-white/20 px-6 py-3 text-xs rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all uppercase tracking-wide backdrop-blur-sm whitespace-nowrap self-start sm:self-auto"
            >
              SEND MAIL
            </a>
          </div>

          {/* Card 2 - GitHub */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex flex-row items-center gap-5">
              <div className="w-10 h-10 text-primary shrink-0 flex items-center justify-center text-4xl font-light">⌥</div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">GITHUB</span>
                <h3 className="text-lg font-bold text-foreground mb-1">Ayansh-70</h3>
                <p className="text-muted-foreground text-sm font-light leading-snug">
                  View the full source code, commits, and architecture.
                </p>
              </div>
            </div>
            <a
              href="https://github.com/Ayansh-70"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 text-foreground border border-white/20 px-6 py-3 text-xs rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all uppercase tracking-wide backdrop-blur-sm whitespace-nowrap self-start sm:self-auto"
            >
              VIEW REPO
            </a>
          </div>

          {/* Card 3 - LinkedIn */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex flex-row items-center gap-5">
              <div className="w-10 h-10 text-primary shrink-0 flex items-center justify-center text-3xl font-bold lowercase tracking-tighter">in</div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1 block">LINKEDIN</span>
                <h3 className="text-lg font-bold text-foreground mb-1">Ayansh Sharma</h3>
                <p className="text-muted-foreground text-sm font-light leading-snug">
                  Connect professionally or follow the build journey.
                </p>
              </div>
            </div>
            <a
              href="https://www.linkedin.com/in/ayansh-sharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 text-foreground border border-white/20 px-6 py-3 text-xs rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all uppercase tracking-wide backdrop-blur-sm whitespace-nowrap self-start sm:self-auto"
            >
              CONNECT
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 3: Builder Band */}
      <section className="bg-black/40 border-y border-white/10 py-24 relative z-10 px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-primary uppercase text-xs tracking-[0.25em] font-semibold inline-block mb-4">
            THE BUILDER
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-light text-foreground mb-6 leading-snug tracking-tight">
            Ayansh Sharma
          </h2>
          <div className="space-y-4">
            <p className="text-foreground/80 font-light text-[clamp(1rem,1.5vw,1.125rem)]">
              Full-stack developer. Built Momentum solo in 6 days 
              for a hackathon — from architecture to deployment.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-foreground/60">React</span>
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-foreground/60">TypeScript</span>
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-foreground/60">Node.js</span>
              <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-foreground/60">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CTA */}
      <section className="relative z-10 py-32 text-center px-6">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-foreground mb-4 uppercase tracking-[-0.02em]">
          See what Momentum can do.
        </h2>
        <p className="text-foreground/80 font-light max-w-lg mx-auto mb-10 text-[clamp(1rem,1.5vw,1.125rem)]">
          Try the Agent Core yourself — no setup required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/app"
            className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] uppercase tracking-wide inline-block"
          >
            Launch Momentum
          </Link>
          <Link
            to="/roadmap"
            className="w-full sm:w-auto bg-white/10 text-foreground border border-white/20 px-8 py-4 text-sm rounded-sm font-bold cursor-pointer hover:bg-white/20 transition-all active:scale-[0.97] uppercase tracking-wide backdrop-blur-sm inline-block"
          >
            View Roadmap
          </Link>
        </div>
      </section>
    </div>
  );
}
