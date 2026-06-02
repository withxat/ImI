const STORAGE_KEY = 'imi:misans-weight-debug'
const PANEL_ID = 'misans-weight-debug-panel'
const TUNED_TEXT_SELECTOR = '[data-misans-weight-debug]'
const CJK_TEXT_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]/u
const CJK_TEXT_SPLIT_RE = /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]+)/gu
const SKIP_PARENT_RE = /^(?:CODE|KBD|PRE|SCRIPT|STYLE|SVG|TEXTAREA|INPUT|SELECT|OPTION)$/

const DEFAULT_WEIGHTS = {
	medium: 450,
	regular: 360,
	semibold: 540,
}

const CONTROLS = [
	{ key: 'regular', label: 'Regular', max: 430, min: 300, step: 5 },
	{ key: 'medium', label: 'Medium', max: 520, min: 380, step: 5 },
	{ key: 'semibold', label: 'Semibold', max: 620, min: 460, step: 5 },
] as const

type WeightKey = keyof typeof DEFAULT_WEIGHTS
type WeightSettings = Record<WeightKey, number>

let panel: HTMLElement | null = null

function isLocalPreview() {
	return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
}

function readSettings(): WeightSettings {
	try {
		const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<WeightSettings>
		return {
			medium: parsed.medium ?? DEFAULT_WEIGHTS.medium,
			regular: parsed.regular ?? DEFAULT_WEIGHTS.regular,
			semibold: parsed.semibold ?? DEFAULT_WEIGHTS.semibold,
		}
	}
	catch {
		return { ...DEFAULT_WEIGHTS }
	}
}

function writeSettings(settings: WeightSettings) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

function applySettings(settings: WeightSettings) {
	const root = document.documentElement
	root.style.setProperty('--cjk-font-weight-regular', String(settings.regular))
	root.style.setProperty('--cjk-font-weight-medium', String(settings.medium))
	root.style.setProperty('--cjk-font-weight-semibold', String(settings.semibold))
}

function weightKeyForElement(element: Element): WeightKey {
	const weight = Number.parseInt(getComputedStyle(element).fontWeight, 10)
	if (weight >= 550)
		return 'semibold'
	if (weight >= 450)
		return 'medium'
	return 'regular'
}

function shouldSkipTextNode(node: Text) {
	const parent = node.parentElement
	if (!parent)
		return true
	if (!node.nodeValue || !CJK_TEXT_RE.test(node.nodeValue))
		return true
	if (parent.closest(`#${PANEL_ID}, ${TUNED_TEXT_SELECTOR}`))
		return true
	return SKIP_PARENT_RE.test(parent.tagName)
}

function wrapCjkText() {
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			return shouldSkipTextNode(node as Text) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
		},
	})
	const textNodes: Text[] = []
	while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

	for (const node of textNodes) {
		const parent = node.parentElement
		if (!parent || !node.nodeValue)
			continue

		const weightKey = weightKeyForElement(parent)
		const fragment = document.createDocumentFragment()
		for (const part of node.nodeValue.split(CJK_TEXT_SPLIT_RE)) {
			if (!part)
				continue
			if (!CJK_TEXT_RE.test(part)) {
				fragment.append(document.createTextNode(part))
				continue
			}

			const span = document.createElement('span')
			span.dataset.misansWeightDebug = weightKey
			span.textContent = part
			fragment.append(span)
		}
		node.replaceWith(fragment)
	}
}

function unwrapCjkText() {
	for (const node of [...document.querySelectorAll<HTMLElement>(TUNED_TEXT_SELECTOR)]) {
		node.replaceWith(document.createTextNode(node.textContent ?? ''))
	}
}

