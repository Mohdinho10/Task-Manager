import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

function SelectDropdown({ onChange, value, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  const selectHandler = (optionValue) => {
    onChange(optionValue); // Send back only the selected value like "medium"
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-2 flex w-full items-center justify-between rounded-md border border-slate-100 bg-white px-2.5 py-3 text-sm text-black outline-none"
      >
        <span>{selectedLabel}</span>
        <LuChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-100 bg-white shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => selectHandler(option.value)}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                value === option.value ? "bg-gray-100 font-medium" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectDropdown;
