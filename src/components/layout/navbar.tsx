
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

function NavbarContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;

    return `transition-colors ${
      isActive
        ? "text-[#A47D52]"
        : "text-[#303B32] hover:text-[#A47D52]"
    }`;
  };

  const getSectionClass = (section: string) => {
    return `transition-colors ${
      activeSection === section
        ? "text-[#A47D52]"
        : "text-[#303B32] hover:text-[#A47D52]"
    }`;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await authClient.signOut();
      closeMenu();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#EAE7DF] bg-[#FAF9F6]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          onClick={() => setActiveSection("")}
          className="text-2xl font-semibold tracking-tight"
        >
          Wed<span className="text-[#A47D52]">Plan.</span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium md:flex">
          <Link
            href="/"
            onClick={() => setActiveSection("")}
            className={getLinkClass("/")}
          >
            Home
          </Link>

          <Link
            href="/services"
            className={getLinkClass("/services")}
          >
            Browse Services
          </Link>

          <Link
            href="/#categories"
            onClick={() => setActiveSection("categories")}
            className={getSectionClass("categories")}
          >
            Categories
          </Link>

          <Link
            href="/#about"
            onClick={() => {
              closeMenu();
              setActiveSection("about");
            }}
            className={getSectionClass("about")}
          >
            About Us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#EEECE5]" />
          ) : isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#303B32] transition hover:bg-[#EEECE5]"
              >
                <UserRound size={17} />
                {session.user.name || "My Account"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 rounded-full bg-[#526B57] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#405744] disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-medium transition hover:bg-[#EEECE5]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#526B57] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#405744]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 hover:bg-[#EEECE5] md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#EAE7DF] bg-[#FAF9F6] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link
              href="/"
              onClick={() => {
                closeMenu();
                setActiveSection("");
              }}
              className={getLinkClass("/")}
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={closeMenu}
              className={getLinkClass("/services")}
            >
              Browse Services
            </Link>

            <Link
              href="/#categories"
              onClick={() => {
                closeMenu();
                setActiveSection("categories");
              }}
              className={getSectionClass("categories")}
            >
              Categories
            </Link>

            <Link
              href="/#about"
              onClick={() => {
                closeMenu();
                setActiveSection("about");
              }}
              className={getSectionClass("about")}
            >
              About Us
            </Link>

            <div className="flex flex-col gap-3 border-t border-[#EAE7DF] pt-4">
              {isPending ? (
                <div className="h-10 animate-pulse rounded-full bg-[#EEECE5]" />
              ) : isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-full border border-[#526B57] py-3 text-[#303B32]"
                  >
                    <UserRound size={17} />
                    {session.user.name || "My Account"}
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#526B57] py-3 text-white disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="flex-1 rounded-full border border-[#526B57] py-3 text-center"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="flex-1 rounded-full bg-[#526B57] py-3 text-center text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-[#FAF9F6]" />}>
      <NavbarContent />
    </Suspense>
  );
}
