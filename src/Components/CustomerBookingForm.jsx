import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

/*************************************
 * Utilities
 *************************************/
const CURRENCY = (n) => `$${Number(n || 0).toFixed(2)}`;
const parsePrice = (str) => {
  if (!str) return 0;
  const m = String(str)
    .replace(/,/g, "")
    .match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
};
const cn = (...classes) => classes.filter(Boolean).join(" ");
const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

// simple address validator used by gating
const isAddressFilled = (a = {}) =>
  Boolean(a.street && a.city && a.state && a.zip);

// localStorage draft key
const DRAFT_KEY = "zenith_booking_draft_v1";

/*************************************
 * Global pricing tables / commonly reused constants
 *************************************/
const STATIC_IP_TIERS_DEFAULT = [
  { qty: 0, price: 0 },
  { qty: 1, price: 20 },
  { qty: 5, price: 30 },
  { qty: 13, price: 40 },
  { qty: 29, price: 60 },
];

const INSTALLATION = {
  SELF: { id: "self", name: "Self-installation kit", fee: 0 },
  PRO: { id: "pro", name: "Professional Installation", fee: 99 },
  SMB: { id: "smb", name: "SMB Free Truck Roll – Approval Required", fee: 0 },
};

// Contact details for CTA (env first, sensible fallback)
const SALES_PHONE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_SALES_PHONE) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.VITE_SALES_PHONE) ||
  "+1-555-555-1212";

const SALES_EMAIL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_SALES_EMAIL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.VITE_SALES_EMAIL) ||
  "sales@yourdomain.com";

/*************************************
 * Provider configuration (single source of truth)
 *************************************/
