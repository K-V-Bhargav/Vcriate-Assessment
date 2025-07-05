import { useState } from "react";
import TemplateBuilder from "./components/builder/TemplateBuilder";
import FormRenderer from "./components/form/FormRenderer";
import { Template } from "./types/template";

const App = () => {
  const [activeTab, setActiveTab] = useState<"builder" | "form">("builder");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Form Template Builder
                </h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <button
                  onClick={() => setActiveTab("builder")}
                  className={`${
                    activeTab === "builder"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Template Builder
                </button>
                <button
                  onClick={() => setActiveTab("form")}
                  className={`${
                    activeTab === "form"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Form
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "builder" ? (
          <TemplateBuilder onSelectTemplate={setSelectedTemplate} />
        ) : (
          <FormRenderer selectedTemplate={selectedTemplate} />
        )}
      </main>
    </div>
  );
};

export default App;
