type ClassValue
	= | ClassValue[]
		| false
		| null
		| number
		| string
		| undefined
		| { [key: string]: boolean | null | undefined }

function normalizeClassValue(value: unknown): string[] {
	if (!value) {
		return []
	}

	if (typeof value === 'string' || typeof value === 'number') {
		return [String(value)]
	}

	if (Array.isArray(value)) {
		return value.flatMap(normalizeClassValue)
	}

	if (typeof value !== 'object') {
		return []
	}

	return Object.entries(value)
		.filter(([, enabled]) => Boolean(enabled))
		.map(([className]) => className)
}

export function cn(...classes: Array<ClassValue | unknown>) {
	return classes.flatMap(normalizeClassValue).join(' ')
}
