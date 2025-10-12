import { useState, useEffect } from 'react';
import { useForm } from '../../contexts/FormContext';
import { useNavigate } from 'react-router-dom';
import { formService } from '../../services/formService';
import { Signature } from '../../types/form.types';

export default function Step7_ReviewSubmit() {
  const { formData, saveForm, setCurrentStep } = useForm();
  const navigate = useNavigate();
  const [signatures, setSignatures] = useState<Signature[]>([
    { name: '', title: '', date: '' },
    { name: '', title: '', date: '' },
    { name: '', title: '', date: '' },
  ]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const isSubmitted = formData.status === 'submitted';

  // Load existing signatures from formData
  useEffect(() => {
    const loadedSignatures: Signature[] = [
      {
        name: formData.signature_1_name || '',
        title: formData.signature_1_title || '',
        date: formData.signature_1_date || '',
      },
      {
        name: formData.signature_2_name || '',
        title: formData.signature_2_title || '',
        date: formData.signature_2_date || '',
      },
      {
        name: formData.signature_3_name || '',
        title: formData.signature_3_title || '',
        date: formData.signature_3_date || '',
      },
    ];
    setSignatures(loadedSignatures);
  }, [formData]);

  // Calculate Section A compliance
  const calculateSectionA = () => {
    const items = formData.section_a_items || {};
    const responses = Object.values(items).map((item: any) => item?.response || '');
    const noCount = responses.filter((r) => r === 'no').length;
    const compliant = noCount === 0;

    return {
      compliant,
      noCount,
      message: compliant
        ? 'Section A: Compliant ✓'
        : `Section A: Non-Compliant - ${noCount} items marked "No"`,
    };
  };

  // Calculate Section B compliance
  const calculateSectionB = () => {
    const items = formData.section_b_items || {};
    const responses = Object.values(items).map((item: any) => item?.response || '');
    const yesCount = responses.filter((r) => r === 'yes').length;
    const noCount = responses.filter((r) => r === 'no').length;
    const totalCountable = yesCount + noCount;

    const percentage = totalCountable > 0 ? (yesCount / totalCountable) * 100 : 0;
    const compliant = percentage >= 80;

    return {
      compliant,
      yesCount,
      noCount,
      percentage: percentage.toFixed(1),
      message: compliant
        ? `Section B: Compliant ✓ (${percentage.toFixed(1)}%)`
        : `Section B: Non-Compliant - Need ${Math.ceil(totalCountable * 0.8)} "Yes", have ${yesCount}`,
    };
  };

  const sectionA = calculateSectionA();
  const sectionB = calculateSectionB();
  const overallCompliant = sectionA.compliant && sectionB.compliant;

  const updateSignature = (index: number, field: keyof Signature, value: string) => {
    const newSignatures = [...signatures];
    newSignatures[index] = { ...newSignatures[index], [field]: value };
    setSignatures(newSignatures);
  };

  const handleSubmit = async () => {
    // Validate signatures
    const allSignaturesFilled = signatures.every(
      (sig) => sig.name && sig.title && sig.date
    );

    if (!allSignaturesFilled) {
      setError('All 3 signatures are required');
      return;
    }

    if (!overallCompliant) {
      setError('Form cannot be submitted until all compliance requirements are met');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await saveForm();
      await formService.submitForm(formData.id!, signatures);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = async () => {
    await saveForm();
    setCurrentStep(6);
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await formService.generatePDF(formData.id!);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 7: Review & Submit</h2>

      {/* Compliance Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>

        <div className="space-y-4">
          <div className={`p-4 rounded-md ${sectionA.compliant ? 'bg-success-500 bg-opacity-10' : 'bg-error-500 bg-opacity-10'}`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${sectionA.compliant ? 'text-success-500' : 'text-error-500'}`}>
                {sectionA.message}
              </span>
              <span className="text-2xl">{sectionA.compliant ? '✓' : '✗'}</span>
            </div>
            {!sectionA.compliant && (
              <p className="text-sm text-gray-600 mt-2">
                All Section A items must be "Yes" or "N/A"
              </p>
            )}
          </div>

          <div className={`p-4 rounded-md ${sectionB.compliant ? 'bg-success-500 bg-opacity-10' : 'bg-error-500 bg-opacity-10'}`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${sectionB.compliant ? 'text-success-500' : 'text-error-500'}`}>
                {sectionB.message}
              </span>
              <span className="text-2xl">{sectionB.compliant ? '✓' : '✗'}</span>
            </div>
          </div>

          <div className={`p-4 rounded-md ${overallCompliant ? 'bg-primary-500 bg-opacity-10' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-lg ${overallCompliant ? 'text-primary-700' : 'text-gray-700'}`}>
                Overall Status: {overallCompliant ? 'Compliant' : 'Non-Compliant'}
              </span>
              <span className="text-3xl">{overallCompliant ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Signatures {!isSubmitted && '(Required)'}</h3>
          {isSubmitted && (
            <span className="text-sm text-success-500 font-medium">✓ Submitted on {formData.submitted_at ? new Date(formData.submitted_at).toLocaleDateString() : ''}</span>
          )}
        </div>

        <div className="space-y-6">
          {signatures.map((sig, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-3">Signature {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name {!isSubmitted && '*'}
                  </label>
                  <input
                    type="text"
                    value={sig.name}
                    onChange={(e) => updateSignature(index, 'name', e.target.value)}
                    disabled={isSubmitted}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title {!isSubmitted && '*'}
                  </label>
                  <input
                    type="text"
                    value={sig.title}
                    onChange={(e) => updateSignature(index, 'title', e.target.value)}
                    disabled={isSubmitted}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date {!isSubmitted && '*'}
                  </label>
                  <input
                    type="date"
                    value={sig.date}
                    onChange={(e) => updateSignature(index, 'date', e.target.value)}
                    disabled={isSubmitted}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-500 bg-opacity-10 border border-error-500 rounded-md">
          <p className="text-error-500 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          ← Previous
        </button>
        <div className="flex gap-3">
          {isSubmitted && (
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="px-6 py-2 bg-success-500 text-white rounded-md hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          )}
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={submitting || !overallCompliant}
              className="px-8 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Form'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
