import { CountryFlag } from '@/components/country-flag'
import { getVisitorGeo } from '@/lib/visitor-geo'

/** Sync RSC: `unstable_getContext()` must stay inside the same request turn as the layout (no macrotask gap). */
export function FooterWanderer() {
	const geo = getVisitorGeo()

	if (geo.countryName) {
		return (
			<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground">
				<span>
					Hi, wanderer from
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
			Hi, wanderer—glad you found your way here.
		</p>
	)
}
