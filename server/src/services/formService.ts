import { FormSubmissionModel } from '../models/FormSubmission.js';
import { FormSubmission } from '../types/index.js';
import { CalculationService } from './calculationService.js';

export class FormService {
  static async createForm(userId: string, school_building: string): Promise<FormSubmission> {
    return FormSubmissionModel.create(userId, school_building);
  }

  static async getFormsByUser(userId: string): Promise<any[]> {
    const forms = await FormSubmissionModel.findByUserId(userId);

    return forms.map(form => {
      let filledFields = 0;
      let totalFields = 0;

      // Basic fields (6)
      totalFields += 6;
      if (form.county) filledFields++;
      if (form.district) filledFields++;
      if (form.building_type) filledFields++;
      if (form.school_building) filledFields++;
      if (form.completed_by) filledFields++;
      if (form.completion_date) filledFields++;

      // Section A items - only count responses (25 items)
      totalFields += 25;
      if (form.section_a_items) {
        const items = JSON.parse(form.section_a_items);
        Object.values(items).forEach((item: any) => {
          if (item?.response) filledFields++;
        });
      }

      // Section B items - only count responses (34 items)
      totalFields += 34;
      if (form.section_b_items) {
        const items = JSON.parse(form.section_b_items);
        Object.values(items).forEach((item: any) => {
          if (item?.response) filledFields++;
        });
      }

      const completion_percentage = Math.round((filledFields / totalFields) * 100);

      return {
        id: form.id,
        school_building: form.school_building,
        status: form.status,
        completion_percentage,
        updated_at: form.updated_at,
        submitted_at: form.submitted_at,
      };
    });
  }

  static async getFormById(id: string, userId: string): Promise<FormSubmission> {
    const form = await FormSubmissionModel.findById(id);

    if (!form) {
      throw new Error('Form not found');
    }

    if (form.created_by_user_id !== userId) {
      throw new Error('Unauthorized');
    }

    return form;
  }

  static async updateForm(id: string, userId: string, data: any): Promise<FormSubmission> {
    const form = await this.getFormById(id, userId);
    return FormSubmissionModel.update(id, data);
  }

  static async reopenForm(id: string, userId: string): Promise<FormSubmission> {
    const form = await this.getFormById(id, userId);

    if (form.status !== 'submitted') {
      throw new Error('Form is not submitted');
    }

    // Change status back to draft
    return FormSubmissionModel.update(id, { status: 'draft' });
  }

  static async submitForm(id: string, userId: string, signatures: any[]): Promise<any> {
    const form = await this.getFormById(id, userId);

    if (form.status === 'submitted') {
      throw new Error('Form already submitted');
    }

    // Parse items
    const sectionAItems = form.section_a_items ? JSON.parse(form.section_a_items) : {};
    const sectionBItems = form.section_b_items ? JSON.parse(form.section_b_items) : {};

    // Validate
    const validation = CalculationService.canSubmit(sectionAItems, sectionBItems, signatures);

    if (!validation.canSubmit) {
      throw new Error(`Cannot submit: ${validation.errors.join(', ')}`);
    }

    // Prepare scores
    const scores = {
      section_a_no_count: validation.sectionA.noCount,
      section_a_compliant: validation.sectionA.compliant,
      section_b_yes_count: validation.sectionB.yesCount,
      section_b_no_count: validation.sectionB.noCount,
      section_b_na_count: validation.sectionB.naCount,
      section_b_percentage: validation.sectionB.percentage,
      section_b_compliant: validation.sectionB.compliant,
      overall_compliant: validation.canSubmit,
    };

    const updatedForm = await FormSubmissionModel.submit(id, signatures, scores);

    return {
      success: true,
      compliance_report: {
        section_a_compliant: scores.section_a_compliant,
        section_b_compliant: scores.section_b_compliant,
        overall_compliant: scores.overall_compliant,
      },
      form: updatedForm,
    };
  }
}
