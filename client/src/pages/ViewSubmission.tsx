import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../services/formService';
import { FormData } from '../types/form.types';
import { sectionALicenses, sectionASafety, sectionBExterior, sectionBInterior, sectionBVocational } from '../data/checklistItems';
import {
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/outline';
import ResponsiveViewLayout from '../components/layout/ResponsiveViewLayout';

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
      <div key={item.number} className="border-b border-gray-100 py-4 last:border-0">
        <div className="flex items-start mb-3">
          <span className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-semibold text-primary-600 mr-3">
            {item.number}
          </span>
          <p className="text-sm text-gray-900 flex-1 leading-relaxed">{item.label}</p>
        </div>
        <div className="ml-11">
          <div className="flex gap-3 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              response === 'yes'
                ? 'bg-success-100 text-success-700 border border-success-200'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            }`}>
              {response === 'yes' ? <CheckCircleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
              Yes
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              response === 'no'
                ? 'bg-error-100 text-error-700 border border-error-200'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            }`}>
              {response === 'no' ? <XCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
              No
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              response === 'na'
                ? 'bg-gray-200 text-gray-700 border border-gray-300'
                : 'bg-gray-50 text-gray-400 border border-gray-200'
            }`}>
              {response === 'na' ? <MinusCircleIcon className="w-4 h-4" /> : <MinusCircleIcon className="w-4 h-4" />}
              N/A
            </span>
          </div>
          {response === 'no' && location && (
            <div className="mt-2 p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">
                <span className="font-medium">Violation Location:</span> {location}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAllSteps = () => {
    return (
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Basic Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">County</label>
                <p className="text-gray-900 mt-1 font-medium">{formData.county || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">District</label>
                <p className="text-gray-900 mt-1 font-medium">{formData.district || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Building Type</label>
                <p className="text-gray-900 mt-1 font-medium capitalize">{formData.building_type || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">School Building</label>
                <p className="text-gray-900 mt-1 font-medium">{formData.school_building || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Completed By</label>
                <p className="text-gray-900 mt-1 font-medium">{formData.completed_by || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                <p className="text-gray-900 mt-1 font-medium">{formData.completion_date || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none print:break-after-page">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Section A - Licenses & Certificates</h3>
          </div>
          <div className="p-6">
            {sectionALicenses.map(item => renderChecklistItem(item, 'section_a'))}
            {formData.section_a_notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                <p className="text-gray-900 mt-2 p-4 bg-gray-50 rounded-lg">{formData.section_a_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none print:break-after-page">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Section A - Building Safety</h3>
          </div>
          <div className="p-6">
            {sectionASafety.map(item => renderChecklistItem(item, 'section_a'))}
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none print:break-after-page">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Section B - Exterior & Structure</h3>
          </div>
          <div className="p-6">
            {sectionBExterior.map(item => renderChecklistItem(item, 'section_b'))}
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none print:break-after-page">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Section B - Interior Safety</h3>
          </div>
          <div className="p-6">
            {sectionBInterior.map(item => renderChecklistItem(item, 'section_b'))}
            {formData.section_b_notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                <p className="text-gray-900 mt-2 p-4 bg-gray-50 rounded-lg">{formData.section_b_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Step 6 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none print:break-after-page">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Section B - Vocational/Laboratory Safety</h3>
          </div>
          <div className="p-6">
            {sectionBVocational.map(item => renderChecklistItem(item, 'section_b'))}
          </div>
        </div>

        {/* Step 7 */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden print:shadow-none">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h3 className="font-semibold text-lg text-white">Compliance Summary & Signatures</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg border-2 ${(formData as any).section_a_compliant ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'}`}>
                <p className={`font-semibold ${(formData as any).section_a_compliant ? 'text-success-700' : 'text-error-700'}`}>
                  Section A: {(formData as any).section_a_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${(formData as any).section_b_compliant ? 'bg-success-50 border-success-200' : 'bg-error-50 border-error-200'}`}>
                <p className={`font-semibold ${(formData as any).section_b_compliant ? 'text-success-700' : 'text-error-700'}`}>
                  Section B: {(formData as any).section_b_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'} ({(formData as any).section_b_percentage}%)
                </p>
              </div>

              <div className={`p-5 rounded-lg border-2 ${(formData as any).overall_compliant ? 'bg-primary-50 border-primary-200' : 'bg-gray-100 border-gray-300'}`}>
                <p className={`font-bold text-lg ${(formData as any).overall_compliant ? 'text-primary-700' : 'text-gray-700'}`}>
                  Overall Status: {(formData as any).overall_compliant ? 'Compliant ✓' : 'Non-Compliant ✗'}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Authorized Signatures</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h5 className="font-semibold text-gray-700 mb-3">Signature {i}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                        <p className="text-sm text-gray-900 mt-1 font-medium">{(formData as any)[`signature_${i}_name`] || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Title</label>
                        <p className="text-sm text-gray-900 mt-1 font-medium">{(formData as any)[`signature_${i}_title`] || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                        <p className="text-sm text-gray-900 mt-1 font-medium">{(formData as any)[`signature_${i}_date`] || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Submitted: {(formData as any).submitted_at ? new Date((formData as any).submitted_at).toLocaleString() : 'N/A'}
              </p>
            </div>
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

  return (
    <ResponsiveViewLayout
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      header={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-shrink-0 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors print:hidden"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {formData.school_building || 'Health & Safety Checklist'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  Submitted
                </span>
                <span className="text-xs text-gray-500">
                  {formData.submitted_at ? new Date(formData.submitted_at).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium text-sm"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              {generatingPDF ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto">
        {/* Show single step on screen, all steps when printing */}
        <div className="print:hidden">
          {renderStep()}
        </div>
        <div className="hidden print:block">
          {renderAllSteps()}
        </div>
      </div>
    </ResponsiveViewLayout>
  );
}
