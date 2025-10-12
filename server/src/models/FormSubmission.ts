import { db } from '../database/sqlite.js';
import { FormSubmission } from '../types/index.js';
import { randomUUID } from 'crypto';

export class FormSubmissionModel {
  static create(userId: string, school_building: string): FormSubmission {
    const id = randomUUID();

    const stmt = db.prepare(`
      INSERT INTO form_submissions (id, created_by_user_id, school_building, status)
      VALUES (?, ?, ?, 'draft')
    `);

    stmt.run(id, userId, school_building);

    return this.findById(id) as FormSubmission;
  }

  static findById(id: string): FormSubmission | null {
    const stmt = db.prepare('SELECT * FROM form_submissions WHERE id = ?');
    const form = stmt.get(id) as FormSubmission | undefined;
    return form || null;
  }

  static findByUserId(userId: string): FormSubmission[] {
    const stmt = db.prepare('SELECT * FROM form_submissions WHERE created_by_user_id = ? ORDER BY updated_at DESC');
    return stmt.all(userId) as FormSubmission[];
  }

  static update(id: string, data: Partial<FormSubmission>): FormSubmission {
    const updates: string[] = [];
    const values: any[] = [];

    // Build dynamic update query
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_by_user_id' && key !== 'created_at') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE form_submissions
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    return this.findById(id) as FormSubmission;
  }

  static submit(id: string, signatures: any, scores: any): FormSubmission {
    const stmt = db.prepare(`
      UPDATE form_submissions
      SET
        signature_1_name = ?,
        signature_1_title = ?,
        signature_1_date = ?,
        signature_2_name = ?,
        signature_2_title = ?,
        signature_2_date = ?,
        signature_3_name = ?,
        signature_3_title = ?,
        signature_3_date = ?,
        section_a_no_count = ?,
        section_a_compliant = ?,
        section_b_yes_count = ?,
        section_b_no_count = ?,
        section_b_na_count = ?,
        section_b_percentage = ?,
        section_b_compliant = ?,
        overall_compliant = ?,
        status = 'submitted',
        submitted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      signatures[0]?.name || null,
      signatures[0]?.title || null,
      signatures[0]?.date || null,
      signatures[1]?.name || null,
      signatures[1]?.title || null,
      signatures[1]?.date || null,
      signatures[2]?.name || null,
      signatures[2]?.title || null,
      signatures[2]?.date || null,
      scores.section_a_no_count,
      scores.section_a_compliant ? 1 : 0,
      scores.section_b_yes_count,
      scores.section_b_no_count,
      scores.section_b_na_count,
      scores.section_b_percentage,
      scores.section_b_compliant ? 1 : 0,
      scores.overall_compliant ? 1 : 0,
      id
    );

    return this.findById(id) as FormSubmission;
  }
}
