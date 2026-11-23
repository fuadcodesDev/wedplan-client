
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { MapPin, ArrowLeft, CalendarDays } from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
};

function ServiceDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          throw new Error(result.message || "Could not load service details");
        }

        setService(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getService();
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#303B32]">
      <Navbar />

      {loading ? (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="h-96 animate-pulse rounded-2xl bg-[#EEECE5]" />
        </section>
      ) : error || !service ? (
        <section className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="text-2xl font-semibold">Service Not Found</h1>
          <p className="mt-3 text-sm text-[#7B837A]">
            {error || "This service may have been removed or is unavailable."}
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
                <p className="text-sm text-[#8A9189]">Starting from</p>
                <p className="mt-2 text-3xl font-semibold text-[#526B57]">
                  ৳{service.price.toLocaleString("en-BD")}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold">About This Service</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#687168]">
                  {service.description}
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-[#EAE7DF] bg-white p-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-[#A47D52]" size={22} />
                  <h2 className="text-lg font-semibold">
                    Ready to plan your special day?
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#7B837A]">
                  Book this service and take one more step toward your dream
                  wedding.
                </p>

                <Link
                  href={`/sign-in?redirect=/services/${service._id}`}
                  className="mt-6 block rounded-full bg-[#526B57] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#405744]"
                >
                  Book This Service
                </Link>
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
