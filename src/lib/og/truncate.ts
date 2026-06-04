export function truncate(text: string, max: number) {
	const trimmed = text.trim()
	if (trimmed.length <= max)
		return trimmed
	return `${trimmed.slice(0, Math.max(0, max - 1))}…`
}
