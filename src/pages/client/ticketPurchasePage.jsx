import { useState } from "react";
import axios from "axios";

const initialForm = {
  eventName: "Colombo Night 2027",
  firstName: "",
  lastName: "",
  mobileNumber: "",
  emailAddress: "",
  nicNumber: "",
  address: "",
  paidAmount: "",
};

const fields = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "mobileNumber", label: "Mobile number", type: "tel", autoComplete: "tel" },
  { name: "emailAddress", label: "Email address (optional)", type: "email", autoComplete: "email" },
  { name: "nicNumber", label: "NIC number", autoComplete: "off" },
  { name: "paidAmount", label: "Amount paid (LKR)", type: "number", min: "0.01", step: "0.01" },
];

export default function TicketPurchasePage() {
  const [form, setForm] = useState(initialForm);
  const [slip, setSlip] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!slip) return setError("Please attach your payment slip.");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append("paymentSlip", slip);

    try {
      setSubmitting(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ticket-orders`, data);
      const emailNote = response.data.confirmationEmailSent ? " A confirmation email was sent." : "";
      setMessage(`${response.data.message} Your reference number is ${response.data.referenceNumber}. Please keep it for follow-up.${emailNote}`);
      setForm(initialForm);
      setSlip(null);
      event.target.reset();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "We could not submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-800 to-blue-700 px-6 py-9 text-white sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Tholangamuwa Central College · Colombo Group</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Buy event tickets</h1>
        <p className="mt-3 max-w-xl text-indigo-100">Enter your details and upload your payment slip. The committee will review your payment and confirm your ticket.</p>
      </div>

      <form onSubmit={submit} className="space-y-6 p-6 sm:p-10">
        <div>
          <label htmlFor="eventName" className="font-semibold text-slate-800">Event name</label>
          <input id="eventName" name="eventName" value={form.eventName} onChange={update} required maxLength={120} placeholder="Which event are you attending?" className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ name, label, ...attributes }) => (
            <div key={name}>
              <label htmlFor={name} className="font-semibold text-slate-800">{label}</label>
              <input id={name} name={name} value={form[name]} onChange={update} required={name !== "emailAddress"} className={inputClass} {...attributes} />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="address" className="font-semibold text-slate-800">Address</label>
          <textarea id="address" name="address" value={form.address} onChange={update} required rows={3} maxLength={500} autoComplete="street-address" className={inputClass} />
        </div>

        <div>
          <label htmlFor="paymentSlip" className="font-semibold text-slate-800">Payment slip</label>
          <input id="paymentSlip" name="paymentSlip" type="file" required accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(e) => setSlip(e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700`} />
          <p className="mt-2 text-sm text-slate-500">JPG, PNG, WebP, or PDF · Up to 5 MB</p>
        </div>

        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Your order will remain pending until the payment slip is reviewed. Please ensure the paid amount matches the ticket payment.</p>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">{message}</p>}
        <button type="submit" disabled={submitting} className="w-full rounded-xl bg-indigo-700 px-5 py-4 font-bold text-white transition hover:bg-indigo-800 disabled:cursor-wait disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit ticket request"}
        </button>
      </form>
    </section>
  );
}
