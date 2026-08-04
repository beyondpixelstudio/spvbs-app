import { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Option[];
  placeholder?: string;
};

export default function Select({
  label,
  id,
  options,
  placeholder = "Select...",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={id} className="text-[15px] font-medium text-[var(--color-text)]">
        {label}
      </label>
      <select
        id={id}
        className="w-full rounded-[14px] border border-[var(--color-border)] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] cursor-pointer"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
