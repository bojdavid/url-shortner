import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scissors } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useToast } from '@components/ui/Toast';
import { authApi } from '@lib/api/auth';
import { useAuthStore } from '@stores/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, accessToken } = await authApi.login(email, password);
      login(user, accessToken);
      toast('Welcome back! 👋', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Atmospheric blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand header */}
        <div className="text-center mb-stack-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-md mb-stack-md shadow-lg">
            <Scissors size={24} className="text-white" />
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">Welcome to Snip</h1>
          <p className="text-label-sm text-on-surface-variant mt-1">
            The modern professional URL management platform.
          </p>
        </div>

        {/* White card */}
        <div className="bg-white rounded-md shadow-xl overflow-hidden border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="p-8 space-y-stack-md" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={18} />}
              autoComplete="email"
              required
            />
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-label-sm font-semibold text-[#213145]">
                  Password
                </label>
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={18} />}
                autoComplete="current-password"
                required
                trailing={
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="!p-1 !h-auto text-[#64748B] hover:text-[#213145]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                }
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2 py-3"
            >
              Sign in
            </Button>
          </form>

          <div className="bg-slate-50 border-t border-[#64748B]/10 p-4 text-center">
            <p className="text-label-sm text-[#64748B]">
              New to Snip?{' '}
              <Link to="/register" className="text-indigo-500 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-stack-lg text-center opacity-60 space-y-2">
          <div className="flex justify-center gap-6">
            {['Privacy', 'Terms', 'Support'].map((link) => (
              <span key={link} className="text-label-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
                {link}
              </span>
            ))}
          </div>
          <p className="text-label-sm text-on-surface-variant">© 2025 Snip Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
