function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}

export default SuccessMessage;
