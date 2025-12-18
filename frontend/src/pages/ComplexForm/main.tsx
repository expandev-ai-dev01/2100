import { Form } from '@/core/components/form';
import { StepIndicator } from '@/domain/complexForm/components/StepIndicator';
import { Step1PersonalData } from '@/domain/complexForm/components/Step1PersonalData';
import { Step2Address } from '@/domain/complexForm/components/Step2Address';
import { Step3Documents } from '@/domain/complexForm/components/Step3Documents';
import { Step4Confirmation } from '@/domain/complexForm/components/Step4Confirmation';
import { FormNavigation } from '@/domain/complexForm/components/FormNavigation';
import { useComplexForm } from '@/domain/complexForm/hooks/useComplexForm';
import { LoadingSpinner } from '@/core/components/loading-spinner';

function ComplexFormPage() {
  const { form, currentStep, nextStep, prevStep, submitForm, isSubmitting, isSaving } =
    useComplexForm();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1PersonalData />;
      case 2:
        return <Step2Address />;
      case 3:
        return <Step3Documents />;
      case 4:
        return <Step4Confirmation />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      await form.handleSubmit(() => submitForm())();
    } else {
      await nextStep();
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulário Complexo</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para completar seu cadastro.
          </p>
        </div>
        {isSaving && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <LoadingSpinner className="h-3 w-3" />
            Salvando rascunho...
          </div>
        )}
      </div>

      <StepIndicator currentStep={currentStep} />

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          <FormNavigation
            currentStep={currentStep}
            onNext={handleNext}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}

export { ComplexFormPage };
