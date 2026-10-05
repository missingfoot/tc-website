import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "@/components/icons";
import { field } from "@/lib/styles";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  options: (string | { value: string; label: string })[];
  /** Greyed-out first option shown until something is picked (makes the select "empty" for `required`). */
  placeholder?: string;
};

/** A native select in the site's field style, with our chevron. */
export default function Select({ options, placeholder, className = "", ...props }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select {...props} defaultValue={props.defaultValue ?? (placeholder ? "" : undefined)} className={`${field} appearance-none pr-12 invalid:text-stone`}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => {
          const { value, label } = typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={value} value={value} className="text-ink">
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink" />
    </div>
  );
}
