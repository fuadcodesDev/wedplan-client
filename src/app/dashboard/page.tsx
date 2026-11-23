
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  UserRound,
  Store,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in?redirect=/dashboard");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </main>
    );
  }

  const user = session.user as typeof session.user & {
    role?: string;
    subscriptionPlan?: string;
  };

  const role = user.role || "customer";

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
      description: "Manage the WedPlan platform.",
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

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
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
          <h1 className="mt-2 text-3xl font-semibold text-[#303B32]">
            {currentDashboard.title}
          </h1>

          <p className="mt-2 text-gray-500">
            {currentDashboard.description}
          </p>
        </div>

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
                <p className="text-sm text-gray-500">
                  {user.name}
                </p>
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

              <p className="text-sm text-gray-500">
                Email: {user.email}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex flex-col justify-between rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="rounded-xl bg-[#F2EEE6] p-3 text-[#A47D52] w-fit">
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

        <section className="mt-8 rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#303B32]">
            Dashboard Features
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentDashboard.sections.map((section) => (
              <div
                key={section}
                className="rounded-xl bg-[#FAF9F6] p-5"
              >
                <LayoutDashboard
                  size={21}
                  className="text-[#A47D52]"
                />
                <p className="mt-3 text-sm font-medium text-[#303B32]">
                  {section}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
