interface ChecklistItem {
  response: 'yes' | 'no' | 'na';
  location?: string;
}

interface SectionAResult {
  compliant: boolean;
  noCount: number;
  message: string;
}

interface SectionBResult {
  compliant: boolean;
  yesCount: number;
  noCount: number;
  naCount: number;
  percentage: number;
  requiredYes: number;
  message: string;
}

export class CalculationService {
  static validateSectionA(items: Record<string, ChecklistItem>): SectionAResult {
    const responses = Object.values(items).map(item => item.response);
    const noCount = responses.filter(r => r === 'no').length;
    const isCompliant = noCount === 0;

    return {
      compliant: isCompliant,
      noCount,
      message: isCompliant
        ? 'Section A: Compliant ✓'
        : `Section A: Non-Compliant - ${noCount} items marked "No"`,
    };
  }

  static validateSectionB(items: Record<string, ChecklistItem>): SectionBResult {
    const responses = Object.values(items).map(item => item.response);
    const yesCount = responses.filter(r => r === 'yes').length;
    const noCount = responses.filter(r => r === 'no').length;
    const naCount = responses.filter(r => r === 'na').length;
    const totalCountable = yesCount + noCount; // N/A excluded

    const percentage = totalCountable > 0 ? (yesCount / totalCountable) * 100 : 0;
    const isCompliant = percentage >= 80;
    const requiredYes = Math.ceil(totalCountable * 0.8);

    return {
      compliant: isCompliant,
      yesCount,
      noCount,
      naCount,
      percentage: parseFloat(percentage.toFixed(1)),
      requiredYes,
      message: isCompliant
        ? `Section B: Compliant ✓ (${percentage.toFixed(1)}%)`
        : `Section B: Non-Compliant - Need ${requiredYes} "Yes", have ${yesCount}`,
    };
  }

  static calculateScores(sectionAItems: Record<string, ChecklistItem>, sectionBItems: Record<string, ChecklistItem>) {
    const sectionA = this.validateSectionA(sectionAItems);
    const sectionB = this.validateSectionB(sectionBItems);

    return {
      sectionA,
      sectionB,
    };
  }

  static canSubmit(sectionAItems: Record<string, ChecklistItem>, sectionBItems: Record<string, ChecklistItem>, signatures: any[]) {
    const sectionA = this.validateSectionA(sectionAItems);
    const sectionB = this.validateSectionB(sectionBItems);
    const signaturesComplete = signatures.length === 3 &&
      signatures.every(sig => sig.name && sig.title && sig.date);

    const errors: string[] = [];
    if (!sectionA.compliant) errors.push(sectionA.message);
    if (!sectionB.compliant) errors.push(sectionB.message);
    if (!signaturesComplete) errors.push('All 3 signatures required');

    return {
      canSubmit: sectionA.compliant && sectionB.compliant && signaturesComplete,
      errors,
      sectionA,
      sectionB,
    };
  }
}
