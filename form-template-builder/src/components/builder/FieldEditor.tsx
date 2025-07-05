import { useState } from 'react';
import useTemplateStore from '../../store/useTemplateStore';
import { Field, LabelStyle } from '../../types/template';
import { validateField } from '../../utils/fieldUtils';

interface FieldEditorProps {
  templateId: string;
  sectionId: string;
  field: Field;
}

const FieldEditor = ({ templateId, sectionId, field }: FieldEditorProps) => {
  const { updateField, deleteField } = useTemplateStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [testValue, setTestValue] = useState<any>(field.value);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleTestValue = (value: any) => {
    setTestValue(value);
    const isValid = validateField(field, value);
    setValidationError(isValid ? null : 'This field is invalid');
  };

  const handleDeleteField = () => {
    deleteField(templateId, sectionId, field.id);
  };

  const handleUpdateField = (updatedField: Field) => {
    updateField(templateId, sectionId, updatedField);
  };

  const renderFieldSpecificControls = () => {
    switch (field.type) {
      case 'label':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700">Label Text</label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleUpdateField({ ...field, value: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">Style</label>
              <select
                value={field.labelStyle}
                onChange={(e) => handleUpdateField({ ...field, labelStyle: e.target.value as LabelStyle })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>
          </>
        );

      case 'text':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleUpdateField({ ...field, placeholder: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                id={`required-${field.id}`}
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => handleUpdateField({ ...field, required: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${field.id}`} className="ml-2 block text-xs font-medium text-gray-700">
                Required
              </label>
            </div>
          </>
        );

      case 'number':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleUpdateField({ ...field, placeholder: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">Min</label>
                <input
                  type="number"
                  value={field.min !== undefined ? field.min : ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    handleUpdateField({ ...field, min: value });
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Max</label>
                <input
                  type="number"
                  value={field.max !== undefined ? field.max : ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    handleUpdateField({ ...field, max: value });
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <input
                id={`required-${field.id}`}
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => handleUpdateField({ ...field, required: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${field.id}`} className="ml-2 block text-xs font-medium text-gray-700">
                Required
              </label>
            </div>
          </>
        );

      case 'boolean':
        return (
          <div>
            <label className="block text-xs font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => handleUpdateField({ ...field, label: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        );

      case 'enum':
        return (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700">Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleUpdateField({ ...field, placeholder: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-700">Options</label>
              <div className="space-y-2 mt-1">
                {field.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = { ...newOptions[index], label: e.target.value };
                        handleUpdateField({ ...field, options: newOptions });
                      }}
                      placeholder="Label"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => {
                        const newOptions = [...field.options];
                        newOptions[index] = { ...newOptions[index], value: e.target.value };
                        handleUpdateField({ ...field, options: newOptions });
                      }}
                      placeholder="Value"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = field.options.filter((_, i) => i !== index);
                        handleUpdateField({ ...field, options: newOptions });
                      }}
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newOptions = [...field.options, { label: '', value: '' }];
                    handleUpdateField({ ...field, options: newOptions });
                  }}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Option
                </button>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <input
                id={`required-${field.id}`}
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => handleUpdateField({ ...field, required: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`required-${field.id}`} className="ml-2 block text-xs font-medium text-gray-700">
                Required
              </label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderFieldPreview = () => {
    if (!previewMode) {
      return (
        <div className="field-preview">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">Preview</span>
            <button 
              onClick={() => setPreviewMode(true)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Test Field
            </button>
          </div>
          {renderReadOnlyPreview()}
        </div>
      );
    }

    return (
      <div className="field-preview">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Test Mode</span>
          <button 
            onClick={() => {
              setPreviewMode(false);
              setValidationError(null);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Exit Test Mode
          </button>
        </div>
        {renderInteractivePreview()}
        {validationError && (
          <p className="mt-1 text-xs text-red-500">{validationError}</p>
        )}
      </div>
    );
  };

  const renderReadOnlyPreview = () => {
    switch (field.type) {
      case 'label':
        return (
          <div className="py-1">
            {field.labelStyle === 'h1' && <h1 className="text-2xl font-bold">{field.value}</h1>}
            {field.labelStyle === 'h2' && <h2 className="text-xl font-semibold">{field.value}</h2>}
            {field.labelStyle === 'h3' && <h3 className="text-lg font-medium">{field.value}</h3>}
          </div>
        );

      case 'text':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <input
              type="text"
              disabled
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
              placeholder={field.placeholder}
            />
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      case 'number':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <input
              type="number"
              disabled
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
              placeholder={field.placeholder}
            />
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      case 'boolean':
        return (
          <div className="py-1 flex items-center">
            <input
              type="checkbox"
              disabled
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">{field.label}</label>
          </div>
        );

      case 'enum':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <select
              disabled
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-50"
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const renderInteractivePreview = () => {
    switch (field.type) {
      case 'label':
        return (
          <div className="py-1">
            {field.labelStyle === 'h1' && <h1 className="text-2xl font-bold">{field.value}</h1>}
            {field.labelStyle === 'h2' && <h2 className="text-xl font-semibold">{field.value}</h2>}
            {field.labelStyle === 'h3' && <h3 className="text-lg font-medium">{field.value}</h3>}
          </div>
        );

      case 'text':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <input
              type="text"
              value={testValue || ''}
              onChange={(e) => handleTestValue(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={field.placeholder}
            />
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      case 'number':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <input
              type="number"
              value={testValue !== null && testValue !== undefined ? testValue : ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                handleTestValue(val);
              }}
              min={field.min}
              max={field.max}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={field.placeholder}
            />
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      case 'boolean':
        return (
          <div className="py-1 flex items-center">
            <input
              type="checkbox"
              checked={testValue || false}
              onChange={(e) => handleTestValue(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">{field.label}</label>
          </div>
        );

      case 'enum':
        return (
          <div className="py-1">
            <label className="block text-sm font-medium text-gray-700">{field.name}</label>
            <select
              value={testValue || ''}
              onChange={(e) => handleTestValue(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.required && <p className="mt-1 text-xs text-red-500">* Required</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-3 mb-2 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
            {field.type}
          </span>
          <h5 className="text-sm font-medium text-gray-900">{field.name}</h5>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          <button
            onClick={handleDeleteField}
            className="inline-flex items-center p-1 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">Field Name</label>
            <input
              type="text"
              value={field.name}
              onChange={(e) => handleUpdateField({ ...field, name: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {renderFieldSpecificControls()}
          <div className="mt-3 border-t border-gray-200 pt-3">
            <h6 className="text-xs font-medium text-gray-700 mb-2">Preview</h6>
            {renderFieldPreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
