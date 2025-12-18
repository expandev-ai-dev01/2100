/**
 * @summary
 * Checkout hook for order processing.
 * Handles multi-step checkout flow.
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderService } from '../../services/orderService';
import { useCart } from '../useCart';
import { useNavigation } from '@/core/hooks/useNavigation';
import type { Address, PaymentMethodType } from '../../types/models';

export const useCheckout = () => {
  const { navigate } = useNavigation();
  const { items, discount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address | null>(null);
  const [shipping, setShipping] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);

  const { mutateAsync: createOrder, isPending } = useMutation({
    mutationFn: async () => {
      if (!address || !paymentMethod) {
        throw new Error('Dados incompletos');
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return orderService.create(items, address, paymentMethod, discount, shipping);
    },
    onSuccess: (order) => {
      clearCart();
      toast.success(`Pedido confirmado! Número: ${order.order_id}`);
      navigate(`/order-success/${order.order_id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao processar pagamento');
    },
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (currentStep === 4) {
      await createOrder();
    } else {
      nextStep();
    }
  };

  return {
    currentStep,
    address,
    shipping,
    paymentMethod,
    setAddress,
    setShipping,
    setPaymentMethod,
    nextStep,
    prevStep,
    handleSubmit,
    isProcessing: isPending,
  };
};
