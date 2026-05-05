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
  const { error, options, isError, isLoading } = useLookupOptions(group, fallbackOptions);
  const resolvedOptions = [...prependOptions, ...options];
  const errorMessage =
    error instanceof Error ? error.message : "Options could not be loaded.";

  return (
    <SelectField
      {...props}
      helper={
        helper ??
        (isLoading
          ? "Loading options"
          : isError
            ? `${errorMessage} Using saved options.`
            : undefined)
      }
      options={resolvedOptions}
    />
  );
}
