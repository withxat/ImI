/**
 * /design specimens: every number on the type and color sections is read from
 * the running page (computed styles and `document.fonts`), never hand-written.
 */

interface Oklch {
	alpha: number
	c: number
	h: number
	l: number
}

type Rgb = [number, number, number]

const CJK_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u
const CJK_FAMILY = 'MiSans'
const ACHROMATIC_CHROMA = 0.0005
const REVEAL_DURATION_MS = 420
const REVEAL_STAGGER_MS = 48
const REVEAL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const SLOW_MULTIPLIER = 4

let activeController: AbortController | null = null
const activeTimers: number[] = []

function clearTimers() {
	while (activeTimers.length > 0)
		clearTimeout(activeTimers.pop())
}

function trimNumber(value: number, digits: number): string {
	const rounded = Number(value.toFixed(digits))
	return String(Object.is(rounded, -0) ? 0 : rounded)
}

function unquote(family: string): string {
	return family.trim().replace(/^["']|["']$/g, '')
}

// ─── Type ───────────────────────────────────────────────────────────────

/** `Hanken Grotesk + MiSans · 500 · 30/36 · -0.025em`, from the sample's computed style. */
function describeTypeSample(sample: HTMLElement): string {
	const style = getComputedStyle(sample)
	const families = style.fontFamily.split(',').map(unquote)
	const primary = families[0] ?? ''
	const usesCjkFallback = primary !== CJK_FAMILY
		&& families.includes(CJK_FAMILY)
		&& CJK_RE.test(sample.textContent ?? '')
	const family = usesCjkFallback ? `${primary} + ${CJK_FAMILY}` : primary

	const size = Number.parseFloat(style.fontSize)
	const lineHeight = style.lineHeight === 'normal' ? 'normal' : trimNumber(Number.parseFloat(style.lineHeight), 2)
	const tracking = Number.parseFloat(style.letterSpacing)
	const trackingEm = Number.isFinite(tracking) && tracking !== 0 ? `${trimNumber(tracking / size, 3)}em` : ''

	return [family, style.fontWeight, `${trimNumber(size, 2)}/${lineHeight}`, trackingEm]
		.filter(Boolean)
		.join(' · ')
}

/** `100–900 · normal italic · 2 @font-face`, from the faces the page declares. */
function describeFontFaces(family: string): string {
	const weights = new Set<string>()
	const styles = new Set<string>()
	let count = 0

	document.fonts.forEach((face) => {
		if (unquote(face.family) !== family)
			return
		count++
		weights.add(face.weight.replace(' ', '–'))
		styles.add(face.style)
	})

	if (count === 0)
		return ''

	const weightList = [...weights].sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
	const styleList = [...styles].sort((a, b) => (a === 'normal' ? -1 : b === 'normal' ? 1 : a.localeCompare(b)))
	return `${weightList.join(' ')} · ${styleList.join(' ')} · ${count} @font-face`
}

// ─── Color ──────────────────────────────────────────────────────────────

function component(token: string | undefined, percentOf = 1): number {
	if (!token || token === 'none')
		return 0
	const value = Number.parseFloat(token)
	return token.endsWith('%') ? (value / 100) * percentOf : value
}

function srgbToLinear(channel: number): number {
	const abs = Math.abs(channel)
	const linear = abs <= 0.04045 ? abs / 12.92 : ((abs + 0.055) / 1.055) ** 2.4
	return Math.sign(channel) * linear
}

function linearToSrgb(channel: number): number {
	const abs = Math.abs(channel)
	const encoded = abs <= 0.0031308 ? abs * 12.92 : 1.055 * abs ** (1 / 2.4) - 0.055
	return Math.sign(channel) * encoded
}

function oklabToOklch(l: number, a: number, b: number, alpha: number): Oklch {
	const c = Math.hypot(a, b)
	const h = c < ACHROMATIC_CHROMA ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
	return { alpha, c, h, l }
}

// Björn Ottosson's OKLab matrices (https://bottosson.github.io/posts/oklab/).
function linearSrgbToOklch([r, g, b]: Rgb, alpha: number): Oklch {
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
	return oklabToOklch(
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
		alpha,
	)
}

function oklchToSrgb({ c, h, l }: Oklch): Rgb {
	const a = c * Math.cos((h * Math.PI) / 180)
	const b = c * Math.sin((h * Math.PI) / 180)
	const lp = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
	const mp = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
	const sp = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
	const linear: Rgb = [
		4.0767416621 * lp - 3.3077115913 * mp + 0.2309699292 * sp,
		-1.2684380046 * lp + 2.6097574011 * mp - 0.3413193965 * sp,
		-0.0041960863 * lp - 0.7034186147 * mp + 1.707614701 * sp,
	]
	return linear.map(channel => Math.min(1, Math.max(0, linearToSrgb(channel)))) as Rgb
}

/**
 * Parse a computed color. Browsers serialize differently (Chrome keeps
 * `oklch()` / `oklab()` from color-mix, others may return `color(srgb …)` or
 * `rgb()`), so everything is normalized to OKLCH here.
 */
function parseComputedColor(value: string): null | Oklch {
	const match = /^([a-z]+)\((.*)\)$/i.exec(value.trim())
	if (!match)
		return null

	const fn = match[1]!.toLowerCase()
	const [channelPart = '', alphaPart] = match[2]!.split('/')
	const parts = channelPart.trim().split(/[\s,]+/).filter(Boolean)
	// Legacy `rgba(r, g, b, a)` carries alpha as a fourth comma-separated channel.
	const legacyAlpha = (fn === 'rgb' || fn === 'rgba') ? parts[3] : undefined
	const alpha = component(alphaPart?.trim() ?? legacyAlpha ?? '1')

	if (fn === 'oklch')
		return { alpha, c: component(parts[1], 0.4), h: component(parts[2]), l: component(parts[0]) }
	if (fn === 'oklab')
		return oklabToOklch(component(parts[0]), component(parts[1], 0.4), component(parts[2], 0.4), alpha)
	if (fn === 'rgb' || fn === 'rgba') {
		const rgb = parts.slice(0, 3).map(part => component(part, 255) / 255) as Rgb
		return linearSrgbToOklch(rgb.map(srgbToLinear) as Rgb, alpha)
	}
	if (fn === 'color' && (parts[0] === 'srgb' || parts[0] === 'srgb-linear')) {
		const rgb = parts.slice(1, 4).map(part => component(part)) as Rgb
		return linearSrgbToOklch(parts[0] === 'srgb' ? rgb.map(srgbToLinear) as Rgb : rgb, alpha)
	}
	return null
}

/** Resolve a custom property inside `scope` (which carries `.theme-light` / `.theme-dark`). */
function resolveToken(scope: HTMLElement, token: string): { color: null | Oklch, raw: string } {
	const probe = document.createElement('span')
	probe.style.color = `var(${token})`
	scope.appendChild(probe)
	const raw = getComputedStyle(probe).color
	probe.remove()
	return { color: parseComputedColor(raw), raw }
}

/** `L C H / α`, with no-break spaces so narrow cells only wrap before the alpha. */
function formatOklch({ alpha, c, h, l }: Oklch): string {
	const hue = c < ACHROMATIC_CHROMA ? '0' : String(Math.round(h) % 360)
	const base = [trimNumber(l, 3), trimNumber(c, 3), hue].join('\u00A0')
	return alpha < 1 ? `${base} /\u00A0${trimNumber(alpha, 2)}` : base
}

function relativeLuminance(rgb: Rgb): number {
	const [r, g, b] = rgb.map(srgbToLinear) as Rgb
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2 contrast of `fg` composited over an opaque `bg`. */
function contrastRatio(fg: Oklch, bg: Oklch): number {
	const back = oklchToSrgb(bg)
	const front = oklchToSrgb(fg).map((channel, i) => fg.alpha * channel + (1 - fg.alpha) * back[i]!) as Rgb
	const a = relativeLuminance(front)
	const b = relativeLuminance(back)
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

function formatContrast(ratio: number): string {
	const grade = ratio >= 7 ? ' AAA' : ratio >= 4.5 ? ' AA' : ''
	return `${trimNumber(ratio, 1)}:1${grade}`
}

function fillColorCell(cell: HTMLElement) {
	const scope = cell.querySelector<HTMLElement>('[data-color-scope]')
	const valueTarget = cell.querySelector<HTMLElement>('[data-color-value]')
	const token = cell.dataset.colorToken
	if (!scope || !valueTarget || !token)
		return

	const { color, raw } = resolveToken(scope, token)
	valueTarget.textContent = color ? formatOklch(color) : raw
	valueTarget.title = raw

	const contrastTarget = cell.querySelector<HTMLElement>('[data-color-contrast]')
	const against = cell.dataset.colorAgainst
	if (!contrastTarget || !against || !color)
		return
	const background = resolveToken(scope, against).color
	if (background)
		contrastTarget.textContent = formatContrast(contrastRatio(color, background))
}

function initRadii() {
	for (const item of document.querySelectorAll<HTMLElement>('[data-radius-row]')) {
		const sample = item.querySelector<HTMLElement>('[data-radius-sample]')
		const target = item.querySelector<HTMLElement>('[data-radius-value]')
		if (!sample || !target)
			continue
		const px = Number.parseFloat(getComputedStyle(sample).borderTopLeftRadius)
		target.textContent = px >= 999 ? '9999px' : `${trimNumber(px, 1)}px`
	}
}

function initWrapDemo(signal: AbortSignal) {
	const demo = document.querySelector<HTMLElement>('[data-wrap-demo]')
	if (!demo)
		return

	const stage = demo.querySelector<HTMLElement>('[data-wrap-stage]')
	const slider = demo.querySelector<HTMLInputElement>('[data-wrap-slider]')
	const widthOut = demo.querySelector<HTMLElement>('[data-wrap-width]')
	const toggle = demo.querySelector<HTMLButtonElement>('[data-wrap-toggle]')

	const applyWidth = () => {
		if (!slider || !stage || !widthOut)
			return
		const rem = `${slider.value}rem`
		stage.style.maxWidth = rem
		widthOut.textContent = rem
	}

	applyWidth()
	slider?.addEventListener('input', applyWidth, { signal })

	toggle?.addEventListener('click', () => {
		const next = demo.dataset.wrapRules === 'on' ? 'off' : 'on'
		demo.dataset.wrapRules = next
		toggle.setAttribute('aria-pressed', String(next === 'on'))
		toggle.textContent = next === 'on' ? (toggle.dataset.labelOn ?? 'On') : (toggle.dataset.labelOff ?? 'Off')
	}, { signal })
}

function initMotionDemo(signal: AbortSignal) {
	const demo = document.querySelector<HTMLElement>('[data-motion-demo]')
	if (!demo)
		return

	const items = [...demo.querySelectorAll<HTMLElement>('[data-motion-item]')]
	const replayBtn = demo.querySelector<HTMLButtonElement>('[data-motion-replay]')
	const slowBtn = demo.querySelector<HTMLButtonElement>('[data-motion-slow]')
	const readout = demo.querySelector<HTMLElement>('[data-motion-readout]')
	let slow = false

	const updateReadout = () => {
		const factor = slow ? SLOW_MULTIPLIER : 1
		if (readout)
			readout.textContent = `${REVEAL_DURATION_MS * factor}ms · ${REVEAL_STAGGER_MS * factor}ms stagger`
	}

	const replay = () => {
		clearTimers()
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
		const factor = slow ? SLOW_MULTIPLIER : 1
		const duration = reduced ? 0 : REVEAL_DURATION_MS * factor
		const stagger = reduced ? 0 : REVEAL_STAGGER_MS * factor

		for (const el of items) {
			el.style.transition = 'none'
			el.style.opacity = reduced ? '1' : '0'
			el.style.filter = reduced ? 'none' : 'blur(10px)'
			el.style.transform = reduced ? 'none' : 'translate3d(0, 10px, 0)'
		}

		if (reduced)
			return

		// Force one style flush so resetting to hidden actually transitions.
		void demo.offsetHeight

		items.forEach((el, index) => {
			const id = window.setTimeout(() => {
				el.style.transition = `opacity ${duration}ms ${REVEAL_EASING}, filter ${duration}ms ${REVEAL_EASING}, transform ${duration}ms ${REVEAL_EASING}`
				el.style.opacity = '1'
				el.style.filter = 'none'
				el.style.transform = 'translate3d(0, 0, 0)'
			}, index * stagger)
			activeTimers.push(id)
		})
	}

	updateReadout()

	replayBtn?.addEventListener('click', replay, { signal })
	slowBtn?.addEventListener('click', () => {
		slow = !slow
		slowBtn.setAttribute('aria-pressed', String(slow))
		updateReadout()
		replay()
	}, { signal })
}

export function disposeDesignSpecimens() {
	clearTimers()
	activeController?.abort()
	activeController = null
}

export function initDesignSpecimens() {
	disposeDesignSpecimens()
	activeController = new AbortController()
	const { signal } = activeController

	for (const row of document.querySelectorAll<HTMLElement>('[data-type-row]')) {
		const sample = row.querySelector<HTMLElement>('[data-type-sample]')
		const target = row.querySelector<HTMLElement>('[data-type-spec]')
		if (sample && target)
			target.textContent = describeTypeSample(sample)
	}

	for (const row of document.querySelectorAll<HTMLElement>('[data-face-family]')) {
		const target = row.querySelector<HTMLElement>('[data-face-facts]')
		if (target)
			target.textContent = describeFontFaces(row.dataset.faceFamily ?? '')
	}

	for (const cell of document.querySelectorAll<HTMLElement>('[data-color-token]'))
		fillColorCell(cell)

	initRadii()
	initWrapDemo(signal)
	initMotionDemo(signal)
}
