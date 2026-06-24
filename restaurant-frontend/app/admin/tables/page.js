"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, QrCode } from "lucide-react";
import Ticket from "@/components/Ticket";

const STORAGE_KEY = "rto_admin_table_count";

export default function AdminTablesPage() {
  const [tableCount, setTableCount] = useState(12);
  const [siteUrl, setSiteUrl] = useState(process.env.NEXT_PUBLIC_SITE_URL || "");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setTableCount(Number(saved));
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(tableCount));
  }, [tableCount]);

  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-paper">
      <header className="px-6 pt-8 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 print:hidden">
        <div className="flex items-center gap-3">
          <QrCode className="text-flame" size={28} />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
              Setup
            </p>
            <h1 className="font-display text-2xl font-black text-ink-800">
              Table QR codes
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-600">
            Tables
            <input
              type="number"
              min={1}
              max={200}
              value={tableCount}
              onChange={(event) => setTableCount(Number(event.target.value) || 1)}
              className="w-20 bg-ink-50 rounded-lg px-3 py-2 text-center font-mono"
            />
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-ink-800 text-paper font-display font-extrabold text-sm rounded-xl px-4 py-2"
          >
            <Printer size={16} />
            Print all
          </button>
        </div>
      </header>

      <p className="px-6 pt-5 text-sm text-ink-400 max-w-2xl print:hidden">
        Print one of these per table and stick it where a guest can scan it from
        their seat. Each code opens the menu already set to that table number, so
        every order that comes in is routed to the right place automatically.
      </p>

      <main className="px-6 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-2">
        {tables.map((number) => {
          const url = `${siteUrl}/table/${number}`;
          return (
            <Ticket key={number} className="flex flex-col items-center text-center gap-3 break-inside-avoid">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-300">
                Table
              </p>
              <p className="font-display font-black text-3xl">{number}</p>
              {siteUrl && (
                <div className="bg-white p-2 rounded-lg">
                  <QRCodeSVG value={url} size={140} fgColor="#1C1916" />
                </div>
              )}
              <p className="font-mono text-[10px] text-ink-300 break-all">{url}</p>
            </Ticket>
          );
        })}
      </main>
    </div>
  );
}
