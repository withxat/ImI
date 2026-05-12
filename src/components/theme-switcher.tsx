'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'theme'

const ICONS = {
	dark: MoonIcon,
	light: SunIcon,
	system: MonitorIcon,
} as const

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

function readStored(): Theme {
	try {
		const v = localStorage.getItem(STORAGE_KEY)
		if (v === 'light' || v === 'dark')
			return v
	}
	catch {}
	return 'system'
}

export function ThemeSwitcher({ labels }: ThemeSwitcherProps) {
	const [theme, setTheme] = useState<Theme>('system')
	const [open, setOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTheme(readStored())
	}, [])

	useEffect(() => {
		applyTheme(theme)

		if (theme !== 'system')
			return

		const mq = matchMedia('(prefers-color-scheme:dark)')
		const handler = () => applyTheme('system')
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [theme])

	useEffect(() => {
		if (!open)
			return
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
				<TriggerIcon className="size-4" />
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
									localStorage.setItem(STORAGE_KEY, opt.key)
									setTheme(opt.key)
									setOpen(false)
								}}
								key={opt.key}
								role="menuitem"
								type="button"
							>
								<Icon className="size-3.5" />
								<span>{opt.label}</span>
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}
