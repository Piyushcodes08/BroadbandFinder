import React, { useMemo, useState } from "react";
import axios from "axios";

/* ------------------------------------------------------
 * Spectrum Business Checkout – STEP 1 EXACT UI (from flyer)
 * ------------------------------------------------------ */

/* Brand-ish colors approximated from flyer */
const BLUE = "#0b61a4";
const BLUE_DARK = "#064b80";

/* Internet speeds & promo pricing (when bundled) */
const INTERNET_PLANS = [
  {
    id: "premier500",
    title: "Premier 500 Mbps x 20 Mbps",
    price: 50,
    note: "when bundled with Voice for 1 year",
  },
  {
    id: "ultra750",
    title: "Ultra 750 Mbps x 35 Mbps",
    price: 80,
    note: "when bundled with Voice for 2 years",
  },
  {
    id: "gig1g",
    title: "Gig 1 Gig x 50 Mbps",
    price: 100,
    note: "when bundled with Voice for 2 years",
  },
];

/* TV packages (single source of truth; used in UI + pricing) */
const TV_PACKAGES = [
  { id: "none", name: "No TV", price: 0, blurb: "", caption: "" },
  {
    id: "businesstv",
    name: "Business TV",
    price: 40,
    blurb: "45+ channels, incl.",
    caption: "/mo when bundled",
    note: "Non-Bar and Restaurant customers only",
  },
  {
    id: "stream",
    name: "TV Stream",
    price: 40,
    blurb: "90+ channels, incl.",
    caption: "/mo when bundled with Internet",
  },
  {
    id: "premier",
    name: "Premier TV",
    price: 70,
    blurb: "90+ channels, incl.",
    caption: "",
  },
  {
    id: "sports",
    name: "Sports Fan TV",
    price: 60,
    blurb: "110+ channels, incl.",
    caption: "/mo when bundled with Internet",
    note: "Bar and Restaurant customers only",
  },
];

/* Mobile plans (per paid line) */
const MOBILE_PLANS = [
  { id: "unlimited", name: "Business Unlimited", price: 30 },
  { id: "plus", name: "Business Unlimited Plus", price: 40 },
];

/* Install */
const INSTALL = [
  { id: "standard", name: "Free standard installation", fee: 0 },
];

function currency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
const fmtBool = (b) => (b ? "Yes" : "No");
const fmtAddr = (a) => `${a.street}, ${a.city}, ${a.state} ${a.zip}`;

