import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/core/components/form';
import { Input } from '@/core/components/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { maskCEP } from '@/core/utils/masks';
import { complexFormService } from '../../services/complexFormService';
import { toast } from 'sonner';
import { useState } from 'react';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import type { ComplexFormInput } from '../../validations';

export function Step2Address() {
  const { control, setValue } = useFormContext<ComplexFormInput>();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const address = await complexFormService.getAddressByCep(cep);
        if (address.erro) {
          toast.error('CEP não encontrado');
        } else {
          setValue('street', address.logradouro);
          setValue('neighborhood', address.bairro);
          setValue('city', address.localidade);
          setValue('state', address.uf);
          toast.success('Endereço encontrado!');
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(maskCEP(e.target.value))}
                    onBlur={(e) => {
                      field.onBlur();
                      handleCepBlur(e);
                    }}
                    maxLength={9}
                  />
                </FormControl>
                {isLoadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LoadingSpinner />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="hidden md:block" /> {/* Spacer */}
        <FormField
          control={control}
          name="street"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
