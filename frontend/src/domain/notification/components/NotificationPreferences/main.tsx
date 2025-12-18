/**
 * @summary
 * Notification preferences configuration.
 * Allows users to customize notification behavior.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';
import { Switch } from '@/core/components/switch';
import { Label } from '@/core/components/label';
import { Button } from '@/core/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { useNotifications } from '../../hooks/useNotifications';
import { LoadingSpinner } from '@/core/components/loading-spinner';

export function NotificationPreferences() {
  const { state, isLoading, updatePreferences, resetPreferences } = useNotifications();

  if (isLoading || !state?.preferences) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const preferences = state.preferences;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>Configure como você deseja receber notificações</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => resetPreferences()}>
            Restaurar Padrões
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toast Settings */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="toast-enabled">Notificações Toast</Label>
            <p className="text-muted-foreground text-sm">Exibir notificações temporárias na tela</p>
          </div>
          <Switch
            id="toast-enabled"
            checked={preferences.toastEnabled}
            onCheckedChange={(checked) => updatePreferences({ toastEnabled: checked })}
          />
        </div>

        {/* Push Settings */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-enabled">Notificações Push</Label>
            <p className="text-muted-foreground text-sm">Receber notificações do sistema</p>
          </div>
          <Switch
            id="push-enabled"
            checked={preferences.pushEnabled}
            onCheckedChange={(checked) => updatePreferences({ pushEnabled: checked })}
          />
        </div>

        {/* Sound Settings */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-enabled">Sons de Notificação</Label>
            <p className="text-muted-foreground text-sm">Reproduzir som ao receber notificações</p>
          </div>
          <Switch
            id="sound-enabled"
            checked={preferences.soundEnabled}
            onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
          />
        </div>

        {/* Position Settings */}
        <div className="space-y-2">
          <Label htmlFor="position">Posição Padrão</Label>
          <Select
            value={preferences.defaultPosition}
            onValueChange={(value) => updatePreferences({ defaultPosition: value as any })}
          >
            <SelectTrigger id="position">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-right">Superior Direita</SelectItem>
              <SelectItem value="top-left">Superior Esquerda</SelectItem>
              <SelectItem value="bottom-right">Inferior Direita</SelectItem>
              <SelectItem value="bottom-left">Inferior Esquerda</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Accessibility Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="accessibility">Modo de Acessibilidade</Label>
            <p className="text-muted-foreground text-sm">Reduz animações e aumenta contraste</p>
          </div>
          <Switch
            id="accessibility"
            checked={preferences.accessibilityMode}
            onCheckedChange={(checked) => updatePreferences({ accessibilityMode: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
