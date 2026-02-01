"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Added

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current path

  // Khaki color palette variations
  const khakiPrimary = "#D4B483";
  const khakiLight = "#E6D5B8";
  const khakiDark = "#B5985C";
  const navyDark = "#0f172a";

  // Navigation links
  const navLinks = [
    { href: "/cases", label: "Cases" },
    { href: "/property", label: "Properties" },
    { href: "/search", label: "Search" },
  ];

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className="relative px-4 md:px-8 py-4 flex justify-between items-center shadow-xl border-b border-gray-800"
        style={{
          background: `linear-gradient(135deg, ${navyDark} 0%, #1a253c 100%)`,
        }}
      >
        {/* LEFT: Logo + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              style={{ color: khakiPrimary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-khakiPrimary/20 to-khakiDark/20 blur-sm rounded-full"></div>
              <img
                src="/jhpolice.png"
                alt="e-Malkhana"
                className="h-8 w-8 md:h-10 md:w-10 relative z-10 drop-shadow-lg"
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-lg md:text-xl font-bold tracking-wider"
                style={{ color: khakiLight }}
              >
                e-Malkhana
              </span>
              <span className="hidden md:block text-[10px] text-gray-400 tracking-widest uppercase">
                Digital Evidence Management
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation Links */}
        <div className="hidden md:flex gap-1 p-1 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                relative px-4 md:px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 group
                ${isActive(link.href) ? 'bg-gray-800/70' : ''}
              `}
              style={{
                color: isActive(link.href) ? khakiLight : "#CBD5E1",
              }}
            >
              <span className="relative z-10">{link.label}</span>
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent rounded-md group-hover:from-khakiPrimary/10 group-hover:to-khakiDark/10 transition-all duration-300"
              />
              {/* Active indicator - always visible for active link */}
              <div
                className="absolute bottom-0 left-1/2 h-0.5 transition-all duration-300"
                style={{ 
                  backgroundColor: khakiPrimary,
                  width: isActive(link.href) ? '80%' : '0%',
                  left: isActive(link.href) ? '10%' : '50%'
                }}
              />
              {/* Hover indicator - only on hover for non-active links */}
              {!isActive(link.href) && (
                <div
                  className="absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-4/5 group-hover:left-1/10 transition-all duration-300"
                  style={{ backgroundColor: khakiPrimary }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT: User Info + Logout (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Officer info */}
          {session?.user && (
            <div className="text-right px-4 py-2 rounded-lg bg-gray-900/40 backdrop-blur-sm border border-gray-800">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center border border-khakiPrimary/30"
                  style={{ backgroundColor: `${khakiPrimary}15` }}
                >
                  <svg
                    className="w-4 h-4"
                    style={{ color: khakiPrimary }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="font-bold tracking-wide text-sm"
                    style={{ color: khakiLight }}
                  >
                    {session.user.officerId}
                  </p>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">
                    {session.user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Logout Button (Desktop) */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="
              relative px-4 py-2 rounded-lg
              text-sm font-medium tracking-wide
              transition-all duration-300
              group overflow-hidden
            "
            style={{
              background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
              color: "#0f172a",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

            <div className="flex items-center gap-2 relative z-10">
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </div>

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"
              style={{ backgroundColor: khakiPrimary }}
            />
          </button>
        </div>

        {/* Mobile Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="Logout"
        >
          <svg
            className="w-6 h-6"
            style={{ color: khakiPrimary }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 transition-all duration-300 ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3">
          {/* Mobile User Info */}
          {session?.user && (
            <div className="mb-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center border border-khakiPrimary/30"
                  style={{ backgroundColor: `${khakiPrimary}15` }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: khakiPrimary }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p
                    className="font-bold text-base"
                    style={{ color: khakiLight }}
                  >
                    {session.user.officerId}
                  </p>
                  <p className="text-gray-400 text-sm uppercase tracking-wider mt-0.5">
                    {session.user.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  text-base font-medium transition-all duration-200
                  hover:bg-gray-800/50 border
                  ${isActive(link.href) ? 'bg-gray-800/70 border-gray-700' : 'border-transparent hover:border-gray-700'}
                `}
                style={{
                  color: isActive(link.href) ? khakiLight : "#CBD5E1",
                }}
              >
                <div
                  className="w-1 h-6 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: khakiPrimary,
                    width: isActive(link.href) ? '4px' : '1px'
                  }}
                />
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 rounded-full bg-khakiPrimary"></div>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Logout Button (Full Width) */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="
              w-full mt-6 px-4 py-3 rounded-lg
              text-base font-medium tracking-wide
              transition-all duration-300
              group overflow-hidden
              flex items-center justify-center gap-2
            "
            style={{
              background: `linear-gradient(135deg, ${khakiDark} 0%, ${khakiPrimary} 100%)`,
              color: "#0f172a",
            }}
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}