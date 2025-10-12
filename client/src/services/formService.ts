import { api } from './api';
import { FormData, FormListItem } from '../types/form.types';

export const formService = {
  async createForm(school_building: string) {
    const response = await api.post('/forms', { school_building });
    return response.data;
  },

  async getForms(): Promise<{ forms: FormListItem[] }> {
    const response = await api.get('/forms');
    return response.data;
  },

  async getFormById(id: string): Promise<FormData> {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  async updateForm(id: string, data: Partial<FormData>) {
    const response = await api.patch(`/forms/${id}`, data);
    return response.data;
  },

  async submitForm(id: string, signatures: any[]) {
    const response = await api.post(`/forms/${id}/submit`, { signatures });
    return response.data;
  },

  async reopenForm(id: string) {
    const response = await api.post(`/forms/${id}/reopen`);
    return response.data;
  },

  async getReadOnlyForm(id: string) {
    const response = await api.get(`/forms/${id}/readonly`);
    return response.data;
  },

  async generatePDF(id: string) {
    const response = await api.get(`/forms/${id}/generate-pdf`, {
      responseType: 'blob',
    });

    console.log('PDF Response headers:', response.headers);
    console.log('Content-Disposition:', response.headers['content-disposition']);

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'Health_Safety_Checklist.pdf';

    if (contentDisposition) {
      console.log('Found content-disposition:', contentDisposition);
      // Try multiple patterns to extract filename
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
        console.log('Extracted filename:', filename);
      }
    } else {
      console.warn('No content-disposition header found');
    }

    console.log('Final filename:', filename);

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
