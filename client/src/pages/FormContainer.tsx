import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from '../contexts/FormContext';
import ProgressIndicator from '../components/form/ProgressIndicator';
import StepperSidebar from '../components/layout/StepperSidebar';
import Step1_BasicInfo from './steps/Step1_BasicInfo';
import Step2_SectionA_Licenses from './steps/Step2_SectionA_Licenses';
import Step3_SectionA_Safety from './steps/Step3_SectionA_Safety';
import Step4_SectionB_Exterior from './steps/Step4_SectionB_Exterior';
import Step5_SectionB_Interior from './steps/Step5_SectionB_Interior';
import Step6_SectionB_Vocational from './steps/Step6_SectionB_Vocational';
import Step7_ReviewSubmit from './steps/Step7_ReviewSubmit';

function FormContent() {
  const { currentStep, isLoading, formData } = useForm();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_BasicInfo />;
      case 2:
        return <Step2_SectionA_Licenses />;
      case 3:
        return <Step3_SectionA_Safety />;
      case 4:
        return <Step4_SectionB_Exterior />;
      case 5:
        return <Step5_SectionB_Interior />;
      case 6:
        return <Step6_SectionB_Vocational />;
      case 7:
        return <Step7_ReviewSubmit />;
      default:
        return <Step1_BasicInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900">
            {formData.school_building || 'Health & Safety Checklist'}
          </h1>
        </div>
      </header>

      {/* Progress Bar */}
      <ProgressIndicator />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <StepperSidebar />

        {/* Form Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}

export default function FormContainer() {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
}
