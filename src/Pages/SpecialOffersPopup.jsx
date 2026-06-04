// src/components/SpecialOffersPopup.jsx
// React + Tailwind popup/inline offers with provider picker
// Child-owned navigation using react-router's useNavigate

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiGift,
  FiCreditCard,
  FiCalendar,
  FiZap,
  FiGlobe,
  FiShield,
  FiWifi,
  FiPhone,
  FiMonitor,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const DEFAULT_OFFERS = [
  {
    id: "voucher",
    icon: <FiGift size={22} />,
    title: "$50 Gift Voucher",
    blurb:
      "Book an appointment today & get a $50 gift voucher—just for getting started with us!",
    tag: "Limited-time",
  },
  {
    id: "trial",
    icon: <FiGift size={22} />,
    title: "14-Day Free Trial",
    blurb: "Try our services with zero risk and no upfront payment.",
    tag: "Free",
  },
  {
    id: "no-cc",
    icon: <FiCreditCard size={22} />,
    title: "No Credit Card Needed",
    blurb: "Experience our solutions without sharing payment details.",
    tag: "Hassle-free",
  },
  {
    id: "booking",
    icon: <FiCalendar size={22} />,
    title: "Free Appointment Booking",
    blurb: "Schedule a consultation at your convenience—completely free.",
    tag: "Free",
  },
  {
    id: "install",
    icon: <FiZap size={22} />,
    title: "Free Installation & No Technician Fee",
    blurb: "We handle everything—no extra charges.",
    tag: "Free",
  },
  {
    id: "domain",
    icon: <FiGlobe size={22} />,
    title: "Free Domain & Business Email",
    blurb: "Build your online presence effortlessly.",
    tag: "Included",
  },
  {
    id: "security",
    icon: <FiShield size={22} />,
    title: "Free Antivirus & Desktop Security",
    blurb: "Protect your business from online threats at no extra cost.",
    tag: "Included",
  },
  {
    id: "nocap",
    icon: <FiWifi size={22} />,
    title: "No Data Caps",
    blurb: "Unlimited usage with no restrictions.",
    tag: "Unlimited",
  },
];

const DEFAULT_PROVIDERS = [
  { id: "att-business", name: "AT&T Business", icon: <FiPhone size={22} /> },
  {
    id: "spectrum-business",
    name: "Spectrum Business",
    icon: <FiWifi size={22} />,
  },
  {
    id: "comcast-business",
    name: "Comcast Business",
    icon: <FiGlobe size={22} />,
  },
  { id: "acc-business", name: "ACC Business", icon: <FiGift size={22} /> },
  { id: "ringcentral", name: "RingCentral", icon: <FiMonitor size={22} /> },
  { id: "spectrum-voip", name: "Spectrum VoIP", icon: <FiPhone size={22} /> },
];

const LS_KEY_LAST = "zlnk_offers_popup_last";
const SS_KEY_SHOWN = "zlnk_offers_popup_session_shown";

