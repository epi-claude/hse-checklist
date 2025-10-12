import { PDFDocument } from 'pdf-lib';
import { FormSubmission } from '../types/index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PdfService {
  private static TEMPLATE_PATH = path.join(__dirname, '../../../docs/Health_Safety_Evaluation_SchoolBuildings_Checklist.pdf');
  private static OUTPUT_DIR = path.join(__dirname, '../../../server/generated-pdfs');

  /**
   * Generates a filled PDF from form submission data
   */
  static async generateFilledPDF(formData: FormSubmission): Promise<{ filename: string; filepath: string }> {
    try {
      console.log('Starting PDF generation for form:', formData.id);

      // Read the template PDF
      const templateBytes = await fs.readFile(this.TEMPLATE_PATH);
      const pdfDoc = await PDFDocument.load(templateBytes);

      console.log('Template PDF loaded, page count:', pdfDoc.getPageCount());

      // Get the form
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log('Total form fields found:', fields.length);

      // Parse section items
      const sectionAItems = formData.section_a_items ? JSON.parse(formData.section_a_items as string) : {};
      const sectionBItems = formData.section_b_items ? JSON.parse(formData.section_b_items as string) : {};

      console.log('Section A items:', Object.keys(sectionAItems).length);
      console.log('Section B items:', Object.keys(sectionBItems).length);

      // Fill general information fields
      this.fillTextField(form, 'county', formData.county || '');
      this.fillTextField(form, 'district', formData.district || '');
      this.fillTextField(form, 'school_building', formData.school_building || '');
      this.fillTextField(form, 'school_facility_name', formData.school_building || '');
      this.fillTextField(form, 'completed_by', formData.completed_by || '');
      this.fillTextField(form, 'completed_date', formData.completion_date || '');

      // Fill building type checkboxes
      if (formData.building_type === 'leased') {
        this.fillCheckbox(form, 'leased', true);
      } else if (formData.building_type === 'owned') {
        this.fillCheckbox(form, 'owned', true);
      }

      // Fill Section A items (1-25)
      console.log('Filling Section A items...');
      for (let i = 1; i <= 25; i++) {
        const item = sectionAItems[i];
        if (item && item.response) {
          const response = item.response;

          // Fill the appropriate checkbox
          if (response === 'yes') {
            this.fillCheckbox(form, `${i}_a_yes`, true);
          } else if (response === 'no') {
            this.fillCheckbox(form, `${i}_a_no`, true);
            // Fill location if provided
            if (item.location) {
              this.fillTextField(form, `${i}_a_location`, item.location);
            }
          } else if (response === 'na') {
            this.fillCheckbox(form, `${i}_a_na`, true);
          }
        }
      }

      // Fill Section B items (1-34)
      console.log('Filling Section B items...');
      for (let i = 1; i <= 34; i++) {
        const item = sectionBItems[i];
        if (item && item.response) {
          const response = item.response;

          // Fill the appropriate checkbox
          if (response === 'yes') {
            this.fillCheckbox(form, `${i}_b_yes`, true);
          } else if (response === 'no') {
            this.fillCheckbox(form, `${i}_b_no`, true);
            // Fill location if provided
            if (item.location) {
              this.fillTextField(form, `${i}_b_location`, item.location);
            }
          } else if (response === 'na') {
            this.fillCheckbox(form, `${i}_b_na`, true);
          }
        }
      }

      // Fill Section A totals and compliance
      const sectionAYesCount = Object.values(sectionAItems).filter((item: any) => item?.response === 'yes').length;
      const sectionANaCount = Object.values(sectionAItems).filter((item: any) => item?.response === 'na').length;

      this.fillTextField(form, 'total_a_yes', String(sectionAYesCount));
      this.fillTextField(form, 'total_a_no', String(formData.section_a_no_count || 0));
      this.fillTextField(form, 'total_a_na', String(sectionANaCount));
      this.fillTextField(form, 'a_score', String(formData.section_a_no_count || 0));

      // Fill Section A compliance checkboxes
      if (formData.section_a_compliant) {
        this.fillCheckbox(form, 'a_compliant', true);
      } else {
        this.fillCheckbox(form, 'a_non_compliant', true);
      }

      // Fill Section B totals and compliance
      this.fillTextField(form, 'total_b_yes', String(formData.section_b_yes_count || 0));
      this.fillTextField(form, 'total_b_no', String(formData.section_b_no_count || 0));
      this.fillTextField(form, 'total_b_na', String(formData.section_b_na_count || 0));
      this.fillTextField(form, 'b_a_yes', String(formData.section_b_yes_count || 0));
      this.fillTextField(form, 'b_b_no', String(formData.section_b_no_count || 0));

      // Calculate subtotals
      const subtotal = (formData.section_b_yes_count || 0) + (formData.section_b_no_count || 0);
      const required80Percent = Math.ceil(subtotal * 0.8);
      this.fillTextField(form, 'b_c_subtotal', String(subtotal));
      this.fillTextField(form, 'b_d_subtotal', String(required80Percent));

      // Fill Section B compliance checkboxes
      if (formData.section_b_compliant) {
        this.fillCheckbox(form, 'b_compliant', true);
      } else {
        this.fillCheckbox(form, 'b_non_compliant', true);
      }

      // Fill signature fields
      // Note: The PDF has signature_1/2/3, date_1/2/3, and a single 'title' field
      // We'll fill each signature with name and map to the available fields
      if (formData.signature_1_name) {
        this.fillTextField(form, 'signature_1', formData.signature_1_name);
      }
      if (formData.signature_1_date) {
        this.fillTextField(form, 'date_1', formData.signature_1_date);
      }
      if (formData.signature_1_title) {
        this.fillTextField(form, 'title', formData.signature_1_title);
      }

      if (formData.signature_2_name) {
        this.fillTextField(form, 'signature_2', formData.signature_2_name);
      }
      if (formData.signature_2_date) {
        this.fillTextField(form, 'date_2', formData.signature_2_date);
      }

      if (formData.signature_3_name) {
        this.fillTextField(form, 'signature_3', formData.signature_3_name);
      }
      if (formData.signature_3_date) {
        this.fillTextField(form, 'date_3', formData.signature_3_date);
      }

      // Flatten the form to make it non-editable
      form.flatten();
      console.log('Form fields filled and flattened');

      // Generate unique filename
      const filename = this.generateFilename(formData);
      const filepath = path.join(this.OUTPUT_DIR, filename);

      console.log('Generated filename:', filename);

      // Ensure output directory exists
      await fs.mkdir(this.OUTPUT_DIR, { recursive: true });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      await fs.writeFile(filepath, pdfBytes);

      console.log('PDF saved to:', filepath);

      return { filename, filepath };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * Attempts to fill a text field in the PDF form
   */
  private static fillTextField(form: any, fieldName: string, value: string): void {
    try {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(value);
        console.log(`✓ Filled text field: ${fieldName} = ${value}`);
      }
    } catch (error) {
      // Field doesn't exist or is not a text field, skip silently
      console.log(`✗ Could not fill text field: ${fieldName}`);
    }
  }

  /**
   * Attempts to fill a checkbox in the PDF form
   */
  private static fillCheckbox(form: any, fieldName: string, checked: boolean): void {
    try {
      const field = form.getCheckBox(fieldName);
      if (field) {
        if (checked) {
          field.check();
          console.log(`✓ Checked checkbox: ${fieldName}`);
        } else {
          field.uncheck();
        }
      }
    } catch (error) {
      // Field doesn't exist or is not a checkbox, skip silently
      console.log(`✗ Could not check checkbox: ${fieldName}`);
    }
  }

  /**
   * Generates a unique filename for the PDF
   */
  private static generateFilename(formData: FormSubmission): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
    const schoolName = (formData.school_building || 'Unknown')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30);
    const county = (formData.county || 'Unknown')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);

    return `Health_Safety_${schoolName}_${county}_${timestamp}.pdf`;
  }

  /**
   * Retrieves a generated PDF file
   */
  static async getPDF(filename: string): Promise<Buffer> {
    const filepath = path.join(this.OUTPUT_DIR, filename);
    return await fs.readFile(filepath);
  }

  /**
   * Deletes old PDF files (older than specified days)
   */
  static async cleanupOldPDFs(daysOld: number = 30): Promise<number> {
    try {
      const files = await fs.readdir(this.OUTPUT_DIR);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.pdf')) {
          const filepath = path.join(this.OUTPUT_DIR, file);
          const stats = await fs.stat(filepath);

          if (now - stats.mtimeMs > maxAge) {
            await fs.unlink(filepath);
            deletedCount++;
          }
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old PDFs:', error);
      return 0;
    }
  }
}
