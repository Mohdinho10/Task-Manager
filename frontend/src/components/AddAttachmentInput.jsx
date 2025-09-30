import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

function AddAttachmentInput({ attachments, setAttachments }) {
  const [option, setOption] = useState("");

  // Function to handle adding an option
  const addOptionHandler = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const deleteOptionHandler = (index) => {
    const updateArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updateArr);
  };

  return (
    <div>
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="mt-3 mb-2 flex justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <div className="flex flex-1 items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />
            <p className="text-xs text-black">{attachment} </p>
          </div>
          <button
            className="cursor-pointer"
            onClick={() => deleteOptionHandler(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      <div className="mt-4 flex items-center gap-5">
        <div className="relative w-full">
          <LuPaperclip className="absolute top-1/2 left-3 -translate-y-1/2 text-lg text-gray-400" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm text-black outline-none"
          />
        </div>
        <button className="card-btn text-nowrap" onClick={addOptionHandler}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
}

export default AddAttachmentInput;
