import 'number-flow'

const FORMAT: Intl.NumberFormatOptions = {
	maximumFractionDigits: 0,
	minimumIntegerDigits: 3,
	useGrouping: false,
}
const INTERVAL_MS = 1400
const DIGIT_TRAVEL_STYLE_ID = 'design-stat-digits-travel'

type NumberFlowElement = HTMLElement & {
	format?: Intl.NumberFormatOptions
	locales?: string
	update: (value: number) => void
}

let previewTimer = 0

function nextValue(current: number) {
	return (current + 137) % 1000
}

function widenDigitTravel(flow: HTMLElement) {
	const shadowRoot = flow.shadowRoot
	if (!shadowRoot || shadowRoot.getElementById(DIGIT_TRAVEL_STYLE_ID))
		return

	const style = document.createElement('style')
	style.id = DIGIT_TRAVEL_STYLE_ID
	style.textContent = '.digit__num{--y:clamp(-180%,var(--offset)*180%,180%)}'
	shadowRoot.appendChild(style)
}

export function initDesignStatDigitsPreview() {
	disposeDesignStatDigitsPreview()

	const specimen = document.querySelector<HTMLElement>('[data-design-stat-digits-preview]')
	if (!specimen)
		return

	const locale = document.documentElement.lang || 'en'
	const flow = document.createElement('number-flow') as NumberFlowElement
	flow.className = specimen.className
	flow.dataset.designStatDigitsPreview = ''
	flow.locales = locale
	flow.format = FORMAT

	let value = Number(specimen.dataset.designStatValue)
	if (!Number.isFinite(value))
		value = 927

	specimen.replaceWith(flow)
	flow.update(value)
	widenDigitTravel(flow)

	if (matchMedia('(prefers-reduced-motion: reduce)').matches)
		return

	previewTimer = window.setInterval(() => {
		value = nextValue(value)
		flow.update(value)
	}, INTERVAL_MS)
}

export function disposeDesignStatDigitsPreview() {
	if (!previewTimer)
		return

	window.clearInterval(previewTimer)
	previewTimer = 0
}
