
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Loader2,
  Store,
  RefreshCw,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  isActive?: boolean;
};

const API_URL = "http://localhost:5001";

export default function VendorServicesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/services/vendor/mine`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load your services");
      }

      setServices(result.data || []);
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
      router.replace("/sign-in?redirect=/dashboard/services");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session) {
      const user = session.user as typeof session.user & { role?: string };

      if (user.role !== "vendor") {
        router.replace("/dashboard");
        return;
      }

      fetchServices();
    }
  }, [session, router, fetchServices]);

  const handleDelete = async (serviceId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(serviceId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/services/${serviceId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete service");
      }

      setServices((current) =>
        current.filter((service) => service._id !== serviceId)
      );

      setMessage("Service deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyle = (status: Service["status"]) => {
    switch (status) {
      case "approved":
        return "bg-[#e8eee6] text-[#526b53]";
      case "rejected":
        return "bg-[#f8e9e5] text-[#a45e50]";
      default:
        return "bg-[#f5efe2] text-[#a17b42]";
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ad8652]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 text-[#354137] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e9e4d9] bg-white px-5 py-3 text-sm text-[#526b53] transition hover:border-[#ad8652] hover:text-[#ad8652]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 font-serif text-sm text-[#ad8652]">
              Vendor Workspace
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#354137] sm:text-4xl">
              My Services
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#737b80]">
              Manage your wedding services, update your offerings, and keep
              track of their approval status.
            </p>
          </div>

          <Link
            href="/dashboard/services/add"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ad8652] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#967144]"
          >
            <Plus size={17} />
            Add New Service
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Services", value: services.length },
            {
              label: "Approved",
              value: services.filter((item) => item.status === "approved").length,
            },
            {
              label: "Pending",
              value: services.filter((item) => item.status === "pending").length,
            },
            {
              label: "Rejected",
              value: services.filter((item) => item.status === "rejected").length,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#eae6dd] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-[#85877f]">{item.label}</p>
              <p className="mt-3 font-serif text-3xl font-bold text-[#354137]">
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-[#dce7d9] bg-[#edf3ea] p-4 text-sm text-[#526b53]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ead7d1] bg-[#fbefeb] p-4 text-sm text-[#a45e50]">
            <span>{error}</span>
            <button
              onClick={fetchServices}
              className="inline-flex items-center gap-2 font-semibold"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#eae6dd] bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#ad8652]" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9cfbd] bg-white px-6 py-16 text-center shadow-sm">
            <Store className="mx-auto mb-5 h-12 w-12 text-[#ad8652]" />
            <h2 className="font-serif text-2xl font-bold text-[#354137]">
              No services added yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#737b80]">
              Start showcasing your wedding services and make it easier for
              couples to discover your business.
            </p>
            <Link
              href="/dashboard/services/add"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ad8652] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967144]"
            >
              <Plus size={17} />
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-[#eae6dd] bg-white shadow-sm transition hover:shadow-md"
              >
                {service.images?.[0] ? (
                  <img
                    src={service.images[0]}
                    alt={service.serviceName}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-[#f3f0e9]">
                    <Store className="h-12 w-12 text-[#ad8652]" />
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#354137]">
                        {service.serviceName}
                      </h2>
                      <p className="mt-2 text-sm text-[#85877f]">
                        {service.category}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#737b80]">
                    {service.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm text-[#737b80]">
                      <MapPin size={16} className="text-[#ad8652]" />
                      {service.location}
                    </p>
                    <p className="font-semibold text-[#354137]">
                      ৳{service.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eeeae2] pt-5">
                    <span
                      className={`text-xs font-medium ${
                        service.isActive === false
                          ? "text-[#85877f]"
                          : "text-[#526b53]"
                      }`}
                    >
                      {service.isActive === false ? "Inactive" : "Active"}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/services/${service._id}/edit`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#e5dfd3] px-4 py-2 text-sm font-medium text-[#526b53] transition hover:border-[#ad8652] hover:text-[#ad8652]"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(service._id)}
                        disabled={deletingId === service._id}
                        className="inline-flex items-center gap-2 rounded-full border border-[#ead7d1] px-4 py-2 text-sm font-medium text-[#a45e50] transition hover:bg-[#fbefeb] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === service._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
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
