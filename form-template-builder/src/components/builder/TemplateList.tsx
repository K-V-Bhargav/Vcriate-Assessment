import { useState } from 'react';
import useTemplateStore from '../../store/useTemplateStore';
import { Template } from '../../types/template';

interface TemplateListProps {
  templates: Template[];
  activeTemplateId: string | null;
  onSelectTemplate: (id: string | null) => void;
}

const TemplateList = ({ templates, activeTemplateId, onSelectTemplate }: TemplateListProps) => {
  const { deleteTemplate } = useTemplateStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = (id: string) => {
    deleteTemplate(id);
    setConfirmDelete(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {templates.map((template) => (
          <li key={template.id}>
            <div className={`px-4 py-4 sm:px-6 ${template.id === activeTemplateId ? 'bg-indigo-50' : ''}`}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelectTemplate(template.id)}
                  className="text-left flex-1 focus:outline-none"
                >
                  <p className="text-sm font-medium text-indigo-600 truncate">{template.name}</p>
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="truncate">
                      {template.sections.length} section{template.sections.length !== 1 ? 's' : ''}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center text-xs text-gray-500">
                    <span>Updated {formatDate(template.updatedAt)}</span>
                  </p>
                </button>
                <div className="ml-2 flex-shrink-0 flex">
                  {confirmDelete === template.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(template.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteClick(template.id)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplateList;
