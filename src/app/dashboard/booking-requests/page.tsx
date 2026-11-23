
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    _id?: string;
    serviceName?: string;
    category?: string;
    price?: number;
    location?: string;
    images?: string[];
  };
};

type SessionUser = {
  role?: string;
};

export default function BookingRequestsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const user = session?.user as SessionUser | undefined;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/bookings/vendor/requests",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load booking requests");
      }

      setBookings(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in?redirect=/dashboard/booking-requests");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session && user?.role === "vendor") {
      fetchBookings();
    }
  }, [session, user?.role, fetchBookings]);

  const updateBookingStatus = async (
    bookingId: string,
    status: "accepted" | "rejected"
  ) => {
    setUpdatingId(bookingId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5001/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update booking");
      }

      await fetchBookings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-sm text-gray-500">
          Loading booking requests...
        </p>
      </main>
    );
  }

  if (user?.role !== "vendor") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4">
        <div className="rounded-2xl border border-[#EAE7DF] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-[#303B32]">
            Access denied
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Only vendors can view booking requests.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === "rejected"
  ).length;

  const formatDate = (date: string) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusStyle = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "accepted":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex rounded-full border border-[#EAE7DF] bg-white px-5 py-2.5 text-sm font-medium text-[#526B57] transition hover:bg-[#EEECE5]"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-[#A47D52]">
                Vendor Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#303B32]">
                Booking Requests
              </h1>
              <p className="mt-2 text-gray-500">
                Review and manage booking requests from your customers.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EAE7DF] bg-white px-5 py-3 text-sm font-medium text-[#526B57] transition hover:bg-[#F2EEE6] disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="mt-3 text-3xl font-semibold text-amber-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Accepted Bookings</p>
            <p className="mt-3 text-3xl font-semibold text-green-700">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Rejected Bookings</p>
            <p className="mt-3 text-3xl font-semibold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "All Requests", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
            { label: "Cancelled", value: "cancelled" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                filter === item.value
                  ? "bg-[#526B57] text-white"
                  : "border border-[#EAE7DF] bg-white text-gray-600 hover:bg-[#F2EEE6]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-12 text-center">
            <p className="text-sm text-gray-500">
              Loading your booking requests...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-[#EAE7DF] bg-white px-6 py-16 text-center shadow-sm">
            <ClipboardList
              size={42}
              className="mx-auto text-[#A47D52]"
            />
            <h2 className="mt-5 text-xl font-semibold text-[#303B32]">
              No booking requests found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {filter === "all"
                ? "You have not received any booking requests yet."
                : `There are no ${filter} booking requests.`}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-[#EAE7DF] bg-white shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-[#F0EEE8] p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-[#A47D52]">
                      Requested on {formatDate(booking.createdAt)}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-[#303B32]">
                      {booking.service?.serviceName || "Wedding Service"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {booking.service?.category || "Service booking"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold capitalize ${statusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid gap-5 p-5 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays
                        size={19}
                        className="mt-0.5 text-[#A47D52]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Event Date</p>
                        <p className="mt-1 text-sm font-medium text-[#303B32]">
                          {formatDate(booking.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin
                        size={19}
                        className="mt-0.5 text-[#A47D52]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Event Location</p>
                        <p className="mt-1 text-sm font-medium text-[#303B32]">
                          {booking.eventLocation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock
                        size={19}
                        className="mt-0.5 text-[#A47D52]"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Customer ID</p>
                        <p className="mt-1 break-all text-sm font-medium text-[#303B32]">
                          {booking.customerId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] p-4">
                    <p className="text-xs font-medium text-gray-500">
                      Customer Message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#303B32]">
                      {booking.message || "No additional message provided."}
                    </p>

                    {typeof booking.service?.price === "number" && (
                      <p className="mt-4 border-t border-[#EAE7DF] pt-3 text-sm text-gray-500">
                        Service price:{" "}
                        <span className="font-semibold text-[#526B57]">
                          ৳{booking.service.price.toLocaleString("en-BD")}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="flex flex-col gap-3 border-t border-[#F0EEE8] bg-[#FCFBF9] p-5 sm:flex-row sm:justify-end">
                    <button
                      onClick={() =>
                        updateBookingStatus(booking._id, "rejected")
                      }
                      disabled={updatingId === booking._id}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        updateBookingStatus(booking._id, "accepted")
                      }
                      disabled={updatingId === booking._id}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#405345] disabled:opacity-50"
                    >
                      <CheckCircle size={17} />
                      {updatingId === booking._id
                        ? "Updating..."
                        : "Accept Booking"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
