import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/core/components/alert-dialog';
import { Checkbox } from '@/core/components/checkbox';
import { Label } from '@/core/components/label';

interface BulkDeleteDialogProps {
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function BulkDeleteDialog({ count, open, onOpenChange, onConfirm }: BulkDeleteDialogProps) {
  const [safetyCheck, setSafetyCheck] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSafetyCheck(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-destructive">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            ⚠️ Confirmar Exclusão em Massa
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Você está prestes a excluir <strong>{count} usuário(s)</strong>. Esta ação é
              <strong> irreversível</strong> e não pode ser desfeita.
            </p>
            <div className="bg-destructive/10 border-destructive/20 rounded-md border p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="safety-check"
                  checked={safetyCheck}
                  onCheckedChange={(checked) => setSafetyCheck(checked === true)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="safety-check"
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    Estou ciente de que esta ação é irreversível
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Marque esta caixa para habilitar o botão de confirmação
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={!safetyCheck}
            onClick={async () => {
              await onConfirm();
              setSafetyCheck(false);
              onOpenChange(false);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
