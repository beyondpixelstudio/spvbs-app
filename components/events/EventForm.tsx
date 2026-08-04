"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { createEvent, updateEvent } from "@/app/actions/events";

type EventData = {
  id?: string;
  title: string;
  description: string;
  dateTime: string;
  location: string;
  taluka: string;
  rsvpCapacity: string;
};

export default function EventForm({
  event,
  onClose,
}: {
  event?: EventData;
  onClose: () => void;
}) {
  const isEdit = !!event?.id;
  const [form, setForm] = useState<EventData>({
    title: event?.title || "",
    description: event?.description || "",
    dateTime: event?.dateTime || "",
    location: event?.location || "",
    taluka: event?.taluka || "",
    rsvpCapacity: event?.rsvpCapacity || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof EventData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.dateTime) {
      setError("Date & time is required.");
      return;
    }
    setLoading(true);
    const res = isEdit
      ? await updateEvent(event!.id!, form)
      : await createEvent(form);
    setLoading(false);
    if (res?.error) setError(res.error);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-black/40">
      <div
        className="bg-white rounded-[31px] w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-[30px] sm:p-[36px]"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <h4 className="!text-[22px] text-[var(--color-bg-secondary)]">
            {isEdit ? "Edit event" : "Create event"}
          </h4>
          <button
            onClick={onClose}
            className="text-[24px] text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)] cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-[16px]">
          <Input
            id="title"
            label="Event Title *"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Annual Sammelan 2026"
          />
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="description" className="text-[15px] font-medium text-[var(--color-text)]">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Details about the event..."
              className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-y"
            />
          </div>
          <Input
            id="dateTime"
            label="Date & Time *"
            type="datetime-local"
            value={form.dateTime}
            onChange={(e) => update("dateTime", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
            <Input
              id="location"
              label="Location"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Venue / address"
            />
            <Input
              id="taluka"
              label="Taluka"
              value={form.taluka}
              onChange={(e) => update("taluka", e.target.value)}
              placeholder="e.g. Aska"
            />
          </div>
          <Input
            id="rsvpCapacity"
            label="RSVP Capacity (optional)"
            type="number"
            value={form.rsvpCapacity}
            onChange={(e) => update("rsvpCapacity", e.target.value)}
            placeholder="Max attendees (leave blank for unlimited)"
          />

          {error && (
            <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px]">
              {error}
            </p>
          )}

          <div className="flex gap-[12px] mt-[6px]">
            <Button variant="primary" onClick={handleSubmit}>
              {loading ? "Saving..." : isEdit ? "Save changes" : "Create event"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
