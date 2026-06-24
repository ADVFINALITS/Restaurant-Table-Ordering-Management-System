import Link from "next/link";
import { ChefHat, QrCode, ScanLine, UtensilsCrossed } from "lucide-react";
import Ticket from "@/components/Ticket";

const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.NEXT_PUBLIC_API_BASE_URL;

const ROLES = [
  {
    href: "/admin/tables",
    icon: QrCode,
    title: "Set up tables",
    description: "Generate and print one QR code per table.",
  },
  {
    href: "/kitchen",
    icon: ChefHat,
    title: "Kitchen",
    description: "See every order the moment it's placed, by table.",
  },
  {
    href: "/waiter",
    icon: UtensilsCrossed,
    title: "Waiter",
    description: "Know exactly which tickets are ready to go out.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen px-5 py-10 max-w-3xl mx-auto">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300 mb-2">
          Table ordering system
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-ink-800 leading-tight">
          Scan the table.
          <br />
          Fire the ticket.
        </h1>
        <p className="text-ink-500 mt-3 max-w-md">
          One QR code per table sends every order straight to the kitchen, the
          waiter, and the bill — in that order.
        </p>
      </header>

      {isDemoMode && (
        <Ticket className="mb-8 text-sm text-ink-600">
          <span className="font-display font-extrabold">Demo mode is on.</span>{" "}
          Orders are stored in this browser only, so you can test the whole flow —
          order, kitchen, waiter, bill, pay — without a backend running. Open the
          kitchen and waiter pages in separate tabs to watch it update live. Connect
          your Ruby API by setting{" "}
          <code className="font-mono text-xs bg-ink-50 px-1 rounded">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          in <code className="font-mono text-xs bg-ink-50 px-1 rounded">.env.local</code>.
        </Ticket>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <Link key={role.href} href={role.href}>
              <Ticket className="h-full hover:-translate-y-0.5 transition-transform">
                <Icon className="text-flame mb-3" size={24} />
                <p className="font-display font-extrabold text-ink-800">
                  {role.title}
                </p>
                <p className="text-sm text-ink-400 mt-1">{role.description}</p>
              </Ticket>
            </Link>
          );
        })}
      </div>

      <Ticket className="flex items-center gap-4">
        <ScanLine className="text-ink-300" size={28} />
        <div className="flex-1">
          <p className="font-display font-extrabold text-ink-800">
            Diners don&apos;t use this page
          </p>
          <p className="text-sm text-ink-400">
            They scan the QR code on their table, which opens the menu already set
            to that table number.
          </p>
        </div>
        <Link
          href="/table/1"
          className="shrink-0 font-display font-extrabold text-sm text-flame-dark border-2 border-flame rounded-full px-4 py-2"
        >
          Try table 1
        </Link>
      </Ticket>
    </div>
  );
}
