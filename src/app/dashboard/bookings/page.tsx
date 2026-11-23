
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  ClipboardList,
  XCircle,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  service?: {
    serviceName?: string;
    category?: string;
    price?: number;
    location?: string;
    images?: string[];
  };
};

const API_URL = "http://localhost:5001";

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/bookings/customer/mine`, {
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load your bookings");
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
      router.replace("/sign-in?redirect=/dashboard/bookings");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session) {
      fetchBookings();
    }
  }, [session, fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingId(bookingId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not cancel booking");
      }

      setMessage("Your booking has been cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf9] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-rose-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-rose-500">
            Customer Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Bookings
          </h1>
          <p className="mt-2 text-gray-600">
            View and manage your wedding service booking requests.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={fetchBookings}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center">
            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-rose-300" />
            <h2 className="text-xl font-semibold text-gray-900">
              No bookings yet
            </h2>
            <p className="mt-2 text-gray-500">
              Explore our wedding services and send your first booking request.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-flex rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                  {booking.service?.images?.[0] ? (
                    <img
                      src={booking.service.images[0]}
                      alt={booking.service.serviceName || "Wedding service"}
                      className="h-44 w-full rounded-xl object-cover sm:h-36 sm:w-44"
                    />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-xl bg-rose-50 sm:w-44">
                      <ClipboardList className="h-10 w-10 text-rose-300" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {booking.service?.serviceName || "Wedding Service"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {booking.service?.category || "Service booking"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-rose-500" />
                        Event: {new Date(booking.eventDate).toLocaleDateString()}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-rose-500" />
                        {booking.eventLocation}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock size={16} className="text-rose-500" />
                        Requested:{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>

                      {typeof booking.service?.price === "number" && (
                        <p className="font-semibold text-gray-800">
                          Price: ৳{booking.service.price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {booking.message && (
                      <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">
                          Your message:{" "}
                        </span>
                        {booking.message}
                      </p>
                    )}

                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <XCircle size={16} />
                        )}
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
