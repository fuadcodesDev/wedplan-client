
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
        });

        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (location.trim()) params.set("location", location.trim());
        if (sort) params.set("sort", sort);

        const response = await fetch(
          `http://localhost:5001/api/services?${params.toString()}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load services");
        }

        setServices(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, [search, category, location, sort, page]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setSort("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#303B32]">
      <Navbar />

      <section className="bg-[#EEECE5] px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#A47D52]">
          Find Your Perfect Match
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
          Explore Wedding Services
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#687168] sm:text-base">
          Discover trusted wedding professionals and find everything
          you need to make your special day unforgettable.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-8 rounded-2xl border border-[#EAE7DF] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <h2 className="font-semibold">Find Your Service</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Search services
              </label>
              <div className="flex items-center rounded-lg border border-[#E5E2DA] px-3">
                <Search size={17} className="text-[#8A9189]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by name..."
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[#E5E2DA] bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>
              <div className="flex items-center rounded-lg border border-[#E5E2DA] px-3">
                <MapPin size={17} className="text-[#8A9189]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Enter location..."
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sort by price
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[#E5E2DA] bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-[#A47D52] hover:underline"
          >
            Clear all filters
          </button>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Available Services</h2>
            <p className="mt-1 text-sm text-[#7B837A]">
              {pagination
                ? `${pagination.total} services found`
                : "Discover wedding services"}
            </p>
          </div>
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
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <button
              onClick={() => setPage((current) => current)}
              className="mt-3 text-sm font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-[#EAE7DF] bg-white px-5 py-16 text-center">
            <h3 className="text-xl font-semibold">No services found</h3>
            <p className="mt-2 text-sm text-[#7B837A]">
              Try changing your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-[#EAE7DF] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 bg-[#EEECE5]">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.serviceName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#8A9189]">
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

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#7B837A]">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-[#687168]">
                    <MapPin size={15} />
                    {service.location}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#EEECE5] pt-4">
                    <div>
                      <p className="text-xs text-[#8A9189]">Starting from</p>
                      <p className="mt-1 text-lg font-semibold text-[#526B57]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="rounded-full bg-[#526B57] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#405744]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-full border border-[#DCD8CE] px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-[#687168]">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-full border border-[#DCD8CE] px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
