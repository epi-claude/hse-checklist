import { Request, Response, NextFunction } from 'express';
import { FormService } from '../services/formService';
import { PdfService } from '../services/pdfService';

export class FormController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { school_building } = req.body;

      if (!school_building) {
        return res.status(400).json({ success: false, message: 'School building name is required' });
      }

      const form = FormService.createForm(req.user.userId, school_building);

      res.status(201).json({
        id: form.id,
        status: form.status,
        created_at: form.created_at,
      });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const forms = FormService.getFormsByUser(req.user.userId);

      res.json({ forms });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const form = FormService.getFormById(id, req.user.userId);

      res.json(form);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const form = FormService.updateForm(id, req.user.userId, req.body);

      res.json({
        success: true,
        updated_at: form.updated_at,
      });
    } catch (error) {
      next(error);
    }
  }

  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const { signatures } = req.body;

      if (!signatures || !Array.isArray(signatures) || signatures.length !== 3) {
        return res.status(400).json({ success: false, message: '3 signatures are required' });
      }

      const result = FormService.submitForm(id, req.user.userId, signatures);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getReadOnly(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const form = FormService.getFormById(id, req.user.userId);

      if (form.status !== 'submitted') {
        return res.status(400).json({ success: false, message: 'Form not submitted yet' });
      }

      res.json(form);
    } catch (error) {
      next(error);
    }
  }

  static async reopen(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;
      const form = FormService.reopenForm(id, req.user.userId);

      res.json({
        success: true,
        form,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generatePDF(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const { id } = req.params;

      // Get the form data
      const form = FormService.getFormById(id, req.user.userId);

      if (form.status !== 'submitted') {
        return res.status(400).json({ success: false, message: 'Form must be submitted before generating PDF' });
      }

      // Generate the PDF
      const { filename, filepath } = await PdfService.generateFilledPDF(form);

      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Send the PDF file as download
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
