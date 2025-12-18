/**
 * @summary
 * Password strength indicator component.
 * Displays visual feedback for password strength with 4 levels.
 */

import { useMemo } from 'react';
import { cn } from '@/core/lib/utils';
import type { PasswordStrengthIndicatorProps } from './types';

function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 1)
      return {
        level: 1,
        label: 'Muito Fraca',
        color: 'bg-destructive',
        textColor: 'text-destructive',
      };
    if (score === 2)
      return { level: 2, label: 'Fraca', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (score === 3 || score === 4)
      return { level: 3, label: 'Média', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { level: 4, label: 'Forte', color: 'bg-green-500', textColor: 'text-green-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-200',
              level <= strength.level ? strength.color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className={cn('text-sm font-medium', strength.textColor)}>
        Força da senha: {strength.label}
      </p>
    </div>
  );
}

export { PasswordStrengthIndicator };
