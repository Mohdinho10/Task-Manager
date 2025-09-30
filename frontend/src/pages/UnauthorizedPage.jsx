// src/pages/UnauthorizedPage.jsx
function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-lg text-gray-700">
        You do not have permission to view this page.
      </p>
    </div>
  );
}

export default UnauthorizedPage;
