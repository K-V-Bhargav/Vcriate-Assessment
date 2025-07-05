import { useState, useEffect } from 'react';
import useTemplateStore from '../../store/useTemplateStore';
import { Template } from '../../types/template';
import { validateField } from '../../utils/fieldUtils';
import FormField from './FormField';

interface FormRendererProps {
  selectedTemplate: Template | null;
}

const FormRenderer = ({ selectedTemplate }: FormRendererProps) => {
  const { templates, submitFormData, formData } = useTemplateStore();
  const [templateId, setTemplateId] = useState<string | null>(selectedTemplate?.id || null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);
  
  const currentTemplate = templateId 
    ? templates.find(template => template.id === templateId) 
    : null;

  useEffect(() => {
    if (selectedTemplate) {
      setTemplateId(selectedTemplate.id);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    // Reset form values when template changes
    setFormValues({});
    setErrors({});
    setIsSubmitted(false);
  }, [templateId]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when field is changed
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!currentTemplate) return false;
    
    setValidationInProgress(true);

    currentTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        // Skip validation for label fields
        if (field.type === 'label') return;

        const value = formValues[field.id];
        const isFieldValid = validateField(field, value);

        if (!isFieldValid) {
          let errorMessage = 'This field is invalid';
          
          // Provide more specific error messages based on field type
          if (field.type === 'text' && field.required && !value) {
            errorMessage = 'This field is required';
          } else if (field.type === 'number') {
            if (field.required && (value === null || value === undefined || value === '')) {
              errorMessage = 'This field is required';
            } else if (field.min !== undefined && value < field.min) {
              errorMessage = `Value must be at least ${field.min}`;
            } else if (field.max !== undefined && value > field.max) {
              errorMessage = `Value must be at most ${field.max}`;
            }
          } else if (field.type === 'enum' && field.required && !value) {
            errorMessage = 'Please select an option';
          }
          
          newErrors[field.id] = errorMessage;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    setValidationInProgress(false);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && currentTemplate) {
      // Submit form data (submittedAt is added in the store)
      submitFormData({
        templateId: currentTemplate.id,
        values: formValues
      });
      setIsSubmitted(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleCreateNewForm = () => {
    setFormValues({});
    setErrors({});
    setIsSubmitted(false);
  };
  
  const handleToggleSubmissions = () => {
    setShowSubmissions(!showSubmissions);
  };
  
  // Get submissions for the current template
  const currentSubmissions = templateId ? formData.filter(data => data.templateId === templateId) : [];
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!templates.length) {
    return (
      <div className="bg-white shadow sm:rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Available</h3>
        <p className="text-gray-500">Create a template in the Template Builder first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Form</h2>
        {currentTemplate && currentSubmissions.length > 0 && (
          <button
            onClick={handleToggleSubmissions}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showSubmissions ? 'Hide Submissions' : `View Submissions (${currentSubmissions.length})`}
          </button>
        )}
      </div>

      {showSubmissions && currentTemplate && currentSubmissions.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Previous Submissions</h3>
            <button 
              onClick={() => setShowSubmissions(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fields</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentSubmissions.map((submission, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {Object.entries(submission.values).map(([fieldId, value]) => {
                          // Find the field in the template
                          let fieldName = fieldId;
                          let fieldType = 'unknown';
                          
                          currentTemplate.sections.forEach(section => {
                            section.fields.forEach(field => {
                              if (field.id === fieldId) {
                                fieldName = field.name;
                                fieldType = field.type;
                              }
                            });
                          });
                          
                          // Format the value based on field type
                          let displayValue = value;
                          if (fieldType === 'boolean') {
                            displayValue = value ? 'Yes' : 'No';
                          } else if (value === null || value === undefined || value === '') {
                            displayValue = '-';
                          }
                          
                          return (
                            <div key={fieldId} className="flex">
                              <span className="font-medium text-gray-900 mr-2">{fieldName}:</span>
                              <span>{String(displayValue)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSubmitted ? (
        <div className="bg-white shadow sm:rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Form Submitted Successfully</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your form has been submitted and saved.
          </p>
          <div className="mt-4 space-x-4">
            <button
              type="button"
              onClick={handleCreateNewForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Form
            </button>
            {currentSubmissions.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSubmissions}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View All Submissions
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow sm:rounded-lg p-4">
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">
              Select Template
            </label>
            <select
              id="template-select"
              value={templateId || ''}
              onChange={(e) => setTemplateId(e.target.value || null)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {currentTemplate && (
            <div className="bg-white shadow sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{currentTemplate.name}</h3>
              <form onSubmit={handleSubmit}>
                {currentTemplate.sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">{section.title}</h4>
                    <div className="space-y-4">
                      {section.fields.map((field) => (
                        <FormField
                          key={field.id}
                          field={field}
                          value={formValues[field.id]}
                          error={errors[field.id]}
                          onChange={(value) => handleFieldChange(field.id, value)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={validationInProgress}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${validationInProgress ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {validationInProgress ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validating...
                      </>
                    ) : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormRenderer;
