import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
const DRAFT_KEY = "draft_acc_business_v1";
const PLANS = [
  { title: "300 Mbps Internet", price: 70 },
  { title: "Internet 300", price: 80 },
  { title: "Internet 500", price: 95 },
];
const INSTALL = [{ id: "pro", name: "Professional Installation", fee: 99 }];
const STATIC_IP = [
  { qty: 0, price: 0 },
  { qty: 1, price: 20 },
  { qty: 5, price: 30 },
  { qty: 13, price: 40 },
  { qty: 29, price: 60 },
];
const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function AccBusinessCheckout() {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState(PLANS[0].title);
  const [opt, setOpt] = useState({ staticIpQty: 0, voiceSeats: 0 });
  const [install, setInstall] = useState(INSTALL[0].id);
  const [contact, setContact] = useState({
    first: "",
    last: "",
    email: "",
    cemail: "",
    svc: { street: "", city: "", state: "", zip: "" },
    billSame: true,
    bill: { street: "", city: "", state: "", zip: "" },
  });
  const [placing, setPlacing] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setStep(d.step || 1);
        setPlan(d.plan || plan);
        setOpt(d.opt || opt);
        setInstall(d.install || install);
        setContact(d.contact || contact);
      } catch {}
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ step, plan, opt, install, contact })
    );
  }, [step, plan, opt, install, contact]);

  const price = useMemo(() => {
    const p = PLANS.find((x) => x.title === plan)?.price || 0;
    let m = p + (opt.voiceSeats || 0) * 20;
    const tier = STATIC_IP.filter(
      (t) => t.qty <= Number(opt.staticIpQty || 0)
    ).pop() || { price: 0 };
    m += tier.price;
    const one = INSTALL.find((i) => i.id === install)?.fee || 0;
    return { monthly: m, oneTime: one };
  }, [plan, opt, install]);

  const addrOk = (a) => a.street && a.city && a.state && a.zip;
  const can1 = !!plan,
    can2 = !!install,
    can3 = Boolean(
      contact.first &&
        contact.last &&
        contact.email &&
        contact.cemail === contact.email &&
        addrOk(contact.svc) &&
        (contact.billSame || addrOk(contact.bill))
    );

  const submit = async () => {
    if (step !== 4) return;
    setPlacing(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        provider: "ACC Business",
        plan,
        options: opt,
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
    <div className="max-w-5xl mx-auto p-6" data-aos="fade-up">
      <Header title="ACC Business Checkout" step={step} total={4} />
      {step === 1 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Plans">
            <div className="space-y-3">
              {PLANS.map((p) => (
                <RadioRow
                  key={p.title}
                  title={p.title}
                  right={currency(p.price)}
                  checked={plan === p.title}
                  onChange={() => setPlan(p.title)}
                />
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <NumberRow
                label="Static IPs"
                value={opt.staticIpQty}
                onChange={(n) => setOpt({ ...opt, staticIpQty: n })}
              />
              <NumberRow
                label="Voice seats"
                value={opt.voiceSeats}
                onChange={(n) => setOpt({ ...opt, voiceSeats: n })}
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
          <Card title="Installation">
            {INSTALL.map((i) => (
              <RadioRow
                key={i.id}
                title={i.name}
                right={i.fee ? currency(i.fee) : "Included"}
                checked={install === i.id}
                onChange={() => setInstall(i.id)}
              />
            ))}
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
          <Card title="Contact & Address">
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
            <h4 className="mt-4 font-semibold">Service Address</h4>
            <Addr
              value={contact.svc}
              onChange={(v) => setContact({ ...contact, svc: v })}
            />
            <div className="mt-3">
              <Checkbox
                label="Billing same"
                checked={contact.billSame}
                onChange={(v) => setContact({ ...contact, billSame: v })}
              />
            </div>
            {!contact.billSame && (
              <>
                <h4 className="mt-3 font-semibold">Billing</h4>
                <Addr
                  value={contact.bill}
                  onChange={(v) => setContact({ ...contact, bill: v })}
                />
              </>
            )}
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
                <b>Static IPs:</b> {opt.staticIpQty}
              </li>
              <li>
                <b>Voice seats:</b> {opt.voiceSeats}
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
/* local UI same pattern as above */
function Header({ title, step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <span className="text-sm text-gray-600">
          Step {step} of {total}
        </span>
      </div>
      <div className="mt-3 h-1 bg-gray-200 rounded-full">
        <div
          className="h-1 bg-black rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
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
          onClick={() => onChange(Math.max(0, (Number(value) || 0) - 1))}
        >
          -
        </button>
        <input
          className="w-16 text-center border rounded"
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        />
        <button
          className="px-2 border rounded"
          onClick={() => onChange((Number(value) || 0) + 1)}
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
