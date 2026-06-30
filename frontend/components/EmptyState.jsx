export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-3">
      {Icon && <Icon size={32} className="text-ink-200" />}
      <p className="font-display font-extrabold text-lg text-ink-400">{title}</p>
      {message && <p className="text-sm text-ink-300 max-w-xs">{message}</p>}
    </div>
  );
}
