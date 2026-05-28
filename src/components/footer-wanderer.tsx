import type { Locale } from '@/lib/i18n/constants'
import type { FooterWandererCopy } from '@/lib/i18n/messages'

import { CountryFlag } from '@/components/country-flag'
import { getRequestVisitorGeo, regionDisplayName } from '@/lib/visitor-geo'

const wandererGradientClass = `
	wanderer-gradient-text font-bold
`

interface FooterWandererProps {
	copy: FooterWandererCopy
	locale: Locale
}

export function FooterWanderer({ copy, locale }: FooterWandererProps) {
	const geo = getRequestVisitorGeo()
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
