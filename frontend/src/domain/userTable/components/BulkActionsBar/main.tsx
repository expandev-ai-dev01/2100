import { Button } from '@/core/components/button';
import { TrashIcon, CheckCircleIcon, XCircleIcon, DownloadIcon } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onExport: () => void;
  isDeleting?: boolean;
  isActivating?: boolean;
  isDeactivating?: boolean;
  isExporting?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onDelete,
  onActivate,
  onDeactivate,
  onExport,
  isDeleting,
  isActivating,
  isDeactivating,
  isExporting,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">{selectedCount} item(ns) selecionado(s)</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onActivate}
          disabled={isActivating || isDeactivating || isDeleting}
        >
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          Ativar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDeactivate}
          disabled={isActivating || isDeactivating || isDeleting}
        >
          <XCircleIcon className="mr-2 h-4 w-4" />
          Desativar
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} disabled={isExporting}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exportar Selecionados
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={isDeleting}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
