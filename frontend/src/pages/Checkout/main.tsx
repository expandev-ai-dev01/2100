import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { Separator } from '@/core/components/separator';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from 'lucide-react';
import { useCheckout } from '@/domain/ecommerce/hooks/useCheckout';
import { useCart } from '@/domain/ecommerce/hooks/useCart';
import { useNavigation } from '@/core/hooks/useNavigation';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { ShoppingCartIcon } from 'lucide-react';

function CheckoutPage() {
  const { navigate } = useNavigation();
  const { items, subtotal, discount, total } = useCart();
  const { currentStep, handleSubmit, prevStep, isProcessing } = useCheckout();

  if (items.length === 0) {
    return (
      <Empty className="min-h-[50vh]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShoppingCartIcon />
          </EmptyMedia>
          <EmptyTitle>Carrinho vazio</EmptyTitle>
          <EmptyDescription>
            Adicione produtos ao carrinho para continuar com a compra.
          </EmptyDescription>
          <Button onClick={() => navigate('/products')}>Ir para o catálogo</Button>
        </EmptyHeader>
      </Empty>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const steps = [
    { id: 1, label: 'Revisão' },
    { id: 2, label: 'Entrega' },
    { id: 3, label: 'Pagamento' },
    { id: 4, label: 'Confirmação' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finalizar Compra</h1>
        <p className="text-muted-foreground">Complete os passos abaixo para finalizar seu pedido</p>
      </div>

      {/* Step Indicator */}
      <div className="relative flex items-center justify-between">
        <div className="bg-muted absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2" />
        <div
          className="bg-primary absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="bg-background flex flex-col items-center gap-2 px-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {isCompleted ? <CheckIcon className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Etapa {currentStep}: {steps[currentStep - 1].label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Itens do Pedido</h3>
                  {items.map((item) => (
                    <div key={item.product.product_id} className="flex gap-4 rounded-lg border p-3">
                      <img
                        src={item.product.main_image_url}
                        alt={item.product.product_name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.product_name}</h4>
                        <p className="text-muted-foreground text-sm">
                          Quantidade: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                        <p className="font-medium">{formatPrice(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Funcionalidade de endereço será implementada aqui
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Funcionalidade de pagamento será implementada aqui
                  </p>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Resumo final do pedido</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isProcessing}>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        <Button onClick={handleSubmit} disabled={isProcessing}>
          {currentStep === 4 ? (
            isProcessing ? (
              <>
                <LoadingSpinner className="mr-2" />
                Processando...
              </>
            ) : (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Finalizar
              </>
            )
          ) : (
            <>
              Próximo
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export { CheckoutPage };
