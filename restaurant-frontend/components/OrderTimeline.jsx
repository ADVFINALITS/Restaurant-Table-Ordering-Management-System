import { ORDER_STATUS_SEQUENCE, STATUS_LABEL, statusIndex } from "@/lib/orderStatus";
import { formatClock } from "@/lib/format";

export default function OrderTimeline({ order }) {
  const currentIndex = statusIndex(order.status);

  return (
    <ol className="space-y-0">
      {ORDER_STATUS_SEQUENCE.map((status, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const timestamp = order.timestamps?.[status];
        const isLast = index === ORDER_STATUS_SEQUENCE.length - 1;

        return (
          <li key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                  reached
                    ? "bg-flame border-flame"
                    : "bg-transparent border-ink-200"
                } ${isCurrent ? "ring-4 ring-flame-light" : ""}`}
              />
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[1.75rem] ${
                    reached ? "bg-flame" : "bg-ink-100"
                  }`}
                />
              )}
            </div>
            <div className="pb-7 -mt-0.5">
              <p
                className={`font-display font-extrabold text-sm ${
                  reached ? "text-ink-800" : "text-ink-300"
                }`}
              >
                {STATUS_LABEL[status]}
              </p>
              <p className="font-mono text-xs text-ink-300">
                {timestamp ? formatClock(timestamp) : "—"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
