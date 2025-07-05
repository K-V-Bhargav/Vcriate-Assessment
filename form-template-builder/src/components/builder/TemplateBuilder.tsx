import { useState, useEffect } from 'react';
import useTemplateStore from '../../store/useTemplateStore';
import TemplateList from './TemplateList';
import TemplateEditor from './TemplateEditor';
import { Template } from '../../types/template';

interface TemplateBuilderProps {
  onSelectTemplate: (template: Template | null) => void;
}

const TemplateBuilder = ({ onSelectTemplate }: TemplateBuilderProps) => {
  const { templates, activeTemplateId, setActiveTemplate, createTemplate } = useTemplateStore();
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  
  const activeTemplate = templates.find(template => template.id === activeTemplateId) || null;
  
  useEffect(() => {
    onSelectTemplate(activeTemplate);
  }, [activeTemplate, onSelectTemplate]);
  
  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    try {
      createTemplate(newTemplateName);
      setNewTemplateName('');
      setShowNewTemplateForm(false);
    } catch (error) {
      alert((error as Error).message);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Template Builder</h2>
        {templates.length < 5 && !showNewTemplateForm && (
          <button
            onClick={() => setShowNewTemplateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create New Template
          </button>
        )}
      </div>
      
      {showNewTemplateForm && (
        <div className="bg-white shadow sm:rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Template</h3>
          <div className="mt-4">
            <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="template-name"
                id="template-name"
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 p-2 border"
                placeholder="Enter template name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewTemplateForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateTemplate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </button>
          </div>
        </div>
      )}
      
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TemplateList 
              templates={templates} 
              activeTemplateId={activeTemplateId} 
              onSelectTemplate={setActiveTemplate} 
            />
          </div>
          <div className="lg:col-span-2">
            {activeTemplate && <TemplateEditor template={activeTemplate} />}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow sm:rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
          <p className="text-gray-500">Create your first template to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;
