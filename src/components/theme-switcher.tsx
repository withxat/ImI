'use client'

import type { Theme } from '@/lib/theme/read-stored-theme'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { THEME_STORAGE_KEY } from '@/lib/theme/constants'
import { readStoredTheme } from '@/lib/theme/read-stored-theme'

const ICONS = {
	dark: MoonIcon,
	light: SunIcon,
	system: MonitorIcon,
} as const

function getIconClassName(theme: Theme, sizeClassName: string) {
	return theme === 'light'
		? `${sizeClassName} scale-115`
		: sizeClassName
}

interface ThemeSwitcherProps {
	labels: {
		ariaLabel: string
		dark: string
		light: string
		system: string
	}
}

function applyTheme(theme: Theme) {
	const el = document.documentElement
	if (theme === 'system') {
		el.classList.toggle('dark', matchMedia('(prefers-color-scheme:dark)').matches)
		el.classList.remove('light')
	}
	else {
		el.classList.toggle('dark', theme === 'dark')
		el.classList.toggle('light', theme === 'light')
	}
}

export function ThemeSwitcher({ labels }: ThemeSwitcherProps) {
	const [theme, setTheme] = useState<Theme>('system')
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const themeSyncedRef = useRef(false)

	/**
	 * First frame: ignore `theme` React state — read persisted preference and sync DOM.
	 * Later changes: react to toggles only (avoid `applyTheme('system')` before storage is read).
	 */
	useLayoutEffect(() => {
		if (!themeSyncedRef.current) {
			themeSyncedRef.current = true
			const resolved = readStoredTheme()
			setTheme(resolved)
			applyTheme(resolved)
			return
		}
		applyTheme(theme)
	}, [theme])

	useEffect(() => {
		if (theme !== 'system')
			return undefined
		const mq = matchMedia('(prefers-color-scheme:dark)')
		const handler = () => {
			if (readStoredTheme() !== 'system')
				return
			applyTheme('system')
		}
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [theme])

	useEffect(() => {
		if (!open)
			return undefined
		function onPointerDown(e: PointerEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape')
				setOpen(false)
		}
		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

	const TriggerIcon = ICONS[theme]

	const options: { key: Theme, label: string }[] = [
		{ key: 'system', label: labels.system },
		{ key: 'light', label: labels.light },
		{ key: 'dark', label: labels.dark },
	]

	return (
		<div className="relative" ref={containerRef}>
			<button
				className="
					inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors
					hover:bg-accent hover:text-foreground
				"
				aria-label={labels.ariaLabel}
				onClick={() => setOpen(v => !v)}
				type="button"
			>
				<TriggerIcon className={getIconClassName(theme, 'size-4')} />
			</button>
			{open && (
				<div
					className="
						absolute top-full right-0 z-50 mt-1 min-w-32 overflow-hidden rounded-lg border bg-popover
						p-1 shadow-md
					"
					role="menu"
				>
					{options.map((opt) => {
						const Icon = ICONS[opt.key]
						const active = theme === opt.key
						return (
							<button
								className={`
									flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm
									transition-colors
									${active ? 'text-foreground' : 'text-muted-foreground'}
									hover:bg-accent hover:text-foreground
								`}
								onClick={() => {
									try {
										localStorage.setItem(THEME_STORAGE_KEY, opt.key)
									}
									catch {}
									setTheme(opt.key)
									setOpen(false)
								}}
								key={opt.key}
								role="menuitem"
								type="button"
							>
								<Icon className={getIconClassName(opt.key, 'size-3.5')} />
								<span>{opt.label}</span>
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
