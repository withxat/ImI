'use client'

import type { VisitorGeo } from '@/lib/visitor-geo'

import { useEffect, useState } from 'react'

import { CountryFlag } from '@/components/country-flag'

const wandererGradientClass = `
	bg-linear-to-r from-violet-600 via-indigo-500 to-cyan-600 bg-clip-text font-bold text-transparent
	dark:from-violet-300 dark:via-indigo-300 dark:to-cyan-300
`

export function FooterWanderer() {
	const [geo, setGeo] = useState<null | VisitorGeo>(null)

	useEffect(() => {
		let cancelled = false
		void (async () => {
			try {
				const res = await fetch('/geo', { headers: { Accept: 'application/json' } })
				if (!res.ok)
					throw new Error(String(res.status))
				const data = (await res.json()) as VisitorGeo
				if (!cancelled)
					setGeo(data)
			}
			catch {
				if (!cancelled)
					setGeo({ countryCode: null, countryName: null })
			}
		})()
		return () => {
			cancelled = true
		}
	}, [])

	if (geo === null) {
		return (
			<p className="h-5 w-72 max-w-full animate-pulse rounded-md bg-muted text-transparent" aria-hidden>
				&nbsp;
			</p>
		)
	}

	if (geo.countryName) {
		return (
			<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground">
				<span>
					Hi,
					{' '}
					<span className={wandererGradientClass}>wanderer</span>
					{' '}
					from
					{' '}
					{geo.countryName}
					.
				</span>
				<CountryFlag code={geo.countryCode} />
			</p>
		)
	}

	return (
		<p className="text-foreground">
			Hi,
			{' '}
			<span className={wandererGradientClass}>wanderer</span>
			—glad you found your way here.
		</p>
	)
}
