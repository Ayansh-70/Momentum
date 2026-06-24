import { Link } from 'react-router-dom';

export default function Navbar() {
  const links = ["Features", "How It Works", "Roadmap", "Team", "Contact"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5">
      {/* Logo */}
      <Link to="/" className="text-foreground text-xl font-semibold tracking-tight">
        MOMENTUM
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex gap-8">
        {links.map((link) => {
          if (link === "How It Works") {
            return (
              <Link
                key={link}
                to="/how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
              >
                {link}
              </Link>
            );
          }

          return (
            <a
              key={link}
              href={`/#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              {link}
            </a>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        to="/app"
        className="hidden md:inline-flex items-center bg-nav-button text-foreground hover:bg-white/10 active:scale-[0.97] transition-all rounded-lg uppercase text-xs tracking-widest px-6 py-3 font-semibold"
      >
        Open App →
      </Link>
    </nav>
  );
}
