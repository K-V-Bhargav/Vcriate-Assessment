import { Field } from '../../types/template';

interface FormFieldProps {
  field: Field;
  value: any;
  error?: string;
  onChange: (value: any) => void;
}

const FormField = ({ field, value, error, onChange }: FormFieldProps) => {
  const renderField = () => {
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
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id={field.id}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                error ? 'border-red-300' : ''
              }`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 error-message flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div className="py-1">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              id={field.id}
              value={value !== undefined && value !== null ? value : ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                onChange(val);
              }}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                error ? 'border-red-300' : ''
              }`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 error-message flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div className="py-1 flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={field.id} className="ml-2 block text-sm font-medium text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'enum':
        return (
          <div className="py-1">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              id={field.id}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                error ? 'border-red-300' : ''
              }`}
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600 error-message flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
};

export default FormField;
