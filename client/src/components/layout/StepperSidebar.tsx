import { useForm } from '../../contexts/FormContext';

const steps = [
  { number: 1, title: 'Basic Info', section: null },
  { number: 2, title: 'Licenses', section: 'A' },
  { number: 3, title: 'Building Safety', section: 'A' },
  { number: 4, title: 'Exterior', section: 'B' },
  { number: 5, title: 'Interior', section: 'B' },
  { number: 6, title: 'Vocational', section: 'B' },
  { number: 7, title: 'Review & Submit', section: null },
];

export default function StepperSidebar() {
  const { currentStep, setCurrentStep, saveForm } = useForm();

  const handleStepClick = async (stepNumber: number) => {
    // Save before navigating
    await saveForm();
    setCurrentStep(stepNumber);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 space-y-2">
      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <button
            key={step.number}
            onClick={() => handleStepClick(step.number)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary-500 text-white'
                : isCompleted
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                isActive
                  ? 'bg-white text-primary-500'
                  : isCompleted
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? '✓' : step.number}
              </span>
              <div>
                <div className="text-sm font-medium">{step.title}</div>
                {step.section && (
                  <div className="text-xs opacity-75">Section {step.section}</div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