export default function SpectrumBusinessCheckout() {
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState(INTERNET_PLANS[0].id);
  const [addons, setAddons] = useState({
    // Internet add-ons
    advancedWifi: false,
    wirelessBackup: false,

    // Voice
    voiceLines: 0, // Business Phone ($20/line)
    connectSeats: 0, // Business Connect ($20/seat, min 2 if added)

    // Mobile
    mobilePlan: "unlimited",
    mobileLines: 0, // Paid lines only (1 free promo line not billed)

    // TV
    tvPackage: "none",
  });
  const [install, setInstall] = useState(INSTALL[0].id);
  const [contact, setContact] = useState({
    first: "",
    last: "",
    email: "",
    cemail: "",
    phone: "",
    svc: { street: "", city: "", state: "", zip: "" },
    billSame: true,
    bill: { street: "", city: "", state: "", zip: "" },
    notes: "",
  });
  const [placing, setPlacing] = useState(false);
  const [ok, setOk] = useState(false);

  const selectedPlan = useMemo(
    () => INTERNET_PLANS.find((p) => p.id === planId),
    [planId]
  );
  const selectedTV = useMemo(
    () => TV_PACKAGES.find((t) => t.id === addons.tvPackage),
    [addons.tvPackage]
  );
  const selectedMobile = useMemo(
    () => MOBILE_PLANS.find((m) => m.id === addons.mobilePlan),
    [addons.mobilePlan]
  );
  const selectedInstall = useMemo(
    () => INSTALL.find((i) => i.id === install),
    [install]
  );

  /* Qualifiers for free-months: Voice (>=1), Connect (>=2), TV (!none), Paid Mobile (>=1) */
  const qualifiers = useMemo(() => {
    const q =
      (addons.voiceLines > 0 ? 1 : 0) +
      (addons.connectSeats >= 2 ? 1 : 0) +
      (addons.tvPackage !== "none" ? 1 : 0) +
      (addons.mobileLines > 0 ? 1 : 0);
    const monthsFree = q >= 3 ? 4 : q === 2 ? 3 : q === 1 ? 2 : 0;
    return { count: q, monthsFree };
  }, [
    addons.voiceLines,
    addons.connectSeats,
    addons.tvPackage,
    addons.mobileLines,
  ]);

  /* Pricing */
  const price = useMemo(() => {
    let monthly = Number(selectedPlan?.price || 0);

    // Voice
    if (addons.voiceLines > 0) monthly += addons.voiceLines * 20;

    // Connect (min 2 if added)
    if (addons.connectSeats > 0)
      monthly += Math.max(2, addons.connectSeats) * 20;

    // TV
    const tv = TV_PACKAGES.find((t) => t.id === addons.tvPackage);
    if (tv) monthly += tv.price;

    // Mobile (paid lines only)
    const mobile = MOBILE_PLANS.find((m) => m.id === addons.mobilePlan);
    if (mobile && addons.mobileLines > 0)
      monthly += addons.mobileLines * mobile.price;

    // Advanced WiFi & Wireless Backup
    if (addons.advancedWifi) monthly += 10;
    if (addons.wirelessBackup && addons.advancedWifi) monthly += 20;

    // Extra $10/mo savings when TV OR paid Mobile is added
    const tenOff = addons.tvPackage !== "none" || addons.mobileLines > 0;
    if (tenOff) monthly -= 10;

    const oneTime = 0; // free standard installation
    return { monthly: Math.max(0, monthly), oneTime };
  }, [selectedPlan, addons]);

  /* Step enablement */
  const canStep1 = Boolean(planId);
  const canStep2 = Boolean(install);
  const addrOk = (a) => a.street && a.city && a.state && a.zip;
  const canStep3 =
    contact.first &&
    contact.last &&
    contact.email &&
    contact.cemail &&
    contact.email === contact.cemail &&
    addrOk(contact.svc) &&
    (contact.billSame || addrOk(contact.bill));

  async function submit() {
    if (step !== 4) return;
    setPlacing(true);
    try {
      await axios.post("http://localhost:3000/api/spectrum-orders", {
        provider: "Spectrum Business",
        plan: selectedPlan?.title,
        addons,
        install,
        contact,
        pricing: price,
        promos: {
          freeMonths: qualifiers.monthsFree,
          extraTenOff: addons.tvPackage !== "none" || addons.mobileLines > 0,
        },
      });
      setOk(true);
    } catch (e) {
      alert("Submit failed");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header title="Spectrum Business Checkout" step={step} total={4} />

      {/* STEP 1 – EXACT UI */}
      {step === 1 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            {/* Top band: Bundle more to save more */}
            <div>
              <div className="p-4 rounded-t-2xl text-gray-800">
                <div className="text-3xl font-semibold">
                  Bundle more to save more and get up to 4 months free
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3 p-4">
                <PromoTile
                  active={qualifiers.monthsFree >= 2}
                  title={<span className="font-semibold">2 months free</span>}
                  subtitle="Internet and 1 other product"
                  eligibilityMonths={13}
                />
                <PromoTile
                  active={qualifiers.monthsFree >= 3}
                  title={<span className="font-semibold">3 months free</span>}
                  subtitle="Internet and 2 other products"
                  eligibilityMonths={19}
                />
                <PromoTile
                  active={qualifiers.monthsFree >= 4}
                  title={<span className="font-semibold">4 months free</span>}
                  subtitle="Internet and 3 other products"
                  eligibilityMonths={25}
                />
              </div>
              <div className="px-4 pb-4 -mt-2 text-[10px] text-gray-600 space-y-1 text-center">
                <div>
                  Internet must be bundled with either Business Connect,
                  Business Phone, Business TV or paid Business Mobile to qualify
                  for free months. Free installation included.
                </div>
              </div>
            </div>

            {/* Pick the best solutions header */}
            <h2
              className="mt-6 text-2xl font-semibold"
              style={{ color: BLUE_DARK }}
            >
              Pick the best solutions to create your perfect bundle
            </h2>

            {/* Business Internet */}
            <BusinessInternetBox
              plans={INTERNET_PLANS}
              planId={planId}
              setPlanId={setPlanId}
              addons={addons}
              setAddons={setAddons}
            />

            {/* Business Voice */}
            <BusinessVoiceBox addons={addons} setAddons={setAddons} />

            {/* Mobile for Business */}
            <MobileForBusinessBox addons={addons} setAddons={setAddons} />

            {/* Business TV */}
            <BusinessTVBox addons={addons} setAddons={setAddons} />

            <LegalFinePrint />
          </Card>

          <Summary
            price={price}
            onNext={() => canStep1 && setStep(2)}
            disabled={!canStep1}
            promoMonths={qualifiers.monthsFree}
          />
        </section>
      )}

      {/* STEP 2 – Installation */}
      {step === 2 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Installation">
            <div className="space-y-3">
              {INSTALL.map((i) => (
                <RadioRow
                  key={i.id}
                  checked={install === i.id}
                  onChange={() => setInstall(i.id)}
                  title={i.name}
                  right={i.fee ? currency(i.fee) : "Included"}
                />
              ))}
            </div>
          </Card>
          <Summary
            price={price}
            onBack={() => setStep(1)}
            onNext={() => canStep2 && setStep(3)}
            disabled={!canStep2}
          />
        </section>
      )}

      {/* STEP 3 – Contact */}
      {step === 3 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Contact & Addresses">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="First name"
                value={contact.first}
                onChange={(v) => setContact({ ...contact, first: v })}
              />
              <Input
                label="Last name"
                value={contact.last}
                onChange={(v) => setContact({ ...contact, last: v })}
              />
              <Input
                label="Email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact({ ...contact, email: v })}
              />
              <Input
                label="Confirm Email"
                type="email"
                value={contact.cemail}
                onChange={(v) => setContact({ ...contact, cemail: v })}
              />
              <Input
                label="Phone"
                value={contact.phone}
                onChange={(v) => setContact({ ...contact, phone: v })}
              />
            </div>

            <h4 className="mt-6 font-semibold">Service Address</h4>
            <Addr
              value={contact.svc}
              onChange={(v) => setContact({ ...contact, svc: v })}
            />

            <div className="mt-4">
              <Checkbox
                label="Billing same as service"
                checked={contact.billSame}
                onChange={(v) => setContact({ ...contact, billSame: v })}
              />
            </div>

            {!contact.billSame && (
              <>
                <h4 className="mt-4 font-semibold">Billing Address</h4>
                <Addr
                  value={contact.bill}
                  onChange={(v) => setContact({ ...contact, bill: v })}
                />
              </>
            )}

            <div className="mt-4">
              <textarea
                className="w-full rounded border p-2 text-sm"
                placeholder="Notes (optional)"
                value={contact.notes}
                onChange={(e) =>
                  setContact({ ...contact, notes: e.target.value })
                }
                rows={4}
              />
            </div>
          </Card>

          <Summary
            price={price}
            onBack={() => setStep(2)}
            onNext={() => canStep3 && setStep(4)}
            disabled={!canStep3}
          />
        </section>
      )}

      {/* STEP 4 – Review (ATTRACTIVE) */}
      {step === 4 && (
        <section className="relative grid gap-6 lg:grid-cols-[1fr_360px] bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/50 rounded-3xl p-4 md:p-6">
          <Card title="Review — All Details">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Products & Pricing */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M9 16.2l-3.5-3.6L4 14l5 5 11-11-1.5-1.4z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Products & Pricing
                  </h3>
                </div>

                <dl className="text-sm rounded-xl overflow-hidden border border-gray-200/80 shadow-sm">
                  <Row
                    zebra
                    label="Internet Plan"
                    value={`${selectedPlan?.title || "—"} (${currency(
                      selectedPlan?.price || 0
                    )}/mo; ${selectedPlan?.note || "—"})`}
                  />
                  <Row
                    zebra
                    label="Advanced WiFi"
                    value={`${fmtBool(addons.advancedWifi)}${
                      addons.advancedWifi ? " (+$10/mo)" : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Wireless Internet Backup"
                    value={`${fmtBool(addons.wirelessBackup)}${
                      addons.wirelessBackup ? " (+$20/mo; requires WiFi)" : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Voice – Lines"
                    value={`${addons.voiceLines || 0}${
                      addons.voiceLines > 0
                        ? ` (x $20 = ${currency(addons.voiceLines * 20)}/mo)`
                        : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Business Connect – Seats"
                    value={`${addons.connectSeats || 0}${
                      addons.connectSeats > 0
                        ? ` (min 2; x $20 = ${currency(
                            Math.max(2, addons.connectSeats) * 20
                          )}/mo)`
                        : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="TV Package"
                    value={`${selectedTV?.name || "No TV"}${
                      selectedTV?.price
                        ? ` (${currency(selectedTV.price)}/mo)`
                        : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Mobile Plan"
                    value={`${selectedMobile?.name || "—"}${
                      addons.mobileLines > 0
                        ? ` (${currency(selectedMobile?.price || 0)}/line/mo)`
                        : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Mobile – Paid Lines"
                    value={`${addons.mobileLines || 0}${
                      addons.mobileLines > 0
                        ? ` (x ${currency(
                            selectedMobile?.price || 0
                          )} = ${currency(
                            (selectedMobile?.price || 0) * addons.mobileLines
                          )}/mo)`
                        : ""
                    }`}
                  />
                  <Row
                    zebra
                    label="Extra $10 Off (TV or Mobile added)"
                    value={
                      addons.tvPackage !== "none" || addons.mobileLines > 0
                        ? "Applied (-$10/mo)"
                        : "Not applied"
                    }
                  />
                  <Row
                    zebra
                    label="Installation"
                    value={`${selectedInstall?.name || "—"}${
                      selectedInstall?.fee
                        ? ` (${currency(selectedInstall.fee)})`
                        : " (Included)"
                    }`}
                  />
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300/70 to-transparent" />
                  <Row
                    label="Estimated Monthly Total"
                    value={currency(price.monthly)}
                    bold
                    highlight
                  />
                  <Row
                    label="Estimated One-time Fees"
                    value={currency(price.oneTime)}
                  />
                  <Row
                    label="Promo Free Months"
                    value={
                      qualifiers.monthsFree > 0
                        ? `${qualifiers.monthsFree} month(s)`
                        : "—"
                    }
                  />
                </dl>

               
              </div>

              {/* Right: Customer Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Customer & Addresses
                  </h3>
                </div>

                <dl className="text-sm rounded-xl overflow-hidden border border-gray-200/80 shadow-sm">
                  <Row zebra label="First Name" value={contact.first || "—"} />
                  <Row zebra label="Last Name" value={contact.last || "—"} />
                  <Row zebra label="Email" value={contact.email || "—"} />
                  <Row
                    zebra
                    label="Confirm Email"
                    value={contact.cemail || "—"}
                  />
                  <Row zebra label="Phone" value={contact.phone || "—"} />
                  <Row
                    zebra
                    label="Service Address"
                    value={addrOk(contact.svc) ? fmtAddr(contact.svc) : "—"}
                  />
                  <Row
                    zebra
                    label="Billing Same as Service"
                    value={fmtBool(contact.billSame)}
                  />
                  {!contact.billSame && (
                    <Row
                      zebra
                      label="Billing Address"
                      value={addrOk(contact.bill) ? fmtAddr(contact.bill) : "—"}
                    />
                  )}
                  <Row zebra label="Notes" value={contact.notes || "—"} />
                </dl>
                 <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M12 7a2 2 0 110 4 2 2 0 010-4m0 6c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-lg text-gray-900">
                      Promo Qualification
                    </h3>
                  </div>
                  <div className="rounded-xl border border-gray-200/80 bg-white/70 shadow-sm p-3 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3">
                      <div className="text-xs uppercase tracking-wide text-blue-800/80">
                        Qualifying Products
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {qualifiers.count}
                      </div>
                    </div>
                    <div className="rounded-lg bg-emerald-50/70 border border-emerald-100 p-3">
                      <div className="text-xs uppercase tracking-wide text-emerald-800/80">
                        Free Months (est.)
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">
                        {qualifiers.monthsFree || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <SummaryBox price={price} promoMonths={qualifiers.monthsFree} />
            <button
              onClick={submit}
              className="w-full rounded-xl bg-green-600 text-white font-semibold py-2.5"
              disabled={placing}
            >
              {placing ? "Placing..." : "Place Order"}
            </button>

            {ok && (
              <div className="rounded-lg border p-4 text-green-700 bg-green-50 text-sm">
                Order booked successfully!
              </div>
            )}
            <button
              className="w-full rounded-xl border py-2.5"
              onClick={() => setStep(3)}
            >
              Back
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- UI helpers ---------- */
function Header({ title, step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <span className="text-sm text-gray-600">
          Step {step} of {total}
        </span>
      </div>
      <div className="mt-3 h-1 bg-gray-200 rounded-full">
        <div
          className="h-1 bg-blue-900 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-lg shadow-gray-900/5 backdrop-blur-sm">
      {title && (
        <div className="mb-5">
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-2" />
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <input
        className="w-full rounded border p-2"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex gap-2 items-center text-sm rounded-xl border p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function RadioRow({ title, right, checked, onChange }) {
  return (
    <label
      className={`flex items-center justify-between rounded-xl border p-3 ${
        checked ? "bg-gray-50 border-black" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <input type="radio" checked={checked} onChange={onChange} />
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm">{right}</span>
    </label>
  );
}

function Row({ label, value, bold = false, zebra = false, highlight = false }) {
  return (
    <div
      className={[
        "grid grid-cols-[1fr_auto] gap-4 items-start px-4 py-3",
        zebra ? "odd:bg-gray-50/60 even:bg-white" : "",
        "border-b border-gray-100 last:border-b-0",
        highlight ? "bg-amber-50/70" : "",
      ].join(" ")}
    >
      <dt className="text-gray-600">{label}</dt>
      <dd
        className={[
          "text-right tabular-nums",
          bold ? "font-semibold text-gray-900" : "text-gray-900",
          highlight ? "text-amber-900" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

function QtyMini({ value, onChange, min = 1, label = "", max = 8 }) {
  const v = Number(value) || min;
  return (
    <div className="inline-flex items-center gap-2">
      {label && <span className="text-lg text-gray-800">{label}</span>}
      <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
        <button
          type="button"
          className="px-3 py-1 border-r border-gray-700 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          onClick={() => onChange(Math.max(min, v - 1))}
          disabled={v <= min}
        >
          -
        </button>
        <input
          type="number"
          className="w-14 text-center outline-none"
          value={v}
          min={min}
          max={max}
          disabled={v >= max}
          onChange={(e) =>
            onChange(Math.max(min, Number(e.target.value) || min))
          }
        />
        <button
          type="button"
          className="px-3 py-1 border-l border-gray-700 text-gray-700 hover:bg-gray-100"
          onClick={() => onChange(v + 1)}
          disabled={v >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
      <path
        d="M6 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/* -------- Legal fine print (from provided copy) -------- */
const LEGAL_TEXT = `Limited-time offer; subject to change. Qualified new business customers only (no Spectrum Business services or equivalent residential services within the past 30 days) and in good standing with Charter. Standard rates apply after promo period or if qualifying services not maintained. Taxes and fees extra in select states. A monthly $5 Payment Processing Charge will be applied to customer accounts not enrolled in Auto Pay.

*$100 INTERNET, PHONE, TV AND MOBILE OFFER: Includes 500Mbps Internet, 1 Business Phone Line, Business TV Stream and 1 Included Unlimited Mobile Line.

FREE MONTHS: All qualifying services must be ordered on same day. Free services will be applied on billing statement as a credit as applicable depending on the number of products in the bundle in months 1, 13, 19 and 25. Not all TV packages are eligible for offer. Excludes usage charges and seasonal sports packages.

JD POWER: For J.D. Power 2025 award information, visit jdpower.com/awards.

FREE INSTALLATION: Includes standard installation.

INTERNET: Speeds based on download speed on wired connection. Actual speeds (including wireless) vary and are not guaranteed. Price for 750Mbps and Gig speed additional. Capable modem required for all Gig speeds.

PHONE: Includes unlimited local and long-distance calling to U.S., Puerto Rico and Canada.

BUSINESS TV STREAM: Additional taxes/fees may apply. Spectrum TV App required. Spectrum Business streaming video service is only accessible through Spectrum Business Internet connection at business location. Account credentials may be required to stream some TV content online. Channel availability based on level of service and not all channels available in all markets or locations.

MOBILE: Spectrum Business Internet and Auto Pay Required. INCLUDED UNLIMITED MOBILE LINE is reflected with up to 12 months credit on bill statement; limited to one promotional line per account. Mobile devices excluded from offer. Offer applies to new Mobile customers without any outstanding obligation to Charter. Must be ordered on the same day as Internet purchase. Standard rates apply after promo period or if qualifying services not maintained. Offer cannot be applied to existing lines on customer account. Existing mobile customers must add two or more new lines to get promotional line discount. Tablets not eligible for promotion. $30 BUSINESS UNLIMITED MOBILE LINE: Reduced speeds after 30 GB of usage per line. $40 BUSINESS UNLIMITED PLUS LINE: Reduced speeds after 100 GB of usage per line. UPGRADE MOBILE PHONE ANYTIME: Only available for customers subscribed to Spectrum Business Mobile Unlimited Plus for one billing cycle and in good standing. Trade-in devices must be operable; if not operable, then trade-in may be subject to an additional redemption fee. Must enroll in new Device Payment Plan and remain on Unlimited Plus for 2 billing cycles. 5G: To access 5G, 5G compatible phone and 5G service required. Not all 5G capable phones compatible with all 5G service. Speeds may vary.

WIRELESS INTERNET BACKUP OFFER requires a subscription to Spectrum Business Internet and Static IP or Advanced WiFi services. Supports up to 4 devices and includes download speed up to 10 Mbps. Limited to approximately 8 hours of battery life and does not provide a guarantee of uninterrupted service. LTE modem is required & included in price. Devices connected to the LTE modem cannot receive Gig speed. Static IP and Advanced WiFi not supported when Wireless Internet Backup service is engaged.

BUSINESS CONNECT: Not available in all areas. Not compatible with all desk phones. Phone equipment is not included with service.

FREE BUSINESS PHONE LINE: Includes one free Spectrum Business Phone line only per account. Standard phone rates apply if qualifying services are not maintained.

BUSINESS/PREMIER/SPORTS FAN TV OFFER: Taxes, fees and surcharges (bdcst surcharge up to $28.00/mo.) extra and subject to change during and after the term; installation, equipment and additional services are extra. TV equipment may be required, charges apply. Channel counts may vary by market. Channel availability based on level of service, and not all channels available in all markets or locations. Additional equipment may be required to access PEG channels.

FASTEST AND MOST RELIABLE INTERNET: Based on Broadband Download Speed and Reliability Experience among the top 5 national providers in Opensignal USA: Fixed Broadband Experience Report – May 2025. © 2025 Opensignal Limited.

◊◊TOTAL ESTIMATED PRICING: Pricing does not reflect an official quote from Spectrum Business and does not include taxes, fees or equipment and installation charges. Services subject to all applicable service terms & conditions, which are subject to change. Services & promo. offers not avail. in all areas. Pricing subject to change. Restrictions apply.`;

function LegalFinePrint() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs underline"
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} legal fine print
      </button>
      {open && (
        <div className="mt-2 rounded-xl border p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-[11px] leading-5 text-gray-700">
            {LEGAL_TEXT}
          </pre>
        </div>
      )}
    </div>
  );
}

function BusinessInternetBox({ plans, planId, setPlanId, addons, setAddons }) {
  return (
    <div className="rounded-2xl border overflow-hidden mt-8">
      {/* Blue header */}
      <div className="bg-[#0b61a4] text-white px-4 py-2">
        <span className="font-bold text-xl">Business Internet</span>
        <span className="opacity-90">
          {" "}
          — Get the fastest, most reliable Internet
        </span>
      </div>

      <div className="p-4">
        {/* 3 plan tiles */}
        <div className="grid md:grid-cols-3">
          {plans.map((p) => (
            <label
              key={p.id}
              className={` border p-4 flex items-start gap-3 transition ${
                planId === p.id
                  ? "bg-gray-50 border-black shadow-sm"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                className="mt-1 accent-black"
                checked={planId === p.id}
                onChange={() => setPlanId(p.id)}
              />
              <div className="flex-1">
                <div className="font-semibold text-xl">{p.title}</div>
                <div className="mt-1 leading-5">
                  <div className="text-4xl font-extrabold">${p.price}</div>
                  <div className="text-[12px] text-gray-600">/mo {p.note}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* bullets */}
        <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[15px] text-gray-700">
          <span className="flex items-center gap-2">
            <Chevron /> Free modem, email addresses and desktop security
          </span>
          <span className="hidden md:block h-4 w-px bg-gray-300" />
          <span className="flex items-center gap-2">
            <Chevron /> No data caps or speed throttling
          </span>
        </div>

        {/* $10/mo callout */}
        <div className="mt-3 flex items-center gap-3 text-[15px]">
          <div className="h-px bg-gray-300 flex-1" />
          <div>
            Add a Paid Mobile line or TV service and save an additional $10/mo
          </div>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        {/* WiFi + Backup checkboxes */}
        <div className="mt-3 grid md:grid-cols-2 gap-3 text-[15px]">
          <label className="flex items-center gap-2 border rounded-lg p-3 ">
            <input
              type="checkbox"
              className="accent-black focus:outline-none focus:ring-2 focus:ring-black"
              checked={addons.advancedWifi}
              onChange={(e) =>
                setAddons({ ...addons, advancedWifi: e.target.checked })
              }
            />
            Add advanced WiFi for only <b>$10</b>
            <span className="text-xs">/mo</span>
          </label>

          <label className="flex items-center gap-2 border rounded-lg p-3 ">
            <input
              type="checkbox"
              className="accent-black focus:outline-none focus:ring-2 focus:ring-black"
              checked={addons.wirelessBackup}
              onChange={(e) =>
                setAddons({ ...addons, wirelessBackup: e.target.checked })
              }
            />
            Add Wireless Internet Backup for only <b>$20</b>
            <span className="text-xs">/mo</span>
          </label>
        </div>

        {/* price guarantee line */}
        <div className="mt-4 text-center font-semibold text-[#0b61a4]">
          3-Year price guarantee available with select bundles
        </div>
      </div>
    </div>
  );
}

function BusinessVoiceBox({ addons, setAddons }) {
  const phoneOn = (addons.voiceLines || 0) > 0;
  const connectOn = (addons.connectSeats || 0) > 0;

  const togglePhone = (checked) =>
    setAddons({
      ...addons,
      voiceLines: checked ? Math.max(1, addons.voiceLines || 1) : 0,
    });

  const toggleConnect = (checked) =>
    setAddons({
      ...addons,
      connectSeats: checked ? Math.max(2, addons.connectSeats || 2) : 0,
    });

  return (
    <div className="rounded-2xl border overflow-hidden mt-8">
      {/* blue header */}
      <div className="px-4 py-2 text-white" style={{ background: BLUE }}>
        <span className="font-bold text-xl">Business Voice</span>
        <span className="opacity-90">
          {" "}
          — Make the most of every call and opportunity
        </span>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2">
          {/* Business Phone */}
          <label
            className={`border p-4 flex items-start gap-3 transition ${
              phoneOn
                ? "bg-gray-50 border-black shadow-sm"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 accent-black"
              checked={phoneOn}
              onChange={(e) => togglePhone(e.target.checked)}
            />
            <div className="flex-1">
              <div className="">
                <div className="font-semibold text-2xl">Business Phone</div>
                <div className="leading-5">
                  <span className="text-3xl font-extrabold">$20</span>
                  <span className="block text-[12px] text-gray-600">
                    /mo per line when bundled
                    <br />
                    with Internet for 1 year
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <QtyMini
                  value={addons.voiceLines}
                  onChange={(n) =>
                    setAddons({ ...addons, voiceLines: Math.max(1, n) })
                  }
                  min={1}
                  max={8}
                  label="Lines"
                />
              </div>

              <div className="mt-3 text-[15px] text-gray-700 flex items-center gap-2">
                <Chevron /> Unlimited local and long-distance calling
              </div>
            </div>
          </label>

          {/* Business Connect */}
          <label
            className={` border p-4 flex items-start gap-3 transition ${
              connectOn
                ? "bg-gray-50 border-r  shadow-sm"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              className="mt-1 accent-black"
              checked={connectOn}
              onChange={(e) => toggleConnect(e.target.checked)}
            />
            <div className="flex-1">
              <div className="">
                <div className="font-semibold text-2xl">Business Connect</div>
                <div className="leading-5">
                  <span className="text-3xl font-extrabold">$20</span>
                  <span className="block text-[12px] text-gray-600">
                    /mo per seat when bundled
                    <br />
                    with Internet for 2 years (2 user min req’d)
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <QtyMini
                  value={addons.connectSeats}
                  onChange={(n) =>
                    setAddons({ ...addons, connectSeats: Math.max(2, n) })
                  }
                  min={2}
                  label="Seats"
                />
              </div>

              <div className="mt-3 space-y-1 text-[15px] text-gray-700">
                <div className="flex items-center gap-2">
                  <Chevron /> Call, message and video-chat from one app across
                  all devices
                </div>
                <div className="flex items-center gap-2">
                  <Chevron /> Includes free Business Phone line
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function MobileForBusinessBox({ addons, setAddons }) {
  const plan = addons.mobilePlan || "unlimited";
  const setPlan = (id) => setAddons({ ...addons, mobilePlan: id });

  return (
    <div className="rounded-2xl border overflow-hidden mt-6">
      {/* blue header */}
      <div className="px-4 py-2 text-white" style={{ background: BLUE }}>
        <span className="font-bold">Mobile for Business</span>
        <span className="opacity-90">
          {" "}
          — Work from anywhere on a reliable nationwide network
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* free line notice */}
        <div className="text-[13px]">
          <b>New Spectrum Business Internet customers</b> are entitled to{" "}
          <b>one included Business Unlimited Mobile line for a year</b>
          <span className="text-gray-600"> (not priced here)</span>.
        </div>

        {/* two plan cards with vertical divider */}
        <div className="grid md:grid-cols-2 rounded-xl border">
          {/* Unlimited $30 */}
          <label
            className={`p-4 flex items-start gap-3 ${
              plan === "unlimited"
                ? "bg-gray-50 border-b md:border-b-0 md:border-r border-black"
                : "md:border-r border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="mobilePlan"
              className="mt-1 accent-black"
              checked={plan === "unlimited"}
              onChange={() => setPlan("unlimited")}
            />
            <div className="flex-1">
              <div className="font-semibold text-2xl">Business Unlimited</div>
              <div className="leading-4 mt-1">
                <span className="text-3xl font-extrabold">$30</span>
                <span className="block text-[11px] text-gray-600">
                  /mo per additional line
                </span>
              </div>
              <ul className="mt-2 text-[13px] text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Chevron /> Unlimited talk, text and data (reduced speeds
                  after <b>100 GB</b>)
                </li>
                <li className="flex items-center gap-2">
                  <Chevron /> Nationwide 5G included
                </li>
              </ul>
            </div>
          </label>

          {/* Unlimited Plus $40 */}
          <label
            className={`p-4 flex items-start gap-3 ${
              plan === "plus" ? "bg-gray-50 border-black" : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="mobilePlan"
              className="mt-1 accent-black"
              checked={plan === "plus"}
              onChange={() => setPlan("plus")}
            />
            <div className="flex-1">
              <div className="font-semibold text-2xl">
                Business Unlimited Plus
              </div>
              <div className="leading-4 mt-1">
                <span className=" font-extrabold text-3xl">$40</span>
                <span className="block text-[11px] text-gray-600">
                  /mo per additional line
                </span>
              </div>
              <ul className="mt-2 text-[13px] text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <Chevron /> Unlimited talk, text and data (reduced speeds
                  after <b>30 GB</b>)
                </li>
                <li className="flex items-center gap-2">
                  <Chevron /> Upgrade your phone anytime for any reason
                </li>
              </ul>
            </div>
          </label>
        </div>

        {/* quantity for paid lines */}
        <div className="mt-2">
          <QtyMini
            value={addons.mobileLines}
            onChange={(n) =>
              setAddons({ ...addons, mobileLines: Math.max(0, n) })
            }
            min={0}
            max={8}
            label="Paid mobile lines"
          />
        </div>
      </div>
    </div>
  );
}

function BusinessTVBox({ addons, setAddons }) {
  const tv = addons.tvPackage || "none";
  const setTV = (id) => setAddons({ ...addons, tvPackage: id });

  return (
    <div className="rounded-2xl border overflow-hidden mt-6">
      {/* blue header */}
      <div className="px-4 py-2 text-white" style={{ background: BLUE }}>
        <span className="font-bold">Business TV</span>
        <span className="opacity-90">
          {" "}
          — Keep employees and customers entertained and engaged
        </span>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2">
          {TV_PACKAGES.filter((c) => c.id !== "none").map((c) => (
            <label
              key={c.id}
              className={` border p-4 flex items-start justify-between gap-4 ${
                tv === c.id ? "bg-gray-50 border-black" : "border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="tv"
                  className="mt-1 accent-black"
                  checked={tv === c.id}
                  onChange={() => setTV(c.id)}
                />
                <div>
                  <div className="font-semibold text-xl">{c.name}</div>
                  <div className="text-xs text-gray-600">
                    {c.blurb} popular channels
                  </div>
                  {c.note && (
                    <div className="text-[11px] text-gray-500 mt-1">
                      {c.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right min-w-[120px]">
                <div className="text-3xl font-extrabold">${c.price}</div>
                <div className="text-[11px] text-gray-600">{c.caption}</div>
              </div>
            </label>
          ))}

          {/* No TV */}
          <label
            className={` border p-4 flex items-center justify-between gap-4 ${
              tv === "none" ? "bg-gray-50 border-black" : "border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="tv"
                className="accent-black"
                checked={tv === "none"}
                onChange={() => setTV("none")}
              />
              <div className="font-medium">No TV</div>
            </div>
            <div className="text-sm text-gray-500">—</div>
          </label>
        </div>
      </div>
    </div>
  );
}

function Summary({ price, onNext, onBack, disabled, promoMonths }) {
  return (
    <div className="space-y-4">
      <SummaryBox price={price} promoMonths={promoMonths} />
      <div className="flex gap-3">
        {onBack && (
          <button className="w-1/2 rounded-xl border py-2.5" onClick={onBack}>
            Back
          </button>
        )}
        {onNext && (
          <button
            className={`w-full rounded-xl py-2.5 text-white ${
              disabled ? "bg-gray-400" : "bg-black"
            }`}
            onClick={onNext}
            disabled={disabled}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryBox({ price, promoMonths }) {
  return (
    <div className="rounded-2xl border p-4 text-sm">
      <div className="flex justify-between py-1">
        <span>Total estimate</span>
        <b>{currency(price.monthly)}</b>
      </div>
      <div className="flex justify-between py-1">
        <span>One-time fees</span>
        <b>{currency(price.oneTime)}</b>
      </div>
      <div className="flex justify-between py-1">
        <span>Promo (free months)</span>
        <b>{promoMonths > 0 ? `${promoMonths} months` : "—"}</b>
      </div>
      <p className="mt-2 text-[11px] text-gray-600">
        ◊◊ Total estimated pricing is not an official quote and excludes taxes,
        fees, equipment and non-standard installation.
      </p>
    </div>
  );
}

function PromoTile({ active, title, subtitle, eligibilityMonths }) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        active ? "bg-white border-black" : "border-gray-300"
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-2 inline-flex h-4 w-6 items-center justify-center border ${
            active ? "bg-black border-black" : "bg-white border-gray-400"
          }`}
          role="img"
          aria-label={active ? "Tier qualified" : "Tier not yet qualified"}
        >
          {active && (
            <svg
              viewBox="0 0 20 20"
              className="h-3 w-3 fill-white"
              aria-hidden="true"
            >
              <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0L3.3 9.9a1 1 0 1 1 1.4-1.4l3.3 3.3 6.9-6.9a1 1 0 0 1 1.4 0z" />
            </svg>
          )}
        </span>
        <div>
          <div className="text-2xl text-blue-950">{title}</div>
          <div className="text-sm text-blue-900">{subtitle}</div>
          <div
            className="text-lg font-medium my-2"
            style={{ color: BLUE_DARK }}
          >
            Free installation
          </div>
          {eligibilityMonths && (
            <div className="text-[11px] text-gray-600 mt-1">
              Eligibility based on maintaining all qualifying services for at
              least {eligibilityMonths} months.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Addr({ value, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Input
        label="Street"
        value={value.street}
        onChange={(v) => onChange({ ...value, street: v })}
      />
      <Input
        label="City"
        value={value.city}
        onChange={(v) => onChange({ ...value, city: v })}
      />
      <Input
        label="State"
        value={value.state}
        onChange={(v) => onChange({ ...value, state: v })}
      />
      <Input
        label="ZIP"
        value={value.zip}
        onChange={(v) => onChange({ ...value, zip: v })}
      />
    </div>
  );
}
