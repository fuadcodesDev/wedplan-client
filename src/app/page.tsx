
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  MapPin,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  Heart,
  ShieldCheck,
  CalendarCheck,
  Star,
} from "lucide-react";

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: MapPin },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: Utensils },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
};

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");

  useEffect(() => {
    const getFeaturedServices = async () => {
      try {
        setLoading(true);
        setServiceError("");

        const response = await fetch(
          "http://localhost:5001/api/services?limit=6&page=1"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load featured services");
        }

        setFeaturedServices(result.data.slice(0, 6));
      } catch (error) {
        setServiceError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading services."
        );
      } finally {
        setLoading(false);
      }
    };

    getFeaturedServices();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#303B32]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[570px] items-center overflow-hidden sm:min-h-[650px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(24,35,27,0.76), rgba(24,35,27,0.22)), url('https://images.unsplash.com/photo-1519741497674-611481863552?w=2000')",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <div className="max-w-2xl text-white">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#E6D1AE] sm:text-sm">
              Your story. Your day. Your way.
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Plan your dream wedding, beautifully.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/85 sm:text-lg">
              Discover trusted wedding vendors, explore beautiful venues,
              and bring every little detail of your special day together.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#E8D5B8] px-7 py-4 text-sm font-semibold text-[#303B32] transition hover:bg-white"
              >
                Explore Services <ArrowRight size={17} />
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full border border-white/70 px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Start Planning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 sm:py-24 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47D52]">
          Welcome to WedPlan
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          Every beautiful wedding starts with a little planning.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#777B72] sm:text-base">
          From finding the perfect venue to choosing the right photographer,
          we make it easier to plan a celebration that feels like you.
        </p>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="bg-[#F0EFE8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47D52]">
                Find what you need
              </p>

              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Explore Categories
              </h2>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#526B57] hover:text-[#A47D52]"
            >
              View all services <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href="/services"
                  key={category.name}
                  className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-[#E5E2D9] bg-[#FAF9F6] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#A47D52] hover:shadow-lg"
                >
                  <div className="mb-4 rounded-full bg-[#E9EDE5] p-4 text-[#526B57] transition group-hover:bg-[#526B57] group-hover:text-white">
                    <Icon size={24} strokeWidth={1.6} />
                  </div>

                  <span className="text-sm font-medium leading-5">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47D52]">
              Handpicked for you
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Featured Services
            </h2>

            <p className="mt-3 text-sm text-[#777B72]">
              Discover services to make your celebration unforgettable.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#526B57] hover:text-[#A47D52]"
          >
            Explore all <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-[#EEECE5]"
              />
            ))}
          </div>
        ) : serviceError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{serviceError}</p>
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="rounded-2xl border border-[#EAE7DF] bg-white p-12 text-center">
            <h3 className="text-xl font-semibold">No featured services yet</h3>
            <p className="mt-2 text-sm text-[#777B72]">
              Approved wedding services will appear here.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#526B57]"
            >
              Browse services <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <article
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-[#EAE7DF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 overflow-hidden bg-[#EEECE5]">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.serviceName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#85877F]">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#A47D52]">
                    {service.category}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#85877F]">
                    <MapPin size={15} /> {service.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#EEECE5] pt-4">
                    <div>
                      <p className="text-xs text-[#85877F]">Starting from</p>

                      <p className="mt-1 font-semibold text-[#526B57]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      aria-label={`View ${service.serviceName}`}
                      className="rounded-full bg-[#E9EDE5] p-3 text-[#526B57] transition hover:bg-[#526B57] hover:text-white"
                    >
                      <ArrowUpRight size={19} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section
        id="about"
        className="bg-[#526B57] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8D5B8]">
              Why WedPlan
            </p>

            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              Making wedding planning feel effortless.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Spend less time searching and more time enjoying the journey
              towards your special day.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <Heart className="mx-auto text-[#E8D5B8]" size={32} />

              <h3 className="mt-5 text-lg font-semibold">
                Made for Your Day
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Find services that match your style and vision.
              </p>
            </div>

            <div className="text-center">
              <ShieldCheck className="mx-auto text-[#E8D5B8]" size={32} />

              <h3 className="mt-5 text-lg font-semibold">
                Trusted Vendors
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Discover vendors reviewed through our platform.
              </p>
            </div>

            <div className="text-center">
              <CalendarCheck className="mx-auto text-[#E8D5B8]" size={32} />

              <h3 className="mt-5 text-lg font-semibold">
                Easy Planning
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Keep your service bookings organized in one place.
              </p>
            </div>

            <div className="text-center">
              <Star className="mx-auto text-[#E8D5B8]" size={32} />

              <h3 className="mt-5 text-lg font-semibold">
                More Choices
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Explore different wedding services and possibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#EEE8DC] px-6 py-14 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A47D52]">
            Your special day begins here
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
            Ready to make your wedding dreams come true?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#777B72] sm:text-base">
            Join WedPlan and start discovering the people and services
            that will make your day unforgettable.
          </p>

          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#526B57] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#405744]"
          >
            Get Started <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
