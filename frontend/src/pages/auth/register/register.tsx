import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { authApi, registerSchema, type RegisterDto } from '@api/auth';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { getErrorMessage } from '@utils/links';
import { toast } from 'react-toastify';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success('Account created successfully!');
      navigate('/dashboard', { replace: true });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Registration failed'));
    },
  });

  return (
    <section aria-labelledby="register-title">
      <h1 id="register-title" className="heading-xl">Create your account</h1>
      <p className="mt-2 text-[var(--color-muted)]">Start shortening and tracking links in seconds.</p>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-5" noValidate>
        <Input
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          leading={<Mail aria-hidden="true" className="h-4 w-4" />}
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          leading={<Lock aria-hidden="true" className="h-4 w-4" />}
          {...register('password')}
          error={errors.password?.message}
        />
        {mutation.isError && (
          <div role="alert" className="rounded-[var(--radius-control)] border border-[var(--color-error)]/40 bg-[var(--color-error)]/10 px-3 py-2.5 text-sm text-[var(--color-error)]">
            {getErrorMessage(mutation.error, 'Registration failed')}
          </div>
        )}
        <Button id="register-submit" type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>
          Create account
          {!mutation.isPending && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-[#b3a8ff] hover:text-white hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
};
