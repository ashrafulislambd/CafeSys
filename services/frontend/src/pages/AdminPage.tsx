import { useState, useEffect } from "react";
import axios from "axios";
import { getStockStatus, setStock } from "../api";

export function AdminPage() {
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [stock, setStockValue] = useState<number | null>(null);

  const loadStock = () => {
    getStockStatus()
      .then((d) => setStockValue(d.value ?? 0))
      .catch(() => setStockValue(null));
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 0) {
      setMessage({ type: "error", text: "Enter a non-negative whole number." });
      return;
    }
    setMessage(null);
    setSubmitting(true);
    try {
      const data = await setStock(qty);
      if (data.success) {
        setMessage({ type: "success", text: "Stock updated." });
        setQuantity("");
        loadStock();
      } else {
        setMessage({
          type: "error",
          text: data.error ?? "Failed to update stock.",
        });
      }
    } catch (err) {
      const text =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : "Network error.";
      setMessage({ type: "error", text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-100 mb-1">Admin</h1>
        <p className="text-sm app-muted">Manage inventory for the cafeteria.</p>
      </div>

      <section className="app-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          Current stock
        </h2>
        <p className="app-muted">
          {stock !== null ? (
            <span className="font-medium text-slate-100">{stock}</span>
          ) : (
            <span className="app-muted">—</span>
          )}
          {stock !== null && " portion(s) available"}
        </p>
      </section>

      <section className="app-card p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Set stock</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="admin-qty"
              className="block text-sm font-medium app-muted mb-1"
            >
              Quantity
            </label>
            <input
              id="admin-qty"
              type="number"
              min={0}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="app-input w-full max-w-[8rem]"
            />
          </div>
          {message && (
            <p
              className={`text-sm ${message.type === "success" ? "text-emerald-300" : "text-rose-300"}`}
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="app-btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update stock"}
          </button>
        </form>
      </section>
    </div>
  );
}
