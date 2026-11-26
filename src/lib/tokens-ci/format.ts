export const TOKENS_CI_USERNAME = 'withxat'
export const TOKENS_CI_PROFILE_URL = `https://tokens.ci/u/${TOKENS_CI_USERNAME}`
export const TOKENS_CI_API_URL = `https://tokens.ci/api/users/${TOKENS_CI_USERNAME}?period=all`
export const PULSE_DAY_COUNT = 180

export type PulseTier = 0 | 1 | 2 | 3 | 4

export interface ModelSlice {
	c: number
	n: string
	other?: true
	p: number
	t: number
}

export interface PulseDay {
	c: number
	cl: string[]
	/** `YYYY-MM-DD` */
	d: string
	/** Bar height percentage (3..96). */
	h: number
	m: number
	md: ModelSlice[]
	t: number
	tier: PulseTier
	/** UTC day of week (0 = Sunday .. 6 = Saturday). */
	w: number
}

export interface CodingPulseData {
	all: {
		activeDays: number
		c: number
		cl: string[]
		m: number
		md: ModelSlice[]
		t: number
	}
	days: PulseDay[]
	p90: number
	peakIdx: number
	restDays: number
}

export interface NumberFlowSpec {
	format: {
		maximumFractionDigits: number
		minimumFractionDigits?: number
		useGrouping: false
	}
	prefix?: string
	suffix?: string
	value: number
}

export function tokenNumberSpec(n: number): NumberFlowSpec {
	if (!n)
		return { format: { maximumFractionDigits: 0, useGrouping: false }, suffix: '', value: 0 }
	if (n >= 1e9)
		return { format: { maximumFractionDigits: 2, useGrouping: false }, suffix: 'B', value: Number((n / 1e9).toFixed(2)) }
	if (n >= 1e6)
		return { format: { maximumFractionDigits: 1, useGrouping: false }, suffix: 'M', value: Number((n / 1e6).toFixed(1)) }
	if (n >= 1e3)
		return { format: { maximumFractionDigits: 0, useGrouping: false }, suffix: 'K', value: Math.round(n / 1e3) }
	return { format: { maximumFractionDigits: 0, useGrouping: false }, suffix: '', value: n }
}

export function costNumberSpec(c: number): NumberFlowSpec {
	if (!c || c < 0.05)
		return { format: { maximumFractionDigits: 0, useGrouping: false }, prefix: '$', suffix: '', value: 0 }
	if (c >= 10_000) {
		return {
			format: { maximumFractionDigits: 1, minimumFractionDigits: 1, useGrouping: false },
			prefix: '$',
			suffix: 'K',
			value: Number((c / 1000).toFixed(1)),
		}
	}
	if (c >= 1000) {
		return {
			format: { maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false },
			prefix: '$',
			suffix: 'K',
			value: Number((c / 1000).toFixed(2)),
		}
	}
	if (c >= 100)
		return { format: { maximumFractionDigits: 0, useGrouping: false }, prefix: '$', suffix: '', value: Math.round(c) }
	if (c >= 10) {
		return {
			format: { maximumFractionDigits: 1, minimumFractionDigits: 1, useGrouping: false },
			prefix: '$',
			suffix: '',
			value: Number(c.toFixed(1)),
		}
	}
	return {
		format: { maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false },
		prefix: '$',
		suffix: '',
		value: Number(c.toFixed(2)),
	}
}

export function formatTokens(n: number): string {
	if (!n)
		return '0'
	if (n >= 1e9)
		return `${(n / 1e9).toFixed(2).replace(/\.?0+$/, '')}B`
	if (n >= 1e6)
		return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
	if (n >= 1e3)
		return `${Math.round(n / 1e3)}K`
	return String(n)
}

export function formatCost(c: number): string {
	if (!c || c < 0.05)
		return '$0'
	if (c >= 10_000)
		return `$${(c / 1000).toFixed(1)}K`
	if (c >= 1000)
		return `$${(c / 1000).toFixed(2)}K`
	if (c >= 100)
		return `$${Math.round(c)}`
	if (c >= 10)
		return `$${c.toFixed(1)}`
	return `$${c.toFixed(2)}`
}

export function formatRoundsCount(n: number): string {
	if (n >= 10_000)
		return `${(n / 1000).toFixed(1)}K`
	return n.toLocaleString('en-US')
}

export function formatPercent(p: number): string {
	return p >= 1 ? `${Math.round(p)}%` : '<1%'
}

export function formatDateShort(isoDate: string): string {
	return isoDate.slice(5).replace('-', '·')
}
