import React from 'react';
import { Outlet } from 'react-router-dom';
import { BarChart3, CalendarClock, Sparkles } from 'lucide-react';
import { Logo } from '@components/common/Brand';

const features = [
  { icon: Sparkles, title: 'Custom aliases', text: 'Turn messy URLs into memorable, on-brand links.' },
  { icon: CalendarClock, title: 'Expiring links', text: 'Set links to self-destruct after a day, a week or a month.' },
  { icon: BarChart3, title: 'Click analytics', text: 'See daily clicks and where your traffic comes from.' },
];

export const AuthLayout: React.FC = () => {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <section className="relative hidden overflow-hidden border-r border-[var(--color-border)] p-12 lg:flex lg:flex-col">
        <div aria-hidden="true" className="bg-brand absolute -left-32 top-1/3 h-96 w-96 rounded-full opacity-25 blur-[120px]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-border-strong)_1px,transparent_1px),linear-gradient(90deg,var(--color-border-strong)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <Logo className="relative" />
        <div className="relative my-auto max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
            Short links,
            <br />
            <span className="text-gradient">big insights.</span>
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Shorten, share and track every link from one fast, focused dashboard.
          </p>
          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-[var(--color-muted)]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-[var(--color-muted)]">© {new Date().getFullYear()} Snip</p>
      </section>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <Logo className="mb-10 lg:hidden" />
        <div className="w-full max-w-md animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
