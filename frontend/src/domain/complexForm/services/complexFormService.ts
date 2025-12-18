import { authenticatedClient } from '@/core/lib/api';
import type {
  DraftResponse,
  ValidationResponse,
  SubmissionResponse,
  AddressResponse,
  FileMetadata,
  ComplexFormData,
} from '../types/models';

export const complexFormService = {
  async start(): Promise<DraftResponse> {
    const { data } = await authenticatedClient.post<DraftResponse>('/complex-form/start');
    return data;
  },

  async saveDraft(
    draftId: string,
    step: number,
    formData: Partial<ComplexFormData>
  ): Promise<DraftResponse> {
    const { data } = await authenticatedClient.post<DraftResponse>('/complex-form/save', {
      draftId,
      step,
      data: formData,
    });
    return data;
  },

  async validateStep(
    step: number,
    formData: Partial<ComplexFormData>
  ): Promise<ValidationResponse> {
    const { data } = await authenticatedClient.post<ValidationResponse>('/complex-form/validate', {
      step,
      data: formData,
    });
    return data;
  },

  async submit(draftId: string): Promise<SubmissionResponse> {
    const { data } = await authenticatedClient.post<SubmissionResponse>('/complex-form/submit', {
      draftId,
    });
    return data;
  },

  async getAddressByCep(cep: string): Promise<AddressResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    const { data } = await authenticatedClient.get<AddressResponse>(
      `/complex-form/cep/${cleanCep}`
    );
    return data;
  },

  async uploadFile(file: File): Promise<FileMetadata> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await authenticatedClient.post<FileMetadata>(
      '/complex-form/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
};
