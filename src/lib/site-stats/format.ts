export function formatSiteStatNumber(value: number, locale: string) {
	return new Intl.NumberFormat(locale, {
		maximumFractionDigits: 0,
		useGrouping: true,
	}).format(value)
}
