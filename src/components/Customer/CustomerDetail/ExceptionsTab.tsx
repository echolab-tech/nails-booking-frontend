"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CustomerServiceException,
  deleteCustomerException,
  getCustomerExceptions,
  saveCustomerException,
} from "@/services/customer.service";
import { getListService } from "@/services/assistants.service";

/**
 * Miro Frame 1 #19 — Exception: khách này cần thêm bao nhiêu thời gian cho service gì,
 * thêm bao nhiêu tiền. Khi khách chọn đúng service đó lúc booking, hệ thống tự cộng thêm
 * và hiện lên cho thấy trước.
 */
const inputClass =
  "w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-2 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white";

const ExceptionsTab = ({ customerId }: { customerId: string | number }) => {
  const [items, setItems] = useState<CustomerServiceException[]>([]);
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({ service_id: "", extra_minutes: "0", extra_price: "0", note: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await getCustomerExceptions(customerId);
      setItems(res?.data?.data ?? []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    getListService(true)
      .then((res) => {
        const raw = res?.data?.data;
        const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.services ?? [];
        setServices(list.map((s: any) => ({ id: s.id, name: s.name })));
      })
      .catch(() => setServices([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleSave = async () => {
    if (!form.service_id) {
      toast.warning("Please choose a service");
      return;
    }
    setSaving(true);
    try {
      await saveCustomerException(customerId, {
        service_id: form.service_id,
        extra_minutes: Number(form.extra_minutes) || 0,
        extra_price: Number(form.extra_price) || 0,
        note: form.note,
      });
      toast.success("Exception saved");
      setForm({ service_id: "", extra_minutes: "0", extra_price: "0", note: "" });
      load();
    } catch {
      toast.error("Failed to save exception");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this exception?")) return;
    try {
      await deleteCustomerException(customerId, id);
      load();
    } catch {
      toast.error("Failed to delete exception");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Extra time and price this customer needs for a service. When this customer books that
        service, the extra time and price are added automatically and shown before booking.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <select
          className={`${inputClass} md:col-span-2`}
          value={form.service_id}
          onChange={(e) => setForm({ ...form, service_id: e.target.value })}
        >
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm">+ min</span>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.extra_minutes}
            onChange={(e) => setForm({ ...form, extra_minutes: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm">+ $</span>
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputClass}
            value={form.extra_price}
            onChange={(e) => setForm({ ...form, extra_price: e.target.value })}
          />
        </label>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-4"
        >
          Save
        </button>
        <input
          className={`${inputClass} md:col-span-5`}
          placeholder="Note (optional) — e.g. long nails, needs extra soak time"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            <th className="px-3 py-2">Service</th>
            <th className="px-3 py-2">Extra time</th>
            <th className="px-3 py-2">Extra price</th>
            <th className="px-3 py-2">Note</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-stroke">
              <td className="px-3 py-2">{item.service?.name ?? `#${item.service_id}`}</td>
              <td className="px-3 py-2">+{item.extra_minutes} min</td>
              <td className="px-3 py-2">+${Number(item.extra_price).toFixed(2)}</td>
              <td className="px-3 py-2 text-sm text-gray-600">{item.note}</td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-red hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                No exceptions for this customer.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExceptionsTab;