const PROVIDERS = {
  "spectrum-business": {
    displayName: "Spectrum Business",
    category: "internet_voice",
    plans: [
      {
        title: "Internet Only",
        price: "Starting at $65/mo",
        details: [
          "500 Mbps Internet: $59.99/mo Speeds up to 1 Gbps available in select areas Wireless speeds may vary"
        ],
      },
      {
        title: "Internet + Phone",
        price: "$70/mo",
        details: [
          "500 Mbps Internet: $59.99/mo Business Voice: $29.99/mo Speeds up to 1 Gbps available in select areas Wireless speeds may vary"
        ],
      },
      {
        title: "Internet + Phone + TV",
        price: "$100/mo",
        details: [
          "500 Mbps Internet: $59.99/mo Business Voice: $29.99/mo TV Essentials: $29.99/mo Speeds up to 1 Gbps available in select areas Wireless speeds may vary"
        ],
      },
      {
        title: "Internet + Phone + TV + Mobile",
        price: "$100/mo",
        details: [
          "500 Mbps Internet: $59.99/mo Business Voice: $29.99/mo TV Essentials: $29.99/mo Mobile line included free for 12 months Speeds up to 1 Gbps available in select areas Wireless speeds may vary"
        ],
      },
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {
      businessWifi: { price: 10, includedIfPlanTitlesContain: ["1 Gbps"] },
      staticIpTiers: STATIC_IP_TIERS_DEFAULT,
      wirelessBackup: { price: 20 },
      streamingTv: { price: 40 },
      appleTV4K: { quoteOnly: true },
      cableTv: { quoteOnly: true },
      roku: { price: 5 },
      telephoneLine: { price: 20 },
    },
    installationOptions: [INSTALLATION.SELF, INSTALLATION.SMB],
  },

  "att-business": {
    displayName: "AT&T Business",
    category: "internet_voice",
    plans: [
      {
        title: "300 Mbps Internet",
        promo: "Get 1 month free",
        price: "$40/mo",
        details: [
          "Perfect for e-commerce operations and collaboration between office and virtual employees.",
        ],
      },
      {
        title: "500 Mbps Internet",
        promo: "Get 1 month free",
        price: "$80/mo",
        details: ["Faster speed and more bandwidth to support more devices."],
      },
      {
        title: "1 GIG Internet",
        promo: "Get 2 months free",
        price: "$130/mo",
        details: [
          "Superfast 1 GIG internet for more efficient work and enhanced collaboration.",
        ],
      },
      {
        title: "2 GIG Internet",
        promo: "Get 2 months free",
        price: "$155/mo",
        details: ["Supports more employees and cutting-edge technology."],
      },
      {
        title: "5 GIG Internet",
        promo: "Get 2 months free",
        price: "$255/mo",
        details: [
          "Supports the most cutting-edge technologies of today and tomorrow.",
        ],
      },
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {
      businessWifi: null,
      staticIpTiers: STATIC_IP_TIERS_DEFAULT,
      wirelessBackup: null,
      streamingTv: null,
      roku: null,
      telephoneLine: { price: 15 },
    },
    installationOptions: [INSTALLATION.PRO],
  },

  "acc-business": {
    displayName: "ACC Business",
    category: "internet_voice",
    plans: [
      {
        title: "300 Mbps Internet",
        price: "$70/mo",
        details: ["1-year contract required"],
      },
      { title: "Internet 300", price: "$80/mo" },
      {
        title: "Internet 500 ",
        price: "$95/mo",
        details: ["Subject to availability"],
      },
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {
      staticIpTiers: STATIC_IP_TIERS_DEFAULT,
      streamingTv: null,
      businessWifi: null,
      telephoneLine: null,
    },
    installationOptions: [INSTALLATION.PRO],
  },

  "comcast-business": {
    displayName: "Comcast Business",
    category: "internet_voice",
    plans: [
      {
        title: " Contact Agent",
        speed: "",
        uploadSpeed: "",
        price: "",
        bestFor: [
        
        ],
      },
      
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {
      staticIpTiers: STATIC_IP_TIERS_DEFAULT,
      streamingTv: null,
      businessWifi: null,
      telephoneLine: { price: 20 },
    },
    installationOptions: [INSTALLATION.PRO],
  },

  ringcentral: {
    displayName: "RingCentral",
    category: "internet_voice",
    plans: [
      {
        title: "Core",
        oldPrice: "$30",
        price: "$20/user/month",
        billing: "paid annually",
        description:
          "Start communicating effectively with reliable phone, HD video, and messaging essentials for small organizations.",
        features: [
          "AI Receptionist for 24/7 call answering (Add-on),",
          "AI Assistant for call transcriptions and captions,",
          "Unlimited domestic calling,",
          "Business SMS and MMS",
        ],
      },
      {
        title: "Advanced (Most popular)",
        oldPrice: "$35",
        price: "$25/user/month",
        billing: "paid annually",
        description:
          "Elevate customer experiences with automation, superior service tools, and multi-site management solutions.",
        features: [
          "AI Receptionist for 24/7 call answering (Add-on),",
          "AI Assistant for call notes and summaries,",
          "Auto call recording,",
          "Connect multiple sites,",
        ],
      },
      {
        title: "Ultra",
        oldPrice: "$45",
        price: "$35/user/month",
        billing: "paid annually",
        description:
          "Leverage extensive functionality with added storage, analytics, and advanced tools for large organizations.",
        features: [
          "AI Receptionist for 24/7 call answering (Add-on),",
          "AI Assistant for SMS and messaging,",
          "Customizable analytics and reporting,",
          "12 months of analytics and reporting history",
        ],
      },
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {},
    installationOptions: [INSTALLATION.SELF],
  },

  "spectrum-voip": {
    displayName: "Spectrum VoIP",
    category: "internet_voice",
    plans: [
      {
        title: "Core",
        category: "Phones",
        service: "Business Hosted VoIP",
        price: "As low as $19.95/user",
        term: "Contract or Month-to-month",
        oneTimeCharge: "Contract – None | Month-to-month – Equipment + install",
        bundleSave:
          "When bundled with phones, receive Free install + up to 10% off",
      },
    ],
    voice: { enabled: true, pricePerLine: 20 },
    addons: {},
    installationOptions: [INSTALLATION.SELF],
  },
};

const resolveProviderKey = (rawName = "") => {
  const n = rawName.toLowerCase();
  if (n.includes("spectrum voip")) return "spectrum-voip";
  if (n.includes("spectrum")) return "spectrum-business";
  if (n.includes("ringcentral")) return "ringcentral";
  if (n.includes("comcast")) return "comcast-business";
  if (n.includes("acc")) return "acc-business";
  if (n.includes("at&t") || n.includes("att")) return "att-business";
  return "spectrum-business";
};

/*************************************
 * Price calculator
 *************************************/
function computePrice({
  providerCfg,
  selectedPlanTitle,
  internet,
  comm,
  install,
  telephoneLines,
}) {
  const plan = (providerCfg.plans || []).find(
    (p) => p.title === selectedPlanTitle
  );
  let monthly = parsePrice(plan?.price) || 0;

  // VOICE (per-line)
  if (providerCfg.voice?.enabled) {
    const lines = Math.max(0, Number(comm?.extraPhoneLines || 0));
    monthly += (providerCfg.voice.pricePerLine || 0) * lines;
  }

  // Added Telephone Lines add-on (separate from voice lines)
  if (providerCfg.addons?.telephoneLine && Number(telephoneLines) > 0) {
    monthly +=
      Number(telephoneLines) *
      Number(providerCfg.addons.telephoneLine.price || 0);
  }

  // Business WiFi (if offered and NOT included with this plan)
  const wifiCfg = providerCfg.addons?.businessWifi;
  const isWifiIncluded = wifiCfg?.includedIfPlanTitlesContain?.some((needle) =>
    (selectedPlanTitle || "").toLowerCase().includes(needle.toLowerCase())
  );
  if (internet.addBusinessWifi && wifiCfg && !isWifiIncluded)
    monthly += Number(wifiCfg.price || 0);

  // Static IPs (tiered)
  const tiers = providerCfg.addons?.staticIpTiers || [];
  const reqQty = Math.max(0, Number(internet.staticIpQty || 0));
  let staticIpPrice = 0;
  for (const t of tiers)
    if (t.qty <= reqQty) staticIpPrice = Number(t.price || 0);
  monthly += staticIpPrice;

  // Wireless backup
  if (internet.wirelessBackup && providerCfg.addons?.wirelessBackup)
    monthly += Number(providerCfg.addons.wirelessBackup.price || 0);

  // Streaming TV
  if (comm.tvStream && providerCfg.addons?.streamingTv)
    monthly += Number(providerCfg.addons.streamingTv.price || 0);

  // Roku
  if (internet.roku && providerCfg.addons?.roku)
    monthly += Number(providerCfg.addons.roku.price || 0);

  // Business Connect (flat $20 — if you keep this product)
  if (comm.businessConnect) monthly += 20;

  // One-time installation
  const chosen = providerCfg.installationOptions.find(
    (x) => x.id === install?.type
  );
  const oneTime = chosen ? Number(chosen.fee || 0) : 0;

  return { monthly: Math.max(0, monthly), oneTime };
}

/*************************************
 * Main component
 *************************************/
export default function BookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isPlacing, setIsPlacing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const providerFromState =
    location.state?.provider || location.state?.name || "";
  const providerFromQuery =
    new URLSearchParams(location.search).get("provider") || "";
  const providerNameFromRoute = providerFromState || providerFromQuery;

  const providerKey = resolveProviderKey(providerNameFromRoute);
  const providerCfg = PROVIDERS[providerKey];

  const [telephoneLines, setTelephoneLines] = useState(0);

  const isComcast = providerKey === "comcast-business";

  // ---------- State ----------
  const [contact, setContact] = useState({
    businessName: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    mobile: "",
    notes: "",
    sameAsService: true,
    paperless: true,
    autoPay: true,
  });

  const [serviceAddress, setServiceAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [internet, setInternet] = useState({
    planId: "", // plan title
    addBusinessWifi: false,
    staticIpQty: 0,
    wirelessBackup: false,
    appleTV4K: false,
    cableTv: false,
    roku: false,
  });

  const [comm, setComm] = useState({
    voice: providerCfg.voice?.enabled || false,
    directoryListing: "private",
    industryHeader: "",
    phoneNumberType: "new",
    extraPhoneLines: 0,
    tvStream: false,
    mobile: false,
    businessConnect: false,
  });

  const [install, setInstall] = useState({
    type: providerCfg.installationOptions[0]?.id || INSTALLATION.PRO.id,
    recipientFirst: "",
    recipientLast: "",
  });

  const [property, setProperty] = useState({
    sameAsContact: false,
    name: "",
    phone: "",
    email: "",
  });
  const [authorizedContacts, setAuthorizedContacts] = useState([
    { type: "Fully Authorized User", name: "" },
  ]);

  // ---------- Restore draft (on mount) ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);

      if (d.step) setStep(d.step);
      if (d.contact) setContact(d.contact);
      if (d.serviceAddress) setServiceAddress(d.serviceAddress);
      if (d.billingAddress) setBillingAddress(d.billingAddress);
      if (d.internet) setInternet(d.internet);
      if (d.comm) setComm(d.comm);
      if (d.install) setInstall(d.install);
      if (d.property) setProperty(d.property);
      if (Array.isArray(d.authorizedContacts))
        setAuthorizedContacts(d.authorizedContacts);
      if (typeof d.telephoneLines === "number")
        setTelephoneLines(d.telephoneLines);
    } catch (e) {
      console.warn("Draft load failed:", e);
    }
  }, []);

  // ---------- Autosave draft ----------
  useEffect(() => {
    const draft = {
      step,
      contact,
      serviceAddress,
      billingAddress,
      internet,
      comm,
      install,
      property,
      authorizedContacts,
      telephoneLines,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [
    step,
    contact,
    serviceAddress,
    billingAddress,
    internet,
    comm,
    install,
    property,
    authorizedContacts,
    telephoneLines,
  ]);

  // Default plan selection when provider changes
  const planTitles = providerCfg.plans?.map((p) => p.title) || [];
  useEffect(() => {
    setInternet((prev) => {
      const nextPlanId = planTitles.includes(prev.planId)
        ? prev.planId
        : providerKey === "spectrum-business"
        ? "Internet + Phone"
        : providerCfg.plans?.[0]?.title || "";
      
      if (providerKey === "spectrum-business") {
        return {
          ...prev,
          planId: nextPlanId,
          addBusinessWifi: true,
          staticIpQty: 1, // 1 for $20/mo
          wirelessBackup: true,
          appleTV4K: true,
          cableTv: true,
          roku: true,
        };
      }
      return {
        ...prev,
        planId: nextPlanId,
      };
    });

    if (providerKey === "spectrum-business") {
      setComm((prev) => ({
        ...prev,
        tvStream: true,
      }));
    }
  }, [providerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPlan = useMemo(
    () => providerCfg.plans?.find((p) => p.title === internet.planId),
    [providerCfg, internet.planId]
  );
  const isOneGbps = useMemo(
    () => /(^|\s)1\s*G(bps|b)?/i.test(selectedPlan?.title || ""),
    [selectedPlan]
  );

  // If 1 Gbps, ensure addBusinessWifi is OFF (included)
  useEffect(() => {
    const wifiCfg = providerCfg.addons?.businessWifi;
    const included = wifiCfg?.includedIfPlanTitlesContain?.some((needle) =>
      (selectedPlan?.title || "").toLowerCase().includes(needle.toLowerCase())
    );
    if (included && internet.addBusinessWifi)
      setInternet((prev) => ({ ...prev, addBusinessWifi: false }));
  }, [selectedPlan, providerCfg, internet.addBusinessWifi]);

  // Derived: total voice lines (only if provider supports voice)
  const totalVoiceLines = useMemo(
    () =>
      providerCfg.voice?.enabled
        ? Math.max(0, Number(comm.extraPhoneLines || 0))
        : 0,
    [comm.extraPhoneLines, providerCfg.voice?.enabled]
  );

  // Pricing
  const price = useMemo(
    () =>
      computePrice({
        providerCfg,
        selectedPlanTitle: internet.planId,
        internet,
        comm,
        install,
        telephoneLines,
      }),
    [providerCfg, internet, comm, install, telephoneLines]
  );

  const TOTAL_STEPS = 5;
  const Stepper = ({ step }) => (
    <div className="mb-6">
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100 ">
        <div
          className="h-1 rounded-full bg-[#E8611A] transition-all"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  );

  // Step gating (fixed to match visible steps)
  const showInternetArea = providerCfg.category !== "voice_only";
  const canContinueFromStep = useMemo(() => {
    switch (step) {
      // STEP 1 — Plans & Add-ons
      case 1: {
        if (!showInternetArea) return true;
        const hasPlans = (providerCfg.plans?.length || 0) > 0;
        return hasPlans ? Boolean(internet.planId) : true;
      }
      // STEP 2 — Installation
      case 2: {
        if (providerCfg.installationOptions.length === 0) return true;
        const selfInstall = install.type === INSTALLATION.SELF.id;
        const needsRecipient =
          selfInstall &&
          ["spectrum-business", "ringcentral", "spectrum-voip"].includes(
            providerKey
          );
        return needsRecipient
          ? Boolean(install.recipientFirst && install.recipientLast)
          : true;
      }
      // STEP 3 — Contact & Billing
      case 3: {
        const nameOk = contact.firstName.trim() && contact.lastName.trim();
        const emailsMatch =
          contact.email && contact.email === contact.confirmEmail;
        const serviceOk = isAddressFilled(serviceAddress);
        const billingOk =
          contact.sameAsService || isAddressFilled(billingAddress);
        return Boolean(nameOk && emailsMatch && serviceOk && billingOk);
      }
      // STEP 4 — Property & Authorized Contacts (optional)
      case 4:
        return true;
      // STEP 5 — Review
      default:
        return true;
    }
  }, [
    step,
    showInternetArea,
    providerCfg,
    providerKey,
    internet.planId,
    install.type,
    install.recipientFirst,
    install.recipientLast,
    contact.firstName,
    contact.lastName,
    contact.email,
    contact.confirmEmail,
    contact.sameAsService,
    serviceAddress,
    billingAddress,
  ]);

  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== TOTAL_STEPS) return;

    setIsPlacing(true);
    const payload = {
      provider: providerCfg.displayName,
      contact,
      serviceAddress,
      billingAddress: contact.sameAsService ? serviceAddress : billingAddress,
      internet,
      comm,
      install,
      property,
      authorizedContacts,
      telephoneLines,
      pricing: price,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, payload);
      // clear draft on success
      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit order");
      setSubmitted(false);
    } finally {
      setIsPlacing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && step !== TOTAL_STEPS) {
      e.preventDefault();
      if (canContinueFromStep) goNext();
    }
  };

  // UI helpers
  const showAddon = (key) => Boolean(providerCfg.addons?.[key]);

  return (
    <div className="mx-auto max-w-6xl p-4 pt-28 md:p-8 md:pt-32">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete your order in a few quick steps.
          </p>
          <div className="w-36 h-[4px] bg-[#E8611A] mt-3 rounded-full" />
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-[#E8611A] bg-white px-4 py-1 text-xs font-semibold text-[#E8611A]">
            {providerCfg.displayName}
          </span>
          <span className="text-sm font-medium text-gray-600">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* Progress */}
      <Stepper step={step} />

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT – form */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="space-y-6"
        >
          {/* STEP 1 — Plans & Add-ons (provider aware) */}
          {step === 1 && (
            <>
              {showInternetArea && isComcast && (
                <Card
                  title={`${providerCfg.displayName} – For Best Pricing Contact Agent`}
                >
                  <div className="space-y-4 text-sm text-gray-700">
                    <p>
                      Comcast Business pricing varies by address, term, and
                      current promos. For the most accurate quote, please
                      connect with our sales team:
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`tel:${SALES_PHONE.replace(/[^+\d]/g, "")}`}
                        className="rounded-xl bg-[#E8611A] px-4 py-2 text-white font-semibold hover:bg-[#C44E12]"
                      >
                        Call {SALES_PHONE}
                      </a>
                      <a
                        href={`mailto:${SALES_EMAIL}?subject=Comcast%20Business%20Quote`}
                        className="rounded-xl border px-4 py-2 font-semibold hover:bg-gray-50"
                      >
                        Email {SALES_EMAIL}
                      </a>
                    </div>

                    <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                      Tip: Have your service address ready so we can pull exact
                      build & promo availability.
                    </div>

                    <div className="text-xs text-gray-500">
                      You can still proceed with the next steps to share your
                      contact and address. We’ll finalize the plan and pricing
                      with you.
                    </div>
                  </div>
                </Card>
              )}

              {showInternetArea && !isComcast && (
                <Card title={`Customize Service – ${providerCfg.displayName}`}>
                  {(providerCfg.plans?.length || 0) > 0 ? (
                    <div className="space-y-4">
                      {providerCfg.plans.map((p) => (
                        <ToggleOption
                          key={p.title}
                          checked={internet.planId === p.title}
                          onChange={() =>
                            setInternet({ ...internet, planId: p.title })
                          }
                          title={p.title}
                          subtitle={p.inbundle || ""}
                          price={p.price}
                          details={p.details}
                          features={p.features}
                          bestFor={p.bestFor}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700">
                      No internet plans for this provider. Continue below.
                    </div>
                  )}

                  {/* Add-ons */}
                  <div className="mt-6 space-y-4">
                    {/* Business WiFi */}
                    {providerCfg.addons?.businessWifi &&
                      (isOneGbps ? (
                        <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                          Wi-Fi is included with this plan.
                        </div>
                      ) : (
                        <Checkbox
                          id="wifi"
                          label={`Add Business WiFi (+$${providerCfg.addons.businessWifi.price}/mo per modem)`}
                          checked={internet.addBusinessWifi}
                          onChange={(v) =>
                            setInternet({ ...internet, addBusinessWifi: v })
                          }
                        />
                      ))}

                    {/* Static IP */}
                    {showAddon("staticIpTiers") && (
                      <Select
                        id="static-ip"
                        label="Static IP Addresses"
                        value={internet.staticIpQty}
                        onChange={(v) =>
                          setInternet({ ...internet, staticIpQty: Number(v) })
                        }
                        options={(providerCfg.addons.staticIpTiers || []).map(
                          (x) => ({
                            value: x.qty,
                            label: `${x.qty} for $${x.price}/mo`,
                          })
                        )}
                      />
                    )}

                    {/* Telephone Lines */}
                    {showAddon("telephoneLine") && (
                      <NumberStepper
                        id="telephone-lines"
                        label={`Additional Telephone Lines ($${providerCfg.addons.telephoneLine.price}/line)`}
                        value={telephoneLines}
                        onChange={(val) => setTelephoneLines(val)}
                        min={0}
                        max={99}
                      />
                    )}

                    {/* Wireless Backup */}
                    {showAddon("wirelessBackup") && (
                      <Checkbox
                        id="backup"
                        label={`Wireless Internet Backup ($20/line)`}
                        checked={internet.wirelessBackup}
                        onChange={(v) =>
                          setInternet({ ...internet, wirelessBackup: v })
                        }
                      />
                    )}

                    {/* Streaming TV */}
                    {showAddon("streamingTv") && (
                      <Checkbox
                        id="tvstream"
                        label={`${
                          providerCfg.displayName.includes("Spectrum")
                            ? "Spectrum Streaming TV"
                            : "Streaming TV"
                        } ($${providerCfg.addons.streamingTv.price}/mo)`}
                        checked={comm.tvStream}
                        onChange={(v) => setComm({ ...comm, tvStream: v })}
                      />
                    )}

                    {/* Quote-only boxes */}
                    {providerCfg.addons?.appleTV4K?.quoteOnly && (
                      <Checkbox
                        id="appletv"
                        label="Apple TV 4K (Get a Quotation)"
                        checked={internet.appleTV4K}
                        onChange={(v) =>
                          setInternet({ ...internet, appleTV4K: v })
                        }
                      />
                    )}

                    {providerCfg.addons?.cableTv?.quoteOnly && (
                      <Checkbox
                        id="cabletv"
                        label="Cable TV (Get a Quotation)"
                        checked={internet.cableTv}
                        onChange={(v) =>
                          setInternet({ ...internet, cableTv: v })
                        }
                      />
                    )}

                    {/* Roku */}
                    {showAddon("roku") && (
                      <Checkbox
                        id="roku"
                        label={`Roku ($${providerCfg.addons.roku.price}/mo)`}
                        checked={internet.roku}
                        onChange={(v) => setInternet({ ...internet, roku: v })}
                      />
                    )}
                  </div>
                </Card>
              )}

              {!showInternetArea && (
                <Card title={`${providerCfg.displayName} – Voice / UCaaS`}>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      Internet plans are not shown for this provider. Configure
                      voice below.
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* STEP 2 — Installation */}
          {step === 2 && providerCfg.installationOptions.length > 0 && (
            <Card title="Installation Options">
              <div className="space-y-3">
                {providerCfg.installationOptions.map((opt) => (
                  <RadioRow
                    key={opt.id}
                    name="install"
                    checked={install.type === opt.id}
                    onChange={() => setInstall({ ...install, type: opt.id })}
                    title={opt.name}
                    price={opt.fee ? CURRENCY(opt.fee) : "Included"}
                  />
                ))}

                {(providerKey === "spectrum-voip" ||
                  providerKey === "ringcentral") &&
                  install.type === INSTALLATION.SELF.id && (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <Input
                        id="recipient-first"
                        label="Recipient First Name"
                        required
                        value={install.recipientFirst}
                        onChange={(v) =>
                          setInstall({ ...install, recipientFirst: v })
                        }
                      />
                      <Input
                        id="recipient-last"
                        label="Recipient Last Name"
                        required
                        value={install.recipientLast}
                        onChange={(v) =>
                          setInstall({ ...install, recipientLast: v })
                        }
                      />
                    </div>
                  )}
              </div>

              {/* Extra inputs only if Spectrum + Self-install */}
              {providerKey === "spectrum-business" &&
                install.type === INSTALLATION.SELF.id && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Input
                      id="recipient-first-spectrum"
                      label="Recipient First Name"
                      required
                      value={install.recipientFirst}
                      onChange={(v) =>
                        setInstall({ ...install, recipientFirst: v })
                      }
                    />
                    <Input
                      id="recipient-last-spectrum"
                      label="Recipient Last Name"
                      required
                      value={install.recipientLast}
                      onChange={(v) =>
                        setInstall({ ...install, recipientLast: v })
                      }
                    />
                  </div>
                )}
            </Card>
          )}

          {/* STEP 3 — Contact & Billing Info */}
          {step === 3 && (
            <Card title="Contact & Billing Info">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="biz"
                  label="Business Name"
                  value={contact.businessName}
                  onChange={(v) => setContact({ ...contact, businessName: v })}
                />
                <Input
                  id="title"
                  label="Title"
                  value={contact.title}
                  onChange={(v) => setContact({ ...contact, title: v })}
                />
                <Input
                  id="fn"
                  label="First Name"
                  required
                  value={contact.firstName}
                  onChange={(v) => setContact({ ...contact, firstName: v })}
                />
                <Input
                  id="ln"
                  label="Last Name"
                  required
                  value={contact.lastName}
                  onChange={(v) => setContact({ ...contact, lastName: v })}
                />
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  required
                  value={contact.email}
                  onChange={(v) => setContact({ ...contact, email: v })}
                />
                <Input
                  id="cemail"
                  type="email"
                  label="Confirm Email Address"
                  required
                  value={contact.confirmEmail}
                  onChange={(v) => setContact({ ...contact, confirmEmail: v })}
                />
                <Input
                  id="phone"
                  label="Contact Phone"
                  value={contact.phone}
                  onChange={(v) => setContact({ ...contact, phone: v })}
                />
                <Input
                  id="mobile"
                  label="Mobile (optional)"
                  value={contact.mobile}
                  onChange={(v) => setContact({ ...contact, mobile: v })}
                />
                <Textarea
                  id="notes"
                  className="md:col-span-2"
                  label="Notes (optional)"
                  value={contact.notes}
                  onChange={(v) => setContact({ ...contact, notes: v })}
                />
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <AddressBlock
                  title="Service Address"
                  value={serviceAddress}
                  onChange={setServiceAddress}
                />
                {!contact.sameAsService && (
                  <AddressBlock
                    title="Billing Address"
                    value={billingAddress}
                    onChange={setBillingAddress}
                  />
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Checkbox
                  id="same"
                  label="Billing address same as service address"
                  checked={contact.sameAsService}
                  onChange={(v) => setContact({ ...contact, sameAsService: v })}
                />
                <Checkbox
                  id="paperless"
                  label="Paperless billing (email notifications)"
                  checked={contact.paperless}
                  onChange={(v) => setContact({ ...contact, paperless: v })}
                />
              </div>
            </Card>
          )}

          {/* STEP 4 — Property & Contacts */}
          {step === 4 && (
            <Card title="Property Management & Authorized Contacts">
              <div className="space-y-6">
                <fieldset className="space-y-3">
                  <h4 className="font-semibold">Property Management</h4>
                  <Checkbox
                    id="same-contact"
                    label="Same as primary contact"
                    checked={property.sameAsContact}
                    onChange={(v) =>
                      setProperty({ ...property, sameAsContact: v })
                    }
                  />
                  {!property.sameAsContact && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <Input
                        id="pm-name"
                        label="Full Name"
                        value={property.name}
                        onChange={(v) => setProperty({ ...property, name: v })}
                      />
                      <Input
                        id="pm-phone"
                        label="Phone"
                        value={property.phone}
                        onChange={(v) => setProperty({ ...property, phone: v })}
                      />
                      <Input
                        id="pm-email"
                        type="email"
                        label="Email"
                        value={property.email}
                        onChange={(v) => setProperty({ ...property, email: v })}
                      />
                    </div>
                  )}
                </fieldset>

                <fieldset className="space-y-3">
                  <h4 className="font-semibold">
                    Additional Authorized Contacts
                  </h4>
                  {authorizedContacts.map((c, i) => (
                    <div
                      key={i}
                      className="grid gap-3 md:grid-cols-[220px_1fr_auto]"
                    >
                      <Select
                        id={`auth-type-${i}`}
                        label="Authorization Type"
                        value={c.type}
                        onChange={(v) => updateAuthorized(i, { ...c, type: v })}
                        options={[
                          "Fully Authorized User",
                          "Billing Only",
                          "Technical",
                        ].map((t) => ({
                          value: t,
                          label: t,
                        }))}
                      />
                      <Input
                        id={`auth-name-${i}`}
                        label="Full Name"
                        value={c.name}
                        onChange={(v) => updateAuthorized(i, { ...c, name: v })}
                      />
                      <button
                        type="button"
                        onClick={() => removeAuthorized(i)}
                        className="self-end rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setAuthorizedContacts((a) => [
                        ...a,
                        { type: "Fully Authorized User", name: "" },
                      ])
                    }
                    className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    + Add Contact
                  </button>
                </fieldset>
              </div>
            </Card>
          )}

          {/* STEP 5 — Review */}
          {step === 5 && (
            <Card title="Review & Checkout">
              <div className="space-y-4">
                <SummaryRow label="Provider" value={providerCfg.displayName} />
                {showInternetArea && (
                  <>
                    <SummaryRow
                      label="Internet Plan"
                      value={internet.planId || "—"}
                    />
                    <SummaryRow
                      label="Business WiFi"
                      value={(() => {
                        const wifiCfg = providerCfg.addons?.businessWifi;
                        const included =
                          wifiCfg?.includedIfPlanTitlesContain?.some((needle) =>
                            (selectedPlan?.title || "")
                              .toLowerCase()
                              .includes(needle.toLowerCase())
                          );
                        return included
                          ? "Included"
                          : internet.addBusinessWifi
                          ? "Yes"
                          : "No";
                      })()}
                    />
                    {showAddon("staticIpTiers") && (
                      <SummaryRow
                        label="Static IPs"
                        value={internet.staticIpQty}
                      />
                    )}
                    {showAddon("wirelessBackup") && (
                      <SummaryRow
                        label="Wireless Backup"
                        value={internet.wirelessBackup ? "Yes" : "No"}
                      />
                    )}
                    {providerCfg.addons?.appleTV4K?.quoteOnly && (
                      <SummaryRow
                        label="Apple TV 4K"
                        value={internet.appleTV4K ? "Yes" : "No"}
                      />
                    )}
                    <div className="h-px w-full bg-gray-200" />
                  </>
                )}

                {showAddon("telephoneLine") && (
                  <SummaryRow
                    label="Additional Telephone Lines"
                    value={
                      telephoneLines > 0
                        ? `${telephoneLines} lines - $${
                            telephoneLines *
                            (providerCfg.addons.telephoneLine.price || 0)
                          }`
                        : "None"
                    }
                  />
                )}

                {providerCfg.voice?.enabled && (
                  <>
                    <SummaryRow
                      label="Business Voice"
                      value={totalVoiceLines > 0 ? "Enabled" : "Disabled"}
                    />
                    <SummaryRow
                      label="Telephone Lines (Voice)"
                      value={totalVoiceLines}
                    />
                  </>
                )}

                {showAddon("streamingTv") && (
                  <SummaryRow
                    label="TV Stream"
                    value={comm.tvStream ? "Yes" : "No"}
                  />
                )}
                <SummaryRow
                  label="Business Connect"
                  value={comm.businessConnect ? "Yes" : "No"}
                />

                <div className="h-px w-full bg-gray-200" />
                {providerCfg.installationOptions.length > 0 && (
                  <SummaryRow
                    label="Installation"
                    value={
                      providerCfg.installationOptions.find(
                        (x) => x.id === install.type
                      )?.name
                    }
                  />
                )}

                <div className="rounded-lg bg-[#FEF3EC] p-4 text-sm">
                  <p className="font-semibold">
                    By submitting, you agree to billing and service policies.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-center items-center pt-8 border-t border-gray-100 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 mr-4 transition"
              >
                Back
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                disabled={!canContinueFromStep}
                onClick={() => canContinueFromStep && goNext()}
                className={`rounded-xl px-12 py-3 font-semibold text-white transition duration-200 ${
                  canContinueFromStep
                    ? "bg-[#E8611A] hover:bg-[#C44E12]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            ) : null}
          </div>
        </form>

        {/* RIGHT – sticky summary */}
        <aside className="lg:sticky lg:top-8">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-xl font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-3">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <SummaryRow label="Provider" value={providerCfg.displayName} />
              {internet.planId && showInternetArea && (
                <SummaryRow label="Plan" value={internet.planId} />
              )}
              {providerCfg.voice?.enabled && totalVoiceLines > 0 && (
                <SummaryRow
                  label="Telephone lines (Voice)"
                  value={totalVoiceLines}
                />
              )}
              <SummaryRow
                label="Monthly (est.)"
                value={CURRENCY(price.monthly)}
              />
              <SummaryRow
                label="One-time fees"
                value={CURRENCY(price.oneTime)}
              />
            </div>
            <div className="mt-4 rounded-xl bg-gray-50/70 p-4 text-xs text-gray-500 leading-normal">
              Taxes, surcharges, and additional fees may apply at checkout.
            </div>
            <button
              type="button"
              onClick={
                step < TOTAL_STEPS
                  ? () => canContinueFromStep && goNext()
                  : handleSubmit
              }
              disabled={step < TOTAL_STEPS && !canContinueFromStep}
              className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white transition duration-200 ${
                step < TOTAL_STEPS
                  ? canContinueFromStep
                    ? "bg-[#E8611A] hover:bg-[#C44E12] cursor-pointer shadow-sm"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer shadow-sm"
              }`}
            >
              {step < TOTAL_STEPS ? "Next Step" : "Place Order"}
            </button>

            {isPlacing && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <FaCheckCircle className="text-yellow-500 text-5xl mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Placing your order, please wait...
                  </h2>
                  <p className="text-gray-600 mt-2">
                    We're processing your order. This may take a moment.
                  </p>
                </div>
              </div>
            )}

            {submitted && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Booked Successfully!
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Your order has been placed. We'll contact you soon.
                  </p>
                  <button
                    onClick={() => {
                      // ensure draft is cleared if user refreshes on success modal
                      localStorage.removeItem(DRAFT_KEY);
                      navigate("/");
                    }}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );

  // ---------- Helpers ----------
  function updateAuthorized(index, next) {
    setAuthorizedContacts((arr) => arr.map((x, i) => (i === index ? next : x)));
  }
  function removeAuthorized(index) {
    setAuthorizedContacts((arr) => arr.filter((_, i) => i !== index));
  }
}

/*************************************
 * Reusable UI primitives
 *************************************/
function Card({ title, children, className = "" }) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm transition",
        "hover:shadow-md",
        className
      )}
    >
      {title ? (
        <h2 className="mb-5 border-b border-gray-100 pb-4 text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function Field({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className = "",
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label} {required && <span className="text-[#E8611A]">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-[#E8611A]">
          {error}
        </p>
      )}
    </div>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  type = "text",
  className = "",
  required = false,
  hint,
  error,
  placeholder,
  disabled = false,
  autoComplete,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <Field
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={cn(hintId, errorId)}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm",
          "shadow-sm outline-none transition",
          "focus-visible:ring-2 focus-visible:ring-[#E8611A] focus-visible:ring-offset-0",
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-white",
          error ? "border-[#F47630]" : "border-gray-300"
        )}
      />
    </Field>
  );
}

function Textarea({
  id,
  label,
  value,
  onChange,
  className = "",
  required = false,
  hint,
  error,
  placeholder,
  disabled = false,
  rows = 4,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <Field
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={cn(hintId, errorId)}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm",
          "shadow-sm outline-none transition",
          "focus-visible:ring-2 focus-visible:ring-[#E8611A]",
          disabled
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-white",
          error ? "border-[#F47630]" : "border-gray-300"
        )}
      />
    </Field>
  );
}

function Checkbox({ id, label, checked, onChange, hint, disabled = false }) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1">
      <label
        className={cn(
          "flex items-start gap-3 text-sm",
          disabled && "opacity-60"
        )}
      >
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#E8611A] focus:ring-[#F47630] accent-[#E8611A] cursor-pointer"
          checked={!!checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          aria-describedby={hintId}
        />
        <span className="select-none font-medium text-gray-800 cursor-pointer">{label}</span>
      </label>
      {hint && (
        <p id={hintId} className="pl-7 text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  className = "",
  required = false,
  hint,
  error,
  disabled = false,
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <Field
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      className={className}
    >
      <select
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={cn(hintId, errorId)}
        className={cn(
          "w-full rounded-xl border px-3 py-2 text-sm bg-white",
          "shadow-sm outline-none transition focus:border-[#F47630] focus:ring-1 focus:ring-[#F47630]",
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white",
          error ? "border-[#F47630]" : "border-gray-300"
        )}
      >
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function ToggleOption({
  checked,
  onChange,
  title,
  subtitle,
  price,
  details,
  features,
  bestFor,
  className = "",
}) {
  const formatPrice = (priceStr) => {
    if (priceStr.includes("Starting at")) {
      const val = priceStr.replace("Starting at", "").trim();
      return (
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-600 font-medium">Starting at</span>
          <span className="text-base md:text-lg font-bold text-gray-900">{val}</span>
        </div>
      );
    }
    return <span className="text-base md:text-lg font-bold text-gray-900">{priceStr}</span>;
  };

  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border p-5 md:p-6 text-left transition duration-200",
        checked
          ? "border-[#F47630] bg-[#FEF3EC] ring-1 ring-[#F47630]"
          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm",
        className
      )}
      aria-pressed={!!checked}
    >
      <div className="min-w-0 pr-6">
        <div className="text-base md:text-lg font-bold text-gray-900">{title}</div>
        <div className="text-xs md:text-sm text-gray-500 mt-1.5 leading-relaxed max-w-xl">
          {Array.isArray(details) ? details.join(" ") : details}
        </div>
        {features && (
          <div className="text-gray-500 text-xs mt-1">
            {Array.isArray(features) ? features.join(" ") : features}
          </div>
        )}
        {bestFor && (
          <div className="text-gray-500 text-xs mt-1">
            {Array.isArray(bestFor) ? bestFor.join(" ") : bestFor}
          </div>
        )}
        {subtitle && (
          <div className="truncate text-sm text-gray-600 mt-1">{subtitle}</div>
        )}
      </div>
      <div className="text-right flex flex-col items-end justify-center min-w-[100px]">
        {formatPrice(price)}
        {checked && (
          <span className="text-xs font-semibold text-emerald-600 mt-1 block">Selected</span>
        )}
      </div>
    </button>
  );
}

function RadioRow({ name, checked, onChange, title, price, className = "" }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition",
        checked
          ? "border-[#F47630] bg-[#FEF3EC] shadow-sm"
          : "border-gray-200 hover:bg-gray-50",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={name}
          className="accent-[#E8611A]"
          checked={!!checked}
          onChange={onChange}
        />
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <span className="text-sm text-gray-700">{price}</span>
    </label>
  );
}

function SummaryRow({ label, value, className = "" }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-gray-100 py-3 text-sm last:border-b-0",
        className
      )}
    >
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{String(value ?? "—")}</span>
    </div>
  );
}

