import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/core/components/form';
import { Checkbox } from '@/core/components/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Separator } from '@/core/components/separator';
import { formatDate } from '@/core/utils/date';
import type { ComplexFormInput } from '../../validations';

export function Step4Confirmation() {
  const { control, getValues } = useFormContext<ComplexFormInput>();
  const values = getValues();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo dos Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold">Dados Pessoais</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tipo:</dt>
                  <dd className="capitalize">{values.person_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoria:</dt>
                  <dd className="capitalize">{values.user_category}</dd>
                </div>
                {values.person_type === 'fisica' ? (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nome:</dt>
                      <dd>{values.full_name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">CPF:</dt>
                      <dd>{values.cpf}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nascimento:</dt>
                      <dd>{values.birth_date ? formatDate(values.birth_date) : '-'}</dd>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Razão Social:</dt>
                      <dd>{values.company_name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">CNPJ:</dt>
                      <dd>{values.cnpj}</dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Telefone:</dt>
                  <dd>{values.phone}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Endereço</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">CEP:</dt>
                  <dd>{values.cep}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Logradouro:</dt>
                  <dd>
                    {values.street}, {values.number}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Bairro:</dt>
                  <dd>{values.neighborhood}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cidade/UF:</dt>
                  <dd>
                    {values.city}/{values.state}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-2 font-semibold">
              Documentos ({values.uploaded_files?.length || 0})
            </h3>
            <ul className="text-muted-foreground list-inside list-disc text-sm">
              {values.uploaded_files?.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="terms_accepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Li e aceito os termos e condições</FormLabel>
                  <p className="text-muted-foreground text-sm">
                    Ao confirmar, você concorda com o processamento dos seus dados pessoais.
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
