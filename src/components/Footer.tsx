import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a0a0a] text-white">
      {/* Top decorative border */}
      <div className="h-1 bg-gradient-to-r from-[#9b2335] via-amber-500 to-[#7c3aed]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🪔</span>
              <div>
                <p className="font-heading text-xl font-bold text-amber-400">
                  Moti Atya
                </p>
                <p className="text-xs text-amber-600 tracking-widest uppercase">
                  Costume Corner
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for authentic Indian costume rentals. Making
              every festival, school event, and cultural program unforgettable.
            </p>
            <div className="flex gap-3 mt-4">
              {["🎭", "💃", "🙏", "🎉"].map((e, i) => (
                <span key={i} className="text-2xl">
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                ["Home", "/"],
                ["Track Order Status", "/track"],
                ["Full Catalogue", "/catalogue"],
                ["Garba & Navratri", "/catalogue?category=garba-navratri"],
                ["Mythological Costumes", "/catalogue?category=mythological"],
                ["Kids Costumes", "/catalogue?category=kids-mythological"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

            {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center justify-between">
              <span>Visit & Contact Us</span>
              <span className="text-[11px] font-normal normal-case bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                ★ 4.6 (159 Reviews)
              </span>
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <span>📞</span>
                <a href="tel:+919930192705" className="hover:text-amber-400 transition-colors">
                  +91 99301 92705 / 099301 92705
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span>💬</span>
                <a
                  href="https://wa.me/919930192705"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  WhatsApp: +91 99301 92705
                </a>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">📍</span>
                <span className="leading-snug">
                  SHOP A1, Ostwal Kiran Apartment, Mira Bhayandar Rd, opp. BHARAT/Old petrol Pump, Mira Road East, Mumbai 401105
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span>⏰</span>
                <span className="leading-snug">
                  Mon–Sat: 10am – 9pm | Sun: 12pm – 8:30pm
                </span>
              </p>
              <p className="flex items-center gap-2 text-xs text-amber-400/90 pt-1">
                <span>🛍️</span>
                <span>In-store shopping · Fast Delivery available</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <a
                href="https://wa.me/919930192705?text=Hi!%20I%20want%20to%20enquire%20about%20costume%20rentals."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Enquiry
              </a>
              <a
                href="https://share.google/fSSm7ezLsgOaMeqPl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
              >
                <span>📍</span>
                Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-gray-500 text-xs">
          <p>© 2026 Costume Store Fancy dress Rental Shop (Moti Atya). All rights reserved.</p>
          <p>Mira Road East, Mumbai • 4.6 ★ (159 Reviews)</p>
        </div>
      </div>
    </footer>
  );
}
