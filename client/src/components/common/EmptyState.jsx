const EmptyState = ({ title, message }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
    <p className="text-lg font-semibold text-slate-800">{title}</p>
    {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
  </div>
);

export default EmptyState;

