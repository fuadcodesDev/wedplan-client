
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { authClient } from "@/lib/auth-client";
import {
  MapPin,
  ArrowLeft,
  CalendarDays,
  Send,
} from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  vendorId?: string;
};

type SessionUser = {
  role?: string;
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user as SessionUser | undefined;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  useEffect(() => {
    const getService = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:5001/api/services/${id}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load service details"
          );
        }

        setService(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getService();
    }
  }, [id]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBookingError("");
    setBookingSuccess("");

    if (!session) {
      router.push(`/sign-in?redirect=/services/${id}`);
      return;
    }

    if (user?.role !== "customer") {
      setBookingError(
        "Only customer accounts can book wedding services."
      );
      return;
    }

    if (!eventDate || !eventLocation.trim()) {
      setBookingError("Please provide the event date and location.");
      return;
    }

    if (eventDate < getTodayDate()) {
      setBookingError("Please select today or a future event date.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/bookings",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: id,
            eventDate,
            eventLocation: eventLocation.trim(),
            message: message.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Could not submit your booking request."
        );
      }

      setBookingSuccess(
        "Your booking request has been submitted successfully!"
      );

      setEventDate("");
      setEventLocation("");
      setMessage("");

      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 1500);
    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const canBook = !sessionLoading && user?.role === "customer";

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#303B32]">
      <Navbar />

      {loading ? (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="h-96 animate-pulse rounded-2xl bg-[#EEECE5]" />
        </section>
      ) : error || !service ? (
        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-2xl font-semibold">
            Service Not Found
          </h1>

          <p className="mt-3 text-sm text-[#7B837A]">
            {error ||
              "This service may have been removed or is unavailable."}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white hover:bg-[#405744]"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#687168] hover:text-[#A47D52]"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Service Images */}
            <div>
              {service.images?.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-80 overflow-hidden rounded-2xl bg-[#EEECE5] sm:h-[450px]">
                    <img
                      src={service.images[0]}
                      alt={service.serviceName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {service.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {service.images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className="h-28 overflow-hidden rounded-xl bg-[#EEECE5]"
                        >
                          <img
                            src={image}
                            alt={`${service.serviceName} ${index + 2}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center rounded-2xl bg-[#EEECE5] text-[#8A9189] sm:h-[450px]">
                  No image available
                </div>
              )}
            </div>

            {/* Service Information */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A47D52]">
                {service.category}
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                {service.serviceName}
              </h1>

              <div className="mt-5 flex items-center gap-2 text-sm text-[#687168]">
                <MapPin size={18} />
                {service.location}
              </div>

              <div className="mt-8 border-y border-[#EAE7DF] py-6">
                <p className="text-sm text-[#8A9189]">
                  Starting from
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#526B57]">
                  ৳{service.price.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold">
                  About This Service
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#687168]">
                  {service.description}
                </p>
              </div>

              {/* Booking Form */}
              <div
                id="booking-form"
                className="mt-10 rounded-2xl border border-[#EAE7DF] bg-white p-6 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="text-[#A47D52]"
                    size={22}
                  />

                  <h2 className="text-lg font-semibold">
                    Book This Service
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#7B837A]">
                  Tell us about your wedding event. The vendor will
                  review your booking request.
                </p>

                {!sessionLoading && !session && (
                  <div className="mt-5 rounded-xl bg-[#F2EEE6] p-4 text-sm text-[#526B57]">
                    Please sign in with your customer account to
                    submit a booking.
                    <Link
                      href={`/sign-in?redirect=/services/${id}`}
                      className="ml-1 font-semibold underline"
                    >
                      Sign in
                    </Link>
                  </div>
                )}

                {!sessionLoading && session && user?.role !== "customer" && (
                  <div className="mt-5 rounded-xl bg-[#F2EEE6] p-4 text-sm text-[#526B57]">
                    Only customer accounts can book services.
                  </div>
                )}

                {bookingError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {bookingSuccess}
                  </div>
                )}

                <form onSubmit={handleBooking} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="eventDate"
                      className="mb-2 block text-sm font-medium text-[#526B57]"
                    >
                      Event Date *
                    </label>

                    <input
                      id="eventDate"
                      type="date"
                      min={getTodayDate()}
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      disabled={!canBook || bookingLoading}
                      className="w-full rounded-xl border border-[#EAE7DF] bg-[#FAF9F6] px-4 py-3 text-sm outline-none transition focus:border-[#A47D52] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="eventLocation"
                      className="mb-2 block text-sm font-medium text-[#526B57]"
                    >
                      Event Location *
                    </label>

                    <input
                      id="eventLocation"
                      type="text"
                      placeholder="Enter your wedding event location"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      required
                      disabled={!canBook || bookingLoading}
                      maxLength={200}
                      className="w-full rounded-xl border border-[#EAE7DF] bg-[#FAF9F6] px-4 py-3 text-sm outline-none transition focus:border-[#A47D52] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-[#526B57]"
                    >
                      Additional Message
                    </label>

                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell the vendor about your wedding plans or special requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!canBook || bookingLoading}
                      maxLength={1000}
                      className="w-full resize-y rounded-xl border border-[#EAE7DF] bg-[#FAF9F6] px-4 py-3 text-sm outline-none transition focus:border-[#A47D52] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canBook || bookingLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#526B57] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#405744] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={17} />
                    {bookingLoading
                      ? "Submitting Request..."
                      : "Submit Booking Request"}
                  </button>

                  <p className="text-center text-xs text-[#8A9189]">
                    Your booking will remain pending until the vendor
                    responds.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF9F6]">
          <Navbar />
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <div className="h-96 animate-pulse rounded-2xl bg-[#EEECE5]" />
          </div>
          <Footer />
        </main>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
