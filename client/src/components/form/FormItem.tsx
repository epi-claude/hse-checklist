import { ChecklistItem } from '../../types/form.types';
import InfoPopover from '../InfoPopover';

interface FormItemProps {
  number: number;
  label: string;
  fullText?: string;
  value: ChecklistItem | undefined;
  onChange: (data: Partial<ChecklistItem>) => void;
  onBlur?: () => void;
}

export default function FormItem({ number, label, fullText, value, onChange, onBlur }: FormItemProps) {
  const response = value?.response || '';
  const location = value?.location || '';

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start mb-3">
        <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
          {number}
        </span>
        <div className="flex-1 flex items-start">
          <label className="text-sm text-gray-900">
            {label}
          </label>
          {fullText && <InfoPopover content={fullText} />}
        </div>
      </div>

      <div className="ml-11 space-y-3">
        {/* Radio buttons */}
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={`item-${number}`}
              value="yes"
              checked={response === 'yes'}
              onChange={() => onChange({ response: 'yes' })}
              onBlur={onBlur}
              className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Yes</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={`item-${number}`}
              value="no"
              checked={response === 'no'}
              onChange={() => onChange({ response: 'no' })}
              onBlur={onBlur}
              className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name={`item-${number}`}
              value="na"
              checked={response === 'na'}
              onChange={() => onChange({ response: 'na' })}
              onBlur={onBlur}
              className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">N/A</span>
          </label>
        </div>

        {/* Violation location field - show when "No" is selected */}
        {response === 'no' && (
          <div>
            <label htmlFor={`location-${number}`} className="block text-xs text-gray-600 mb-1">
              Violation Location (Required for "No" response)
            </label>
            <input
              type="text"
              id={`location-${number}`}
              value={location}
              onChange={(e) => onChange({ location: e.target.value })}
              onBlur={onBlur}
              placeholder="Describe location of violation..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
