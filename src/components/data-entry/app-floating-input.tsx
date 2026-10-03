'use client'

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import {
  FloatingInput,
  type FloatingInputProps,
} from '@/components/data-entry/floating-input'
import type { IconName } from '@/components/general/app-icon'

type AppFloatingInputProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label: string
  startIcon?: IconName
  type?: FloatingInputProps['type']
  autoComplete?: string
  required?: boolean
  clearable?: boolean
  className?: string
  containerClassName?: string
  labelBackgroundClassName?: string
  forceLight?: boolean
}

/**
 * Floating outlined input gắn React Hook Form (`Controller`).
 */
export default function AppFloatingInput<T extends FieldValues>({
  name,
  control,
  label,
  startIcon,
  type = 'text',
  autoComplete,
  required,
  clearable,
  className,
  containerClassName,
  labelBackgroundClassName,
  forceLight,
}: AppFloatingInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FloatingInput
          {...field}
          value={field.value ?? ''}
          label={required ? `${label} *` : label}
          startIcon={startIcon}
          type={type}
          autoComplete={autoComplete}
          clearable={clearable}
          invalid={fieldState.invalid}
          errorMessage={
            fieldState.error?.message && fieldState.error.message.trim()
              ? fieldState.error.message
              : undefined
          }
          className={className}
          containerClassName={containerClassName}
          labelBackgroundClassName={labelBackgroundClassName}
          forceLight={forceLight}
          onClear={() => field.onChange('')}
        />
      )}
    />
  )
}
