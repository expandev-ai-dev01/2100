import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { complexFormService } from '../../services/complexFormService';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type ComplexFormInput,
  type ComplexFormOutput,
} from '../../validations';
import { useIdle } from '@/core/hooks/useIdle';
import type { FileMetadata } from '../../types/models';

const STEP_SCHEMAS = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
};

export const useComplexForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const isIdle = useIdle(2000); // 2 seconds idle for auto-save

  const form = useForm<ComplexFormInput, unknown, ComplexFormOutput>({
    resolver: zodResolver(STEP_SCHEMAS[currentStep as keyof typeof STEP_SCHEMAS]) as any,
    mode: 'onBlur',
    defaultValues: {
      person_type: 'fisica',
      user_category: 'cliente',
      uploaded_files: [] as FileMetadata[],
      terms_accepted: false,
    } as any,
  });

  const { watch, trigger, getValues } = form;
  const formData = watch();

  // Start form or load draft
  useQuery({
    queryKey: ['complex-form-start'],
    queryFn: async () => {
      const data = await complexFormService.start();
      setDraftId(data.draftId);
      if (data.step > 1) setCurrentStep(data.step);
      if (data.data) form.reset(data.data as any);
      return data;
    },
    staleTime: Infinity,
  });

  // Auto-save
  const { mutate: saveDraft, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      if (!draftId) return;
      await complexFormService.saveDraft(draftId, currentStep, getValues() as any);
    },
    onError: () => toast.error('Erro ao salvar rascunho'),
  });

  useEffect(() => {
    if (isIdle && draftId) {
      saveDraft();
    }
  }, [isIdle, draftId, saveDraft, formData]);

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast.error('Por favor, corrija os erros antes de continuar');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const { mutateAsync: submitForm, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (!draftId) throw new Error('No draft ID');
      return complexFormService.submit(draftId);
    },
    onSuccess: (data) => {
      toast.success(`Formulário enviado! Protocolo: ${data.protocol_number}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao enviar formulário');
    },
  });

  return {
    form,
    currentStep,
    draftId,
    isSaving,
    isSubmitting,
    nextStep,
    prevStep,
    submitForm,
  };
};
