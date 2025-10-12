import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../services/formService';
import { FormData, ChecklistItem } from '../types/form.types';

interface FormContextType {
  formData: FormData;
  updateField: (field: string, value: any) => void;
  updateChecklistItem: (section: 'section_a' | 'section_b', itemNumber: number, data: Partial<ChecklistItem>) => void;
  saveForm: () => Promise<void>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  progressPercentage: number;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    section_a_items: {},
    section_b_items: {},
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Load form data
  useEffect(() => {
    if (!formId) {
      navigate('/dashboard');
      return;
    }

    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const data = await formService.getFormById(formId!);

      // Parse JSON strings to objects
      const parsedData = {
        ...data,
        section_a_items: data.section_a_items ? JSON.parse(data.section_a_items as string) : {},
        section_b_items: data.section_b_items ? JSON.parse(data.section_b_items as string) : {},
      };

      setFormData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load form:', error);
      navigate('/dashboard');
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!formId || isLoading) return;

    const timer = setTimeout(() => {
      saveForm();
    }, 30000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData, formId, isLoading]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateChecklistItem = (
    section: 'section_a' | 'section_b',
    itemNumber: number,
    data: Partial<ChecklistItem>
  ) => {
    const sectionKey = section === 'section_a' ? 'section_a_items' : 'section_b_items';

    setFormData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemNumber]: {
          ...(prev[sectionKey]?.[itemNumber] || { response: '', location: '' }),
          ...data,
        },
      },
    }));
  };

  const saveForm = async () => {
    if (!formId || isSaving) return;

    setIsSaving(true);
    try {
      // Prepare data for API (stringify objects)
      const dataToSave = {
        ...formData,
        section_a_items: JSON.stringify(formData.section_a_items || {}),
        section_b_items: JSON.stringify(formData.section_b_items || {}),
      };

      await formService.updateForm(formId, dataToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (() => {
    // More accurate field count:
    // 6 basic + 59 checklist responses (not locations) + 2 notes (optional) + 9 signatures = 76 required
    // But we'll use a simpler approach: count what's actually filled vs what matters
    let filledFields = 0;
    let totalFields = 0;

    // Basic fields (6)
    totalFields += 6;
    if (formData.county) filledFields++;
    if (formData.district) filledFields++;
    if (formData.building_type) filledFields++;
    if (formData.school_building) filledFields++;
    if (formData.completed_by) filledFields++;
    if (formData.completion_date) filledFields++;

    // Section A items - only count responses (25 items)
    totalFields += 25;
    if (formData.section_a_items) {
      Object.values(formData.section_a_items).forEach((item: any) => {
        if (item?.response) filledFields++;
      });
    }

    // Section B items - only count responses (34 items)
    totalFields += 34;
    if (formData.section_b_items) {
      Object.values(formData.section_b_items).forEach((item: any) => {
        if (item?.response) filledFields++;
      });
    }

    // Notes are optional, don't count them

    // Signatures aren't in formData yet (only added on submit), don't count

    return Math.round((filledFields / totalFields) * 100);
  })();

  return (
    <FormContext.Provider
      value={{
        formData,
        updateField,
        updateChecklistItem,
        saveForm,
        currentStep,
        setCurrentStep,
        isLoading,
        isSaving,
        lastSaved,
        progressPercentage,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
