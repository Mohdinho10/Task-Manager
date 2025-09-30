import { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

function TodoListInput({ todoList, setTodoList }) {
  const [option, setOption] = useState("");

  const addOptionHandler = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const deleteOptionHandler = (index) => {
    const updateArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updateArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={index}
          className="mt-3 mb-2 flex justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <p className="text-xs text-black">
            <span className="mr-2 text-xs font-semibold text-gray-400">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>
          <button
            className="cursor-pointer"
            onClick={() => deleteOptionHandler(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      <div className="mt-4 flex items-center gap-5">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full rounded-md border border-gray-500 bg-white px-3 py-2 text-[13px] text-black outline-none"
        />
        <button className="card-btn text-nowrap" onClick={addOptionHandler}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
}

export default TodoListInput;
