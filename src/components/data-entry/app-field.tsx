"use client";

import * as React from "react";
import type { FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
    Field,
    FieldError as UiFieldError,
    FieldLabel,
} from "@/components/ui/field";

export interface FormFieldProps {
    label?: string;
    required?: boolean;
    invalid?: boolean;
    error?: FieldError;
    className?: string;
    children: React.ReactNode;
}

export function AppField({
    label,
    required,
    invalid,
    error,
    className,
    children,
}: FormFieldProps) {
    const showError = invalid && !!error;

    return (
        <Field data-invalid={showError} className={className}>
            {label ? (
                <FieldLabel
                    className={cn("text-xs lg:text-sm font-semibold", required && "text-destructive")}
                >
                    {label}
                    {required ? (
                        <span aria-hidden className="ml-0.5">
                            *
                        </span>
                    ) : null}
                </FieldLabel>
            ) : null}
            {children}
            {showError ? <UiFieldError errors={[error]} /> : null}
        </Field>
    );
}