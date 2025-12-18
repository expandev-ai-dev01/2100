import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/core/components/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { UploadIcon, XIcon, FileIcon } from 'lucide-react';
import { complexFormService } from '../../services/complexFormService';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import type { ComplexFormInput } from '../../validations';

export function Step3Documents() {
  const { control, watch, setValue } = useFormContext<ComplexFormInput>();
  const uploadedFiles = watch('uploaded_files') || [];
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > 10) {
      toast.error('Máximo de 10 arquivos permitidos');
      return;
    }

    setIsUploading(true);
    try {
      const newFiles = [...uploadedFiles];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} excede 5MB`);
          continue;
        }
        const metadata = await complexFormService.uploadFile(file);
        newFiles.push(metadata);
      }
      setValue('uploaded_files', newFiles, { shouldValidate: true });
      toast.success('Upload concluído');
    } catch (error) {
      toast.error('Erro ao fazer upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setValue('uploaded_files', newFiles, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="uploaded_files"
          render={() => (
            <FormItem>
              <FormLabel>Arquivos (PDF, DOC, JPG, PNG - Máx 5MB)</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <div
                    className="border-muted-foreground/25 hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadIcon className="text-muted-foreground h-8 w-8" />
                    <p className="text-muted-foreground text-sm">Clique para selecionar arquivos</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>

                  {isUploading && (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <LoadingSpinner /> Uploading...
                    </div>
                  )}

                  <div className="grid gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className="bg-card flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileIcon className="text-primary h-5 w-5" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-muted-foreground text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          type="button"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
