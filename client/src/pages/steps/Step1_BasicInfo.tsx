import { useForm } from '../../contexts/FormContext';

export default function Step1_BasicInfo() {
  const { formData, updateField, saveForm, setCurrentStep } = useForm();

  const handleNext = async () => {
    await saveForm();
    setCurrentStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Basic Information</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-2">
            County
          </label>
          <input
            type="text"
            id="county"
            value={formData.county || ''}
            onChange={(e) => updateField('county', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter county name"
          />
        </div>

        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <input
            type="text"
            id="district"
            value={formData.district || ''}
            onChange={(e) => updateField('district', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter district name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="building_type"
                value="leased"
                checked={formData.building_type === 'leased'}
                onChange={(e) => updateField('building_type', e.target.value)}
                onBlur={saveForm}
                className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Leased</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="building_type"
                value="owned"
                checked={formData.building_type === 'owned'}
                onChange={(e) => updateField('building_type', e.target.value)}
                onBlur={saveForm}
                className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Owned</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="school_building" className="block text-sm font-medium text-gray-700 mb-2">
            School Building
          </label>
          <input
            type="text"
            id="school_building"
            value={formData.school_building || ''}
            onChange={(e) => updateField('school_building', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter school building name"
          />
        </div>

        <div>
          <label htmlFor="completed_by" className="block text-sm font-medium text-gray-700 mb-2">
            Completed By
          </label>
          <input
            type="text"
            id="completed_by"
            value={formData.completed_by || ''}
            onChange={(e) => updateField('completed_by', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="completion_date"
            value={formData.completion_date || ''}
            onChange={(e) => updateField('completion_date', e.target.value)}
            onBlur={saveForm}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
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
