
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserRound, Save } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = session?.user as
    | (typeof session.user & {
        role?: string;
        subscriptionPlan?: string;
      })
    | undefined;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in?redirect=/dashboard/profile");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user?.name, user?.image]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (result.error) {
        setError(result.error.message || "Could not update your profile.");
        return;
      }

      setMessage("Your profile was updated successfully.");
      await authClient.getSession();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#526B57] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#303B32]">
            Profile Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE7DF] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-4">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="h-20 w-20 rounded-full border border-[#EAE7DF] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F2EEE6] text-[#A47D52]">
                <UserRound size={34} />
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-[#303B32]">
                {user.name}
              </h2>
              <p className="text-sm capitalize text-gray-500">
                {user.role || "Customer"} Account
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Profile Image URL
              </label>
              <input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste your profile image URL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
              />
              <p className="mt-1 text-xs text-gray-400">
                We'll connect ImgBB image uploading in the next step.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Account Role
                </label>
                <input
                  value={user.role || "customer"}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm capitalize text-gray-500"
                />
              </div>

              {user.role === "vendor" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Subscription Plan
                  </label>
                  <input
                    value={user.subscriptionPlan || "free"}
                    disabled
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm capitalize text-gray-500"
                  />
                </div>
              )}
            </div>

            {message && (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#526B57] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#405744] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
