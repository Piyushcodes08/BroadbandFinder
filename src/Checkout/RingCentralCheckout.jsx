import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
const DRAFT_KEY = "draft_ringcentral_v1";
const PLANS = [
  // prices are per user / month
  { title: "Core", price: 20, notes: "Phone + HD video + messaging (annual)" },
  {
    title: "Advanced",
    price: 25,
    notes: "Automation, service tools, multi-site",
  },
  { title: "Ultra", price: 35, notes: "Storage + analytics + advanced tools" },
];
const INSTALL = [{ id: "self", name: "Self Provisioning (digital)", fee: 0 }];
const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function RingCentralCheckout() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(PLANS[0].title);
  const [cfg, setCfg] = useState({
    users: 1,
    autoRecord: false,
    aiAssistant: true,
    numPorting: true,
  });
  const [install, setInstall] = useState("self");
  const [contact, setContact] = useState({
    first: "",
    last: "",
    email: "",
    cemail: "",
    company: "",
    phone: "",
  });
  const [placing, setPlacing] = useState(false),
    [ok, setOk] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setStep(d.step || 1);
        setPlan(d.plan || plan);
        setCfg(d.cfg || cfg);
        setInstall(d.install || install);
        setContact(d.contact || contact);
      } catch {}
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ step, plan, cfg, install, contact })
    );
  }, [step, plan, cfg, install, contact]);

  const price = useMemo(() => {
    const base = PLANS.find((p) => p.title === plan)?.price || 0;
    let monthly = base * (Number(cfg.users) || 1);
    if (cfg.autoRecord) monthly += 3 * (Number(cfg.users) || 1); // example add-on per user
    if (cfg.aiAssistant) monthly += 2 * (Number(cfg.users) || 1);
    const oneTime = 0; // digital
    return { monthly, oneTime };
  }, [plan, cfg]);

  const can1 = Boolean(plan && Number(cfg.users) >= 1);
  const can2 = Boolean(install);
  const can3 = Boolean(
    contact.first &&
      contact.last &&
      contact.email &&
      contact.cemail === contact.email
  );

  const submit = async () => {
    if (step !== 4) return;
    setPlacing(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        provider: "RingCentral",
        plan,
        config: cfg,
        install,
        contact,
        pricing: price,
      });
      localStorage.removeItem(DRAFT_KEY);
      setOk(true);
    } catch {
      alert("Submit failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-28 md:pt-32" data-aos="fade-up">
      <Header title="RingCentral Checkout" step={step} total={4} />
      {step === 1 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Choose Seat Plan">
            <div className="space-y-3">
              {PLANS.map((p) => (
                <RadioRow
                  key={p.title}
                  title={`${p.title} — ${p.notes}`}
                  right={`${currency(p.price)}/user`}
                  checked={plan === p.title}
                  onChange={() => setPlan(p.title)}
                />
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <NumberRow
                label="Users"
                value={cfg.users}
                onChange={(n) => setCfg({ ...cfg, users: Math.max(1, n) })}
              />
              <Checkbox
                label="AI Assistant (+$2/user)"
                checked={cfg.aiAssistant}
                onChange={(v) => setCfg({ ...cfg, aiAssistant: v })}
              />
              <Checkbox
                label="Auto call recording (+$3/user)"
                checked={cfg.autoRecord}
                onChange={(v) => setCfg({ ...cfg, autoRecord: v })}
              />
              <Checkbox
                label="Number porting required"
                checked={cfg.numPorting}
                onChange={(v) => setCfg({ ...cfg, numPorting: v })}
              />
            </div>
          </Card>
          <Summary
            price={price}
            onNext={() => can1 && setStep(2)}
            disabled={!can1}
          />
        </section>
      )}
      {step === 2 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Provisioning">
            <RadioRow
              title="Self Provisioning (digital)"
              right="Included"
              checked={install === "self"}
              onChange={() => setInstall("self")}
            />
          </Card>
          <Summary
            price={price}
            onBack={() => setStep(1)}
            onNext={() => can2 && setStep(3)}
            disabled={!can2}
          />
        </section>
      )}
      {step === 3 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Contact">
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="First"
                value={contact.first}
                onChange={(v) => setContact({ ...contact, first: v })}
              />
              <Input
                label="Last"
                value={contact.last}
                onChange={(v) => setContact({ ...contact, last: v })}
              />
              <Input
                label="Company"
                value={contact.company}
                onChange={(v) => setContact({ ...contact, company: v })}
              />
              <Input
                label="Phone"
                value={contact.phone}
                onChange={(v) => setContact({ ...contact, phone: v })}
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
            </div>
          </Card>
          <Summary
            price={price}
            onBack={() => setStep(2)}
            onNext={() => can3 && setStep(4)}
            disabled={!can3}
          />
        </section>
      )}
      {step === 4 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Review">
            <ul className="text-sm space-y-1">
              <li>
                <b>Plan:</b> {plan}
              </li>
              <li>
                <b>Users:</b> {cfg.users}
              </li>
              <li>
                <b>AI Assistant:</b> {cfg.aiAssistant ? "Yes" : "No"}
              </li>
              <li>
                <b>Auto Recording:</b> {cfg.autoRecord ? "Yes" : "No"}
              </li>
              <li>
                <b>Porting:</b> {cfg.numPorting ? "Yes" : "No"}
              </li>
            </ul>
          </Card>
          <div className="space-y-4">
            <SummaryBox price={price} />
            <button
              className="w-full rounded-xl bg-green-600 text-white py-2.5 font-semibold"
              onClick={submit}
              disabled={placing}
            >
              {placing ? "Placing..." : "Place Order"}
            </button>
            {ok && (
              <div className="rounded border p-3 text-sm bg-green-50 text-green-700">
                Order booked!
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

/* local UI helpers like others */
function Header({ title, step, total }) {
  const providerName = title.replace(" Checkout", "");
  return (
    <>
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
            {providerName}
          </span>
          <span className="text-sm font-medium text-gray-600">
            Step {step} of {total}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-1 rounded-full bg-[#E8611A] transition-all"
            style={{ width: `${(step / total) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
function Card({ title, children }) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
function RadioRow({ title, right, checked, onChange }) {
  return (
    <label
      className={`flex justify-between items-center border rounded-xl p-3 ${
        checked ? "bg-gray-50 border-black" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <input type="radio" checked={checked} onChange={onChange} />
        <span className="font-medium">{title}</span>
      </div>
      <span className="text-sm">{right}</span>
    </label>
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
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
function NumberRow({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center border rounded p-2">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          className="px-2 border rounded"
          onClick={() => onChange(Math.max(1, (Number(value) || 1) - 1))}
        >
          -
        </button>
        <input
          className="w-16 text-center border rounded"
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        />
        <button
          className="px-2 border rounded"
          onClick={() => onChange((Number(value) || 1) + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
function Summary({ price, onNext, onBack, disabled }) {
  return (
    <div className="space-y-4">
      <SummaryBox price={price} />
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
function SummaryBox({ price }) {
  return (
    <div className="rounded-2xl border p-4 text-sm">
      <div className="flex justify-between py-1">
        <span>Monthly (est.)</span>
        <b>{currency(price.monthly)}</b>
      </div>
      <div className="flex justify-between py-1">
        <span>One-time fees</span>
        <b>{currency(price.oneTime)}</b>
      </div>
      <p className="mt-2 text-xs text-gray-600">
        Taxes & surcharges may apply.
      </p>
    </div>
  );
}
