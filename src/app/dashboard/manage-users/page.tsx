
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldBan,
  RefreshCw,
} from "lucide-react";

type AdminUser = {
  _id: string;
  name?: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  image?: string;
  isBlocked?: boolean;
  createdAt?: string;
  subscriptionPlan?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        role,
        status,
        page: "1",
        limit: "50",
      });

      const response = await fetch(
        `http://localhost:5001/api/admin/users?${params.toString()}`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load users");
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [search, role, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const toggleBlock = async (user: AdminUser) => {
    const nextBlocked = !user.isBlocked;
    const action = nextBlocked ? "block" : "unblock";

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      setUpdatingId(user._id);
      setError("");

      const response = await fetch(
        `http://localhost:5001/api/admin/users/${user._id}/block`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBlocked: nextBlocked }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Could not ${action} user`);
      }

      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#ad8652]">
          Administration
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-[#354137]">
          Manage Users
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          View, search, and manage WedPlan customer and vendor accounts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e9e3d9] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#f5f0e8] p-3 text-[#ad8652]">
              <Users size={21} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Users displayed</p>
              <p className="text-2xl font-semibold text-[#354137]">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e9e3d9] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <ShieldBan size={21} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Blocked users displayed</p>
              <p className="text-2xl font-semibold text-[#354137]">
                {users.filter((user) => user.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[#e9e3d9] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#ad8652]"
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#ad8652]"
          >
            <option value="all">All roles</option>
            <option value="customer">Customers</option>
            <option value="vendor">Vendors</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#ad8652]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-[#354137]">
            User Accounts
          </h2>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5f0e8] font-semibold text-[#80613d]">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#354137]">
                      {user.name || "Unnamed user"}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs capitalize text-gray-400">
                      {user.role} · {user.subscriptionPlan || "Free"} plan
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isBlocked
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>

                  {user.role !== "admin" && (
                    <button
                      disabled={updatingId === user._id}
                      onClick={() => toggleBlock(user)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                        user.isBlocked
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {user.isBlocked ? (
                        <ShieldCheck size={15} />
                      ) : (
                        <ShieldBan size={15} />
                      )}
                      {updatingId === user._id
                        ? "Updating..."
                        : user.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
