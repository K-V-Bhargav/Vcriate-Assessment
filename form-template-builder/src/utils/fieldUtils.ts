import { Field, FieldType } from '../types/template';

// Validate field value based on its type
export const validateField = (field: Field, value: any): boolean => {
  switch (field.type) {
    case 'text':
      if (field.required && (!value || value.trim() === '')) {
        return false;
      }
      return true;
      
    case 'number':
      if (field.required && (value === undefined || value === null)) {
        return false;
      }
      
      if (value !== undefined && value !== null) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return false;
        }
        
        if (field.min !== undefined && numValue < field.min) {
          return false;
        }
        
        if (field.max !== undefined && numValue > field.max) {
          return false;
        }
      }
      
      return true;
      
    case 'boolean':
      return true; // Boolean fields are always valid
      
    case 'enum':
      if (field.required && (!value || value.trim() === '')) {
        return false;
      }
      
      if (value && !field.options.some(option => option.value === value)) {
        return false;
      }
      
      return true;
      
    case 'label':
      return true; // Label fields are always valid
      
    default:
      return true;
  }
};

// Get default value for a field type
export const getDefaultValueForFieldType = (type: FieldType): any => {
  switch (type) {
    case 'text':
      return '';
    case 'number':
      return null;
    case 'boolean':
      return false;
    case 'enum':
      return '';
    case 'label':
      return '';
    default:
      return null;
  }
};

// Create a new field with default values
export const createDefaultField = (type: FieldType, name: string): Omit<Field, 'id'> => {
  const baseField = {
    type,
    name,
  };
  
  switch (type) {
    case 'label':
      return {
        ...baseField,
        type: 'label',
        labelStyle: 'h2',
        value: 'Section Title',
      };
      
    case 'text':
      return {
        ...baseField,
        type: 'text',
        placeholder: 'Enter text',
        required: false,
      };
      
    case 'number':
      return {
        ...baseField,
        type: 'number',
        placeholder: 'Enter number',
        required: false,
      };
      
    case 'boolean':
      return {
        ...baseField,
        type: 'boolean',
        label: 'Check this option',
      };
      
    case 'enum':
      return {
        ...baseField,
        type: 'enum',
        options: [
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ],
        placeholder: 'Select an option',
        required: false,
      };
      
    default:
      return baseField as any;
  }
};
