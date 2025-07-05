import { useState } from 'react';
import useTemplateStore from '../../store/useTemplateStore';
import { Template, Section } from '../../types/template';
import SectionEditor from './SectionEditor';

interface TemplateEditorProps {
  template: Template;
}

const TemplateEditor = ({ template }: TemplateEditorProps) => {
  const { updateTemplate, addSection } = useTemplateStore();
  const [templateName, setTemplateName] = useState(template.name);
  const [isEditing, setIsEditing] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  const handleSaveTemplateName = () => {
    if (templateName.trim()) {
      updateTemplate({
        ...template,
        name: templateName,
      });
      setIsEditing(false);
    }
  };

  const handleAddSection = () => {
    if (newSectionTitle.trim()) {
      addSection(template.id, newSectionTitle);
      setNewSectionTitle('');
      setShowAddSection(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-lg border-gray-300 rounded-md"
                placeholder="Template name"
              />
              <button
                onClick={handleSaveTemplateName}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTemplateName(template.name);
                  setIsEditing(false);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{template.name}</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Name
              </button>
            </>
          )}
        </div>

        <div className="space-y-6">
          {template.sections.map((section) => (
            <SectionEditor
              key={section.id}
              templateId={template.id}
              section={section}
            />
          ))}

          {showAddSection ? (
            <div className="border border-gray-300 rounded-md p-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">Add New Section</h4>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Section title"
                />
                <button
                  onClick={handleAddSection}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setNewSectionTitle('');
                    setShowAddSection(false);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddSection(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Section
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
