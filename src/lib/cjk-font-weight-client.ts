const TUNED_TEXT_SELECTOR = '[data-cjk-font-weight]'
const CJK_TEXT_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]/u
const CJK_TEXT_SPLIT_RE = /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303F\uFF00-\uFFEF]+)/gu
const SKIP_PARENT_RE = /^(?:CODE|KBD|PRE|SCRIPT|STYLE|SVG|TEXTAREA|INPUT|SELECT|OPTION)$/

type WeightKey = 'medium' | 'regular' | 'semibold'

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
	if (parent.closest(TUNED_TEXT_SELECTOR))
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
			span.dataset.cjkFontWeight = weightKey
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

export function initCjkFontWeights() {
	wrapCjkText()
}

export function destroyCjkFontWeights() {
	unwrapCjkText()
}
