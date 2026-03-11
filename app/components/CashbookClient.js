"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

export default function CashbookClient() {
  const router = useRouter();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [loading, setLoading] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const [error, setError] = useState("");

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setLoading("deposit");
    try {
      const res = await fetch("/api/cashbook/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Deposit failed");
      setDepositAmount("");
      router.refresh();
    } catch (err) {
      setError(err.message || "Deposit failed");
    } finally {
      setLoading("");
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setError("");
    setLoading("withdrawal");
    try {
      const res = await fetch("/api/cashbook/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Withdrawal failed");
      setWithdrawalAmount("");
      router.refresh();
    } catch (err) {
      setError(err.message || "Withdrawal failed");
    } finally {
      setLoading("");
    }
  };

  const handleSyncToFiskaly = async () => {
    setSyncStatus("syncing");
    setError("");
    try {
      const res = await fetch("/api/tse/dsfinvk-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().slice(0, 10) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sync failed");
      setSyncStatus(`Synced ${data.synced ?? 0} transactions`);
    } catch (err) {
      setSyncStatus("");
      setError(err.message || "Sync failed");
    }
    setTimeout(() => setSyncStatus(""), 3000);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <form onSubmit={handleDeposit} className="flex gap-2 items-end">
        <div>
          <label className="block text-xs font-medium text-color-text-muted mb-1">Cash deposit (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="py-2 px-3 border border-color-border rounded-lg text-sm w-32"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            disabled={!!loading}
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          disabled={!!loading}
        >
          {loading === "deposit" ? <Spinner size="sm" className="text-white" /> : "Deposit"}
        </button>
      </form>
      <form onSubmit={handleWithdrawal} className="flex gap-2 items-end">
        <div>
          <label className="block text-xs font-medium text-color-text-muted mb-1">Cash withdrawal (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="py-2 px-3 border border-color-border rounded-lg text-sm w-32"
            placeholder="0.00"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            disabled={!!loading}
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 rounded-lg font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
          disabled={!!loading}
        >
          {loading === "withdrawal" ? <Spinner size="sm" className="text-white" /> : "Withdrawal"}
        </button>
      </form>
      <button
        type="button"
        onClick={handleSyncToFiskaly}
        disabled={!!loading || syncStatus === "syncing"}
        className="py-2 px-4 rounded-lg font-medium bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-60 self-end"
        title="Submit Cash Point Closing to Fiskaly – data will appear in Dashboard DSFinV-K Exports"
      >
        {syncStatus === "syncing" ? <Spinner size="sm" className="text-white" /> : syncStatus || "Sync to Fiskaly"}
      </button>
      {error && <p className="text-sm text-red-500 self-end">{error}</p>}
    </div>
  );
}
