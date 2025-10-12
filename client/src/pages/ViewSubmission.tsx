import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../services/formService';
import { FormData } from '../types/form.types';
import { sectionALicenses, sectionASafety, sectionBExterior, sectionBInterior, sectionBVocational } from '../data/checklistItems';

export default function ViewSubmission() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const data = await formService.getReadOnlyForm(formId!);

      // Parse JSON strings
      const parsedData = {
        ...data,
        section_a_items: data.section_a_items ? JSON.parse(data.section_a_items as string) : {},
        section_b_items: data.section_b_items ? JSON.parse(data.section_b_items as string) : {},
      };

      setFormData(parsedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load form:', error);
      navigate('/dashboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await formService.generatePDF(formId!);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const renderChecklistItem = (item: { number: number; label: string }, section: 'section_a' | 'section_b') => {
    const sectionKey = section === 'section_a' ? 'section_a_items' : 'section_b_items';
    const itemData = (formData as any)[sectionKey]?.[item.number];
    const response = itemData?.response || '';
    const location = itemData?.location || '';

    return (
      <div key={item.number} className="border-b border-gray-200 py-4">
        <div className="flex items-start mb-2">
          <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
            {item.number}
          </span>
          <p className="text-sm text-gray-900 flex-1">{item.label}</p>
        </div>
        <div className="ml-11">
          <div className="flex gap-4 mb-2">
            <span className={`text-sm ${response === 'yes' ? 'font-bold text-success-500' : 'text-gray-400'}`}>
              ☑ Yes
            </span>
            <span className={`text-sm ${response === 'no' ? 'font-bold text-error-500' : 'text-gray-400'}`}>
              ☑ No
            </span>
            <span className={`text-sm ${response === 'na' ? 'font-bold text-gray-700' : 'text-gray-400'}`}>
              ☑ N/A
            </span>
          </div>
          {response === 'no' && location && (
            <p className="text-sm text-gray-600 italic">Violation Location: {location}</p>
          )}
        </div>
      </div>
    );
  };

  const renderAllSteps = () => {
    return (
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">County</label>
                <p className="text-gray-900">{formData.county || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">District</label>
                <p className="text-gray-900">{formData.district || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Building Type</label>
                <p className="text-gray-900">{formData.building_type || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">School Building</label>
                <p className="text-gray-900">{formData.school_building || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Completed By</label>
                <p className="text-gray-900">{formData.completed_by || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{formData.completion_date || 'N/A'}</p>
              </div>
            </div>
          </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:break-after-page">
          <h3 className="font-semibold text-lg mb-4">Section A - Licenses & Certificates</h3>
            {sectionALicenses.map(item => renderChecklistItem(item, 'section_a'))}
            {formData.section_a_notes && (
              <div className="mt-4 pt-4 border-t">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <p className="text-gray-900 mt-1">{formData.section_a_notes}</p>
              </div>
            )}
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:break-after-page">
          <h3 className="font-semibold text-lg mb-4">Section A - Building Safety</h3>
          {sectionASafety.map(item => renderChecklistItem(item, 'section_a'))}
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:break-after-page">
          <h3 className="font-semibold text-lg mb-4">Section B - Exterior & Structure</h3>
          {sectionBExterior.map(item => renderChecklistItem(item, 'section_b'))}
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:break-after-page">
          <h3 className="font-semibold text-lg mb-4">Section B - Interior Safety</h3>
          {sectionBInterior.map(item => renderChecklistItem(item, 'section_b'))}
          {formData.section_b_notes && (
            <div className="mt-4 pt-4 border-t">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <p className="text-gray-900 mt-1">{formData.section_b_notes}</p>
            </div>
          )}
        </div>

        {/* Step 6 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none print:break-after-page">
          <h3 className="font-semibold text-lg mb-4">Section B - Vocational/Laboratory Safety</h3>
          {sectionBVocational.map(item => renderChecklistItem(item, 'section_b'))}
        </div>

        {/* Step 7 */}
        <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h3 className="font-semibold text-lg mb-4">Compliance Summary & Signatures</h3>

            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-md ${(formData as any).section_a_compliant ? 'bg-success-500 bg-opacity-10' : 'bg-error-500 bg-opacity-10'}`}>
                <p className={`font-medium ${(formData as any).section_a_compliant ? 'text-success-500' : 'text-error-500'}`}>
                  Section A: {(formData as any).section_a_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                </p>
              </div>

              <div className={`p-4 rounded-md ${(formData as any).section_b_compliant ? 'bg-success-500 bg-opacity-10' : 'bg-error-500 bg-opacity-10'}`}>
                <p className={`font-medium ${(formData as any).section_b_compliant ? 'text-success-500' : 'text-error-500'}`}>
                  Section B: {(formData as any).section_b_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'} ({(formData as any).section_b_percentage}%)
                </p>
              </div>

              <div className={`p-4 rounded-md ${(formData as any).overall_compliant ? 'bg-primary-500 bg-opacity-10' : 'bg-gray-100'}`}>
                <p className={`font-bold text-lg ${(formData as any).overall_compliant ? 'text-primary-700' : 'text-gray-700'}`}>
                  Overall Status: {(formData as any).overall_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-4">Signatures</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-gray-200 rounded-md p-4">
                  <h5 className="font-medium mb-2">Signature {i}</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600">Name</label>
                      <p className="text-sm">{(formData as any)[`signature_${i}_name`] || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Title</label>
                      <p className="text-sm">{(formData as any)[`signature_${i}_title`] || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Date</label>
                      <p className="text-sm">{(formData as any)[`signature_${i}_date`] || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Submitted: {(formData as any).submitted_at ? new Date((formData as any).submitted_at).toLocaleString() : 'N/A'}
              </p>
            </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderAllSteps().props.children[0];
      case 2:
        return renderAllSteps().props.children[1];
      case 3:
        return renderAllSteps().props.children[2];
      case 4:
        return renderAllSteps().props.children[3];
      case 5:
        return renderAllSteps().props.children[4];
      case 6:
        return renderAllSteps().props.children[5];
      case 7:
        return renderAllSteps().props.children[6];
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Licenses' },
    { number: 3, title: 'Building Safety' },
    { number: 4, title: 'Exterior' },
    { number: 5, title: 'Interior' },
    { number: 6, title: 'Vocational' },
    { number: 7, title: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col print:bg-white">
      {/* Header */}
      <header className="bg-white shadow print:shadow-none">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {formData.school_building || 'Health & Safety Checklist'}
            </h1>
            <p className="text-sm text-gray-600">Read-Only View - Submitted Form</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="px-4 py-2 bg-success-500 text-white rounded-md hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Print
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 space-y-2 print:hidden">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentStep === step.number
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                  currentStep === step.number
                    ? 'bg-white text-primary-500'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.number}
                </span>
                <div className="text-sm font-medium">{step.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Show single step on screen, all steps when printing */}
            <div className="print:hidden">
              {renderStep()}
            </div>
            <div className="hidden print:block">
              {renderAllSteps()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
