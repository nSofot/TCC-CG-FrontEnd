import { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  eventName: "Colombo Night 2027",
  firstName: "",
  lastName: "",
  mobileNumber: "",
  emailAddress: "",
  paidAmount: "7500.00",
};

const fields = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "mobileNumber", label: "Mobile number", type: "tel", autoComplete: "tel" },
  { name: "emailAddress", label: "Email address", type: "email", autoComplete: "email" },
  { name: "paidAmount", label: "Amount paid (LKR)", type: "number", min: "0.01", step: "0.01" },
];

const TICKET_CAPACITY = 75;

export default function TicketPurchasePage() {
  const [form, setForm] = useState(initialForm);
  const [slip, setSlip] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ticketsSold, setTicketsSold] = useState(0);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  async function loadAvailability() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ticket-orders/availability`);
      const sold = Number(response.data.sold);
      if (Number.isFinite(sold)) setTicketsSold(Math.min(TICKET_CAPACITY, Math.max(0, sold)));
    } catch (availabilityError) {
      console.error("Could not load ticket availability:", availabilityError);
    } finally {
      setAvailabilityLoaded(true);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  const ticketsRemaining = Math.max(0, TICKET_CAPACITY - ticketsSold);
  const soldPercentage = Math.round((ticketsSold / TICKET_CAPACITY) * 100);
  const ticketsSoldOut = availabilityLoaded && ticketsSold >= TICKET_CAPACITY;

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (ticketsSoldOut) return setError("All tickets have been sold. Ticket purchases are closed.");
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
      loadAvailability();
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
        <div className="mt-6 max-w-xl rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5" aria-label={`${ticketsRemaining} of ${TICKET_CAPACITY} tickets remaining`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-100">Tickets remaining</p>
              <p className="mt-1 text-2xl font-bold sm:text-3xl">{ticketsRemaining} <span className="text-base font-medium text-indigo-100">of {TICKET_CAPACITY}</span></p>
            </div>
            <p className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-indigo-800">{soldPercentage}% sold</p>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-indigo-950/50" role="progressbar" aria-label="Tickets sold" aria-valuemin={0} aria-valuemax={TICKET_CAPACITY} aria-valuenow={ticketsSold} aria-valuetext={`${ticketsSold} of ${TICKET_CAPACITY} sold`}>
            <div className="h-full rounded-full bg-amber-300 transition-[width] duration-500" style={{ width: `${(ticketsSold / TICKET_CAPACITY) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-indigo-100">{ticketsSoldOut ? "Sold out" : `${ticketsSold} of ${TICKET_CAPACITY} tickets sold${!availabilityLoaded ? " · Updating…" : ""}`}</p>
        </div>
        <p className="mt-3 max-w-xl text-indigo-100">Complete your payment first, then send your ticket request with the payment slip. The committee will review it and email your e-ticket. If you have any questions, feel free to contact Bharatha - 0773248542</p>
      </div>

      <div className="border-b border-slate-200 bg-indigo-50/60 px-6 py-7 sm:px-10">
        <h2 className="text-xl font-bold text-slate-900">How to purchase your ticket</h2>
        <ol className="mt-5 space-y-4">
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">1</span>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900">Make your payment</h3>
              <p className="mt-1 text-sm text-slate-600">Transfer or deposit the ticket amount to this account. Use your first and last name as the payment reference so we can identify your payment.</p>
                <dl className="mt-3 grid gap-y-2 rounded-xl border border-indigo-100 bg-white p-4 text-sm">
                  <div>
                    <dt className="inline font-medium text-slate-700">Account name: </dt>
                    <dd className="inline text-slate-600">Tholangamuwa Central PS Colombo Group</dd>
                  </div>

                  <div>
                    <dt className="inline font-medium text-slate-700">Account number: </dt>
                    <dd className="inline text-slate-600">174-100110013005</dd>
                  </div>

                  <div>
                    <dt className="inline font-medium text-slate-700">Bank: </dt>
                    <dd className="inline text-slate-600">People's Bank</dd>
                  </div>

                  <div>
                    <dt className="inline font-medium text-slate-700">Branch: </dt>
                    <dd className="inline text-slate-600">Nugegoda</dd>
                  </div>
                </dl>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">2</span>
            <div><h3 className="font-semibold text-slate-900">Save your payment slip</h3><p className="mt-1 text-sm text-slate-600">Take a clear photo of the deposit slip or download your transfer receipt. You’ll attach it to the request.</p></div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">3</span>
            <div><h3 className="font-semibold text-slate-900">Complete and submit the request form</h3><p className="mt-1 text-sm text-slate-600">Enter your details, provide the amount paid, and upload the saved payment slip below.</p></div>
          </li>
          <li className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">4</span>
            <div><h3 className="font-semibold text-slate-900">Wait for review and receive your e-ticket</h3><p className="mt-1 text-sm text-slate-600">The committee will verify your payment and send your e-ticket once your request is approved.</p></div>
          </li>
        </ol>
      </div>

      <form onSubmit={submit} className="space-y-6 p-6 sm:p-10">
        {ticketsSoldOut && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">All tickets have been sold. Ticket purchases are closed.</p>}
        <div>
          <label htmlFor="eventName" className="font-semibold text-slate-800">Event name</label>
          <input id="eventName" name="eventName" value={form.eventName} readOnly required maxLength={120} placeholder="Which event are you attending?" className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-600`} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ name, label, ...attributes }) => (
            <div key={name}>
              <label htmlFor={name} className="font-semibold text-slate-800">{label}</label>
              <input id={name} name={name} value={form[name]} onChange={update} readOnly={name === "paidAmount"} required className={`${inputClass} ${name === "paidAmount" ? "cursor-not-allowed bg-slate-50 text-slate-600" : ""}`} {...attributes} />
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="paymentSlip" className="font-semibold text-slate-800">Payment slip</label>
          <input id="paymentSlip" name="paymentSlip" type="file" required accept="image/jpeg,image/png,image/webp" onChange={(e) => setSlip(e.target.files?.[0] || null)} className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:font-semibold file:text-indigo-700`} />
          <p className="mt-2 text-sm text-slate-500">JPG, PNG, or WebP image · Up to 5 MB</p>
        </div>

        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Your order will remain pending until the payment slip is reviewed. Please ensure the paid amount matches the ticket payment.</p>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">{message}</p>}
        <button type="submit" disabled={submitting || ticketsSoldOut} className="w-full rounded-xl bg-indigo-700 px-5 py-4 font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60">
          {ticketsSoldOut ? "Tickets sold out" : submitting ? "Submitting…" : "Submit ticket request"}
        </button>
      </form>
    </section>
  );
}
