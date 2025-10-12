interface ViewSubmissionSidebarProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const steps = [
  { number: 1, title: 'Basic Info' },
  { number: 2, title: 'Licenses' },
  { number: 3, title: 'Building Safety' },
  { number: 4, title: 'Exterior' },
  { number: 5, title: 'Interior' },
  { number: 6, title: 'Vocational' },
  { number: 7, title: 'Review' },
];

export default function ViewSubmissionSidebar({ currentStep, setCurrentStep }: ViewSubmissionSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6 space-y-2 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
          Form Sections
        </h2>
      </div>
      {steps.map((step) => (
        <button
          key={step.number}
          onClick={() => setCurrentStep(step.number)}
          className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
            currentStep === step.number
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
              currentStep === step.number
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {step.number}
            </span>
            <div className="text-sm font-medium">{step.title}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
