
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

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

            <div className="flex gap-3 border-t border-[#EAE7DF] pt-4">
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
          </div>
        </nav>
      )}
    </header>
  );
}