function nowISO() {
  return new Date().toISOString();
}
function withinCooldown(days) {
  try {
    const last = localStorage.getItem(LS_KEY_LAST);
    if (!last) return false;
    const diff =
      (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
    return diff < days;
  } catch {
    return false;
  }
}
function markShown({ sessionOnly = false } = {}) {
  try {
    localStorage.setItem(LS_KEY_LAST, nowISO());
    if (sessionOnly) sessionStorage.setItem(SS_KEY_SHOWN, "1");
  } catch {}
}
function sessionAlreadyShown() {
  try {
    return sessionStorage.getItem(SS_KEY_SHOWN) === "1";
  } catch {
    return false;
  }
}

export default function SpecialOffersPopup({
  offers = DEFAULT_OFFERS,
  providers = DEFAULT_PROVIDERS,
  delayMs = 6000,
  scrollPct = 35,
  exitIntent = true,
  cooldownDays = 7,
  showOncePerSession = true,
  reopenPill = true,
  variant = "modal",
  defaultOpen = false,
  bookingPath = "/customerbookingfrom",
}) {
  const [isReadMore, setIsReadMore] = useState(false);
  const handleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith(bookingPath);

  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState("offers");
  const openedRef = useRef(false);

  const canAutoOpen = useMemo(() => {
    if (isBookingPage) return false;
    if (showOncePerSession && sessionAlreadyShown()) return false;
    if (cooldownDays && withinCooldown(cooldownDays)) return false;
    return true;
  }, [isBookingPage, showOncePerSession, cooldownDays]);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
  }, []);

  useEffect(() => {
    if (isBookingPage) {
      setOpen(false);
      setStep("offers");
    }
  }, [isBookingPage]);

  const openPopup = (source) => {
    if (variant !== "modal") return;
    if (!canAutoOpen || openedRef.current) return;
    openedRef.current = true;
    setOpen(true);
    try {
      window.dataLayer.push({ event: "offers_popup_open", source });
    } catch {}
    markShown({ sessionOnly: showOncePerSession });
  };

  useEffect(() => {
    if (variant !== "modal" || !canAutoOpen || delayMs <= 0) return;
    const t = setTimeout(() => {
      openPopup("timer");
    }, delayMs);

    return () => clearTimeout(t);
  }, [variant, canAutoOpen, delayMs]);

  useEffect(() => {
    if (variant !== "modal" || !canAutoOpen || !scrollPct) return;
    const handler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = (scrolled / total) * 100;
      if (pct >= scrollPct) {
        window.removeEventListener("scroll", handler);
        openPopup("scroll");
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [variant, canAutoOpen, scrollPct]);

  useEffect(() => {
    if (variant !== "modal" || !canAutoOpen || !exitIntent) return;
    const handler = (e) => {
      if (e.clientY <= 0) {
        window.removeEventListener("mouseout", handler);
        openPopup("exit_intent");
      }
    };
    window.addEventListener("mouseout", handler);
    return () => window.removeEventListener("mouseout", handler);
  }, [variant, canAutoOpen, exitIntent]);

  const close = (action = "close") => {
    setOpen(false);
    try {
      window.dataLayer.push({ event: "offers_popup_" + action });
    } catch {}
  };

  const handleBook = () => {
    try {
      window.dataLayer.push({
        event: "offers_popup_cta",
        cta: "book_free_appointment",
      });
    } catch {}
    setStep("providers");
    if (variant === "inline") setOpen(true);
  };

  const chooseProvider = (providerName) => {
    try {
      window.dataLayer?.push({
        event: "provider_select",
        provider: providerName,
      });
    } catch {}
    setOpen(false);
    openedRef.current = false;
    markShown({ sessionOnly: true });
    setStep("offers");
    navigate(
      {
        pathname: bookingPath,
        search: `?provider=${encodeURIComponent(providerName)}`,
      },
      { state: { provider: providerName } }
    );
  };

  return (
    <>
      {/* Inline variant renders directly in page */}
      {variant === "modal" && reopenPill && !isBookingPage && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-60 right-0 z-50 origin-bottom-right -rotate-90 rounded-t-xl bg-gradient-to-r from-pink-600 via-[#E8611A] to-yellow-500 px-5 py-2.5 text-white text-sm font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          aria-label="View Special Offers"
        >
          <span>🎁</span>
          <span>View Offers</span>
        </button>
      )}{" "}
      {variant === "inline" && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 text-center">
            <span className="inline-block rounded-full border border-black/20 px-3 py-1 text-xs tracking-wide uppercase">
              Special Offers
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Everything you need to get started—free perks included
            </h2>
            <p className="mt-2 text-sm text-black/70">
              Simple, transparent, and generous. No fine-print surprises.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((o) => (
              <article
                key={o.id}
                className="group relative rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="text-2xl leading-none select-none"
                    aria-hidden="true"
                  >
                    {o.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg sm:text-xl leading-tight">
                        {o.title}
                      </h3>
                      {o.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-black/15">
                          {o.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-black/70">{o.blurb}</p>
                  </div>
                </div>
                <div className="my-4 h-px w-full bg-black/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/60">
                    Included with new sign-ups
                  </span>
                  <button
                    onClick={handleBook}
                    className="inline-flex items-center justify-center rounded-xl border border-black px-3 py-1.5 text-sm font-medium hover:-translate-y-0.5 active:translate-y-0 transition-transform"
                    aria-label="Book free appointment"
                  >
                    Book Free Appointment
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 text-[11px] text-black/60">
            <p className="overflow-hidden">
              {isReadMore
                ? "* $50 gift voucher issued post first qualified consultation. 14-Day Free Trial applies to eligible plans. No credit card required to start. Installation/technician fee waived in participating areas. Domain, email, antivirus & desktop security availability may vary by plan. Unlimited usage has no data caps; fair-use policy may apply. T&Cs apply."
                : "* $50 gift voucher issued post first qualified consultation. 14-Day Free Trial applies to eligible plans... "}
              <button
                onClick={handleReadMore}
                className="text-sm text-blue-500 cursor-pointer underline"
              >
                {isReadMore ? "Read Less" : "Read More"}
              </button>
            </p>
          </div>
        </section>
      )}
      {/* Modal variant */}
      {variant === "modal" && open && !isBookingPage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offers-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] "
            onClick={() => close("backdrop")}
          />
          <div className="relative z-10 m-3 w-full max-w-[90%] sm:max-w-3xl rounded-2xl border border-black/10 bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-black/10">
              <div>
                <p className="text-xs tracking-widest uppercase">
                  Special Offers
                </p>
                <h3 id="offers-title" className="text-2xl font-extrabold">
                  Kickstart with Free Perks
                </h3>
              </div>
              <button
                onClick={() => close("closebtn")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
                aria-label="Close"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            <div className="px-5 pb-5 pt-4">
              {step === "offers" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 overflow-y-auto max-h-[400px]">
                    {offers.map((o) => (
                      <article
                        key={o.id}
                        className="group relative rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="text-2xl leading-none select-none"
                            aria-hidden="true"
                          >
                            {o.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-[13px] md:text-lg leading-tight">
                                {o.title}
                              </h4>
                              {o.tag && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-black/15">
                                  {o.tag}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[10px] text-black/70 md:text-[16px]">
                              {o.blurb}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <p className="mt-4 text-[11px] md:text-[13px] text-black/60">
                    {isReadMore
                      ? "* $50 gift voucher issued post first qualified consultation. 14-Day Free Trial applies to eligible plans. No credit card required to start. Installation/technician fee waived in participating areas. Domain, email, antivirus & desktop security availability may vary by plan. Unlimited usage has no data caps; fair-use policy may apply. T&Cs apply."
                      : "* $50 gift voucher issued post first qualified consultation. 14-Day Free Trial applies to eligible plans... "}
                    <button
                      onClick={handleReadMore}
                      className="text-sm text-blue-500 cursor-pointer underline"
                    >
                      {isReadMore ? "Read Less" : "Read More"}
                    </button>
                  </p>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <button
                      onClick={handleBook}
                      className="inline-flex items-center justify-center rounded-xl border border-black bg-gray-800 px-4 py-2 text-white text-sm font-semibold hover:opacity-90"
                    >
                      Book Free Appointment
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => close("not_now")}
                        className="text-sm text-black/70 underline-offset-4 hover:underline"
                      >
                        Not now
                      </button>
                      <button
                        onClick={() => {
                          try {
                            localStorage.setItem(LS_KEY_LAST, nowISO());
                          } catch {}
                          close("dont_show");
                        }}
                        className="text-sm text-black/70 underline-offset-4 hover:underline"
                      >
                        {`Don’t show for ${cooldownDays} days`}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === "providers" && (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Choose a provider</h4>
                    <button
                      onClick={() => setStep("offers")}
                      className="text-sm text-black/70 underline-offset-4 hover:underline"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 overflow-y-auto max-h-[400px]">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => chooseProvider(p.name)}
                        className="text-left rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl" aria-hidden="true">
                            {p.icon || <FiWifi size={22} />}
                          </div>
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-black/60">
                              Click to continue
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
