import { Button } from '@/core/components/button';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps?: number;
  onNext: () => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export function FormNavigation({
  currentStep,
  totalSteps = 4,
  onNext,
  onPrev,
  isSubmitting = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 1 || isSubmitting}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Anterior
      </Button>

      <Button type="button" onClick={onNext} disabled={isSubmitting}>
        {currentStep === totalSteps ? (
          <>
            {isSubmitting ? (
              <LoadingSpinner className="mr-2" />
            ) : (
              <CheckIcon className="mr-2 h-4 w-4" />
            )}
            Finalizar
          </>
        ) : (
          <>
            Próximo
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
