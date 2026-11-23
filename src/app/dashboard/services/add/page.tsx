
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Store,
  ImagePlus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5001";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
    images: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in?redirect=/dashboard/services/add");
      return;
    }

    if (session) {
      const user = session.user as typeof session.user & {
        role?: string;
      };

      if (user.role !== "vendor") {
        router.replace("/dashboard");
      }
    }
  }, [isPending, session, router]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const imageList = form.images
      .split("\n")
      .map((image) => image.trim())
      .filter(Boolean);

    if (imageList.some((image) => !/^https?:\/\/.+/i.test(image))) {
      setError("Please enter valid image URLs, one per line.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/services`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceName: form.serviceName.trim(),
          category: form.category,
          description: form.description.trim(),
          price: Number(form.price),
          location: form.location.trim(),
          images: imageList,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not create service");
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ad8652]" />
      </div>
    );
  }

  const inputStyle =
    "mt-2 w-full rounded-xl border border-[#e5dfd3] bg-white px-4 py-3 text-sm text-[#354137] outline-none transition placeholder:text-[#aaa69c] focus:border-[#ad8652] focus:ring-2 focus:ring-[#ad8652]/10";

  const labelStyle = "text-sm font-medium text-[#526b53]";

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 text-[#354137] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/services"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e9e4d9] bg-white px-5 py-3 text-sm text-[#526b53] transition hover:border-[#ad8652] hover:text-[#ad8652]"
        >
          <ArrowLeft size={16} />
          Back to My Services
        </Link>

        <div className="mb-8">
          <p className="mb-3 font-serif text-sm text-[#ad8652]">
            Vendor Workspace
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#354137] sm:text-4xl">
            Add New Service
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#737b80]">
            Share your wedding service with couples planning their special day.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#eae6dd] bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="flex items-center gap-3 border-b border-[#eeeae2] pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f0e9]">
              <Store className="text-[#ad8652]" size={23} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#354137]">
                Service Information
              </h2>
              <p className="text-xs text-[#85877f]">
                Fields marked with * are required.
              </p>
            </div>
          </div>

          <div>
            <label className={labelStyle} htmlFor="serviceName">
              Service Name *
            </label>
            <input
              id="serviceName"
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g. Premium Wedding Photography"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className={labelStyle} htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputStyle}
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelStyle} htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputStyle} min-h-32 resize-y`}
              placeholder="Describe your service, experience, and what makes it special..."
              required
              minLength={20}
              maxLength={2000}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelStyle} htmlFor="price">
                Price (BDT) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                className={inputStyle}
                placeholder="e.g. 25000"
                required
              />
            </div>

            <div>
              <label className={labelStyle} htmlFor="location">
                Location *
              </label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputStyle}
                placeholder="e.g. Sylhet, Bangladesh"
                required
                maxLength={150}
              />
            </div>
          </div>

          <div>
            <label className={labelStyle} htmlFor="images">
              Service Image URLs
            </label>
            <div className="mt-2 flex items-center gap-2 text-xs text-[#85877f]">
              <ImagePlus size={15} className="text-[#ad8652]" />
              Enter one image URL per line.
            </div>
            <textarea
              id="images"
              name="images"
              value={form.images}
              onChange={handleChange}
              className={`${inputStyle} min-h-24 resize-y`}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
            />
            <p className="mt-2 text-xs text-[#85877f]">
              Image uploads through ImgBB will be integrated in a later step.
            </p>
          </div>

          <div className="rounded-xl border border-[#eee4d0] bg-[#faf7f0] p-4">
            <p className="text-sm font-semibold text-[#80643e]">
              Approval information
            </p>
            <p className="mt-1 text-xs leading-5 text-[#85877f]">
              Your new service will be submitted for admin approval. It won't
              appear publicly until it has been approved.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-[#ead7d1] bg-[#fbefeb] p-4 text-sm text-[#a45e50]">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-[#eeeae2] pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/services"
              className="rounded-full border border-[#e5dfd3] px-6 py-3 text-center text-sm font-medium text-[#526b53] transition hover:bg-[#faf9f6]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ad8652] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#967144] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Plus size={17} />
              )}
              {saving ? "Submitting..." : "Submit Service"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
