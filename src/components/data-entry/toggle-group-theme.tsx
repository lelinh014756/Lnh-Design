'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/motion-toggle-group'
import { useTheme } from 'next-themes'

import AppIcon, { type IconName } from '@/components/general/app-icon'

const THEME_OPTIONS = [
    { value: 'light', label: 'Toggle light', icon: 'sun-medium' },
    { value: 'dark', label: 'Toggle dark', icon: 'moon' },
    { value: 'system', label: 'Toggle system', icon: 'laptop-minimal' },
] as const satisfies readonly { value: string; label: string; icon: IconName }[]

const ToggleGroupTheme = () => {
    const { theme, setTheme } = useTheme()

    return (
        <ToggleGroup type='single' value={theme} className='bg-primary/10 overflow-hidden rounded-full p-0.5'>
            {THEME_OPTIONS.map(({ value, label, icon }) => (
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
                    <AppIcon icon={icon} className='text-primary size-4' />
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}

export default ToggleGroupTheme
