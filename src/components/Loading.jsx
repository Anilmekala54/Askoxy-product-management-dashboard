function Loading({ message = 'Loading...', card = false }) {
  return (
    <div
      aria-busy="true"
      className={
        card
          ? 'flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-12 text-slate-500 shadow-sm'
          : 'flex flex-col items-center gap-3 py-12 text-slate-500'
      }
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;
