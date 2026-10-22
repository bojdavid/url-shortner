import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, registerSchema, type RegisterDto } from '@api/auth';
import { useAuthStore } from '@stores/auth.store';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@components/ui/Card';

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
      navigate('/dashboard');
    },
  });

  const onSubmit = (data: RegisterDto) => {
    mutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started with high-performance URL shortening</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input 
              type="email" 
              placeholder="name@example.com" 
              {...register('email')} 
              error={errors.email?.message} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              {...register('password')} 
              error={errors.password?.message} 
            />
          </div>
          {mutation.isError && (
            <div className="p-3 text-sm rounded-[8px] bg-[var(--color-surface-2)] border border-[var(--color-error)] text-[var(--color-error)]">
              {mutation.error instanceof Error ? mutation.error.message : 'Registration failed'}
            </div>
          )}
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-[var(--color-primary)] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
