import { useForm } from '../../contexts/FormContext';
import FormItem from '../../components/form/FormItem';
import { sectionALicenses } from '../../data/checklistItems';

export default function Step2_SectionA_Licenses() {
  const { formData, updateChecklistItem, updateField, saveForm, setCurrentStep } = useForm();

  const handlePrev = async () => {
    await saveForm();
    setCurrentStep(1);
  };

  const handleNext = async () => {
    await saveForm();
    setCurrentStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Step 2: Section A - Licenses & Certificates</h2>
        <p className="text-sm text-gray-600 mt-1">100% compliance required - All items must be "Yes" or "N/A"</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-1">
        {sectionALicenses.map((item) => (
          <FormItem
            key={item.number}
            number={item.number}
            label={item.label}
            fullText={item.fullText}
            value={formData.section_a_items?.[item.number]}
            onChange={(data) => updateChecklistItem('section_a', item.number, data)}
            onBlur={saveForm}
          />
        ))}

        <div className="pt-6 border-t border-gray-200">
          <label htmlFor="section_a_notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="section_a_notes"
            rows={4}
            value={formData.section_a_notes || ''}
            onChange={(e) => updateField('section_a_notes', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add any notes for Section A..."
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
