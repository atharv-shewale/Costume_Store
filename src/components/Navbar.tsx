"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#categories", label: "Categories" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🪔</span>
            <div>
              <p className="font-heading text-lg font-bold leading-none text-[#9b2335]">
                Moti Atya
              </p>
              <p className="text-[10px] text-amber-700 font-medium tracking-widest uppercase leading-none">
                Costume Corner
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-700 hover:text-[#9b2335] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#9b2335] hover:after:w-full after:transition-all after:duration-300"
              >
                {l.label}
              </Link>
            ))}
            {/* Admin link removed from public navbar as requested */}
            <a
              href="https://wa.me/919930192705?text=Hi!%20I%20want%20to%20enquire%20about%20costume%20rentals."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#9b2335] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#7d1c2a] transition-all hover:scale-105 shadow-md shadow-red-200"
            >
              <Sparkles size={14} />
              Book Now
            </a>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-amber-100 shadow-xl">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium py-2 border-b border-gray-100 hover:text-[#9b2335] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://wa.me/919930192705?text=Hi!%20I%20want%20to%20enquire%20about%20costume%20rentals."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#9b2335] text-white px-4 py-3 rounded-xl font-semibold mt-2"
            >
              <Sparkles size={16} />
              Book a Costume on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