function createStyle() {
	const style = document.createElement('style')
	style.textContent = `
		#${PANEL_ID} {
			position: fixed;
			right: 16px;
			bottom: 16px;
			z-index: 100;
			width: min(300px, calc(100vw - 32px));
			border: 1px solid color-mix(in oklab, var(--color-border) 78%, var(--color-foreground));
			border-radius: 8px;
			background: color-mix(in oklab, var(--color-background) 94%, transparent);
			box-shadow: 0 18px 48px -28px color-mix(in oklab, var(--color-foreground) 55%, transparent);
			color: var(--color-foreground);
			font-family: var(--font-ui);
			font-size: 12px;
			backdrop-filter: blur(14px);
		}

		#${PANEL_ID} summary {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 10px 12px;
			cursor: pointer;
			font-weight: 540;
			list-style: none;
		}

		#${PANEL_ID} summary::-webkit-details-marker {
			display: none;
		}

		#${PANEL_ID} summary span {
			color: var(--color-muted-foreground);
			font-variant-numeric: tabular-nums;
			font-weight: 450;
		}

		#${PANEL_ID} .misans-weight-debug-body {
			display: grid;
			gap: 10px;
			padding: 0 12px 12px;
		}

		#${PANEL_ID} label {
			display: grid;
			grid-template-columns: 72px 1fr 34px;
			align-items: center;
			gap: 8px;
			color: var(--color-muted-foreground);
		}

		#${PANEL_ID} input {
			width: 100%;
			accent-color: var(--color-highlight-text);
		}

		#${PANEL_ID} output {
			color: var(--color-foreground);
			font-variant-numeric: tabular-nums;
			text-align: right;
		}

		#${PANEL_ID} .misans-weight-debug-preview {
			border-top: 1px solid var(--color-border);
			padding-top: 10px;
			line-height: 1.55;
		}

		#${PANEL_ID} .misans-weight-debug-preview p {
			margin: 0;
		}

		#${PANEL_ID} .misans-weight-debug-preview p + p {
			margin-top: 4px;
		}

		${TUNED_TEXT_SELECTOR} {
			font-weight: var(--cjk-font-weight-regular);
		}

		${TUNED_TEXT_SELECTOR}[data-misans-weight-debug='medium'] {
			font-weight: var(--cjk-font-weight-medium);
		}

		${TUNED_TEXT_SELECTOR}[data-misans-weight-debug='semibold'] {
			font-weight: var(--cjk-font-weight-semibold);
		}
	`
	return style
}

function formatSummary(settings: WeightSettings) {
	return `${settings.regular} / ${settings.medium} / ${settings.semibold}`
}

function renderPanel(settings: WeightSettings) {
	const details = document.createElement('details')
	details.id = PANEL_ID
	details.open = true
	details.append(createStyle())

	const summary = document.createElement('summary')
	summary.textContent = 'MiSans weight'
	const summaryValue = document.createElement('span')
	summaryValue.textContent = formatSummary(settings)
	summary.append(summaryValue)
	details.append(summary)

	const body = document.createElement('div')
	body.className = 'misans-weight-debug-body'

	for (const control of CONTROLS) {
		const label = document.createElement('label')
		label.textContent = control.label

		const input = document.createElement('input')
		input.max = String(control.max)
		input.min = String(control.min)
		input.step = String(control.step)
		input.type = 'range'
		input.value = String(settings[control.key])

		const output = document.createElement('output')
		output.textContent = input.value

		input.addEventListener('input', () => {
			settings[control.key] = Number(input.value)
			output.textContent = input.value
			summaryValue.textContent = formatSummary(settings)
			applySettings(settings)
			writeSettings(settings)
		})

		label.append(input, output)
		body.append(label)
	}

	const preview = document.createElement('div')
	preview.className = 'misans-weight-debug-preview'
	preview.innerHTML = `
		<p><span data-misans-weight-debug="regular">打造生产级界面</span> with AI native tools</p>
		<p class="font-medium"><span data-misans-weight-debug="medium">中英文混排</span> Medium sample</p>
		<p class="font-semibold"><span data-misans-weight-debug="semibold">中文</span> Semibold sample</p>
	`
	body.append(preview)
	details.append(body)

	return details
}

export function initMisansWeightDebug() {
	if (!isLocalPreview())
		return

	panel?.remove()
	const settings = readSettings()
	applySettings(settings)
	wrapCjkText()
	panel = renderPanel(settings)
	document.body.append(panel)
}

export function destroyMisansWeightDebug() {
	unwrapCjkText()
	panel?.remove()
	panel = null
}
