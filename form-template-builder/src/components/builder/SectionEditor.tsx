import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useTemplateStore from '../../store/useTemplateStore';
import { Section, Field, FieldType } from '../../types/template';
import FieldEditor from './FieldEditor';
import SortableField from './SortableField';
import { createDefaultField } from '../../utils/fieldUtils';

interface SectionEditorProps {
  templateId: string;
  section: Section;
}

const SectionEditor = ({ templateId, section }: SectionEditorProps) => {
  const { updateSection, deleteSection, addField, reorderFields } = useTemplateStore();
  const [sectionTitle, setSectionTitle] = useState(section.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldName, setNewFieldName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSaveSectionTitle = () => {
    if (sectionTitle.trim()) {
      updateSection(templateId, {
        ...section,
        title: sectionTitle,
      });
      setIsEditingTitle(false);
    }
  };

  const handleDeleteSection = () => {
    if (confirm('Are you sure you want to delete this section?')) {
      deleteSection(templateId, section.id);
    }
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const newField = createDefaultField(newFieldType, newFieldName);
      addField(templateId, section.id, newField);
      setNewFieldName('');
      setShowAddField(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = section.fields.findIndex(field => field.id === active.id);
      const newIndex = section.fields.findIndex(field => field.id === over.id);
      
      const newFields = arrayMove(section.fields, oldIndex, newIndex);
      reorderFields(templateId, section.id, newFields);
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        {isEditingTitle ? (
          <div className="flex items-center space-x-2 w-full">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Section title"
            />
            <button
              onClick={handleSaveSectionTitle}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              onClick={() => {
                setSectionTitle(section.title);
                setIsEditingTitle(false);
              }}
              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h4 className="text-md font-medium text-gray-900">{section.title}</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditingTitle(true)}
                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteSection}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {section.fields.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={section.fields.map(field => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {section.fields.map((field) => (
                <SortableField 
                  key={field.id} 
                  id={field.id}
                >
                  <FieldEditor
                    templateId={templateId}
                    sectionId={section.id}
                    field={field}
                  />
                </SortableField>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No fields added yet. Add a field to get started.
          </div>
        )}
      </div>

      {showAddField ? (
        <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Add New Field</h5>
          <div className="space-y-3">
            <div>
              <label htmlFor="field-type" className="block text-xs font-medium text-gray-700">
                Field Type
              </label>
              <select
                id="field-type"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="label">Label</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="enum">Dropdown</option>
              </select>
            </div>
            <div>
              <label htmlFor="field-name" className="block text-xs font-medium text-gray-700">
                Field Name
              </label>
              <input
                type="text"
                id="field-name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter field name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setNewFieldName('');
                  setShowAddField(false);
                }}
                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddField}
                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddField(true)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Field
        </button>
      )}
    </div>
  );
};

export default SectionEditor;
