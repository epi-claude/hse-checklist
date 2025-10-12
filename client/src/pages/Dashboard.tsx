import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formService } from '../services/formService';
import { FormListItem } from '../types/form.types';

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Health & Safety Checklist Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="text-sm text-primary-500 hover:text-primary-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md bg-error-500 bg-opacity-10 p-4">
            <p className="text-sm text-error-500">{error}</p>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Forms</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700"
            >
              + New Form
            </button>
          </div>

          {forms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No forms yet. Create your first form to get started.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {forms.map((form) => (
                  <li key={form.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary-500 truncate">
                            {form.school_building || 'Untitled Form'}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Status: <span className={`font-medium ${form.status === 'submitted' ? 'text-success-500' : 'text-gray-700'}`}>
                              {form.status === 'submitted' ? 'Submitted ✓' : 'Draft'}
                            </span> •
                            Progress: <span className="font-medium">{form.completion_percentage}%</span>
                          </p>
                          <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                            <p>Last updated: {new Date(form.updated_at).toLocaleDateString()} {new Date(form.updated_at).toLocaleTimeString()}</p>
                            {form.submitted_at && (
                              <p className="font-medium text-success-500">
                                Submitted: {new Date(form.submitted_at).toLocaleDateString()} {new Date(form.submitted_at).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {form.status === 'submitted' ? (
                            <>
                              <button
                                onClick={() => navigate(`/view/${form.id}`)}
                                className="px-3 py-1 text-sm border border-primary-500 text-primary-500 rounded hover:bg-primary-50"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditForm(form.id)}
                                className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-700"
                              >
                                Edit & Resubmit
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => navigate(`/form/${form.id}`)}
                              className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-700"
                            >
                              Continue
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowCreateModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Form</h3>
              <form onSubmit={handleCreateForm}>
                <div>
                  <label htmlFor="school-building" className="block text-sm font-medium text-gray-700">
                    School Building Name
                  </label>
                  <input
                    type="text"
                    id="school-building"
                    required
                    value={schoolBuilding}
                    onChange={(e) => setSchoolBuilding(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., Main Street Elementary School"
                  />
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSchoolBuilding('');
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:text-sm"
                  >
                    Cancel
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
