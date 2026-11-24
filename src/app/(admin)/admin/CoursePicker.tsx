"use client";
import { useState } from "react";
import { site } from "@/config/site";

const OTHER = "__other__";

/**
 * English course picker for certificates: a real <select> listing every course,
 * plus "Other…" which reveals a text box for a custom course name.
 * (A <datalist> filters its options by the current text, so it hid the other courses.)
 */
export default function CoursePicker({
  value, onChange, required, otherLabel = "Other (type your own)…", otherPlaceholder = "Course name in English",
}: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
}) {
  const titles = site.courses.map((c) => c.title.en);
  const [custom, setCustom] = useState(() => value !== "" && !titles.includes(value));

  return (
    <>
      <select
        value={custom ? OTHER : value}
        required={required}
        onChange={(ev) => {
          if (ev.target.value === OTHER) { setCustom(true); onChange(""); }
          else { setCustom(false); onChange(ev.target.value); }
        }}
      >
        {titles.map((t) => <option key={t} value={t}>{t}</option>)}
        <option value={OTHER}>{otherLabel}</option>
      </select>
      {custom && (
        <input value={value} onChange={(ev) => onChange(ev.target.value)} required={required}
          maxLength={80} placeholder={otherPlaceholder} autoFocus style={{ marginTop: "0.4rem" }} />
      )}
    </>
  );
}
