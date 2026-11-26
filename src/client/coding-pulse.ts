/**
 * Interactive scrubber for the home AI coding pulse instrument
 * (`src/components/home/coding-pulse.astro`). Mutates pre-rendered DOM slots in
 * place so scrubbing across 180 days stays layout-shift-free and lets the model
 * composition segments animate smoothly.
 */
import type NumberFlow from 'number-flow'

import type { CodingPulseCopy } from '@/lib/i18n/messages/types'
import type { CodingPulseData, ModelSlice, NumberFlowSpec } from '@/lib/tokens-ci/format'

import {
	costNumberSpec,
	formatCost,
	formatDateShort,
	formatPercent,
	formatRoundsCount,
	formatTokens,
	tokenNumberSpec,
} from '@/lib/tokens-ci/format'

import 'number-flow'
import 'number-flow/group'

interface ClientPayload {
	copy: CodingPulseCopy
	data: CodingPulseData
}

const FLOW_TRANSFORM_TIMING: EffectTiming = {
	duration: 360,
	easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
}

const FLOW_OPACITY_TIMING: EffectTiming = {
	duration: 180,
	easing: 'ease-out',
}

const COLOR_CLASSES = [
	'coding-pulse-c0',
	'coding-pulse-c1',
	'coding-pulse-c2',
	'coding-pulse-c3',
] as const

let activeController: AbortController | null = null

function applyFlowSpec(flow: NumberFlow, spec: NumberFlowSpec) {
	flow.format = spec.format
	flow.numberPrefix = spec.prefix ?? ''
	flow.numberSuffix = spec.suffix ?? ''
	flow.update(spec.value)
}

function upgradeToNumberFlow(
	placeholder: HTMLElement,
	attr: 'pulseCost' | 'pulseTokens',
	initial: NumberFlowSpec,
): NumberFlow {
	if (placeholder.tagName.toLowerCase() === 'number-flow')
		return placeholder as NumberFlow

	const flow = document.createElement('number-flow')
	flow.className = `${placeholder.className} coding-pulse-flow`.trim()
	flow.dataset[attr] = ''
	flow.locales = 'en-US'
	flow.transformTiming = FLOW_TRANSFORM_TIMING
	flow.spinTiming = FLOW_TRANSFORM_TIMING
	flow.opacityTiming = FLOW_OPACITY_TIMING
	flow.animated = false
	placeholder.replaceWith(flow)
	applyFlowSpec(flow, initial)
	flow.animated = true
	return flow
}

function colorClassFor(rank: number, other?: true): string {
	if (other)
		return COLOR_CLASSES[3]
	return COLOR_CLASSES[Math.min(rank, 2)]!
}

function setColorClass(el: HTMLElement, nextClass: string) {
	el.classList.remove(...COLOR_CLASSES)
	el.classList.add(nextClass)
}

