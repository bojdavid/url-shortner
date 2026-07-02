import { Link } from 'react-router-dom';
import { Zap, Activity, Globe, ChevronDown, Scissors } from 'lucide-react';
import { Navbar } from '@components/layout/Navbar';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-gutter overflow-hidden">
          {/* Atmospheric background */}
          <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[30%] h-[30%] rounded-full bg-tertiary/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-stack-lg">
            <div className="space-y-stack-md">
              <h1 className="text-headline-lg md:text-[64px] md:leading-[1.1] font-bold tracking-tight text-on-surface">
                Shorten. Share. <span className="text-indigo-400">Track.</span>
              </h1>
              <p className="text-body-base text-on-surface-variant max-w-xl mx-auto opacity-90 leading-relaxed">
                Create short, branded links and monitor every click in real-time. Built for power users who demand speed and precision.
              </p>
            </div>

            {/* CTA Area */}
            <div className="w-full max-w-2xl mx-auto mt-stack-lg animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <div className="glass-card p-2 rounded-xl flex flex-col md:flex-row gap-2 shadow-2xl">
                <div className="relative flex-grow flex items-center bg-surface-container/50 rounded-lg">
                  <span className="absolute left-4 text-outline pointer-events-none">
                    <Globe size={20} />
                  </span>
                  <input
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-4 text-on-surface placeholder:text-outline font-body-base outline-none"
                    placeholder="Paste your long URL here..."
                    readOnly
                  />
                </div>
                <Link
                  to="/register"
                  className="bg-indigo-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 shrink-0"
                >
                  Get Started
                  <Zap size={18} />
                </Link>
              </div>
              <p className="mt-4 text-label-sm text-outline">
                Join thousands of professionals already using Snip.
              </p>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 text-on-surface-variant">
            <ChevronDown size={24} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-gutter max-w-container-max mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Fast Redirects (Span 8) */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden group border border-outline-variant/30 hover:border-indigo-500/30 transition-colors">
              <div className="relative z-10 space-y-4 max-w-md">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                  <Zap size={24} />
                </div>
                <h3 className="text-headline-lg font-bold text-on-surface">Lightning Fast</h3>
                <p className="text-body-base text-on-surface-variant">
                  Our global edge network ensures your links resolve in milliseconds. No waiting, no latency, just instant access.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-[120%] opacity-10 group-hover:opacity-20 transition-opacity translate-y-10 group-hover:translate-y-0 duration-500">
                <div className="w-full h-full bg-gradient-to-tl from-indigo-500 to-transparent" style={{ maskImage: 'radial-gradient(ellipse at bottom right, black, transparent)' }} />
              </div>
            </div>

            {/* Analytics (Span 4) */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col justify-between border border-outline-variant/30 hover:border-tertiary/30 transition-colors group">
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 bg-tertiary/20 rounded-lg flex items-center justify-center text-tertiary">
                  <Activity size={24} />
                </div>
                <h3 className="text-heading-md font-semibold text-on-surface">Deep Analytics</h3>
                <p className="text-body-base text-on-surface-variant">
                  Track clicks, referrers, and daily trends with our powerful dashboard.
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/20 bg-surface-container-lowest mt-12 py-12 px-gutter">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Scissors size={20} className="text-indigo-500" />
            Snip
          </div>
          <div className="flex gap-6 text-label-sm text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
          <p className="text-label-sm text-on-surface-variant opacity-60">
            © {new Date().getFullYear()} Snip Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
