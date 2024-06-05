import { useState } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabContainerProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  children: React.ReactNode;
}

export default function TabContainer({
  tabs,
  activeTab,
  setActiveTab,
  children,
}: TabContainerProps) {
  return (
    <div>
      <div className="border-b bordey-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
