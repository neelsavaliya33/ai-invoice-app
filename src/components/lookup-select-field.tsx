"use client";

import { SelectField } from "@/components/form-kit";
import {
  LookupSelectOption,
  useLookupOptions,
} from "@/lib/use-lookups";
import type { ComponentProps } from "react";

type LookupSelectFieldProps = Omit<
  ComponentProps<typeof SelectField>,
  "options"
> & {
  group: string;
  fallbackOptions?: LookupSelectOption[];
  prependOptions?: LookupSelectOption[];
};

export function LookupSelectField({
  group,
  fallbackOptions,
  prependOptions = [],
  helper,
  ...props
}: LookupSelectFieldProps) {
  const { options } = useLookupOptions(group, fallbackOptions);
  const resolvedOptions = [...prependOptions, ...options];

  return (
    <SelectField
      {...props}
      helper={helper}
      options={resolvedOptions}
    />
  );
}
