import { FormSubmissionModel } from '../models/FormSubmission';
import { FormSubmission } from '../types/index';
import { CalculationService } from './calculationService';

export class FormService {
  static createForm(userId: string, school_building: string): FormSubmission {
    return FormSubmissionModel.create(userId, school_building);
  }

  static getFormsByUser(userId: string): any[] {
    const forms = FormSubmissionModel.findByUserId(userId);

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

  static getFormById(id: string, userId: string): FormSubmission {
    const form = FormSubmissionModel.findById(id);

    if (!form) {
      throw new Error('Form not found');
    }

    if (form.created_by_user_id !== userId) {
      throw new Error('Unauthorized');
    }

    return form;
  }

  static updateForm(id: string, userId: string, data: any): FormSubmission {
    // Verify user owns the form
    this.getFormById(id, userId);
    return FormSubmissionModel.update(id, data);
  }

  static reopenForm(id: string, userId: string): FormSubmission {
    const form = this.getFormById(id, userId);

    if (form.status !== 'submitted') {
      throw new Error('Form is not submitted');
    }

    // Change status back to draft
    return FormSubmissionModel.update(id, { status: 'draft' });
  }

  static submitForm(id: string, userId: string, signatures: any[]): any {
    const form = this.getFormById(id, userId);

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

    const updatedForm = FormSubmissionModel.submit(id, signatures, scores);

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

  static createSampleData(userId: string): any[] {
    const sampleSchools = [
      'Lincoln Elementary School',
      'Washington High School',
      'Jefferson Middle School',
    ];

    const createdForms: any[] = [];

    sampleSchools.forEach((school, index) => {
      // Create the form
      const form = FormSubmissionModel.create(userId, school);

      // Add some basic data
      const basicData: any = {
        county: 'Sample County',
        district: 'Sample School District',
        building_type: index % 2 === 0 ? 'owned' : 'leased',
        school_building: school,
        completed_by: 'Sample Inspector',
        completion_date: new Date().toISOString().split('T')[0],
      };

      // For demonstration, add varying levels of completion
      if (index === 0) {
        // First form: Partially filled Section A
        const sectionAItems: any = {};
        for (let i = 1; i <= 10; i++) {
          sectionAItems[`item_${i}`] = {
            response: i % 2 === 0 ? 'yes' : 'no',
            notes: i % 2 === 0 ? '' : 'Sample note',
          };
        }
        basicData.section_a_items = JSON.stringify(sectionAItems);
        basicData.section_a_notes = 'Sample notes for Section A';
      } else if (index === 1) {
        // Second form: Completed all sections
        const sectionAItems: any = {};
        for (let i = 1; i <= 25; i++) {
          sectionAItems[`item_${i}`] = {
            response: 'yes',
            notes: '',
          };
        }
        basicData.section_a_items = JSON.stringify(sectionAItems);

        const sectionBItems: any = {};
        for (let i = 1; i <= 34; i++) {
          sectionBItems[`item_${i}`] = {
            response: i % 5 === 0 ? 'na' : 'yes',
            notes: '',
          };
        }
        basicData.section_b_items = JSON.stringify(sectionBItems);
        basicData.section_b_notes = 'All items checked and compliant';

        // Calculate scores for this completed form
        const sectionA = JSON.parse(basicData.section_a_items);
        const sectionB = JSON.parse(basicData.section_b_items);
        const scores = CalculationService.calculateScores(sectionA, sectionB);

        // Update form with basic data first
        FormSubmissionModel.update(form.id, basicData);

        // Submit this form with sample signatures
        const signatures = [
          { name: 'John Smith', title: 'Inspector', date: new Date().toISOString().split('T')[0] },
          { name: 'Jane Doe', title: 'Principal', date: new Date().toISOString().split('T')[0] },
          { name: 'Bob Johnson', title: 'Safety Officer', date: new Date().toISOString().split('T')[0] },
        ];

        // Update with scores and signatures
        FormSubmissionModel.update(form.id, {
          section_a_no_count: scores.sectionA.noCount,
          section_a_compliant: scores.sectionA.compliant,
          section_b_yes_count: scores.sectionB.yesCount,
          section_b_no_count: scores.sectionB.noCount,
          section_b_na_count: scores.sectionB.naCount,
          section_b_percentage: scores.sectionB.percentage,
          section_b_compliant: scores.sectionB.compliant,
          overall_compliant: scores.sectionA.compliant && scores.sectionB.compliant,
          status: 'submitted' as 'draft' | 'submitted',
          submitted_at: new Date().toISOString(),
          signature_1_name: signatures[0].name,
          signature_1_title: signatures[0].title,
          signature_1_date: signatures[0].date,
          signature_2_name: signatures[1].name,
          signature_2_title: signatures[1].title,
          signature_2_date: signatures[1].date,
          signature_3_name: signatures[2].name,
          signature_3_title: signatures[2].title,
          signature_3_date: signatures[2].date,
        });
      }
      // Third form: Just created (minimal data)

      if (index !== 1) {
        // Update with basic data for forms 0 and 2
        FormSubmissionModel.update(form.id, basicData);
      }

      createdForms.push({
        id: form.id,
        school_building: school,
        status: index === 1 ? 'submitted' : 'draft',
      });
    });

    return createdForms;
  }
}
