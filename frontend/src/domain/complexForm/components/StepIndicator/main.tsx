import { cn } from '@/core/lib/utils';
import { CheckIcon } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 4 }: StepIndicatorProps) {
  const steps = [
    { id: 1, label: 'Dados Pessoais' },
    { id: 2, label: 'Endereço' },
    { id: 3, label: 'Documentos' },
    { id: 4, label: 'Confirmação' },
  ];

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="bg-muted absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2" />
        <div
          className="bg-primary absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="bg-background flex flex-col items-center gap-2 px-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted ? <CheckIcon className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:block',
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
