import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { authApi, loginSchema, type LoginDto } from '@api/auth';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { getErrorMessage } from '@utils/links';
import { toast } from 'react-toastify';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Invalid credentials'));
    },
  });

  return (
    <section aria-labelledby="login-title">
      <h1 id="login-title" className="heading-xl">Welcome back</h1>
      <p className="mt-2 text-[var(--color-muted)]">Sign in to manage your links and analytics.</p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-5" noValidate>
        <Input
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          leading={<Mail aria-hidden="true" className="h-4 w-4" />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          leading={<Lock aria-hidden="true" className="h-4 w-4" />}
          {...register('password')}
          error={errors.password?.message}
        />
        {mutation.isError && (
          <div role="alert" className="rounded-[var(--radius-control)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-3 py-2.5 text-sm text-[var(--color-error)]">
            {getErrorMessage(mutation.error, 'Invalid credentials')}
          </div>
        )}
        <Button id="login-submit" type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>
          Sign in
          {!mutation.isPending && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="font-medium text-[#b3a8ff] hover:text-white hover:underline">
          Create one
        </Link>
      </p>
    </section>
  );
};
