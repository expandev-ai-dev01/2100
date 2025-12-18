/**
 * @summary
 * Login page component.
 * Provides user authentication interface with email/password and remember-me option.
 */

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { useLogin } from '@/domain/auth/hooks/useLogin';
import { useNavigation } from '@/core/hooks/useNavigation';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

function LoginPage() {
  const { navigate } = useNavigation();
  const { form, onSubmit, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember_me" {...register('remember_me')} disabled={isPending} />
              <Label htmlFor="remember_me" className="cursor-pointer text-sm font-normal">
                Lembrar-me por 30 dias
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoadingSpinner />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem conta? </span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 font-semibold"
                onClick={() => navigate('/register')}
                disabled={isPending}
              >
                Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { LoginPage };
