"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";

const DEVICE_TYPES = [
  { value: "POS", label: "POS Device" },
  { value: "KDS", label: "KDS Device" },
];

const KDS_STATION_OPTIONS = [
  "MAIN",
  "EXPEDITOR",
  "GRILL",
  "FRYER",
  "DRINKS",
  "PACKING",
  "DESSERT",
  "CUSTOM",
];

function formatDateTime(value) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}

function buildScreenOptions(screens, branchId) {
  return screens.filter((screen) => !branchId || screen.branchId === Number(branchId));
}

function StatusBadge({ status }) {
  const active = status === "ACTIVE";
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        background: active ? "#dcfce7" : "#fee2e2",
        color: active ? "#166534" : "#991b1b",
      }}
    >
      {status}
    </span>
  );
}

export default function DevicesManagement({ devices: initialDevices, branches, screens: initialScreens }) {
  const router = useRouter();
  const [devices, setDevices] = useState(initialDevices);
  const [screens, setScreens] = useState(initialScreens);
  const [error, setError] = useState("");
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [screenModalOpen, setScreenModalOpen] = useState(false);
  const [secretModal, setSecretModal] = useState({ open: false, title: "", token: "", deviceUrl: "" });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: "", id: null, name: "" });
  const [loading, setLoading] = useState("");
  const [editingDevice, setEditingDevice] = useState(null);
  const [editingScreen, setEditingScreen] = useState(null);
  const [deviceForm, setDeviceForm] = useState({
    name: "",
    deviceType: "POS",
    branchId: branches[0]?.id ? String(branches[0].id) : "",
    screenId: "",
    status: "ACTIVE",
  });
  const [screenForm, setScreenForm] = useState({
    name: "",
    code: "",
    branchId: branches[0]?.id ? String(branches[0].id) : "",
    stationType: "MAIN",
    isDefault: false,
    isActive: true,
  });

  useEffect(() => {
    setDevices(initialDevices);
  }, [initialDevices]);

  useEffect(() => {
    setScreens(initialScreens);
  }, [initialScreens]);

  const availableScreenOptions = useMemo(
    () => buildScreenOptions(screens, deviceForm.branchId),
    [screens, deviceForm.branchId]
  );

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt("Copy this value:", value);
    }
  }

  function resetDeviceForm() {
    setEditingDevice(null);
    setDeviceForm({
      name: "",
      deviceType: "POS",
      branchId: branches[0]?.id ? String(branches[0].id) : "",
      screenId: "",
      status: "ACTIVE",
    });
  }

  function resetScreenForm() {
    setEditingScreen(null);
    setScreenForm({
      name: "",
      code: "",
      branchId: branches[0]?.id ? String(branches[0].id) : "",
      stationType: "MAIN",
      isDefault: false,
      isActive: true,
    });
  }

  function openEditDevice(device) {
    setEditingDevice(device);
    setDeviceForm({
      name: device.name,
      deviceType: device.deviceType,
      branchId: device.branchId ? String(device.branchId) : "",
      screenId: device.screenId ? String(device.screenId) : "",
      status: device.status,
    });
    setDeviceModalOpen(true);
  }

  function openEditScreen(screen) {
    setEditingScreen(screen);
    setScreenForm({
      name: screen.name,
      code: screen.code || "",
      branchId: screen.branchId ? String(screen.branchId) : "",
      stationType: screen.stationType,
      isDefault: Boolean(screen.isDefault),
      isActive: Boolean(screen.isActive),
    });
    setScreenModalOpen(true);
  }

  async function submitDeviceForm(event) {
    event.preventDefault();
    setError("");
    setLoading(editingDevice ? `device-update-${editingDevice.id}` : "device-create");

    try {
      const endpoint = editingDevice ? `/api/devices/${editingDevice.id}` : "/api/devices";
      const method = editingDevice ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deviceForm.name.trim(),
          deviceType: deviceForm.deviceType,
          branchId: deviceForm.branchId ? Number(deviceForm.branchId) : null,
          screenId: deviceForm.deviceType === "KDS" && deviceForm.screenId ? Number(deviceForm.screenId) : null,
          status: deviceForm.status,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Failed to save device");
        return;
      }

      if (!editingDevice && payload?.token && payload?.deviceUrl) {
        setSecretModal({
          open: true,
          title: "New device token",
          token: payload.token,
          deviceUrl: payload.deviceUrl,
        });
      }

      setDeviceModalOpen(false);
      resetDeviceForm();
      router.refresh();
    } catch {
      setError("Something went wrong while saving the device.");
    } finally {
      setLoading("");
    }
  }

  async function submitScreenForm(event) {
    event.preventDefault();
    setError("");
    setLoading(editingScreen ? `screen-update-${editingScreen.id}` : "screen-create");

    try {
      const endpoint = editingScreen ? `/api/kds/screens/${editingScreen.id}` : "/api/kds/screens";
      const method = editingScreen ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: screenForm.name.trim(),
          code: screenForm.code.trim(),
          branchId: Number(screenForm.branchId),
          stationType: screenForm.stationType,
          isDefault: screenForm.isDefault,
          isActive: screenForm.isActive,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Failed to save screen");
        return;
      }

      setScreenModalOpen(false);
      resetScreenForm();
      router.refresh();
    } catch {
      setError("Something went wrong while saving the KDS screen.");
    } finally {
      setLoading("");
    }
  }

  async function regenerateDevice(device) {
    setError("");
    setLoading(`regen-${device.id}`);
    try {
      const response = await fetch(`/api/devices/${device.id}/regenerate`, { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Failed to regenerate token");
        return;
      }

      setSecretModal({
        open: true,
        title: `Regenerated token for ${device.name}`,
        token: payload.token,
        deviceUrl: payload.deviceUrl,
      });
      router.refresh();
    } catch {
      setError("Something went wrong while regenerating the token.");
    } finally {
      setLoading("");
    }
  }

  async function confirmDelete() {
    if (!deleteConfirm.id || !deleteConfirm.type) return;
    setError("");
    setLoading(`delete-${deleteConfirm.type}-${deleteConfirm.id}`);

    try {
      const endpoint =
        deleteConfirm.type === "device"
          ? `/api/devices/${deleteConfirm.id}`
          : `/api/kds/screens/${deleteConfirm.id}`;
      const response = await fetch(endpoint, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Failed to delete");
        return;
      }

      setDeleteConfirm({ open: false, type: "", id: null, name: "" });
      router.refresh();
    } catch {
      setError("Something went wrong while deleting.");
    } finally {
      setLoading("");
    }
  }

  async function toggleDeviceStatus(device) {
    setError("");
    setLoading(`toggle-${device.id}`);
    try {
      const nextStatus = device.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
      const response = await fetch(`/api/devices/${device.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Failed to update device status");
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong while updating device status.");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="py-4 w-full min-w-0 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="m-0 text-xl font-semibold text-color-text">POS & KDS Devices</h2>
          <p className="mt-1 text-sm text-color-text-muted">
            Create dedicated device links for cashier screens and kitchen displays without requiring staff login.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              resetScreenForm();
              setScreenModalOpen(true);
            }}
            className="py-2 px-4 rounded-lg border border-color-border bg-white text-color-text text-sm font-medium hover:bg-color-bg"
          >
            + Add KDS Screen
          </button>
          <button
            type="button"
            onClick={() => {
              resetDeviceForm();
              setDeviceModalOpen(true);
            }}
            className="py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:opacity-90"
          >
            + Add Device
          </button>
        </div>
      </div>

      {error ? <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <section className="space-y-4">
        <div>
          <h3 className="m-0 text-lg font-semibold text-color-text">Devices</h3>
          <p className="mt-1 text-sm text-color-text-muted">
            Links are shown only when a device is created or its token is regenerated.
          </p>
        </div>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[960px]">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Device</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Type</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Branch</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">KDS Screen</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Last Seen</th>
                  <th className="py-3 px-4 text-right font-semibold text-color-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="font-medium text-color-text">{device.name}</div>
                      <div className="text-xs text-color-text-muted">
                        Created {formatDateTime(device.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">{device.deviceType}</td>
                    <td className="py-3 px-4">{device.branch?.name || "Unassigned"}</td>
                    <td className="py-3 px-4">
                      {device.deviceType === "KDS" ? device.screen?.name || "Branch-wide default" : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={device.status} />
                    </td>
                    <td className="py-3 px-4 text-color-text-muted">{formatDateTime(device.lastSeenAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEditDevice(device)}
                          className="py-1.5 px-3 rounded text-xs font-medium border border-color-border bg-white text-color-text hover:bg-color-bg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={loading === `regen-${device.id}`}
                          onClick={() => regenerateDevice(device)}
                          className="py-1.5 px-3 rounded text-xs font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 disabled:opacity-60"
                        >
                          Regenerate Link
                        </button>
                        <button
                          type="button"
                          disabled={loading === `toggle-${device.id}`}
                          onClick={() => toggleDeviceStatus(device)}
                          className="py-1.5 px-3 rounded text-xs font-medium border border-color-border bg-white text-color-text hover:bg-color-bg disabled:opacity-60"
                        >
                          {device.status === "ACTIVE" ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm({ open: true, type: "device", id: device.id, name: device.name })}
                          className="py-1.5 px-3 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {devices.length === 0 ? (
            <div className="px-6 py-8 text-center text-color-text-muted text-sm">
              No devices yet. Create a POS or KDS device to generate a kiosk-ready link.
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="m-0 text-lg font-semibold text-color-text">KDS Screens</h3>
          <p className="mt-1 text-sm text-color-text-muted">
            Define branch kitchen screens now so you can phase into a station-based workflow later.
          </p>
        </div>
        <div className="bg-color-card rounded-lg border border-color-border overflow-hidden shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[860px]">
              <thead>
                <tr className="bg-color-bg border-b border-color-border">
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Screen</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Branch</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Station</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Default</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Devices</th>
                  <th className="py-3 px-4 text-left font-semibold text-color-text">Orders</th>
                  <th className="py-3 px-4 text-right font-semibold text-color-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {screens.map((screen) => (
                  <tr key={screen.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">
                      <div className="font-medium text-color-text">{screen.name}</div>
                      <div className="text-xs text-color-text-muted">{screen.code || "No code"}</div>
                    </td>
                    <td className="py-3 px-4">{screen.branch?.name}</td>
                    <td className="py-3 px-4">{screen.stationType}</td>
                    <td className="py-3 px-4">{screen.isDefault ? "Yes" : "No"}</td>
                    <td className="py-3 px-4">{screen._count?.deviceTokens ?? 0}</td>
                    <td className="py-3 px-4">{screen._count?.kdsItems ?? 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEditScreen(screen)}
                          className="py-1.5 px-3 rounded text-xs font-medium border border-color-border bg-white text-color-text hover:bg-color-bg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm({ open: true, type: "screen", id: screen.id, name: screen.name })}
                          className="py-1.5 px-3 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {screens.length === 0 ? (
            <div className="px-6 py-8 text-center text-color-text-muted text-sm">
              No KDS screens yet. Create a default branch screen first, then add station-specific screens later.
            </div>
          ) : null}
        </div>
      </section>

      {deviceModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">
              {editingDevice ? "Edit Device" : "Add Device"}
            </h3>
            <form onSubmit={submitDeviceForm}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-color-text">Device Name</label>
                <input
                  type="text"
                  required
                  value={deviceForm.name}
                  onChange={(event) => setDeviceForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  placeholder="Front Counter POS 1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-color-text">Type</label>
                  <select
                    value={deviceForm.deviceType}
                    onChange={(event) =>
                      setDeviceForm((current) => ({
                        ...current,
                        deviceType: event.target.value,
                        screenId: event.target.value === "KDS" ? current.screenId : "",
                      }))
                    }
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    {DEVICE_TYPES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-color-text">Branch</label>
                  <select
                    value={deviceForm.branchId}
                    onChange={(event) => setDeviceForm((current) => ({ ...current, branchId: event.target.value, screenId: "" }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {deviceForm.deviceType === "KDS" ? (
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-color-text">KDS Screen</label>
                  <select
                    value={deviceForm.screenId}
                    onChange={(event) => setDeviceForm((current) => ({ ...current, screenId: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    <option value="">Branch default screen</option>
                    {availableScreenOptions.map((screen) => (
                      <option key={screen.id} value={screen.id}>
                        {screen.name} ({screen.stationType})
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {editingDevice ? (
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-color-text">Status</label>
                  <select
                    value={deviceForm.status}
                    onChange={(event) => setDeviceForm((current) => ({ ...current, status: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DISABLED">DISABLED</option>
                  </select>
                </div>
              ) : null}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeviceModalOpen(false);
                    resetDeviceForm();
                    setError("");
                  }}
                  className="rounded-lg border border-color-border px-4 py-2 text-color-text hover:bg-color-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "device-create" || loading === `device-update-${editingDevice?.id}`}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-70"
                >
                  {editingDevice ? "Save Device" : "Create Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {screenModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 mb-4 text-lg font-semibold text-color-text">
              {editingScreen ? "Edit KDS Screen" : "Add KDS Screen"}
            </h3>
            <form onSubmit={submitScreenForm}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-color-text">Screen Name</label>
                  <input
                    type="text"
                    required
                    value={screenForm.name}
                    onChange={(event) => setScreenForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                    placeholder="Kitchen Main Screen"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-color-text">Code</label>
                  <input
                    type="text"
                    value={screenForm.code}
                    onChange={(event) => setScreenForm((current) => ({ ...current, code: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                    placeholder="MAIN"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-color-text">Branch</label>
                  <select
                    value={screenForm.branchId}
                    onChange={(event) => setScreenForm((current) => ({ ...current, branchId: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-color-text">Station Type</label>
                  <select
                    value={screenForm.stationType}
                    onChange={(event) => setScreenForm((current) => ({ ...current, stationType: event.target.value }))}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-color-text"
                  >
                    {KDS_STATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-color-text">
                  <input
                    type="checkbox"
                    checked={screenForm.isDefault}
                    onChange={(event) => setScreenForm((current) => ({ ...current, isDefault: event.target.checked }))}
                  />
                  Default screen for this branch
                </label>
                <label className="flex items-center gap-2 text-sm text-color-text">
                  <input
                    type="checkbox"
                    checked={screenForm.isActive}
                    onChange={(event) => setScreenForm((current) => ({ ...current, isActive: event.target.checked }))}
                  />
                  Screen is active
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setScreenModalOpen(false);
                    resetScreenForm();
                    setError("");
                  }}
                  className="rounded-lg border border-color-border px-4 py-2 text-color-text hover:bg-color-bg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading === "screen-create" || loading === `screen-update-${editingScreen?.id}`}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white disabled:opacity-70"
                >
                  {editingScreen ? "Save Screen" : "Create Screen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {secretModal.open ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-color-border bg-color-card p-6 shadow-xl">
            <h3 className="m-0 text-lg font-semibold text-color-text">{secretModal.title}</h3>
            <p className="mt-2 text-sm text-color-text-muted">
              Save this token and link now. For security, the raw token cannot be viewed again later.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-color-text">Token</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={secretModal.token}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-sm text-color-text"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(secretModal.token)}
                    className="rounded-lg border border-color-border bg-white px-4 py-2 text-sm font-medium text-color-text hover:bg-color-bg"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-color-text">Device Link</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={secretModal.deviceUrl}
                    className="w-full rounded-lg border border-color-border bg-color-bg px-3 py-2 text-sm text-color-text"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(secretModal.deviceUrl)}
                    className="rounded-lg border border-color-border bg-white px-4 py-2 text-sm font-medium text-color-text hover:bg-color-bg"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSecretModal({ open: false, title: "", token: "", deviceUrl: "" })}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={deleteConfirm.open}
        title={deleteConfirm.type === "device" ? "Delete Device" : "Delete KDS Screen"}
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, type: "", id: null, name: "" })}
        loading={loading === `delete-${deleteConfirm.type}-${deleteConfirm.id}`}
      />
    </div>
  );
}
