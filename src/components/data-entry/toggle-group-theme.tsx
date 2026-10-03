'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/motion-toggle-group'
import { SunMediumIcon, MoonIcon, LaptopMinimalIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

const THEME_OPTIONS = [
    { value: 'light', label: 'Toggle light', Icon: SunMediumIcon },
    { value: 'dark', label: 'Toggle dark', Icon: MoonIcon },
    { value: 'system', label: 'Toggle system', Icon: LaptopMinimalIcon },
] as const

const ToggleGroupTheme = () => {
    const { theme, setTheme } = useTheme()

    return (
        <ToggleGroup type='single' value={theme} className='bg-primary/10 overflow-hidden rounded-full p-0.5'>
            {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <ToggleGroupItem
                    key={value}
                    value={value}
                    aria-label={label}
                    className='h-7 min-w-7 px-1'
                    buttonProps={{
                        className:
                            'aria-[checked=true]:[&_[data-slot=active-toggle-group-item]]:bg-background text-foreground [&_[data-slot=active-toggle-group-item]]:!rounded-full'
                    }}
                    onClick={() => setTheme(value)}
                >
                    <Icon className='text-primary size-4' />
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}

export default ToggleGroupTheme
