export default function CategoryTabs({ categories, activeId, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border-2 transition-colors ${
              active
                ? "bg-ink-800 border-ink-800 text-paper"
                : "bg-transparent border-ink-200 text-ink-600 hover:border-ink-400"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
