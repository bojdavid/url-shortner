import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scissors } from 'lucide-react';
import { Input } from '@components/ui/Input';
import { useToast } from '@components/ui/Toast';
import { authApi } from '@lib/api/auth';
import { useAuthStore } from '@stores/authStore';

export function RegisterPage() {
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
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, accessToken } = await authApi.register(email, password);
      login(user, accessToken);
      toast('Account created! Welcome to Snip 🎉', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="text-center mb-stack-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-md mb-stack-md shadow-lg">
            <Scissors size={24} className="text-white" />
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">Create your account</h1>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Join thousands of power users managing their links with Snip.
          </p>
        </div>

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
              <label className="block text-label-sm font-semibold text-[#213145]">Password</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={18} />}
                autoComplete="new-password"
                required
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#64748B] hover:text-[#213145] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              Create Account
            </button>
          </form>

          <div className="bg-slate-50 border-t border-[#64748B]/10 p-4 text-center">
            <p className="text-label-sm text-[#64748B]">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-500 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-stack-lg text-center opacity-60">
          <p className="text-label-sm text-on-surface-variant">© 2025 Snip Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