function bindInstrument(root: HTMLElement, signal: AbortSignal) {
	const dataScript = root.querySelector<HTMLScriptElement>('[data-coding-pulse-data]')
	const ruler = root.querySelector<HTMLElement>('[data-pulse-ruler]')
	const ticks = [...root.querySelectorAll<HTMLElement>('[data-pulse-tick]')]
	const segs = [...root.querySelectorAll<HTMLElement>('[data-pulse-seg]')]
	const emptySeg = root.querySelector<HTMLElement>('[data-pulse-seg-empty]')
	const slots = [...root.querySelectorAll<HTMLElement>('[data-pulse-slot]')]
	const restRow = root.querySelector<HTMLElement>('[data-pulse-rest]')

	const ctxPrimary = root.querySelector<HTMLElement>('[data-ctx-primary]')
	const ctxSep1 = root.querySelector<HTMLElement>('[data-ctx-sep-1]')
	const ctxBadge = root.querySelector<HTMLElement>('[data-ctx-badge]')
	const ctxBadgeText = root.querySelector<HTMLElement>('[data-ctx-badge-text]')
	const ctxSparkIcon = root.querySelector<SVGElement>('[data-ctx-icon="spark"]')
	const ctxRestIcon = root.querySelector<SVGElement>('[data-ctx-icon="rest"]')
	const ctxSep2 = root.querySelector<HTMLElement>('[data-ctx-sep-2]')
	const ctxRounds = root.querySelector<HTMLElement>('[data-ctx-rounds]')
	const numWrap = root.querySelector<HTMLElement>('[data-pulse-num]')
	const tokensEl = root.querySelector<HTMLElement>('[data-pulse-tokens]')
	const costEl = root.querySelector<HTMLElement>('[data-pulse-cost]')
	const costIdleEl = root.querySelector<HTMLElement>('[data-pulse-cost-idle]')
	const toolsWrap = root.querySelector<HTMLElement>('[data-pulse-tools]')
	const toolsFirst = root.querySelector<HTMLElement>('[data-tools-first]')
	const toolsSecond = root.querySelector<HTMLElement>('[data-tools-second]')
	const toolsMoreWide = root.querySelector<HTMLElement>('[data-tools-more-wide]')
	const toolsMoreNarrow = root.querySelector<HTMLElement>('[data-tools-more-narrow]')
	const btnAll = root.querySelector<HTMLButtonElement>('[data-scope="all"]')
	const btnToday = root.querySelector<HTMLButtonElement>('[data-scope="today"]')
	const btnMood = root.querySelector<HTMLButtonElement>('[data-pulse-mood]')

	if (
		!dataScript?.textContent
		|| !ruler
		|| ticks.length === 0
		|| !ctxPrimary
		|| !ctxSep1
		|| !ctxBadge
		|| !ctxBadgeText
		|| !ctxSep2
		|| !ctxRounds
		|| !numWrap
		|| !tokensEl
		|| !costEl
		|| !costIdleEl
		|| !toolsWrap
		|| !toolsFirst
		|| !toolsSecond
		|| !toolsMoreWide
		|| !toolsMoreNarrow
		|| !btnAll
		|| !btnToday
		|| !emptySeg
		|| !restRow
	) {
		return
	}

	let payload: ClientPayload
	try {
		payload = JSON.parse(dataScript.textContent) as ClientPayload
	}
	catch {
		return
	}

	const { copy, data } = payload
	const days = data.days
	const todayIdx = days.length - 1
	if (todayIdx < 0)
		return

	if (numWrap.parentElement?.tagName.toLowerCase() !== 'number-flow-group') {
		const group = document.createElement('number-flow-group')
		group.className = 'contents'
		numWrap.parentElement?.insertBefore(group, numWrap)
		group.appendChild(numWrap)
	}

	const tokensFlow = upgradeToNumberFlow(tokensEl, 'pulseTokens', tokenNumberSpec(data.all.t))
	const costFlow = upgradeToNumberFlow(costEl, 'pulseCost', costNumberSpec(data.all.c))

	const slotRefs = slots.map(li => ({
		cost: li.querySelector<HTMLElement>('[data-slot-cost]'),
		dot: li.querySelector<HTMLElement>('[data-slot-dot]'),
		li,
		name: li.querySelector<HTMLElement>('[data-slot-name]'),
		pct: li.querySelector<HTMLElement>('[data-slot-pct]'),
	}))

	let pinned: null | number = null
	let hover: null | number = null

	const updateTools = (list: string[]) => {
		if (list.length === 0) {
			toolsWrap.hidden = true
			return
		}
		toolsWrap.hidden = false
		toolsFirst.textContent = list[0] ?? ''
		toolsSecond.textContent = list[1] ? ` · ${list[1]}` : ''

		if (list.length > 2) {
			toolsMoreWide.textContent = `+${list.length - 2}`
			toolsMoreWide.hidden = false
		}
		else {
			toolsMoreWide.hidden = true
		}

		if (list.length > 1) {
			toolsMoreNarrow.textContent = `+${list.length - 1}`
			toolsMoreNarrow.hidden = false
		}
		else {
			toolsMoreNarrow.hidden = true
		}
	}

	const updateModels = (slices: ModelSlice[] | null) => {
		if (!slices) {
			emptySeg.hidden = false
			for (const seg of segs)
				seg.hidden = true
			for (const ref of slotRefs)
				ref.li.hidden = true
			restRow.hidden = false
			return
		}

		emptySeg.hidden = true
		restRow.hidden = true
		let rank = 0
		for (let k = 0; k < 4; k++) {
			const slice = slices[k]
			const seg = segs[k]
			const ref = slotRefs[k]
			if (!slice) {
				if (seg)
					seg.hidden = true
				if (ref) {
					ref.li.hidden = false
					ref.li.dataset.blank = ''
					ref.li.removeAttribute('title')
				}
				continue
			}

			const cls = colorClassFor(slice.other ? 3 : rank++, slice.other)
			if (seg) {
				seg.hidden = false
				setColorClass(seg, cls)
				seg.style.flexGrow = String(Math.max(slice.p, 2.5))
			}

			if (ref) {
				const label = slice.other ? copy.other : slice.n
				ref.li.hidden = false
				delete ref.li.dataset.blank
				ref.li.title = label
				if (ref.dot)
					setColorClass(ref.dot, cls)
				if (ref.name)
					ref.name.textContent = label
				if (ref.pct)
					ref.pct.textContent = formatPercent(slice.p)
				if (ref.cost)
					ref.cost.textContent = formatCost(slice.c)
			}
		}
	}

	const render = () => {
		const activeIdx = hover ?? pinned
		btnAll.setAttribute('aria-pressed', String(pinned === null))
		btnToday.setAttribute('aria-pressed', String(pinned === todayIdx))
		btnMood?.setAttribute('aria-pressed', String(pinned === todayIdx))

		ruler.classList.toggle('is-focus', activeIdx !== null)
		for (let j = 0; j < ticks.length; j++) {
			const tick = ticks[j]!
			const dist = activeIdx === null ? 99 : Math.abs(j - activeIdx)
			tick.classList.toggle('is-active', dist === 0)
			tick.classList.toggle('is-n1', dist === 1)
			tick.classList.toggle('is-n2', dist === 2)
			tick.classList.toggle('is-near', dist <= 2)
			tick.classList.toggle('is-pinned', j === pinned && j !== todayIdx)
		}

		const setBadgeIcon = (kind: 'none' | 'rest' | 'spark') => {
			if (ctxSparkIcon)
				ctxSparkIcon.toggleAttribute('data-hidden', kind !== 'spark')
			if (ctxRestIcon)
				ctxRestIcon.toggleAttribute('data-hidden', kind !== 'rest')
		}

		if (activeIdx === null) {
			const all = data.all
			ctxPrimary.textContent = copy.overviewLabel
			ctxSep1.hidden = false
			ctxBadge.hidden = false
			setBadgeIcon('none')
			ctxBadgeText.textContent = `${all.activeDays}${copy.activeDaysSuffix}`
			delete ctxBadge.dataset.accent
			const hasRounds = all.m > 0
			ctxSep2.hidden = !hasRounds
			ctxRounds.hidden = !hasRounds
			ctxRounds.textContent = hasRounds ? `${formatRoundsCount(all.m)}${copy.roundsSuffix}` : ''

			applyFlowSpec(tokensFlow, tokenNumberSpec(all.t))
			costFlow.hidden = false
			costIdleEl.hidden = true
			applyFlowSpec(costFlow, costNumberSpec(all.c))
			updateTools(all.cl)
			ruler.setAttribute('aria-valuenow', String(todayIdx))
			ruler.setAttribute('aria-valuetext', copy.overviewLabel)
			updateModels(all.md)
			return
		}

		const day = days[activeIdx]!
		const weekday = copy.weekdays[day.w] ?? ''
		const dateText = `${formatDateShort(day.d)} ${weekday}`
		ruler.setAttribute('aria-valuenow', String(activeIdx))
		ruler.setAttribute('aria-valuetext', `${day.d} ${formatTokens(day.t)} tokens`)

		if (!day.t) {
			ctxPrimary.textContent = dateText
			ctxSep1.hidden = false
			ctxBadge.hidden = false
			setBadgeIcon('rest')
			ctxBadgeText.textContent = copy.badgeRest
			delete ctxBadge.dataset.accent
			ctxSep2.hidden = true
			ctxRounds.hidden = true
			applyFlowSpec(tokensFlow, tokenNumberSpec(0))
			costFlow.hidden = true
			costIdleEl.hidden = false
			updateTools([])
			updateModels(null)
			return
		}

		const badgeText = activeIdx === todayIdx
			? copy.badgeToday
			: activeIdx === data.peakIdx
				? copy.badgePeak
				: day.t >= data.p90
					? copy.badgeHigh
					: ''

		ctxPrimary.textContent = dateText
		if (badgeText) {
			ctxSep1.hidden = false
			ctxBadge.hidden = false
			setBadgeIcon('spark')
			ctxBadgeText.textContent = badgeText
			ctxBadge.dataset.accent = ''
		}
		else {
			ctxSep1.hidden = true
			ctxBadge.hidden = true
			setBadgeIcon('none')
			ctxBadgeText.textContent = ''
			delete ctxBadge.dataset.accent
		}

		const hasRounds = day.m > 0
		ctxSep2.hidden = !hasRounds
		ctxRounds.hidden = !hasRounds
		ctxRounds.textContent = hasRounds ? `${formatRoundsCount(day.m)}${copy.roundsSuffix}` : ''

		applyFlowSpec(tokensFlow, tokenNumberSpec(day.t))
		costFlow.hidden = false
		costIdleEl.hidden = true
		applyFlowSpec(costFlow, costNumberSpec(day.c))
		updateTools(day.cl)
		updateModels(day.md)
	}

	const indexAtClientX = (clientX: number) => {
		const rect = ruler.getBoundingClientRect()
		const innerLeft = rect.left + 3
		const innerWidth = Math.max(rect.width - 6, 1)
		const ratio = (clientX - innerLeft) / innerWidth
		return Math.min(todayIdx, Math.max(0, Math.floor(ratio * days.length)))
	}

	let down: null | { idx: number, x: number } = null

	ruler.addEventListener('pointerdown', (event) => {
		down = { idx: indexAtClientX(event.clientX), x: event.clientX }
		if (event.pointerType === 'mouse')
			ruler.setPointerCapture(event.pointerId)
		hover = down.idx
		render()
	}, { signal })

	ruler.addEventListener('pointermove', (event) => {
		if (event.pointerType !== 'mouse' && !down)
			return
		const nextIdx = indexAtClientX(event.clientX)
		if (hover === nextIdx)
			return
		hover = nextIdx
		render()
	}, { signal })

	ruler.addEventListener('pointerup', (event) => {
		if (!down)
			return
		const idx = indexAtClientX(event.clientX)
		const isTap = Math.abs(event.clientX - down.x) < 4
		pinned = isTap && pinned === idx ? null : idx
		down = null
		hover = event.pointerType === 'mouse' ? idx : null
		render()
	}, { signal })

	ruler.addEventListener('pointercancel', () => {
		down = null
		hover = null
		render()
	}, { signal })

	ruler.addEventListener('pointerleave', () => {
		if (down)
			return
		hover = null
		render()
	}, { signal })

	ruler.addEventListener('keydown', (event) => {
		const cur = pinned ?? todayIdx
		let next: number | undefined
		if (event.key === 'ArrowLeft') {
			next = cur - 1
		}
		else if (event.key === 'ArrowRight') {
			next = cur + 1
		}
		else if (event.key === 'Home') {
			next = 0
		}
		else if (event.key === 'End') {
			next = todayIdx
		}
		else if (event.key === 'Escape') {
			pinned = null
			render()
			return
		}

		if (next !== undefined) {
			event.preventDefault()
			pinned = Math.min(todayIdx, Math.max(0, next))
			render()
		}
	}, { signal })

	btnAll.addEventListener('click', () => {
		pinned = null
		hover = null
		render()
	}, { signal })

	btnToday.addEventListener('click', () => {
		pinned = todayIdx
		hover = null
		render()
	}, { signal })

	btnMood?.addEventListener('click', () => {
		pinned = pinned === todayIdx ? null : todayIdx
		hover = null
		render()
	}, { signal })
}

export function disposeCodingPulse() {
	activeController?.abort()
	activeController = null
}

export function initCodingPulse() {
	disposeCodingPulse()
	const ac = new AbortController()
	activeController = ac

	for (const root of document.querySelectorAll<HTMLElement>('[data-coding-pulse]'))
		bindInstrument(root, ac.signal)
}
