import { CountryFlag } from '@/components/country-flag'
import { getVisitorGeo } from '@/lib/visitor-geo'

/**
 * Yield one macrotask so React can paint the Suspense fallback while geo resolves.
 * Keeps the shell streaming-friendly without moving geo back to the client.
 */
function yieldMacrotask(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0)
	})
}

export async function FooterWanderer() {
	await yieldMacrotask()
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
