function ErrorMessage({ message, onRetry, card = false }) {
  return (
    <div
      role="alert"
      className={
        card
          ? 'flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-center shadow-sm'
          : 'flex flex-col items-center gap-3 py-12 text-center'
      }
    >
      {card && <h3 className="font-semibold text-red-600">Something went wrong</h3>}
      <p className={card ? 'text-slate-500' : 'text-red-600'}>{message}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
