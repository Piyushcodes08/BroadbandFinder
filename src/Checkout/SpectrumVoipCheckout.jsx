import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
const DRAFT_KEY = "draft_spectrum_voip_v1";
const TERM = [
  { id: "contract", label: "Contract" },
  { id: "mtm", label: "Month-to-month" },
];
const BASE_PER_USER = 19.95;
const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function SpectrumVoipCheckout() {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState(1);
  const [term, setTerm] = useState(TERM[0].id);
  const [addons, setAddons] = useState({ fax: false, callRecording: false });
  const [contact, setContact] = useState({
    first: "",
    last: "",
    email: "",
    cemail: "",
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
        setUsers(d.users || 1);
        setTerm(d.term || term);
        setAddons(d.addons || addons);
        setContact(d.contact || contact);
      } catch {}
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ step, users, term, addons, contact })
    );
  }, [step, users, term, addons, contact]);

  const price = useMemo(() => {
    let monthly = BASE_PER_USER * (Number(users) || 1);
    if (addons.fax) monthly += 5 * (Number(users) || 1);
    if (addons.callRecording) monthly += 4 * (Number(users) || 1);
    let oneTime = 0;
    if (term === "mtm") {
      oneTime += 99; /* equipment+install */
    }
    return { monthly, oneTime };
  }, [users, addons, term]);

  const can1 = Number(users) >= 1,
    can2 = Boolean(term),
    can3 = Boolean(
      contact.first &&
        contact.last &&
        contact.email &&
        contact.email === contact.cemail
    );

  const submit = async () => {
    if (step !== 4) return;
    setPlacing(true);
    try {
      await axios.post("https://zenith.cloudastro.space/api/orders", {
        provider: "Spectrum VoIP",
        users,
        term,
        addons,
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
      <Header title="Spectrum VoIP Checkout" step={step} total={4} />
      {step === 1 && (
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card title="Seats & Add-ons">
            <NumberRow
              label="Users"
              value={users}
              onChange={(n) => setUsers(Math.max(1, n))}
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Checkbox
                label="Fax add-on (+$5/user)"
                checked={addons.fax}
                onChange={(v) => setAddons({ ...addons, fax: v })}
              />
              <Checkbox
                label="Call recording (+$4/user)"
                checked={addons.callRecording}
                onChange={(v) => setAddons({ ...addons, callRecording: v })}
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
          <Card title="Term">
            {TERM.map((t) => (
              <RadioRow
                key={t.id}
                title={t.label}
                right={
                  t.id === "mtm"
                    ? "One-time $99 equip+install"
                    : "No one-time fee"
                }
                checked={term === t.id}
                onChange={() => setTerm(t.id)}
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
                <b>Users:</b> {users}
              </li>
              <li>
                <b>Term:</b> {TERM.find((t) => t.id === term)?.label}
              </li>
              <li>
                <b>Fax:</b> {addons.fax ? "Yes" : "No"}
              </li>
              <li>
                <b>Call recording:</b> {addons.callRecording ? "Yes" : "No"}
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
/* local UI (same minimal primitives) */
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
