import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template, FormData, Section, Field } from '../types/template';
import { v4 as uuidv4 } from 'uuid';

interface TemplateState {
  templates: Template[];
  formData: FormData[];
  activeTemplateId: string | null;
  
  // Template actions
  createTemplate: (name: string) => Template;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (id: string | null) => void;
  
  // Section actions
  addSection: (templateId: string, title: string) => void;
  updateSection: (templateId: string, section: Section) => void;
  deleteSection: (templateId: string, sectionId: string) => void;
  
  // Field actions
  addField: (templateId: string, sectionId: string, field: Omit<Field, 'id'>) => void;
  updateField: (templateId: string, sectionId: string, field: Field) => void;
  deleteField: (templateId: string, sectionId: string, fieldId: string) => void;
  reorderFields: (templateId: string, sectionId: string, fields: Field[]) => void;
  
  // Form data actions
  submitFormData: (data: Omit<FormData, 'submittedAt'>) => void;
  getFormDataByTemplateId: (templateId: string) => FormData[];
}

// Helper function to find template by ID
const findTemplateIndex = (templates: Template[], id: string) => 
  templates.findIndex(template => template.id === id);

const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      formData: [],
      activeTemplateId: null,
      
      // Template actions
      createTemplate: (name: string) => {
        const { templates } = get();
        
        // Limit to 5 templates
        if (templates.length >= 5) {
          throw new Error('Maximum of 5 templates allowed');
        }
        
        const newTemplate: Template = {
          id: uuidv4(),
          name,
          sections: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set(state => ({
          templates: [...state.templates, newTemplate],
          activeTemplateId: newTemplate.id,
        }));
        
        return newTemplate;
      },
      
      updateTemplate: (template: Template) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, template.id);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          updatedTemplates[templateIndex] = {
            ...template,
            updatedAt: Date.now(),
          };
          
          return { templates: updatedTemplates };
        });
      },
      
      deleteTemplate: (id: string) => {
        set(state => ({
          templates: state.templates.filter(template => template.id !== id),
          activeTemplateId: state.activeTemplateId === id ? null : state.activeTemplateId,
        }));
      },
      
      setActiveTemplate: (id: string | null) => {
        set({ activeTemplateId: id });
      },
      
      // Section actions
      addSection: (templateId: string, title: string) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const newSection: Section = {
            id: uuidv4(),
            title,
            fields: [],
          };
          
          updatedTemplates[templateIndex] = {
            ...updatedTemplates[templateIndex],
            sections: [...updatedTemplates[templateIndex].sections, newSection],
            updatedAt: Date.now(),
          };
          
          return { templates: updatedTemplates };
        });
      },
      
      updateSection: (templateId: string, section: Section) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const sectionIndex = updatedTemplates[templateIndex].sections.findIndex(s => s.id === section.id);
          
          if (sectionIndex === -1) return state;
          
          updatedTemplates[templateIndex].sections[sectionIndex] = section;
          updatedTemplates[templateIndex].updatedAt = Date.now();
          
          return { templates: updatedTemplates };
        });
      },
      
      deleteSection: (templateId: string, sectionId: string) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          updatedTemplates[templateIndex] = {
            ...updatedTemplates[templateIndex],
            sections: updatedTemplates[templateIndex].sections.filter(section => section.id !== sectionId),
            updatedAt: Date.now(),
          };
          
          return { templates: updatedTemplates };
        });
      },
      
      // Field actions
      addField: (templateId: string, sectionId: string, field: Omit<Field, 'id'>) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const sectionIndex = updatedTemplates[templateIndex].sections.findIndex(s => s.id === sectionId);
          
          if (sectionIndex === -1) return state;
          
          const newField = { ...field, id: uuidv4() } as Field;
          
          updatedTemplates[templateIndex].sections[sectionIndex].fields.push(newField);
          updatedTemplates[templateIndex].updatedAt = Date.now();
          
          return { templates: updatedTemplates };
        });
      },
      
      updateField: (templateId: string, sectionId: string, field: Field) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const sectionIndex = updatedTemplates[templateIndex].sections.findIndex(s => s.id === sectionId);
          
          if (sectionIndex === -1) return state;
          
          const fieldIndex = updatedTemplates[templateIndex].sections[sectionIndex].fields.findIndex(f => f.id === field.id);
          
          if (fieldIndex === -1) return state;
          
          updatedTemplates[templateIndex].sections[sectionIndex].fields[fieldIndex] = field;
          updatedTemplates[templateIndex].updatedAt = Date.now();
          
          return { templates: updatedTemplates };
        });
      },
      
      deleteField: (templateId: string, sectionId: string, fieldId: string) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const sectionIndex = updatedTemplates[templateIndex].sections.findIndex(s => s.id === sectionId);
          
          if (sectionIndex === -1) return state;
          
          updatedTemplates[templateIndex].sections[sectionIndex].fields = 
            updatedTemplates[templateIndex].sections[sectionIndex].fields.filter(field => field.id !== fieldId);
          updatedTemplates[templateIndex].updatedAt = Date.now();
          
          return { templates: updatedTemplates };
        });
      },
      
      reorderFields: (templateId: string, sectionId: string, fields: Field[]) => {
        set(state => {
          const templateIndex = findTemplateIndex(state.templates, templateId);
          if (templateIndex === -1) return state;
          
          const updatedTemplates = [...state.templates];
          const sectionIndex = updatedTemplates[templateIndex].sections.findIndex(s => s.id === sectionId);
          
          if (sectionIndex === -1) return state;
          
          updatedTemplates[templateIndex].sections[sectionIndex].fields = fields;
          updatedTemplates[templateIndex].updatedAt = Date.now();
          
          return { templates: updatedTemplates };
        });
      },
      
      // Form data actions
      submitFormData: (data: Omit<FormData, 'submittedAt'>) => {
        set(state => ({
          formData: [...state.formData, { ...data, submittedAt: Date.now() }],
        }));
      },
      
      getFormDataByTemplateId: (templateId: string) => {
        return get().formData.filter(data => data.templateId === templateId);
      },
    }),
    {
      name: 'template-storage',
    }
  )
);

export default useTemplateStore;
