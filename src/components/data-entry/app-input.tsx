'use client'

import { useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import AppIcon from '@/components/general/app-icon';
import { type IconName } from '@/components/general/app-icon';
import { AppField } from './app-field';
import { cn } from '@/lib/utils';
interface InputAppProps {
  name: Path<FieldValues>;
  control: Control<FieldValues>;
  label?: string;
  /** Ẩn label nhưng vẫn giữ accessible name qua aria. */
  hideLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  type?: 'text' | 'password' | 'email' | 'number';
  autoComplete?: string;
  min?: string | number
  required?: boolean;
  className?: string;
}

const AppInput = ({
  name, control, label, hideLabel, placeholder, icon, type = 'text', autoComplete, min, required, className
}: InputAppProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppField
          label={hideLabel ? undefined : label}
          required={required}
          invalid={fieldState.invalid}
          error={fieldState.error}
        >
          <InputGroup className={cn('h-9 bg-card overflow-hidden', className)}>
            {icon && (
              <InputGroupAddon>
                <AppIcon icon={icon} className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            )}

            <InputGroupInput
              {...field}
              className="h-9 md:text-sm placeholder:text-sm"
              min={min}
              type={inputType}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-label={hideLabel ? label : undefined}
              aria-invalid={fieldState.invalid}
            />

            {isPassword && (
              <InputGroupAddon
                align="inline-end"
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AppIcon icon="eye" className="size-4 text-muted-foreground" />
                ) : (
                  <AppIcon icon="eye-off" className="size-4 text-muted-foreground" />
                )}
              </InputGroupAddon>
            )}
          </InputGroup>
        </AppField>

      )}
    />
  );
};

export default AppInput;