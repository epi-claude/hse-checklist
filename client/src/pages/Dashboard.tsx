import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formService } from '../services/formService';
import { FormListItem } from '../types/form.types';
import {
  PlusIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [schoolBuilding, setSchoolBuilding] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    loadForms();
  }, [isAuthenticated]);

  const loadForms = async () => {
    try {
      const data = await formService.getForms();
      setForms(data.forms);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolBuilding.trim()) return;

    try {
      const result = await formService.createForm(schoolBuilding);
      setShowCreateModal(false);
      setSchoolBuilding('');
      // Navigate to the new form
      navigate(`/form/${result.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create form');
    }
  };

  const handleEditForm = async (formId: string) => {
    try {
      await formService.reopenForm(formId);
      navigate(`/form/${formId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reopen form');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health & Safety Checklist</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Add New
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-error-50 border border-error-200 p-4">
            <p className="text-sm text-error-600">{error}</p>
          </div>
        )}

        {/* Forms Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Your Forms</h2>
            <span className="text-sm text-gray-500">{forms.length} {forms.length === 1 ? 'form' : 'forms'}</span>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No forms yet</h3>
              <p className="mt-2 text-sm text-gray-500">Get started by creating your first form.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm font-medium"
              >
                <PlusIcon className="w-5 h-5" />
                Create First Form
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <ClipboardDocumentListIcon className="w-8 h-8 text-white opacity-90" />
                      {form.status === 'submitted' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                          <CheckCircleIcon className="w-4 h-4" />
                          Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                          <ClockIcon className="w-4 h-4" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {form.school_building || 'Untitled Form'}
                    </h3>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - form.completion_percentage / 100)}`}
                            className={form.status === 'submitted' ? 'text-success-500' : 'text-primary-500'}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900">{form.completion_percentage}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Progress</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {form.completion_percentage === 100 ? 'Completed' : `${100 - form.completion_percentage}% remaining`}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 text-xs text-gray-500">
                      <p>Updated: {new Date(form.updated_at).toLocaleDateString()}</p>
                      {form.submitted_at && (
                        <p className="text-success-600 font-medium">
                          Submitted: {new Date(form.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      {form.status === 'submitted' ? (
                        <>
                          <button
                            onClick={() => navigate(`/view/${form.id}`)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                          >
                            View
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditForm(form.id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/form/${form.id}`)}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors group-hover:shadow-md"
                        >
                          Continue
                          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Create New Form</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Start a new health & safety evaluation</p>
                </div>
              </div>

              <form onSubmit={handleCreateForm}>
                <div>
                  <label htmlFor="school-building" className="block text-sm font-medium text-gray-700 mb-2">
                    School Building Name
                  </label>
                  <input
                    type="text"
                    id="school-building"
                    required
                    value={schoolBuilding}
                    onChange={(e) => setSchoolBuilding(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-colors"
                    placeholder="e.g., Main Street Elementary School"
                  />
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSchoolBuilding('');
                    }}
                    className="flex-1 inline-flex justify-center items-center rounded-lg border border-gray-300 px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex justify-center items-center rounded-lg border border-transparent px-4 py-2.5 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-sm"
                  >
                    Create Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
