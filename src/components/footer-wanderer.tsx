'use client'

import type { Locale } from '@/lib/i18n/constants'
import type { FooterWandererCopy } from '@/lib/i18n/messages'
import type { VisitorGeo } from '@/lib/visitor-geo'

import { useEffect, useState } from 'react'

import { CountryFlag } from '@/components/country-flag'
import { regionDisplayName } from '@/lib/visitor-geo'

const wandererGradientClass = `
	bg-linear-to-r from-violet-600 via-indigo-500 to-cyan-600 bg-clip-text font-bold text-transparent
	dark:from-violet-300 dark:via-indigo-300 dark:to-cyan-300
`

interface FooterWandererProps {
	copy: FooterWandererCopy
	locale: Locale
}

export function FooterWanderer({ copy, locale }: FooterWandererProps) {
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

	const wanderer = (
		<span className={wandererGradientClass}>{copy.wanderer}</span>
	)

	if (geo.countryCode) {
		const { bridge, closing, lead, pattern } = copy.withCountry
		const countryLabel = regionDisplayName(geo.countryCode, locale)
		const flagCountry = (
			<>
				<CountryFlag code={geo.countryCode} />
				{' '}
				{countryLabel}
			</>
		)

		if (pattern === 'en') {
			return (
				<p className="text-foreground">
					{lead}
					{wanderer}
					{bridge}
					{flagCountry}
					{closing}
				</p>
			)
		}

		return (
			<p className="text-foreground">
				{lead}
				{flagCountry}
				{bridge}
				{wanderer}
				{closing}
			</p>
		)
	}

	return (
		<p className="text-foreground">
			{copy.withoutCountry.before}
			{wanderer}
			{copy.withoutCountry.after}
		</p>
	)
}
