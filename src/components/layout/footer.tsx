
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#303B32] px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-semibold">
            Wed<span className="text-[#D7B98E]">Plan.</span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
            Bringing your wedding vision to life, one beautiful detail at a
            time.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/services" className="transition hover:text-white">
              Browse Services
            </Link>
            <Link
              href="/#categories"
              className="transition hover:text-white"
            >
              Categories
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Account</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
            <Link href="/sign-in" className="transition hover:text-white">
              Sign In
            </Link>
            <Link href="/sign-up" className="transition hover:text-white">
              Create Account
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">WedPlan</h3>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Helping couples and wedding professionals connect.
          </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-6 text-center text-xs text-white/50 sm:text-left">
        © 2026 WedPlan. All rights reserved.
      </p>
    </footer>
  );
}
