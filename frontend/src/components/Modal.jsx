function Modal({ children, isOpen, closeHandler, title }) {
  if (!isOpen) return null;

  // Lock background scroll
  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-xs">
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              type="button"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              onClick={closeHandler}
            >
              ✕
            </button>
          </div>

          {/* Modal Body (scrollable if long) */}
          <div className="max-h-[75vh] overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
