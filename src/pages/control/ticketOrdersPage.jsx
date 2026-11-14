import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/ticket-orders`;
const statuses = ["all", "pending", "approved", "rejected"];

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function statusClass(status) {
  if (status === "approved") return "bg-green-100 text-green-800";
  if (status === "rejected") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export default function TicketOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [slip, setSlip] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        params: filter === "all" ? {} : { status: filter },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load ticket orders.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadOrders(); }, [loadOrders]);
  useEffect(() => () => { if (slip?.url) URL.revokeObjectURL(slip.url); }, [slip]);

  async function reviewOrder(orderId, status) {
    setBusyId(orderId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${apiUrl}/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      await loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update ticket order.");
    } finally {
      setBusyId("");
    }
  }

  async function showSlip(order) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/${order._id}/payment-slip`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      setSlip({ url, type: response.data.type, name: `${order.firstName} ${order.lastName}` });
    } catch {
      toast.error("Could not open the payment slip.");
    }
  }

  const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" });

  return (
    <section className="space-y-6">
      <style>{`@media print {
        @page { margin: 14mm; }
        body { background: #fff !important; }
        .ticket-orders-no-print { display: none !important; }
        .ticket-orders-print-only { display: block !important; }
        .ticket-orders-print-list { display: block !important; }
        .ticket-orders-print-card { break-inside: avoid; box-shadow: none !important; border: 1px solid #cbd5e1 !important; margin-bottom: 12px !important; }
      }`}</style>
      <div className="ticket-orders-no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Ticket sales</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Ticket orders & approvals</h2>
          <p className="mt-1 text-sm text-slate-600">Check buyer details and payment slips before confirming an order.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter ticket orders">
          {statuses.map((status) => (
            <button key={status} type="button" onClick={() => setFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${filter === status ? "bg-indigo-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
              {status}
            </button>
          ))}
          <button type="button" onClick={loadOrders} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-slate-200 hover:bg-indigo-50">Refresh</button>
          <button type="button" onClick={() => window.print()} disabled={loading || orders.length === 0} className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">Print {filter === "all" ? "all" : filter} orders</button>
        </div>
      </div>

      <div className="ticket-orders-print-only hidden">
        <h1 className="text-2xl font-bold text-slate-900">Ticket orders · {filter === "all" ? "All statuses" : filter}</h1>
        <p className="mt-1 text-sm text-slate-600">{orders.length} {orders.length === 1 ? "order" : "orders"} · Printed {new Date().toLocaleString()}</p>
      </div>

      {loading ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading ticket orders…</div>
        : orders.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">No {filter === "all" ? "ticket" : filter} orders found.</div>
          : <div className="ticket-orders-print-list space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="ticket-orders-print-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{order.eventName}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">{order.firstName} {order.lastName}</h3>
                    <p className="mt-1 text-xs text-slate-500">Submitted {formatDate(order.createdAt)} · Ref {order.referenceNumber || `TCC-LEGACY-${order._id.slice(-6).toUpperCase()}`}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(order.status)}`}>{order.status}</span>
                </div>

                <dl className="grid gap-x-6 gap-y-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail label="Mobile number" value={order.mobileNumber} />
                  <Detail label="Email address" value={order.emailAddress} />
                  <Detail label="NIC number" value={order.nicNumber} />
                  <Detail label="Address" value={order.address} />
                  <Detail label="Paid amount" value={currency.format(order.paidAmount)} />
                  <div className="ticket-orders-no-print">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment slip</dt>
                    <dd className="mt-1"><button type="button" onClick={() => showSlip(order)} className="font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900">View payment slip</button></dd>
                  </div>
                </dl>

                {order.status === "pending" && <div className="ticket-orders-no-print flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                  <button type="button" disabled={busyId === order._id} onClick={() => reviewOrder(order._id, "approved")} className="rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white hover:bg-green-800 disabled:opacity-50">{busyId === order._id ? "Saving…" : "Approve ticket"}</button>
                  <button type="button" disabled={busyId === order._id} onClick={() => reviewOrder(order._id, "rejected")} className="rounded-lg border border-red-200 px-5 py-2.5 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Reject</button>
                </div>}
                {order.status !== "pending" && order.emailAddress && <div className="ticket-orders-no-print border-t border-slate-100 pt-4">
                  <button type="button" disabled={busyId === order._id} onClick={() => reviewOrder(order._id, order.status)} className="rounded-lg border border-indigo-200 px-4 py-2 font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50">
                    {busyId === order._id ? "Sending…" : order.status === "approved" ? "Resend e-ticket" : "Resend rejection email"}
                  </button>
                </div>}
              </article>
            ))}
          </div>}

      {slip && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4" role="presentation" onClick={() => setSlip(null)}>
        <div role="dialog" aria-modal="true" aria-label={`Payment slip for ${slip.name}`} onClick={(event) => event.stopPropagation()} className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-4"><h3 className="font-bold text-slate-900">Payment slip · {slip.name}</h3><button type="button" onClick={() => setSlip(null)} className="rounded-lg px-3 py-1 text-slate-600 hover:bg-slate-100" aria-label="Close payment slip">Close</button></div>
          <div className="min-h-0 overflow-auto p-3 text-center">{slip.type === "application/pdf" ? <iframe title="Payment slip PDF" src={slip.url} className="h-[75vh] w-full" /> : <img src={slip.url} alt={`Payment slip for ${slip.name}`} className="mx-auto max-h-[75vh] max-w-full object-contain" />}</div>
        </div>
      </div>}
    </section>
  );
}

function Detail({ label, value }) {
  return <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium text-slate-800">{value || "—"}</dd></div>;
}
