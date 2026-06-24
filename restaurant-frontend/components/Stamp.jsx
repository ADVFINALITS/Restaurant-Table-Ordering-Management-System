import { STATUS_COLOR, STATUS_LABEL } from "@/lib/orderStatus";

const COLOR_CLASSES = {
  ink: "text-ink-800 border-ink-800",
  flame: "text-flame-dark border-flame-dark",
  sage: "text-sage-dark border-sage-dark",
  brass: "text-brass-dark border-brass-dark",
};

export default function Stamp({ status, className = "" }) {
  const color = STATUS_COLOR[status] || "ink";
  return (
    <span className={`stamp ${COLOR_CLASSES[color]} ${className}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}
