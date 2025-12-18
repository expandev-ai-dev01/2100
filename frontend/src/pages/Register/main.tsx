/**
 * @summary
 * Registration page component.
 * Provides user registration interface with validation and password strength indicator.
 */

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useRegister } from '@/domain/auth/hooks/useRegister';
import { PasswordStrengthIndicator } from '@/domain/auth/components/PasswordStrengthIndicator';
import { useNavigation } from '@/core/hooks/useNavigation';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

function RegisterPage() {
  const { navigate } = useNavigation();
  const { form, onSubmit, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const password = watch('password');

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Cadastro</CardTitle>
          <CardDescription>Crie sua conta para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                {...register('name')}
                aria-invalid={!!errors.name}
                disabled={isPending}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                {...register('email')}
                aria-invalid={!!errors.email}
                disabled={isPending}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  disabled={isPending}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
              <PasswordStrengthIndicator password={password || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmar Senha</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  {...register('confirm_password')}
                  aria-invalid={!!errors.confirm_password}
                  disabled={isPending}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </Button>
              </div>
              {errors.confirm_password && (
                <p className="text-destructive text-sm">{errors.confirm_password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem conta? </span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 font-semibold"
                onClick={() => navigate('/login')}
                disabled={isPending}
              >
                Faça login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { RegisterPage };
