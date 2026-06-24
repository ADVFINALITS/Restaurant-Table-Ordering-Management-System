export default function Ticket({ children, className = "", torn = false }) {
  return (
    <div
      className={`ticket ticket-perf-top ${torn ? "ticket-torn" : ""} p-5 ${className}`}
    >
      {children}
    </div>
  );
}
