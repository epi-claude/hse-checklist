import { useForm } from '../../contexts/FormContext';
import FormItem from '../../components/form/FormItem';
import { sectionBVocational } from '../../data/checklistItems';

export default function Step6_SectionB_Vocational() {
  const { formData, updateChecklistItem, saveForm, setCurrentStep } = useForm();

  const handlePrev = async () => {
    await saveForm();
    setCurrentStep(5);
  };

  const handleNext = async () => {
    await saveForm();
    setCurrentStep(7);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Step 6: Section B - Vocational/Laboratory Safety</h2>
        <p className="text-sm text-gray-600 mt-1">80% compliance required</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-1">
        {sectionBVocational.map((item) => (
          <FormItem
            key={item.number}
            number={item.number}
            label={item.label}
            fullText={item.fullText}
            value={formData.section_b_items?.[item.number]}
            onChange={(data) => updateChecklistItem('section_b', item.number, data)}
            onBlur={saveForm}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
