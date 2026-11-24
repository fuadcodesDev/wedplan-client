
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  UserRound,
  Store,
  CalendarDays,
  ShieldCheck,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  PackageCheck,
  CreditCard,
  ArrowUpRight,
  Settings,
  Search,
} from "lucide-react";

type Booking = {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
};

type DashboardStats = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
};

type SessionUser = {
  name: string;
  email: string;
  role?: string;
  subscriptionPlan?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const user = session?.user as SessionUser | undefined;
  const role = user?.role || "customer";

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in?redirect=/dashboard");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session || role !== "customer") return;

    const fetchBookings = async () => {
      setBookingsLoading(true);
      setBookingError("");

      try {
        const response = await fetch(
          "http://localhost:5001/api/bookings/customer/mine",
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load bookings");
        }

        const bookings: Booking[] = result.data || [];

        setStats({
          total: bookings.length,
          pending: bookings.filter((booking) => booking.status === "pending").length,
          accepted: bookings.filter((booking) => booking.status === "accepted").length,
          rejected: bookings.filter((booking) => booking.status === "rejected").length,
        });
      } catch (error) {
        setBookingError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [session, role]);

  if (isPending || !session || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </main>
    );
  }

  const dashboardInfo = {
    customer: {
      title: "Customer Dashboard",
      description: "Manage your wedding plans and service bookings.",
      icon: CalendarDays,
      sections: [
        "Browse wedding services",
        "Manage your bookings",
        "Track booking requests",
      ],
    },
    vendor: {
      title: "Vendor Dashboard",
      description: "Manage your wedding services and customer requests.",
      icon: Store,
      sections: [
        "Manage your services",
        "Review booking requests",
        "Manage your subscription",
      ],
    },
    admin: {
      title: "Admin Dashboard",
      description: "Oversee users, wedding services, and platform activity.",
      icon: ShieldCheck,
      sections: [
        "Manage users",
        "Review wedding services",
        "Monitor transactions",
      ],
    },
  };

  const currentDashboard =
    dashboardInfo[role as keyof typeof dashboardInfo];

  if (!currentDashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            Account role not recognized
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please contact the WedPlan administrator.
          </p>
        </div>
      </main>
    );
  }

  const DashboardIcon = currentDashboard.icon;

  const customerStats = [
    { title: "Total Bookings", value: stats.total, icon: ClipboardList },
    { title: "Pending", value: stats.pending, icon: Clock },
    { title: "Accepted", value: stats.accepted, icon: CheckCircle },
    { title: "Rejected", value: stats.rejected, icon: XCircle },
  ];

  const adminStats = [
    {
      title: "Total Users",
      description: "Registered platform accounts",
      icon: Users,
    },
    {
      title: "Total Vendors",
      description: "Wedding service providers",
      icon: Store,
    },
    {
      title: "Total Customers",
      description: "Customers using WedPlan",
      icon: UserRound,
    },
    {
      title: "Pending Services",
      description: "Services awaiting review",
      icon: Clock,
    },
    {
      title: "Total Services",
      description: "Services submitted to the platform",
      icon: PackageCheck,
    },
    {
      title: "Transactions",
      description: "Platform payment records",
      icon: CreditCard,
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EAE7DF] bg-white px-5 py-2.5 text-sm font-medium text-[#526B57] transition hover:bg-[#EEECE5]"
          >
            ← Back to Home
          </Link>

          <p className="text-sm font-medium text-[#A47D52]">
            Welcome to WedPlan
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#303B32] sm:text-4xl">
            {currentDashboard.title}
          </h1>

          <p className="mt-2 text-gray-500">
            {currentDashboard.description}
          </p>
        </div>

        {/* Account information and profile */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#F2EEE6] p-3 text-[#A47D52]">
                <DashboardIcon size={25} />
              </div>

              <div>
                <h2 className="font-semibold text-[#303B32]">
                  Your Account
                </h2>
                <p className="text-sm text-gray-500">{user.name}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500">
                Your account type:{" "}
                <span className="font-semibold capitalize text-[#526B57]">
                  {role}
                </span>
              </p>

              {role === "vendor" && (
                <p className="text-sm text-gray-500">
                  Subscription:{" "}
                  <span className="font-semibold capitalize text-[#526B57]">
                    {user.subscriptionPlan || "free"}
                  </span>
                </p>
              )}

              <p className="text-sm text-gray-500">Email: {user.email}</p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex flex-col justify-between rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="w-fit rounded-xl bg-[#F2EEE6] p-3 text-[#A47D52]">
              <UserRound size={25} />
            </div>

            <div className="mt-5">
              <h2 className="font-semibold text-[#303B32]">
                Profile Settings
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                View and update your personal information.
              </p>
            </div>
          </Link>
        </div>

        {/* Customer dashboard */}
        {role === "customer" && (
          <section className="mt-8">
            <h2 className="mb-5 text-xl font-semibold text-[#303B32]">
              Booking Overview
            </h2>

            {bookingError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {bookingError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {customerStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <div className="rounded-xl bg-[#F2EEE6] p-2 text-[#A47D52]">
                        <Icon size={21} />
                      </div>
                    </div>

                    <p className="mt-4 text-3xl font-semibold text-[#303B32]">
                      {bookingsLoading ? "..." : item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-[#303B32]">
                Manage Your Bookings
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View your booking details, track requests, and cancel pending bookings.
              </p>

              <Link
                href="/dashboard/bookings"
                className="mt-5 inline-flex rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#405345]"
              >
                View My Bookings
              </Link>
            </div>
          </section>
        )}

        {/* Vendor dashboard */}
        {role === "vendor" && (
          <section className="mt-8 rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#303B32]">
              Manage Your Services
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add new wedding services or manage the services you already offer.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard/services"
                className="inline-flex rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#405345]"
              >
                My Services
              </Link>

              <Link
                href="/dashboard/services/add"
                className="inline-flex rounded-full border border-[#A47D52] px-6 py-3 text-sm font-medium text-[#A47D52] transition hover:bg-[#F2EEE6]"
              >
                + Add Service
              </Link>

              <Link
                href="/dashboard/booking-requests"
                className="inline-flex rounded-full border border-[#A47D52] px-6 py-3 text-sm font-medium text-[#A47D52] transition hover:bg-[#F2EEE6]"
              >
                Booking Requests
              </Link>
            </div>
          </section>
        )}

        {/* Admin dashboard */}
        {role === "admin" && (
          <div className="mt-8 space-y-8">
            {/* Admin welcome panel */}
            <section className="relative overflow-hidden rounded-3xl bg-[#354137] p-7 text-white shadow-sm sm:p-9">
              <div className="relative z-10 max-w-2xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#E5C99F]">
                  <ShieldCheck size={26} />
                </div>

                <p className="text-sm font-medium text-[#E5C99F]">
                  WedPlan Administration
                </p>

                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Welcome back, {user.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
                  Manage your wedding planning platform from one place.
                  Review service submissions, oversee accounts, and monitor
                  platform activity.
                </p>
              </div>

              <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-6 h-44 w-44 rounded-full border border-white/10" />
            </section>

            {/* Admin statistics */}
            <section>
              <div className="mb-5">
                <p className="text-sm font-medium text-[#A47D52]">
                  Platform Summary
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#303B32]">
                  Overview Statistics
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  These statistics will be connected to the admin API next.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {adminStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {item.title}
                          </p>
                          <p className="mt-3 text-3xl font-semibold text-[#303B32]">
                            —
                          </p>
                        </div>

                        <div className="rounded-xl bg-[#F2EEE6] p-3 text-[#A47D52]">
                          <Icon size={22} />
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Admin management areas */}
            <section>
              <div className="mb-5">
                <p className="text-sm font-medium text-[#A47D52]">
                  Administration
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#303B32]">
                  Platform Management
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your main administration workspaces.
                </p>
              </div>

              
<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  <Link
    href="/dashboard/manage-users"
    className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#A47D52]">
      <Users size={23} />
    </div>
    <h3 className="mt-5 font-semibold text-[#303B32]">Manage Users</h3>
    <p className="mt-2 text-sm leading-6 text-gray-500">
      View customer and vendor accounts, search users, and manage account access.
    </p>
    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#A47D52]">
      Open workspace <ArrowUpRight size={15} />
    </div>
  </Link>

  <Link
    href="/dashboard/manage-services"
    className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#A47D52]">
      <PackageCheck size={23} />
    </div>
    <h3 className="mt-5 font-semibold text-[#303B32]">Manage Services</h3>
    <p className="mt-2 text-sm leading-6 text-gray-500">
      Review vendor submissions, approve or reject services, and manage published listings.
    </p>
    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#A47D52]">
      Open workspace <ArrowUpRight size={15} />
    </div>
  </Link>

  <Link
    href="/dashboard/transactions"
    className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2EEE6] text-[#A47D52]">
      <CreditCard size={23} />
    </div>
    <h3 className="mt-5 font-semibold text-[#303B32]">Transactions</h3>
    <p className="mt-2 text-sm leading-6 text-gray-500">
      Review payment records and monitor vendor subscription transactions.
    </p>
    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-[#A47D52]">
      Open workspace <ArrowUpRight size={15} />
    </div>
  </Link>
</div>

            </section>

            {/* Admin account information */}
            <section className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A47D52]">
                    Account Information
                  </p>
                  <h2 className="mt-1 font-semibold text-[#303B32]">
                    Administrator Account
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">{user.email}</p>
                </div>

                <Link
                  href="/dashboard/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EAE7DF] px-5 py-3 text-sm font-medium text-[#526B57] transition hover:bg-[#FAF9F6]"
                >
                  Update Profile
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
