import { useForm } from '../../contexts/FormContext';

export default function ProgressIndicator() {
  const { progressPercentage, isSaving, lastSaved } = useForm();

  const getLastSavedText = () => {
    if (isSaving) return 'Saving...';
    if (!lastSaved) return 'Not saved yet';

    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return `Saved ${diff}s ago`;
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved ${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progress: {progressPercentage}%
        </span>
        <span className="text-xs text-gray-500">
          {getLastSavedText()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
