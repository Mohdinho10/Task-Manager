function TaskStatusTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="my-2">
      <div className="flex flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.label)}
            className={`relative px-3 py-2 text-sm font-medium md:px-4 ${
              activeTab === tab.label
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            } cursor-pointer`}
          >
            <div className="flex items-center">
              <span className="text-xs">{tab.display}</span>
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.label
                    ? "bg-primary text-white"
                    : "bg-gray-200/70 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </div>
            {activeTab === tab.label && (
              <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskStatusTabs;
