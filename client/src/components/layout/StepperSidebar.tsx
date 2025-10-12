import { useForm } from '../../contexts/FormContext';
import {
  InformationCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  HomeModernIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const steps = [
  { number: 1, title: 'Basic Info', section: null, icon: InformationCircleIcon },
  { number: 2, title: 'Licenses', section: 'A', icon: DocumentTextIcon },
  { number: 3, title: 'Building Safety', section: 'A', icon: ShieldCheckIcon },
  { number: 4, title: 'Exterior', section: 'B', icon: HomeModernIcon },
  { number: 5, title: 'Interior', section: 'B', icon: BuildingOfficeIcon },
  { number: 6, title: 'Vocational', section: 'B', icon: WrenchScrewdriverIcon },
  { number: 7, title: 'Review & Submit', section: null, icon: CheckCircleIcon },
];

export default function StepperSidebar() {
  const { currentStep, setCurrentStep, saveForm } = useForm();

  const handleStepClick = async (stepNumber: number) => {
    // Save before navigating
    await saveForm();
    setCurrentStep(stepNumber);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 space-y-2 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
          Form Steps
        </h2>
      </div>
      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        const Icon = step.icon;

        return (
          <button
            key={step.number}
            onClick={() => handleStepClick(step.number)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : isCompleted
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : isCompleted
                  ? 'bg-primary-100 text-primary-600'
                  : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              }`}>
                {isCompleted ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-white/80' : isCompleted ? 'text-primary-500' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </span>
                  {step.section && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isCompleted
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {step.section}
                    </span>
                  )}
                </div>
                <div className={`text-sm font-medium mt-0.5 truncate ${
                  isActive ? 'text-white' : ''
                }`}>
                  {step.title}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
