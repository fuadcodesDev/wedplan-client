
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ReceiptText,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

type Transaction = {
  _id: string;
  transactionId?: string;
  stripeSessionId?: string;
  userEmail?: string;
  customerEmail?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
};

const money = (amount?: number, currency = "BDT") => {
  if (typeof amount !== "number") return "—";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function AdminTransactionsPage() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        status,
        page: "1",
        limit: "50",
      });

      const response = await fetch(
        `http://localhost:5001/api/admin/transactions?${params}`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load transactions");
      }

      setItems(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(timer);
  }, [fetchTransactions]);

  const successful = items.filter(
    (item) => item.status?.toLowerCase() === "completed" ||
      item.status?.toLowerCase() === "success" ||
      item.status?.toLowerCase() === "succeeded"
  ).length;

  const pending = items.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const failed = items.filter(
    (item) => item.status?.toLowerCase() === "failed"
  ).length;

  const statusStyle = (value?: string) => {
    const normalized = value?.toLowerCase();

    if (["completed", "success", "succeeded"].includes(normalized || "")) {
      return "bg-green-50 text-green-700";
    }

    if (normalized === "pending") {
      return "bg-amber-50 text-amber-700";
    }

    if (["failed", "cancelled", "canceled"].includes(normalized || "")) {
      return "bg-red-50 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ad8652]">
          Administration
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#354137]">
          Transactions
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Monitor payment records and subscription transactions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: "Transactions displayed",
            value: items.length,
            icon: ReceiptText,
            color: "text-[#ad8652] bg-[#f5f0e8]",
          },
          {
            label: "Successful",
            value: successful,
            icon: CheckCircle2,
            color: "text-green-700 bg-green-50",
          },
          {
            label: "Pending",
            value: pending,
            icon: Clock,
            color: "text-amber-700 bg-amber-50",
          },
        ].map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#e9e3d9] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={21} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-[#354137]">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-[#e9e3d9] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email or transaction ID..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#ad8652]"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#ad8652]"
          >
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-[#354137]">
            Payment History
          </h2>

          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading transactions...
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="mx-auto mb-3 text-gray-300" size={32} />
            <p className="font-medium text-gray-600">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Payment records will appear here when available.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {items.map((item) => {
              const email = item.userEmail || item.customerEmail || "Unknown";

              return (
                <div
                  key={item._id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#354137]">
                      {email}
                    </p>
                    <p className="mt-1 break-all text-xs text-gray-400">
                      {item.transactionId ||
                        item.stripeSessionId ||
                        item._id}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-[#354137]">
                      {money(item.amount, item.currency)}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle(item.status)}`}
                    >
                      {item.status || "Unknown"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {failed > 0 && (
        <p className="text-sm text-gray-500">
          {failed} failed transaction(s) currently displayed.
        </p>
      )}
    </main>
  );
}
