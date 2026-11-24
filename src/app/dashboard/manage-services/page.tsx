
"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, X } from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  vendorId: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
};

const API = "http://localhost:5001/api/services";

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/admin/all?status=${status}&limit=50`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services");
      }

      setServices(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  async function reviewService(id: string, decision: "approved" | "rejected") {
    setProcessing(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API}/${id}/review`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: decision }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Review failed");
      }

      setMessage(`Service ${decision} successfully.`);
      await fetchServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[#8b735b]">Administration</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage Services
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review vendor submissions and manage service approval.
          </p>
        </div>

        <button
          onClick={fetchServices}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "all"].map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
              status === item
                ? "border-[#a47d52] bg-[#a47d52] text-white"
                : "hover:bg-muted"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading services...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <h2 className="text-lg font-medium">No services found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no services in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-xl border bg-card"
            >
              {service.images?.[0] ? (
                <img
                  src={service.images[0]}
                  alt={service.serviceName}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted text-sm text-muted-foreground">
                  No image
                </div>
              )}

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold">{service.serviceName}</h2>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                    {service.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {service.category} · {service.location}
                </p>

                <p className="line-clamp-3 text-sm">
                  {service.description}
                </p>

                <p className="text-lg font-semibold">
                  ৳{service.price.toLocaleString("en-BD")}
                </p>

                <p className="break-all text-xs text-muted-foreground">
                  Vendor: {service.vendorId}
                </p>

                {service.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => reviewService(service._id, "approved")}
                      disabled={processing !== null}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#526b53] px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {processing === service._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve
                    </button>

                    <button
                      onClick={() => reviewService(service._id, "rejected")}
                      disabled={processing !== null}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                    >
                      <X className="size-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