function AddressBlock({
  title = "Address",
  value,
  onChange,
  className = "",
  layout = "two-col",
}) {
  const grid = layout === "two-col" ? "grid gap-3 md:grid-cols-2" : "space-y-3";
  const base = slug(title);
  return (
    <fieldset className={cn("rounded-xl border bg-gray-50 p-4", className)}>
      <legend className="text-sm font-semibold text-gray-900">{title}</legend>
      <div className={cn("mt-3", grid)}>
        <Input
          id={`${base}-street`}
          label="Street"
          value={value.street}
          onChange={(v) => onChange({ ...value, street: v })}
        />
        <Input
          id={`${base}-city`}
          label="City"
          value={value.city}
          onChange={(v) => onChange({ ...value, city: v })}
        />
        <Input
          id={`${base}-state`}
          label="State"
          value={value.state}
          onChange={(v) => onChange({ ...value, state: v })}
        />
        <Input
          id={`${base}-zip`}
          label="ZIP"
          value={value.zip}
          onChange={(v) => onChange({ ...value, zip: v })}
        />
      </div>
    </fieldset>
  );
}

function NumberStepper({ id, label, value, onChange, min = 0, max }) {
  const dec = () => onChange?.(Math.max(min, Number(value || 0) - 1));
  const inc = () =>
    onChange?.(
      Math.min(max ?? Number.MAX_SAFE_INTEGER, Number(value || 0) + 1)
    );
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
          aria-label="decrease"
        >
          −
        </button>
        <div className="w-16 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-900 bg-white">
          {value}
        </div>
        <button
          type="button"
          onClick={inc}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition"
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  );
}
