'use client'

import type { Locale } from '@/lib/i18n/constants'
import type { FooterWandererCopy } from '@/lib/i18n/messages'
import type { VisitorGeo } from '@/lib/visitor-geo'

import { useEffect, useState } from 'react'

import { CountryFlag } from '@/components/country-flag'
import { regionDisplayName } from '@/lib/visitor-geo'

const wandererGradientClass = `
	wanderer-gradient-text font-bold
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
		const flagAndLabel = (
			<span className="ms-0.5 inline-flex items-baseline gap-x-1">
				<span className="inline-flex h-[1em] shrink-0 translate-y-[0.12em] items-end leading-none">
					<CountryFlag code={geo.countryCode} />
				</span>
				<span>{countryLabel}</span>
			</span>
		)

		if (pattern === 'en') {
			return (
				<p className="text-foreground">
					{lead}
					{wanderer}
					{' '}
					{bridge}
					{' '}
					{flagAndLabel}
					{closing}
				</p>
			)
		}

		return (
			<p className="text-foreground">
				{lead}
				{flagAndLabel}
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
